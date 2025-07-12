// main.js
import { initZones } from './zones.js';
import { initGuests } from './guests.js';
import { makeDraggable } from './dragItems.js';

// Инициализация кнопок и зон
const addZoneBtn = document.getElementById('addZoneBtn');
initZones(addZoneBtn);

// Инициализация панели гостей
initGuests();

// Сделать все элементы в itemsContainer перетаскиваемыми
const itemsContainer = document.getElementById('itemsContainer');
document.querySelectorAll('.draggable-item').forEach(makeDraggable);
