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
  rank,
}) => {
  return (
    <div className="bg-white h-[21rem] flex flex-col justify-between mt-5 shadow-lg hover:shadow-xl cursor-pointer rounded-lg">
      <div>
        <Image
          src={image}
          width={399}
          height={200}
          alt={title}
          className="rounded-tl-lg rounded-tr-lg"
        />
        <h1 className="line-clamp-2 break-words mx-3 mt-2">{title}</h1>
        <div className="flex gap-3 mx-3 mt-3 items-center">
          <p className="text-red-600">{price} tỷ</p>
          <p className="bg-neutral-400 rounded-lg w-0.5 h-0.5"></p>
          <p className="text-red-600">{area} m²</p>
        </div>
        <p className="mx-3 mt-2 text-neutral-500 text-sm flex items-center gap-2">
          <span>
            <MapPinIcon className="w-4 h-4" />
          </span>
          {location}
        </p>
      </div>
      <div className="flex items-center justify-between mx-3 pb-2">
        <p className="text-neutral-400 text-xs">{created_date}</p>
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
