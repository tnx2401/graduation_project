import db from "@/lib/db";
export default async function handler(req, res) {
    const { post_id, ad_view, user_id } = req.body;
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
    try {
        const query = `UPDATE posts SET advertisement_view_count = $1 WHERE id = $2`;
        const values = [ad_view, post_id];
        await db.query(query, values);

        if (user_id) {
            const subtractMoneyQuery = `UPDATE users SET balance = balance - 1000 WHERE uid = $1`;
            const subtractMoneyValues = [user_id];
            await db.query(subtractMoneyQuery, subtractMoneyValues);
        }

        if (post_id) {
            const updateInvoiceQuery = `UPDATE invoices SET amount = amount + 1000 WHERE post_id = $1`;
            const updateInvoiceValues = [post_id];
            await db.query(updateInvoiceQuery, updateInvoiceValues);
        }
        res.status(200).json({ message: "Stats updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding stats" })
    }
}