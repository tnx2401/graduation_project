import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {debounce } from "lodash";
import axios from "axios";

import data from "@/public/local.json";

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

const Location = ({ formData, setFormData }) => {
  const [panel, setPanel] = useState(false);
  const [typingPanel, setTypingPanel] = useState(false);
  const [location, setLocation] = useState("");
  const [results, setResults] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [streetList, setStreetList] = useState([]);
  const [projectList, setProjectList] = useState([]);

  const [address, setAddress] = useState({
    province: "",
    district: "",
    ward: "",
    street: "",
    project: "",
    displayAddress: "",
  });

  const fetchLocation = useCallback(
    debounce(async (query) => {
      if (!query) return;

      if (query.length < 3) {
        setResults([]);
        return;
      }

      axios
        .get("https://nominatim.openstreetmap.org/search", {
          params: {
            format: "json",
            q: query,
            countrycodes: "VN", // Vietnam only
            "accept-language": "vi",
            limit: 10,
          },
        })
        .then((res) => {
          setResults(res.data);
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
        });
    }, 1000), // 1-second delay
    []
  );

  const handleInputChange = (e) => {
    setLocation(e.target.value);
    if (location.length < 3) {
      return;
    } else {
      fetchLocation(e.target.value);
    }
  };

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
        project: "",
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
      setProjectList(filteredList[0]?.projects);

      setAddress((prev) => ({
        ...prev,
        ward: "",
        street: "",
        project: "",
        displayAddress: `${prev.district}, ${prev.province}`, // District before Province
      }));
    } else {
      return;
    }
  }, [address.district]);

  return (
    <div className="w-full border p-4 rounded-xl my-5">
      <h1 className="font-semibold text-xl">Địa chỉ bất động sản</h1>
      <div className="relative mt-5">
        <MagnifyingGlassIcon className="w-5 h-5 absolute left-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
        <input
          className="w-full border p-3 rounded-3xl border-neutral-200 text-sm pl-10 cursor-pointer"
          placeholder={
            address.displayAddress.trim() === ","
              ? "Nhập địa chỉ"
              : address.displayAddress
          }
          onClick={() => setPanel(true)}
        />
      </div>

      {panel && (
        <div className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-0 z-50">
          <div className="absolute flex flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border shadow-lg w-[768px] rounded-xl">
            <div className="flex justify-between items-center bg-black w-full rounded-tr-xl rounded-tl-xl">
              <h1 className=" text-white p-5  font-semibold text-xl">
                Nhập địa chỉ
              </h1>
              <button
                className="text-white p-5 text-xl"
                onClick={() => setPanel(false)}
              >
                x
              </button>
            </div>
            <div className="p-3 mt-3 w-full relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 translate-x-1/2" />
              <input
                className="w-full border p-3 rounded-3xl border-neutral-200 text-sm pl-10"
                placeholder="Nhập địa chỉ"
                onChange={handleInputChange}
              />
            </div>
            {results.length > 0 && (
              <div className="bg-white shadow-md mt-2">
                {results.map((item) => (
                  <button
                    key={item.place_id}
                    className="w-full text-left border-b py-3 px-2 border-neutral-200 hover:bg-neutral-100 cursor-pointer"
                    onClick={() => handleAddress(item)}
                  >
                    {item.display_name}
                  </button>
                ))}
              </div>
            )}
            {results.length === 0 && (
              <p className="text-sm pl-5 py-2 text-left text-neutral-600">
                Tìm kiếm bằng cách nhập tên quận huyện, phường xã, đường phố
                hoặc tên dự án
              </p>
            )}

            <p className="font-semibold text-xs pl-5 py-2">Hoặc</p>
            <button
              className="p-3 w-1/6 border m-3 mb-6 rounded-xl shadow-md hover:bg-neutral-300"
              onClick={() => {
                setTypingPanel(true);
                setPanel(false);
              }}
            >
              Chọn địa chỉ
            </button>
          </div>
        </div>
      )}

      {typingPanel && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-50">
          <div className="absolute flex flex-col top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/3 bg-white w-[768px] rounded-xl">
            <div className="flex justify-between items-center bg-black w-full rounded-tr-xl rounded-tl-xl">
              <h1 className=" text-white p-5  font-semibold text-xl">
                Chọn địa chỉ
              </h1>
              <button
                className="text-white p-5 text-xl"
                onClick={() => setTypingPanel(false)}
              >
                x
              </button>
            </div>

            <div className="p-3 mt-3 w-full relative">
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

              <AddressSelector
                label="Dự án"
                placeholder="Chọn dự án"
                field="project"
                address={address}
                setAddress={setAddress}
                options={projectList}
                disabled={address.district === ""}
              />

              <label htmlFor="display_address">
                Địa chỉ hiển thị trên tin đăng
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

              <button
                className="float-end p-3 border mt-3 bg-red-500 text-white rounded-xl border-gray-200 "
                onClick={() => {
                  setFormData({ ...formData, address: address });
                  setPanel(false);
                  setTypingPanel(false);
                }}
                disabled={
                  address.displayAddress.trim() === "," ||
                  address.province === "" ||
                  address.district === ""
                }
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Location;
