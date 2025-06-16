"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Cookies from "js-cookie";
import useStore from "@/lib/zustand";
import { useRouter } from "next/navigation";
import pathFunction from "../shared/pathFunction";

const RealEstateByLocation = () => {
  const route = useRouter();
  const [locationData, setLocationData] = useState([]);
  const { g_setProvince, g_setSearchQuery } = useStore();

  const imageMap = [
    {
      name: "Hà Nội",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/1/10/Hanoi_Skyline_-_NKS.jpg",
    },
    {
      name: "Hồ Chí Minh",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/0/08/Ho_Chi_Minh_City_Skyline_at_Night.jpg",
    },
    {
      name: "Bình Dương",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/1/13/Khutrungtamhanhchinhtpdian.jpg",
    },
    {
      name: "Đà nẵng",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/4/4c/Han_River_Bridge_in_Vietnam_Night_View.jpg",
    },
    {
      name: "Đồng Nai",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/commons/8/85/Nhà_thờ_chính_Văn_miếu_Trấn_Biên.jpg",
    },
  ];

  useEffect(() => {
    axios
      .get(`/api/getTop5RealEstateByLocation`)
      .then((res) => {
        setLocationData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const normalizeString = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-zA-Z0-9 ]/g, "") // Remove special characters
      .toLowerCase()
      .trim();

  const getThumbnail = (locationName) => {
    const normalizedName = normalizeString(locationName);
    const match = imageMap.find(
      (img) => normalizeString(img.name) === normalizedName
    );
    return match?.thumbnail || "/fallback.jpg"; // You can replace this with a default image
  };

  const handleNavigate = (location) => {
    g_setProvince(location);
    g_setSearchQuery({
      demand: "Tìm mua",
      address: [{ province: location }],
    });
    Cookies.set(
      "searchQuery",
      JSON.stringify({
        demand: "Tìm mua",
        address: [{ province: location }],
      })
    );

    route.push(`/nha-dat-ban-${pathFunction.convertToSlug(location)}`);
  };

  return (
    <div className="max-w-7xl mx-auto my-10">
      <h1 className="h-1"></h1>
      <h1 className="text-2xl mb-6 mt-24">Bất động sản theo địa điểm</h1>
      {locationData.length > 0 && (
        <div className="flex flex-col md:flex-row gap-5 px-2 xl:px-0">
          {/* Left side - locationData[0] */}
          <div className="w-full md:w-1/2 py-2">
            <div
              className="relative h-[250px] md:h-full w-full rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transition"
              onClick={() => handleNavigate(locationData[0].province)}
            >
              <Image
                src={getThumbnail(locationData[0].province)}
                alt={locationData[0].province}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 bg-opacity-50 text-white p-4 w-full">
                <h2 className="text-xl font-semibold">
                  {locationData[0].province}
                </h2>
                <p>{locationData[0].total_posts} tin đăng</p>
              </div>
            </div>
          </div>

          {/* Right side - grid of 4 */}
          <div className="w-full md:w-1/2 py-2 grid grid-cols-2 gap-4">
            {locationData.slice(1, 5).map((item, index) => (
              <div
                key={index}
                className="relative h-48 rounded-lg overflow-hidden cursor-pointer hover:shadow-xl hover:scale-105 transition"
                onClick={() => handleNavigate(item.province)}
              >
                <Image
                  src={getThumbnail(item.province)}
                  alt={item.province}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 bg-opacity-50 text-white p-4 w-full">
                  <h2 className="text-lg font-semibold">{item.province}</h2>
                  <p>{item.total_posts} tin đăng</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealEstateByLocation;
