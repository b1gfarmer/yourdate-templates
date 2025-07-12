let currentTableCharCode = 'F'.charCodeAt(0);
const tableTemplates = new Map();

export function createTableElement(name) {
  const tableDiv = document.createElement('div');
  tableDiv.classList.add('table-vertical');

  // Высота для 4 мест (2 слева + 2 справа)
  tableDiv.style.height = '80px'; // меньше чем 120 или 200

  const seatsContainer = document.createElement('div');
  seatsContainer.classList.add('seats-container');

  // Только 2 позиции pos1 и pos2
  const positions = ['pos1', 'pos2'];

  positions.forEach(posClass => {
    addSeat(seatsContainer, name, 'left', posClass);
    addSeat(seatsContainer, name, 'right', posClass);
  });

  tableDiv.appendChild(seatsContainer);

  return tableDiv;
}

function addSeat(container, tableName, side, posClass) {
  const seat = document.createElement('div');
  seat.classList.add('seat', side, posClass);
  seat.title = `Место ${side === 'left' ? 'слева' : 'справа'} от ${tableName}`;
  seat.dataset.side = side;
  addSeatClickHandler(seat);
  container.appendChild(seat);
}

function addSeatClickHandler(seat) {
  seat.addEventListener('click', () => {
    // твоя логика клика по месту, если нужна
  });
}

// Добавляем по 1 месту слева и справа с новым posN классом
function addSeatsToTable(seatsContainer, tableName) {
  // Получаем уже существующие номера позиций
  const seatPositions = [...seatsContainer.querySelectorAll('.seat')].map(seat => {
    const posClass = [...seat.classList].find(c => c.startsWith('pos'));
    return posClass ? parseInt(posClass.replace('pos', ''), 10) : 0;
  });
  const maxPos = seatPositions.length ? Math.max(...seatPositions) : 0;
  const newPos = maxPos + 1;

  // Создаём новое левое место
  const leftSeat = document.createElement('div');
  leftSeat.classList.add('seat', 'left', 'pos' + newPos);
  leftSeat.title = `Место слева от ${tableName}`;
  leftSeat.dataset.side = 'left';
  addSeatClickHandler(leftSeat);
  seatsContainer.appendChild(leftSeat);

  // Создаём новое правое место
  const rightSeat = document.createElement('div');
  rightSeat.classList.add('seat', 'right', 'pos' + newPos);
  rightSeat.title = `Место справа от ${tableName}`;
  rightSeat.dataset.side = 'right';
  addSeatClickHandler(rightSeat);
  seatsContainer.appendChild(rightSeat);
}

export function generateNextTable() {
  const char = String.fromCharCode(currentTableCharCode);
  const id = 'table' + char;
  const name = 'Стол ' + char;

  // Ищем существующий элемент с таким id
  const existingItem = [...document.querySelectorAll('.draggable-item')].find(item => item.dataset.id === id);

  if (existingItem) {
    // Если элемент скрыт, показываем его
    if (existingItem.style.display === 'none') {
      existingItem.style.display = '';
    }
    return; // элемент уже есть — ничего не создаём
  }

  const newItem = document.createElement('div');
  newItem.className = 'draggable-item';
  newItem.draggable = true;
  newItem.dataset.id = id;
  newItem.dataset.type = 'table';
  newItem.dataset.name = name;
  newItem.textContent = name;

  newItem.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('id', newItem.dataset.id);
    e.dataTransfer.setData('type', newItem.dataset.type);
    e.dataTransfer.setData('name', newItem.dataset.name);
  });

  document.getElementById('itemsContainer').appendChild(newItem);
  tableTemplates.set(id, newItem);
  currentTableCharCode++;
}

export function getTableTemplates() {
  return tableTemplates;
}
