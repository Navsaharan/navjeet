const url = 'pdf/leader-phase-ii (1).pdf'; // Path to your PDF file

pdfjsLib.getDocument(url).promise.then(pdfDoc => {
    pdfDoc.getPage(1).then(page => {
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.getElementById('pdf-render');
        const ctx = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        page.render(renderContext);
    });
});

// Disable right-click and keyboard shortcuts
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

document.addEventListener('keydown', function(e) {
    if ((e.ctrlKey && e.key === 's') || (e.ctrlKey && e.key === 'S')) {
        e.preventDefault();
    }
    if ((e.ctrlKey && e.key === 'p') || (e.ctrlKey && e.key === 'P')) {
        e.preventDefault();
    }
});
