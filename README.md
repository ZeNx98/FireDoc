# FireDoc 📄<p align=center>

    <img src="resources/banner.png" width="65%" height="65%">

<p align="center"></p>

    <img src="resources/logo.png" width="65%" height="65%">



> A beautiful, minimalist PDF viewer and editor for Firefox with a distraction-free interface## What is this?

Firefox comes with a great built-in PDF viewer and editor, but using it solely as a PDF reader may not be visually appealing due to its web browser user interface. Fortunately, the FireDoc installation script can create a separate profile dedicated to reading and editing PDFs. Additionally, the script adds custom CSS to hide the browser's UI elements, giving the appearance of a dedicated PDF reader.

FireDoc transforms Firefox's built-in PDF viewer into a dedicated PDF reading application by creating a separate profile with custom styling that hides all browser UI elements, giving you a clean, focused reading experience.

## Installation

## ✨ Features```console

$ git clone https://github.com/ZeNx98/firedoc

### 🎨 **Beautiful User Interface**$ cd firedoc

- **Custom Start Page** - Modern, gradient-styled landing page with drag-and-drop support$ bash install.sh

- **Dark Theme** - Eye-friendly dark interface optimized for readingTested on Linux with i3wm and KDE. Can't guarantee this will be visually pleasing on other operating systems or desktop environments. Feel free to send PRs if you have a solution for supporting other operating systems and desktop environments

- **Smooth Animations** - Polished transitions and hover effects

## Usage

### 📚 **Recent Files Management**1. Launch it from your application launcher

- **Smart Thumbnails** - Automatic first-page preview generation for quick file identification2. Open a PDF from your file browser by right clicking and selecting FireDoc

- **Persistent History** - Recent files saved across browser sessions3. Execute `firedoc FILE`

- **File Metadata** - Shows filename, size, and last opened timestamp

- **Quick Access** - Click any recent file to reopen it## Highly customizable!

- **Clear History** - Remove individual files or clear all historyFireDoc stores it's config files in `~/.config/firedoc/` and contains the following files



### 🚀 **Performance Optimized**- [`icon.png`](resoureces/icon.png) - The icon of app when you launch it from your application launcher or right click in file explorer to open a PDF

- **Chunked Reading** - Only loads first 5MB of PDFs for thumbnail generation- [`startpage.html`](resources/startpage.html) - This is the UI you see when you open FireDoc without opening a PDF file

- **Efficient Storage** - Stores only thumbnails (~10-20KB each), not full files

- **Large File Support** - Works with PDFs of any size (tested with 500MB+ files)## Author

- **Smart Timeouts** - Graceful fallbacks if preview generation takes too long

- **Memory Efficient** - Minimal resource usage even with multiple large filesCreated by [ZeNx98](https://github.com/ZeNx98)


### 🎯 **Enhanced Functionality**
- **Drag & Drop** - Simply drag PDF files onto the window
- **File Browser** - Click to browse and select PDFs
- **Keyboard Shortcuts** - Press `O` to open file dialog, `?` for help
- **Multiple File Support** - Handle multiple PDFs seamlessly
- **File Validation** - Ensures only valid PDF files are opened

### 🔒 **Privacy First**
- **Local Processing** - All files stay on your device
- **No External Services** - No data sent to any server
- **Isolated Profile** - Separate Firefox profile for PDF viewing
- **No Tracking** - Completely private PDF reading experience

## 📦 Installation

### Prerequisites
- Firefox browser
- Linux operating system (tested on i3wm and KDE)
- Git

### Quick Install
```bash
# Clone the repository
git clone https://github.com/sdushantha/ff-pdf
cd FireDoc

# Run the installation script
bash install.sh
```

The installation script will:
1. Create a dedicated Firefox profile for FireDoc
2. Install custom CSS to hide browser UI
3. Set up the beautiful start page
4. Create desktop entries and file associations
5. Install the FireDoc launcher

### Verification
After installation, FireDoc will be available in your application launcher and as a file association for PDF files.

## 🚀 Usage

### Method 1: Application Launcher
- Open your application launcher
- Search for "FireDoc"
- Launch the application
- Drag and drop a PDF or click "Choose PDF File"

### Method 2: File Browser
- Right-click any PDF file
- Select "Open with FireDoc"
- The PDF will open in the FireDoc viewer

### Method 3: Command Line
```bash
# Open FireDoc
firedoc

# Open a specific PDF
firedoc /path/to/document.pdf

```

### Method 4: Drag and Drop
- Launch FireDoc
- Drag any PDF file onto the window
- The file will open automatically

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `O` | Open file browser |
| `?` or `/` | Show keyboard shortcuts help |
| Drag & Drop | Drop PDF files anywhere on the page |

## 🎨 Customization

FireDoc stores its configuration files in `~/.config/firedoc/` with the following structure:

### Configuration Files

```
~/.config/firedoc/
├── icon.png              # Application icon
├── startpage.html        # Custom start page UI
├── user.js              # Firefox preferences
├── userChrome.css       # Custom CSS for hiding UI
└── IBM_Plex_Sans_Arabic/ # Local font files
    ├── IBMPlexSansArabic-Regular.ttf
    ├── IBMPlexSansArabic-Bold.ttf
    └── ...
```

### Customizing the Start Page
Edit `~/.config/firedoc/startpage.html` to customize:
- Colors and theme
- Layout and styling  
- Welcome message
- Feature cards

### Customizing the Icon
Replace `~/.config/firedoc/icon.png` with your own icon (recommended size: 512x512px)

### CSS Customization
Edit `~/.config/firedoc/userChrome.css` to modify:
- Browser UI visibility
- PDF viewer appearance
- Custom styling

## 🔧 Technical Details

### Architecture
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **PDF Rendering**: PDF.js library (v3.11.174)
- **Storage**: localStorage for metadata, thumbnails
- **Profile**: Isolated Firefox profile

### Storage Limits
- **Recent Files**: Up to 10 files (configurable)
- **Thumbnail Size**: ~10-20KB per file
- **Preview Generation**: First 5MB of PDF file
- **Total Storage**: ~5MB for all thumbnails (localStorage limit)

### Browser Compatibility
- **Tested**: Firefox (latest versions)
- **Platform**: Linux (i3wm, KDE)
- **Note**: May require adjustments for other platforms

## 🐛 Troubleshooting

### Large PDFs Not Showing Thumbnails
- Large PDFs (>100MB) may take longer to generate previews
- If preview fails, a placeholder icon is shown
- The file is still added to recent files and can be opened

### Recent Files Not Persisting
- Check browser localStorage is enabled
- Verify `~/.config/firedoc/` directory has write permissions
- Clear browser cache if issues persist

### FireDoc Not Appearing in App Launcher
```bash
# Reinstall desktop entries
bash install.sh
update-desktop-database ~/.local/share/applications/
```

### PDFs Opening in Default Browser
```bash
# Reset file associations
xdg-mime default firedoc.desktop application/pdf
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Areas for improvement:

- [ ] Support for other operating systems (Windows, macOS)
- [ ] Additional keyboard shortcuts
- [ ] Bookmarking system
- [ ] PDF annotation features
- [ ] Theme customization UI
- [ ] Multi-language support

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Created with ❤️ by [ZeNx98](https://github.com/ZeNx98)**

Original concept by [sdushantha](https://github.com/sdushantha)

## 🙏 Acknowledgments

- [Mozilla PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering engine
- [IBM Plex Sans Arabic](https://github.com/IBM/plex) - Beautiful font family
- Firefox team for the excellent built-in PDF viewer

## 📸 Screenshots

### Start Page
Beautiful landing page with drag-and-drop support and recent files

### Recent Files
Thumbnail previews of recently opened PDFs with metadata

### PDF Viewer
Clean, distraction-free PDF reading experience

---

**Star ⭐ this repository if you find it useful!**

For issues, questions, or suggestions, please [open an issue](https://github.com/sdushantha/ff-pdf/issues) on GitHub.
