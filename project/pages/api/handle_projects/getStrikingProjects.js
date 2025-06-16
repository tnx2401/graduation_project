import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const query = `
            SELECT 
            p.*, 
            COUNT(post.id) AS post_count,
            COALESCE(
            (
                SELECT json_agg(project_images.image_url ORDER BY project_images.id)
                FROM project_images
                WHERE project_images.project_id = p.id
            ),
            '[]'
            ) AS images
            FROM 
            public.projects p
            LEFT JOIN 
            public.posts post
            ON post.project = p.name 
                OR post.display_address ILIKE CONCAT('%', p.name, '%')
            GROUP BY 
            p.id
            ORDER BY 
            post_count DESC
            LIMIT 10;
        `

        const { rows } = await db.query(query);

        res.status(200).json(rows);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching striking posts" })
    }
}