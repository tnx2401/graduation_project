import db from "@/lib/db";

export default async function handler(req, res) {
    const { projectName } = req.query;

    try {

        const query = `
            SELECT posts.*,
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
            FROM posts JOIN invoices ON invoices.post_id = posts.id
            WHERE (project = $1 OR display_address LIKE CONCAT('%', $1, '%')) AND invoices.post_end_date > NOW();
        `

        const value = [projectName];


        const { rows } = await db.query(query, value);

        res.status(200).json(rows);

    } catch (error) {
        console.log("Error fetching posts by project", error);
        res.status(500).json({ message: "Error fetching posts" })
    }
}