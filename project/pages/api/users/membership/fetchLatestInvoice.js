import db from "@/lib/db";

export default async function handler(req, res) {
    const { uid } = req.query;

    try {
        const query = `SELECT * FROM membership_invoices WHERE user_id = $1 ORDER BY end_date DESC LIMIT 5`

        const values = [uid];

        const { rows } = await db.query(query, values);

        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching user's membership invoices" })
    }
}