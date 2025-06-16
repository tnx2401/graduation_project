import db from "@/lib/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { membership_id, user_id, benefits, membership_duration, total } = req.body;

        const checkBalanceQuery = `
            SELECT balance FROM users WHERE uid = $1
        `

        const checkBalanceValues = [user_id];

        const result = await db.query(checkBalanceQuery, checkBalanceValues);

        const balance = result.rows[0].balance;


        if (balance && balance >= Number(total)) {
            const today = new Date();
            const endDate = new Date(today);

            const newMonth = today.getMonth() + Number(membership_duration);
            endDate.setMonth(newMonth);

            const membershipInvoiceQuery = `
                INSERT INTO membership_invoices (user_id, membership_id, created_date, end_date, total)
                VALUES ($1, $2, $3, $4, $5)
            `;
            const membershipInvoiceValues = [user_id, membership_id, today.toISOString(), endDate.toISOString(), Number(total)];

            console.log(membershipInvoiceQuery, membershipInvoiceValues)
            await db.query(membershipInvoiceQuery, membershipInvoiceValues);

            Object.keys(benefits).forEach(async (key) => {
                const membershipBenefitQuery = `
                    INSERT INTO membership_benefit_usage (user_id, benefit_type, remaining_quantity)
                    VALUES ($1, $2, $3)
                `;
                const membershipBenefitValues = [user_id, key, benefits[key]];
                console.log(membershipBenefitValues);
                await db.query(membershipBenefitQuery, membershipBenefitValues);
            });
            const updateUserMembershipQuery = `
                UPDATE users
                SET membership_id = $1, balance = balance - $2
                WHERE uid = $3 AND balance >= $2
            `;
            const updateUserMembershipValues = [membership_id, Number(total), user_id];
            console.log(updateUserMembershipValues);
            await db.query(updateUserMembershipQuery, updateUserMembershipValues);

            return res.status(200).json({ message: "Membership bought successfully" });
        } else {
            return res.status(400).json({ message: "Tài khoản không đủ tiền" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error buying membership" });
    }
}