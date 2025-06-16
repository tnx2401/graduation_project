import db from "@/lib/db";

export default async function handler(req, res) {
    const { userId } = req.query;

    try {
        const query = `
        WITH top_districts AS (
            SELECT district
            FROM posts
            GROUP BY district
            ORDER BY COUNT(*) DESC
            LIMIT 3
            )

            SELECT
            users.*, 
            STRING_AGG(DISTINCT CONCAT(posts.district, ', ', posts.province), ' | ') AS locations
            FROM users 
            JOIN posts ON users.phone_number = posts.phone_number
            WHERE posts.district IN (SELECT district FROM top_districts) AND users.uid = $1
            GROUP BY users.uid
        `

        const value = [userId];

        const data = await db.query(query, value);
        res.status(200).json(data.rows[0]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching broker" });
    }
}