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
        button {
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          border: none;
          border-radius: 6px;
          transition: background-color 0.2s ease;
          margin-right: 10px;
        }
        .btn-export {
          background-color: #4CAF50;
          color: white;
        }
        .btn-export:hover {
          background-color: #45a049;
        }
        .btn-preview {
          background-color: #2196F3;
          color: white;
        }
        .btn-preview:hover {
          background-color: #1976D2;
        }
        #loader {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(255, 255, 255, 0.8);
          z-index: 1000;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: #007bff;
          font-weight: 700;
          user-select: none;
        }
        @keyframes blink {
          0%, 20% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        #loader span {
          display: inline-block;
          animation-name: blink;
          animation-duration: 1.5s;
          animation-iteration-count: infinite;
        }
        #loader span:nth-child(2) { animation-delay: 0.3s; }
        #loader span:nth-child(3) { animation-delay: 0.6s; }
      </style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    </head>
    <body>
      <h1>Выберите шаблон для экспорта рассадки</h1>
      <div class="template-grid" id="templates-container"></div>
      <div id="loader">Загрузка<span>.</span><span>.</span><span>.</span></div>

      <script type="module">
        const seatingData = ${JSON.stringify(seatingData)};
        const templates = ${JSON.stringify(templates)};

        const container = document.getElementById('templates-container');
        const loader = document.getElementById('loader');

        function setLoading(isLoading) {
          loader.style.display = isLoading ? 'flex' : 'none';
        }

        function waitForImages(doc) {
          return Promise.all(Array.from(doc.images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.onload = img.onerror = resolve;
            });
          }));
        }

        templates.forEach(template => {
          const card = document.createElement('div');
          card.className = 'template-card';

          const nameDiv = document.createElement('div');
          nameDiv.className = 'template-name';
          nameDiv.textContent = template.name;
          card.appendChild(nameDiv);

          const btnExport = document.createElement('button');
          btnExport.textContent = 'Экспортировать';
          btnExport.className = 'btn-export';

          const btnPreview = document.createElement('button');
          btnPreview.textContent = 'Посмотреть шаблон';
          btnPreview.className = 'btn-preview';

          btnExport.addEventListener('click', async () => {
            try {
              setLoading(true);
              btnExport.disabled = true;
              btnPreview.disabled = true;

              const module = await import('/templates/' + template.id + '.js');
              const htmlContent = module.render(seatingData);

              const iframe = document.createElement('iframe');
              iframe.style.position = 'fixed';
              iframe.style.left = '-9999px';
              iframe.style.width = '210mm';
              iframe.style.height = '297mm';
              iframe.style.border = 'none';
              document.body.appendChild(iframe);

              const iframeDoc = iframe.contentWindow.document;
              iframeDoc.open();
              iframeDoc.write(htmlContent);
              iframeDoc.close();

              iframe.onload = async () => {
                await waitForImages(iframe.contentDocument);

                const opt = {
                  margin: [30, 20],
                  filename: 'guest-seating-plan.pdf',
                  image: { type: 'jpeg', quality: 1 },
                  html2canvas: {
                    scale: 3,
                    useCORS: true,
                    allowTaint: false,
                    logging: false,
                    windowWidth: 1200
                  },
                  jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                  }
                };

                await html2pdf().set(opt).from(iframe.contentDocument.body).save();
                document.body.removeChild(iframe);
                setLoading(false);
                btnExport.disabled = false;
                btnPreview.disabled = false;
              };

            } catch (err) {
              setLoading(false);
              btnExport.disabled = false;
              btnPreview.disabled = false;
              alert('Ошибка при экспорте: ' + err.message);
            }
          });

          btnPreview.addEventListener('click', () => {
            window.open('/templates/' + template.id + '.html', '_blank');
          });

          const btnContainer = document.createElement('div');
          btnContainer.style.display = 'flex';
          btnContainer.appendChild(btnExport);
          btnContainer.appendChild(btnPreview);

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