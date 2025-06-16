"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClockIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import pathFunction from "@/components/general_page/shared/pathFunction";

const SkeletonLoading = () => {
  return (
    <div className="max-w-7xl mx-auto p-2 xl:p-0 animate-pulse">
      {/* Navigation Section Skeleton */}
      <div className="border-b-2">
        <div className="flex items-center justify-between">
          <ul className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <li key={i} className="h-6 w-24 bg-gray-300 rounded"></li>
            ))}
          </ul>
          <div className="h-5 w-20 bg-orange-300 rounded"></div>
        </div>
      </div>

      {/* Content Section Skeleton */}
      <div className="my-5 flex gap-5">
        {/* Left Side (Image & Text) */}
        <div className="w-1/2 space-y-4">
          <div className="w-[600px] h-[400px] bg-gray-300 rounded"></div>
          <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-5 w-1/2 bg-gray-300 rounded"></div>
        </div>

        {/* Right Side (List) */}
        <div className="w-1/2 space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-b-2 pb-4">
              <div className="h-5 w-full bg-gray-300 rounded mb-2"></div>
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const News = () => {
  const [news, setNews] = useState([
    { name: "Tin nổi bật", item: [] },
    { name: "Tin tức", item: [] },
    { name: "BĐS Hà Nội", item: [] },
    { name: "BĐS TP.HCM", item: [] },
  ]);

  const [isChoosen, setIsChoosen] = useState(news[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentArticles, setCurrentArticles] = useState({
    title: "",
    thumbnail: null,
    timeline: "",
  });
  const [isFading, setIsFading] = useState(false);

  const extractFirstImage = (htmlString) => {
    if (!htmlString) return null; // ✅ Prevents undefined errors
    const regex = /<img[^>]+src="([^">]+)"/;
    const match = htmlString.match(regex);
    return match ? match[1] : null;
  };

  const convertDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", options);
  };

  useEffect(() => {
    const fetchMostWatchedNews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/handle_news/getMostWatchedNews`
        );
        const data = response.data;
        setNews((prevNews) => {
          const updatedNews = [...prevNews];
          updatedNews[0].item = data.map((item) => ({
            title: item.title,
            thumbnail: item.content ? extractFirstImage(item.content) : null,
            timeline: convertDate(item.created_date),
            tags: item.tags,
            link: `/tin-tuc/${pathFunction.convertToSlug(item.title)}-${
              item.id
            }`,
          }));
          return updatedNews;
        });
      } catch (error) {
        console.error("Error fetching most watched news:", error);
      }
    };

    const fetchNews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/handle_news/fetchNews`
        );
        const data = response.data;
        setNews((prevNews) => {
          const updatedNews = [...prevNews];
          updatedNews[1].item = data.map((item) => ({
            title: item.title,
            thumbnail: item.content ? extractFirstImage(item.content) : null,
            timeline: convertDate(item.created_date),
            tags: item.tags,
            link: `/tin-tuc/${pathFunction.convertToSlug(item.title)}-${
              item.id
            }`,
          }));
          return updatedNews;
        });
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchMostWatchedNews();
    fetchNews();
  }, []);

  useEffect(() => {
    if (news[1]?.item?.length > 0) {
      setNews((prevNews) => {
        const updatedNews = prevNews.map((category, index) => {
          if (index === 2) {
            return {
              ...category,
              item: [
                ...category.item,
                ...news[1].item.filter((i) =>
                  i.tags?.includes("Bất động sản Hà Nội")
                ),
              ],
            };
          }
          if (index === 3) {
            return {
              ...category,
              item: [
                ...category.item,
                ...news[1].item.filter((i) =>
                  i.tags?.includes("Bất động sản Hồ Chí Minh")
                ),
              ],
            };
          }
          return category;
        });
        return updatedNews;
      });
    }
  }, [news[1]?.item]);

  useEffect(() => {
    setCurrentArticles({
      title: isChoosen.item[0]?.title || "",
      thumbnail: isChoosen.item[0]?.thumbnail || null,
      timeline: isChoosen.item[0]?.timeline || "",
      link: isChoosen.item[0]?.link || "",
    });
  }, [news]);

  useEffect(() => {
    if (isChoosen.item.length > 0) {
      setCurrentArticles({
        title: isChoosen.item[0].title,
        thumbnail: isChoosen.item[0].thumbnail,
        timeline: isChoosen.item[0].timeline,
        link: isChoosen.item[0].link,
      });
    }
  }, [isChoosen]);

  useEffect(() => {
    if (
      currentArticles.title &&
      currentArticles.thumbnail &&
      currentArticles.timeline
    ) {
      setIsLoading(false);
    }
  }, [currentArticles]);

  const handleMouseEnter = (item) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentArticles({
        title: item.title,
        thumbnail: item.thumbnail,
        timeline: item.timeline,
        link: item.link,
      });
      setIsFading(false);
    }, 300);
  };

  if (isLoading) {
    return <SkeletonLoading />;
  }

  console.log(news);

  return (
    <div className="max-w-7xl mx-auto p-2 xl:p-0">
      {/* Navigation Section */}
      <div className="border-b-2">
        <div className="flex items-center">
          <ul className="flex flex-grow">
            {news.map((item, index) => (
              <li
                key={index}
                className={`relative md:text-2xl text-xs cursor-pointer p-3 hover:text-orange-600 ${
                  isChoosen === item ? "text-black" : "text-neutral-400"
                }`}
                onClick={() => setIsChoosen(item)}
              >
                {item.name}
                {/* Bottom border for the chosen part */}
                <span
                  className={`absolute left-0 bottom-[-2px] sm:block hidden h-[2px] w-full transition-all ${
                    isChoosen === item ? "bg-orange-600" : "bg-transparent"
                  }`}
                ></span>
              </li>
            ))}
          </ul>

          <Link
            href={"/tin-tuc"}
            className="text-orange-500 hover:text-orange-600 md:p-4 p-3 md:text-md text-xs"
          >{`Xem thêm >`}</Link>
        </div>
      </div>

      {/* Content Section */}
      <div className="my-5 flex gap-5">
        <div
          className={`w-1/2 transition-all duration-300 ease-in-out ${
            isFading ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        >
          {currentArticles.thumbnail ? (
            <Image
              src={currentArticles.thumbnail}
              width={600}
              height={400}
              alt="image"
              className="rounded"
            />
          ) : (
            <div className="w-[600px] h-[400px] bg-gray-200 rounded flex items-center justify-center">
              <span className="text-neutral-500">No Image Available</span>
            </div>
          )}

          <h1 className="md:text-xl max-w-[95%] text-md mt-3">
            {currentArticles.title}
          </h1>
          <p className="text-md text-neutral-400 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            {currentArticles.timeline}
          </p>
        </div>
        <div className="w-1/2">
          {isChoosen.item.map((item, index) => (
            <div
              className="my-5 pb-5 border-b-2"
              key={index}
              onMouseEnter={() => handleMouseEnter(item)}
            >
              <Link
                href={item.link}
                className="hover:text-neutral-400 md:text-xl text-md"
              >
                {item.title}
              </Link>
              <br />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
