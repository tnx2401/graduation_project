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
    try {
        const { uid, username, profile_picture, phone_number, email, address, self_description, tax_number } = req.body;
        if (!uid) return res.status(400).json({ error: "User ID is required" });

        let query = `UPDATE users SET`;
        let values = [];
        let setClauses = [];

        if (username) {
            setClauses.push(` username = $${values.length + 1}`);
            values.push(username);
        }

        if (profile_picture) {
            cloudinary.config({
                cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true,
            });


            const uploadResponse = await cloudinary.uploader.upload(profile_picture, {
                folder: `users/${uid}`,
            });

            const uploadedImage = uploadResponse.secure_url;
            setClauses.push(` profile_picture = $${values.length + 1}`);
            values.push(uploadedImage);
        }

        if (phone_number) {
            setClauses.push(` phone_number = $${values.length + 1}`);
            values.push(phone_number);
        }

        if (email) {
            setClauses.push(` email = $${values.length + 1}`);
            values.push(email);
        }

        if (address) {
            setClauses.push(` address = $${values.length + 1}`);
            values.push(address);
        }

        if (self_description) {
            setClauses.push(` self_description = $${values.length + 1}`);
            values.push(self_description);
        }

        if (tax_number) {
            setClauses.push(` tax_number = $${values.length + 1}`);
            values.push(tax_number);
        }

        if (setClauses.length === 0) {
            return res.status(400).json({ error: "No data provided for update" });
        }

        query += setClauses.join(",") + ` WHERE uid = $${values.length + 1}`;
        values.push(uid);

        await db.query(query, values);

        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
