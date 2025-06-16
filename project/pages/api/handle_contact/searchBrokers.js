import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const { filters } = req.body;

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
                AND ($1::text IS NULL OR users.username ILIKE '%' || $1 || '%')
                AND ($2::text IS NULL OR posts.province = $2)
            GROUP BY
                users.uid,
                users.username, 
                users.address, 
                users.phone_number,
                users.profile_picture;
        `;

        const values = [
            filters.content || null,
            filters.first || null,
        ];

        console.log(values);

        const result = await db.query(query, values);

        console.log(result.rows);

        res.status(200).json({ message: "Success", data: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error searching broker" });
    }
}
