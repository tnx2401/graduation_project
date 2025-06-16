import db from "@/lib/db";

export default async function handler(req, res) {

    const { receiver_id } = req.query;


    try {
        const query = `
           SELECT * 
            FROM notifications 
            JOIN notification_users ON notification_users.notification_id = notifications.id 
            WHERE user_id = $1 AND read_at IS NULL
        `

        const values = [receiver_id];

        const { rows } = await db.query(query, values);

        res.status(200).json(rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching notifications" })
    }
}