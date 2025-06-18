import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const { post_id } = req.query;

        console.log(post_id);

        const query = `UPDATE invoices SET is_sale = $1 WHERE post_id = $2`;
        const values = [true, post_id]

        await db.query(query, values);

        res.status(200).json({ message: "Okay" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating sale post" })
    }
}