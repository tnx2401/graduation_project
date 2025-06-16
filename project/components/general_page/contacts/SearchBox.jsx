"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import pathFunction from "../shared/pathFunction";

const SearchBox = ({ type, onSearch }) => {
  const router = useRouter();
  const [searchType, setSearchType] = useState();
  const [searchContent, setSearchContent] = useState("");
  const [firstFilter, setFirstFilter] = useState("");
  const [secondFilter, setSecondFilter] = useState("");

  const provinces = [
    "An Giang",
    "Bà Rịa-Vũng Tàu",
    "Bắc Giang",
    "Bắc Kạn",
    "Bạc Liêu",
    "Bắc Ninh",
    "Bến Tre",
    "Bình Định",
    "Bình Dương",
    "Bình Phước",
    "Bình Thuận",
    "Cà Mau",
    "Cần Thơ",
    "Cao Bằng",
    "Đà Nẵng",
    "Đắk Lắk",
    "Đắk Nông",
    "Điện Biên",
    "Đồng Nai",
    "Đồng Tháp",
    "Gia Lai",
    "Hà Giang",
    "Hà Nam",
    "Hà Nội",
    "Hà Tĩnh",
    "Hải Dương",
    "Hải Phòng",
    "Hậu Giang",
    "Hồ Chí Minh",
    "Hòa Bình",
    "Hưng Yên",
    "Khánh Hòa",
    "Kiên Giang",
    "Kon Tum",
    "Lai Châu",
    "Lâm Đồng",
    "Lạng Sơn",
    "Lào Cai",
    "Long An",
    "Nam Định",
    "Nghệ An",
    "Ninh Bình",
    "Ninh Thuận",
    "Phú Thọ",
    "Phú Yên",
    "Quảng Bình",
    "Quảng Nam",
    "Quảng Ngãi",
    "Quảng Ninh",
    "Quảng Trị",
    "Sóc Trăng",
    "Sơn La",
    "Tây Ninh",
    "Thái Bình",
    "Thái Nguyên",
    "Thanh Hóa",
    "Thừa Thiên - Huế",
    "Tiền Giang",
    "Trà Vinh",
    "Tuyên Quang",
    "Vĩnh Long",
    "Vĩnh Phúc",
    "Yên Bái",
  ];

  useEffect(() => {
    if (type === "Nhà môi giới") {
      setSearchType({
        name: "Tìm kiếm môi giới",
        first_option: provinces,
      });
    } else if (type === "Doanh nghiệp") {
      setSearchType({
        name: "Tìm kiếm doanh nghiệp",
        first_option: [
          "Lĩnh vực",
          "Chủ đầu tư",
          "Thi công xây dựng",
          "Tư vấn thiết kế",
          "Sàn giao dịch bất động sản",
          "Trang trí nội thất",
          "Vật liệu xây dựng",
          "Tài chính pháp lý",
          "Các lĩnh vực khác",
        ],
        second_option: provinces,
      });
    }
  }, [type]);

  const handleSearch = () => {
    const filters = {
      type,
      content: searchContent,
      first: firstFilter,
      second: secondFilter,
    };

    if (type === "Nhà môi giới") {
      onSearch(filters);
    } else if (type === "Doanh nghiệp") {
      onSearch(filters);
    }
  };

  return (
    <div className="w-full border rounded-md py-2 mt-10">
      <div className="flex items-center gap-5 px-3">
        <h1 className="text-red-600 uppercase font-semibold">
          {searchType?.name}
        </h1>
        <input
          className="h-8 flex-grow border border-gray-300 rounded-md px-2"
          placeholder="Nhập từ khóa tìm kiếm"
          onChange={(e) => setSearchContent(e.target.value)}
        />
      </div>
      <div className="px-3 flex gap-3 mt-3 flex-wrap">
        <select
          className={`h-9 px-3 text-sm border border-gray-300 rounded-md ${type === "Nhà môi giới" ? 'w-1/2' : 'w-64'}`}
          value={firstFilter}
          onChange={(e) => {
            setFirstFilter(e.target.value);
            if (type === "Doanh nghiệp") {
              router.push(
                `/doanh-nghiep/${pathFunction.convertToSlug(e.target.value)}`
              );
            }
          }}
        >
          <option disabled value="">
            {type === "Nhà môi giới"
              ? "-- Tỉnh/ thành phố --"
              : "-- Lĩnh vực chính --"}
          </option>
          {searchType?.first_option?.slice(1).map((item, index) => (
            <option key={index}>{item}</option>
          ))}
        </select>

        {searchType?.second_option && (
          <select
            className="h-9 w-64 px-3 text-sm border border-gray-300 rounded-md"
            value={secondFilter}
            onChange={(e) => setSecondFilter(e.target.value)}
          >
            <option disabled value="">
              -- Tỉnh/thành phố --
            </option>
            {searchType?.second_option?.map((item, index) => (
              <option key={index}>{item}</option>
            ))}
          </select>
        )}

        <button
          className="flex-grow bg-red-500 border rounded text-white"
          onClick={handleSearch}
        >
          Tìm kiếm
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
