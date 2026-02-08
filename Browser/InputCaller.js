import { structureBoxes } from './StructureBoxes.js';
import { drawElbowLines } from './DrawLines.js';
import { initializeDragging } from './Draggable.js';

export function refresh() {
    const root = document.getElementById("org-container");
    const chart = document.getElementById("ChartType").value;
    const line = document.getElementById("LineType").value;
    root.innerHTML = "";
    const orgData = loadOrgDataFromHtmlTable();
    root.appendChild(structureBoxes(orgData, chart, line));
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