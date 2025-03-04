import db from "@/lib/db";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id || isNaN(id)) {
    console.error("Invalid Post ID:", id);
    return res.status(400).json({ error: "Invalid Post ID" });
  }

  try {
    console.log(`Fetching post with ID: ${id}`);

    const query = `
      SELECT 
        posts.*,
        users.profile_picture,
        users.uid,
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
      FROM public.posts 
      LEFT JOIN public.users ON posts.phone_number = users.phone_number
      WHERE posts.id = $1
      GROUP BY posts.id, users.profile_picture, users.uid;
    `;

    const values = [parseInt(id)]; // Convert ID to number

    const { rows } = await db.query(query, values);

    if (rows.length === 0) {
      console.error("Post not found for ID:", id);
      return res.status(404).json({ error: `Post not found for ID: ${id}` });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: `Error fetching post with ID: ${id}` });
  }
}
