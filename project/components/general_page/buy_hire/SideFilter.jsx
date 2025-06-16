"use client";
import React from "react";
import useStore from "@/lib/zustand";

const priceData = [
  {
    name: "Lọc theo khoảng giá",
    option: [
      { name: "Thỏa thuận", path: "thoa-thuan" },
      { name: "Dưới 500 triệu", path: "gia-duoi-500-trieu" },
      { name: "500 - 800 triệu", path: "gia-tu-500-den-800-trieu" },
      { name: "800 triệu - 1 tỷ", path: "gia-tu-800-trieu-den-1-ty" },
      { name: "1 - 2 tỷ", path: "gia-tu-1-den-2-ty" },
      { name: "2 - 3 tỷ", path: "gia-tu-2-den-3-ty" },
      { name: "3 - 5 tỷ", path: "gia-tu-3-den-5-ty" },
      { name: "5 - 7 tỷ", path: "gia-tu-5-den-7-ty" },
      { name: "7 - 10 tỷ", path: "gia-tu-7-den-10-ty" },
      { name: "10 - 20 tỷ", path: "gia-tu-10-den-20-ty" },
      { name: "20 - 30 tỷ", path: "gia-tu-20-den-30-ty" },
      { name: "30 - 40 tỷ", path: "gia-tu-30-den-40-ty" },
      { name: "40 - 60 tỷ", path: "gia-tu-40-den-60-ty" },
      { name: "Trên 60 tỷ", path: "gia-tren-60-ty" },
    ],
  },
];
const areaData = [
  {
    name: "Lọc theo diện tích",
    option: [
      { name: "Dưới 30 m²", path: "dien-tich-duoi-30-m2" },
      { name: "30 - 50 m²", path: "dien-tich-tu-30-den-50-m2" },
      { name: "50 - 80 m²", path: "dien-tich-tu-50-den-80-m2" },
      { name: "80 - 100 m²", path: "dien-tich-tu-80-den-100-m2" },
      { name: "100 - 150 m²", path: "dien-tich-tu-100-den-150-m2" },
      { name: "150 - 200 m²", path: "dien-tich-tu-150-den-200-m2" },
      { name: "200 - 250 m²", path: "dien-tich-tu-200-den-250-m2" },
      { name: "250 - 300 m²", path: "dien-tich-tu-250-den-300-m2" },
      { name: "300 - 500 m²", path: "dien-tich-tu-300-den-500-m2" },
      { name: "Trên 500 m²", path: "dien-tich-tren-500-m2" },
    ],
  },
];

const SideFilter = () => {
  const { g_setSearchQuery, g_searchQuery } = useStore();

  return (
    <div>
      {priceData.map((item, index) => (
        <div key={index} className="border p-2 rounded-md my-5">
          <h1 className="text-semibold">{item.name}</h1>
          <div className="flex flex-col mt-3">
            {item.option.map((item, index) => (
              <h1
                className="py-1 font-normal text-neutral-400 cursor-pointer hover:text-black"
                key={index}
                onClick={() => {
                  g_setSearchQuery({ ...g_searchQuery, price: item.name });
                }}
              >
                {item.name}
              </h1>
            ))}
          </div>
        </div>
      ))}

      {areaData.map((item, index) => (
        <div key={index} className="border p-2 rounded-md my-5">
          <h1 className="text-semibold">{item.name}</h1>
          <div className="flex flex-col mt-3">
            {item.option.map((item, index) => (
              <h1
                className="py-1 font-normal text-neutral-400 cursor-pointer hover:text-black"
                key={index}
                onClick={() => {
                  g_setSearchQuery({ ...g_searchQuery, area: item.name });
                  window.location.reload;
                }}
              >
                {item.name}
              </h1>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SideFilter;
