import db from "@/lib/db";

export default async function handler(req, res) {
    const { uid } = req.body;

    try {
        const query = `SELECT * FROM users WHERE uid = $1`;
        const values = [uid];

        const { rows } = await db.query(query, values);
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching user by id" })
    }
}