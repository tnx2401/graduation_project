import db from "@/lib/db";

export default async function (req, res) {
    const { type, address, province, district, post_id } = req.body;

    try {
        const query = `
            SELECT *,
            invoices.post_start_date,
             COALESCE(
                (
                SELECT images_url
                FROM (
                    SELECT post_images.images_url
                    FROM post_images
                    WHERE post_images.post_id = posts.id
                    ORDER BY post_images.id
                    LIMIT 1
                ) sub
                ),
                '[]'
            ) AS image
            FROM posts JOIN invoices on posts.id = invoices.post_id
            WHERE type = $1 AND (display_address = $2 OR (province = $3 AND district = $4)) AND posts.id != $5 AND invoices.post_end_date > $6
        `

        const values = [type, address, province, district, post_id, new Date().toISOString()];

        const { rows } = await db.query(query, values);
        res.status(200).json(rows);
    } catch (error) {
        console.log("Error fetching similar posts: ", error);
        res.status(500).json({ message: "Error fetching posts" })
    }
}