import React, { useState } from "react";
import Slider from "@mui/material/Slider";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import useStore from "@/lib/zustand";

const AreaPanel = ({ searchQuery, setSearchQuery, setIsAreaPanel }) => {
  const [minArea, setMinArea] = useState(0);
  const [maxArea, setMaxArea] = useState(500);
  const [areaRange, setAreaRange] = useState([minArea, maxArea]);
  const { g_houseType } = useStore();
  //* Xử lý slider diện tích
  const handleAreaChange = (event, newValue) => {
    setAreaRange(newValue);
  };

  return (
    <>
      <div className="flex items-center justify-between p-5 border-b">
        <h1 className="font-semibold">Diện tích</h1>
        <ArrowLeftIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => setIsAreaPanel(false)}
        />
      </div>

      <div className="w-full overflow-x-hidden overflow-y-auto">
        <div className="p-4 text-sm">
          <p>
            Diện tích từ {areaRange[0]} m² đến {areaRange[1]} m²
          </p>
          <Slider
            getAriaLabel={() => "Diện tích"}
            value={areaRange}
            onChange={handleAreaChange}
            min={minArea}
            max={maxArea}
            step={5}
          />
          {g_houseType.content[2].option.map((item, index) => (
            <div
              key={index}
              className="my-2 flex items-center justify-between rounded hover:bg-gray-200 p-2"
              onClick={() => {
                setSearchQuery({ ...searchQuery, area: item });
                setIsAreaPanel(false);
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

export default AreaPanel;
