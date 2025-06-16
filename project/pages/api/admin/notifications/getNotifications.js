import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const query = `
            SELECT * FROM notifications WHERE type = $1 OR type = $2
        `

        const values = ["Thông báo", "Quan trọng"]

        const { rows } = await db.query(query, values);
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching notifications" })
    }
}