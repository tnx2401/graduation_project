import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const { userId, postIds } = req.body;

        // Step 1: Ensure postIds is valid
        if (!Array.isArray(postIds) || postIds.length === 0) {
            return res.status(400).json({ error: "Invalid postIds input" });
        }

        // Step 2: If user is not logged in, skip DB insert but still return success
        if (!userId) {
            console.log("Unauthenticated user - skipping insert.");
            return res.status(200).json({ message: "User not logged in. Skipped insert." });
        }

        // Step 3: Insert for authenticated users
        const values = postIds
            .map((_, i) => `($1, $${i + 2})`)
            .join(", ");
        const params = [userId, ...postIds];

        const query = `
      INSERT INTO user_post_views (user_id, post_id)
      VALUES ${values}
      ON CONFLICT (user_id, post_id) DO NOTHING;
    `;

        // Uncomment below when using a DB client
        await db.query(query, params);

        console.log("Inserted views for user:", params);
        return res.status(200).json({ message: "Inserted" });

    } catch (error) {
        console.error("Error inserting post views:", error);
        return res.status(500).json({ message: "Error inserting post_view_users" });
    }
}
