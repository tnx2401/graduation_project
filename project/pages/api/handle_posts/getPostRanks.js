import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const query = `SELECT post_ranks.*, 
                        COALESCE(
                            (
                            SELECT json_agg(json_build_object(
                                'days', post_rank_prices.days,
                                'price_per_day', post_rank_prices.price_per_day,
                                'total_price', post_rank_prices.total_price
                            ) ORDER BY post_rank_prices.id)
                            FROM public.post_rank_prices
                            WHERE post_rank_prices.rank_id = post_ranks.id
                            ), '[]'
                        ) AS prices
                    FROM post_ranks;
                    `;
        const response = await db.query(query);

        return res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ error: "Error fetching post ranks" })
    }
}