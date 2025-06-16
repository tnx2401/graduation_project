import db from "@/lib/db";

export default async function handler(req, res) {
    const { category, enterprise_id } = req.query;

    try {
        const query = `
            SELECT * 
            FROM enterprise 
            WHERE main_field = $1 AND id != $2 
            ORDER BY created_date DESC
        `;
        const values = [category, enterprise_id];

        const { rows } = await db.query(query, values);
        res.status(200).json(rows);

    } catch (error) {
        console.log("Error fetching enterprise by category: ", error);
        res.status(500).json({ message: "Error fetching enterprise by category" })
    }
}