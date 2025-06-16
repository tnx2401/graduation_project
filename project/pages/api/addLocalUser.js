//* This api use Firebase emulator which doesnt have algorithm in token, use this to bypass the login process
import db from "@/lib/db";

export default async function handler(req, res) {
    try {
        const {
            uid,
            username,
            contacts,
            balance,
            discount_balance,
            role_id,
            profile_picture,
            phone_number,
            email,
            payment_code,
            tax_number,
            created_date
        } = req.body;

        if (!uid) {
            return res.status(400).json({ error: "Missing required fields" });
        }


        const query = `
              INSERT INTO public.users (
                uid, username, phone_number, email, contacts, profile_picture,
                role_id, balance, discount_balance, payment_code, tax_number, join_date
              ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
              ) RETURNING *;
            `;

        const values = [
            uid,
            username,
            phone_number,
            email,
            contacts || "{}", // Default to an empty array if not provided
            profile_picture,
            role_id || 1, // Default to 1 if not provided
            balance || 0, // Default to 0 if not provided
            discount_balance || 0, // Default to 0 if not provided
            payment_code || null,
            tax_number || null,
            new Date().toISOString()
        ];

        const result = await db.query(query, values);
        res.status(200).json({ message: "User added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding users to database" });
        console.log(error);
    }
}