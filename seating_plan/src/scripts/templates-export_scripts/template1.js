// /templates/template1.js
export function render(seatingData) {
  const content = seatingData.map(table => `
    <div style="margin-bottom: 20px;">
      <h3>${table.tableName}</h3>
      <ul>${table.guests.map(g => `<li>${g}</li>`).join('')}</ul>
    </div>
  `).join('');

  return `<div>${content}</div>`;
}
