import db from "@/lib/db";

export default async function handler(req, res) {
    const { filters } = req.body;

    console.log(filters);

    try {
        let baseQuery = `SELECT enterprise.*, users.phone_number
            FROM enterprise
            JOIN users ON enterprise.user_id = users.uid
            WHERE enterprise.state IS NOT NULL`;
        const queryParams = [];
        const conditions = [];

        // Optional content search (e.g. search by name or description)
        if (filters?.content) {
            queryParams.push(`%${filters.content}%`);
            conditions.push(`(name ILIKE $${queryParams.length} OR description ILIKE $${queryParams.length})`);
        }

        // Optional first filter (e.g. category or type)
        if (filters?.first) {
            queryParams.push(filters.first);
            conditions.push(`main_field = $${queryParams.length}`);
        }

        // Optional second filter (e.g. region or level)
        if (filters?.second) {
            queryParams.push(`%${filters.second}%`);
            conditions.push(`enterprise.address ILIKE $${queryParams.length}`);
        }

        if (conditions.length > 0) {
            baseQuery += " AND " + conditions.join(" AND ");
        }

        const { rows } = await db.query(baseQuery, queryParams);

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error searching enterprises:", error);
        res.status(500).json({ message: "Error searching enterprises" });
    }
}
