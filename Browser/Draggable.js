import { drawElbowLines } from './DrawLines.js';
export function initializeDragging(svgID, divID) {
    const div = document.getElementById(divID);
    const scale = div.style.zoom;
    const dragItems = div.querySelectorAll('.org-box');

    let activeItem = null;
    let startMouseX = 0, startMouseY = 0;
    let initialElementX = 0, initialElementY = 0;

    dragItems.forEach(dragItem => {
        dragItem.addEventListener("mousedown", (e) => {
            activeItem = dragItem;
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            initialElementX = parseInt(activeItem.style.left) || 0;
            initialElementY = parseInt(activeItem.style.top) || 0;

            activeItem.style.cursor = "grabbing";
            drawElbowLines(svgID, divID);
        });
    });

    document.addEventListener("mousemove", (e) => {
        if (!activeItem) return;
        let deltaX = e.clientX - startMouseX;
        let deltaY = e.clientY - startMouseY;
        deltaX = deltaX * (1 / scale);
        deltaY = deltaY * (1 / scale);
        const transform = getComputedStyle(activeItem).transform;
        const isFlippedX = transform.includes('matrix(-1, 0, 0, 1') || transform.includes('scaleX(-1)');
        const isFlippedY = transform.includes('matrix(1, 0, 0, -1') || transform.includes('scaleY(-1)');

        if (isFlippedX) {
            deltaX = -deltaX;
        }
        if (isFlippedY) {
            deltaY = -deltaY;
        }

        activeItem.style.left = (initialElementX + deltaX) + "px";
        activeItem.style.top = (initialElementY + deltaY) + "px";

        drawElbowLines(svgID, divID);
    });
    document.addEventListener("mouseup", () => {
        if (!activeItem) return;
        activeItem.style.cursor = "grab";
        activeItem = null;
        drawElbowLines(svgID, divID);
    });
}
window.initializeDragging = initializeDragging;
