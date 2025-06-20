"use client";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

const AdvertisingCard = dynamic(() =>
  import("@/components/general_page/shared/AdvertisingCard")
);

const ForYou = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [forYouPosts, setForYouPosts] = useState([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const storedLocation = localStorage.getItem("currentLocation");
    setCurrentLocation(storedLocation);
  }, []);

  useEffect(() => {
    if (!currentLocation) return;
    axios
      .post(`/api/handle_posts/getForYouPosts`, {
        province: currentLocation,
        demand: "Bán",
      })
      .then((res) => {
        setForYouPosts(res.data);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [currentLocation]);

  const visiblePosts = expanded ? forYouPosts : forYouPosts.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="flex items-center justify-between pt-10">
        <h1 className="text-2xl">Bất động sản dành cho bạn</h1>
        <div className="flex gap-5 items-center text-xs md:text-md">
          <Link href={"/nha-dat-ban"}>Tới trang tin bán</Link>
          <Link href={"/nha-dat-cho-thue"}>Tới trang tin cho thuê</Link>
        </div>
      </div>

      <div className="flex flex-wrap justify-start gap-5 px-2 md:px-0 my-5">
        <Suspense fallback={<div>Loading...</div>}>
          {visiblePosts.map((item, index) => (
            <AdvertisingCard
              key={index}
              title={item.title}
              image={item.images_url}
              price={item.price}
              area={item.area}
              location={`${item.district}, ${item.province}`}
              created_date={item.created_at}
            />
          ))}
        </Suspense>
      </div>

      {forYouPosts.length > 4 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center border py-2 px-10 mt-10 gap-2 mx-auto rounded bg-white border-neutral-500"
        >
          {expanded ? "Thu gọn" : "Mở rộng"}
          {expanded ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
};

export default React.memo(ForYou);
