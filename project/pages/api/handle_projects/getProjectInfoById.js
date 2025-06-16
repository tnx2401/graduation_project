import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const { projectId } = req.query;

        const query = `
        SELECT projects.*,
        COALESCE(
          (
            SELECT json_agg(image_url ORDER BY id)
            FROM (
              SELECT DISTINCT project_images.image_url, project_images.id
              FROM public.project_images
              WHERE project_images.project_id = projects.id
            ) sub
          ), 
          '[]'
        ) AS images
        FROM projects
        WHERE id = $1
        `

        const value = [projectId];

        const projectInfo = await db.query(query, value);

        res.status(200).json(projectInfo.rows[0])

    } catch (error) {
        console.log("Error fetching project info: ", error);
        res.status(500).json({ message: "Error fetching project info" })
    }
}