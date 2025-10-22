const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

app.commandLine.appendSwitch('allow-file-access-from-files');

let mainWindow;
let pendingOpenPath = null;

function isPdfArg(arg) {
  if (!arg) return false;
  // Support file URLs and plain paths
  try {
    if (arg.startsWith('file://')) {
      const p = url.fileURLToPath(arg);
      return p.toLowerCase().endsWith('.pdf');
    }
  } catch {}
  return arg.toLowerCase().endsWith('.pdf');
}

function normalizeToFileUrl(maybePath) {
  try {
    if (!maybePath) return null;
    if (maybePath.startsWith('file://')) return maybePath;
    const abs = path.resolve(maybePath);
    if (!fs.existsSync(abs)) return null;
    return url.pathToFileURL(abs).toString();
  } catch {
    return null;
  }
}

function findPdfFromArgv(argv) {
  // On Linux, the first arg is the executable; subsequent args may include the file path
  if (!Array.isArray(argv)) return null;
  for (const a of argv.slice(1)) {
    if (isPdfArg(a)) return a;
  }
  return null;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (typeof mainWindow.setMenuBarVisibility === 'function') {
    mainWindow.setMenuBarVisibility(false);
  }

  const homepagePath = path.join(__dirname, 'homepage.html');
  const homepageUrl = url.pathToFileURL(homepagePath).toString();
  mainWindow.loadURL(homepageUrl);

  // If there was a file passed before window was ready, open it now
  if (pendingOpenPath) {
    openPdfInViewer(pendingOpenPath);
    pendingOpenPath = null;
  }
}

function openPdfInViewer(inputPathOrUrl) {
  try {
    const viewerPath = path.join(__dirname, 'pdfjs', 'web', 'viewer.html');
    const viewerUrl = url.pathToFileURL(viewerPath).toString();

    const fileUrl = inputPathOrUrl.startsWith('file://')
      ? inputPathOrUrl
      : normalizeToFileUrl(inputPathOrUrl);
    if (!fileUrl) return;

    if (!mainWindow) {
      // Defer until window exists
      pendingOpenPath = fileUrl;
      return;
    }
    mainWindow.loadURL(`${viewerUrl}?file=${encodeURIComponent(fileUrl)}`);
  } catch (e) {
    console.error('Failed to open PDF in viewer:', e);
  }
}

// Enforce single instance to route subsequent open requests
const gotLock = app.requestSingleInstanceLock();

if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, argv, _cwd) => {
    // Someone tried to run a second instance, we should focus our window and open the file if provided
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    const arg = findPdfFromArgv(argv);
    if (arg) openPdfInViewer(arg);
  });

  // Capture file open via CLI on Linux/Windows at startup
  const startupArg = findPdfFromArgv(process.argv);
  if (startupArg) pendingOpenPath = normalizeToFileUrl(startupArg) || startupArg;

  // macOS will send open-file events separately; still create window normally
  app.whenReady().then(() => {
    Menu.setApplicationMenu(null);
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('select-pdf', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select a PDF',
    properties: ['openFile'],
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }]
  });
  if (canceled || !filePaths || filePaths.length === 0) return null;
  return filePaths[0];
});

ipcMain.on('open-pdf', (_event, filePath) => {
  if (!filePath) return;
  openPdfInViewer(filePath);
});

// macOS specific: open-file event when opening associated documents
app.on('open-file', (event, filePath) => {
  event.preventDefault();
  if (!filePath) return;
  openPdfInViewer(filePath);
});
