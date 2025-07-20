import * as html2pdf from 'html2pdf.js';

export function openCatalog(seatingData) {
  // Сохраняем данные во временное хранилище
  sessionStorage.setItem('seatingData', JSON.stringify(seatingData));
  // Перенаправляем на страницу каталога
  window.location.href = '/templates/catalog.html';
}

// Если мы уже на catalog.html, и скрипт подключён, заполняем страницу
const templates = [
  { id: 'template1', name: 'Шаблон 1 - Простой список столов' },
  { id: 'template2', name: 'Шаблон 2 - Карточки с зелёным акцентом' }
];

// Это будет выполнено только в catalog.html
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('templates');
  if (!container) return; // Если не на catalog.html, ничего не делаем

  const seatingData = JSON.parse(sessionStorage.getItem('seatingData') || '[]');

  templates.forEach(template => {
    const card = document.createElement('div');
    card.className = 'template-card';

    const title = document.createElement('h2');
    title.textContent = template.name;

    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Экспортировать';
    exportBtn.className = 'btn-export';

    const previewBtn = document.createElement('button');
    previewBtn.textContent = 'Посмотреть шаблон';
    previewBtn.className = 'btn-preview';

    exportBtn.addEventListener('click', async () => {
      try {
        const module = await import(`./${template.id}.js`);
        const html = module.render(seatingData);

        console.log('HTML для pdf:', html);

        container.style.position = 'static';
        container.style.left = 'auto';
        container.style.top = 'auto';
        container.style.visibility = 'visible';
        container.style.width = '210mm';
        container.style.height = 'auto';
        container.style.opacity = '1';
        container.style.zIndex = '10000';
        container.style.background = 'white';
        container.style.color = 'black';
        container.style.padding = '10px';

        document.body.appendChild(container);

        container.innerHTML = html;

        // Подождём, чтобы стили успели примениться
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        await html2pdf().set({
          margin: 10,
          filename: 'guest-seating-plan.pdf',
          image: { type: 'jpeg', quality: 1 },
          html2canvas: { scale: 2 }, // для лучшего качества
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }).from(container).save();

        container.remove();

      } catch (err) {
        console.error('Ошибка при экспорте PDF:', err);
      }
    });


    previewBtn.addEventListener('click', () => {
      window.open(`/templates/${template.id}.html`, '_blank');
    });

    const btnContainer = document.createElement('div');
    btnContainer.className = 'buttons';
    btnContainer.appendChild(exportBtn);
    btnContainer.appendChild(previewBtn);

    card.appendChild(title);
    card.appendChild(btnContainer);
    container.appendChild(card);
  });
});
