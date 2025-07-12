// guests.js
import { makeDraggable } from './dragItems.js';

let guestIdCounter = 1;
const guestList = document.getElementById('guestList');
const addGuestBtn = document.getElementById('addGuestBtn');
const addedItems = new Set();

export function initGuests() {
  addGuestBtn.addEventListener('click', () => {
    const guestName = prompt('Введите имя гостя:', 'Гость ' + guestIdCounter);
    if (!guestName) return;
    createGuest(guestName);
  });

  ['Иван', 'Мария', 'Алексей', 'Ольга'].forEach(createGuest);
}

export function createGuest(name) {
  const id = 'guest' + guestIdCounter++;

  const guestDiv = document.createElement('div');
  guestDiv.className = 'guest-item';
  guestDiv.draggable = true;
    guestDiv.innerHTML = `<span class="guest-name-label">${name}</span> <span class="guest-remove" title="Удалить гостя">✖</span>`;
    guestDiv.dataset.type = 'guest';
    guestDiv.dataset.id = id;
    guestDiv.title = 'Перетащите гостя в зону';

    guestDiv.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('id', id);
    e.dataTransfer.setData('type', 'guest');
    e.dataTransfer.setData('name', name);
    });

    guestDiv.querySelector('.guest-remove').addEventListener('click', (e) => {
    e.stopPropagation(); // чтобы не сработал drag
    guestList.removeChild(guestDiv);
    });

    guestDiv.addEventListener('dblclick', () => {
    if (addedItems.has(id)) {
        alert('Этот гость уже в зоне, удалите его там.');
        return;
    }
    guestList.removeChild(guestDiv);
    });

    guestList.appendChild(guestDiv);

}