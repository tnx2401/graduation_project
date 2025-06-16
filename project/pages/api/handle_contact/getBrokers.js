import db from "@/lib/db";

export default async function (req, res) {
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
            users.uid,
            users.username, 
            users.address, 
            users.profile_picture,
            users.phone_number, 
            STRING_AGG(DISTINCT CONCAT(posts.district, ', ', posts.province), ' | ') AS locations
            FROM users 
            JOIN posts ON users.phone_number = posts.phone_number
            WHERE posts.district IN (SELECT district FROM top_districts)
            GROUP BY
            users.uid,
            users.username, 
            users.address, 
            users.phone_number,
            users.profile_picture;
        `

        const { rows } = await db.query(query);

        res.status(200).json(rows)
    } catch (error) {
        console.log("Error fetching brokers: ", error);
        res.status(500).json({ message: "Error fetching brokers" })
    }
}