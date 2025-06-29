import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const query = `SELECT * FROM enterprise WHERE state IS NOT NULL`;

        const { rows } = await db.query(query);

        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching enterprises" });
    }
}
