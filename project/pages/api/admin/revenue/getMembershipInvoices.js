import db from "@/lib/db";

export default async function handler(req, res) {
    const { day, month, year } = req.body;

    try {

        const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();

        const query = `
            SELECT 
            membership_invoices.*, 
            users.username, users.phone_number, 
            membership_name 
            FROM membership_invoices 
            JOIN users ON users.uid = membership_invoices.user_id 
            JOIN membership ON membership_invoices.membership_id = membership.id
            WHERE created_date BETWEEN $1 AND $2
            ORDER BY created_date DESC
        `

        const values = [startDateStr, endDateStr];
        const { rows } = await db.query(query, values);

        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching membership invoices" })
    }
}