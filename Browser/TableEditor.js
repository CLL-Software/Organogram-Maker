
export function addColumn() {
    const table = document.getElementById("orgTable");
    const rows = table.rows;

    const colIndex = rows[0].cells.length + 1;

    for (let i = 0; i < rows.length; i++) {
        const cell =
            i === 0
                ? document.createElement("th")
                : document.createElement("td");

        cell.contentEditable = "true";
        cell.textContent = i === 0 ? `Line ${colIndex - 5}` : "";
        rows[i].appendChild(cell);
    }
}
window.addColumn = addColumn;

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
