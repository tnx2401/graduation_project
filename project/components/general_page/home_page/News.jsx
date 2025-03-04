"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ClockIcon } from "@heroicons/react/24/outline";

const News = () => {
  const header = ["Tin nổi bật", "Tin tức", "BĐS Hà Nội", "BĐS TP.HCM"];

  const [isChoosen, setIsChoosen] = useState(header[0]);
  const articles = useMemo(
    () => [
      {
        name: "Trọn Bộ Lãi Suất Vay Mua Nhà Mới Nhất Tháng 1/2025",
        imageSrc: "https://placehold.co/600x400/png",
        timeLine: "x tuần trước",
        link: "/",
      },
      {
        name: "Lời Tri Ân Sâu Sắc, Sao Việt Tặng Quà Và Thưởng Tết Tưng Bừng",
        imageSrc: "https://placehold.co/600x400/png",
        timeLine: "x tuần trước",
        link: "/",
      },
      {
        name: "Thị Trường Căn Hộ Chung Cư: Giá Bán Đồng Loạt Tăng Trên Cả Thị Trường Sơ Cấp Và Thứ Cấp",
        imageSrc: "https://placehold.co/600x400/png",
        timeLine: "x tuần trước",
        link: "/",
      },
      {
        name: "Cần Tháo Gỡ Những Nút Thắt Nào Để Thị Trường Bất Động Sản Việt Nam Phát Triển Bền Vững?",
        imageSrc: "https://placehold.co/600x400/png",
        timeLine: "x tuần trước",
        link: "/",
      },
      {
        name: "Thị Trường Bất Động Sản Việt Nam 2025: Sẵn Sàng Bước Vào Kỷ Nguyên Mới",
        imageSrc: "https://placehold.co/600x400/png",
        timeLine: "x tuần trước",
        link: "/",
      },
      {
        name: "Đất Đấu Giá Hà Nội: Sôi Nổi Nguồn Cung Đầu Năm 2025",
        imageSrc: "https://placehold.co/600x400/png",
        timeLine: "x tuần trước",
        link: "/",
      },
    ],
    []
  );
  const [currentArticles, setCurrentArticles] = useState({
    name: articles[0].name,
    imgSrc: articles[0].imageSrc,
    timeLine: articles[0].timeLine,
  });
  const [isFading, setIsFading] = useState(false);

  const handleMouseEnter = (item) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentArticles({
        name: item.name,
        imgSrc: item.imageSrc,
        timeLine: item.timeLine,
        link: item.link,
      });
      setIsFading(false);
    }, 300);
  };

  return (
    <div className="max-w-7xl mx-auto p-2 xl:p-0">
      {/* Navigation Section */}
      <div className="border-b-2">
        <div className="flex items-center">
          <ul className="flex flex-grow">
            {header.map((item, index) => (
              <li
                key={index}
                className={`relative md:text-2xl text-xs cursor-pointer p-3 hover:text-orange-600 ${
                  isChoosen === item ? "text-black" : "text-neutral-400"
                }`}
                onClick={() => setIsChoosen(item)}
              >
                {item}
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
            href={"/"}
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
          {currentArticles.imgSrc ? (
            <Image
              src={currentArticles.imgSrc}
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

          <h1 className="md:text-xl max-w-[95%] text-md mt-3">{currentArticles.name}</h1>
          <p className="text-md text-neutral-400 flex items-center">
            <ClockIcon className="w-5 h-5 mr-2" />
            {currentArticles.timeLine}
          </p>
        </div>
        <div className="w-1/2">
          {articles.map((item, index) => (
            <div
              className="my-5 pb-5 border-b-2"
              key={index}
              onMouseEnter={() => handleMouseEnter(item)}
            >
              <Link
                href={item.link}
                className="hover:text-neutral-400 md:text-xl text-md"
              >
                {item.name}
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
