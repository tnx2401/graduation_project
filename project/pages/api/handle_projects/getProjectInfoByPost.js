import db from "@/lib/db";

export default async function handler(req, res) {
    const { project, postAddress } = req.body;

    try {
        const query = `
      SELECT projects.id, projects.name, enterprise.name AS enterprise_name,
      COALESCE(
                (
                SELECT image_url
                FROM (
                    SELECT project_images.image_url
                    FROM project_images
                    WHERE project_images.project_id = projects.id
                    ORDER BY project_images.id
                    LIMIT 1
                ) sub
                ),
                '[]'
            ) AS image
      FROM projects
      JOIN enterprise ON projects.enterprise_id = enterprise.id
      WHERE projects.name = $1 OR $2 ILIKE '%' || projects.name || '%'
    `;

        const values = [project, postAddress];
        const { rows } = await db.query(query, values);

        res.status(200).json(rows[0]);
    } catch (error) {
        console.log("Error fetching project info by post: ", error);
        res.status(500).json({ message: "Error fetching project info by post" });
    }
}
