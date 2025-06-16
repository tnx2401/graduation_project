import db from "@/lib/db";

export default async function hander(req, res) {
    try {
        const { data } = req.body;

        const query = `
            UPDATE public.projects
	        SET 
            name=$1, street=$2, ward=$3, district=$4, 
            province=$5, address=$6, preview=$7, premises=$8, location=$9, 
            type=$10, utilities=$11, optional_info=$12, status=$13
	        WHERE id = $14;
        `

        const values = [
            data.name,
            data.street,
            data.ward,
            data.district,
            data.province,
            data.address,
            data.preview,
            data.premises,
            data.location,
            data.type,
            data.utilities,
            JSON.stringify(data.optional_info),
            data.status,
            data.id
        ]

        await db.query(query, values);

        console.log(data);
        res.status(200).json({ message: "Success" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating project" })
    }
}