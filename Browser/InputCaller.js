import { structureBoxes } from './StructureBoxes.js';
import { drawElbowLines } from './DrawLines.js';
import { initializeDragging } from './Draggable.js';

export function refresh() {
    const root = document.getElementById("org-container");
    const chart = document.getElementById("ChartType").value;
    const line = document.getElementById("LineType").value;
    const alignType = document.getElementById("AlignType");

    root.innerHTML = "";
    const orgData = loadOrgDataFromHtmlTable();
    root.appendChild(structureBoxes(orgData, chart, line));

    alignmentStyle(alignType);
    adjustSelect(alignType, chart);

    const orgBoxes = document.querySelectorAll('.org-box');
    let maxWidth = 0;

    orgBoxes.forEach(box => {
        const boxWidth = box.offsetWidth;
        if (boxWidth > maxWidth) {
            maxWidth = boxWidth;
        }
    });

    orgBoxes.forEach(box => {
        box.style.minWidth = `${maxWidth}px`;
    });

    const org = document.getElementById("organagram");
    root.style.zoom = 1;
    root.style.zoom = (org.clientWidth / org.scrollWidth);

    drawElbowLines("org-lines-svg", "org-container");
    initializeDragging("org-lines-svg", "org-container");
}
window.refresh = refresh;

function loadOrgDataFromHtmlTable() {
    const table = document.getElementById("orgTable");
    if (!table) {
        console.error("Table #orgTable not found.");
        return [];
    }

    const data = [];
    const rows = table.querySelectorAll("tbody tr");

    const headers = Array.from(rows[0].querySelectorAll("th")).map(th => th.textContent.trim());
    const reservedIndices = {
        id: headers.findIndex(h => h.toLowerCase() === "id"),
        parent: headers.findIndex(h => h.toLowerCase() === "parent id"),
        name: headers.findIndex(h => h.toLowerCase() === "name"),
        colour: headers.findIndex(h => h.toLowerCase() === "colour"),
        image: headers.findIndex(h => h.toLowerCase() === "image url")
    };


    for (let i = 1; i < rows.length; i++) {
        const cells = rows[i].querySelectorAll("td");
        const rowData = {};
        const lines = [];

        cells.forEach((cell, index) => {
            const header = headers[index];
            const value = cell.textContent.trim();

            if (index === reservedIndices.id) rowData.id = value;
            else if (index === reservedIndices.parent) rowData.parent = value || null;
            else if (index === reservedIndices.name) rowData.name = value;
            else if (index === reservedIndices.colour) rowData.colour = value;
            else if (index === reservedIndices.image) rowData.image = value || null;
            else if (value && !header.startsWith('!')) {
                lines.push(value);
            }
        });

        rowData.lines = lines;
        data.push(rowData);
    }
    return data;
}

refresh();

function alignmentStyle(alignType) {
    const align = alignType.value;
    const nodes = document.querySelectorAll('.node-wrapper');
    nodes.forEach(node => {
        if (align == 0) {
            node.classList.add("centre");
        }
        if (align == 1) {
            node.classList.add("start");
        }
        if (align == 2) {
            node.classList.add("end");
        }
    });
}

function adjustSelect(alignType, chartType) {
    const startValue = alignType.value;
    alignType.innerHTML = '';

    if (chartType == '0') {
        const options = [
            { value: '0', text: 'Centred' },
            { value: '1', text: 'Left' },
            { value: '2', text: 'Right' }
        ];
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            alignType.appendChild(opt);
        });
    } else if (chartType == '1') {
        const options = [
            { value: '0', text: 'Centred' },
            { value: '1', text: 'Top' },
            { value: '2', text: 'Bottom' }
        ];
        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.value;
            opt.textContent = option.text;
            alignType.appendChild(opt);
        });
    }
    alignType.value = startValue;
}