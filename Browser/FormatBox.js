export function formatBox(boxData, Boxes, Lines) {
    const { id, parent, colour, name, image, lines } = boxData;

    const container = document.createElement('div');
    container.className = 'org-box';

    // --- KEY FIX: Assign attributes for DrawLines.js to find ---
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

    // Style the borders and background
    container.style.borderLeft = `8px solid ${colour}`;
    container.style.backgroundColor = getLightColor(colour, 0.8);
    const hastagColour = getLightColor(colour, 0.5);

    // Image logic
    let imgHtml = image ? `<img src="${image}" style="width:50px; height:50px; border-radius:50%; margin-right:15px;">` : '';

    // Text lines logic
    const textLinesHtml = lines.map(line => {
        // --- KEY CHANGE: Check for '#' ---
        const isSpecial = line.trim().startsWith('#');
        const style = isSpecial
            ? `background-color: ${hastagColour};`
            : '';

        const CSSclass = isSpecial
            ? 'hashtag'
            : '';

        if (isSpecial) {
            const text = line.substring(1).trim();
            // Generate consistent color
            const color = getSeededColor(text);

            // --- KEY CHANGE: HTML for colored circle + text ---
            return `
            <div style="${style}" class="${CSSclass}">
                <span style="width: 10px; height: 10px; background-color: ${color}; border-radius: 50%; display: inline-block;"></span>
                <span style="padding-left: 3px;">${text}</span>
            </div>
        `;
        } else {
            // Default style for normal lines
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
    // Remove the hash if it exists
    hex = hex.replace('#', '');

    // Parse r, g, b values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Mix with white (255) by a factor (0.8 makes it very light/pastel)
    // Formula: NewValue = CurrentValue + (255 - CurrentValue) * factor

    r = Math.round(r + (255 - r) * factor);
    g = Math.round(g + (255 - g) * factor);
    b = Math.round(b + (255 - b) * factor);

    // Convert back to hex and pad with zeros if necessary
    const toHex = (val) => val.toString(16).padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
// utils.js
function getSeededColor(originalText) {
    const text = originalText.toLowerCase();
    if (!text || text.length === 0) return 'rgb(128, 128, 128)';

    // 1. R Seed: Length of the text
    const rSeed = text.charCodeAt(text.length-1);

    // 2. G Seed: Numerical value of the binary representation of the first character
    // Using charCodeAt(0) as a proxy for binary representation for simplicity
    const gSeed = text.charCodeAt(0);

    // 3. B Seed: Numerical value of the first character (similar to gSeed, but can be adjusted)
    // To make them distinct, we can use different character positions or operations
    const bSeed = text.charCodeAt(Math.floor(text.length / 2));

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        // Multiplier helps spread the characters out
        hash = (hash << 5) - hash + text.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    hash = Math.abs(hash);

    // 4. Generate values using a pseudo-random approach based on the seeds
    // We use a simple hash approach to spread the seeds across 0-255
    const r = (rSeed * hash) % 256;
    const g = (gSeed * hash) % 256;
    const b = (bSeed * hash) % 256;

    return `rgb(${r}, ${g}, ${b})`;
}