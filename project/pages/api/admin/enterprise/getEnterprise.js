import db from "@/lib/db";

export default async function handler(req, res) {
    try {

        const query = 'SELECT enterprise.*, users.phone_number, users.username FROM public.enterprise JOIN users ON enterprise.user_id = users.uid ORDER BY id ASC'

        const { rows } = await db.query(query);

        res.status(200).json(rows)

    } catch (error) {
        console.log("Error fetching enterprise: ", error);
        res.status(500).json({ message: "Error fetching enterprise" });
    }
}