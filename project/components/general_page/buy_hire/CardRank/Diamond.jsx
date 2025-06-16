import Image from "next/image";
import Link from "next/link";
import React, { useMemo, useCallback, useEffect, useState } from "react";

import { LuBed } from "react-icons/lu";
import { PiBathtub } from "react-icons/pi";
import { MdOutlinePhoneInTalk } from "react-icons/md";
import { HeartIcon, PhotoIcon } from "@heroicons/react/24/outline";
import pathFunction from "../../shared/pathFunction";
import useLikeStore from "@/lib/likeStore";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Diamond = React.memo(({ cardData, path, hasUid }) => {
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
    <div className="bg-white h-128 border shadow-md cursor-pointer">
      <Link href={`/${path}/${cardData.id}-${convertToSlug(cardData.title)}`}>
        <div className="flex gap-1 h-3/5 w-full">
          <div className="relative w-2/3">
            <div
              className="absolute inset-0 bg-cover blur-xs"
              style={{ backgroundImage: `url(${cardData.images[0]})` }}
            ></div>
            <span className="absolute top-5 -left-2 text-sm text-white bg-red-500 p-1 rounded-tr-md rounded-br-md rounded-tl-lg z-40">
              {cardData.rank_name}
              <span className="absolute w-2 h-2 left-0 -bottom-2 rounded-bl-2xl bg-red-800"></span>
            </span>
            <Image
              src={cardData.images[0]}
              fill
              style={{ objectFit: "cover" }}
              alt="image"
              priority
            />
          </div>
          <div className="w-1/3 flex flex-col gap-1">
            <div className="relative h-1/2 w-full">
              <div
                className="absolute inset-0 bg-cover blur-xs"
                style={{ backgroundImage: `url(${cardData.images[1]})` }}
              ></div>
              <Image
                loading="lazy"
                src={cardData.images[1]}
                fill
                style={{ objectFit: "contain", objectPosition: "center" }}
                alt="image"
              />
            </div>
            <div className="h-1/2 w-full flex gap-1">
              <div className="relative w-1/2">
                <Image
                  loading="lazy"
                  src={cardData.images[2]}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  alt="image"
                />
              </div>

              <div className="relative w-1/2">
                <Image
                  loading="lazy"
                  src={cardData.images[3]}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  alt="image"
                />
                <span className="absolute right-2 bottom-2 text-white bg-black/50 px-2 rounded-lg flex text-lg items-center gap-1 ">
                  <PhotoIcon className="w-6 h-6" />
                  {cardData.images.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-1.5/5 bg w-full">
          <div className=" h-full p-5 border-b-2 border-neutral-100">
            <h1 className="uppercase line-clamp-1">{cardData.title}</h1>
            <div className="mt-2 text-red-600 flex gap-2 items-center">
              <p>
                {Number(cardData.price) !== 0
                  ? priceConverter(cardData.price)
                  : "Thỏa thuận"}
              </p>
              <span className="w-0.5 h-0.5 bg-gray-300"></span>
              <p>{cardData.area} m²</p>
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
              <span className="w-0.5 h-0.5 bg-gray-300"></span>
              <p className="text-sm text-neutral-400">
                {cardData.ward}, {cardData.district}
              </p>
            </div>
            <p className="mt-3 text-sm text-neutral-400 line-clamp-2 w-full">
              {cardData.description}
            </p>
          </div>
        </div>
      </Link>

      <div className="flex items-center justify-between mt-2">
        <Link
          href={`/nha-moi-gioi/${pathFunction.convertToSlug(
            cardData.contact_name
          )}-${cardData.user_id}`}
          className="flex items-center justify-between pl-5 gap-3"
        >
          <Image
            loading="lazy"
            src={cardData.profile_picture}
            width={35}
            height={35}
            className="rounded-full"
            alt="profile_picture"
          />
          <div className="">
            <h1 className="text-sm text-neutral-600">
              {cardData.contact_name}
            </h1>
            <p className="text-xs text-neutral-400">
              {handlePostDay(cardData.payment.created_at)}
            </p>
          </div>
        </Link>

        <div className="flex mr-5 gap-5">
          <button className="flex items-center gap-2 bg-teal-500 text-white p-1 px-3 rounded-lg">
            <span>
              <MdOutlinePhoneInTalk />
            </span>
            {userId
              ? cardData.phone_number
              : cardData.phone_number.replace(/\d{3}$/, "***")}
          </button>
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
  );
});

export default Diamond;
