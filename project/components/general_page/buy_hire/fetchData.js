import { cookies } from "next/headers";

export async function fetchData(paramsPromise) {
    let postData = [];
    const cookieStore = await cookies();
    const searchQuery = cookieStore.get("searchQuery");

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    try {
        const params = await paramsPromise;
        const filterQuery = searchQuery
            ? JSON.parse(searchQuery.value)
            : {
                demand: params["buy-hire-slug"].includes("ban") ? "Tìm mua" : "Tìm thuê",
            };


        console.log(filterQuery);
        const response = await fetch(`${apiUrl}/api/handle_posts/getPost`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ searchQuery: filterQuery }),
        });

        if (response.ok) {
            postData = await response.json();
        } else {
            console.error("Failed to fetch data:", response.statusText);
        }
    } catch (err) {
        console.error("Error fetching data:", err);
    }

    return postData;
}
