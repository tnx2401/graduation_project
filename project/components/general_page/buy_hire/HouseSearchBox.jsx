"use client";
import {
  ChevronDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  MapIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import React, { useState, useEffect, useTransition, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import useStore from "@/lib/zustand";
import pathFunction from "../shared/pathFunction";
import Loading from "@/app/(trang-chu)/loading";
import Cookies from "js-cookie";
import HouseFilter from "./HouseFilter/HouseFilter";
import getLocation from "../home_page/SearchBox/getLocation";

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
  const [searchValue, setSearchValue] = useState("");
  const [searchBoxValue, setSearchBoxValue] = useState({
    demand: "Bán",
    location: "",
    address: null,
    houseType: [],
    priceRange: "",
    areaRange: "",
  });
  const [searchResult, setSearchResult] = useState([]);

  const {
    g_street,
    g_ward,
    g_district,
    g_province,
    g_searchQuery,
    g_setSearchQuery,
    g_setProvince,
    g_setDistrict,
    g_setWard,
    g_setStreet,
  } = useStore();

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

  //* Đọc path để set filter
  useEffect(() => {
    console.log(g_searchQuery);
    setSearchQuery((prev) => {
      const updatedQuery = {
        ...g_searchQuery,
        demand: path.includes("ban")
          ? "Tìm mua"
          : path.includes("thue")
          ? "Tìm thuê"
          : prev.demand,
        type:
          g_searchQuery.type.length > 0
            ? g_searchQuery.type
            : navItems
                .flatMap((item) =>
                  item.child
                    ? item.child
                        .filter((child) => path === child.childLink)
                        .map((child) => child.name)
                    : []
                )
                .filter(Boolean),
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

  useEffect(() => {
    if (searchValue) {
      const searchResult = getLocation(searchValue);
      setSearchResult(searchResult);
    }
  }, [searchValue]);

  const handleSearch = () => {
    g_setSearchQuery({
      demand: searchBoxValue.demand === "Bán" ? "Tìm mua" : "Tìm thuê",
      type: searchBoxValue.houseType,
      address: searchBoxValue.address
        ? [(({ province, ...rest }) => rest)(searchBoxValue.address)]
        : [{ province: searchBoxValue.location }],
      price: searchBoxValue.priceRange,
      area: searchBoxValue.areaRange,
      bedroom: "",
      houseDirection: [],
      balconyDirection: [],
    });

    g_setProvince(
      searchBoxValue.address
        ? searchBoxValue.address?.province
        : searchBoxValue.location
    );

    if (searchBoxValue.address?.district) {
      g_setDistrict(
        isNaN(searchBoxValue.address.district.split(" ").splice(1).join(""))
          ? searchBoxValue.address.district.split(" ").splice(1).join(" ")
          : searchBoxValue.address.district
      );
    }
    if (searchBoxValue.address?.ward) {
      g_setWard(searchBoxValue.address.ward.split(" ").splice(1).join(" "));
    }
    if (searchBoxValue.address?.street) {
      g_setStreet(searchBoxValue.address.street.split(" ").splice(1).join(" "));
    }

    const updatedQuery = {
      demand:
        searchBoxValue.demand === "Bán"
          ? "Tìm mua"
          : searchBoxValue.demand === "Thuê"
          ? "Tìm thuê"
          : "Dự án",
      address: searchBoxValue.address
        ? [{ ...searchBoxValue.address }]
        : [{ province: searchBoxValue.location }],
      type: searchBoxValue.houseType ? searchBoxValue.houseType : [],
      price: searchBoxValue.priceRange,
      area: searchBoxValue.areaRange,
    };

    Cookies.set("searchQuery", JSON.stringify(updatedQuery), {
      expires: 1,
    });

    const addressSlug = searchBoxValue.address
      ? pathFunction.convertToSlug(
          searchBoxValue.address.street ||
            searchBoxValue.address.ward ||
            searchBoxValue.address.district ||
            searchBoxValue.address.province ||
            searchBoxValue.location
        )
      : pathFunction.convertToSlug(searchBoxValue.location);

    if (searchBoxValue.houseType.length > 0) {
      const houseTypeSlug = searchBoxValue.houseType
        .map((type) => {
          const navItem = navItems.find((item) => item.name === currentTab);
          const childItem = navItem?.child.find((child) => child.name === type);
          return childItem?.childLink || "";
        })
        .filter((slug) => slug !== "");

      router.push(`${houseTypeSlug[0]}-${addressSlug}`);
    } else {
      router.push(
        searchBoxValue.demand === "Bán"
          ? `/nha-dat-ban-${addressSlug}`
          : `/nha-dat-cho-thue-${addressSlug}`
      );
    }
  };

  if (isLoading || isPending) {
    return <Loading />;
  }

  return (
    <div className="border-b pb-5 pt-7" onClick={() => setSearchResult([])}>
      <div
        className="flex items-center justify-between gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-grow">
          <MagnifyingGlassIcon className="w-6 h-6 absolute left-2  top-1/2 -translate-y-1/2" />
          {searchBoxValue.address &&
            Object.keys(searchBoxValue.address).length > 0 && (
              <>
                <button
                  className="absolute top-1/2 right-28 rounded-full bg-black text-white p-1 transform -translate-y-1/2 cursor-pointer hover:scale-110"
                  onClick={() => {
                    setSearchBoxValue((prev) => ({ ...prev, address: {} }));
                    setSearchValue("");
                  }}
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>

                <div className="absolute top-1/2 left-8 border px-2 py-1 rounded-lg bg-white transform -translate-y-1/2 text-sm">
                  {Object.values(searchBoxValue.address).join(", ")}
                </div>
              </>
            )}
          <input
            className="w-full rounded-lg p-2 py-3 bg-neutral-100 border-neutral-400 pl-10"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 px-3 bg-red-500 text-white rounded-lg"
            onClick={handleSearch}
          >
            Tìm kiếm
          </button>
          {searchResult.length > 0 && (
            <div>
              {searchResult.length > 0 && (
                <ul className="absolute z-50 bg-white shadow-md rounded-md w-full max-h-60 overflow-y-auto mt-1">
                  {searchResult.map((item, index) => (
                    <li
                      key={index}
                      className="p-2 text-left hover:bg-slate-200 rounded-lg text-sm flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        setSearchBoxValue((prev) => ({
                          ...prev,
                          address: {
                            ...(item.type === "ward" || item.type === "street"
                              ? {
                                  [item.type === "ward"
                                    ? "ward"
                                    : "street"]: `${item.prefix} ${item.name}`,
                                }
                              : {}),
                            district: item.district
                              ? `${
                                  item.district.includes("Huyện") ||
                                  item.district.includes("Quận")
                                    ? ""
                                    : "Quận"
                                } ${item.district}`.trim()
                              : `${
                                  item.name.includes("Huyện") ||
                                  item.name.includes("Quận")
                                    ? ""
                                    : "Quận"
                                } ${item.name}`.trim(),
                            province: item.province || undefined,
                          },
                        }));
                      }}
                    >
                      <MapPinIcon className="w-5 h-5" />
                      {item.prefix} {item.name}
                      {item.district && `, ${item.district}`}
                      {item.province && `, ${item.province}`}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
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
