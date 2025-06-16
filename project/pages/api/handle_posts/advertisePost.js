import db from "@/lib/db";

export default async function handler(req, res) {
    const { post_id, condition } = req.body;

    try {
        const query = `UPDATE posts SET advertisement = $1 WHERE id = $2`;
        const values = [condition, post_id];

        await db.query(query, values);
        res.status(200).json({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error advertising post" })
    }
}