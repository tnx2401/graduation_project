import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const query = `SELECT * FROM news JOIN users ON news.author_id = users.uid ORDER BY created_date DESC`;

        const { rows } = await db.query(query);
        res.status(200).json(rows);

    } catch (error) {
        console.error("Error processing data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}