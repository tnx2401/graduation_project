import db from "@/lib/db";

export default async function handler(req, res) {
    const { user_id } = req.query;
    try {
        const query = `
            SELECT 
            post_likes.post_id,
            posts.demand,
            posts.title,
            invoices.post_start_date,
            COALESCE(
            (
                SELECT images_url
                FROM public.post_images
                WHERE post_images.post_id = post_likes.post_id
                ORDER BY id
                LIMIT 1
            ),
            ''
            ) AS image
            FROM post_likes 
            JOIN posts ON post_likes.post_id = posts.id
            JOIN invoices ON post_likes.post_id = invoices.post_id
            WHERE post_likes.user_id = $1
        `;
        const values = [user_id];

        const { rows } = await db.query(query, values);

        console.log(rows);

        res.status(200).json(rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching liked post" });
    }
}
