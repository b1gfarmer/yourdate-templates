export function openSeatingTemplate(seatingData) {
  const templates = [
    { id: 'template1', name: 'Шаблон 1 - Простой список столов' },
    { id: 'template2', name: 'Шаблон 2 - Карточки столов с зелёным акцентом' }
  ];

  const html = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8" />
      <title>Выбор шаблона рассадки</title>
      <style>
        body {
          font-family: 'Segoe UI', sans-serif;
          background: #f1f1f1;
          margin: 0; padding: 40px;
        }
        h1 {
          text-align: center;
          margin-bottom: 40px;
          font-size: 32px;
          color: #333;
        }
        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }
        .template-card {
          background: white;
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .template-name {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #2c3e50;
          min-height: 60px;
        }
        button.export-template-btn {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          background-color: #4CAF50;
          color: white;
          border: none;
          border-radius: 6px;
          transition: background-color 0.2s ease;
          align-self: center;
          margin-top: auto;
        }
        button.export-template-btn:hover {
          background-color: #45a049;
        }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    </head>
    <body>
      <h1>Выберите шаблон для экспорта рассадки</h1>
      <div class="template-grid" id="templates-container"></div>

      <script>
        const seatingData = ${JSON.stringify(seatingData)};
        const templates = ${JSON.stringify(templates)};

        // Функции рендера — заглушки, заменишь потом динамическим импортом
        const renderFunctions = {
          template1: null,
          template2: null
        };

        const container = document.getElementById('templates-container');

        templates.forEach(template => {
          const card = document.createElement('div');
          card.className = 'template-card';

          const nameDiv = document.createElement('div');
          nameDiv.className = 'template-name';
          nameDiv.textContent = template.name;
          card.appendChild(nameDiv);

          const btn = document.createElement('button');
          btn.className = 'export-template-btn';
          btn.textContent = 'Экспортировать';
          btn.addEventListener('click', () => {
            alert('Экспорт пока не работает. Шаблоны будут загружены позже.');
          });

          const previewBtn = document.createElement('button');
          previewBtn.className = 'export-template-btn';
          previewBtn.style.backgroundColor = '#2196F3';
          previewBtn.style.marginLeft = '10px';
          previewBtn.textContent = 'Посмотреть шаблон';

          previewBtn.addEventListener('click', () => {
            alert('Предпросмотр пока не работает. Шаблоны будут загружены позже.');
          });

          const btnContainer = document.createElement('div');
          btnContainer.style.display = 'flex';
          btnContainer.style.justifyContent = 'center';
          btnContainer.style.marginTop = 'auto';

          btnContainer.appendChild(btn);
          btnContainer.appendChild(previewBtn);

          card.appendChild(btnContainer);
          container.appendChild(card);
        });
      </script>
    </body>
    </html>
  `;

  const newWindow = window.open();
  newWindow.document.write(html);
  newWindow.document.close();
}
