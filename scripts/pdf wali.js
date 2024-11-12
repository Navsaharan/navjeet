import * as pdfjsLib from './pdf.mjs';

const url = 'assets/pdfs/your-document.pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.mjs';

let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.0,
    canvas = document.getElementById('pdf-canvas'),
    ctx = canvas.getContext('2d');

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(page => {
        const viewport = page.getViewport({ scale: scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        const renderTask = page.render(renderContext);
        renderTask.promise.then(() => {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
    document.getElementById('page-num').textContent = num;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
});

document.getElementById('next-page').addEventListener('click', () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
});

document.getElementById('zoom-in').addEventListener('click', () => {
    scale += 0.25;
    queueRenderPage(pageNum);
});

document.getElementById('zoom-out').addEventListener('click', () => {
    scale = Math.max(scale - 0.25, 0.25);
    queueRenderPage(pageNum);
});

document.getElementById('fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
});

document.getElementById('highlight').addEventListener('click', () => {
    canvas.style.cursor = 'crosshair';
    canvas.addEventListener('mousedown', startHighlight, false);
});

function startHighlight(e) {
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = 'yellow';
    canvas.addEventListener('mousemove', drawHighlight, false);
    canvas.addEventListener('mouseup', stopHighlight, false);
}

function drawHighlight(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.fillRect(x, y, 10, 10);
}

function stopHighlight() {
    canvas.removeEventListener('mousemove', drawHighlight, false);
    canvas.removeEventListener('mouseup', stopHighlight, false);
    canvas.style.cursor = 'default';
}

document.getElementById('draw').addEventListener('click', () => {
    canvas.style.cursor = 'crosshair';
    canvas.addEventListener('mousedown', startDrawing, false);
});

function startDrawing(e) {
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    canvas.addEventListener('mousemove', draw, false);
    canvas.addEventListener('mouseup', stopDrawing, false);
}

function draw(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDrawing() {
    ctx.beginPath();
    canvas.removeEventListener('mousemove', draw, false);
    canvas.removeEventListener('mouseup', stopDrawing, false);
    canvas.style.cursor = 'default';
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;
    document.getElementById('page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
});
