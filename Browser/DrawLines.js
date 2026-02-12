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

        let bendXstart = startX;
        let bendYstart = pRect.bottom - containerRect.top;
        let bendXend = endX;
        let bendYend = cRect.top - containerRect.top;

        const organagram = document.getElementById(divID);
        const transform = getComputedStyle(organagram).transform;
        const isFlippedX = transform.includes('matrix(-1, 0, 0, 1') || transform.includes('scaleX(-1)');
        const isFlippedY = transform.includes('matrix(1, 0, 0, -1') || transform.includes('scaleY(-1)');

        let parentCol = greyColor(parentEl.style.borderLeftColor);
        let childCol = greyColor(childEl.style.borderLeftColor);

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
            const midY = bendYstart + (bendYend - bendYstart) / 2;
            pathData = `M ${startX} ${startY} V ${midY} H ${endX} V ${endY}`;
        }
        else if (outputType === "bottom" && inputType === "side") {
            pathData = `M ${startX} ${startY} V ${endY} H ${endX}`;
        }
        else if (outputType === "side" && inputType === "side") {
            const midX = bendXstart + (bendXend - bendXstart) / 2;
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
            const SVG_NS = "http://www.w3.org/2000/svg";

            const path = document.createElementNS(SVG_NS, "path");
            path.setAttribute("d", pathData);

            // Ensure <defs> exists
            let defs = svg.querySelector("defs");
            if (!defs) {
                defs = document.createElementNS(SVG_NS, "defs");
                svg.appendChild(defs);
            }

            // Create unique gradient ID
            const gradientId = "grad-" + Math.random().toString(36).substr(2, 9);

            const gradient = document.createElementNS(SVG_NS, "linearGradient");
            gradient.setAttribute("id", gradientId);

            // Make gradient follow actual path direction
            gradient.setAttribute("gradientUnits", "userSpaceOnUse");
            gradient.setAttribute("x1", startX);
            gradient.setAttribute("y1", startY);
            gradient.setAttribute("x2", endX);
            gradient.setAttribute("y2", endY);

            const stopStart = document.createElementNS(SVG_NS, "stop");
            stopStart.setAttribute("offset", "40%");
            stopStart.setAttribute("stop-color", childCol);

            const stopEnd = document.createElementNS(SVG_NS, "stop");
            stopEnd.setAttribute("offset", "60%");
            stopEnd.setAttribute("stop-color", parentCol);

            gradient.appendChild(stopStart);
            gradient.appendChild(stopEnd);
            defs.appendChild(gradient);

            // Apply gradient stroke
            path.setAttribute("stroke", `url(#${gradientId})`);
            path.setAttribute("stroke-width", "3");
            path.setAttribute("fill", "none");

            svg.appendChild(path);
        }

    });
}
window.drawElbowLines = drawElbowLines;









function greyColor(color) {
    let r, g, b;

    if (color.startsWith('#')) {
        color = color.replace('#', '');
        if (color.length === 3) {
            color = color.split('').map(c => c + c).join('');
        }

        r = parseInt(color.substring(0, 2), 16);
        g = parseInt(color.substring(2, 4), 16);
        b = parseInt(color.substring(4, 6), 16);

    } else if (color.startsWith('rgb')) {
        const regex = /rgb(a?)\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d\.]+))?\)/;
        const match = color.match(regex);

        if (match) {
            r = parseInt(match[2]);
            g = parseInt(match[3]);
            b = parseInt(match[4]);
        } else {
            throw new Error('Invalid RGB or RGBA color format');
        }

    } else {
        throw new Error('Invalid color format: Must be hex, rgb, or rgba');
    }

    const grey = 204;
    const factor = 0.7;

    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);

    r = Math.round((r + grey) / 2);
    g = Math.round((g + grey) / 2);
    b = Math.round((b + grey) / 2);

    return `rgb(${r}, ${g}, ${b}, ${factor})`;
}
