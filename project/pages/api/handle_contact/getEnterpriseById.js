import db from "@/lib/db";

export default async function handler(req, res) {
    const { enterprise_id } = req.query;

    try {

        const query = `
            SELECT 
            *
            FROM public.enterprise 
            WHERE enterprise.id = $1
        `

        const value = [enterprise_id];

        const { rows } = await db.query(query, value);

        res.status(200).json(rows[0])

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching enterprise" })
    }
}