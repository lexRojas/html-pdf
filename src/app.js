const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('¡Bienvenido! Usa /pdf?url=tu-url-para-convertir');
});

app.get('/pdf', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('URL es requerida como parámetro de la consulta.');
  }

  try {
    // Lanzar el navegador
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Navegar a la URL proporcionada
    await page.goto(url);

    // Generar el PDF
    const pdfBuffer = await page.pdf({ format: 'A4' });

    // Cerrar el navegador
    await browser.close();

    // Enviar el PDF como respuesta
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="output.pdf"`
    });
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error al generar el PDF:', error);
    res.status(500).send('Ocurrió un error al generar el PDF.');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
