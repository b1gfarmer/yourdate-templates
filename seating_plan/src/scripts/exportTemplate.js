import * as html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function addImageToPDF(pdf, imgData) {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);
      const imgRenderWidth = imgWidth * ratio;
      const imgRenderHeight = imgHeight * ratio;

      // Центрируем картинку на странице
      const x = (pageWidth - imgRenderWidth) / 2;
      const y = (pageHeight - imgRenderHeight) / 2;

      pdf.addImage(imgData, 'JPEG', x, y, imgRenderWidth, imgRenderHeight);
      resolve();
    };
    img.src = imgData;
  });
}

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
        const module = await import(`./templates-export_scripts/${template.id}.js`);
        const html = module.render(seatingData);

        // === Создаём контейнер под экспорт ===
        const exportDiv = document.createElement('div');
        exportDiv.id = 'pdf-export';
        exportDiv.style.position = 'fixed';
        exportDiv.style.top = '0';
        exportDiv.style.left = '0';
        exportDiv.style.width = '794px';    // A4 формат в пикселях
        exportDiv.style.height = '1123px';
        exportDiv.style.zIndex = '9999';
        exportDiv.style.background = 'white';
        exportDiv.style.padding = '40px';
        exportDiv.style.boxSizing = 'border-box';
        exportDiv.style.overflow = 'hidden';
        exportDiv.innerHTML = html;

        document.body.appendChild(exportDiv);

        // Подождём отрисовку
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

        // Генерация PDF
        const pdf = new jsPDF('portrait', 'pt', 'a4');

        const canvas = await html2canvas(exportDiv, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);

        // Добавляем первую страницу — шаблон
        pdf.addImage(imgData, 'JPEG', 0, 0, 595.28, 841.89); // A4 в pt

        // Вторая страница — скрин конфигуратора
        const screenshotData = sessionStorage.getItem('seatingScreenshot');
        if (screenshotData) {
          pdf.addPage();
          const img = new Image();
          img.src = screenshotData;

          await new Promise((resolve) => {
            img.onload = () => {
              const ratio = Math.min(595.28 / img.width, 841.89 / img.height);
              const w = img.width * ratio;
              const h = img.height * ratio;
              const x = (595.28 - w) / 2;
              const y = (841.89 - h) / 2;
              pdf.addImage(img, 'JPEG', x, y, w, h);
              resolve();
            };
          });
        }

        pdf.save('guest-seating-plan.pdf');

        // Удаляем временный контейнер
        document.body.removeChild(exportDiv);
        window.location.reload();

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
