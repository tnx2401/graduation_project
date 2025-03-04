import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { post_id, view, interested } = req.body; // Use req.body for POST


    try {
        let query;
        let values;

        if (view) {
            query = `UPDATE posts SET view_count = $1 WHERE id = $2`;
            values = [view, post_id];
        } else if (interested) {
            query = `UPDATE posts SET interested_count = $1 WHERE id = $2`
            values = [interested, post_id];
        }

        await db.query(query, values);
        res.status(200).json({ message: "Stats updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error adding stats" })
    }
}