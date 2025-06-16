import db from "@/lib/db";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: "10mb", // or more if needed (e.g. "20mb")
        },
    },
};


export default async function handler(req, res) {
    const { generalInfo } = req.body;

    try {
        cloudinary.config({
            cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });

        //Handle extract image from string
        const replaceImageUrlsWithCloudinary = async (content) => {
            // Regular expression to match the <img> tags with a src attribute
            const regex = /src="([^">]+)"/g;

            // Array to store extracted Base64 strings
            const base64Strings = [];

            // Match all occurrences of the `src` attribute
            let match;
            while ((match = regex.exec(content)) !== null) {
                const src = match[1]; // Extract the value of the `src` attribute

                // Check if the `src` contains a Base64 string
                if (src.startsWith("data:image")) {
                    base64Strings.push(src);
                }
            }

            try {
                const response = await axios.post("http://localhost:3000/api/users/enterprise/projects/uploadProjectImages", {
                    name: generalInfo.name,
                    images: base64Strings,
                });
                const uploadedImages = response.data.images; // Get the uploaded images from the response

                uploadedImages.forEach((url, index) => {
                    content = content.replace(base64Strings[index], url);
                });

                return content;
            } catch (error) {
                console.error("Error uploading images:", error);
                return content; // Return original content if upload fails
            }

            return content;
        };

        const replacedContent = await replaceImageUrlsWithCloudinary(generalInfo.preview)

        //Handle upload premise
        const uploadResponse = await cloudinary.uploader.upload(generalInfo.premise, {
            folder: `project/${generalInfo.name}`,
        });
        const uploadedPremise = uploadResponse.secure_url;

        const projectQuery = `INSERT INTO projects (name, type, street, ward, district, province, address, preview, premises, location, utilities, optional_info, enterprise_id, status) 
                                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`
        const projectValues = [
            generalInfo.name,
            generalInfo.projectType,
            generalInfo.address.street,
            generalInfo.address.ward,
            generalInfo.address.district,
            generalInfo.address.province,
            generalInfo.address.displayAddress,
            replacedContent,
            uploadedPremise,
            generalInfo.locationOnMap.join(","),
            generalInfo.utilities,
            JSON.stringify(generalInfo.optionalInfo),
            generalInfo.enterpriseId,
            "Đang cập nhật"
        ]

        const result1 = await db.query(projectQuery, projectValues);
        const projectId = result1.rows[0].id;

        // Handle upload image to cloudinary
        const imagesWithIndex = generalInfo.images.map((image, index) => ({
            image,
            index,
        }));

        const uploadedImages = await Promise.all(
            imagesWithIndex.map(async ({ image, index }) => {
                const result = await cloudinary.uploader.upload(image, {
                    folder: `project/${generalInfo.name}`,
                });
                return { url: result.secure_url, index };
            })
        );

        uploadedImages.sort((a, b) => a.index - b.index);

        const uploadImages = uploadedImages.map((img) => img.url);

        const postImageQuery =
            "INSERT INTO public.project_images(project_id, image_url) VALUES ($1, $2)";

        await Promise.all(
            uploadImages.map((imageUrl) =>
                db.query(postImageQuery, [projectId, imageUrl])
            )
        );

        res.status(200).json({ message: "Create project successfully" })
    } catch (error) {
        console.log("Error creating project: ", error);
        res.status(500).json({ message: "Error creating project" });
    }
}