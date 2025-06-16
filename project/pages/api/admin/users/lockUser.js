import db from "@/lib/db";

export default async function handler(req, res) {
    const { isLock, uid } = req.body;

    console.log("Called");
    console.log(isLock, uid);

    try {
        const query = `UPDATE users SET is_lock = $1 WHERE uid = $2`;
        const values = [isLock, uid];

        const result = await db.query(query, values);

        res.status(200).json({ message: "Success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error locking user" });
    }
}