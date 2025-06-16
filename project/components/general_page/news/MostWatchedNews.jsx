import Link from "next/link";
import React from "react";
import pathFunction from "../shared/pathFunction";

const getMostWatchedNew = async () => {
  const res = await fetch(
    `http://localhost:3000/api/handle_news/getMostWatchedNews`,
    {
      cache: "no-store", // Ensures fresh data on every request (use "force-cache" for caching)
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  return res.json();
};

const MostWatchedNew = async () => {
  const data = await getMostWatchedNew();

  return (
    <div className="border p-3 rounded-lg">
      <h1 className="text-lg pb-3 pt-1 font-medium">
        Bài viết được xem nhiều nhất
      </h1>
      {data.map((item, index) => (
        <Link
          key={index}
          href={`/tin-tuc/${pathFunction.convertToSlug(item.title)}-${item.id}`}
          className="text-sm flex items-center py-4 border-t"
        >
          <span className="bg-rose-200 p-1 px-2.5 mr-2 text-red-800 rounded-full">
            {index + 1}
          </span>
          <span className="line-clamp-2">{item.title}</span>
        </Link>
      ))}
    </div>
  );
};

export default MostWatchedNew;
