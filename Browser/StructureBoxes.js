import { formatBox } from './FormatBox.js';

export function structureBoxes(data, Boxes, Lines, parentId = null) {
    const children = data.filter(item => item.parent === parentId);
    if (children.length === 0) return null;

    const container = document.createElement('div');

    container.className = (Boxes==1) ? 'org-level horizontal' : 'org-level';

    if (parentId === null) {
        container.classList.add('root-level');
    }

    children.forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.className = (Boxes==1) ? 'node-wrapper horizontal' : 'node-wrapper';

        wrapper.appendChild(formatBox(item, Boxes, Lines));
        const subTree = structureBoxes(data, Boxes, Lines, item.id);
        if (subTree) wrapper.appendChild(subTree);

        container.appendChild(wrapper);
    });

    return container;
}