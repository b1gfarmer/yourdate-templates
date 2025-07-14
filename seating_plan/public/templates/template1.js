export function render(data) {
  const presidiumHTML = data
    .filter(t => t.type === 'presidium')
    .map(t => {
      const guests = t.guests.map(g => `<li>${g}</li>`).join('');
      return `
        <div class="table presidium">
          <h2>${t.name}</h2>
          <ul class="guests">${guests}</ul>
        </div>
      `;
    }).join('');

  const otherTablesHTML = data
    .filter(t => t.type !== 'presidium')
    .map(t => {
      const guests = t.guests.map(g => `<li>${g}</li>`).join('');
      return `
        <div class="table">
          <h2>${t.name}</h2>
          <ul class="guests">${guests}</ul>
        </div>
      `;
    }).join('');

  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8" />
      <title>План рассадки</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Open+Sans&display=swap" rel="stylesheet">
      <style>
        @page {
          size: A4 portrait;
          margin: 30mm 20mm 30mm 20mm;
        }

        html, body {
          padding: 0;
          margin: 0;
          background: #fffaf7;
          color: #4b3b30;
          font-family: 'Open Sans', sans-serif;
          -webkit-print-color-adjust: exact;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
          page-break-inside: avoid;
        }

        .leaf {
          text-align: right;
        }

        .header img {
          max-height: 250px;
          display: block;
          margin: 0 auto 20px;
          filter: drop-shadow(0 1px 1px rgba(0,0,0,0.1));
        }

        .header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 56px;
          margin: -40px 0 0;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #5a4436;
        }

        .leaves_box {
          text-align: center;
          margin: 20px 0;
          page-break-inside: avoid;
        }

        .leaves_box img {
          max-width: 300px;
          width: 100%;
          height: auto;
          display: block;
          margin: 0 auto;
        }

        .tables {
          display: flex;
          flex-direction: column;
          gap: 30px;
          max-width: 500px;
          margin: 0 auto 40px;
        }

        .table {
          background: #fff;
          border: 1px solid #e4dcd5;
          border-radius: 14px;
          padding: 20px 24px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.06);
          page-break-inside: avoid;
        }

        .table h2 {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 600;
          color: #7d5a50;
          margin: 0 0 16px;
          text-align: center;
          border-bottom: 1px solid #e4dcd5;
          padding-bottom: 8px;
        }

        .guests {
          font-size: 18px;
          color: #4b3b30;
          padding-left: 12px;
          margin: 0;
          list-style-type: disc;
          line-height: 1.5;
        }

        .guests li {
          margin-bottom: 6px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="leaf">
          <img src="/images/vecteezy_green-palm-leaves-casting-shadows-on-a-bright-transparent_57175785.png" alt="Листья" />
        </div>
        <h1>ДОБРО ПОЖАЛОВАТЬ НА СВАДЬБУ</h1>
      </div>

      <div class="leaves_box">
        <img class="leaves" src="/images/vecteezy_monstera-leaves-leaves-with-isolate-on-white-background_12933285.png" alt="Листья" />
      </div>

      ${presidiumHTML ? `<div class="tables">${presidiumHTML}</div>` : ''}

      <div class="tables">
        ${otherTablesHTML}
      </div>

      <div class="leaves_box">
        <img class="leaves_big" src="/images/vecteezy_green-leaf-vine-illustration_47522270.png" alt="Листья" />
      </div>
    </body>
    </html>
  `;
}
