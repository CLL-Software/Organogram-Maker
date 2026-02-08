import { structureBoxes } from './StructureBoxes.js';
import { drawElbowLines } from './DrawLines.js';
import { initializeDragging } from './Draggable.js';

export function Organogram(divID, orgData, chartType = 0, lineType = 2, flipped = false, spacing = "50px") {

    orgData = convertDataFormat(divID, orgData);

    const div = document.getElementById(divID);
    div.appendChild(applyCSS(divID, chartType, flipped, spacing));

    const svg = document.createElement('svg');
    const svgID = divID + '-org-lines-svg';
    svg.id = svgID;
    div.appendChild(svg);

    const root = document.createElement('div'); 
    const rootID = divID + '-org-container';
    root.id = rootID;
    root.classList = ['org-container']
    div.appendChild(root);
    root.appendChild(structureBoxes(orgData, chartType, lineType));

    window.addEventListener('resize', () => {
        drawElbowLines(svgID, divID);
    });

    window.addEventListener('scroll', () => {
        drawElbowLines(svgID, divID);
    });

    drawElbowLines(svgID, divID);
    initializeDragging(svgID, divID);
}
(function () {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            window.Organogram = Organogram;
        });
    } else {
        window.Organogram = Organogram;
    }
})();

function applyCSS(divID, chartType, flipped, spacing) {
    const div = document.getElementById(divID);
    const style = document.createElement("style");

    style.innerHTML = `
svg{
    overflow: visible;
}

.org-container {
}

.org-box {
    display: flex;
    align-items: center;
    z-index: 10;
    position: relative;
    margin-left: ${spacing};
}

.node-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    padding-top: ${spacing};
}

.org-level {
    display: flex;
    position: relative;
}

    .org-level.horizontal {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: ${spacing};
        padding-left: ${spacing};
        padding-top: 0px;
        position: relative;
    }

.node-wrapper.horizontal {
    position: relative;
    display: flex;
    flex-direction: unset;
    padding-top: 0px;
}
    `;

    style.innerHTML += applyFlip(divID, chartType, flipped);
    return style;
}


function applyFlip(divID, chartType, flipped) {
    let additionalStyling = "";

    if (flipped) {
        if (chartType === 0) {
            additionalStyling = `
            #${divID} {
                transform: scaleY(-1);
                transform-origin: center;
            }
            #${divID} .org-box {
                transform: scaleY(-1);
            }
            `;
        } else if (chartType === 1) {
            additionalStyling = `
            #${divID} {
                transform: scaleX(-1);
                transform-origin: center;
            }
            #${divID} .org-box {
                transform: scaleX(-1);
            }
            `;
        }
    }

    return additionalStyling;
}

function convertDataFormat(divID, data) {
    if (data[0].hasOwnProperty('id')) {
        return data.map(item => ({
            id: item.id + divID,
            parent: item.parent == null ? null : item.parent + divID,
            name: item.name,
            colour: item.colour || item.color,
            image: item.image || null,
            lines: Array.isArray(item.lines) ? item.lines : []
        }));
    }

    return data.map(item => ({
        id: item[0] = item[0] + divID,
        parent: item[1] == null ? null : item[1] + divID,
        name: item[2],
        colour: item[3],
        image: item[4] || null,
        lines: Array.isArray(item[5]) ? item[5] : [] 
    }));
}


