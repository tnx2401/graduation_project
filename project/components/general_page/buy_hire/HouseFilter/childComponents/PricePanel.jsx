import React, { useState, useEffect } from "react";
import options from "@/components/general_page/home_page/SearchBox/data";
import Slider from "@mui/material/Slider";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import useStore from "@/lib/zustand";

const PricePanel = ({ searchQuery, setSearchQuery, setIsPricePanel }) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(
    searchQuery.demand === "Tìm mua" ? 60 : 100
  );
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);
  const { g_houseType } = useStore();

  const getNumberFromString = (str) => {
    const number = str.match(/\d+/)?.[0];
    return Number(number);
  };

  useEffect(() => {
    if (searchQuery.demand === "Tìm mua") {
      setPriceRange([
        0,
        getNumberFromString(
          options[0].content[1].option[options[0].content[1].option.length - 2]
        ),
      ]);
    } else {
      setPriceRange([
        0,
        getNumberFromString(
          options[1].content[1].option[options[1].content[1].option.length - 2]
        ),
      ]);
    }
  }, [options, searchQuery.demand]);

  //* Xử lý slider giá
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };
  return (
    <>
      <div className="flex items-center justify-between p-5 border-b">
        <h1 className="font-semibold">Mức giá</h1>
        <ArrowLeftIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => setIsPricePanel(false)}
        />
      </div>

      <div className="w-full overflow-x-hidden overflow-y-auto">
        <div className="p-4 text-sm">
          <p>
            Khoảng giá: {priceRange[0]}
            {searchQuery.demand === "Tìm mua" ? "tỷ" : "triệu"} -{" "}
            {priceRange[1]}
            {searchQuery.demand === "Tìm mua" ? "tỷ" : "triệu"}
          </p>
          <Slider
            getAriaLabel={() => "Khoảng giá"}
            value={priceRange}
            onChange={handlePriceChange}
            min={minPrice}
            max={maxPrice}
            step={0.1}
          />
          {g_houseType.content[1].option.map((item, index) => (
            <div
              key={index}
              className="my-2 flex items-center justify-between rounded hover:bg-gray-200 p-2"
              onClick={() => {
                setSearchQuery({ ...searchQuery, price: item });
                setIsPricePanel(false);
              }}
            >
              <h1>{item}</h1>
              <input
                type="checkbox"
                name=""
                id=""
                checked={searchQuery.price === item}
                readOnly
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-5 p-5">
        <button className="w-1/4 border rounded p-2">Đặt lại</button>
        <button className="border p-2 rounded w-3/4 bg-red-600 text-white">
          Áp dụng
        </button>
      </div>
    </>
  );
};

export default PricePanel;
