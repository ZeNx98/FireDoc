const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
	selectPDF: () => ipcRenderer.invoke('select-pdf'),
	openPDF: (filePath) => ipcRenderer.send('open-pdf', filePath),
	readPDF: (filePath) => {
		try {
			const data = fs.readFileSync(filePath);
			const name = path.basename(filePath);
			const size = data.length;
			const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
			return { name, size, arrayBuffer };
		} catch (e) {
			return { error: String(e && e.message ? e.message : e) };
		}
	}
});
