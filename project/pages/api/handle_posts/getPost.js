import db from "@/lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("Request called");

  const today = new Date().toISOString();
  const { userId, searchQuery } = req.body;
  const getNumberFromString = (str) => {
    const numbers = str.match(/\d+/g);
    return numbers
  };

  const demand = searchQuery.demand === "Tìm thuê" ? "Cho thuê" : "Bán";

  let whereClauses = [];
  let values = [today, demand, "Đã duyệt", userId];

  if (searchQuery.type && searchQuery.type.length > 0) {
    whereClauses.push(`type IN (${searchQuery.type.map((_, i) => `$${values.length + i + 1}`).join(", ")})`);
    values.push(...searchQuery.type);
  }


  if (searchQuery.address && searchQuery.address.length > 0) {
    searchQuery.address.forEach((addr) => {
      let conditions = [];
      if (addr.street) {
        conditions.push(`street = $${values.length + 1}`);
        values.push(addr.street.split(" ").splice(1).join(" "));
      }
      if (addr.ward) {
        conditions.push(`ward = $${values.length + 1}`);
        values.push(addr.ward.split(" ").splice(1).join(" "));
      }
      if (addr.district) {
        conditions.push(`district = $${values.length + 1}`);
        if (isNaN(addr.district.split(" ").splice(1).join(""))) {
          values.push(addr.district.split(" ").splice(1).join(" "));
        } else {
          values.push(addr.district)
        }
      }
      if (addr.province) {
        conditions.push(`province = $${values.length + 1}`);
        values.push(addr.province);
      }
      if (conditions.length > 0) {
        whereClauses.push(`(${conditions.join(" AND ")})`);
      }
    });
  }

  if (searchQuery.price) {
    if (searchQuery.price === 'Thỏa thuận') {
      whereClauses.push(`price = $${values.length + 1}`)
      values.push(0)
    } else if (searchQuery.price === "Tất cả mức giá") {
      whereClauses.push(`price > $${values.length + 1}`)
      values.push(0)
    } else {
      if (searchQuery.demand === "Tìm mua") {
        let priceRange = getNumberFromString(searchQuery.price)
        if (priceRange.length > 1) {
          whereClauses.push(`(price >= $${values.length + 1} AND price <= $${values.length + 2})`)
          values.push(Number(priceRange[0]) === 500 || Number(priceRange[0]) === 800 ? Number(priceRange[0]) * 1000000 : Number(priceRange[0]) * 1000000000, Number(priceRange[1]) === 500 || Number(priceRange[1]) === 800 ? Number(priceRange[1]) * 1000000 : Number(priceRange[1]) * 1000000000);
        } else if (priceRange.length === 1) {
          whereClauses.push(`(price >= $${values.length + 1} ${Number(priceRange[0]) == 500 ? `AND price <= $${values.length + 2}` : ``})`)
          values.push(Number(priceRange[0]) == 60 ? 60 : 0, Number(priceRange[0]))
        }
      } else {
        let priceRange = getNumberFromString(searchQuery.price)
        if (priceRange.length > 1) {
          whereClauses.push(`(price >= $${values.length + 1} AND price <= $${values.length + 2})`)
          values.push(Number(priceRange[0]) * 1000000, Number(priceRange[1]) * 1000000)
        } else if (priceRange.length == 1) {
          whereClauses.push(`(price >= $${values.length + 1} ${Number(priceRange[0]) === 1 ? `AND price <= $${values.length + 2}` : ``})`)
          values.push(Number(priceRange[0]) === 100 ? 100 : 0, Number(priceRange[0]))
        }
      }
    }
  }

  if (searchQuery.area) {
    if (searchQuery.area === 'Tất cả diện tích') {
      whereClauses.push(`area::INTEGER > $${values.length + 1}`);
      values.push(0);
    } else {
      let areaRange = getNumberFromString(searchQuery.area)

      if (areaRange.length > 1) {
        whereClauses.push(`area::INTEGER >= $${values.length + 1} AND area::INTEGER <= $${values.length + 2}`)
        values.push(Number(areaRange[0]), Number(areaRange[1]))
      } else if (areaRange.length == 1) {
        whereClauses.push(`area::INTEGER >= $${values.length + 1} ${Number(areaRange[0]) === 30 ? `AND area::INTEGER <= $${values.length + 2}` : ``}`)
        values.push(Number(areaRange[0]) === 500 ? 500 : 0, areaRange[0])
      }
    }
  }

  if (searchQuery.bedroom) {
    if (searchQuery.bedroom <= 4) {
      whereClauses.push(`bedroom = $${values.length + 1}`)
      values.push(searchQuery.bedroom)
    } else {
      whereClauses.push(`bedroom >= $${values.length + 1}`)
      values.push(searchQuery.bedroom)
    }
  }

  if (searchQuery.houseDirection && searchQuery.houseDirection.length > 0) {
    whereClauses.push(`house_direction IN (${searchQuery.houseDirection.map((_, i) => `$${values.length + i + 1}`).join(", ")})`);
    values.push(...searchQuery.houseDirection);
  }

  if (searchQuery.balconyDirection && searchQuery.balconyDirection.length > 0) {
    whereClauses.push(`balcony_direction IN (${searchQuery.balconyDirection.map((_, i) => `$${values.length + i + 1}`).join(", ")})`);
    values.push(...searchQuery.balconyDirection);
  }

  try {
    const query = `
      SELECT 
      posts.*,
      users.profile_picture,
      post_ranks.name as rank_name,
      invoices.user_id,
      invoices.post_start_date,
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
      ) AS images,
      jsonb_agg(DISTINCT invoices) FILTER (WHERE invoices.post_id IS NOT NULL) -> 0 AS payment
      FROM public.posts 
      LEFT JOIN public.invoices ON posts.id = invoices.post_id
      LEFT JOIN public.users ON posts.phone_number = users.phone_number
      LEFT JOIN public.post_ranks ON posts.rank_id = post_ranks.id
      LEFT JOIN public.user_post_views upv ON upv.post_id = posts.id AND upv.user_id = $4
      WHERE invoices.post_end_date > $1 AND demand = $2 AND invoices.verify_status = $3
      ${whereClauses.length ? `AND ${whereClauses.join(" AND ")}` : ""}
      GROUP BY posts.id, users.profile_picture, invoices.post_id, post_ranks.name, invoices.post_start_date, invoices.user_id, upv.user_id
      ORDER BY
      posts.rank_id ASC,
        CASE 
          WHEN posts.order = 1 AND upv.user_id IS NULL THEN 0  -- Unseen pushed post
          WHEN posts.order = 1 AND upv.user_id IS NOT NULL THEN 1  -- Seen pushed post
          ELSE 2
        END,
        posts.order DESC,
        posts.pushed_at DESC,
        invoices.post_start_date DESC;
    `;

    const { rows } = await db.query(query, values);
    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Error fetching posts" });
  }
}
