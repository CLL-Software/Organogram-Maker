import { drawElbowLines } from "./DrawLines.js";
import { refresh } from "./InputCaller.js";
async function imageToDataURL(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Could not fetch image for CORS fix:", url);
        return null;
    }
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function exportToPNG() {
    const org = document.getElementById("org-container");
    const organagram = document.getElementById('organagram');
    const zoom = org.style.zoom;
    org.style.zoom = 1;
    organagram.style.width = "fit-content";
    organagram.style.maxWidth = "fit-content";
    drawElbowLines("org-lines-svg", "org-container", false);
    const boxes = document.querySelectorAll('.org-box');
    for (const box of boxes) {
        const img = box.querySelector('img');
        if (img && img.src.startsWith('http')) {
            const dataUrl = await imageToDataURL(img.src);
            if (dataUrl) {
                img.src = dataUrl;
            }
        }
    }

    organagram.classList.add('exporting');
    const style = window.getComputedStyle(organagram);
    organagram.style.position = 'relative';
    drawElbowLines("org-lines-svg", "org-container", true);

    const pixelRatio = window.devicePixelRatio > 1 ? 5 : 1;
    const canvas = await html2canvas(organagram, {
        backgroundColor: null,
        logging: false,
        useCORS: true,
        width: organagram.scrollWidth,
        height: organagram.scrollHeight,
        scale: pixelRatio,
        windowWidth: organagram.scrollWidth,
        windowHeight: organagram.scrollHeight
    });
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = 'organogram.png';
    link.href = pngUrl;
    link.click();
    organagram.classList.remove('exporting');
    org.style.zoom = zoom;
    organagram.style.maxWidth = "1300px";
    organagram.style.width = "1300px";
    drawElbowLines("org-lines-svg", "org-container",false);
}

window.exportToPNG = exportToPNG;