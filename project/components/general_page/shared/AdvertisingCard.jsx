import React from "react";
import Image from "next/image";
import { MapPinIcon, HeartIcon } from "@heroicons/react/24/outline";

const AdvertisingCard = ({
  title,
  image,
  price,
  area,
  location,
  created_date,
}) => {
  const handlePrice = (price) => {
    const cleanedPrice = price.replace(/[^\d]/g, "");

    if (cleanedPrice.length > 19) return;

    if (cleanedPrice < 1000) {
      return "";
    } else if (cleanedPrice >= 1000 && cleanedPrice < 1000000) {
      return (cleanedPrice / 1000).toFixed(2) + " nghìn";
    } else if (cleanedPrice >= 1000000 && cleanedPrice < 1000000000) {
      return (cleanedPrice / 1000000).toFixed(2) + " triệu";
    } else if (cleanedPrice >= 1000000000) {
      return (cleanedPrice / 1000000000).toFixed(2) + " tỷ";
    }
  };

  const getRelativeDate = (date) => {
    const postDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - postDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Đăng hôm nay";
    } else if (diffDays === 1) {
      return "Đăng 1 ngày trước";
    } else {
      return `Đăng ${diffDays} ngày trước`;
    }
  };

  return (
    <div className="bg-white w-[290px] h-[21rem] flex flex-col justify-between mt-5 shadow-lg hover:shadow-xl cursor-pointer rounded-lg">
      <div>
        <div className="relative w-full h-40 rounded-tl-lg rounded-tr-lg overflow-hidden">
          <Image
            src={image}
            fill
            objectFit="cover"
            alt={title}
            className="rounded-tl-lg rounded-tr-lg"
          />
        </div>
        <h1 className="line-clamp-2 break-words mx-3 mt-2">{title}</h1>
        <div className="flex gap-3 mx-3 mt-3 items-center">
          {Number(price) !== 0 ? (
            <p className="text-red-600">{handlePrice(price)}</p>
          ) : (
            <p className="text-red-600">Thỏa thuận</p>
          )}
          <p className="bg-neutral-400 rounded-lg w-0.5 h-0.5"></p>
          <p className="text-red-600">{area} m²</p>
        </div>
        <p className="mx-3 mt-2 text-neutral-500 text-sm flex items-center gap-2">
          <MapPinIcon className="w-4 h-4" />
          <span className="line-clamp-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {location}
          </span>
        </p>
      </div>
      <div className="flex items-center justify-between mx-3 pb-2 text-xs">
        <p className="text-neutral-400">{getRelativeDate(created_date)}</p>
        <button className="relative p-2 border-neutral-400 rounded  border group">
          <HeartIcon className="w-4 h-4" />
          <span
            className="absolute -bottom-0 left-1/2 
            transform -translate-x-1/2 w-28 py-1.5 opacity-0 invisible translate-y-10
            text-xs bg-black text-white rounded-md transition-all duration-300 ease-out
            group-hover:opacity-100 group-hover:visible group-hover:translate-y-14"
          >
            Bấm để lưu tin
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-black"></span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default AdvertisingCard;
