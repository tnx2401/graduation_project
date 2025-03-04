import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { phonenumber } = req.body;

  try {
    if (!phonenumber) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const checkExistingPhonenumberQuery = `SELECT COUNT(*) FROM public.users WHERE phone_number = $1`;
    const checkExistingValues = [phonenumber];

    const results = await db.query(
      checkExistingPhonenumberQuery,
      checkExistingValues
    );
    const phoneExists = parseInt(results.rows[0].count, 10) > 0;
    if (phoneExists) {
      return res.status(409).json("Phone number already existed");
    }
    return res.status(200).json({ message: "Phone number is available" });
  } catch (error) {
    console.error("Database update error:", error);
    return res.status(500).json({ error: "Error updating phone number" });
  }
}
