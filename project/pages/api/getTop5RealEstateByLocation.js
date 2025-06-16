import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const query = `
        SELECT 
            province,
            COUNT(*) AS total_posts
        FROM 
            posts
        JOIN 
            invoices ON posts.id = invoices.post_id
        WHERE 
            verify_status = 'Đã duyệt'
            AND post_end_date > NOW()
        GROUP BY 
            province
        ORDER BY 
            total_posts DESC
        LIMIT 5;
        `

        const { rows } = await db.query(query);

        res.status(200).json(rows);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching top 5 location" })
    }
}