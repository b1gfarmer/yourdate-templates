// dragItems.js
import { getTableTemplates } from './tables.js';

export function makeDraggable(item) {
  item.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('id', item.dataset.id);
    e.dataTransfer.setData('type', item.dataset.type);
    e.dataTransfer.setData('name', item.dataset.name || '');
  });
}

export function hideItemInSource(id) {
  const guest = document.getElementById('guestList')?.querySelector(`[data-id="${id}"]`);
  if (guest) {
    guest.style.display = 'none';
    return;
  }
  const elem = document.getElementById('itemsContainer')?.querySelector(`[data-id="${id}"]`);
  if (elem) {
    elem.style.display = 'none';
  }
}

export function restoreItemToSource(id) {
  const guest = document.getElementById('guestList')?.querySelector(`[data-id="${id}"]`);
  if (guest) {
    guest.style.display = '';
    return;
  }
  const elem = document.getElementById('itemsContainer')?.querySelector(`[data-id="${id}"]`);
  if (elem) {
    elem.style.display = '';
  } else {
    const template = getTableTemplates().get(id);
    if (template) {
      document.getElementById('itemsContainer').appendChild(template);
      template.style.display = '';
    }
  }
}
