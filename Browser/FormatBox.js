export function formatBox(boxData, Boxes, Lines) {
    const { id, parent, colour, name, image, lines } = boxData;

    const container = document.createElement('div');
    container.className = 'org-box';

    container.id = id;
    container.setAttribute('value', parent === null ? "" : parent);
    if ((Boxes == 1) && (Lines == 1)) {
        container.setAttribute('lineOutput', "side");
        container.setAttribute('lineInput', "side");
    }
    else if ((Boxes == 1) && (Lines == 0)) {
        container.setAttribute('lineOutput', "bottom");
        container.setAttribute('lineInput', "side");
    }
    else if ((Boxes == 0) && (Lines == 1)) {
        container.setAttribute('lineOutput', "bottom");
        container.setAttribute('lineInput', "side");
    }
    else if ((Boxes == 0) && (Lines == 0)) {
        container.setAttribute('lineOutput', "bottom");
        container.setAttribute('lineInput', "top");
    }
    else if ((Boxes == 0) && (Lines == 2)) {
        container.setAttribute('lineOutput', "bottom");
        container.setAttribute('lineInput', "direct");
    }
    else if ((Boxes == 1) && (Lines == 2)) {
        container.setAttribute('lineOutput', "side");
        container.setAttribute('lineInput', "direct");
    }

    container.style.borderLeft = `8px solid ${colour}`;
    container.style.backgroundColor = getLightColor(colour, 0.8);
    const hastagColour = getLightColor(colour, 0.5);
    let imgHtml = image ? `<img src="${image}" style="width:50px; height:50px; border-radius:50%; margin-right:15px;">` : '';
    const textLinesHtml = lines.map(line => {
        const isSpecial = line.trim().startsWith('#');
        const style = isSpecial
            ? `background-color: ${hastagColour};`
            : '';

        const CSSclass = isSpecial
            ? 'hashtag'
            : '';

        if (isSpecial) {
            const text = line.substring(1).trim();
            const color = getSeededColor(text);

            return `
            <div style="${style}" class="${CSSclass}">
                <span style="width: 8px; height: 8px; background-color: ${color}; border-radius: 50%; display: inline-block; background: radial-gradient(circle, ${color} 30%, ${getLightColor(color, 0.1)}  60%);"></span>
                <span style="padding-left: 3px;">${text}</span>
            </div>
        `;
        } else {
            return `<div>${line}</div>`;
        }

    }).join('');

    container.innerHTML = `
        ${imgHtml}
        <div class="details">
            <strong style="display:block;">${name}</strong>
            ${textLinesHtml}
        </div>
    `;

    return container;
}

function getLightColor(color, factor) {
    let r, g, b;
    if (color.startsWith('#')) {
        color = color.replace('#', '');
        r = parseInt(color.substring(0, 2), 16);
        g = parseInt(color.substring(2, 4), 16);
        b = parseInt(color.substring(4, 6), 16);
    }
    else if (color.startsWith('rgb')) {
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

    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);

    const toHex = (val) => val.toString(16).padStart(2, '0');

    return `rgb(${r}, ${g}, ${b})`;
}


function getSeededColor(originalText) {
    const text = originalText.toLowerCase();
    if (!text || text.length === 0) return 'rgb(128, 128, 128)';
    const bSeed = text.charCodeAt(text.length-1);
    const gSeed = text.charCodeAt(Math.floor(text.length / 2));
    let rSeed = 0;

    for (let i = 0; i < text.length; i++) {
        rSeed += text.charCodeAt(i) * 10 % 256;
    }
    rSeed = rSeed / (text.length);

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0;
    }
    hash = Math.abs(hash);
    let r = (rSeed * hash) % 256;
    let g = (gSeed * hash) % 256;
    let b = (bSeed * hash) % 256;

    const factor = Math.max(100,Math.min(400, r + b + g)) / (r + b + g);
    r = Math.round(r * factor);
    g = Math.round(g * factor);
    b = Math.round(b * factor);

    return `rgb(${r}, ${g}, ${b})`;
}