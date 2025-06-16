import db from "@/lib/db";

export default async function handler(req, res) {
    const { uid } = req.body;
    try {
        const query = `SELECT contacts, balance, discount_balance, (SELECT COUNT(posts.id) FROM posts JOIN invoices ON posts.id = invoices.post_id WHERE invoices.post_end_date > NOW() AND invoices.verify_status = 'Đã duyệt' AND invoices.user_id = $1) as post_count 
                        FROM users
                        LEFT JOIN posts ON users.phone_number = posts.phone_number
                        WHERE uid = $2
                        GROUP BY users.contacts, users.balance, users.discount_balance
                        `
        const values = [uid, uid]

        const { rows } = await db.query(query, values);

        res.status(200).json(rows);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Error fetching general info" })
    }
}