/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global console, document, Excel, Office */
import "./taskpane.css";
import { createTable, refresh } from "./InputCaller.js";
import { exportToPNG } from "./Exporter.js";
export { initializeDragging } from "./Draggable.js";
export { drawElbowLines } from "./DrawLines.js";
export { structureBoxes } from "./StructureBoxes.js";
export { formatBox } from "./FormatBox.js";

Office.onReady((info) => {
    if (info.host === Office.HostType.Excel) {

        // Expose functions globally if needed
        window.createTable = createTable;
        window.refresh = refresh;
        window.exportToPNG = exportToPNG;
    }
})



