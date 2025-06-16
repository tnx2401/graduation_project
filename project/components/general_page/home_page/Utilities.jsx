import Image from "next/image";
import Link from "next/link";
import React from "react";
import pathFunction from "../shared/pathFunction";

const Utilities = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <p className="h-1"></p>
      <h1 className="text-2xl mt-14">Hỗ trợ tiện ích</h1>
      <div className="grid md:grid-cols-4 grid-cols-2 px-2 xl:px-0 gap-10 my-5">
        {[
          {
            name: "Xem tuổi xây nhà",
            icon: "https://staticfile.batdongsan.com.vn/images/icons/color/ic-ying-yang.svg",
          },
          {
            name: "Chi phí làm nhà",
            icon: "https://staticfile.batdongsan.com.vn/images/icons/color/ic-house.svg",
          },
          {
            name: "Tính lãi suất",
            icon: "https://staticfile.batdongsan.com.vn/images/home/calculator.svg",
          },
          {
            name: "Tư vấn phong thủy",
            icon: "https://staticfile.batdongsan.com.vn/images/icons/color/ic-feng-shui.svg",
          },
        ].map((item, index) => (
          <Link
            href={`/tien-ich/${pathFunction.convertToSlug(item.name)}`}
            className="border flex items-center justify-center p-3 rounded-lg shadow gap-5 hover:scale-105 hover:shadow-lg transition cursor-pointer"
            key={index}
          >
            <div className="w-[40px] h-[40px] relative">
              <Image src={item.icon} fill alt="icon" className="object-cover" />
            </div>
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Utilities;
