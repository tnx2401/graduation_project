import db from "@/lib/db";

export default async function handler(req, res) {
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
      ORDER BY id DESC
    `;

    const { rows } = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching projects: ", error);
    res.status(500).json({ message: "Failed fetching projects" });
  }
}
