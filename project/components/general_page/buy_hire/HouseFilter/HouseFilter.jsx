import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import options from "../../home_page/SearchBox/data";
import {
  ChevronDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { BsCoin, BsTextareaResize } from "react-icons/bs";
import useStore from "@/lib/zustand";

import pathFunction from "../../shared/pathFunction";
import HouseTypePanel from "./childComponents/HouseTypePanel";
import AddressPanel from "./childComponents/AddressPanel";
import PricePanel from "./childComponents/PricePanel";
import AreaPanel from "./childComponents/AreaPanel";
import Cookies from "js-cookie";

const HouseFilter = ({ searchQuery, setSearchQuery, setIsFiltering }) => {
  const {
    g_province,
    g_setDistrict,
    g_setWard,
    g_setStreet,
    g_setSearchQuery,
    g_houseType,
    g_setHouseType,
    g_type,
  } = useStore();
  const path = usePathname();
  const router = useRouter();

  const [storedAddress, setStoredAddress] = useState([]);

  const [isTypePanel, setIsTypePanel] = useState(false);
  const [isAddressPanel, setIsAddressPanel] = useState(false);
  const [isPricePanel, setIsPricePanel] = useState(false);
  const [isAreaPanel, setIsAreaPanel] = useState(false);

  //* Lấy dữ liệu dựa trên nhu cầu (mua hoặc thuê)
  useEffect(() => {
    if (searchQuery.demand === "Tìm mua") {
      g_setHouseType(options[0]);
    } else {
      g_setHouseType(options[1]);
    }
  }, [options, searchQuery.demand]);

  //* Xử lý hướng nhà
  const handleHouseDirection = (direction) => {
    let houseDirectionArr = searchQuery.houseDirection.includes(direction)
      ? searchQuery.houseDirection.filter((prev) => prev !== direction)
      : [...searchQuery.houseDirection, direction];

    setSearchQuery({ ...searchQuery, houseDirection: houseDirectionArr });
  };

  //* Xử lý hướng ban công
  const handleBalconyDirection = (direction) => {
    let balconyDirection = searchQuery.balconyDirection.includes(direction)
      ? searchQuery.balconyDirection.filter((prev) => prev !== direction)
      : [...searchQuery.balconyDirection, direction];

    setSearchQuery({ ...searchQuery, balconyDirection: balconyDirection });
  };

  //* Áp dụng bộ lọc
  const handleApplyFilter = () => {
    console.log("Search query address: ", searchQuery.address);

    const updatedQuery = { ...searchQuery, type: g_type };
    let basePath = pathFunction.getBasePath(path);
    const queryAddress = updatedQuery.address[0];
    const zustandAddress = storedAddress[0] ?? {};
    const province = queryAddress?.province || g_province;

    if (updatedQuery.type && updatedQuery.type.length > 0) {
      if (
        updatedQuery.type.includes("Tất cả nhà đất") ||
        updatedQuery.type.includes("Các loại nhà bán")
      ) {
        basePath = `/nha-dat-ban`;
      } else if (updatedQuery.demand === "Tìm mua") {
        basePath = `/ban-${pathFunction.convertToSlug(updatedQuery.type[0])}`;
      }
    }

    if (queryAddress.project && queryAddress.project !== "") {
      basePath += `-${pathFunction.convertToSlug(queryAddress.project)}`;
    } else if (queryAddress.street && queryAddress.street !== "") {
      basePath += `-${pathFunction.convertToSlug(queryAddress.street)}`;
      g_setStreet(zustandAddress?.street?.name || queryAddress.street);
    } else if (queryAddress.ward && queryAddress.ward !== "") {
      basePath += `-${pathFunction.convertToSlug(queryAddress.ward)}`;
      g_setWard(zustandAddress?.ward?.name || queryAddress.ward);
      g_setDistrict(zustandAddress?.district || queryAddress.district);
    } else if (queryAddress.district && queryAddress.district !== "") {
      basePath += `-${pathFunction.convertToSlug(queryAddress.district)}`;
      g_setDistrict(zustandAddress?.district || queryAddress.district);
    } else if (province && province !== "") {
      basePath += `-${pathFunction.convertToSlug(province)}`;
    }

    g_setSearchQuery(updatedQuery);
    Cookies.set("searchQuery", JSON.stringify(updatedQuery), { expires: 1 });
    router.push(basePath);
    setIsFiltering(false);
  };

  return (
    <div
      className="fixed w-screen h-screen top-0 left-0 inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={() => setIsFiltering(false)}
    >
      <div
        className="w-1/4 h-3/4 bg-white rounded-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {isTypePanel && (
          <HouseTypePanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsTypePanel={setIsTypePanel}
          />
        )}

        {isAddressPanel && (
          <AddressPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setStoredAddress={setStoredAddress}
            setIsAddressPanel={setIsAddressPanel}
          />
        )}

        {isPricePanel && (
          <PricePanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsPricePanel={setIsPricePanel}
          />
        )}

        {isAreaPanel && (
          <AreaPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setIsAreaPanel={setIsAreaPanel}
          />
        )}

        {!isTypePanel && !isAddressPanel && !isPricePanel && !isAreaPanel && (
          <>
            <div className="flex items-center justify-between p-5 border-b">
              <h1>Bộ lọc</h1>
              <XMarkIcon
                className="w-5 h-5 cursor-pointer"
                onClick={() => setIsFiltering(false)}
              />
            </div>

            <div className="h-full overflow-auto relative">
              <div className="flex w-full gap-5 px-5 mt-5">
                {["Tìm mua", "Tìm thuê"].map((item, index) => (
                  <button
                    key={index}
                    className={`p-1 rounded w-1/2 border ${
                      searchQuery.demand === item
                        ? "bg-gray-600 text-white"
                        : ""
                    }`}
                    onClick={() =>
                      setSearchQuery({
                        demand: item,
                        type: [],
                        address: [],
                        price: "",
                        bedroom: "",
                        houseDirection: [],
                        balconyDirection: [],
                      })
                    }
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="p-5">
                <h1>Loại bất động sản</h1>
                <div className="flex flex-wrap w-full items-center ">
                  {searchQuery.type.length > 0 && (
                    <div className="mt-2">
                      {searchQuery.type.map((item, index) => {
                        if (g_houseType.content) {
                          const matchingOption =
                            g_houseType?.content[0]?.option.find(
                              (option) => option.optionName === item
                            );

                          return matchingOption ? (
                            <span
                              key={index}
                              className="text-sm p-2 bg-gray-200 rounded-md px-2 mr-3"
                            >
                              {matchingOption.optionName}
                            </span>
                          ) : (
                            <span
                              key={index}
                              className="text-sm p-2 bg-gray-200 rounded-md px-2"
                            >
                              {item}
                            </span>
                          );
                        }
                      })}
                    </div>
                  )}
                  <button
                    className="text-red p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 mt-2"
                    onClick={() => setIsTypePanel(true)}
                  >
                    <PlusIcon className="w-5 h-5" />
                    Thêm
                  </button>
                </div>

                <h1 className="mt-5">Khu vực & Dự án</h1>
                <div className="flex flex-wrap gap-2 w-full items-center mt-2">
                  {searchQuery.address.length > 0 &&
                    searchQuery.address.map((item, index) => (
                      <span
                        key={index}
                        className="text-sm p-2 bg-gray-200 rounded-md px-2 flex items-center"
                      >
                        {Object.values(item).join(", ")}
                        <button
                          className="ml-2"
                          onClick={() => {
                            setStoredAddress((prev) =>
                              prev.filter(
                                (prev, prevIndex) => prevIndex !== index
                              )
                            );
                            setSearchQuery({
                              ...searchQuery,
                              address: searchQuery.address.filter(
                                (prev, prevIndex) => prevIndex !== index
                              ),
                            });
                          }}
                        >
                          <XMarkIcon className="w-5 h-5 text-neutral-500" />
                        </button>
                      </span>
                    ))}
                  <button
                    className="text-red p-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1"
                    onClick={() => setIsAddressPanel(true)}
                  >
                    <PlusIcon className="w-5 h-5" />
                    Thêm
                  </button>
                </div>

                <h1 className="mt-5">Mức giá</h1>
                <div
                  className="w-full mt-2 border rounded-lg flex items-center justify-between px-2 hover:border-neutral-500 cursor-pointer"
                  onClick={() => setIsPricePanel(true)}
                >
                  <div className="relative">
                    <h1 className="w-full rounded-lg pl-9 border-neutral-200 py-3">
                      {searchQuery.price ? searchQuery.price : "Tất cả"}
                    </h1>
                    <BsCoin className="absolute top-1/2 left-2 text-xl -translate-y-1/2" />
                  </div>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>

                <h1 className="mt-5">Diện tích</h1>
                <div
                  className="w-full mt-2 border rounded-lg flex items-center justify-between px-2 hover:border-neutral-500 cursor-pointer"
                  onClick={() => setIsAreaPanel(true)}
                >
                  <div className="relative">
                    <h1 className="w-full rounded-lg pl-9 border-neutral-200 py-3">
                      {searchQuery.area ? searchQuery.area : "Tất cả"}
                    </h1>
                    <BsTextareaResize className="absolute top-1/2 left-2 text-xl -translate-y-1/2" />
                  </div>
                  <ChevronDownIcon className="w-4 h-4" />
                </div>

                <h1 className="mt-5">Số phòng ngủ</h1>
                <ul className="flex gap-5 mt-3">
                  {[1, 2, 3, 4, 5].map((item, index) => (
                    <li
                      key={index}
                      className={`p-1 rounded-full px-3 border cursor-pointer ${
                        searchQuery.bedroom == item
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() =>
                        setSearchQuery({
                          ...searchQuery,
                          bedroom: searchQuery.bedroom === item ? null : item,
                        })
                      }
                    >
                      {item}
                      {index === 4 ? " +" : ""}
                    </li>
                  ))}
                </ul>

                <h1 className="mt-5">Hướng nhà</h1>
                <ul className="flex gap-5 mt-3 w-full flex-wrap">
                  {[
                    "Bắc",
                    "Đông",
                    "Nam",
                    "Tây",
                    "Đông Bắc",
                    "Đông Nam",
                    "Tây Bắc",
                    "Tây Nam",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className={`p-1 rounded-full px-3 cursor-pointer border ${
                        searchQuery.houseDirection?.includes(item)
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => handleHouseDirection(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <h1 className="mt-5">Hướng ban công</h1>
                <ul className="flex gap-5 mt-3 w-full flex-wrap">
                  {[
                    "Bắc",
                    "Đông",
                    "Nam",
                    "Tây",
                    "Đông Bắc",
                    "Đông Nam",
                    "Tây Bắc",
                    "Tây Nam",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className={`p-1 rounded-full px-3 cursor-pointer border ${
                        searchQuery.balconyDirection?.includes(item)
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      }`}
                      onClick={() => handleBalconyDirection(item)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className=" w-full p-4 border-t bg-white flex gap-5">
              <button
                className="border w-1/3 p-2 rounded-lg hover:bg-neutral-200"
                onClick={() => {
                  g_setSearchQuery({
                    demand: searchQuery.demand,
                    type: [],
                    address: [],
                    price: "",
                    bedroom: "",
                    houseDirection: [],
                    balconyDirection: [],
                  });

                  Cookies.remove("searchQuery");
                  window.location.reload();
                  setIsFiltering(false);
                }}
              >
                Đặt lại
              </button>
              <button
                className="border w-2/3 p-2 bg-red-500 text-white hover:bg-red-400 rounded-lg"
                onClick={() => handleApplyFilter()}
                disabled={searchQuery.address.length === 0}
              >
                Xem kết quả
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HouseFilter;
