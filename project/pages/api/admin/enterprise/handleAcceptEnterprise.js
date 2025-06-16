import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const { id } = req.body;

        const currentDate = new Date().toISOString();

        const query = "UPDATE enterprise SET status = $1, created_date = $2, state = $3 WHERE id = $4";
        const values = ["Đã duyệt", currentDate, "Đang hoạt động", id]

        await db.query(query, values);

        res.status(200).json({ message: "Accepted" })
    } catch (error) {
        console.log("Error accepting enterprise:", error);
        res.status(500).json({ message: "Error accepting enterprise" });
    }
}