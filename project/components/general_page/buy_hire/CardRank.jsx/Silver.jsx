import Image from "next/image";
import Link from "next/link";
import React from "react";

import { LuBed } from "react-icons/lu";
import { PiBathtub } from "react-icons/pi";
import { HeartIcon, MapPinIcon, PhotoIcon } from "@heroicons/react/24/outline";

const Silver = ({ cardData, path }) => {
  const priceConverter = (price) => {
    const cleanedPrice = price.replace(/[^\d]/g, "");

    if (cleanedPrice.length > 19) return;

    if (cleanedPrice < 1000) {
      return;
    } else if (cleanedPrice >= 1000 && cleanedPrice < 1000000) {
      return (cleanedPrice / 1000).toFixed(2) + " nghìn";
    } else if (cleanedPrice >= 1000000 && cleanedPrice < 1000000000) {
      return (cleanedPrice / 1000000).toFixed(2) + " triệu";
    } else if (cleanedPrice >= 1000000000) {
      return (cleanedPrice / 1000000000).toFixed(2) + " tỷ";
    }
  };

  const priceOverSquare = (price, area) => {
    let pricePerM2;

    // Price per square meter based on the range
    if (price >= 100000000000) {
      pricePerM2 = (price / 1000000000 / area).toFixed(2) + " tỷ/m²";
    } else if (price > 10000000000 && price < 100000000000) {
      pricePerM2 = (price / 1000000 / area).toFixed(2) + " triệu/m²";
    } else if (price >= 1000000000 && price < 10000000000) {
      pricePerM2 = (price / 1000000 / area).toFixed(2) + " triệu/m²";
    } else if (price >= 10000000) {
      pricePerM2 = (price / 1000000 / area).toFixed(2) + " triệu/m²";
    } else if (price >= 1000000 && price < 10000000) {
      pricePerM2 = (price / 1000 / area).toFixed(2) + " nghìn/m²";
    } else if (price >= 1000) {
      pricePerM2 = (price / 1000 / area).toFixed(2) + " nghìn/m²";
    }

    return pricePerM2;
  };

  const handlePostDay = (date) => {
    const convertDate = new Date(date);
    const today = new Date();
    let dateDiff = new Date(today - convertDate);

    if (today.getDate() - convertDate.getDate() == 0) {
      return "Đăng hôm nay";
    } else {
      return `Đăng ` + dateDiff.getDate() + ` ngày trước`;
    }
  };

  const convertToSlug = (title) => {
    return title
      .toLowerCase()
      .normalize("NFD") // Normalize Vietnamese characters
      .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
      .replace(/đ/g, "d") // Convert "đ" to "d"
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .trim()
      .replace(/\s+/g, "-"); // Replace spaces with dashes
  };
  return (
    <Link href={`/${path}/${cardData.id}-${convertToSlug(cardData.title)}`}>
      <div className="bg-white h-64 border shadow-md cursor-pointer ">
        <div className="w-full h-full flex pb-1">
          <div className="h-full w-1/4 z-30">
            <div className="relative w-full h-2/3">
              <span className="absolute top-2 -left-2 text-xs text-white bg-green-700 p-1 rounded-tr-md rounded-br-md rounded-tl-lg z-40">
                {cardData.rank_name}
                <span className="absolute w-2 h-2 left-0 -bottom-2 rounded-bl-2xl bg-green-800"></span>
              </span>
              <Image
                loading="lazy"
                src={cardData.images[0]}
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
                alt="image"
              />
            </div>
            <div className="w-full h-1/3 flex gap-1 mt-1 ">
              <div className="relative h-full w-1/2">
                <Image
                  loading="lazy"
                  src={cardData.images[1]}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  alt="image"
                />
              </div>
              <div className="relative w-1/2 h-full">
                <Image
                  loading="lazy"
                  src={cardData.images[2]}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  alt="image"
                />
                <span className="absolute right-2 bottom-2 text-white flex text-lg items-center gap-1 ">
                  <PhotoIcon className="w-6 h-6" />
                  {cardData.images.length}
                </span>
              </div>
            </div>
          </div>

          <div className="h-full w-3/4 p-5 flex flex-col">
            <h1 className="">{cardData.title}</h1>
            <div className="mt-2 text-red-600 flex gap-2 items-center">
              <p>
                {cardData.price
                  ? priceConverter(cardData.price)
                  : cardData.unit}
              </p>
              <span className="w-0.5 h-0.5 bg-gray-300"></span>
              <p>{cardData.area} m²</p>
              <span className="w-0.5 h-0.5 bg-gray-300"></span>
              <p className="text-sm text-neutral-400">
                {priceOverSquare(cardData.price, cardData.area)}
              </p>
              {cardData.bedroom > 0 && (
                <>
                  <span className="w-0.5 h-0.5 bg-gray-300"></span>
                  <p className="text-neutral-400 flex items-center gap-2">
                    {cardData.bedroom}
                    <span>
                      <LuBed />
                    </span>
                  </p>
                </>
              )}

              {cardData.bathroom > 0 && (
                <>
                  <span className="w-0.5 h-0.5 bg-gray-300"></span>
                  <p className="text-neutral-400 flex items-center gap-2">
                    {cardData.bathroom}
                    <span>
                      <PiBathtub />
                    </span>
                  </p>
                </>
              )}
            </div>
            <p className="mt-3 text-sm text-neutral-400 flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              {cardData.district}, {cardData.province}
            </p>
            <p className="mt-3 text-sm text-neutral-400 line-clamp-2 w-full">
              {cardData.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <p className="text-xs text-neutral-400">
                {handlePostDay(cardData.payment.created_at)}
              </p>
              <button className="">
                <HeartIcon className="w-6 h-6 border border-gray-300 p-1 rounded" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Silver;
