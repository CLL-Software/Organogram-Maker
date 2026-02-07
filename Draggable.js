import { drawElbowLines } from './DrawLines.js';
// Function to initialize dragging functionality
export function initializeDragging() {
    const dragItems = document.querySelectorAll('.org-box');
    let activeItem = null;
    let offsetX = 0, offsetY = 0;

    dragItems.forEach(dragItem => {
        dragItem.style.cursor = "grab";

        dragItem.addEventListener("mousedown", (e) => {
            activeItem = dragItem;
            const rect = activeItem.getBoundingClientRect();
            offsetX = e.clientX;
            offsetY = e.clientY;
            activeItem.style.cursor = "grabbing";
            drawElbowLines();
        });
    });

    document.addEventListener("mousemove", (e) => {
        if (!activeItem) return;
        activeItem.style.left = (e.clientX - offsetX) + "px";
        activeItem.style.top = (e.clientY - offsetY) + "px";
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