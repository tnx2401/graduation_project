"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import { debounce } from "lodash";
import {
  BellIcon,
  HeartIcon,
  Bars4Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import LoginModal from "@/components/general_page/shared/LoginModal";
import SideBar from "@/components/general_page/shared/SideBar";

import useStore from "@/lib/zustand";
import { auth } from "@/lib/firebase";

import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Cookies from "js-cookie";

const NavigationBar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  //* Modal state for login and signup
  const [openModal, setOpenModal] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);

  //* Handle user options
  const [userOptions, setUserOptions] = useState(false);
  const options = [
    { name: "Tổng quan", link: "/nguoi-dung" },
    { name: "Quản lý tin đăng", link: "/nguoi-dung/quan-ly-tin-dang" },
    { name: "Gói hội viên", link: "/nguoi-dung/goi-hoi-vien" },
    { name: "Quản lý khách hàng", link: "/nguoi-dung/quan-ly-khach-hang" },
    { name: "Quản lý tin tài trợ", link: "/nguoi-dung/quan-ly-tin-tai-tro" },
    {
      name: "Thay đổi thông tin cá nhân",
      link: "/nguoi-dung/thong-tin-ca-nhan",
    },
    { name: "Thay đổi mật khẩu", link: "/nguoi-dung/thay-doi-mat-khau" },
    { name: "Nạp tiền", link: "/nguoi-dung/nap-tien" },
    { name: "Đăng xuất" },
  ];

  //* Handle inactivity
  let inactivityTimeout;
  const INACTIVITY_LIMIT = 15 * 60 * 1000;

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(handleInactivity, INACTIVITY_LIMIT);
  };

  const handleInactivity = () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      alert("Bạn đã không hoạt động một thời gian. Hãy đăng nhập lại");
      localStorage.removeItem("authToken");
      localStorage.removeItem("authExpiresAt");
      auth.signOut();
    } else {
      return;
    }
  };

  const activitiesEvent = ["scroll", "click", "keydown", "mousemove"];
  useEffect(() => {
    // Attach event listeners
    activitiesEvent.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer);
    });

    resetInactivityTimer();

    // Clean up event listeners when component is unmounted
    return () => {
      activitiesEvent.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, []);

  //* Navigation items
  const [currentHoveringNav, setCurrentHoveringNav] = useState(null);
  const [currentSelectedNav, setCurrentSelectedNav] = useState(null);
  const navItems = useMemo(
    () => [
      {
        name: "Nhà đất bán",
        link: "nha-dat-ban",
        parent: "ban-slug",
        child: [
          { name: "Bán căn hộ chung cư", childLink: "/ban-can-ho-chung-cu" },
          {
            name: "Bán chung cư mini, căn hộ dịch vụ",
            childLink: "/ban-chung-cu-mini-can-ho-dich-vu",
          },
          { name: "Bán nhà riêng", childLink: "/ban-nha-rieng" },
          {
            name: "Bán nhà biệt thự, liền kề",
            childLink: "/ban-nha-biet-thu-lien-ke",
          },
          { name: "Bán nhà mặt phố", childLink: "/ban-nha-mat-pho" },
          {
            name: "Bán shophouse, nhà phố thương mại",
            childLink: "/ban-shophouse-nha-pho-thuong-mai",
          },
          { name: "Bán đất nền dự án", childLink: "/ban-dat-nen-du-an" },
          { name: "Bán đất", childLink: "/ban-dat" },
          {
            name: "Bán trang trại, khu nghỉ dưỡng",
            childLink: "/ban-trang-trai-khu-nghi-duong",
          },
          { name: "Bán condotel", childLink: "/ban-condotel" },
          { name: "Bán kho, nhà xưởng", childLink: "/ban-kho-nha-xuong" },
          {
            name: "Bán loại bất động sản khác",
            childLink: "/ban-loai-bds-khac",
          },
        ],
      },
      {
        name: "Nhà đất cho thuê",
        link: "nha-dat-cho-thue",
        child: [
          {
            name: "Cho thuê căn hộ chung cư",
            childLink: "/thue-can-ho-chung-cu",
          },
          {
            name: "Cho thuê chung cư mini, căn hộ dịch vụ",
            childLink: "/thue-chung-cu-mini-can-ho-dich-vu",
          },
          {
            name: "Cho thuê nhà riêng",
            childLink: "/thue-nha-rieng",
          },
          {
            name: "Cho thuê nhà biệt thự, liền kề",
            childLink: "/thue-nha-biet-thu-lien-ke",
          },
          {
            name: "Cho thuê nhà mặt phố",
            childLink: "/thue-nha-mat-pho",
          },
          {
            name: "Cho thuê shophouse, nhà phố thương mại",
            childLink: "/thue-shophouse-nha-pho-thuong-mai",
          },
          {
            name: "Cho thuê nhà trọ, phòng trọ",
            childLink: "/thue-nha-tro-phong-tro",
          },
          {
            name: "Cho thuê văn phòng",
            childLink: "/thue-van-phong",
          },
          {
            name: "Cho thuê, sang nhượng cửa hàng, ki ốt",
            childLink: "/thue-sang-nhuong-cua-hang-ki-ot",
          },
          {
            name: "Cho thuê kho, nhà xưởng, đất",
            childLink: "/thue-kho-nha-xuong-dat",
          },
          {
            name: "Cho thuê loại bất động sản khác",
            childLink: "/thue-loai-bat-dong-san-khac",
          },
        ],
      },
      {
        name: "Dự án",
        link: "du-an",
        child: [
          { name: "Căn hộ chung cư", childLink: "/du-an/can-ho-chung-cu" },
          { name: "Cao ốc văn phòng", childLink: "/du-an/cao-oc-van-phong" },
          {
            name: "Trung tâm thương mại",
            childLink: "/du-an/trung-tam-thuong-mai",
          },
          { name: "Khu đô thị mới", childLink: "/du-an/khu-do-thi-moi" },
          { name: "Khu phức hợp", childLink: "/du-an/khu-phuc-hop" },
          { name: "Nhà ở xã hội", childLink: "/du-an/nha-o-xa-hoi" },
          {
            name: "Khu nghỉ dưỡng, sinh thái",
            childLink: "/du-an/khu-nghi-duong-sinh-thai",
          },
          { name: "Khu công nghiệp", childLink: "/du-an/khu-cong-nghiep" },
          { name: "Biệt thự, liền kề", childLink: "/du-an/biet-thu-lien-ke" },
          { name: "Shophouse", childLink: "/du-an/shophouse" },
          { name: "Nhà mặt phố", childLink: "/du-an/nha-mat-pho" },
          { name: "Dự án khác", childLink: "/du-an/du-an-khac" },
        ],
      },
      { name: "Tin tức", link: "tin-tuc" },
      { name: "Wiki BĐS", link: "wiki-bds" },
      { name: "Phân tích đánh giá", link: "phan-tich-danh-gia" },
      { name: "Danh bạ", link: "danh-ba" },
    ],
    []
  );

  //* Handle Navbar behaviour when scrolling (useCallback + debounce to reduce incoming inputs)
  const handleScroll = useCallback(
    debounce(() => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    }, 50),
    []
  );

  //* State management for user info
  const username = useStore((state) => state.username);
  const profileImage = useStore((state) => state.profileImage);
  const setUsername = useStore((state) => state.setUsername);
  const setProfileImage = useStore((state) => state.setProfileImage);
  const {
    g_setProvince,
    g_setDistrict,
    g_setWard,
    g_setStreet,
    g_setSearchQuery,
  } = useStore();

  //* Check login session on each web reload
  useEffect(() => {
    checkAuthStatus();
  }, []);

  //* Check if login session is expired
  const checkAuthStatus = () => {
    const expiresAt = localStorage.getItem("authExpiresAt");

    if (!expiresAt || new Date().getTime() > expiresAt) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authExpiresAt");
      auth.signOut();
      setUsername(null);
      setProfileImage(null);
    } else {
      const token = localStorage.getItem("authToken");
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.user_id;
        axios
          .get(`/api/users?userId=${userId}`, {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              Expires: "0",
            },
          })
          .then((res) => {
            setUsername(res.data.username);
            setProfileImage(res.data.profile_picture);

            const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;
            localStorage.setItem("authExpiresAt", expiresAt);

            setLoading(false);
          })
          .catch((error) => {
            console.log("Error fetching user with ID: ", userId, error);
            setLoading(false);
          });
      } else {
        console.log("No token found");
        setLoading(false);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  //* Check path
  const pathName = usePathname();

  //* Handle Posting
  const handlePosting = () => {
    if (username) {
      router.push("/nguoi-dung/dang-tin");
    } else {
      setOpenModal("login");
      localStorage.setItem("redirectAfterLogin", "/nguoi-dung/dang-tin");
    }
  };

  const handleLoginSuccess = () => {
    const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
    localStorage.removeItem("redirectAfterLogin"); // Clean up
    router.push(redirectTo);
  };

  useEffect(() => {
    if (pathName.includes("ban")) {
      setCurrentSelectedNav("Nhà đất bán");
    } else if (pathName.includes("thue")) {
      setCurrentSelectedNav("Nhà dất cho thuê");
    } else if (pathName.includes("du-an")) {
      setCurrentSelectedNav("Dự án");
    } else if (pathName.includes("tin-tuc")) {
      setCurrentSelectedNav("Tin tức");
    } else if (pathName.includes("wiki-bds")) {
      setCurrentSelectedNav("Wiki BĐS");
    } else if (pathName.includes("phan-tich-danh-gia")) {
      setCurrentSelectedNav("Phân tích đánh giá");
    } else if (pathName.includes("danh-ba")) {
      setCurrentSelectedNav("Danh bạ");
    } else if (pathName === "/") {
      setCurrentSelectedNav(null);
    }
  }, [pathName]);

  //* Handle User Option
  const handleUserOptions = (option) => {
    if (option === "Đăng xuất") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authExpiresAt");
      auth.signOut();
      setUsername(null);
      setProfileImage(null);
      setUserOptions(false);
    }
  };

  return (
    <>
      <div
        className={`fixed top-0 w-full flex justify-between items-center shadow-md px-5 ${
          isScrolled ? "py-2" : "py-6"
        } transition-all bg-white z-50`}
      >
        <section className="flex items-center flex-grow">
          <Link href={"/"}>
            <Image
              src="https://staticfile.batdongsan.com.vn/images/logo/standard/red/logo.svg"
              alt="logo"
              width={150}
              height={150}
            />
          </Link>
          <ul className="hidden xl:flex ml-4 text-sm font-medium z-50">
            {navItems.map((item, index) => (
              <li
                key={index}
                className="ml-5 group relative"
                onMouseEnter={() => setCurrentHoveringNav(item.name)}
                onMouseLeave={() => setCurrentHoveringNav(null)}
                onClick={() => {
                  setCurrentSelectedNav(item.name);
                  g_setProvince("");
                  g_setDistrict("");
                  g_setWard("");
                  g_setStreet("");
                  g_setSearchQuery({
                    demand: "",
                    type: [],
                    address: [],
                    price: "",
                    area: "",
                    bedroom: "",
                    houseDirection: [],
                    balconyDirection: [],
                  });
                  Cookies.remove("searchQuery");
                  setTimeout(() => {
                    router.push("/" + item.link);
                  }, 10);
                }}
              >
                <Link href={item.link}>{item.name}</Link>
                <span
                  className={`block w-0 h-[2px] bg-orange-600 transition-all duration-300 ease-out ${
                    currentSelectedNav !== item.name
                      ? "group-hover:w-full"
                      : "w-full"
                  }`}
                ></span>
                {currentHoveringNav === item.name && (
                  <div className="absolute rounded flex flex-col bg-white">
                    {item.child?.map((child, index) => (
                      <Link
                        href={child.childLink}
                        key={index}
                        className="w-80 text-md bg-white m-1 p-1 font-normal hover:bg-slate-100 cursor-pointer"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="flex items-center">
          <div className="flex space-x-4">
            <button className="relative group">
              <HeartIcon className="w-6 h-6" />
              <span
                className="absolute -bottom-0 left-1/2 
            transform -translate-x-1/2 w-40 py-1.5 opacity-0 invisible translate-y-10
            text-sm bg-black text-white rounded-md transition-all duration-300 ease-out
            group-hover:opacity-100 group-hover:visible group-hover:translate-y-14"
              >
                Danh sách tin đã lưu
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-black"></span>
              </span>
            </button>
            <button className={`${username ? "block" : "hidden"}`}>
              <BellIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="hidden xl:flex space-x-4 ml-4 text-sm font-medium items-center">
            {!loading && username && (
              <div
                className="flex items-center relative justify-center gap-3 cursor-pointer"
                onClick={() => setUserOptions(!userOptions)}
              >
                <Image
                  src={profileImage}
                  width={35}
                  height={35}
                  className="rounded-3xl"
                  alt="user_profile_image"
                />
                <p>{username}</p>
                <ChevronDownIcon className="w-4 h-4" />
                {userOptions && (
                  <div
                    className="absolute top-12 right-0 w-72 bg-white shadow-md rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative">
                      <Image
                        src={
                          "https://staticfile.batdongsan.com.vn/images/PIVOT/banner-menu-pivot.png"
                        }
                        width={300}
                        height={35}
                        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 rounded-tl-lg rounded-tr-lg"
                        alt="user_profile_image"
                      />
                      <h1 className="z-50 absolute top-5 left-5 capitalize text-white text-lg">
                        Gói hội viên
                      </h1>
                      <p className="z-50 absolute top-14 left-5 text-white text-xs">
                        <span className="text-red-400">Tiết kiệm đến 39% </span>
                        chi phí so với đăng tin/đẩy tin lẻ
                      </p>
                      <button className="z-50 absolute top-24 left-5 bg-red-600 text-white py-1 px-2 rounded-sm">
                        Tìm hiểu thêm
                      </button>
                    </div>
                    <div className="mt-36 flex flex-col">
                      {options.map((option, index) =>
                        option.link ? (
                          <Link
                            key={index}
                            className="hover:bg-neutral-100 p-2 mb-2 rounded-lg cursor-pointer"
                            href={option.link}
                          >
                            {option.name}
                          </Link>
                        ) : (
                          <button
                            key={index}
                            className="hover:bg-neutral-100 p-2 mb-2 rounded-lg cursor-pointer w-full text-left"
                            onClick={() => handleUserOptions(option.name)}
                          >
                            {option.name}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {!loading && !username && (
              <button
                className="px-2 p-3 hover:bg-neutral-100 rounded-lg"
                onClick={() => setOpenModal("login")}
              >
                Đăng nhập
              </button>
            )}
            <button
              className="border-2 p-3 hover:bg-neutral-100 rounded-lg"
              onClick={handlePosting}
            >
              Đăng tin
            </button>
          </div>
          <div className="xl:hidden flex space-x-4 ml-4">
            <button onClick={() => setOpenSidebar(true)}>
              <Bars4Icon className="w-6 h-6" />
            </button>
          </div>
        </section>
      </div>

      {openModal && (
        <LoginModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          handleLoginSuccess={handleLoginSuccess}
        />
      )}

      {openSidebar && (
        <SideBar
          navItems={navItems}
          setOpenModal={setOpenModal}
          setOpenSidebar={setOpenSidebar}
        />
      )}
    </>
  );
};

export default NavigationBar;
