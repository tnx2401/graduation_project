"use client";
import React from "react";
import Image from "next/image";
import SearchBox from "./SearchBox/SearchBox";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ImageSlider = ({
  images,
  width,
  height,
  haveSearchBox,
  slidesPerView,
  gap,
  setCurrentImage,
}) => {
  return (
    <div className={`xl:block ${!haveSearchBox ? " w-[864px] h-24" : ""}`}>
      <div className="w-full h-full relative">
        {haveSearchBox && <SearchBox />}
        <Swiper
          spaceBetween={gap}
          slidesPerView={slidesPerView}
          className="w-full h-full"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index} className="w-full h-full relative">
              {haveSearchBox ? (
                <Image
                  src={image}
                  alt="img-slider"
                  width={width}
                  height={height * 1.5}
                  priority={index === 0}
                />
              ) : (
                <Image
                  src={image}
                  alt="img-slider"
                  fill
                  priority={index === 0}
                  className="border border-black rounded-lg cursor-pointer"
                  style={{ objectFit: "cover", objectPosition: "center" }}
                  onClick={() => setCurrentImage(index)}
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ImageSlider;
