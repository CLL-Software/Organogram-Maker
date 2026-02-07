import { drawElbowLines } from './DrawLines.js';
// Function to initialize dragging functionality
export function initializeDragging() {
    const dragItems = document.querySelectorAll('.org-box');

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
            drawElbowLines();
        });
    });

    document.addEventListener("mousemove", (e) => {
        if (!activeItem) return;
        let deltaX = e.clientX - startMouseX;
        let deltaY = e.clientY - startMouseY;
        const organagram = document.getElementById('org-container');
        const transform = getComputedStyle(organagram).transform;
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

        drawElbowLines();
    });
    document.addEventListener("mouseup", () => {
        if (!activeItem) return;
        activeItem.style.cursor = "grab";
        activeItem = null;
        drawElbowLines();
    });
}
initializeDragging();