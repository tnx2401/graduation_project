import db from "@/lib/db";

export default async function handler(req, res) {
    const { category } = req.query;

    try {
        const query = `SELECT enterprise.*, users.phone_number FROM enterprise JOIN users ON enterprise.user_id = users.uid WHERE main_field = $1 ORDER BY created_date DESC`;
        const values = [category];

        const { rows } = await db.query(query, values);
        res.status(200).json(rows);

    } catch (error) {
        console.log("Error fetching enterprise by category: ", error);
        res.status(500).json({ message: "Error fetching enterprise by category" })
    }
}