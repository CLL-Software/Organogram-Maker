// Exporter.js

import { refresh } from "./InputCaller.js";

// --- HELPER: Fetch and Convert Image to Base64 ---
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

// --- NEW HELPER: Small delay to allow DOM to update ---
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function exportToPNG() {
    // --- 1. IMAGE PROCESSING (CORS Fix) ---
    const boxes = document.querySelectorAll('.org-box');
    for (const box of boxes) {
        const img = box.querySelector('img');
        if (img && img.src.startsWith('http')) {
            const dataUrl = await imageToDataURL(img.src);
            if (dataUrl) {
                img.src = dataUrl; // Replace external URL with Base64 data
            }
        }
    }

    // --- ADD THIS DELAY ---
    // Give the browser 500ms to repaint the images after setting src
    await wait(500);

    // --- 2. EXPORT LOGIC ---
    const organagram = document.getElementById('organagram');
    // Ensure parent is relative and has dimensions
    organagram.style.position = 'relative';

    // Apply temporary styling directly to children if necessary, 
    // rather than transforming the parent div.
    const container = document.getElementById("org-container");
    const svgLines = document.getElementById("org-lines-svg");

    // --- 3. RENDER ---
    const pixelRatio = window.devicePixelRatio > 1 ? 5 : 1;
    const canvas = await html2canvas(organagram, {
        backgroundColor: "#fff",
        logging: false,
        useCORS: true,
        // Ensure the capture captures the full scrollable area
        width: organagram.scrollWidth,
        height: organagram.scrollHeight,
        scale: pixelRatio,
        // This tells html2canvas to render based on the DOM structure,
        // not just the visible screen.
        windowWidth: organagram.scrollWidth,
        windowHeight: organagram.scrollHeight
    });



    // --- 5. DOWNLOAD ---
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement('a');
    link.download = 'organogram.png';
    link.href = pngUrl;
    link.click();
}

window.exportToPNG = exportToPNG;