import db from "@/lib/db";
import admin from "@/lib/firebaseAdmin";


export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(403).json({ message: "Method is not allowed" });
    }

    try {
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        const query = `SELECT role_id FROM users WHERE uid = $1`
        const values = [decodedToken.uid];

        const role_id = await db.query(query, values);

        if (role_id.rows[0].role_id === 1) {
            const query1 = `SELECT 
                            posts.*,
                            invoices.*,
                            users.*,
                            post_ranks.name AS rank_name,
                            posts.description AS post_description,

                            -- Aggregate post_reports
                            COALESCE(
                                (
                                    SELECT json_agg(row_to_json(pr))
                                    FROM (
                                        SELECT reasons, other_report, name, phone_number, address, created_at --
                                        FROM post_reports
                                        WHERE post_reports.post_id = posts.id
                                    ) pr
                                ),
                                '[]'
                            ) AS post_reports,

                            -- Aggregate post_images
                            COALESCE(
                                (
                                    SELECT json_agg(images_url ORDER BY id)
                                    FROM (
                                        SELECT DISTINCT post_images.images_url, post_images.id
                                        FROM public.post_images
                                        WHERE post_images.post_id = posts.id
                                    ) sub
                                ),
                                '[]'
                            ) AS images

                        FROM posts
                        JOIN invoices ON posts.id = invoices.post_id 
                        JOIN post_ranks ON posts.rank_id = post_ranks.id
                        JOIN users ON invoices.user_id = users.uid

                        ORDER BY 
                            CASE 
                                WHEN invoices.verify_status = 'Chờ duyệt' THEN 1
                                WHEN invoices.verify_status = 'Đã duyệt' THEN 2
                                WHEN invoices.verify_status = 'Không duyệt' THEN 3
                                ELSE 4
                            END,
                            invoices.post_start_date DESC;
                            `
            const { rows } = await db.query(query1);

            res.status(200).json(rows)
        } else {
            res.status(200).json({ message: "You dont have permission" })
        }
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error getting posts" })
    }
}