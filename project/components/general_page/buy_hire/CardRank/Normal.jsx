import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useCallback, useEffect, useState } from "react";

import { LuBed } from "react-icons/lu";
import { PiBathtub } from "react-icons/pi";
import { HeartIcon, MapPinIcon } from "@heroicons/react/24/outline";

import useLikeStore from "@/lib/likeStore";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Normal = React.memo(({ cardData, path, hasUid }) => {
  const [userId, setUserId] = useState();
  const { likedPosts, toggleLike, setLike } = useLikeStore();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      setUserId(userId);
    }
  }, []);

  const isLiked = useMemo(
    () => likedPosts.some((p) => p.post_id === cardData.id),
    [likedPosts, cardData.id]
  );

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

  const handleLikePost = useCallback(
    async (post_id, user_id, title, post_start_date, image) => {
      const post = {
        post_id: post_id,
        user_id: user_id,
        title: title,
        post_start_date: post_start_date,
        image: image,
      };

      const currentlyLiked = likedPosts.some((p) => p.post_id === post.post_id);
      toggleLike(post);

      try {
        await axios.post("/api/handle_posts/handleLikePost", {
          post_id: post.post_id,
          user_id: post.user_id,
          like: !currentlyLiked,
        });
      } catch (error) {
        setLike(post_id, currentlyLiked); // Rollback
        console.error("Failed to update like:", error);
      }
    },
    [likedPosts, toggleLike, setLike]
  );
  return (
    <Link href={`/${path}/${cardData.id}-${convertToSlug(cardData.title)}`}>
      <div className="bg-white h-48 border shadow-md cursor-pointer">
        <div className="w-full h-full flex">
          <div className="h-full w-1/4">
            <div className="relative w-full h-full">
              <Image
                src={cardData.images[0]}
                fill
                style={{ objectFit: "cover", objectPosition: "center" }}
                alt="image"
                priority
              />
            </div>
          </div>

          <div className="h-full w-3/4 p-5 flex flex-col">
            <h1 className="">{cardData.title}</h1>
            <div className="mt-2 text-red-600 flex gap-2 items-center">
              <p>
                {Number(cardData.price) !== 0
                  ? priceConverter(cardData.price)
                  : "Thỏa thuận"}
              </p>
              <span className="w-0.5 h-0.5 bg-gray-300"></span>
              <p>{cardData.area} m²</p>
              <span className="w-0.5 h-0.5 bg-gray-300"></span>
              {Number(cardData.price) !== 0 && (
                <>
                  <span className="w-0.5 h-0.5 bg-gray-300"></span>
                  <p className="text-sm text-neutral-400">
                    {priceOverSquare(cardData.price, cardData.area)}
                  </p>
                </>
              )}

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
            <p className="mt-3 text-sm text-neutral-400 flex gap-2 flex-grow">
              <MapPinIcon className="w-5 h-5" />
              {cardData.district}, {cardData.province}
            </p>

            <div className="flex items-end justify-between">
              <p className="text-xs text-neutral-400">
                {handlePostDay(cardData.post_start_date)}
              </p>
              {hasUid && (
                <button
                  className=""
                  onClick={() =>
                    handleLikePost(
                      cardData.id,
                      userId,
                      cardData.title,
                      cardData.post_start_date,
                      cardData.images[0]
                    )
                  }
                >
                  <HeartIcon
                    className={`w-8 h-8 border border-gray-300 p-1 rounded ${
                      isLiked ? "bg-red-400 text-white" : ""
                    }`}
                  />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default Normal;
