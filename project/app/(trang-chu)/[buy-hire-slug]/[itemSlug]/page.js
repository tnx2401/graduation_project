"use client";
import React, { useEffect, useState, use, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";
import ImageSlider from "@/components/general_page/home_page/ImageSlider";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  BellAlertIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChevronRightIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  HeartIcon,
  PhoneIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";

import { BsCoin, BsHouse } from "react-icons/bs";
import { IoIosResize } from "react-icons/io";
import { LuBed, LuBuilding2 } from "react-icons/lu";
import { PiBathtub, PiBriefcaseLight, PiCouch } from "react-icons/pi";
import { GrDirections } from "react-icons/gr";
import { GoHome } from "react-icons/go";
import { GiRoad } from "react-icons/gi";
import { IoDocumentOutline } from "react-icons/io5";
import Loading from "../../loading";
import pathFunction from "@/components/general_page/shared/pathFunction";
import useStore from "@/lib/zustand";
import Cookies from "js-cookie";

import { initializeChat } from "@/lib/chat";
import { jwtDecode } from "jwt-decode";
import AdvertisingCard from "@/components/general_page/shared/AdvertisingCard";
import ReportBox from "@/components/general_page/buy_hire/ReportBox";

const DynamicMap = dynamic(() => import("@/components/general_page/shared/MapContainer"), {
  ssr: false,
});

const AnimatedImage = ({ src, direction }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={src}
      initial={{ x: direction, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -direction, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="absolute w-full h-full"
    >
      <Image
        src={src}
        fill
        alt="thumb-nail-image"
        style={{ objectFit: "contain" }}
      />
    </motion.div>
  </AnimatePresence>
);

const Page = ({ params }) => {
  const resolvedParams = use(params);
  const [data, setData] = useState(null);
  const [osmSearchData, setOSMSearchData] = useState({});
  const [currentImage, setCurrentImage] = useState(0);
  const [prevImage, setPrevImage] = useState(0);
  const { uid,
    g_setProvince,
    g_setDistrict,
    g_setSearchQuery,
    setUid,
    g_setIsChatting,
    g_setCurrentSender,
    g_setCurrentReceiver } = useStore();

  const slug = resolvedParams["itemSlug"];
  const postId = useMemo(() => slug.split("-")[0], [slug]);
  const [projectInfo, setProjectInfo] = useState(null);
  const [similarPosts, setSimilarPosts] = useState([]);
  const [isOpenReportBox, setIsOpenReportBox] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      setUid(userId);
    }
  }, []);

  useEffect(() => {
    if (!postId) return;

    axios
      .get(`http://localhost:3000/api/handle_posts/getPostById?id=${postId}`, {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching post:", err));
  }, [postId, params]);


  useEffect(() => {
    if (!data?.display_address) return;

    console.log("Searching for:", data.project || `${data.street}, ${data.district}, ${data.province}`);

    const searchQuery = (query, fallback = null) => {
      return axios
        .get(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`)
        .then((res) => {
          if (res.data.length > 0) {
            setOSMSearchData(res.data[0]);
            console.log("Found result for:", query);
          } else if (fallback) {
            console.warn("No results found for:", query, "Retrying with:", fallback);
            return searchQuery(fallback); // Retry with fallback query
          } else {
            console.warn("No results found for:", query);
          }
        })
        .catch((error) => console.error("Error fetching coordinates:", error));
    };

    const projectQuery = data.project;
    const fallbackQuery = [data.street, data.district, data.province].filter(Boolean).join(", ");

    searchQuery(projectQuery, fallbackQuery);

    //* Fetch project
    axios.post(`/api/handle_projects/getProjectInfoByPost`, {
      project: data.project,
      postAddress: data.display_address,
    }).then((res) => {
      setProjectInfo(res.data);
    }).catch((error) => {
      console.log(error);
    })

    //* Fetch similar posts
    axios.post(`/api/handle_posts/getSimilarPosts`, {
      type: data.type,
      address: data.display_address,
      province: data.province,
      district: data.district,
      post_id: data.id,
    }).then((res) => {
      setSimilarPosts(res.data);
    }).catch((error) => {
      console.log(error);
    })

    if (data.uid !== uid || !data.uid) {
      axios.post(`/api/handle_posts/updatePostStats`, {
        post_id: postId,
        view: data.view_count + 1,
      })
    }
  }, [data]);


  if (!data || !osmSearchData) return <Loading />;

  const direction = currentImage >= prevImage ? 100 : -100;

  const priceConverter = (price) => {
    const cleanedPrice = price.replace(/[^\d]/g, "");

    if (cleanedPrice.length > 19) return;

    if (cleanedPrice < 1000) {
      return;
    } else if (cleanedPrice >= 1000 && cleanedPrice < 1000000) {
      return (cleanedPrice / 1000).toFixed(2) + " nghìn";
    } else if (cleanedPrice >= 1000000 && cleanedPrice < 1000000000) {
      return (cleanedPrice / 1000000).toFixed(2) + " triệu";
    } else if (cleanedPrice >= 1000000000) {
      return (cleanedPrice / 1000000000).toFixed(2) + " tỷ";
    }
  };

  const priceOverSquare = (price, area, unit) => {
    let pricePerM2;

    if (unit === "VND") {
      if (price > 10000000000) {
        pricePerM2 = (price / 1000000000 / area).toFixed(2) + " tỷ/m²";
      } else if (price >= 1000000000 && price < 10000000000) {
        pricePerM2 = (price / 1000000 / area).toFixed(2) + " triệu/m²";
      } else if (price >= 10000000) {
        pricePerM2 = (price / 1000000 / area).toFixed(2) + " triệu/m²";
      } else if (price >= 1000000 && price < 10000000) {
        pricePerM2 = (price / 1000 / area).toFixed(2) + " nghìn/m²";
      } else if (price >= 1000) {
        pricePerM2 = (price / 1000 / area).toFixed(2) + " nghìn/m²";
      }

      return pricePerM2;
    } else if (unit === "priceoversquare") {
      return (Number(price) * Number(area)) / 100000000 + " tỷ"
    } else {
      return null;
    }
  };

  const handleChat = async () => {
    if (uid === data.uid) return;

    const senderInformation = await axios.post(`/api/getInformationForChat`, { uid: uid })
      .then((res) => {
        return res.data[0];
      })
      .catch((err) => console.error("Error fetching user:", err));

    const receiverInforamtion = { uid: data.uid, username: data.contact_name, profile_picture: data.profile_picture };
    g_setIsChatting(true);
    initializeChat(senderInformation, receiverInforamtion);
    g_setCurrentSender(senderInformation);
    g_setCurrentReceiver(receiverInforamtion);
  }

  const handleConvertDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="max-w-6xl mx-auto flex gap-5 pt-5">
      <div className="w-3/4">
        <div className="relative h-128 overflow-hidden rounded-bl-md rounded-br-md">
          <div
            className="absolute inset-0 mx-auto bg-contain blur-xl z-1"
            style={{ backgroundImage: `url(${data.images[currentImage]})` }}
          ></div>
          <div className="absolute inset-0 w-full h-full z-2 bg-black/30"></div>
          <AnimatedImage
            src={data.images[currentImage]}
            direction={direction}
          />
        </div>

        <div className="mt-1">
          <ImageSlider
            images={data.images}
            width={500}
            height={200}
            haveSearchBox={null}
            slidesPerView={6}
            gap={5}
            setCurrentImage={(newIndex) => {
              setPrevImage(currentImage);
              setCurrentImage(newIndex);
            }}
          />
        </div>

        <div className="my-3 mt-5 text-neutral-400 text-sm flex items-center gap-1">
          <Link
            href={
              resolvedParams["buy-hire-slug"].includes("ban")
                ? `/ban-${pathFunction.convertToSlug(data.type)}`
                : `/thue-${pathFunction.convertToSlug(data.type)}`
            }
          >
            {resolvedParams["buy-hire-slug"].includes("ban") ? "Bán" : "Thuê"}
          </Link>
          <span className="text-xs">/</span>
          <Link
            onClick={() => {
              g_setProvince(data.province);
              g_setSearchQuery({ demand: data.demand === 'Bán' ? 'Tìm mua' : "Tìm thuê", address: [{ province: data.province }], type: [data.type] });
              Cookies.set("searchQuery", JSON.stringify({ demand: data.demand === 'Bán' ? 'Tìm mua' : "Tìm thuê", address: [{ province: data.province }], type: [data.type] }))
            }}
            href={
              resolvedParams["buy-hire-slug"].includes("ban")
                ? `/ban-${pathFunction.convertToSlug(data.type)}-${pathFunction.convertToSlug(
                  data.province
                )}`
                : `/thue-${pathFunction.convertToSlug(data.type)}-${pathFunction.convertToSlug(
                  data.province
                )}`
            }
          >
            {data.province}
          </Link>
          <span className="text-xs">/</span>
          <Link
            onClick={() => { g_setProvince(data.province); g_setDistrict(data.district); g_setSearchQuery({ demand: data.demand === 'Bán' ? 'Tìm mua' : "Tìm thuê", address: [{ province: data.province, district: data.district }], type: [data.type] }) }}
            href={
              resolvedParams["buy-hire-slug"].includes("ban")
                ? `/ban-${pathFunction.convertToSlug(data.type)}-${pathFunction.convertToSlug(
                  data.district
                )}`
                : `/thue-${pathFunction.convertToSlug(data.type)}-${pathFunction.convertToSlug(
                  data.district
                )}`
            }
          >
            {data.district}
          </Link>
          <span className="text-xs">/</span>
          {(data.street || data.type) && (
            <>
              <Link
                className="text-black"
                href={
                  resolvedParams["buy-hire-slug"].includes("ban")
                    ? `/ban-${pathFunction.convertToSlug(data.type)}-duong-${pathFunction.convertToSlug(
                      data.street || ""
                    )}`
                    : `/thue-${pathFunction.convertToSlug(data.type)}-duong-${pathFunction.convertToSlug(
                      data.street || ""
                    )}`
                }
              >
                {data.type} {data.street ? `tại ${data.street}` : ``}
              </Link>
            </>
          )}
        </div>

        <h1 className="text-2xl font-medium ">{data.title}</h1>
        <p className="text-sm my-3 mb-5 text-black">{data.display_address}</p>

        <hr />

        <div className="flex mt-5 items-center justify-between">
          <div className="flex gap-10">
            <div className="flex flex-col gap-1 font-normal">
              <p className="text-md text-neutral-500">Mức giá</p>
              {Number(data.price) !== 0 ? (
                <>
                  <h1 className="font-semibold text-xl">
                    {priceConverter(data.price)}
                  </h1>
                  <p className="text-xs text-neutral-400">
                    ~{priceOverSquare(data.price, data.area, data.unit)}
                  </p>
                </>
              ) : (
                <h1 className="font-semibold text-xl">
                  Thỏa thuận
                </h1>
              )}

            </div>

            <div className="flex flex-col gap-1 font-normal">
              <p className="text-md text-neutral-500">Diện tích</p>
              <h1 className="font-semibold text-xl">{data.area}m²</h1>
              <p className="text-xs text-neutral-400">Mặt tiền 4 m</p>
            </div>

            <div className="flex flex-col gap-1 font-normal">
              <p className="text-md text-neutral-500">Phòng ngủ</p>
              <h1 className="font-semibold text-xl">{data.bedroom} PN</h1>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <ShareIcon className="w-6 h-6 cursor-pointer" />
            <ExclamationCircleIcon className="w-6 h-6 cursor-pointer" onClick={() => setIsOpenReportBox(true)} />
            <HeartIcon className="w-6 h-6 cursor-pointer" />
          </div>
        </div>

        <div className="mt-10">
          <h1 className="text-xl font-medium">Thông tin mô tả</h1>
          <pre className="font-sans text-base whitespace-pre-wrap">
            {data.description}
          </pre>
        </div>

        <div className="mt-10">
          <h1 className="text-xl font-medium">Đặc điểm bất động sản</h1>
          <div className="grid grid-cols-2 gap-10 mt-5">
            {[
              {
                icon: <BsCoin />,
                text: "Mức giá",
                content: data.price ? priceConverter(data.price) : null,
              },
              {
                icon: <IoIosResize />,
                text: "Diện tích",
                content: data.area ? `${data.area}m²` : null,
              },
              {
                icon: <LuBed />,
                text: "Số phòng ngủ",
                content: data.bedroom ? `${data.bedroom} phòng` : null,
              },
              {
                icon: <PiBathtub />,
                text: "Số phòng tắm",
                content: data.bathroom ? `${data.bathroom} phòng` : null,
              },
              {
                icon: <LuBuilding2 />,
                text: "Số tầng",
                content: data.floor ? `${data.floor} tầng` : null,
              },
              {
                icon: <GrDirections />,
                text: "Hướng nhà",
                content: data.house_direction || null,
              },
              {
                icon: <BsHouse />,
                text: "Hướng ban công",
                content: data.balcony_direction || null,
              },
              {
                icon: <IoDocumentOutline />,
                text: "Pháp lý",
                content: data.document ? data.document : null,
              },
              {
                icon: <PiCouch />,
                text: "Nội thất",
                content: data.interior ? data.interior : null,
              },
              {
                icon: <GoHome />,
                text: "Mặt tiền",
                content: (Number(data.frontage) > 0 && data.frontage) ? `${data.frontage} m` : null,
              },
              {
                icon: <GiRoad />,
                text: "Đường vào",
                content: (Number(data.entrance) > 0 && data.entrance) ? `${data.entrance} m` : null,
              },
            ]
              .filter((item) => item.content)
              .map((item, index) => (
                <div key={index} className="flex items-center gap-5 py-2">
                  <div className="flex items-center gap-2 text-lg w-1/2">
                    <p className="text-2xl">{item.icon}</p>
                    <span className="font-normal text-sm">{item.text}</span>
                  </div>
                  <span className="font-normal">{item.content}</span>
                </div>
              ))}
          </div>
        </div>

        {projectInfo && (
          <div className="mt-10">
            <h1 className="text-xl font-medium mb-3">Thông tin dự án</h1>
            <div className="p-3 flex item-start gap-3 border rounded-lg">
              <div className="w-[70px] h-[70px] relative">
                <Image src={projectInfo.image} fill alt="project-image" className="rounded-lg object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <h1>{projectInfo.name}</h1>
                <h1 className="font-light text-sm flex gap-2 items-center">
                  <PiBriefcaseLight />
                  {projectInfo.enterprise_name}
                </h1>
                <Link
                  className="text-red-700 text-xs mt-auto flex items-center hover:text-red-500"
                  href={`/du-an/${pathFunction.convertToSlug(projectInfo.name)}-${projectInfo.id}`}>Tới trang dự án <ChevronRightIcon className="w-3 h-3" /></Link>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h1 className="text-xl font-medium mb-5">Xem trên bản đồ</h1>
          {osmSearchData.lat && osmSearchData && (
            <DynamicMap center={[osmSearchData.lat, osmSearchData.lon]} />
          )}
        </div>

        <div className="mt-10 border-y py-4 grid grid-cols-4">
          {[{ title: "Ngày đăng", value: data.post_start_date, isDate: true }, { title: "Ngày hết hạn", value: data.post_end_date, isDate: true }, { title: "Hạng tin", value: data.rank_name }, { title: "Mã tin", value: data.id }].map((item, index) => (
            <div key={index}>
              <label className="text-sm text-gray-500">{item.title}</label>
              <h1 className="font-medium">
                {item.isDate ? (
                  handleConvertDate(item.value)
                ) : (
                  item.value
                )}</h1>
            </div>
          ))}
        </div>

        {similarPosts.length > 0 && (
          <div className="mt-10">
            <h1 className="text-xl font-medium">Bất động sản dành cho bạn</h1>
            <div className="flex overflow-auto gap-5 overflow-y-hidden">
              {similarPosts.map((item, index) => (
                <AdvertisingCard key={index} title={item.title} image={item.image} price={item.price} area={item.area} location={item.display_address} created_date={item.post_start_date} />
              ))}
            </div>
          </div>
        )}

        <div className="my-20">
          <p>
            Quý vị đang xem nội dung tin rao <span className="font-medium">"{data.title}"- Mã tin {data.id}</span>.
            Mọi thông tin, nội dung liên quan tới tin rao này là do người đăng tin đăng tải và chịu trách nhiệm.
            Batdongsan.com.vn luôn cố gắng để các thông tin được hữu ích nhất cho quý vị tuy nhiên Batdongsan.com.vn không đảm
            bảo và không chịu trách nhiệm về bất kỳ thông tin, nội dung nào liên quan tới tin rao này.
            Trường hợp phát hiện nội dung tin đăng không chính xác, Quý vị hãy thông báo và cung cấp thông tin cho
            Ban quản trị Batdongsan.com.vn theo Hotline 19001881 để được hỗ trợ nhanh và kịp thời nhất.
          </p>
        </div>
      </div>

      <div className="w-1/4 relative">
        <div className="fixed w-1/6 border flex flex-col items-center justify-center p-5 shadow  rounded-lg">
          <Image
            src={data.profile_picture}
            width={80}
            height={80}
            alt="author-image"
            className="rounded-full"
          />
          <h1 className="mt-3 font-semibold">{data.contact_name}</h1>
          <button className="w-full bg-teal-600/80 py-3 font-normal text-sm text-white rounded-lg mt-5 flex items-center justify-center gap-2">
            <span><PhoneIcon className="w-5 h-5" /></span> {uid
              ? data.phone_number
              : data.phone_number.replace(/\d{3}$/, '***')}
          </button>
          {uid && uid !== data.uid && (
            <button
              className="w-full border border-gray-400 py-3 font-normal text-sm rounded-lg mt-5 flex items-center justify-center gap-2"
              onClick={handleChat}
            >
              <span><ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" /></span>Nhắn tin ngay
            </button>
          )}
          {uid && uid === data.uid && (
            <>
            </>
          )}

          {!uid && (
            <p className="w-full border bg-gray-300 py-3 font-normal text-sm rounded-lg mt-5 cursor-not-allowed text-center">Đăng nhập để nhắn tin</p>
          )}
          <button className="w-full border border-gray-400 py-3 font-normal text-sm rounded-lg mt-5 flex items-center justify-center gap-2">
            <span><EnvelopeIcon className="w-5 h-5" /></span>Gửi Email
          </button>
          <button className="w-full border border-gray-400 py-3 font-normal text-sm rounded-lg mt-5 flex items-center justify-center gap-2">
            <BellAlertIcon className="w-5 h-5" /> Yêu cầu liên hệ lại
          </button>
        </div>
      </div>
      {isOpenReportBox && (
        <ReportBox onClose={setIsOpenReportBox} postId={data.id} />
      )}
    </div>
  );
};

export default Page;
