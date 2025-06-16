"use client";
import { useEffect, useState } from "react";
import ClientHouseList from "@/components/general_page/shared/ClientHouseList";
import Title from "./Title";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Loading from "@/app/(trang-chu)/loading";

export default function ClientHouseListWrapper({ path }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithUserId = async () => {
      console.log("Fetching posts...");
      const token = localStorage.getItem("authToken");
      let userId = null;
      if (token) {
        const decoded = jwtDecode(token);
        userId = decoded.userId || decoded.user_id;
      }

      const demand = path.includes("ban") ? "Tìm mua" : "Tìm thuê";

      try {
        const rawQuery = Cookies.get("searchQuery");
        const searchQuery = rawQuery ? JSON.parse(rawQuery) : { demand };
        const res = await fetch("/api/handle_posts/getPost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, searchQuery: searchQuery }),
        });
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
          setLoading(false);
        } else {
          console.error("Failed to fetch posts:", res.statusText);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWithUserId();
  }, [path]);

  if (loading) return <Loading />;

  return (
    <>
      <Title amount={posts.length} />
      {posts.length > 0 && <ClientHouseList data={posts} path={path} />}
    </>
  );
}
