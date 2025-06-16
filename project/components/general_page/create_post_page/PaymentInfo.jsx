import Image from "next/image";
import React, { useState } from "react";

const PaymentInfo = ({ formData }) => {
  const [isShowingTitle, setIsShowingTitle] = useState(false);
  const [isShowingAddress, setIsShowingAddress] = useState(false);

  const handleEndDate = (startDate) => {
    const endDate = new Date(startDate); // Clone the date to avoid modifying the original
    endDate.setDate(endDate.getDate() + parseInt(formData.payment.duration));

    return `${endDate.getDate().toString().padStart(2, "0")}/${(
      endDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${endDate.getFullYear()}`;
  };

  return (
    <div>
      <h1 className="font-semibold">Thông tin thanh toán</h1>
      <div className="flex gap-5 mt-5 items-start">
        <div className="flex w-1/2">
          <div className="flex p-3 items-center gap-3 border border-gray-400 rounded-2xl w-full">
            <div className="relative h-full w-1/3 aspect-square bg-black rounded-xl">
              <Image
                src={formData.media.images[0]}
                fill
                objectFit="cover"
                alt="image"
                className="rounded-xl"
              />

              <span
                className={`absolute top-2 left-2 p-1 px-2 text-xs text-white rounded-xl ${
                  formData.payment.rank === "VIP Kim Cương"
                    ? "bg-red-500"
                    : formData.payment.rank === "VIP Vàng"
                    ? "bg-yellow-400"
                    : formData.payment.rank === "VIP Bạc"
                    ? "bg-teal-600"
                    : "bg-gray-400"
                }`}
              >
                VIP
              </span>
            </div>
            <div className="text-sm w-1/2">
              <div
                className="relative"
                onMouseEnter={() => setIsShowingTitle(true)}
                onMouseLeave={() => setIsShowingTitle(false)}
              >
                <h1 className="font-semibold break-words line-clamp-2">
                  {formData.description.title}
                </h1>
                <span
                  className={`p-2 px-2 rounded-lg absolute bg-white text-black border-black border font-normal w-128 z-50 ${
                    isShowingTitle ? "block" : "hidden"
                  }`}
                >
                  {formData.description.title}
                </span>
              </div>
              <div
                className="relative"
                onMouseEnter={() => setIsShowingAddress(true)}
                onMouseLeave={() => setIsShowingAddress(false)}
              >
                <p className="line-clamp-3">
                  {formData.address.displayAddress}
                </p>
                <span
                  className={`p-2 px-2 rounded-lg absolute bg-white text-black border-black border font-normal w-128 z-50 ${
                    isShowingAddress ? "block" : "hidden"
                  }`}
                >
                  {formData.address.displayAddress}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 flex-col flex gap-5 ">
          {[
            { name: "Loại tin", value: formData.payment.rank },
            { name: "Đơn giá", value: formData.payment.moneyperday.toLocaleString("de-DE") + " đ/ngày" },
            {
              name: "Số ngày đăng",
              value: formData.payment.duration + " ngày",
            },
            { name: "Thời gian đăng", value: formData.payment.postTime },
            {
              name: "Thời gian kết thúc",
              value: handleEndDate(formData.payment.startDate),
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <p className="text-sm">{item.name}</p>
              <p className="font-semibold">{item.value}</p>
            </div>
          ))}

          <hr />

          <div className="flex items-center justify-between">
            <p className="text-sm">Thanh toán</p>
            <p className="font-semibold">{formData.payment.total.toLocaleString("de-DE")} đ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
