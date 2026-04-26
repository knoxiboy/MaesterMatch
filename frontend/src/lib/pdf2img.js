let pdfjsLib = null;
let isLoading = false;
let loadPromise = null;

async function loadPdfJs() {
    if (pdfjsLib) return pdfjsLib;
    if (loadPromise) return loadPromise;

    isLoading = true;
    loadPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
        pdfjsLib = lib;
        isLoading = false;
        return lib;
    });

    return loadPromise;
}

export async function convertPdfToImages(file) {
    try {
        const lib = await loadPdfJs();
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
        
        const images = [];
        let fullText = "";

        // Process all pages
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            
            // Extract text
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item) => item.str).join(" ");
            fullText += pageText + "\n";

            // Render to image (only first 3 pages to save tokens/memory if large)
            if (i <= 3) {
                const viewport = page.getViewport({ scale: 2 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                await page.render({ canvasContext: context, viewport }).promise;
                images.push(canvas.toDataURL("image/png"));
            }
        }

        return {
            images,
            text: fullText.trim()
        };
    } catch (err) {
        console.error("PDF processing failed:", err);
        throw err;
    }
}

export async function extractTextFromPdf(file) {
    // Keep this as a helper if needed elsewhere
    const result = await convertPdfToImages(file);
    return result.text;
}

