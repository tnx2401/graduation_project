import db from "@/lib/db";

export default async function handler(req, res) {
    const { day, month, year } = req.body;

    if (!month || !year) {
        return res.status(400).json({ message: "Invalid month or year" });
    }

    try {
        const startDay = new Date(year, month - 1, day, 0, 0, 0, 0);
        const endDay = new Date(year, month - 1, day, 23, 59, 50, 999);

        const startDayStr = startDay.toISOString();
        const endDayStr = endDay.toISOString();

        const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const startDateStr = startDate.toISOString();
        const endDateStr = endDate.toISOString();

        const invoiceQuery = `
                SELECT invoices.id, invoices.user_id, invoices.post_id, invoices.amount, invoices.created_at, posts.order, posts.contact_name
                FROM invoices JOIN posts ON invoices.post_id = posts.id
                WHERE invoices.created_at BETWEEN $1 AND $2 AND invoices.payment_status = $3
                ORDER BY invoices.created_at DESC
            `;
        const invoiceValues = [startDateStr, endDateStr, 'Paid'];

        const totalMonthQuery = `
                SELECT SUM(invoices.amount) AS total_month
                FROM invoices 
                WHERE invoices.created_at BETWEEN $1 AND $2 AND invoices.payment_status = $3
            `;
        const totalMonthValues = [startDateStr, endDateStr, 'Paid'];

        const invoiceDayQuery = `
                SELECT invoices.id, invoices.user_id, invoices.post_id, invoices.amount, invoices.created_at, posts.order
                FROM invoices JOIN posts ON invoices.post_id = posts.id
                WHERE invoices.created_at BETWEEN $1 AND $2 AND invoices.payment_status = $3
            `

        const invoiceDayValues = [startDayStr, endDayStr, 'Paid']

        const totalDayQuery = `
            SELECT SUM(invoices.amount) AS total_day
            FROM invoices
            WHERE invoices.created_at BETWEEN $1 AND $2 AND invoices.payment_status = $3
        `
        const totalDayValues = [startDayStr, endDayStr, 'Paid']

        const graphYearTotalIncomeQuery = `
                SELECT 
                    EXTRACT(YEAR FROM created_at) AS year,
                    EXTRACT(MONTH FROM created_at) AS month,
                    SUM(amount) AS total_amount
                FROM invoices
                GROUP BY year, month
                ORDER BY year, month;

        `

        const graphMonthTotalIncomeQuery = `
                SELECT 
                    EXTRACT(YEAR FROM created_at) AS year,
                    EXTRACT(MONTH FROM created_at) AS month,
                    EXTRACT(DAY FROM created_at) AS day,
                    SUM(amount) AS total_amount
                FROM invoices
                WHERE 
                    EXTRACT(YEAR FROM created_at) = $1
                    AND EXTRACT(MONTH FROM created_at) = $2
                GROUP BY year, month, day
                ORDER BY year, month, day;
        `

        const graphMonthTotalIncomeValues = [year, month];

        const graphCityTrendQuery = `
            SELECT COUNT(province) as posts, posts.province 
            FROM posts JOIN invoices on posts.id = invoices.post_id
            WHERE invoices.payment_status = 'Paid'
            GROUP BY posts.province ORDER BY posts DESC;
        `

        const [invoiceResult, totalResult, dayInvoiceResult, totalDayResult, yearTotalIncome, monthTotalIncome, graphCityTrend] = await Promise.all([
            db.query(invoiceQuery, invoiceValues),
            db.query(totalMonthQuery, totalMonthValues),
            db.query(invoiceDayQuery, invoiceDayValues),
            db.query(totalDayQuery, totalDayValues),
            db.query(graphYearTotalIncomeQuery),
            db.query(graphMonthTotalIncomeQuery, graphMonthTotalIncomeValues),
            db.query(graphCityTrendQuery)
        ]);

        res.status(200).json({
            text_report: {
                day_invoices: dayInvoiceResult.rows,
                total_day: totalDayResult.rows[0].total_day || 0,
                month_invoices: invoiceResult.rows,
                total_month: totalResult.rows[0].total_month || 0,
            },
            graph_report: {
                month_total_income: yearTotalIncome.rows,
                day_total_income: monthTotalIncome.rows,
                city_trend: graphCityTrend.rows,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching invoices" });
    }
}
