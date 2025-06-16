import db from "@/lib/db";

export default async function handler(req, res) {
    const { id } = req.body;

    try {
        const query = `DELETE FROM news WHERE id = $1`;
        const values = [id];

        const result = await db.query(query, values);

        res.status(200).json({ message: "Delete new successfully" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting new" });
    }
}