import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const query = `SELECT uid, username, profile_picture FROM users WHERE uid = $1`;

        const { rows } = await db.query(query, [req.body.uid]);
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching user by id" })
    }

}