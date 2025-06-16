import db from "@/lib/db";
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const query = `SELECT * FROM membership ORDER BY id ASC`;
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting membership prices" });
    }
}