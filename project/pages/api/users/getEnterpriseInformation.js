import db from "@/lib/db";
export default async function handler(req, res) {
    const { uid } = req.query;

    if (!uid) {
        return res.status(400).json({ message: "Missing uid" });
    }

    try {
        const query = `
        SELECT * FROM enterprise WHERE user_id = $1
        `;
        const values = [uid];

        const { rows } = await db.query(query, values);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error fetching enterprise information" });
        console.error(error);
    }
}