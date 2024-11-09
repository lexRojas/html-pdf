const express = require('express');
const { chromium } = require('playwright');

const app = express();
const PORT = 3001; // Puedes cambiar el puerto si es necesario

app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Hola desde Express en Netlify!');
  });

app.post('/generate-pdf', async (req, res) => {
    const { htmlContent } = req.body;

    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Failed to generate PDF');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
