// DrawLines.js

// Helper function to get the container
function getContainer() {
    return document.getElementById("organagram") || document.body;
}

export function drawElbowLines() {
    const container = getContainer();

    // 1. Check if an old SVG exists
    const oldSvg = document.getElementById("org-lines-svg");
    let nextSibling = null;
    let parentNode = container;

    if (oldSvg) {
        nextSibling = oldSvg.nextSibling;
        parentNode = oldSvg.parentNode;
        oldSvg.remove();
    }

    // 2. Create the new SVG container
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = "org-lines-svg";
    svg.style.position = "absolute";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "1";

    // --- KEY CHANGE: Use container dimensions ---
    const containerRect = container.getBoundingClientRect();
    const fullWidth = container.scrollWidth;
    const fullHeight = container.scrollHeight;

    svg.setAttribute("width", fullWidth);
    svg.setAttribute("height", fullHeight);

    if (nextSibling) {
        parentNode.insertBefore(svg, nextSibling);
    } else {
        parentNode.appendChild(svg);
    }

    // 3. Draw the Elbow Lines
    const boxes = document.querySelectorAll('.org-box');

    boxes.forEach(childEl => {
        const parentId = childEl.getAttribute('value');
        if (!parentId) return;

        const parentEl = document.getElementById(parentId);
        if (!parentEl) return;

        const inputType = childEl.getAttribute('lineInput');
        const outputType = parentEl.getAttribute('lineOutput');

        const cRect = childEl.getBoundingClientRect();
        const pRect = parentEl.getBoundingClientRect();

        // Coordinates relative to the container origin
        const startX = (pRect.left + pRect.width / 2) - containerRect.left;
        const startY = ((pRect.top + pRect.bottom) * 0.5) - containerRect.top;

        const endX = (cRect.left + cRect.width / 2) - containerRect.left;
        const endY = ((cRect.top + cRect.bottom) * 0.5) - containerRect.top;


        let pathData = "";

        // ... (Path logic remains the same, it now uses container-relative coordinates) ...
        if (outputType === "bottom" && inputType === "top") {
            const midY = startY + (endY - startY) / 2;
            pathData = `M ${startX} ${startY} V ${midY} H ${endX} V ${endY}`;
        }
        else if (outputType === "bottom" && inputType === "side") {
            pathData = `M ${startX} ${startY} V ${endY} H ${endX}`;
        }
        else if (outputType === "side" && inputType === "side") {
            const midX = startX + (endX - startX) / 2;
            pathData = `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`;
        }
        else if (outputType === "side" && inputType === "top") {
            pathData = `M ${startX} ${startY} H ${endX} V ${endY}`;
        }
        else if (outputType === "side" && inputType === "direct") {
            pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
        }
        else if (outputType === "bottom" && inputType === "direct") {
            pathData = `M ${startX} ${startY} L ${endX} ${endY}`;
        }

        if (pathData) {
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathData);
            path.setAttribute("stroke", "#ccc");
            path.setAttribute("stroke-width", "2");
            path.setAttribute("fill", "none");
            svg.appendChild(path);
        }
    });
}
window.drawElbowLines = drawElbowLines;
