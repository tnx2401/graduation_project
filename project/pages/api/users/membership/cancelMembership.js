import db from "@/lib/db";

export default async function handler(req, res) {
    const { uid } = req.body;

    try {

        const query = `UPDATE users SET membership_id = null WHERE uid = $1`;
        const benefitQuery = `DELETE FROM membership_benefit_usage WHERE user_id = $1`;

        const values = [uid];

        await db.query(query, values);
        await db.query(benefitQuery, values);

        res.status(200).json({ message: "Cancel membership successfully" });
        return;

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error cancelling membership" })
    }
}