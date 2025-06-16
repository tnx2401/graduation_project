import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { id } = req.body;

        try {
            // Validate the data (you can add more validation as needed)
            if (!id) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const query = `SELECT * FROM news JOIN users ON news.author_id = users.uid WHERE id = $1`;
            const values = [id];

            const result = await db.query(query, values);

            if (result.rows.length === 0) {
                return res.status(404).json({ message: "News not found" });
            }

            const updateNewStatQuery = `UPDATE news SET view_count = view_count + 1 WHERE id = $1`

            await db.query(updateNewStatQuery, values);

            res.status(200).json(result.rows[0]);

        } catch (error) {
            console.error("Error processing data:", error);
            return res.status(500).json({ message: "Internal server error" });

        }
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}