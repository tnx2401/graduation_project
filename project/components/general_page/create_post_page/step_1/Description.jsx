import axios from "axios";
import React, { useState, useRef, useEffect } from "react";

const Description = ({ formData, setFormData, titleError, contentError }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = ""; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust height based on content
    }
  }, [content]);

  useEffect(() => {
    setFormData({
      ...formData,
      description: {
        title: title,
        content: content,
      },
    });
  }, [title, content]);

  const generatePropertyDescription = (formData) => {
    const { demand, address, main_info, other_info } = formData;
    const { type, area, price, unit } = main_info;
    const {
      document,
      interior,
      bedroom,
      bathroom,
      floor,
      houseDirection,
      balconyDirection,
      entrance,
      frontage,
    } = other_info;

    return `
      - Type: ${type}
      - Area: ${area} m²
      - Price: ${price} ${unit}
      - Document: ${document}
      - Interior: ${interior}
      - Bedrooms: ${bedroom}
      - Bathrooms: ${bathroom}
      - Floor: ${floor}
      - House Direction: ${houseDirection}
      - Balcony Direction: ${balconyDirection}
      - Entrance: ${entrance || "Not specified"}
      - Frontage: ${frontage || "Not specified"}
      - Address: ${address || "Not specified"}`;
  };
  
  const handleGenerateAI = () => {
    const description = generatePropertyDescription(formData);
    axios
      .post(
        `/api/handle_posts/generateDescription`,
        { description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-full border p-4 rounded-xl my-5 mb-24">
      <h1 className="font-semibold text-lg">Tiêu đề & Mô tả</h1>
      {/* <div className="flex items-center justify-between mt-7">
        <h1 className="font-semibold text-md">Tạo nhanh với AI</h1>
        <button
          className="flex p-2 px-5 border border-black rounded-3xl hover:bg-gray-300 transition-colors duration-200 ease-in-ou text-sm items-center font-semibold"
          onClick={handleGenerateAI}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            data-automation-id="svg-icon"
            className="svg-icon-wrapper"
            da-id="svg-icon"
          >
            <path
              d="M13.75 7.75C13.75 7.33579 13.4142 7 13 7C12.5858 7 12.25 7.33579 12.25 7.75C12.25 10.1758 11.7141 11.7513 10.7327 12.7327C9.75127 13.7141 8.17581 14.25 5.75 14.25C5.33579 14.25 5 14.5858 5 15C5 15.4142 5.33579 15.75 5.75 15.75C8.17581 15.75 9.75127 16.2859 10.7327 17.2673C11.7141 18.2487 12.25 19.8242 12.25 22.25C12.25 22.6642 12.5858 23 13 23C13.4142 23 13.75 22.6642 13.75 22.25C13.75 19.8242 14.2859 18.2487 15.2673 17.2673C16.2487 16.2859 17.8242 15.75 20.25 15.75C20.6642 15.75 21 15.4142 21 15C21 14.5858 20.6642 14.25 20.25 14.25C17.8242 14.25 16.2487 13.7141 15.2673 12.7327C14.2859 11.7513 13.75 10.1758 13.75 7.75Z"
              fill="url(#paint0_linear_18248_139922)"
            ></path>
            <path
              d="M6 5.5C6 5.22386 5.77614 5 5.5 5C5.22386 5 5 5.22386 5 5.5C5 6.48063 4.78279 7.0726 4.4277 7.4277C4.0726 7.78279 3.48063 8 2.5 8C2.22386 8 2 8.22386 2 8.5C2 8.77614 2.22386 9 2.5 9C3.48063 9 4.0726 9.21721 4.4277 9.5723C4.78279 9.9274 5 10.5194 5 11.5C5 11.7761 5.22386 12 5.5 12C5.77614 12 6 11.7761 6 11.5C6 10.5194 6.21721 9.9274 6.5723 9.5723C6.9274 9.21721 7.51937 9 8.5 9C8.77614 9 9 8.77614 9 8.5C9 8.22386 8.77614 8 8.5 8C7.51937 8 6.9274 7.78279 6.5723 7.4277C6.21721 7.0726 6 6.48063 6 5.5Z"
              fill="url(#paint1_linear_18248_139922)"
            ></path>
            <path
              d="M11 1.5C11 1.22386 10.7761 1 10.5 1C10.2239 1 10 1.22386 10 1.5C10 2.13341 9.85918 2.47538 9.66728 2.66728C9.47538 2.85918 9.13341 3 8.5 3C8.22386 3 8 3.22386 8 3.5C8 3.77614 8.22386 4 8.5 4C9.13341 4 9.47538 4.14082 9.66728 4.33272C9.85918 4.52462 10 4.86659 10 5.5C10 5.77614 10.2239 6 10.5 6C10.7761 6 11 5.77614 11 5.5C11 4.86659 11.1408 4.52462 11.3327 4.33272C11.5246 4.14082 11.8666 4 12.5 4C12.7761 4 13 3.77614 13 3.5C13 3.22386 12.7761 3 12.5 3C11.8666 3 11.5246 2.85918 11.3327 2.66728C11.1408 2.47538 11 2.13341 11 1.5Z"
              fill="url(#paint2_linear_18248_139922)"
            ></path>
            <defs>
              <linearGradient
                id="paint0_linear_18248_139922"
                x1="2"
                y1="1"
                x2="21.2026"
                y2="1.17832"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9C24FF"></stop>
                <stop offset="1" stopColor="#5A00A3"></stop>
              </linearGradient>
              <linearGradient
                id="paint1_linear_18248_139922"
                x1="2"
                y1="1"
                x2="21.2026"
                y2="1.17832"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9C24FF"></stop>
                <stop offset="1" stopColor="#5A00A3"></stop>
              </linearGradient>
              <linearGradient
                id="paint2_linear_18248_139922"
                x1="2"
                y1="1"
                x2="21.2026"
                y2="1.17832"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#9C24FF"></stop>
                <stop offset="1" stopColor="#5A00A3"></stop>
              </linearGradient>
            </defs>
          </svg>
          Tạo với AI
        </button>
      </div> */}
      <div className="mt-5">
        <label className="text-sm font-semibold" htmlFor="title">
          Tiêu đề
        </label>
        <textarea
          type="text"
          className="w-full border p-3 mt-3 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300 resize-none"
          placeholder="Mô tả ngắn gọn về loại hình bất động sản, diện tích, địa chỉ (VD: Bán nhà riêng 50m2 chính chủ tại Cầu Giấy)"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          maxLength={99}
          rows={3}
          spellCheck={false}
        />
        {title.length === 0 ? (
          <p className="text-xs mb-3 ">Tối thiểu 30 ký tự, tối đa 99 ký tự</p>
        ) : (
          <p className="text-xs mb-3">{title.length}/99</p>
        )}
        <p className="text-xs mb-3 text-red-600">{titleError}</p>

        <label className=" text-sm font-semibold" htmlFor="title">
          Mô tả
        </label>
        <textarea
          ref={textareaRef}
          type="text"
          className=" w-full border p-3 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300 resize-none overflow-hidden"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            "Mô tả chi tiết về: \n  - Loại hình bất động sản \n  - Vị trí \n  - Diện tích, tiện ích \n  - Tình trạng nội thất \n  ... \n  (VD: Khu nhà có vị trí thuận lợi, gần công viên, trường học...)"
          }
          maxLength={3000}
          rows={8}
          spellCheck={false}
        />

        {content.length === 0 ? (
          <p className="text-xs">Tối thiểu 30 ký tự, tối đa 3000 ký tự</p>
        ) : (
          <p className="text-xs">{content.length}/3000</p>
        )}
        <p className="text-xs mb-3 text-red-600">{contentError}</p>
      </div>
    </div>
  );
};

export default Description;
