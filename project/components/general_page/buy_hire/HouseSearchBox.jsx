"use client";
import {
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect, useTransition, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import HouseFilter from "./HouseFilter/HouseFilter";
import useStore from "@/lib/zustand";
import pathFunction from "../shared/pathFunction";
import Loading from "@/app/(trang-chu)/loading";
import Cookies from "js-cookie";

const HouseSearchBox = () => {
  const path = usePathname();
  const router = useRouter();

  const [isFiltering, setIsFiltering] = useState();
  const [filterCount, setFilterCount] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState({
    demand: "Tìm mua",
    type: [],
    address: [],
    price: "",
    area: "",
    bedroom: "",
    houseDirection: [],
    balconyDirection: [],
  });

  const { g_street, g_ward, g_district, g_province, g_searchQuery } =
    useStore();

  const navItems = useMemo(
    () => [
      {
        name: "Nhà đất bán",
        link: "nha-dat-ban",
        parent: "ban-slug",
        child: [
          { name: "Căn hộ chung cư", childLink: "/ban-can-ho-chung-cu" },
          {
            name: "Chung cư mini, căn hộ dịch vụ",
            childLink: "/ban-chung-cu-mini-can-ho-dich-vu",
          },
          { name: "Nhà riêng", childLink: "/ban-nha-rieng" },
          {
            name: "Nhà biệt thự, liền kề",
            childLink: "/ban-nha-biet-thu-lien-ke",
          },
          { name: "Nhà mặt phố", childLink: "/ban-nha-mat-pho" },
          {
            name: "Shophouse, nhà phố thương mại",
            childLink: "/ban-shophouse-nha-pho-thuong-mai",
          },
          { name: "Đất nền dự án", childLink: "/ban-dat-nen-du-an" },
          { name: "Đất", childLink: "/ban-dat" },
          {
            name: "Trang trại, khu nghỉ dưỡng",
            childLink: "/ban-trang-trai-khu-nghi-duong",
          },
          { name: "Condotel", childLink: "/ban-condotel" },
          { name: "Kho, nhà xưởng", childLink: "/ban-kho-nha-xuong" },
          {
            name: "Loại bất động sản khác",
            childLink: "/ban-loai-bds-khac",
          },
        ],
      },
      {
        name: "Nhà đất cho thuê",
        link: "nha-dat-cho-thue",
        child: [
          {
            name: "Căn hộ chung cư",
            childLink: "/thue-can-ho-chung-cu",
          },
          {
            name: "Chung cư mini, căn hộ dịch vụ",
            childLink: "/thue-chung-cu-mini-can-ho-dich-vu",
          },
          {
            name: "Nhà riêng",
            childLink: "/thue-nha-rieng",
          },
          {
            name: "Nhà biệt thự, liền kề",
            childLink: "/thue-nha-biet-thu-lien-ke",
          },
          {
            name: "Nhà mặt phố",
            childLink: "/thue-nha-mat-pho",
          },
          {
            name: "Shophouse, nhà phố thương mại",
            childLink: "/thue-shophouse-nha-pho-thuong-mai",
          },
          {
            name: "Nhà trọ, phòng trọ",
            childLink: "/thue-nha-tro-phong-tro",
          },
          {
            name: "Văn phòng",
            childLink: "/thue-van-phong",
          },
          {
            name: "Cửa hàng, ki ốt",
            childLink: "/thue-sang-nhuong-cua-hang-ki-ot",
          },
          {
            name: "Kho, nhà xưởng, đất",
            childLink: "/thue-kho-nha-xuong-dat",
          },
          {
            name: "Loại bất động sản khác",
            childLink: "/thue-loai-bat-dong-san-khac",
          },
        ],
      },
    ],
    []
  );

  const countFilledFields = (g_searchQuery) => {
    return Object.entries(g_searchQuery)
      .slice(1)
      .filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== "";
      }).length;
  };

  useEffect(() => {
    //* Đọc path để set filter
    console.log(path);
    setSearchQuery((prev) => {
      const updatedQuery = {
        ...g_searchQuery,
        demand: path.includes("ban")
          ? "Tìm mua"
          : path.includes("thue")
          ? "Tìm thuê"
          : prev.demand,
        type: navItems
          .flatMap((item) =>
            item.child
              ? item.child
                  .filter((child) => path === child.childLink)
                  .map((child) => child.name)
              : []
          )
          .filter(Boolean), // Removes `null` and `undefined`
      };

      Cookies.set("searchQuery", JSON.stringify(updatedQuery), { expires: 1 });
      setFilterCount(countFilledFields(updatedQuery));

      return updatedQuery;
    });
  }, [path, g_searchQuery]);

  //* Reset path when g_values is ""
  useEffect(() => {
    if (
      g_province === "" &&
      g_district === "" &&
      g_ward === "" &&
      g_street === ""
    ) {
      const basePath = pathFunction.getBasePath(path);
      if (router.pathname !== basePath) {
        setIsLoading(true);
        startTransition(() => {
          router.push(basePath);
          setIsLoading(false);
        });
      }
    } else {
      setIsLoading(false);
    }
  }, [router, g_district, g_ward, g_street, g_province]);

  if (isLoading || isPending) {
    return <Loading />;
  }

  return (
    <div className="border-b pb-5 pt-7">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-grow">
          <MagnifyingGlassIcon className="w-6 h-6 absolute left-2  top-1/2 -translate-y-1/2" />
          <input className="w-full rounded-lg p-2 py-3 bg-neutral-100 border-neutral-400 pl-10" />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 px-3 bg-red-500 text-white rounded-lg">
            Tìm kiếm
          </button>
        </div>
        <button className="p-3 px-4 text-white bg-teal-600 rounded-lg flex gap-2">
          <MapIcon className="w-6 h-6" />
          Xem bản đồ
        </button>
      </div>
      <div className="flex items-center pt-3 gap-5 text-sm">
        <button
          className="flex items-center p-1 px-3 border gap-2 rounded-md border-neutral-200"
          onClick={() => setIsFiltering(true)}
        >
          <span>
            <FunnelIcon className="w-4 h-4" />
          </span>
          Lọc
          {filterCount > 0 && (
            <span className="bg-red-600 px-1.5 rounded-md text-white">
              {filterCount}
            </span>
          )}
        </button>
        <button className="flex items-center p-1 px-3 border gap-2 rounded-md border-neutral-200 text-neutral-400">
          Loại nhà đất
          <span>
            <ChevronDownIcon className="w-4 h-4" />
          </span>
        </button>
        <button className="flex items-center p-1 px-3 border gap-2 rounded-md border-neutral-200 text-neutral-400">
          Mức giá
          <span>
            <ChevronDownIcon className="w-4 h-4" />
          </span>
        </button>
      </div>

      {isFiltering && (
        <HouseFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsFiltering={setIsFiltering}
        />
      )}
    </div>
  );
};

export default HouseSearchBox;
