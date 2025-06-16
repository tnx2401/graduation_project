import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(403).json({ message: "Method is not allowed" });
    }

    const { post_id, verify_status, balance, uid, refund_reason, user_id } = req.body;

    try {
        const query = `UPDATE invoices SET verify_status = $1 WHERE post_id = $2`;
        const values = [verify_status, post_id];

        await db.query(query, values);

        if (verify_status === 'Không duyệt') {
            const query1 = `UPDATE users SET balance = $1 WHERE uid = $2`
            const values1 = [balance, uid]
            await db.query(query1, values1);

            const query2 = `UPDATE invoices SET payment_status = $1, refund_reason = $2 WHERE post_id = $3`
            const values2 = ['Refunded', refund_reason, post_id]
            await db.query(query2, values2);

            const notifResult = await db.query(
                `INSERT INTO notifications (content, type, created_at)
                 VALUES ($1, $2, $3)
                 RETURNING id`,
                [`Tin đăng mã ${post_id} của bạn không được duyệt với lý do "${refund_reason}"`, "Thường", new Date().toISOString()]
            );

            const notificationId = notifResult.rows[0].id;

            // 5. Link notification to user
            await db.query(
                `INSERT INTO notification_users (user_id, notification_id)
                 VALUES ($1, $2)`,
                [uid, notificationId]
            );

        } else {
            const notifResult1 = await db.query(
                `INSERT INTO notifications (content, type, created_at)
                 VALUES ($1, $2, $3)
                 RETURNING id`,
                [`Tin đăng mã ${post_id} của bạn đã được duyệt!"`, "Thường", new Date().toISOString()]
            );

            const notificationId = notifResult1.rows[0].id;

            // 5. Link notification to user
            await db.query(
                `INSERT INTO notification_users (user_id, notification_id)
                 VALUES ($1, $2)`,
                [user_id, notificationId]
            );

        }
        res.status(200).json({ message: "Post updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating post" })
    }
}