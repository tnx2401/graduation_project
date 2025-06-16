import db from "@/lib/db";

export default async function handler(req, res) {
    const { city_name } = req.body;

    try {
        const query = `
        SELECT COUNT(posts.district) AS posts, posts.district
        FROM posts
        JOIN invoices ON posts.id = invoices.post_id
        WHERE invoices.payment_status = 'Paid' 
        AND normalize(province, NFC) = normalize($1, NFC)
        GROUP BY posts.district
        ORDER BY posts DESC;
        `

        const value = [city_name];

        const { rows } = await db.query(query, value);

        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching city trend" })
        console.log(error);
    }
}