# FireDoc — Minimalist PDF Viewer (Electron + pdf.js)

FireDoc is a clean, fast PDF viewer for desktop built with Electron, using the embedded pdf.js viewer (`pdfjs/web/viewer.html`).

On launch, it opens a polished homepage where you can pick a PDF (native dialog, drag & drop, or from a recent list). You can also open PDFs directly from your file manager via “Open With FireDoc” or by double‑clicking if set as default.

## Features

- Open local PDFs instantly with the bundled pdf.js viewer
- Drag & drop support and native file picker
- Recent files list with lightweight thumbnails (no files stored — just tiny previews)
- Open via command line: `firedoc <file.pdf>`
- Single‑instance routing: subsequent opens focus the app and load the file
- System integration on Linux: desktop entry + file association for `application/pdf`
- Privacy‑friendly: everything stays local; nothing uploaded

## Prerequisites

- Node.js 18+ (recommended)

## Install and run (dev)

```sh
# From the project root
npm install
npm start
```

This opens an Electron window with the homepage. Use the “Choose PDF File” button or drag & drop a PDF to open it.

## Build packages (Linux)

We use electron-builder and ship Linux targets: deb, AppImage, and pacman (Arch).

```sh
# Build all Linux targets
npm run dist:linux

# Or build a specific target
npm run dist:deb       # Debian/Ubuntu .deb
npm run dist:appimage  # AppImage
npm run dist:arch      # Arch Linux .pacman
```

Artifacts will appear in the `dist/` folder, named like `FireDoc-2.0.0-x64.deb`, `FireDoc-2.0.0-x64.AppImage`, or `FireDoc-2.0.0-x64.pacman`.

## Open With on Linux and default app

FireDoc now accepts a PDF path from the command line and as a second instance argument. That means you can:

- Run `firedoc /path/to/file.pdf` and it will open directly
- Use your file manager’s “Open With → FireDoc” for PDFs
- Use `xdg-open file.pdf` if FireDoc is set as the handler

When installing a package built via electron-builder (`.deb`, `.AppImage` with desktop integration, or `.pacman`), a desktop entry with `MimeType=application/pdf;` is generated automatically from the `build.fileAssociations` config.

If your desktop environment didn’t pick it up yet, update the database:

```sh
update-desktop-database ~/.local/share/applications || true
```

Optionally set FireDoc as default for PDFs:

```sh
xdg-mime default firedoc.desktop application/pdf
```

### Manual desktop entry (no package manager)

If you’re using the AppImage directly, you can register FireDoc as a handler manually using the provided `firedoc.desktop` in this repo.

```sh
# Copy desktop file to your local applications dir
install -D -m 0644 ./firedoc.desktop "$HOME/.local/share/applications/firedoc.desktop"

# Refresh desktop database and set as default for PDFs
update-desktop-database "$HOME/.local/share/applications" || true
xdg-mime default firedoc.desktop application/pdf

# Verify
xdg-mime query default application/pdf
```

Make sure the `Exec=` path inside `firedoc.desktop` points to your AppImage location (defaults to `dist/FireDoc-2.0.0-x86_64.AppImage`). Update it if you move/rename the file.

## Open a different PDF

There are a few options:

- Use the homepage “Choose PDF File” button (native dialog)
- Drag and drop a PDF onto the homepage
- Use the viewer UI: Click the folder icon in the viewer toolbar to open a file picker and select a local PDF

## Notes

- The app sets `allow-file-access-from-files` and disables `webSecurity` so the viewer (loaded with `file://`) can fetch local assets and PDFs. For production, consider serving `pdfjs/web/` via a local HTTP server or a custom Electron protocol for stricter security.
- The pdf.js assets are already present under `pdfjs/` in this repository.

## Project structure

- `main.js` — Electron main process (starts at `homepage.html`, then navigates to the pdf.js viewer). Supports command‑line file open and single‑instance routing.
- `preload.js` — Exposes `electronAPI.selectPDF()` and `electronAPI.openPDF()` to the homepage
- `pdfjs/` — pdf.js distribution including `web/viewer.html`
- `homepage.html` — Start screen to pick a PDF (drag & drop, recent files)
- `firedoc.desktop` — Desktop entry template for Linux Open‑With and default app setup

## Project structure

- `main.js` — Electron main process (starts at `homepage.html`, then navigates to the pdf.js viewer). Uses `icon.png` as the app icon.
- `preload.js` — Exposes `electronAPI.selectPDF()` and `electronAPI.openPDF()` to the homepage
- `pdfjs/` — pdf.js distribution including `web/viewer.html`
- `homepage.html` — Start screen to pick a PDF

## Credits

FireDoc is created by [ZeNx98](https://github.com/ZeNx98).

- Email: zenx98x@gmail.com
- GitHub: https://github.com/ZeNx98/FireDoc

## Troubleshooting

- Blank screen or errors about CORS/file access: ensure you're launching via `npm start` (Electron), not directly double-clicking `viewer.html`.
- If your PDF path has spaces, use a `file://` URL or encode it when setting the `file` query param.

If you encounter AppImage packaging errors about file associations, ensure your `package.json` has:

```jsonc
{
	"build": {
		"fileAssociations": [
			{ "ext": "pdf", "mimeType": "application/pdf", "name": "PDF document", "role": "Viewer" }
		]
	}
}
```
