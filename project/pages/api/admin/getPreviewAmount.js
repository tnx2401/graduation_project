import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const postsQuery = `
            SELECT count(*) FROM invoices WHERE verify_status = 'Chờ duyệt' 
        `

        const postAmount = await db.query(postsQuery)

        const enterpriseQuery = `
            SELECT count(*) FROM enterprise WHERE status = 'Chờ duyệt' 
        `

        const enterpriseAmount = await db.query(enterpriseQuery);

        console.log({ postAmount: postAmount.rows[0], enterpriseAmount: enterpriseAmount.rows[0] })
        res.status(200).json({ postAmount: postAmount.rows[0], enterpriseAmount: enterpriseAmount.rows[0] });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting preview amount" });
    }
}