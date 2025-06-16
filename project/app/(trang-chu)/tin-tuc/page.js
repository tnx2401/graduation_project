import React from "react";
import NewsHeader from "@/components/general_page/news/NewsHeader";
import Image from "next/image";
import Link from "next/link";
import pathFunction from "@/components/general_page/shared/pathFunction";
import MostWatchedNews from "@/components/general_page/news/MostWatchedNews";

async function getNews() {
  const res = await fetch(`http://localhost:3000/api/handle_news/fetchNews`, {
    cache: "no-store", // Ensures fresh data on every request (use "force-cache" for caching)
  });

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  return res.json();
}

const page = async () => {

  const news = await getNews();

  const extractFirstImage = (htmlString) => {
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = htmlString.match(regex);
    return match ? match[1] : null;
  }

  return <div>
    <NewsHeader />

    <div className="max-w-6xl mx-auto px-4 py-6 text-center mt-5">
      <h1 className="text-4xl my-4 font-medium">Tin tức bất động sản mới nhất</h1>
      <p className="w-3/4 text-sm text-gray-400 mx-auto">Thông tin mới, đầy đủ, hấp dẫn về thị trường bất động sản Việt Nam thông qua dữ liệu lớn về giá, giao dịch, nguồn cung - cầu và khảo sát thực tế của đội ngũ phóng viên, biên tập của Batdongsan.com.vn.</p>
    </div>

    <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-5">
      <div className="lg:w-2/3">
        {news.map((item, index) => (
          <Link key={index} href={`/tin-tuc/${pathFunction.convertToSlug(item.title)}-${item.id}`}>
            <div className="border-b py-5 lg:flex items-center gap-5">
              <div className="relative w-full lg:full h-48">
                <Image src={extractFirstImage(item.content)} alt={item.title} layout="fill" objectFit="cover" className="rounded-lg shadow-lg" />
              </div>
              <div>
                <p className="text-sm text-gray-400">{new Date(item.created_date).toLocaleDateString("vi-VN")} - <span>{item.username}</span></p>
                <h2 className="text-lg line-clamp-2">{item.title}</h2>
                <p className="text-sm text-gray-400 line-clamp-3">{item.summary}</p>
                {item.tags.map((tag, index) => (
                  <span key={index} className="inline-block p-2 text-xs font-semibold text-gray-700 bg-gray-200 mt-2 rounded-lg mr-2">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="lg:w-1/3">
        <MostWatchedNews />
      </div>
    </div>
  </div>
};

export default page;
