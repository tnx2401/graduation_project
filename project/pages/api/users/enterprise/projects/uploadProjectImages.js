import { v2 as cloudinary } from "cloudinary";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb", // Increase the limit (adjust as needed)
        },
    },
};

export default async function handler(req, res) {

    const { images, name } = req.body;

    try {
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });

        const uploadResponses = await Promise.all(
            images.map((image) =>
                cloudinary.uploader.upload(image, {
                    folder: `project/${name}`,
                })
            )
        );

        const uploadedImage = uploadResponses.map((response) => response.secure_url);

        return res.status(200).json({
            images: uploadedImage,
        });
    } catch (error) {
        console.error("Error uploading images:", error);
        return res.status(500).json({ error: "Internal server error" });
    }

}