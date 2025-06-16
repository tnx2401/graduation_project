import db from "@/lib/db";

export default async function handler(req, res) {
    const { uid } = req.query;
    const currentDate = new Date().toISOString();

    try {
        const query = `
            SELECT 
            posts.*,
            invoices.payment_status,
            invoices.verify_status,
            invoices.post_start_date,
            invoices.post_end_date,
            invoices.created_at,
            invoices.amount,
            post_ranks.name as rank_name,
            COALESCE(
                    (
                        SELECT json_agg(images_url ORDER BY id)
                        FROM (
                        SELECT DISTINCT post_images.images_url, post_images.id
                        FROM public.post_images
                        WHERE post_images.post_id = posts.id
                        ) sub
                    ), 
                    '[]'
                    ) AS images
            FROM invoices 
            JOIN users ON invoices.user_id = users.uid
            JOIN posts ON invoices.post_id = posts.id
            JOIN post_ranks ON posts.rank_id = post_ranks.id
            WHERE invoices.user_id = $1 AND invoices.post_end_date >= $2
            ORDER BY invoices.post_start_date DESC
        `

        const values = [uid, currentDate];
        const { rows } = await db.query(query, values);
        console.log(rows);
        res.status(200).json(rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving posts by user id" })
    }
}