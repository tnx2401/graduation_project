"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { ChevronRightIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import pathFunction from "../shared/pathFunction";

const StrikingProjects = () => {
  const [strikingProjects, setStrikingProjects] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/handle_projects/getStrikingProjects`)
      .then((res) => {
        setStrikingProjects(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  console.log(strikingProjects);

  return (
    <div className="my-10 max-w-7xl mx-auto">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl">Dự án bất động sản nổi bật</h1>
        <Link
          href={`/du-an`}
          className="text-orange-500 text-sm flex items-center hover:underline hover:text-orange-700"
        >
          Xem thêm <ChevronRightIcon className="w-3 h-3" />
        </Link>
      </div>
      <div className="flex flex-wrap justify-start gap-5 px-2 md:px-0 my-10">
        {strikingProjects.slice(0, 4).map((item, index) => (
          <Link
            href={`/du-an/${pathFunction.convertToSlug(item.name)}-${item.id}`}
            key={index}
            className="flex flex-col h-72 w-[300px] shadow border rounded-lg hover:shadow-xl transition cursor-pointer"
          >
            <div className="w-full h-1/2 relative">
              <Image
                src={item.images[0]}
                fill
                alt="project_thumbnail"
                className="object-cover rounded-t-lg"
              />
            </div>
            <div className="h-1/2 p-3">
              <h1
                className={`${
                  item.status === "Đang mở bán"
                    ? "bg-green-200 text-green-700"
                    : item.status === "Đang cập nhật"
                    ? "bg-gray-200 text-gray-700"
                    : "bg-rose-200 text-rose-700"
                } inline-block px-2 text-xs rounded-md`}
              >
                {item.status}
              </h1>

              <div className="mt-1 ml-1 flex flex-col gap-1">
                <h1 className="font-medium text-lg">{item.name}</h1>
                <h2 className="text-sm text-gray-600">
                  {item.optional_info.area} {item.optional_info.mode}
                </h2>
                <h2 className="text-sm flex items-center mt-2 text-gray-600">
                  <MapPinIcon className="w-4 h-4" />
                  {item.district}, {item.province}
                </h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StrikingProjects;
