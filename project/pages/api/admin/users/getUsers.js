import db from "@/lib/db";
import admin from "@/lib/firebaseAdmin";


export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(403).json({ message: "Method is not allowed" });
    }

    try {
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        const query = `SELECT role_id FROM users WHERE uid = $1`
        const values = [decodedToken.uid];

        const role_id = await db.query(query, values);

        if (role_id.rows[0].role_id === 1) {
            const query1 = `SELECT * FROM users`
            const { rows } = await db.query(query1);

            res.status(200).json(rows)
        } else {
            res.status(200).json({ message: "You dont have permission" })
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error getting posts" })
    }
}