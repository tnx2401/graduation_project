import React, { useState, useEffect } from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/24/outline";

const directions = [
  "Đông",
  "Tây",
  "Nam",
  "Bắc",
  "Đông Bắc",
  "Tây Bắc",
  "Tây Nam",
  "Đông Nam",
];

const OtherInfo = ({ formData, setFormData }) => {
  const [document, setDocument] = useState("");
  const [interior, setInterior] = useState("");
  const [bedroom, setBedroom] = useState(0);
  const [bathroom, setBathroom] = useState(0);
  const [floor, setFloor] = useState(0);
  const [houseDirection, setHouseDirection] = useState("");
  const [balconyDirection, setBalconyDirection] = useState("");
  const [entrance, setEntrace] = useState("");
  const [frontage, setFrontage] = useState("");

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      other_info: {
        document,
        interior,
        bedroom,
        bathroom,
        floor,
        houseDirection,
        balconyDirection,
        entrance,
        frontage,
      },
    }));
  }, [
    document,
    interior,
    bedroom,
    bathroom,
    houseDirection,
    balconyDirection,
    entrance,
    frontage,
  ]);

  const handleKeyPress = (event) => {
    const charCode = event.charCode;

    // Allow numbers (0-9), decimal point (.), and backspace
    if (
      (charCode < 48 || charCode > 57) && // Not a number
      charCode !== 46 && // Not a decimal point
      charCode !== 8 // Not backspace
    ) {
      event.preventDefault();
    }

    // Prevent multiple decimal points
    if (event.key === "." && event.target.value.includes(".")) {
      event.preventDefault();
    }
  };

  return (
    <div className="w-full border p-4 rounded-xl my-5">
      <h1 className="font-semibold text-lg">
        Thông tin khác{" "}
        <span className="text-neutral-400 text-xs">(không bắt buộc)</span>
      </h1>
      <div className="mt-5">
        <label htmlFor="giay-to-phap-ly" className="text-sm font-semibold">
          Giấy tờ pháp lý
        </label>
        <select
          className="w-full border p-3 my-3 mb-5 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
          value={document}
          onChange={(e) => setDocument(e.target.value)}
          name="giay-to-phap-ly"
        >
          <option value="" disabled>
            Chọn giấy tờ pháp lý
          </option>
          <option value="Sổ đỏ / Sổ hồng">Sổ đỏ / Sổ hồng</option>
          <option value="Hợp đồng mua bán">Hợp đồng mua bán</option>
          <option value="Đang chờ sổ">Đang chờ sổ</option>
        </select>

        {formData.main_info.type !== "Đất" &&
          formData.main_info.type !== "Đất nền dự án" && (
            <>
              <label htmlFor="noi-that" className="text-sm font-semibold">
                Nội thất
              </label>
              <select
                className="w-full border p-3 my-3 mb-5 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
                value={interior}
                onChange={(e) => setInterior(e.target.value)}
                name="noi-that"
              >
                <option value="" disabled>
                  Chọn nội thất
                </option>
                <option value="Đầy đủ">Đầy đủ</option>
                <option value="Cơ bản">Cơ bản</option>
                <option value="Không nội thất">Không nội thất</option>
              </select>

              <div className="mb-4">
                {formData.main_info.type !== "Kho, nhà xưởng" && (
                  <div className="flex items-center justify-between">
                    <h1 className="text-sm font-semibold">Số phòng ngủ</h1>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setBedroom((prev) => prev - 1)}
                        disabled={bedroom === 0}
                      >
                        <MinusCircleIcon className="w-10 h-10" />
                      </button>
                      <p>{bedroom}</p>
                      <button onClick={() => setBedroom((prev) => prev + 1)}>
                        <PlusCircleIcon className="w-10 h-10" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <h1 className="text-sm font-semibold">
                    Số phòng tắm, vệ sinh
                  </h1>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setBathroom((prev) => prev - 1)}
                      disabled={bathroom === 0}
                    >
                      <MinusCircleIcon className="w-10 h-10" />
                    </button>
                    <p>{bathroom}</p>
                    <button onClick={() => setBathroom((prev) => prev + 1)}>
                      <PlusCircleIcon className="w-10 h-10" />
                    </button>
                  </div>
                </div>
                {(formData.main_info.type === "Nhà riêng" ||
                  formData.main_info.type === "Nhà biệt thự, liền kề" ||
                  formData.main_info.type === "Nhà mặt phố" ||
                  formData.main_info.type === "Shophouse, nhà phố thương mại" ||
                  formData.main_info.type === "Trang trại, khu nghỉ dưỡng") && (
                  <div className="flex items-center justify-between pt-4">
                    <h1 className="text-sm font-semibold">Số tầng</h1>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setFloor((prev) => prev - 1)}
                        disabled={floor === 0}
                      >
                        <MinusCircleIcon className="w-10 h-10" />
                      </button>
                      <p>{floor}</p>
                      <button onClick={() => setFloor((prev) => prev + 1)}>
                        <PlusCircleIcon className="w-10 h-10" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        <label htmlFor="huong-nha" className="text-sm font-semibold">
          Hướng nhà
        </label>
        <select
          className="w-full border p-3 my-3 mb-5 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
          value={houseDirection}
          onChange={(e) => setHouseDirection(e.target.value)}
          name="huong-nha"
        >
          <option value="" disabled>
            Chọn hướng nhà
          </option>
          {directions.map((direction, index) => (
            <option key={index} value={direction}>
              {direction}
            </option>
          ))}
        </select>

        {formData.main_info.type !== "Đất" &&
          formData.main_info.type !== "Đất nền dự án" &&
          formData.main_info.type !== "Kho, nhà xưởng" && (
            <>
              <label htmlFor="huong-ban-cong" className="text-sm font-semibold">
                Hướng ban công
              </label>
              <select
                className="w-full border p-3 my-3 mb-5 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
                value={balconyDirection}
                onChange={(e) => setBalconyDirection(e.target.value)}
                name="huong-ban-cong"
              >
                <option value="" disabled>
                  Chọn hướng ban công
                </option>
                {directions.map((direction, index) => (
                  <option key={index} value={direction}>
                    {direction}
                  </option>
                ))}
              </select>
            </>
          )}

        {(formData.main_info.type === "Nhà riêng" ||
          formData.main_info.type === "Nhà biệt thự, liền kề" ||
          formData.main_info.type === "Nhà mặt phố" ||
          formData.main_info.type === "Shophouse, nhà phố thương mại" ||
          formData.main_info.type === "Trang trại, khu nghỉ dưỡng" ||
          formData.main_info.type === "Kho, nhà xưởng" ||
          formData.main_info.type === "Đất nền dự án" ||
          formData.main_info.type === "Đất" ||
          formData.main_info.type === "Loại BĐS khác") && (
          <>
            <label className="font-semibold" htmlFor="title">
              Đường vào
            </label>
            <div className="relative">
              <input
                type="text"
                className=" w-full border p-3 my-3 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
                onKeyPress={handleKeyPress}
                placeholder="Nhập đường vào"
                maxLength={8}
                value={entrance}
                onChange={(e) => setEntrace(e.target.value)}
              />
              <span className="absolute right-5 top-1/2 transform -translate-y-1/2 p-1.5 text-xs bg-neutral-200 rounded-lg">
                m
              </span>
            </div>

            <label className=" font-semibold" htmlFor="title">
              Mặt tiền
            </label>
            <div className="relative">
              <input
                type="text"
                className=" w-full border p-3 my-3 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
                onKeyPress={handleKeyPress}
                placeholder="Nhập mặt tiền"
                maxLength={8}
                value={frontage}
                onChange={(e) => setFrontage(e.target.value)}
              />
              <span className="absolute right-5 top-1/2 transform -translate-y-1/2 p-1.5 text-xs bg-neutral-200 rounded-lg">
                m
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OtherInfo;
