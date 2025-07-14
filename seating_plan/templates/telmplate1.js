export function render(data) {
  return `
    <div style="font-family: 'Segoe UI', sans-serif; padding: 20px;">
      <h1 style="text-align:center; color:#4CAF50;">План рассадки гостей (Шаблон 1)</h1>
      ${data.map(table => `
        <div style="margin-bottom: 24px; border-left: 5px solid #4CAF50; padding-left: 12px;">
          <h2 style="margin:0; color:#2c3e50;">${table.tableName}</h2>
          <ul>
            ${table.guests.map(g => `<li>${g}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  `;
}
