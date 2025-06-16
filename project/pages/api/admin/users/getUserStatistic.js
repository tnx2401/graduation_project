import db from "@/lib/db";

export default async function handler(req, res) {
    const { user_id } = req.body;
    console.log("user id: ", user_id);
    try {
        const query = `SELECT SUM(amount) as total_spend, COUNT(post_id) as posts_amount FROM invoices where user_id = $1`
        const values = [user_id.uid];


        const { rows } = await db.query(query, values);
        console.log(rows);
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching user statistic" })
    }
}