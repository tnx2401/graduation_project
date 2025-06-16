"use client";
import { ArrowPathIcon, ChevronDownIcon, MagnifyingGlassIcon, PhotoIcon } from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../loading";
import Image from "next/image";
import Link from "next/link";
import pathFunction from "@/components/general_page/shared/pathFunction";
import data from "@/public/local.json";
import { ChevronRightIcon } from "lucide-react";

const page = () => {
  const [projects, setProjects] = useState();
  const [searchValue, setSearchValue] = useState('');
  const [allProjects, setAllProjects] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filterMode, setFilterMode] = useState("");
  const [loading, setLoading] = useState(true);

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
    axios.get('/api/handle_projects/getProjects')
      .then((res) => {
        setProjects(res.data);
        setAllProjects(res.data);
        setLocationData(provinces);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (!searchValue.trim()) {
      setProjects(allProjects);
    } else {
      const filtered = allProjects.filter((project) =>
        project.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setProjects(filtered);
    }
  }, [searchValue, allProjects]);

  useEffect(() => {
    if (selectedProvince) {
      const provinceData = data.find((item) => item.name === selectedProvince);
      const filtered = allProjects.filter((item) => item.province === selectedProvince);
      setProjects(filtered);
      console.log(provinceData);
    } else {
      setProjects(allProjects);
    }
  }, [selectedProvince, allProjects]);

  useEffect(() => {
    if (
      !selectedType ||
      selectedType === "Tất cả loại hình"
    ) {
      setProjects(allProjects);
    } else if (selectedType === "Dự án khác") {
      const knownTypes = [
        "Căn hộ chung cư",
        "Cao ốc văn phòng",
        "Trung tâm thương mại",
        "Khu đô thị mới",
        "Khu phức hợp",
        "Nhà ở xã hội",
        "Khu nghỉ dưỡng, Sinh thái",
        "Khu công nghiệp",
        "Biệt thự liền kề",
        "Shophouse",
        "Nhà mặt phố"
      ];

      const filtered = allProjects.filter(
        (item) => !knownTypes.includes(item.type)
      );
      setProjects(filtered);
    } else {
      const filtered = allProjects.filter(
        (item) => item.type === selectedType
      );
      setProjects(filtered);
    }
  }, [selectedType, allProjects]);

  useEffect(() => {
    if (selectedStatus) {
      const filtered = allProjects.filter((item) => item.status === selectedStatus);
      setProjects(filtered);
    } else {
      setProjects(allProjects); // fallback to full list
    }
  }, [selectedStatus, allProjects]);


  const handleArea = (optional_info) => {
    const data = typeof optional_info === "string" ? JSON.parse(optional_info) : optional_info;
    return <p className="my-2">{data.area} {data.mode}</p>
  }

  const extractFirstParagraph = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const firstP = doc.querySelector('p');
    return firstP ? firstP.textContent.trim() : '';
  };

  const handleReset = () => {
    setSelectedDistrict("");
    setSelectedProvince("");
    setSelectedType("");
    setSelectedStatus("");
    setFilterMode("");
  }

  if (loading) {
    <Loading />
  }

  console.log(projects);

  return <div className="max-w-5xl mx-auto min-h-screen">
    <p className="h-1"></p>
    <div className="w-full my-5 flex border rounded-md shadow bg-white p-3 mt-10 gap-5 items-center">
      <div className="relative w-4/12">
        <input
          placeholder="Tìm kiếm dự án..."
          className="pl-10 w-full text-sm rounded-lg border-gray-300"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <MagnifyingGlassIcon className="w-5 h-5 absolute top-1/2 -translate-y-1/2 left-2" />
      </div>
      <div className="w-8/12 flex items-center">
        <ul className="grid grid-cols-3 w-[90%]">
          <li
            className="border-l flex-col px-3 cursor-pointer relative"
            onClick={() =>
              setFilterMode((prev) => (prev === "location" ? null : "location"))
            }
          >
            <div className="flex items-center justify-between text-xs">
              Khu vực <ChevronDownIcon className="w-3 h-3" />
            </div>
            <p className="text-sm">{selectedProvince ? selectedProvince : selectedDistrict ? selectedDistrict : "Toàn quốc"}</p>
            {filterMode === "location" && (
              <div className="absolute left-0 w-60 h-52 p-2 border shadow bg-white rounded-lg pt-4" onClick={(e) => e.stopPropagation()}>
                <input className="w-full h-7 border border-gray-300 rounded-lg bg-gray-200 text-sm" placeholder="Tìm tình/thành phố" />
                <div className="h-[85%] text-xs overflow-auto w-full mt-2">
                  <div className="flex items-center justify-between my-2 hover:bg-gray-200 p-1">
                    <h1>Toàn quốc</h1>
                    <ChevronRightIcon className="w-4 h-4" />
                  </div>
                  {locationData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between my-2 hover:bg-gray-200 p-1"
                      onClick={() => { setSelectedProvince(item); setFilterMode("") }}
                    >
                      <h1>{item}</h1>
                      <ChevronRightIcon className="w-4 h-4" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </li>

          <li
            className="border-l flex-col px-3 relative cursor-pointer"
            onClick={() =>
              setFilterMode((prev) => (prev === "type" ? null : "type"))
            }
          >
            <div className="flex items-center justify-between text-xs">
              Loại hình <ChevronDownIcon className="w-3 h-3" />
            </div>
            <p className="text-sm">{selectedType ? selectedType : "Tất cả"}</p>

            {filterMode === "type" && (
              <div className="absolute left-0 w-60 h-52 p-2 border shadow bg-white rounded-lg text-sm flex flex-col text-left overflow-auto" onClick={(e) => e.stopPropagation()}>
                {["Tất cả loại hình",
                  "Căn hộ chung cư",
                  "Cao ốc văn phòng",
                  "Trung tâm thương mại",
                  "Khu đô thị mới",
                  "Khu phức hợp",
                  "Nhà ở xã hội",
                  "Khu nghỉ dưỡng, Sinh thái",
                  "Khu công nghiệp",
                  "Biệt thự liền kề",
                  "Shophouse",
                  "Nhà mặt phố",
                  "Dự án khác"].map((item, index) => (
                    <button
                      key={index}
                      className="text-left py-1 hover:bg-gray-200 border-b pb-2"
                      onClick={() => { setSelectedType(item); setFilterMode("") }}
                    >
                      {item}
                    </button>
                  ))}
              </div>
            )}
          </li>

          <li className="border-l flex-col px-3 cursor-pointer relative" onClick={() => setFilterMode((prev) => (prev === "status" ? null : "status"))}>
            <div className="flex items-center justify-between text-xs">
              Trạng thái <ChevronDownIcon className="w-3 h-3" />
            </div>
            <p className="text-sm">{selectedStatus ? selectedStatus : "Tất cả"}</p>
            {filterMode === "status" && (
              <div className="absolute left-0 w-72 p-2 border shadow bg-white rounded-lg text-sm flex flex-wrap text-left overflow-auto" onClick={(e) => e.stopPropagation()}>
                {["Sắp mở bán",
                  "Đang mở bán",
                  "Đã bàn giao"].map((item, index) => (
                    <button
                      key={index}
                      className="text-left border m-1 p-2 rounded-lg hover:bg-gray-100"
                      onClick={() => { setSelectedStatus(item); setFilterMode("") }}
                    >
                      {item}
                    </button>
                  ))}
              </div>
            )}
          </li>
        </ul>

        <button className="pl-6 border-l" onClick={() => { setProjects(allProjects); handleReset() }}>
          <ArrowPathIcon className="w-5 h-5 hover:scale-125 transition" />
        </button>
      </div>
    </div>

    <div className="flex items-center gap-1">
      <h1 className="text-gray-400">Dự án</h1>
      <p>/</p>
      <h1>Dự án BĐS {selectedProvince ? selectedProvince : selectedDistrict ? selectedDistrict : "toàn quốc"}</h1>
    </div>

    <h1 className="mt-3 text-2xl font-medium">Dự án {selectedProvince ? selectedProvince : selectedDistrict ? selectedDistrict : "toàn quốc"}</h1>

    <div className="flex items-center justify-between">
      <p>Hiện đang có {projects?.length} dự án</p>
      <select className="rounded-lg text-sm border-gray-300 mt-5">
        <option>Mới nhất</option>
        <option>Mới cập nhật</option>
        <option>Giá cao nhất</option>
        <option>Giá thấp nhất</option>
      </select>
    </div>

    <div className="mt-5">
      {projects?.map((item) => (
        <Link href={`du-an/${pathFunction.convertToSlug(item.name)}-${item.id}`} key={item.id} className="border h-60 flex shadow hover:shadow-lg transition cursor-pointer duration-75 my-5">
          <div className="flex flex-col gap-1 w-1/4">
            <div className="h-3/5 relative">
              <Image src={item.images[0]} fill alt="thumbnail_1" />
            </div>
            <div className="h-2/5 grid grid-cols-2 gap-1">
              <div className="relative w-full h-full">
                <Image src={item.images[1]} alt="thumbnail_2" fill className="object-cover" />
              </div>
              <div className="relative w-full h-full">
                <Image src={item.images[2]} alt="thumbnail_3" fill className="object-cover" />
                <div className="absolute bottom-2 right-2 bg-black p-1 text-white flex gap-2">
                  <PhotoIcon className="w-6 h-6" />
                  <p>{item.images.length}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 px-6 w-3/4">
            <p className={`px-2 py-1 rounded-lg text-xs inline-block ${item.status === 'Đang mở bán' ? "bg-green-200 text-green-700" : item.status === "Đang cập nhật" ? "bg-gray-200 text-gray-700" : "bg-red-200 text-rose-700"}`}>{item.status}</p>
            <h1 className="text-xl font-medium mt-3">{item.name}</h1>
            {handleArea(item.optional_info)}
            <p className="text-gray-500">{item.address}</p>
            <p className="line-clamp-2 text-gray-500 mt-2 text-sm">{extractFirstParagraph(item.preview)}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>;
};

export default page;
