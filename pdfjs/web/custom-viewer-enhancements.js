// FireDoc Custom PDF.js Viewer Enhancements
// Additional functionality and UX improvements

(function() {
  'use strict';

  // Wait for PDF.js to fully load
  document.addEventListener('DOMContentLoaded', function() {
    
    // Add Home button functionality
    const homeButton = document.getElementById('homeButton');
    if (homeButton) {
      homeButton.addEventListener('click', function() {
        // In Electron, load the startpage
        if (window.location.protocol === 'file:') {
          // Go up from pdfjs/web/ to project root and open homepage.html
          window.location.href = '../../homepage.html';
        } else {
          // In browser, go to the root
          window.location.href = '/homepage.html';
        }
      });
      console.log('🏠 Home button initialized');
    }
 
    // Enhanced keyboard shortcuts
    document.addEventListener('keydown', function(e) {
      // Ctrl/Cmd + 0: Fit to page width
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        const scaleSelect = document.getElementById('scaleSelect');
        if (scaleSelect) {
          scaleSelect.value = 'page-width';
          scaleSelect.dispatchEvent(new Event('change'));
        }
      }

      // Ctrl/Cmd + 1: Actual size
      if ((e.ctrlKey || e.metaKey) && e.key === '1') {
        e.preventDefault();
        const scaleSelect = document.getElementById('scaleSelect');
        if (scaleSelect) {
          scaleSelect.value = 'page-actual';
          scaleSelect.dispatchEvent(new Event('change'));
        }
      }

      // Ctrl/Cmd + 2: Fit to page
      if ((e.ctrlKey || e.metaKey) && e.key === '2') {
        e.preventDefault();
        const scaleSelect = document.getElementById('scaleSelect');
        if (scaleSelect) {
          scaleSelect.value = 'page-fit';
          scaleSelect.dispatchEvent(new Event('change'));
        }
      }

      // Home key: Go to first page
      if (e.key === 'Home' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        const pageNumber = document.getElementById('pageNumber');
        if (pageNumber) {
          pageNumber.value = '1';
          pageNumber.dispatchEvent(new Event('change'));
        }
      }

      // End key: Go to last page
      if (e.key === 'End' && !e.shiftKey && !e.ctrlKey) {
        e.preventDefault();
        const numPages = document.getElementById('numPages');
        const pageNumber = document.getElementById('pageNumber');
        if (pageNumber && numPages) {
          pageNumber.value = numPages.textContent;
          pageNumber.dispatchEvent(new Event('change'));
        }
      }

      // F key: Toggle find bar
      if (e.key === 'f' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
          return; // Don't trigger if typing in input
        }
        e.preventDefault();
        const findButton = document.getElementById('viewFindButton');
        if (findButton) {
          findButton.click();
        }
      }

      // ESC key: Close find bar and sidebar
      if (e.key === 'Escape') {
        const findbar = document.getElementById('findbar');
        if (findbar && !findbar.hidden) {
          // Toggle using the same button that opens it
          const findButton = document.getElementById('viewFindButton');
          if (findButton) findButton.click();
        }
      }
    });

    // Add page transition animations
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(function(node) {
            if (node.classList && node.classList.contains('page')) {
              node.style.animation = 'pageLoad 0.3s ease';
            }
          });
        }
      });
    });

    const viewer = document.getElementById('viewer');
    if (viewer) {
      observer.observe(viewer, { childList: true });
    }

    // Add tooltip for zoom percentage
    const scaleSelect = document.getElementById('scaleSelect');
    if (scaleSelect) {
      scaleSelect.addEventListener('change', function() {
        const value = this.value;
        let tooltip = '';
        switch(value) {
          case 'auto': tooltip = 'Automatic Zoom'; break;
          case 'page-actual': tooltip = '100% (Actual Size)'; break;
          case 'page-fit': tooltip = 'Fit to Page'; break;
          case 'page-width': tooltip = 'Fit to Width'; break;
          default: tooltip = value + ' Zoom';
        }
        this.title = tooltip;
      });
    }

    // Enhanced page number input
    const pageNumber = document.getElementById('pageNumber');
    if (pageNumber) {
      // Select all text when focused for easy input
      pageNumber.addEventListener('focus', function() {
        this.select();
      });

      // Add visual feedback for invalid page numbers
      pageNumber.addEventListener('change', function() {
        const numPages = document.getElementById('numPages');
        if (numPages) {
          const maxPages = parseInt(numPages.textContent);
          const currentPage = parseInt(this.value);
          
          if (currentPage < 1 || currentPage > maxPages) {
            this.style.borderColor = '#f04747';
            this.style.background = 'rgba(240, 71, 71, 0.1)';
            setTimeout(() => {
              this.style.borderColor = '';
              this.style.background = '';
            }, 1000);
          }
        }
      });
    }

    // Add loading state enhancement
    const loadingBar = document.getElementById('loadingBar');
    if (loadingBar) {
      const style = document.createElement('style');
      style.textContent = `
        #loadingBar.indeterminate .progress {
          animation: progressIndeterminate 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes progressIndeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `;
      document.head.appendChild(style);
    }

    // Double-click on page to toggle fit modes
    const viewerContainer = document.getElementById('viewerContainer');
    if (viewerContainer) {
      let lastClickTime = 0;
      viewerContainer.addEventListener('click', function(e) {
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;
        
        if (timeDiff < 300 && timeDiff > 0) { // Double click detected
          const scaleSelect = document.getElementById('scaleSelect');
          if (scaleSelect) {
            const currentValue = scaleSelect.value;
            // Toggle between page-width and page-fit
            if (currentValue === 'page-width') {
              scaleSelect.value = 'page-fit';
            } else {
              scaleSelect.value = 'page-width';
            }
            scaleSelect.dispatchEvent(new Event('change'));
          }
        }
        lastClickTime = currentTime;
      });
    }

    // Add current page highlight in sidebar thumbnails
    const thumbnailView = document.getElementById('thumbnailView');
    if (thumbnailView) {
      const highlightCurrentThumbnail = function() {
        const pageNumber = document.getElementById('pageNumber');
        if (pageNumber) {
          const currentPage = parseInt(pageNumber.value);
          const thumbnails = thumbnailView.querySelectorAll('.thumbnail');
          thumbnails.forEach((thumb, index) => {
            if (index + 1 === currentPage) {
              thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          });
        }
      };

      // Update highlight when page changes
      if (pageNumber) {
        const pageObserver = new MutationObserver(highlightCurrentThumbnail);
        pageObserver.observe(pageNumber, { attributes: true, attributeFilter: ['value'] });
      }
    }

    // Add progress indicator for large PDFs
    let totalPages = 0;
    const numPagesElement = document.getElementById('numPages');
    if (numPagesElement) {
      const numPagesObserver = new MutationObserver(function(mutations) {
        const numPages = parseInt(numPagesElement.textContent);
        if (numPages > 0 && totalPages !== numPages) {
          totalPages = numPages;
          console.log(`📄 FireDoc: Loaded PDF with ${totalPages} pages`);
          
          // Show notification for large PDFs
          if (totalPages > 100) {
            showNotification(`Large PDF loaded: ${totalPages} pages`);
          }
        }
      });
      numPagesObserver.observe(numPagesElement, { childList: true, characterData: true, subtree: true });
    }

    // Notification system
    function showNotification(message, duration = 3000) {
      const notification = document.createElement('div');
      notification.textContent = message;
      notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #5865f2 0%, #4752c4 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(88, 101, 242, 0.4);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        font-weight: 500;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease ${duration - 300}ms forwards;
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideInRight {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          to {
            opacity: 0;
            transform: translateX(400px);
          }
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
        style.remove();
      }, duration);
    }

    // Let PDF.js handle mouse wheel zoom with its original implementation
    // PDF.js has built-in Ctrl+wheel zoom that works properly
    // We just ensure normal scrolling works when Ctrl is not held
    if (viewerContainer) {
      // No custom zoom handler needed - PDF.js handles it natively
      console.log('Using PDF.js native zoom controls');
    }

    // Add document title from PDF metadata
    window.addEventListener('documentloaded', function() {
      setTimeout(() => {
        const title = document.title;
        if (title && title !== 'PDF.js viewer') {
          console.log(`📄 FireDoc: "${title}"`);
        }
      }, 500);
    });

    // Enhanced print button
    const printButton = document.getElementById('printButton');
    if (printButton) {
      printButton.addEventListener('click', function() {
        showNotification('Preparing document for printing...');
      });
    }

    // Enhanced download button
    const downloadButton = document.getElementById('downloadButton');
    if (downloadButton) {
      downloadButton.addEventListener('click', function() {
        showNotification('Download started...');
      });
    }

    console.log('🔥 FireDoc: Enhanced PDF viewer loaded successfully');
    console.log('📚 Custom keyboard shortcuts:');
    console.log('  • Ctrl/Cmd + 0: Fit to width');
    console.log('  • Ctrl/Cmd + 1: Actual size');
    console.log('  • Ctrl/Cmd + 2: Fit to page');
    console.log('  • Home: First page');
    console.log('  • End: Last page');
    console.log('  • F: Toggle search');
    console.log('  • Double-click: Toggle fit modes');
    console.log('  • (Standard PDF.js controls also available)');
  });

})();
