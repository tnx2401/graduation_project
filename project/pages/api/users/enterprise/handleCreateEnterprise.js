import db from "@/lib/db"
import { v2 as cloudinary } from "cloudinary";

function sanitizeFolderName(name) {
    return name
        .normalize("NFD")                     // Remove accents
        .replace(/[\u0300-\u036f]/g, "")      // Remove diacritics
        .replace(/[^a-zA-Z0-9-_]/g, "_")      // Replace non-alphanumeric with _
        .toLowerCase();
}

export default async function handler(req, res) {
    const { uid, newEnterpriseInfo } = req.body;

    try {
        if (newEnterpriseInfo.profile_image) {
            cloudinary.config({
                cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
                secure: true,
            });

            const sanitizedFolder = sanitizeFolderName(newEnterpriseInfo.name);

            const uploadResponse = await cloudinary.uploader.upload(newEnterpriseInfo.profile_image, {
                folder: `enterprise/${sanitizedFolder}`,
            });

            const uploadedImage = uploadResponse.secure_url;

            const query = `
                INSERT INTO enterprise (name, main_field, address, profile_image, email, website, description, user_id, status, created_date) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `;

            const values = [
                newEnterpriseInfo.name,
                newEnterpriseInfo.main_field,
                newEnterpriseInfo.address,
                uploadedImage,
                newEnterpriseInfo.email,
                newEnterpriseInfo.website,
                newEnterpriseInfo.description,
                uid,
                "Chờ duyệt",
                new Date().toISOString()
            ];

            await db.query(query, values);

            res.status(200).json({ message: "success" });
        }
    } catch (error) {
        console.log("Error create enterprise: ", error);
        res.status(500).json({ message: "Error creating enterprise" });
    }
}
