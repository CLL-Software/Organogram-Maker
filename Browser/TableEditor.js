const REQUIRED_HEADERS = [
    "ID",
    "Parent ID",
    "Name",
    "Colour",
];

const tableWrapper = document.querySelector(".table-wrapper");

tableWrapper.addEventListener("paste", function (e) {
    const html = e.clipboardData.getData("text/html");

    // No table in clipboard → normal paste
    if (!html || !html.toLowerCase().includes("<table")) return;

    e.preventDefault();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const pastedTable = doc.querySelector("table");

    if (!pastedTable) return;

    const pastedHeaders = Array.from(
        pastedTable.querySelectorAll("tr:first-child th, tr:first-child td")
    ).map(h => h.textContent.trim());

    // Validate required headers
    const missing = REQUIRED_HEADERS.filter(
        h => !pastedHeaders.includes(h)
    );

    if (missing.length) {
        alert(
            "Pasted table is missing required column headers:\n\n" +
            missing.join(", ")
        );
        return;
    }

    replaceTableWithoutFormatting(pastedTable);
});

export function replaceTableWithoutFormatting(sourceTable) {
    const newTable = document.createElement("table");
    newTable.id = "orgTable";
    newTable.border = "1";
    newTable.cellPadding = "6";
    newTable.cellSpacing = "0";

    const rows = sourceTable.rows;

    for (let r = 0; r < rows.length; r++) {
        const newRow = newTable.insertRow();

        for (let c = 0; c < rows[r].cells.length; c++) {
            const sourceCell = rows[r].cells[c];
            const cell = r === 0
                ? document.createElement("th")
                : document.createElement("td");

            cell.textContent = sourceCell.textContent.trim();
            cell.contentEditable = r === 0
                ? !REQUIRED_HEADERS.includes(cell.textContent)
                : "true";

            newRow.appendChild(cell);
        }
    }

    document.getElementById("orgTable").replaceWith(newTable);
}

export function populateDropdown() {
    const dropdown = document.getElementById("rowSelector");
    const table = document.getElementById("orgTable");
    const rows = table.getElementsByTagName("tr");
    dropdown.innerHTML = "";

    for (let i = 1; i < rows.length; i++) {
        const idCell = rows[i].cells[0];
        const idValue = idCell.textContent || idCell.innerText;
        const option = document.createElement("option");
        option.value = idValue;
        option.textContent = idValue;
        dropdown.appendChild(option);
    }
}
window.populateDropdown = populateDropdown;

export function addRow() {
    const dropdown = document.getElementById("rowSelector");
    const selectedID = dropdown.value;
    const table = document.getElementById("orgTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const idCell = rows[i].cells[0];
        const idValue = idCell.textContent || idCell.innerText;

        if (idValue == selectedID) {
            const newRow = table.insertRow(i + 1);


            for (let j = 0; j < rows[i].cells.length; j++) {
                const newCell = newRow.insertCell(j);
                newCell.contentEditable = "true";
            }
            break;
        }
    }
    populateDropdown();
}
window.addRow = addRow;

export function deleteRow() {
    const dropdown = document.getElementById("rowSelector");
    const selectedID = dropdown.value;
    const table = document.getElementById("orgTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const idCell = rows[i].cells[0];
        const idValue = idCell.textContent || idCell.innerText;

        if (idValue == selectedID) {
            table.deleteRow(i);
            break;
        }
    }
    populateDropdown();
}
window.deleteRow = deleteRow;

export function populateColumnDropdown() {
    const dropdown = document.getElementById("columnSelector");
    const table = document.getElementById("orgTable");
    const headerRow = table.getElementsByTagName("tr")[0];
    const headers = headerRow.getElementsByTagName("th");
    dropdown.innerHTML = "";
    const excludedHeaders = ["ID", "Parent ID", "Name", "Colour"];
    for (let i = 0; i < headers.length; i++) {
        const headerText = headers[i].textContent || headers[i].innerText;

        if (!excludedHeaders.includes(headerText)) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = headerText;
            dropdown.appendChild(option);
        }
    }
}
window.populateColumnDropdown = populateColumnDropdown;

export function addColumn() {
    const dropdown = document.getElementById("columnSelector");
    let selectedColumnIndex = Number(dropdown.value);
    selectedColumnIndex += 1;
    const table = document.getElementById("orgTable");
    const rows = table.rows;
    const colIndex = rows[0].cells.length + 1;

    for (let i = 0; i < rows.length; i++) {
        const cell =
            i === 0
                ? document.createElement("th")
                : document.createElement("td");

        cell.contentEditable = "true";
        cell.textContent = i === 0 ? `Column ${colIndex - 5}` : "";
        console.log(selectedColumnIndex);
        rows[i].insertBefore(cell, rows[i].cells[selectedColumnIndex]);
    }
    populateColumnDropdown();
}
window.addColumn = addColumn;

export function deleteColumn() {
    const dropdown = document.getElementById("columnSelector");
    const selectedColumnIndex = dropdown.value;
    const table = document.getElementById("orgTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        rows[i].deleteCell(parseInt(selectedColumnIndex));
    }
    populateColumnDropdown();
}
document.getElementById("orgTable").addEventListener("input", populateDropdown);
document.getElementById("orgTable").addEventListener("input", populateColumnDropdown);

window.onload = function () {
    populateDropdown();
    populateColumnDropdown();
};
window.deleteColumn = deleteColumn;