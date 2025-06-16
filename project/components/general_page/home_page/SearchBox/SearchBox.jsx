import React, { useEffect, useMemo, useState } from "react";
import {
  MapPinIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import optionsData from "./data";
import useStore from "@/lib/zustand";
import pathFunction from "../../shared/pathFunction";
import Cookies from "js-cookie";
import getLocation from "./getLocation";

const SearchBox = () => {
  const router = useRouter();
  const [currentLocation, setCurrentLocation] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [currentTab, setCurrentTab] = useState("Nhà đất bán");

  const {
    g_setProvince,
    g_setDistrict,
    g_setWard,
    g_setStreet,
    g_setSearchQuery,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState({
    demand: "",
    location: "",
    address: null,
    houseType: [],
    priceRange: "",
    areaRange: "",
  });

  const options = useMemo(() => optionsData, []);
  const tabs = ["Nhà đất bán", "Nhà đất cho thuê", "Dự án"];
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
            name: "Shop house, nhà phố thương mại",
            childLink: "/ban-shophouse-nha-pho-thuong-mai",
          },
          { name: "Đất nền dự án", childLink: "/ban-dat-nen-du-an" },
          { name: "Bán đất", childLink: "/ban-dat" },
          {
            name: "Trang trại, khu nghỉ dưỡng",
            childLink: "/ban-trang-trai-khu-nghi-duong",
          },
          { name: "Condotel", childLink: "/ban-condotel" },
          { name: "Kho,nhà xưởng", childLink: "/ban-kho-nha-xuong" },
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

  const [currentOption, setCurrentOption] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState([]);

  const [priceRange, setPriceRange] = useState({
    from: 0,
    to: 0,
  });

  const [areaRange, setAreaRange] = useState({
    from: 0,
    to: 0,
  });

  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          getCityName(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      setCurrentLocation("Chọn địa điểm");
    }
  };

  const getCityName = async (lat, long) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat},${long}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&language=en&pretty=1`
      );
      const data = await response.json();

      if (data.results.length > 0) {
        const city = data.results[0].components._normalized_city;
        console.log(city);

        // Normalize city name to match format in 'provinces'
        const normalizedCity = provinces.find(
          (item) => item.normalize("NFC") === city.normalize("NFC")
        );

        if (normalizedCity) {
          setCurrentLocation(normalizedCity);
          localStorage.setItem("currentLocation", normalizedCity);
        } else {
          // Handle the case when city is not found in provinces
          console.log("City not found in provinces list");
          setCurrentLocation("Chọn địa điểm");
        }
      } else {
        setCurrentLocation("Chọn địa điểm");
      }
    } catch (error) {
      console.log("Error getting city name: ", error);
    }
  };

  useEffect(() => {
    const storedLocation = localStorage.getItem("currentLocation");
    if (storedLocation) {
      setCurrentLocation(storedLocation);
    } else {
      getCurrentLocation();
    }
  }, []);

  useEffect(() => {
    setSearchQuery((prev) => ({ ...prev, location: currentLocation }));
  }, [currentLocation]);

  useEffect(() => {
    setSearchQuery((prev) => ({
      ...prev,
      demand:
        currentTab === "Nhà đất bán"
          ? "Bán"
          : currentTab === "Nhà đất cho thuê"
          ? "Thuê"
          : "Dự án",
    }));
  }, [currentTab]);

  useEffect(() => {
    setSearchQuery((prev) => ({
      ...prev,
      houseType: Object.keys(checkedItems).filter((key) => checkedItems[key]),
    }));
  }, [checkedItems]);

  useEffect(() => {
    setSearchQuery((prev) => ({ ...prev, priceRange: price }));
  }, [price]);

  useEffect(() => {
    setSearchQuery((prev) => ({ ...prev, areaRange: area }));
  }, [area]);

  useEffect(() => {
    if (searchValue) {
      const searchResult = getLocation(searchValue);
      setSearchResult(searchResult);
    }
  }, [searchValue]);

  const handleSelectOption = (name) => {
    if (currentOption === name) {
      setCurrentOption(null);
    } else {
      setCurrentOption(name);
    }
  };

  const handlePriceChange = (option, value) => {
    if (option == "from") {
      setPriceRange((prev) => ({ from: value, to: prev.to }));
    } else if (option == "to") {
      setPriceRange((prev) => ({ from: prev.from, to: value }));
    } else if (option == "to" && priceRange.from === 0) {
      setPriceRange({ from: 0, to: value });
    } else if (option == "from" && priceRange.to === 0) {
      setPriceRange({ from: value, to: "" });
    }
  };

  const handleAreaChange = (option, value) => {
    if (option == "from") {
      setAreaRange((prev) => ({ from: value, to: prev.to }));
    } else if (option == "to") {
      setAreaRange((prev) => ({ from: prev.from, to: value }));
    } else if (option == "to" && priceRange.from === 0) {
      setAreaRange({ from: 0, to: value });
    } else if (option == "from" && priceRange.to === 0) {
      setAreaRange({ from: value, to: "" });
    }
  };

  const moneyConverter = (money) => {
    if (money < 1000) {
      return `${money} triệu`;
    } else {
      return `${(money / 1000).toFixed(2)} tỷ`;
    }
  };

  const statusHandler = (stt) => {
    const tempArr = [...status];
    if (tempArr.includes(stt)) {
      const filteredArr = tempArr.filter((item) => item !== stt);
      setStatus(filteredArr);
    } else {
      setStatus((prev) => [...prev, stt]);
    }
  };

  const handleParentChecked = (name, children) => {
    setCheckedItems((prev) => {
      const isParentChecked = prev[name];
      const updatedItems = { ...prev };

      updatedItems[name] = !isParentChecked;

      if (children) {
        children.forEach((child) => {
          updatedItems[child] = !isParentChecked;
        });
      }

      return Object.fromEntries(
        Object.entries(updatedItems).filter(([_, value]) => value)
      );
    });
  };

  const handleChildChecked = (childName, parentName, siblings) => {
    setCheckedItems((prev) => {
      const updatedItems = { ...prev };

      // Update the child checkbox
      updatedItems[childName] = !prev[childName];

      // Check if all siblings are checked
      const areAllSiblingsChecked = siblings.every(
        (sibling) => updatedItems[sibling]
      );

      // Update the parent checkbox based on siblings
      updatedItems[parentName] = areAllSiblingsChecked;

      return Object.fromEntries(
        Object.entries(updatedItems).filter(([_, value]) => value)
      );
    });
  };

  const handleReset = () => {
    if (
      currentOption === "Loại nhà đất" ||
      currentOption === "Loại hình dự án"
    ) {
      setCheckedItems([]);
    } else if (currentOption === "Mức giá") {
      setPrice([]);
    } else if (currentOption === "Diện tích") {
      setArea([]);
    } else if (currentOption === "Trạng thái") {
      setStatus([]);
    }

    setCurrentOption(null);
  };

  const handleSearch = () => {
    console.log(searchQuery);

    g_setSearchQuery({
      demand: searchQuery.demand === "Bán" ? "Tìm mua" : "Tìm thuê",
      type: searchQuery.houseType,
      address: searchQuery.address
        ? [(({ province, ...rest }) => rest)(searchQuery.address)]
        : [{ province: searchQuery.location }],
      price: searchQuery.priceRange,
      area: searchQuery.areaRange,
      bedroom: "",
      houseDirection: [],
      balconyDirection: [],
    });

    g_setProvince(
      searchQuery.address ? searchQuery.address?.province : searchQuery.location
    );

    if (searchQuery.address?.district) {
      g_setDistrict(
        isNaN(searchQuery.address.district.split(" ").splice(1).join(""))
          ? searchQuery.address.district.split(" ").splice(1).join(" ")
          : searchQuery.address.district
      );
    }
    if (searchQuery.address?.ward) {
      g_setWard(searchQuery.address.ward.split(" ").splice(1).join(" "));
    }
    if (searchQuery.address?.street) {
      g_setStreet(searchQuery.address.street.split(" ").splice(1).join(" "));
    }

    const updatedQuery = {
      demand:
        searchQuery.demand === "Bán"
          ? "Tìm mua"
          : searchQuery.demand === "Thuê"
          ? "Tìm thuê"
          : "Dự án",
      address: searchQuery.address
        ? [{ ...searchQuery.address }]
        : [{ province: searchQuery.location }],
      type: searchQuery.houseType ? searchQuery.houseType : [],
      price: searchQuery.priceRange,
      area: searchQuery.areaRange,
    };

    Cookies.set("searchQuery", JSON.stringify(updatedQuery), {
      expires: 1,
    });

    const addressSlug = searchQuery.address
      ? pathFunction.convertToSlug(
          searchQuery.address.street ||
            searchQuery.address.ward ||
            searchQuery.address.district ||
            searchQuery.address.province ||
            searchQuery.location
        )
      : pathFunction.convertToSlug(searchQuery.location);

    if (searchQuery.houseType.length > 0) {
      const houseTypeSlug = searchQuery.houseType
        .map((type) => {
          const navItem = navItems.find((item) => item.name === currentTab);
          const childItem = navItem?.child.find((child) => child.name === type);
          return childItem?.childLink || "";
        })
        .filter((slug) => slug !== "");

      router.push(`${houseTypeSlug[0]}-${addressSlug}`);
    } else {
      router.push(
        searchQuery.demand === "Bán"
          ? `/nha-dat-ban-${addressSlug}`
          : `/nha-dat-cho-thue-${addressSlug}`
      );
    }
  };

  const getTabName = (tabName) => {
    if (tabName === "Loại nhà đất") {
      return Array.isArray(searchQuery.houseType) &&
        searchQuery.houseType.length > 0
        ? searchQuery.houseType.join(", ")
        : "Loại nhà đất";
    } else if (tabName === "Mức giá") {
      return searchQuery.priceRange ? searchQuery.priceRange : "Mức giá";
    } else {
      return searchQuery.areaRange ? searchQuery.areaRange : "Diện tích";
    }
  };

  return (
    <div className="absolute z-30 xl:top-1/2 top-5 left-1/2 transform -translate-x-1/2 2xl:-translate-y-60 xl:-translate-y-40 w-10/12 md:w-1/2">
      <div className="">
        <ul className="flex gap-2">
          {tabs.map((item, index) => (
            <li
              key={index}
              className={`p-1 px-5 text-sm rounded-tl-md rounded-tr-md cursor-pointer  ${
                currentTab === item ? "bg-black/50 text-white" : "bg-white/90"
              }`}
              onClick={() => setCurrentTab(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="bg-black/50 flex flex-col"
        onClick={() => {
          setIsSearching(false);
          setIsLocation(false);
          setSearchResult([]);
        }}
      >
        <div
          className={`bg-white relative w-[97%] flex-row rounded-md my-5 mx-auto transition-all transform duration-300 ease-out ${
            isSearching ? " py-4 px-3" : null
          }`}
        >
          <div
            className={`w-full relative flex ${
              isSearching ? "border-2 border-gray-300 rounded-md mb-5" : null
            }`}
          >
            <button
              className="flex p-3 items-center w-1/4"
              onClick={(e) => {
                setIsSearching(true);
                setIsLocation(true);
                e.stopPropagation();
              }}
            >
              <span className="flex-grow flex items-center gap-2 text-sm">
                <MapPinIcon className="w-5 h-5" />
                {currentLocation}
              </span>
              <span>
                <ChevronDownIcon
                  className="w-4 h-4 transition-transform duration-300"
                  style={{
                    transform: isSearching ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </span>
            </button>

            <span className="bg-gray-400/50 w-0.5 h-6 my-auto"></span>

            <div className="w-4/5 mx-2 my-1 flex relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute top-1/2 left-0 transform -translate-y-1/2" />
              {searchQuery.address &&
                Object.keys(searchQuery.address).length > 0 && (
                  <>
                    <button
                      className="absolute top-1/2 right-28 rounded-full bg-black text-white p-1 transform -translate-y-1/2 cursor-pointer hover:scale-110"
                      onClick={() => {
                        setSearchQuery((prev) => ({ ...prev, address: {} }));
                        setSearchValue("");
                      }}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>

                    <div className="absolute top-1/2 left-8 border px-2 py-1 rounded-lg bg-white transform -translate-y-1/2 text-sm">
                      {Object.values(searchQuery.address).join(", ")}
                    </div>
                  </>
                )}
              <input
                className="w-9/12 mx-2 flex-grow ml-8 outline-none border-none bg-inherit text-sm"
                value={searchValue}
                placeholder=" Tìm kiếm địa điểm (Ví dụ: Quận Hoàn Kiếm, Quận Đống Đa)"
                onClick={(e) => {
                  setIsSearching(true);
                  setIsLocation(false);
                  e.stopPropagation();
                }}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button
                className=" bg-red-500 text-white my-1 mx-2 px-3 text-sm rounded-md hover:bg-red-500/90"
                onClick={handleSearch}
              >
                Tìm kiếm
              </button>
            </div>
          </div>
          {isSearching && (
            <div
              className={`absolute bg-slate-50 w-full left-0 transform transition-all duration-300 ease-out rounded-lg ${
                isSearching
                  ? "translate-y-0 opacity-100"
                  : "-translate-y-5 opacity-0"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="absolute w-full bg-gray-300 h-0.5 left-0"></span>
              {isLocation ? (
                <div className="p-5">
                  <h1 className="text-sm text-gray-500">Tất cả tỉnh thành</h1>
                  <div className="w-full grid grid-cols-5 max-h-72 overflow-auto">
                    {provinces.map((item, index) => (
                      <button
                        key={index}
                        className="p-2 text-left hover:bg-slate-100 text-sm"
                        onClick={() => {
                          setCurrentLocation(item);
                          setIsLocation(false);
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-5 max-h-56 overflow-auto">
                  <ul className="">
                    <h1 className="pl-2 text-md">
                      {searchResult.length > 0
                        ? "Kết quả tìm kiếm"
                        : "Chưa có kết quả tìm kiếm"}
                    </h1>
                    {searchResult.map((item, index) => (
                      <li
                        key={index}
                        className="p-2 text-left hover:bg-slate-200 rounded-lg text-sm flex items-center gap-2 cursor-pointer"
                        onClick={() => {
                          setSearchQuery((prev) => ({
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
                                    item.district.includes("Huyện")
                                      ? ""
                                      : item.district.includes("Quận")
                                      ? ""
                                      : "Quận"
                                  } ${item.district}`.trim()
                                : `${
                                    item.name.includes("Huyện")
                                      ? ""
                                      : item.name.includes("Quận")
                                      ? ""
                                      : "Quận"
                                  } ${item.name}`.trim(),
                              province: item.province || undefined, // Only add province if it's available
                            },
                          }));
                          setIsLocation(false);
                          setIsSearching(false);
                        }}
                      >
                        <MapPinIcon className="w-5 h-5" /> {item.prefix}{" "}
                        {item.name} {item.district && `, ${item.district}`}{" "}
                        {item.province && `, ${item.province}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mx-4 gap-5 mb-5 md:flex hidden">
          {options.map((item, _) => {
            if (currentTab === item.optionFor) {
              return item.content.map((content, index) => (
                <div key={index} className="w-1/3">
                  <button
                    className={`relative w-full text-white flex border-2 px-2 py-1 border-white/40 items-center 
                  text-sm rounded-md cursor-pointer hover:border-white/80 ${
                    isSearching && "hidden"
                  }`}
                    disabled={isSearching}
                    onClick={() => handleSelectOption(content.name)}
                  >
                    <span className="flex-grow text-left break-words line-clamp-1">
                      {getTabName(content.name)}
                    </span>
                    <span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </span>
                  </button>

                  {currentOption === content.name && (
                    <div
                      className="absolute w-[18.3rem]  bg-white translate-y-2 
                    rounded-lg"
                    >
                      <h1 className="text-center p-3 border-b-2 border-gray-300 text-lg">
                        {content.name}
                      </h1>
                      {content.name === "Mức giá" && (
                        <div className="border-b-2">
                          <div className="flex w-full items-center justify-between p-2">
                            <section className="text-xs w-2/5">
                              {priceRange.from !== 0 || priceRange.to > 0 ? (
                                <p>
                                  Từ{" "}
                                  <span className="text-teal-400">
                                    {moneyConverter(priceRange.from)}
                                  </span>
                                </p>
                              ) : (
                                <p>Giá thấp nhất</p>
                              )}
                              <input
                                type="number"
                                placeholder="Từ"
                                className="w-28 mt-2"
                                value={priceRange.from}
                                onChange={(e) =>
                                  handlePriceChange("from", e.target.value)
                                }
                              />
                            </section>
                            <ArrowRightIcon className="w-5 h-5" />
                            <section className="text-xs w-2/5">
                              {priceRange.to > 0 ? (
                                <p>
                                  Đến{" "}
                                  <span className="text-teal-400">
                                    {moneyConverter(priceRange.to)}
                                  </span>
                                </p>
                              ) : (
                                <p>Giá cao nhất</p>
                              )}
                              <input
                                type="number"
                                placeholder="Đến"
                                className="w-28 mt-2"
                                value={priceRange.to}
                                onChange={(e) =>
                                  handlePriceChange("to", e.target.value)
                                }
                              />
                            </section>
                          </div>
                        </div>
                      )}

                      {content.name === "Diện tích" && (
                        <div className="border-b-2">
                          <div className="flex w-full items-center justify-between p-2">
                            <section className=" text-xs">
                              {areaRange.from !== 0 || areaRange.to > 0 ? (
                                <p>
                                  Từ{" "}
                                  <span className="text-teal-400">
                                    {areaRange.from} m²
                                  </span>
                                </p>
                              ) : (
                                <p>Diện tích nhỏ nhất</p>
                              )}
                              <input
                                type="number"
                                placeholder="Từ"
                                className="w-24 mt-2"
                                value={areaRange.from}
                                onChange={(e) =>
                                  handleAreaChange("from", e.target.value)
                                }
                              />
                            </section>
                            <ArrowRightIcon className="w-5 h-5" />
                            <section className="text-xs">
                              {areaRange.to > 0 ? (
                                <p>
                                  Đến{" "}
                                  <span className="text-teal-400">
                                    {areaRange.to} m²
                                  </span>
                                </p>
                              ) : (
                                <p>Diện tích lớn nhất</p>
                              )}
                              <input
                                type="number"
                                placeholder="Đến"
                                className="w-24 mt-2"
                                value={areaRange.to}
                                onChange={(e) =>
                                  handleAreaChange("to", e.target.value)
                                }
                              />
                            </section>
                          </div>
                        </div>
                      )}

                      <div className="overflow-auto max-h-80">
                        {content.option.map((contentItem, index) => (
                          <div
                            key={index}
                            className="flex flex-col items-center text-md cursor-pointer text-sm"
                          >
                            <div className="flex items-center w-full p-2 hover:bg-slate-300/20">
                              {contentItem.icon}

                              <h1
                                className={`${
                                  contentItem.icon ? "ml-2" : ""
                                } flex-grow`}
                              >
                                {contentItem.optionName || contentItem}
                              </h1>
                              {content.name === "Loại nhà đất" ||
                              content.name === "Loại hình dự án" ? (
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-3 w-3 text-red-600 border-gray-300 rounded focus:ring-0"
                                  checked={
                                    checkedItems[
                                      contentItem.optionName || contentItem
                                    ] || false
                                  }
                                  onChange={() =>
                                    handleParentChecked(
                                      contentItem.optionName || contentItem,
                                      contentItem.subOption
                                    )
                                  }
                                />
                              ) : content.name === "Mức giá" ? (
                                <input
                                  type="radio"
                                  name="priceOptions"
                                  id={`priceOption-${index}`}
                                  value={contentItem}
                                  className="h-3 w-3 text-red-600 border-gray-300 rounded focus:ring-0"
                                  onChange={() => setPrice(contentItem)}
                                />
                              ) : content.name === "Diện tích" ? (
                                <input
                                  type="radio"
                                  name="areaOptions"
                                  id={`areaOptions-${index}`}
                                  value={contentItem}
                                  className="h-3 w-3 text-red-600 border-gray-300 rounded focus:ring-0"
                                  onChange={() => setArea(contentItem)}
                                />
                              ) : (
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-3 w-3 text-red-600 border-gray-300 rounded focus:ring-0"
                                  onChange={() => setStatus(contentItem)}
                                />
                              )}
                            </div>

                            <div className="w-full px-2 text-xs text-gray-500">
                              {contentItem.subOption &&
                                contentItem.subOption.map(
                                  (subOption, index) => (
                                    <div
                                      className="flex items-center py-1 hover:bg-slate-300/20"
                                      key={index}
                                    >
                                      <h1 className="flex-grow">{subOption}</h1>
                                      <input
                                        type="checkbox"
                                        className="form-checkbox h-3 w-3 text-red-600 border-gray-300 rounded focus:ring-0"
                                        checked={
                                          checkedItems[subOption] || false
                                        }
                                        onChange={() =>
                                          handleChildChecked(
                                            subOption,
                                            contentItem.optionName ||
                                              contentItem,
                                            contentItem.subOption
                                          )
                                        }
                                      />
                                    </div>
                                  )
                                )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="p-2 border-t-2 text-sm">
                        <button
                          className="hover:bg-gray-200/80 bg-gray-200 px-2 py-2 rounded float-right"
                          onClick={handleReset}
                        >
                          Đặt lại
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ));
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
