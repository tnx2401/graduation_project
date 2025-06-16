import db from "@/lib/db";

export default async function handler(req, res) {
    const { state, enterprise_id } = req.body;

    try {
        const query = `
            UPDATE enterprise SET state = $1 WHERE id = $2
        `

        const values = [state, enterprise_id];

        await db.query(query, values);

        res.status(200).json({ message: "Updating enterprise state succesfully" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error changing enterprise state" })
    }
}