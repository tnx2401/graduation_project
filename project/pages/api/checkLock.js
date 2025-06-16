import db from "@/lib/db";

export default async function handler(req, res) {
    const { uid } = req.body;

    try {
        const query = "SELECT is_lock FROM users WHERE uid = $1";
        const result = await db.query(query, [uid]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const isLocked = result.rows[0].is_lock;
        console.log(isLocked);
        return res.status(200).json({ isLocked });

    } catch (err) {
        console.error("Error checking lock status:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}