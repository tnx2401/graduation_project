import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const query = `
            WITH recent_news AS (
                SELECT id, title, content, created_date, view_count
                FROM news
                WHERE created_date >= NOW() - INTERVAL '15 days'
                AND view_count > 0
                ORDER BY view_count DESC
                LIMIT 5
            )
            SELECT id, title, content, created_date FROM (
                SELECT id, title, content, created_date, view_count FROM recent_news
                UNION ALL
                SELECT id, title, content, created_date, 0 AS view_count
                FROM news
                WHERE id NOT IN (SELECT id FROM recent_news)
                ORDER BY view_count DESC, created_date DESC
                LIMIT 5
            ) AS final_result
            LIMIT 5;
        `;

        const { rows } = await db.query(query);

        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching most watched news" });
    }
}
