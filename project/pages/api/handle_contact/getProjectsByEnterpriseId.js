import db from "@/lib/db";

export default async function handler(req, res) {
    const { enterprise_id } = req.query;

    try {
        const query = `
            SELECT 
            projects.*,
            COALESCE(
            (
                SELECT json_agg(project_images.image_url ORDER BY project_images.id)
                FROM project_images
                WHERE project_images.project_id = projects.id
            ),
            '[]'
            ) AS images
            FROM projects
            WHERE enterprise_id = $1;
        `

        const value = [enterprise_id];

        const { rows } = await db.query(query, value);

        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching projects" })
    }
}