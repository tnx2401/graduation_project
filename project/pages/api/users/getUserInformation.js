import db from "@/lib/db";

export default async function handler(req, res) {
  const { uid } = req.body;

  console.log("Fetching user information for uid:", uid);
  if (!uid) {
    return res.status(400).json({ message: "Missing uid" });
  }

  try {
    const query = `SELECT 
        users.*, 
        COALESCE(membership.membership_name, 'No Membership') AS membership_name,
        JSON_AGG(membership_benefit_usage.*) FILTER (WHERE membership_benefit_usage IS NOT NULL) AS benefit_usage,
        latest_invoice.created_date, 
        latest_invoice.end_date
      FROM users 
      JOIN roles ON users.role_id = roles.id 
      LEFT JOIN membership ON users.membership_id = membership.id
      LEFT JOIN membership_benefit_usage ON users.uid = membership_benefit_usage.user_id
      LEFT JOIN (
        SELECT DISTINCT ON (user_id) *
        FROM membership_invoices
        ORDER BY user_id, created_date DESC
      ) latest_invoice ON users.uid = latest_invoice.user_id
      WHERE users.uid = $1
      GROUP BY users.uid, membership.membership_name, latest_invoice.created_date, latest_invoice.end_date
    `;
    const values = [uid];


    const { rows } = await db.query(query, values)
    res.status(200).json(rows)
  } catch (error) {
    res.status(500).json({ message: "Error fetching users data" })
    console.log(error);
  }
} 