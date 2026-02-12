import { formatBox } from './FormatBox.js';

// --- UPDATED: Passing renderedNodes to prevent duplicates ---
export function structureBoxes(data, Boxes, Lines, parentId = null, renderedNodes = new Set(), row = 0) {

    // 1. Identify children based on the FIRST parent ID in their comma-separated list
    const children = data.filter(item => {
        // Skip if node is already rendered
        if (renderedNodes.has(item.id)) return false;

        // If rendering root nodes
        if (parentId === null) return !item.parent || item.parent === "";

        if (!item.parent) return false;

        // Split parents and grab the first one for layout
        const itemParentIds = item.parent.toString().split(',').map(id => id.trim());
        const primaryParentId = itemParentIds[0];

        return primaryParentId === parentId.toString();
    });

    if (children.length === 0) return null;

    const container = document.createElement('div');
    container.className = (Boxes == 1) ? 'org-level horizontal' : 'org-level';

    if (parentId === null) {
        container.classList.add('root-level');
    }
    row++;
    children.forEach(item => {
        // 2. Mark node as rendered immediately so it's not created again
        renderedNodes.add(item.id);

        const wrapper = document.createElement('div');
        wrapper.className = (Boxes == 1) ? 'node-wrapper horizontal' : 'node-wrapper';

        wrapper.appendChild(formatBox(item, Boxes, Lines, row));

        // Pass the same renderedNodes set down recursively
        const subTree = structureBoxes(data, Boxes, Lines, item.id, renderedNodes, row);
        if (subTree) wrapper.appendChild(subTree);

        container.appendChild(wrapper);
    });

    return container;
}