"use client";
import React, { useEffect, useState, use, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";
import ImageSlider from "@/components/general_page/home_page/ImageSlider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ExclamationCircleIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

import { BsCoin, BsHouse } from "react-icons/bs";
import { IoIosResize } from "react-icons/io";
import { LuBed, LuBuilding2 } from "react-icons/lu";
import { PiBathtub, PiCouch } from "react-icons/pi";
import { GrDirections } from "react-icons/gr";
import { GoHome } from "react-icons/go";
import { GiRoad } from "react-icons/gi";
import { IoDocumentOutline } from "react-icons/io5";
import Loading from "../../loading";
import pathFunction from "@/components/general_page/shared/pathFunction";
import useStore from "@/lib/zustand";

const DynamicMap = dynamic(() => import("@/components/general_page/shared/MapContainer"), {
  ssr: false,
});

const AnimatedImage = ({ src, direction }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={src}
      initial={{ x: direction, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -direction, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute w-full h-full"
    >
      <Image
        src={src}
        fill
        alt="thumb-nail-image"
        style={{ objectFit: "contain" }}
      />
    </motion.div>
  </AnimatePresence>
);

const Page = ({ params }) => {
  const resolvedParams = use(params);
  const [data, setData] = useState(null);
  const [osmSearchData, setOSMSearchData] = useState({});
  const [currentImage, setCurrentImage] = useState(0);
  const [prevImage, setPrevImage] = useState(0);
  const { uid } = useStore();

  const slug = resolvedParams["itemSlug"];
  const postId = useMemo(() => slug.split("-")[0], [slug]);

  useEffect(() => {
    if (!postId) return;

    axios
      .get(`http://localhost:3000/api/handle_posts/getPostById?id=${postId}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching post:", err));
  }, [postId, params]);


  useEffect(() => {
    if (!data?.display_address) return;

    console.log("Searching for:", data.project || `${data.street}, ${data.district}, ${data.province}`);

    const searchQuery = (query, fallback = null) => {
      return axios
        .get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`)
        .then((res) => {
          if (res.data.length > 0) {
            setOSMSearchData(res.data[0]);
            console.log("Found result for:", query);
          } else if (fallback) {
            console.warn("No results found for:", query, "Retrying with:", fallback);
            return searchQuery(fallback); // Retry with fallback query
          } else {
            console.warn("No results found for:", query);
          }
        })
        .catch((error) => console.error("Error fetching coordinates:", error));
    };

    const projectQuery = data.project;
    const fallbackQuery = [data.street, data.district, data.province].filter(Boolean).join(", ");

    searchQuery(projectQuery, fallbackQuery);

    if (data.uid !== uid || !data.uid) {
      axios.post(`/api/handle_posts/updatePostStats`, {
        post_id: postId,
        view: data.view_count + 1,
      })
    }

    console.log(data);
  }, [data]);


  if (!data || !osmSearchData) return <Loading />;

  const direction = currentImage >= prevImage ? 100 : -100;

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
    if (price > 10000000000) {
      pricePerM2 = (price / 1000000000 / area).toFixed(2) + " tỷ/m²";
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

  return (
    <div className="max-w-6xl mx-auto flex gap-5">
      <div className="w-3/4">
        <div className="relative h-128 overflow-hidden rounded-bl-md rounded-br-md">
          <div
            className="absolute inset-0 mx-auto bg-contain blur-xl z-1"
            style={{ backgroundImage: `url(${data.images[currentImage]})` }}
          ></div>
          <div className="absolute inset-0 w-full h-full z-2 bg-black/30"></div>
          <AnimatedImage
            src={data.images[currentImage]}
            direction={direction}
          />
        </div>

        <div className="mt-1">
          <ImageSlider
            images={data.images}
            width={500}
            height={200}
            haveSearchBox={null}
            slidesPerView={6}
            gap={5}
            setCurrentImage={(newIndex) => {
              setPrevImage(currentImage);
              setCurrentImage(newIndex);
            }}
          />
        </div>

        <div className="my-3 mt-5 text-neutral-400 text-sm flex items-center gap-1">
          <Link
            href={
              resolvedParams["buy-hire-slug"].includes("ban")
                ? `/ban-${pathFunction.convertToSlug(data.type)}`
                : `/thue-${pathFunction.convertToSlug(data.type)}`
            }
          >
            {resolvedParams["buy-hire-slug"].includes("ban") ? "Bán" : "Thuê"}
          </Link>
          <span className="text-xs">/</span>
          <Link
            href={
              resolvedParams["buy-hire-slug"].includes("ban")
                ? `/ban-${pathFunction.convertToSlug(data.type)}-${pathFunction.convertToSlug(
                  data.province
                )}`
                : `/thue-${pathFunction.convertToSlug(data.type)}-${pathFunction.convertToSlug(
                  data.province
                )}`
            }
          >
            {data.province}
          </Link>
          <span className="text-xs">/</span>
          <Link
            href={
              resolvedParams["buy-hire-slug"].includes("ban")
                ? `/ban-${pathFunction.convertToSlug(data.type)}-${pathFunction.convertToSlug(
                  data.district
                )}`
                : `/thue-${pathFunction.convertToSlug(data.type)}-${pathFunction.convertToSlug(
                  data.district
                )}`
            }
          >
            {data.district}
          </Link>
          {data.street && (
            <>
              <span className="text-xs">/</span>
              <Link
                className="text-black"
                href={
                  resolvedParams["buy-hire-slug"].includes("ban")
                    ? `/ban-${pathFunction.convertToSlug(data.type)}-duong-${pathFunction.convertToSlug(
                      data.street
                    )}`
                    : `/thue-${pathFunction.convertToSlug(data.type)}-duong-${pathFunction.convertToSlug(
                      data.street
                    )}`
                }
              >
                {data.type} tại {data.street}
              </Link>
            </>
          )}
        </div>

        <h1 className="text-2xl font-medium ">{data.title}</h1>
        <p className="text-sm my-3 mb-5 text-black">{data.display_address}</p>

        <hr />

        <div className="flex mt-5 items-center justify-between">
          <div className="flex gap-10">
            <div className="flex flex-col gap-1 font-normal">
              <p className="text-md text-neutral-500">Mức giá</p>
              <h1 className="font-semibold text-xl">
                {priceConverter(data.price)}
              </h1>
              <p className="text-xs text-neutral-400">
                ~{priceOverSquare(data.price, data.area)}
              </p>
            </div>

            <div className="flex flex-col gap-1 font-normal">
              <p className="text-md text-neutral-500">Diện tích</p>
              <h1 className="font-semibold text-xl">{data.area}m²</h1>
              <p className="text-xs text-neutral-400">Mặt tiền 4 m</p>
            </div>

            <div className="flex flex-col gap-1 font-normal">
              <p className="text-md text-neutral-500">Phòng ngủ</p>
              <h1 className="font-semibold text-xl">{data.bedroom} PN</h1>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ShareIcon className="w-6 h-6" />
            <ExclamationCircleIcon className="w-6 h-6" />
            <HeartIcon className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-10">
          <h1 className="font-semibold text-lg">Thông tin mô tả</h1>
          <pre className="font-sans text-base whitespace-pre-wrap">
            {data.description}
          </pre>
        </div>

        <div className="mt-10">
          <h1 className="font-semibold text-lg">Đặc điểm bất động sản</h1>
          <div className="grid grid-cols-2 gap-10 mt-5">
            {[
              {
                icon: <BsCoin />,
                text: "Mức giá",
                content: data.price ? priceConverter(data.price) : null,
              },
              {
                icon: <IoIosResize />,
                text: "Diện tích",
                content: data.area ? `${data.area}m²` : null,
              },
              {
                icon: <LuBed />,
                text: "Số phòng ngủ",
                content: data.bedroom ? `${data.bedroom} phòng` : null,
              },
              {
                icon: <PiBathtub />,
                text: "Số phòng tắm",
                content: data.bathroom ? `${data.bathroom} phòng` : null,
              },
              {
                icon: <LuBuilding2 />,
                text: "Số tầng",
                content: data.floor ? `${data.floor} tầng` : null,
              },
              {
                icon: <GrDirections />,
                text: "Hướng nhà",
                content: data.house_direction || null,
              },
              {
                icon: <BsHouse />,
                text: "Hướng ban công",
                content: data.balcony_direction || null,
              },
              {
                icon: <IoDocumentOutline />,
                text: "Pháp lý",
                content: data.document ? data.document : null,
              },
              {
                icon: <PiCouch />,
                text: "Nội thất",
                content: data.interior ? data.interior : null,
              },
              {
                icon: <GoHome />,
                text: "Mặt tiền",
                content: data.frontage ? `${data.frontage} m` : null,
              },
              {
                icon: <GiRoad />,
                text: "Đường vào",
                content: data.entrance ? `${data.entrance} m` : null,
              },
            ]
              .filter((item) => item.content)
              .map((item, index) => (
                <div key={index} className="flex items-center gap-5">
                  <div className="flex items-center gap-2 text-lg w-1/2">
                    <p className="text-2xl">{item.icon}</p>
                    <span className="font-normal text-sm">{item.text}</span>
                  </div>
                  <span className="font-normal">{item.content}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="mt-10">
          <h1 className="font-semibold text-lg mb-5">Xem trên bản đồ</h1>
          {osmSearchData.lat && osmSearchData && (
            <DynamicMap center={[osmSearchData.lat, osmSearchData.lon]} />
          )}
        </div>

        <div className="mt-20"></div>
      </div>

      <div className="w-1/4">
        <div className="w-full border flex flex-col items-center justify-center p-5 mt-5 rounded-lg">
          <Image
            src={data.profile_picture}
            width={80}
            height={80}
            alt="author-image"
            className="rounded-full"
          />
          <h1 className="mt-3 font-semibold">{data.contact_name}</h1>
          <button className="w-full bg-teal-600/80 py-3 font-normal text-sm text-white rounded-lg mt-5">
            {data.phone_number}
          </button>
          <button className="w-full border border-gray-400 py-3 font-normal text-sm rounded-lg mt-5">
            Gửi Email
          </button>
          <button className="w-full border border-gray-400 py-3 font-normal text-sm rounded-lg mt-5">
            Yêu cầu liên hệ lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
