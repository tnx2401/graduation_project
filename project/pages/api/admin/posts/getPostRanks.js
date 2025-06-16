import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const query = `SELECT 
                            post_ranks.*, 
                            JSON_AGG(post_rank_prices.* ORDER BY post_rank_prices.days ASC) AS rank_prices
                        FROM public.post_ranks
                        LEFT JOIN post_rank_prices ON post_ranks.id = post_rank_prices.rank_id
                        GROUP BY post_ranks.id
                        ORDER BY post_ranks.id ASC;
                    `;
        const { rows } = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error getting post ranks" });
    }
}