import db from "@/lib/db";
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { editedMembership } = req.body;
    const query = `
            UPDATE membership
            SET free_gold_posts = $1, free_silver_posts = $2, free_normal_posts = $3, free_push_posts = $4, price = $5
            WHERE id = $6
        `;
    const values = [
        Number(editedMembership.free_gold_posts),
        Number(editedMembership.free_silver_posts),
        Number(editedMembership.free_normal_posts),
        Number(editedMembership.free_push_posts),
        Number(editedMembership.price),
        editedMembership.id
    ];
    console.log(query, values);
    await db.query(query, values);

    return res.status(200).json({ message: 'success' });
}