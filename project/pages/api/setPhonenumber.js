import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId } = req.query;
  const { phonenumber } = req.body;

  try {
    if (!userId || !phonenumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    const checkExistingPhonenumberQuery = `SELECT COUNT(*) FROM public.users WHERE phone_number = $1`;
    const checkExistingValues = [phonenumber];

    const results = await db.query(checkExistingPhonenumberQuery, checkExistingValues)

    const query = `UPDATE public.users SET phone_number = $1 WHERE uid = $2`;

    const values = [phonenumber, userId];

    await db.query(query, values);
    return res.status(200).json("Update phone number successfully");
  } catch (error) {
    console.error("Database update error:", error);
    return res.status(500).json({ error: "Error updating phone number" });
  }
}
