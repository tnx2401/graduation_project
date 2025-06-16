import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const { payload } = req.body;

        const query = `
            INSERT INTO post_reports (reasons, other_report, name, phone_number, address, post_id, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `

        const values = [
            payload.reason.join(","),
            payload.other_report,
            payload.name,
            payload.phone,
            payload.address,
            payload.post_id,
            new Date().toISOString()
        ]

        await db.query(query, values);

        res.status(200).json({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error reporting post" })
    }
}