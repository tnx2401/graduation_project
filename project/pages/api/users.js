const admin = require("../../lib/firebaseAdmin");
const db = require("../../lib/db");

export default async function handler(req, res) {
  const { userId } = req.query;

  switch (req.method) {
    case "GET":
      try {
        if (!userId) {
          return res.status(400).json({ message: "Missing user ID" });
        }

        const query = "SELECT * FROM users where uid = $1";
        const result = await db.query(query, [userId]);

        if (result.rows.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }

        const user = result.rows[0];
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
      }
      break;

    case "POST":
      try {
        const { authorization } = req.headers;
        const token = authorization.split(" ")[1];
        const decodedToken = await admin.auth().verifyIdToken(token);

        const {
          uid,
          username,
          contacts,
          balance,
          discount_balance,
          member_type,
          profile_picture,
          phone_number,
          email,
          payment_code,
          tax_number,
        } = req.body;

        if (!uid) {
          return res.status(400).json({ error: "Missing required fields" });
        }

        if (decodedToken.uid === uid) {
          const query = `
          INSERT INTO public.users (
            uid, username, phone_number, email, contacts, profile_picture,
            member_type, balance, discount_balance, payment_code, tax_number
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11
          ) RETURNING *;
        `;

          const values = [
            uid,
            username,
            phone_number,
            email,
            contacts || "{}", // Default to an empty array if not provided
            profile_picture,
            member_type || 1, // Default to 1 if not provided
            balance || 0, // Default to 0 if not provided
            discount_balance || 0, // Default to 0 if not provided
            payment_code || null,
            tax_number || null,
          ];

          const result = await db.query(query, values);
          res.status(200).json({ message: "User added successfully" });
        } else {
          res.status(403).json({ error: "Unauthorized" });
        }
      } catch (error) {
        res.status(500).json({ message: "Error adding users to database" });
      }
      break;

    default:
      res.status(405).json({ message: "Method not allowed" });
      break;
  }
}
