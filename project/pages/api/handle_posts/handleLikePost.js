import db from "@/lib/db";

export default async function handler(req, res) {
    const { post_id, user_id, like } = req.body;

    console.log(`Post ID (${post_id}): `, like);
    console.log(user_id);


    try {
        if (like) {
            const query = `INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)`
            const values = [user_id, post_id]

            await db.query(query, values);
        } else {
            const query = `DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2`
            const values = [user_id, post_id]

            await db.query(query, values);
        }
        res.status(200).json({ message: "success" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error liking post" });
    }
}