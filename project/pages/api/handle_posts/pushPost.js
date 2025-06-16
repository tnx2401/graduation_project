import db from "@/lib/db";

export default async function handler(req, res) {
    const { order, post_id, user_id, balance, amount, minusDiscount } = req.body;

    try {
        const query = `UPDATE posts SET "order" = $1, pushed_at = $2 WHERE id = $3`;
        const values = [order, new Date().toISOString(), post_id];

        const query1 = `UPDATE users SET balance = $1 WHERE uid = $2`;
        const values1 = [balance, user_id];

        const query2 = `UPDATE invoices SET amount = $1 WHERE post_id = $2`
        const values2 = [amount, post_id];

        await db.query(query, values);
        await db.query(query1, values1);
        await db.query(query2, values2);


        if (minusDiscount) {
            const query3 = `UPDATE membership_benefit_usage SET remaining_quantity = remaining_quantity - 1 WHERE user_id = $1 AND benefit_type = $2`;
            const values3 = [user_id, 'freePushPosts'];
            await db.query(query3, values3);
        }

        res.status(200).json({ message: "Push post successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error pushing post" });
    }
}