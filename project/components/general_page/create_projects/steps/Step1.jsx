import React, { useState, useEffect, useMemo } from "react";
import {
  ArrowLeftEndOnRectangleIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import data from "@/public/local.json";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@/components/admin_page/news/Editor"), {
  ssr: false,
});

const AddressSelector = ({
  label,
  placeholder,
  address,
  field,
  setAddress,
  options,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter((item) =>
      item.name
        .toLowerCase()
        .normalize("NFC")
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  return (
    <div onClick={() => setIsOpen(false)}>
      <label>{label}</label>
      <div
        className={`w-full relative border p-3 my-3 rounded-3xl border-neutral-200 text-sm flex items-center justify-between cursor-pointer
         ${disabled ? "pointer-events-none bg-gray-200" : ""}`}
        onClick={(e) => {
          setIsOpen((prev) => !prev);
          e.stopPropagation();
        }}
      >
        <h1>{address[field] || placeholder}</h1>
        <ChevronDownIcon className="w-4 h-4" />

        {isOpen && (
          <div
            className="absolute w-full top-0 translate-y-14 left-0 z-50 rounded-3xl border border-gray-300 bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <input
                type="text"
                className="w-full rounded-xl border-gray-200 pl-10 focus:ring-0 focus:border-gray-200"
                placeholder="Tìm kiếm..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="absolute top-1/2 left-3 transform -translate-y-1/2 w-5 h-5" />
            </div>

            <div className="mt-5 max-h-60 overflow-auto">
              {filteredOptions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 py-3 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setAddress((prev) => ({
                      ...prev,
                      [field]: item.name,
                      displayAddress: ` ${
                        field === "street"
                          ? "Đường"
                          : field === "ward"
                          ? "Phường"
                          : ""
                      } ${item.name}, ${prev.displayAddress}`,
                    }));
                    setIsOpen(false);
                  }}
                >
                  <h1>{item.name}</h1>
                  <input type="radio" className="p-3 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Step1 = ({ setStep, generalInfo, setGeneralInfo }) => {
  const [infoMode, setInfoMode] = useState("main-info");
  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
    street: "",
    displayAddress: "",
  });
  const [optionalInfo, setOptionalInfo] = useState(null);
  const [content, setContent] = useState("");

  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [streetList, setStreetList] = useState([]);

  const projectType = [
    "Tất cả loại hình",
    "Căn hộ chung cư",
    "Cao ốc văn phòng",
    "Trung tâm thương mại",
    "Khu đô thị mới",
    "Khu phức hợp",
    "Nhà ở xã hội",
    "Khu nghỉ dưỡng, sinh thái",
    "Khu công nghiệp",
    "Biệt thự liền kề",
    "Shophouse",
    "Nhà mặt phố",
    "Dự án khác",
  ];

  const areaMode = ["m²", "ha"];
  const legal = ["Sổ hồng sở hữu lâu dài", "Sổ đỏ lâu dài", "Sở hữu lâu dài"];
  const utilites = [
    {
      name: "🌳 Sinh hoạt & Giải trí",
      values: [
        "Công viên nội khu",
        "Đường dạo bộ",
        "Hồ cảnh quan",
        "Ghế nghỉ",
        "Sân chơi cho trẻ em",
        "Khu vui chơi vận động",
      ],
    },
    {
      name: "🏋️ Thể thao & Sức khỏe",
      values: ["Phòng gym", "Sân thể thao", "Hồ bơi", "Phòng xông hơi", "Spa"],
    },
    {
      name: "🛒 Thương mại & Dịch vụ",
      values: [
        "Shophouse",
        "Siêu thị 24/7",
        "Trường mầm non nội khu",
        "Phòng khám tư / nhà thuốc",
      ],
    },
    {
      name: "🛡️ An ninh & Hạ tầng",
      values: [
        "Cổng kiểm soát an ninh",
        "Hệ thống camera 24/7",
        "Thẻ từ/thẻ cư dân thông minh",
        "Hầm gửi xe",
        "Thang máy riêng biệt",
      ],
    },
  ];

  useEffect(() => {
    if (address.province) {
      const filteredList = data.filter(
        (item) => item.name === address.province
      );
      setDistrictList(filteredList[0].districts);
      setAddress((prev) => ({
        ...prev,
        district: "",
        ward: "",
        street: "",
        displayAddress: address.province, // Keep only province at the end
      }));
    }
  }, [address.province]);

  useEffect(() => {
    const filteredList = districtList?.filter(
      (item) => item.name === address.district
    );

    if (filteredList) {
      setWardList(filteredList[0]?.wards);
      setStreetList(filteredList[0]?.streets);

      setAddress((prev) => ({
        ...prev,
        ward: "",
        street: "",
        displayAddress: `${prev.district}, ${prev.province}`,
      }));
    } else {
      return;
    }
  }, [address.district]);

  useEffect(() => {
    setGeneralInfo((prev) => ({ ...prev, address: address }));
  }, [address]);

  useEffect(() => {
    setGeneralInfo((prev) => ({ ...prev, optionalInfo: optionalInfo }));
  }, [optionalInfo]);

  useEffect(() => {
    setGeneralInfo((prev) => ({ ...prev, preview: content }));
  }, [content]);

  return (
    <div className="max-h-[600px] overflow-auto">
      {infoMode === "main-info" && (
        <div>
          <div className="flex flex-col mt-5">
            <label>Tên dự án</label>
            <input
              className="w-full rounded-full border-gray-200 text-sm my-3 py-3 focus:ring-0 focus:border-gray-200"
              spellCheck={false}
              onChange={(e) =>
                setGeneralInfo((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            <label>Loại hình dự án</label>
            <select
              className="w-full rounded-full border-gray-200 text-sm mt-3 py-3 focus:ring-0 focus:border-gray-200"
              onChange={(e) =>
                setGeneralInfo((prev) => ({
                  ...prev,
                  projectType: e.target.value,
                }))
              }
              value={generalInfo.projectType ? generalInfo.projectType : ""}
            >
              {projectType.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
            <div className=" mt-3 w-full relative grid grid-cols-2 gap-3">
              <AddressSelector
                label="Tỉnh/Thành"
                placeholder="Chọn tỉnh/thành"
                field="province"
                address={address}
                setAddress={setAddress}
                options={data}
              />

              <AddressSelector
                label="Quận/Huyện"
                placeholder="Chọn quận/huyện"
                field="district"
                address={address}
                setAddress={setAddress}
                options={districtList}
                disabled={address.province === ""}
              />

              <AddressSelector
                label="Phường/Xã"
                placeholder="Chọn phường/xã"
                field="ward"
                address={address}
                setAddress={setAddress}
                options={wardList}
                disabled={address.district === ""}
              />

              <AddressSelector
                label="Đường/Phố"
                placeholder="Chọn đường/phố"
                field="street"
                address={address}
                setAddress={setAddress}
                options={streetList}
                disabled={address.district === ""}
              />

              <div className="col-span-2">
                <label htmlFor="display_address">
                  Địa chỉ hiển thị của dự án
                </label>
                <input
                  id="display_address"
                  className={`w-full p-2 mt-3 rounded-3xl border-gray-200 focus:ring-0 focus:border-gray-200 ${
                    address.province === "" ||
                    address.district === "" ||
                    address.ward === ""
                      ? "bg-gray-200"
                      : ""
                  }`}
                  disabled={
                    address.province === "" ||
                    address.district === "" ||
                    address.ward === ""
                  }
                  value={
                    address.displayAddress.trim() === ","
                      ? ""
                      : address.displayAddress
                  }
                  onChange={(e) =>
                    setAddress({ ...address, displayAddress: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <button
            className=" rounded-lg bg-red-500 text-white p-2 px-4 mt-5 float-end"
            onClick={() => setInfoMode("optional-info")}
          >
            Tiếp tục
          </button>
        </div>
      )}
      {infoMode === "optional-info" && (
        <div className="mt-5">
          <div className="">
            <div className="flex items-center justify-between">
              <label className="">
                Diện tích dự án{" "}
                <span className="text-gray-400">(không bắt buộc)</span>
              </label>

              <button onClick={() => setInfoMode("main-info")}>
                <ArrowLeftEndOnRectangleIcon className="w-6 h-6 hover:scale-125" />
              </button>
            </div>
            <div className="relative my-3">
              <input
                className="w-full rounded-full border-gray-300 bg-gray-100"
                onChange={(e) =>
                  setOptionalInfo((prev) => ({ ...prev, area: e.target.value }))
                }
              />
              <select
                className="absolute top-1/2 -translate-y-1/2 right-5 rounded-md text-sm px-2 pr-8 py-1 h-auto border-gray-400"
                onChange={(e) =>
                  setOptionalInfo((prev) => ({ ...prev, mode: e.target.value }))
                }
              >
                {areaMode.map((item, index) => (
                  <option key={index}>{item}</option>
                ))}
              </select>
            </div>

            <label>
              Pháp lý <span className="text-gray-400">(không bắt buộc)</span>
            </label>
            <select
              className="rounded-full w-full bg-gray-100 border-gray-300 my-3"
              onChange={(e) =>
                setOptionalInfo((prev) => ({ ...prev, legal: e.target.value }))
              }
            >
              <option>Chọn giấy tờ pháp lý</option>
              {legal.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
          </div>
          <button
            className=" rounded-lg bg-red-500 text-white p-2 px-4 mt-5 float-end"
            onClick={() => setInfoMode("utilities")}
          >
            Tiếp tục
          </button>
        </div>
      )}
      {infoMode === "utilities" && (
        <div className="my-5">
          <h1 className="text-xl">Các tiện ích của dự án</h1>
          <div className="grid grid-cols-2 gap-5 mt-5">
            {utilites.map((item, index) => (
              <div key={index}>
                <h1 className="mb-3 font-medium text-lg">{item.name}</h1>
                {item.values.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    className="flex gap-3 items-center"
                    onClick={() =>
                      setGeneralInfo((prev) => {
                        const current = prev.utilities || []; // fallback nếu chưa có
                        const updated = current.includes(subItem)
                          ? current.filter((x) => x !== subItem)
                          : [...current, subItem];
                        return { ...prev, utilities: updated };
                      })
                    }
                  >
                    <input type="checkbox" className="rounded-full"></input>
                    <p>{subItem}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <button
            className=" rounded-lg bg-red-500 text-white p-2 px-4 mt-5 float-end"
            onClick={() => setInfoMode("preview")}
          >
            Tiếp tục
          </button>
        </div>
      )}
      {infoMode === "preview" && (
        <div>
          <label htmlFor="content" className="block my-2 font-medium text-lg">
            Giới thiệu về dự án
          </label>
          <Editor content={content} setContent={setContent} allowImage={true} />

          <button
            className=" rounded-lg bg-red-500 text-white p-2 px-4 mt-5 float-end"
            onClick={() => setStep(2)}
          >
            Tiếp tục
          </button>
        </div>
      )}
    </div>
  );
};

export default Step1;
