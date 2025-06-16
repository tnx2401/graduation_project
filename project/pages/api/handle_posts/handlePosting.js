import { v2 as cloudinary } from "cloudinary";
import db from "@/lib/db";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Increase the limit (adjust as needed)
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method is not allowed" });
  }

  try {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const data = req.body.formData;
    const userId = req.body.userId;
    const currentTime = new Date().toISOString();
    const rank_id = () => {
      if (data.payment.rank === "VIP Kim Cương") {
        return 1;
      } else if (data.payment.rank === "VIP Vàng") {
        return 2;
      } else if (data.payment.rank === "VIP Bạc") {
        return 3;
      } else {
        return 4;
      }
    }

    const sqlQuery = "SELECT * FROM users WHERE uid = $1";
    const result = await db.query(sqlQuery, [userId]);

    if (result.rows[0].balance < data.payment.total) {
      res.status(200).json({ message: "Số dư tài khoản không đủ" });
      return;
    } else {
      const postQuery =
        "INSERT INTO public.posts(demand, street, project, ward, district, province, display_address " +
        ",type, area, price, unit, document, interior, bedroom, bathroom, floor, house_direction, " +
        "balcony_direction, entrance, frontage, contact_name, email, phone_number, title, description, rank_id, view_count, interested_count) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28) RETURNING id";

      const postValue = [
        data.demand,
        data.address.street,
        data.address.project,
        data.address.ward,
        data.address.district,
        data.address.province,
        data.address.displayAddress,
        data.main_info.type,
        data.main_info.area,
        data.main_info.price,
        data.main_info.unit,
        data.other_info.document,
        data.other_info.interior,
        data.other_info.bedroom,
        data.other_info.bathroom,
        data.other_info.floor,
        data.other_info.houseDirection,
        data.other_info.balconyDirection,
        data.other_info.entrance,
        data.other_info.frontage,
        data.contact_info.contactName,
        data.contact_info.email,
        data.contact_info.phonenumber,
        data.description.title,
        data.description.content,
        rank_id(),
        0,
        0,
      ];

      const result1 = await db.query(postQuery, postValue);
      const postId = result1.rows[0].id;

      const imagesWithIndex = data.media.images.map((image, index) => ({
        image,
        index,
      }));

      const uploadedImages = await Promise.all(
        imagesWithIndex.map(async ({ image, index }) => {
          const result = await cloudinary.uploader.upload(image, {
            folder: `real_estate/${postId}`,
          });
          return { url: result.secure_url, index };
        })
      );

      uploadedImages.sort((a, b) => a.index - b.index);

      const uploadImages = uploadedImages.map((img) => img.url);

      const postImageQuery =
        "INSERT INTO public.post_images(post_id, images_url) VALUES ($1, $2)";

      await Promise.all(
        uploadImages.map((imageUrl) =>
          db.query(postImageQuery, [postId, imageUrl])
        )
      );


      const invoiceQuery = 'INSERT INTO public.invoices(user_id, post_id, amount, payment_status, created_at, post_start_date, post_duration, verify_status)' +
        ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8)'
      const invoiceValues = [userId, postId, data.payment.total, "Paid", currentTime, data.payment.startDate, data.payment.duration, "Chờ duyệt"];


      await db.query(invoiceQuery, invoiceValues)

      const subtractBalanceQuery =
        "UPDATE public.users SET balance = $1 WHERE uid = $2";
      const subtractBalanceValues = [
        result.rows[0].balance - data.payment.total,
        userId,
      ];

      await db.query(subtractBalanceQuery, subtractBalanceValues);

      const subtractMembershipBenefitQuery = `
        UPDATE membership_benefit_usage
        SET remaining_quantity = remaining_quantity - 1
        WHERE user_id = $1 AND benefit_type = $2
      `;
      const subtractMembershipBenefitValues = [userId, data.discount];
      await db.query(subtractMembershipBenefitQuery, subtractMembershipBenefitValues);

      res.status(200).json({ message: "Đăng bài thành công" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error posting" });
    console.log(error);
  }
}
