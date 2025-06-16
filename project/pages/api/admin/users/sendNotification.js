import db from "@/lib/db";

export default async function handler(req, res) {
    const { uid, content } = req.body;

    try {
        // 1. Insert into notifications table and return inserted ID
        const insertNotificationQuery = `
      INSERT INTO notifications (content, type, created_at)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
        const insertNotificationValues = [content, "Thường", new Date().toISOString()];
        const notificationResult = await db.query(insertNotificationQuery, insertNotificationValues);
        const notificationId = notificationResult.rows[0].id;

        // 2. Link the notification to the user
        const insertNotificationUserQuery = `
      INSERT INTO notification_users (user_id, notification_id)
      VALUES ($1, $2)
    `;
        const insertNotificationUserValues = [uid, notificationId];
        await db.query(insertNotificationUserQuery, insertNotificationUserValues);

        res.status(200).json({ message: "Notification sent successfully" });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({ message: "Error sending notification" });
    }
}
