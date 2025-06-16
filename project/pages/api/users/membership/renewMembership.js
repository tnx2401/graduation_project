import db from "@/lib/db";

export default async function handler(req, res) {
    const { user_id, membership_id, created_date, end_date, total } = req.body;

    console.log(user_id, membership_id, created_date, end_date, total);

    try {
        const formatDate = (date) => {
            const d = new Date(date);
            const pad = (n) => n.toString().padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        };

        const formattedCreatedDate = formatDate(created_date);
        const formattedEndDate = formatDate(end_date);

        const query = `
      INSERT INTO membership_invoices (user_id, membership_id, created_date, end_date, total)
      VALUES ($1, $2, $3, $4, $5)
    `;
        const values = [user_id, membership_id, formattedCreatedDate, formattedEndDate, Number(total)];

        const subtractMoneyQuery = `UPDATE users SET balance = balance - $1 WHERE uid = $2`
        const subtractMoneyValues = [Number(total), user_id];

        await db.query(query, values);
        await db.query(subtractMoneyQuery, subtractMoneyValues);

        res.status(200).json({ message: "Invoice created successfully" });
        return;
    } catch (error) {
        console.error("Invoice creation failed:", error);
        res.status(500).json({ message: "Error creating invoice" });
    }
}
