import { initZones } from './zones.js';
import { initGuests } from './guests.js';
import { makeDraggable } from './dragItems.js';
import { openCatalog } from './exportTemplate.js';

// Инициализация кнопок и зон
const addZoneBtn = document.getElementById('addZoneBtn');
initZones(addZoneBtn);

// Инициализация панели гостей
initGuests();

// Сделать все элементы в itemsContainer перетаскиваемыми
const itemsContainer = document.getElementById('itemsContainer');
document.querySelectorAll('.draggable-item').forEach(makeDraggable);

import html2canvas from 'html2canvas';

document.getElementById('exportPdfBtn')?.addEventListener('click', async () => {
  const seatingData = getCurrentSeatingData();
  sessionStorage.setItem('seatingData', JSON.stringify(seatingData));

  const configEl = document.querySelector('#canvas'); // <- замени на нужный селектор
  if (configEl) {
    try {
      const canvas = await html2canvas(configEl, { scale: 2 });
      const imageData = canvas.toDataURL('image/jpeg', 1.0);
      sessionStorage.setItem('seatingScreenshot', imageData);
    } catch (err) {
      console.error('Не удалось сделать скриншот:', err);
    }
  }

  window.open('/templates/catalog.html', '_blank');
});

// Заглушка для примера, замени на реальную логику сбора данных
function getCurrentSeatingData() {
  const seatingData = [];

  // Перебираем все зоны
  const zones = document.querySelectorAll('.zone');

  zones.forEach(zone => {
    // Добавляем президиум, если есть
    const presidiumElem = zone.querySelector('[data-type="presidium"]');
    if (presidiumElem) {
      seatingData.push({
        tableName: 'Президиум',
        guests: ['Молодожены']
      });
    }

    // В зоне ищем все столы
    const tables = zone.querySelectorAll('.table-vertical');

    tables.forEach(table => {
      // === Нормализация имени стола ===
      let tableName = table.dataset.name;

      if (!tableName && table.dataset.id?.startsWith('table')) {
        const suffix = table.dataset.id.replace('table', '').toUpperCase();
        tableName = 'Стол ' + suffix;
      }

      if (!tableName) {
        tableName = 'Без имени';
      }

      // Сбор гостей
      const guests = [];
      const seats = table.querySelectorAll('.seat.occupied');
      seats.forEach(seat => {
        const guestNameElem = seat.querySelector('.guest-name');
        if (guestNameElem) {
          guests.push(guestNameElem.textContent.trim());
        }
      });

      seatingData.push({ tableName, guests });
    });
  });

  return seatingData;
}



