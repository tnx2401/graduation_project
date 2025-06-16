import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { project, street, ward, district, province, demand } = req.body;
        const today = new Date().toISOString();
        let whereClauses = [];
        let values = [today, "Đã duyệt", demand, true];

        const filters = { province, district, ward, street, project };

        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                whereClauses.push(`${key} = $${values.length + 1}`);
                values.push(value);
            }
        });

        // Example final query
        const locationQuery = whereClauses.length ? `AND ${whereClauses.join(" AND ")}` : "";

        const query = `
        SELECT DISTINCT ON (posts.id) posts.*, post_images.images_url, invoices.created_at, invoices.user_id 
        FROM posts JOIN invoices on posts.id = invoices.post_id JOIN public.post_images ON posts.id = post_images.post_id  
        WHERE invoices.post_end_date > $1 AND invoices.verify_status = $2 AND posts.demand = $3 AND posts.advertisement = $4 ${locationQuery}
        ORDER BY posts.id, posts.rank_id ASC;
        `
        const { rows } = await db.query(query, values);

        return res.status(200).json({ posts: rows });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}