import db from "@/lib/db";


export default async function handler(req, res) {
    const { notification_id, receiver_id } = req.body;

    try {

        const timestamp = new Date().toISOString();
        let query, values;

        if (notification_id === "all") {
            query = `UPDATE notification_users SET read_at = $1 WHERE user_id = $2 AND read_at IS NULL`;
            values = [timestamp, receiver_id];
        } else {
            query = `UPDATE notification_users SET read_at = $1 WHERE user_id = $2 AND notification_id = $3`;
            values = [timestamp, receiver_id, notification_id];
        }

        await db.query(query, values);
        res.status(200).json({ message: "Success" });

    } catch (error) {
        console.error("Error updating notification:", error);
        res.status(500).json({ message: "Error marking notification as read" });
    }
}
