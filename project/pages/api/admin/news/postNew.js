import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { title, content, tags, summary, author_id } = req.body;

        const created_date = new Date().toISOString();

        try {
            // Validate the data (you can add more validation as needed)
            if (!title || !content || !tags || !created_date || !author_id) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const query = `INSERT INTO news (title, content, tags, summary, created_date, author_id) VALUES ($1, $2, $3, $4, $5, $6)`;
            const values = [title, content, tags, summary, created_date, author_id];

            await db.query(query, values);

            res.status(200).json({ message: "Data inserted successfully" });

        } catch (error) {
            console.error("Error processing data:", error);
            return res.status(500).json({ message: "Internal server error" });

        }


        return res.status(200).json({ message: "Data received successfully", title, content, tags });
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}