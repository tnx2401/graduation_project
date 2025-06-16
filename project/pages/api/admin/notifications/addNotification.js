import db from "@/lib/db";

export default async function handler(req, res) {
    const { newPost } = req.body;

    try {
        // 1. Insert the new notification and return its id
        const insertNotificationQuery = `
      INSERT INTO notifications (content, type, created_at)
      VALUES ($1, $2, $3)
      RETURNING id;
    `;
        const insertValues = [newPost.content, newPost.type, newPost.created_at];
        const result = await db.query(insertNotificationQuery, insertValues);
        const notificationId = result.rows[0].id;

        // 2. Get all users
        const usersResult = await db.query("SELECT uid FROM users");
        const userIds = usersResult.rows.map(user => user.uid);

        if (userIds.length > 0) {
            // 3. Insert a notification_user row for each user
            const insertUserNotificationsQuery = `
        INSERT INTO notification_users (user_id, notification_id)
        VALUES ${userIds.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(', ')};
      `;

            const insertValues = userIds.flatMap(userId => [userId, notificationId]);
            console.log(insertNotificationQuery);
            console.log(insertValues);

            await db.query(insertUserNotificationsQuery, insertValues);
        }

        res.status(200).json({ message: "Notification created and sent to users." });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding notification" });
    }
}
