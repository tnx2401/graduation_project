import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const { from_date, to_date } = req.body;

        console.log("From date: ", from_date, "To date: ", to_date);

        if (from_date && to_date) {
            try {
                // Extract YYYY, MM, DD manually to prevent local time zone issues
                const [fromYear, fromMonth, fromDay] = from_date.split("-").map(Number);
                const [toYear, toMonth, toDay] = to_date.split("-").map(Number);

                // Construct dates in UTC
                const from = new Date(Date.UTC(fromYear, fromMonth - 1, fromDay, 0, 0, 0, 0));
                const to = new Date(Date.UTC(toYear, toMonth - 1, toDay, 23, 59, 59, 999));

                console.log("From date: ", from.toISOString(), "To date: ", to.toISOString());

                const query = `
                    SELECT invoices.id, invoices.user_id, invoices.post_id, invoices.amount, invoices.created_at, posts.order, posts.contact_name
                    FROM invoices JOIN posts ON invoices.post_id = posts.id
                    WHERE created_at BETWEEN $1 AND $2 AND payment_status = $3 ORDER BY created_at DESC
                `;
                const { rows } = await db.query(query, [from, to, "Paid"]);
                console.log("Fetched invoices: ", rows.length);
                res.status(200).json(rows);
            } catch (error) {
                console.error("Error parsing dates: ", error.message);
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching user by id" })
    }
}