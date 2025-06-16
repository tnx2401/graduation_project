"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import dynamic from "next/dynamic";

const Demand = dynamic(() => import("@/components/general_page/create_post_page/step_1/Demand"), { ssr: false });
const Location = dynamic(() => import("@/components/general_page/create_post_page/step_1/Location"), { ssr: false });
const MainInfo = dynamic(() => import("@/components/general_page/create_post_page/step_1/MainInfo"), { ssr: false });
const OtherInfo = dynamic(() => import("@/components/general_page/create_post_page/step_1/OtherInfo"), { ssr: false });
const Contact = dynamic(() => import("@/components/general_page/create_post_page/step_1/Contact"), { ssr: false });
const Description = dynamic(() => import("@/components/general_page/create_post_page/step_1/Description"), { ssr: false });
const AssignPhonenumber = dynamic(() => import("@/components/general_page/create_post_page/step_1/AssignPhonenumber"), { ssr: false });
const ImageAndVideo = dynamic(() => import("@/components/general_page/create_post_page/step_2/ImageAndVideo"), { ssr: false });
const Payment = dynamic(() => import("@/components/general_page/create_post_page/step_3/Payment"), { ssr: false });
const PaymentInfo = dynamic(() => import("@/components/general_page/create_post_page/PaymentInfo"), { ssr: false });
const Loading = dynamic(() => import("../loading"), { ssr: false });

import pathFunction from "@/components/general_page/shared/pathFunction";

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [havePhonenumber, setHavePhonenumber] = useState(true);
  const [userId, setUserId] = useState("");

  const [step, setStep] = useState(1);
  const [confirm, setConfirm] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  // * Required fields error
  const [typeError, setTypeError] = useState("");
  const [areaError, setAreaError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");

  const [imageError, setImageError] = useState("");

  // * Check if user have phone number or not
  //? If not create a prompt to assign and verify phone number .
  //? If yes return
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      setUserId(userId);
      axios
        .get(`/api/users?userId=${userId}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        .then((res) => {
          if (!res.data.phone_number) {
            setHavePhonenumber(false);
            setIsLoading(false);
          } else {
            setIsLoading(false);
            return;
          }
        })
        .catch((error) => {
          console.log("Error fetching user with ID: ", userId, error);
        });
    } else {
      router.push("/");
      alert("Bạn cần đăng nhập để tiếp tục đăng tin");
    }
  }, []);

  const [formData, setFormData] = useState({
    demand: "",
    address: "",
    main_info: {
      type: "",
      area: "",
      price: "",
      unit: "",
    },
    other_info: {
      document: "",
      interior: "",
      bedroom: 0,
      bathroom: 0,
      floor: 0,
      houseDirection: "",
      balconyDirection: "",
      entrance: 0,
      frontage: 0,
    },
    contact_info: {
      contactName: "",
      email: "",
      phoneNumber: "",
    },
    description: {
      title: "",
      content: "",
    },
    media: {
      images: [],
      videoLink: "",
    },
    payment: {
      rank: "",
      startDate: "",
      postTime: "",
      duration: "",
      moneyperday: "",
      total: "",
    },
    discount: null,
  });

  const getStep = (step) => {
    if (step === 1) {
      return "Thông tin BĐS";
    } else if (step === 2) {
      return "Hình ảnh & video";
    } else if (step === 3) {
      return "Cấu hình & thanh toán";
    }
  };

  const handleNextStep = () => {
    let hasError = false;
    if (step === 1) {
      if (formData.main_info.type.trim() === "") {
        setTypeError("Chưa chọn loại BĐS");
        hasError = true;
      } else {
        setTypeError("");
      }

      if (formData.main_info.area.trim() === "") {
        setAreaError("Chưa nhập diện tích");
        hasError = true;
      } else {
        setAreaError("");
      }

      if (formData.main_info.unit !== "agreement") {
        if (formData.main_info.price.trim() === "") {
          setPriceError("Chưa nhập giá tiền");
          hasError = true;
        } else {
          setPriceError("");
        }
      }

      if (formData.description.title.length < 30) {
        setTitleError("Vui lòng nhập tối thiểu 30 ký tự");
        hasError = true;
      } else {
        setTitleError("");
      }

      if (formData.description.content.length < 30) {
        setContentError("Vui lòng nhập tối thiểu 30 ký tự");
        hasError = true;
      } else {
        setContentError("");
      }
    } else if (step === 2) {
      if (formData.media.images.length < 3) {
        setImageError("Vui lòng đăng tối thiểu 3 ảnh thường");
        hasError = true;
      } else {
        setImageError("");
      }
    } else if (step === 3) {
    }
    if (hasError) return; // Stop execution if any error exists

    if (step < 3) {
      setStep((prev) => prev + 1);
    } else {
      setConfirm(true);
    }
    if ((step === 3) & confirm) {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (step === 3 && confirm) {
      setConfirm(false);
    } else {
      setStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    axios
      .post(
        `/api/handle_posts/handlePosting`,
        {
          formData,
          userId,
        },
        { headers: { "Content-Type": "application/json" } }
      )
      .then((res) => {
        const response = res.data["message"];
        if (response === "Đăng bài thành công") {
          setSubmitStatus(response);
        } else if (response === "Số dư tài khoản không đủ") {
          setSubmitStatus(response);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (isLoading) {
    return <Loading />;
  }

  console.log(formData);

  return (
    <div className="relative">
      <div className="flex justify-between items-center p-3 px-5">
        <h1 className="font-medium text-xl">Tạo tin đăng</h1>
        <div className="flex items-center gap-3">
          <button className="p-2 px-3 border rounded-2xl flex items-center gap-2 text-neutral-400">
            <EyeIcon className="w-4 h-4" />
            Xem trước
          </button>
          <button className="p-2 px-3 border-black border rounded-3xl">
            Thoát
          </button>
        </div>
      </div>

      <div>
        <h1 className="px-5">
          Bước {step}. {getStep(step)}
        </h1>
        <ul className="w-full flex px-5 py-2 gap-2">
          <li className="relative w-1/3 h-1 bg-gray-200 rounded-lg overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-red-600 transition-all duration-500"
              style={{
                width: step >= 1 ? "100%" : "0%",
              }}
            ></div>
          </li>
          <li className="relative w-1/3 h-1 bg-gray-200 rounded-lg overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-red-600 transition-all duration-500"
              style={{
                width: step >= 2 ? "100%" : "0%",
              }}
            ></div>
          </li>

          <li className="relative w-1/3 h-1 bg-gray-200 rounded-lg overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-red-600 transition-all duration-500"
              style={{
                width: step === 3 ? "100%" : "0%",
              }}
            ></div>
          </li>
        </ul>
      </div>

      {confirm ? (
        <div className="max-w-3xl mx-auto pt-3">
          <PaymentInfo formData={formData} />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto pt-3">
          {step === 1 && (
            <>
              <Demand formData={formData} setFormData={setFormData} />
              {formData.demand !== "" && (
                <Location formData={formData} setFormData={setFormData} />
              )}
              {formData.address !== "" && (
                <MainInfo
                  formData={formData}
                  setFormData={setFormData}
                  typeError={typeError}
                  areaError={areaError}
                  priceError={priceError}
                />
              )}
              {formData.main_info.type !== "" &&
                formData.main_info.price !== "" &&
                formData.main_info.area !== "" && (
                  <>
                    <OtherInfo formData={formData} setFormData={setFormData} />
                    <Contact formData={formData} setFormData={setFormData} />
                    <Description
                      formData={formData}
                      setFormData={setFormData}
                      titleError={titleError}
                      contentError={contentError}
                    />
                  </>
                )}
            </>
          )}

          {step === 2 && (
            <ImageAndVideo
              formData={formData}
              setFormData={setFormData}
              imageError={imageError}
            />
          )}

          {step === 3 && (
            <Payment formData={formData} setFormData={setFormData} />
          )}
        </div>
      )}

      <div
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 ml-12 bg-neutral-50 border-t w-[768px] ${step >= 2 ? "flex items-center justify-between" : ""
          } px-4`}
      >
        {step >= 2 && (
          <button
            className="p-3 px-5 my-2 border-black border rounded-3xl text-black"
            onClick={() => handlePrevStep()}
          >
            Quay lại
          </button>
        )}
        <div className="flex items-center gap-5">
          {formData.payment.total !== "" && step === 3 && (
            <>
              <h1 className="gap-3 flex items-center">
                {!isNaN(formData.payment.total) &&
                  <>
                    Tổng tiền{" "}
                    <span className="font-semibold text-xl">
                      {Number(formData.payment.total).toLocaleString("de-DE")} đ
                    </span>
                  </>
                }
              </h1>
              <p className="bg-gray-300 w-0.5 h-6"></p>
            </>
          )}
          <button
            className={`p-3 px-5 my-2 bg-red-700 rounded-3xl text-white ${step === 1 ? "ml-auto" : ""
              }`}
            onClick={() => handleNextStep()}
          >
            {confirm ? "Thanh toán" : "Tiếp tục"}
          </button>
        </div>
      </div>
      {!havePhonenumber && (
        <AssignPhonenumber
          userId={userId}
          setHavePhonenumber={setHavePhonenumber}
        />
      )}

      {submitStatus.trim() !== "" && (
        <div className="fixed inset-0 top-0 left-0 w-screen h-screen bg-white z-50 flex items-center justify-center">
          {submitStatus === "Đăng bài thành công" && <div className="flex flex-col items-center justify-center">
            <CheckCircleIcon className="w-32 h-32 text-green-500" />
            <h1 className="text-xl mt-5">Tạo tin đăng thành công, quản trị viên sẽ duyệt tin của bạn trong vòng 24h</h1>
            <div className="flex mt-10 gap-10">
              {[{ name: "Về trang chủ", href: "/" }, { name: "Tới trang quản lý tin đăng", href: `/nguoi-dung/quan-ly-tin-dang` }, { name: "Đăng tin mới", href: `/nguoi-dung/dang-tin` }].map((item, index) => (
                <Link key={index} href={item.href} className="p-3 px-7 border rounded-xl hover:text-black hover:shadow-md text-neutral-400">{item.name}</Link>
              ))}
            </div>
          </div>}

          {submitStatus === "Số dư tài khoản không đủ" && <div className="flex flex-col items-center justify-center">
            <CheckCircleIcon className="w-32 h-32 text-red-500" />
            <h1 className="text-xl mt-5">Số dư tài khoản không đủ</h1>
            <div className="flex mt-10 gap-10">
              {[{ name: "Về trang chủ", href: "/" }, { name: "Tới trang tin đăng", href: `/${pathFunction.convertToSlug(formData.demand)}-${pathFunction.convertToSlug(formData.main_info.type)}` }, { name: "Đăng tin mới", href: `/nguoi-dung/dang-tin` }].map((item, index) => (
                <Link key={index} href={item.href} className="p-3 px-7 border rounded-xl hover:text-black hover:shadow-md text-neutral-400">{item.name}</Link>
              ))}
            </div>
          </div>}
        </div>
      )}
    </div>
  );
};
export default Page;
