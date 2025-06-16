import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }


    const { editedPrices } = req.body;
    console.log(editedPrices);
    const formattedArray = Object.entries(editedPrices).map(([id, data]) => ({
        id: Number(id),
        price_per_day: Number(data.price_per_day), // Convert price to number
        days: data.days
    }));

    // Update the prices in the database using SQL
    for (const { id, days, price_per_day } of formattedArray) {
        const query = `
            UPDATE post_rank_prices
            SET price_per_day = $1, total_price = $2
            WHERE id = $3
        `;
        const values = [price_per_day, price_per_day * days, id];
        console.log(query, values);
        await db.query(query, values);

        if (id === 1 || id === 4 || id === 7 || id === 10) {
            const query = `
                UPDATE post_ranks
                SET base_price = $1
                WHERE id = $2
            `;
            const values = [price_per_day, id === 1 ? 1 : id === 4 ? 2 : id === 7 ? 3 : 4];
            console.log(query, values);
            await db.query(query, values);
        }
    }

    return res.status(200).json({ message: 'success' });
}