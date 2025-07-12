// zones.js

import { createTableElement, generateNextTable } from './tables.js';
import { hideItemInSource, restoreItemToSource } from './dragItems.js';

const canvas = document.getElementById('canvas');
const zones = [];
let zoneCount = 0;

const addedItems = new Set();

export function initZones(addZoneBtn) {
  addZoneBtn.addEventListener('click', () => {
    const name = 'Зона ' + String.fromCharCode(65 + zoneCount);
    const margin = 10;
    const y = margin + zoneCount * 120;
    const x = Math.floor((canvas.clientWidth - 150) / 2);

    const zone = createZone(name, x, y);
    canvas.appendChild(zone);
    zones.push(zone);
    zoneCount++;
  });
}

export function createZone(name, x, y) {
  const zone = document.createElement('div');
  zone.className = 'zone';
  zone.style.left = x + 'px';
  zone.style.top = y + 'px';

  const input = document.createElement('input');
  input.type = 'text';
  input.value = name;
  input.title = 'Переименовать зону';

  const closeBtn = document.createElement('span');
  closeBtn.textContent = '✖';
  closeBtn.className = 'close-btn';
  closeBtn.title = 'Удалить зону';
  closeBtn.onclick = () => deleteZone(zone, input.value);

  zone.appendChild(input);
  zone.appendChild(closeBtn);

  const guestsContainer = document.createElement('div');
  guestsContainer.className = 'guests-container';
  zone.appendChild(guestsContainer);

  addZoneDragAndDrop(zone, guestsContainer);
  addZoneDragging(zone, input, closeBtn, guestsContainer);

  return zone;
}

function deleteZone(zone, zoneName) {
  // Восстанавливаем все guest-items
  const guests = zone.querySelectorAll('.guest-item');
  guests.forEach(guest => {
    const id = guest.dataset.id;
    if (id) {
      addedItems.delete(id);
      restoreItemToSource(id);
    }
  });

    // Восстанавливаем всех гостей, сидящих за столами
    const occupiedSeats = zone.querySelectorAll('.seat.occupied');
    occupiedSeats.forEach(seat => {
    const guestLabel = seat.querySelector('.guest-name');
    if (guestLabel) {
        const guestName = guestLabel.textContent;
        const guestId = findGuestIdByNameGlobal(guestName); // ищем среди всех, не только в списке
        if (guestId) {
        addedItems.delete(guestId);
        restoreItemToSource(guestId);
        }
    }
    });

    // Восстанавливаем все столы (table-vertical)
    const tables = zone.querySelectorAll('.table-vertical');
    tables.forEach(table => {
    const id = table.dataset.id;
    if (id) {
        addedItems.delete(id);
        restoreItemToSource(id);
    }
    });


  canvas.removeChild(zone);

  const match = zoneName.trim().match(/^Зона\s([A-ZА-Я])$/i);
  if (match) {
    zoneCount = Math.min(zoneCount, match[1].toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0));
  }
}

function addZoneDragging(zone, input, closeBtn, guestsContainer) {
  let offsetX, offsetY, dragging = false;

  zone.addEventListener('mousedown', (e) => {
    if (e.target === input || e.target === closeBtn || e.target.parentNode === guestsContainer) return;
    dragging = true;
    offsetX = e.clientX - zone.offsetLeft;
    offsetY = e.clientY - zone.offsetTop;
    zone.style.cursor = 'grabbing';
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;

    newX = Math.max(0, Math.min(newX, canvas.clientWidth - zone.offsetWidth));
    newY = Math.max(0, Math.min(newY, canvas.clientHeight - zone.offsetHeight));

    zone.style.left = newX + 'px';
    zone.style.top = newY + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (dragging) {
      dragging = false;
      zone.style.cursor = 'grab';
    }
  });
}

function addZoneDragAndDrop(zone, guestsContainer) {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.style.background = '#e6f7ff';
  });

  zone.addEventListener('dragleave', () => {
    zone.style.background = '#f0f0f0';
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.style.background = '#f0f0f0';

    const id = e.dataTransfer.getData('id');
    const type = e.dataTransfer.getData('type');
    const name = e.dataTransfer.getData('name') || '';

    if (!id || !type || addedItems.has(id)) return;

    const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    const seat = dropTarget?.closest('.seat');

    if (type === 'guest' && seat) {
      // Удаляем старого гостя с этого места
      const existing = seat.querySelector('.guest-name');
      if (existing) {
        const oldName = existing.textContent;
        const oldId = findGuestIdByName(oldName);
        if (oldId) {
          addedItems.delete(oldId);
          restoreItemToSource(oldId);
        }
        existing.remove();
      }

      // Сажаем нового гостя
      const guestLabel = document.createElement('div');
      guestLabel.className = 'guest-name';
      guestLabel.textContent = name;

      seat.classList.add('occupied');
      seat.appendChild(guestLabel);
      addedItems.add(id);
      hideItemInSource(id);
      return;
    }

    if (type === 'guest') {
      // запрет на добавление гостя в зону напрямую
      return;
    }

    // Для президиума и столов
    const guestDiv = document.createElement('div');
    guestDiv.className = 'guest-item';
    guestDiv.textContent = type === 'presidium' ? 'Президиум' : name;
    guestDiv.dataset.type = type;
    guestDiv.dataset.id = id;
    guestDiv.title = 'Двойной клик — удалить из зоны';
    guestDiv.addEventListener('dblclick', () => removeGuest(guestDiv, guestsContainer, id));

    const closeBtn = document.createElement('span');
    closeBtn.textContent = '✖';
    closeBtn.className = 'close-btn';
    closeBtn.style.color = 'red';
    closeBtn.title = 'Удалить элемент из зоны';
    closeBtn.addEventListener('click', () => removeGuest(guestDiv, guestsContainer, id));
    guestDiv.appendChild(closeBtn);

    guestsContainer.appendChild(guestDiv);
    addedItems.add(id);
    hideItemInSource(id);

    if (type === 'table') {
      const tableElement = createTableElement(name);
      tableElement.dataset.id = id;
      tableElement.dataset.type = type;
      guestsContainer.appendChild(tableElement);
      generateNextTable();
    }
  });

  // Удаление гостя со стола по клику на место
  zone.addEventListener('click', (e) => {
    const seat = e.target.closest('.seat');
    if (!seat || !seat.classList.contains('occupied')) return;

    const guestLabel = seat.querySelector('.guest-name');
    if (!guestLabel) return;

    const guestName = guestLabel.textContent;

    seat.classList.remove('occupied');
    guestLabel.remove();

    const id = findGuestIdByName(guestName);
    if (id) {
      addedItems.delete(id);
      restoreItemToSource(id);
    }
  });
}

function findGuestIdByName(name) {
  // Сначала ищем в списке гостей
  const guests = document.querySelectorAll('#guestList .guest-item');
  for (const guest of guests) {
    const label = guest.querySelector('.guest-name-label');
    const guestText = label ? label.textContent : guest.textContent;
    if (guestText === name) return guest.dataset.id;
  }

  // Потом ищем среди скрытых draggable-item
  const hiddenGuests = document.querySelectorAll('.draggable-item[data-type="guest"]');
  for (const item of hiddenGuests) {
    if (item.textContent.trim() === name) return item.dataset.id;
  }

  return null;
}

function removeGuest(guestDiv, container, id) {
  container.removeChild(guestDiv);
  addedItems.delete(id);
  restoreItemToSource(id);

  if (guestDiv.dataset.type === 'table') {
    const table = container.querySelector(`.table-vertical[data-id="${id}"]`);
    if (table) {
      // Восстановить гостей со стола
      const seats = table.querySelectorAll('.seat.occupied');
      seats.forEach(seat => {
        const guestLabel = seat.querySelector('.guest-name');
        if (guestLabel) {
          const guestName = guestLabel.textContent;
          const guestId = findGuestIdByName(guestName);
          if (guestId) {
            addedItems.delete(guestId);
            restoreItemToSource(guestId);
          }
        }
      });

      container.removeChild(table);
    }

    // Восстановить элемент draggable-item в панели, не удалять
    const draggableItem = document.querySelector(`.draggable-item[data-id="${id}"]`);
    if (draggableItem) {
      draggableItem.style.display = ''; // Показываем элемент обратно
    }
  }
}

function findGuestIdByNameGlobal(name) {
  const allGuests = document.querySelectorAll('.guest-item, .draggable-item[data-type="guest"]');
  for (const guest of allGuests) {
    if (guest.textContent === name) {
      return guest.dataset.id;
    }
  }
  return null;
}

