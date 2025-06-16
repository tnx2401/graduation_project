import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const { enterprise_id } = req.query;

        const query = `SELECT 
                            p.*, 
                            pi.image_url AS thumbnail
                        FROM 
                            projects p
                        JOIN LATERAL (
                            SELECT image_url 
                            FROM project_images 
                            WHERE project_id = p.id 
                            ORDER BY id ASC 
                            LIMIT 1
                        ) pi ON true
                        WHERE 
                            p.enterprise_id = $1;
                    `;
        const values = [enterprise_id];

        const { rows } = await db.query(query, values);
        res.status(200).json(rows);
    } catch (error) {
        console.log("Error fetching project: ", error);
        res.status(500).json({ message: "Error fetching project" })
    }
}