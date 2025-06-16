// pages/api/xemTuoiLamNha.js
import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    const { age, build_year } = req.body;

    console.log(age, build_year);

    if (!age || !build_year) {
        res.status(400).json({ error: 'Missing age or build_year in request body' });
        return;
    }

    const url = `https://phongthuyso.vn/xem-tuoi-lam-nha-nam-${build_year}-tuoi-${age}.html`;

    try {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'], // for some server environments
        });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        const content = await page.evaluate(() => {
            const el = document.querySelector('.list_items');
            return el ? el.innerText : null;
        });

        await browser.close();

        if (!content) {
            return res.status(404).json({ error: 'Content not found on page' });
        }

        res.status(200).json({ content });
    } catch (error) {
        console.error('Puppeteer error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
