import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    const { nam_sinh, gioi_tinh, huong } = req.body;

    console.log("nam sinh", nam_sinh);
    console.log("gioi tinh", gioi_tinh);
    console.log("huong", huong);

    if (!nam_sinh || !gioi_tinh || !huong) {
        return res.status(400).json({ error: 'Missing query params' });
    }

    const url = `https://phongthuyso.vn/huong-nha-tuoi-${nam_sinh}.html`;

    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        // Wait for the form to load (adjust selector)
        await page.waitForSelector('form[name="frm_xem_huong_nha"]');

        // Select gender radio by clicking
        await page.evaluate((gioi_tinh) => {
            const radio = document.querySelector(`input[name="gioi_tinh"][value="${gioi_tinh}"]`);
            if (radio) radio.click();
        }, gioi_tinh);

        // Select house direction dropdown
        await page.select('select[name="huong"]', huong);

        // Submit the form and wait for navigation
        await Promise.all([
            page.click('form[name="frm_xem_huong_nha"] input[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
        ]);

        // Extract result (adjust selectors to real ones on result page)
        const result = await page.evaluate(() => {
            const description = document.getElementById('text_description')?.textContent?.trim() || '';
            const detail = document.getElementById('line1')?.textContent?.trim() || '';
            const line2 = document.getElementById('line2')?.textContent?.trim() || '';
            const line3 = document.getElementById('line3')?.textContent?.trim() || '';
            return { description, detail, line2, line3 };
        });

        await browser.close();
        return res.status(200).json(result);

    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'Failed to scrape site' });
    }
}
