import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { id, title, content, tags, summary } = req.body;

    try {
        const query = `
      UPDATE news 
      SET title = $1, tags = $2, content = $3, summary = $4, last_update = $5 
      WHERE id = $6
    `;
        const values = [
            title,
            tags,
            content,
            summary,
            new Date().toISOString(),
            id,
        ];

        await db.query(query, values);

        return res.status(200).json({ message: "Update news successfully" });
    } catch (error) {
        console.error("Error updating news:", error);
        return res.status(500).json({ message: "Error updating news" });
    }
}
