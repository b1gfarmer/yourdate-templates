export function render(seatingData) {
  // Найти президиум
  const presidium = seatingData.find(t => t.tableName.toLowerCase().includes('президиум'));

  // Остальные столы (без президиума)
  const otherTables = seatingData.filter(t => !t.tableName.toLowerCase().includes('президиум'));

  // Собираем HTML для президиума
  const presidiumHTML = presidium ? `
    <div class="presidium-wrapper">
      <div class="table-card">
        <div class="table-name">${presidium.tableName}</div>
        <ul class="guest-list">
          ${presidium.guests.map(g => `<li>${g}</li>`).join('')}
        </ul>
      </div>
    </div>
  ` : '';

  // Собираем HTML для остальных столов
  const tablesHTML = otherTables.map(table => `
    <div class="table-card">
      <div class="table-name">${table.tableName}</div>
      <ul class="guest-list">
        ${table.guests.map(g => `<li>${g}</li>`).join('')}
      </ul>
    </div>
  `).join('');

  // Возвращаем полный готовый HTML с обёртками и стилями
  return `
  <html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <title>Шаблон рассадки</title>
    <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background: linear-gradient(135deg, #fffafc, #ffe8ef);
        margin: 0;
        padding: 40px 20px;
        min-height: 100vh;
        box-sizing: border-box;
        color: #333;
      }
      .container {
        max-width: 1056px; /* немного меньше A4, чтобы точно влезло с отступами */
        margin: 0 auto;
        padding: 0 20px;
        box-sizing: border-box;
      }
      h1 {
        font-family: 'Great Vibes', cursive;
        font-size: 48px;
        text-align: center;
        color: #b85780;
        margin-bottom: 40px;
      }
      .tables-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 24px;
        max-width: 1000px;
        margin: 0 auto;
      }
      .table-card {
        background: #fff;
        border-radius: 20px;
        padding: 24px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      .table-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
      }
      .table-name {
        font-weight: 600;
        font-size: 20px;
        color: #b85780;
        margin-bottom: 16px;
      }
      .guest-list {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;
        text-align: center;
      }
      .guest-list li {
        background: #ffe3ec;
        margin: 6px 0;
        padding: 8px 14px;
        border-radius: 10px;
        font-size: 14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      }
      .presidium-wrapper {
        display: flex;
        justify-content: center;
        margin-bottom: 40px;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Шаблон: Классическая рассадка</h1>

      ${presidiumHTML}

      <div class="tables-grid">
        ${tablesHTML}
      </div>
    </div>
  </body>
  </html>
  `;
}
