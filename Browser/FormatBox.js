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
                <span style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; display: inline-block;"></span>
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

function getLightColor(hex, factor) {
    hex = hex.replace('#', '');

    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);
    const toHex = (val) => val.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getSeededColor(originalText) {
    const text = originalText.toLowerCase();
    if (!text || text.length === 0) return 'rgb(128, 128, 128)';
    const rSeed = text.charCodeAt(text.length-1);
    const gSeed = text.charCodeAt(0);
    const bSeed = text.charCodeAt(Math.floor(text.length / 2));

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0;
    }
    hash = Math.abs(hash);
    const r = (rSeed * hash) % 256;
    const g = (gSeed * hash) % 256;
    const b = (bSeed * hash) % 256;

    return `rgb(${r}, ${g}, ${b})`;
}