import db from "@/lib/db";

export default async function handler(req, res) {
    const { year } = req.body;

    try {
        const query = `
            SELECT 
                EXTRACT(MONTH FROM created_date) AS month,
                SUM(total) AS total_income
            FROM membership_invoices
            WHERE EXTRACT(YEAR FROM created_date) = $1
            GROUP BY month
            ORDER BY month;
        `;

        const values = [year];
        const result = await db.query(query, values);

        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching year income" });
    }
}
