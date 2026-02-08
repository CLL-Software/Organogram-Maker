function getContainer(divID) {
    return document.getElementById(divID) || document.body;
}

export function drawElbowLines(svgID, divID, png=false) {
    const container = getContainer(divID);

    const oldSvg = document.getElementById(svgID);
    let nextSibling = null;
    let parentNode = container;

    if (oldSvg) {
        nextSibling = oldSvg.nextSibling;
        parentNode = oldSvg.parentNode;
        oldSvg.remove();
    }

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = svgID;
    svg.style.position = "absolute";
    svg.style.pointerEvents = "none";

    const fullWidth = container.scrollWidth;
    const fullHeight = container.scrollHeight;

    svg.setAttribute("width", fullWidth);
    svg.setAttribute("height", fullHeight);

    if (nextSibling) {
        parentNode.insertBefore(svg, nextSibling);
    } else {
        parentNode.appendChild(svg);
    }

    const boxes = document.getElementById(divID).querySelectorAll('.org-box');
    const containerRect = container.getBoundingClientRect();

    boxes.forEach(childEl => {
        const parentId = childEl.getAttribute('value');
        if (!parentId) return;

        const parentEl = document.getElementById(parentId);
        if (!parentEl) return;

        const inputType = childEl.getAttribute('lineInput');
        const outputType = parentEl.getAttribute('lineOutput');
        const cRect = childEl.getBoundingClientRect();
        const pRect = parentEl.getBoundingClientRect();
        let startX = (pRect.left + pRect.width / 2) - containerRect.left;
        let startY = ((pRect.top + pRect.bottom) * 0.5) - containerRect.top;

        let endX = (cRect.left + cRect.width / 2) - containerRect.left;
        let endY = ((cRect.top + cRect.bottom) * 0.5) - containerRect.top;

        const organagram = document.getElementById(divID);
        const transform = getComputedStyle(organagram).transform;
        const isFlippedX = transform.includes('matrix(-1, 0, 0, 1') || transform.includes('scaleX(-1)');
        const isFlippedY = transform.includes('matrix(1, 0, 0, -1') || transform.includes('scaleY(-1)');

        if (png == true) { }
        else if (isFlippedX) {
            startX = fullWidth-startX;
            endX = fullWidth - endX;
        }
        else if (isFlippedY) {
            startY = fullHeight-startY;
            endY = fullHeight-endY;
        }


        let pathData = "";
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