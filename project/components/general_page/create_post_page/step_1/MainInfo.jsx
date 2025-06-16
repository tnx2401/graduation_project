import React, { useEffect, useState } from "react";

const sell_type = [
  "Căn hộ chung cư",
  "Chung cư mini, căn hộ dịch vụ",
  "Nhà riêng",
  "Nhà biệt thự, liền kề",
  "Nhà mặt phố",
  "Shophouse, nhà phố thương mại",
  "Đất nền dự án",
  "Đất",
  "Trang trại, khu nghỉ dưỡng",
  "Condotel",
  "Kho, nhà xưởng",
  "Loại BĐS khác",
];

const rent_type = [
  "Căn hộ chung cư",
  "Chung cư mini, căn hộ dịch vụ",
  "Nhà riêng",
  "Nhà biệt thự, liền kề",
  "Nhà mặt phố",
  "Shophouse, nhà phố thương mại",
  "Nhà trọ, phòng trọ",
  "Văn phòng",
  "Cửa hàng, ki ốt",
  "Kho, nhà xưởng, đất",
  "Loại BĐS khác",
];

const MainInfo = ({
  formData,
  setFormData,
  areaError,
  priceError,
  typeError,
}) => {
  const [bdsType, setBDSType] = useState("");
  const [unit, setUnit] = useState("VND");
  const [rawPrice, setRawPrice] = useState("");
  const [price, setPrice] = useState("");
  const [placeholderPrice, setPlaceholderPrice] = useState("");
  const [area, setArea] = useState("");

  const [calculate, setCalculate] = useState("");

  const handleKeyPress = (event) => {
    const charCode = event.charCode;
    // Allow digits (48–57) and dot (46)
    if ((charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
    }
  };

  const handlePrice = (price) => {
    const cleanedPrice = price.replace(/[^\d]/g, "");

    if (cleanedPrice.length > 19) return;

    const formattedValue = Number(cleanedPrice).toLocaleString("de-DE"); // Using "de-DE" because it uses the period for thousand separators
    setRawPrice(cleanedPrice);
    setPrice(formattedValue);
    if (cleanedPrice < 1000) {
      setPlaceholderPrice("");
    } else if (cleanedPrice >= 1000 && cleanedPrice < 1000000) {
      setPlaceholderPrice((cleanedPrice / 1000).toFixed(2) + " nghìn");
    } else if (cleanedPrice >= 1000000 && cleanedPrice < 1000000000) {
      setPlaceholderPrice((cleanedPrice / 1000000).toFixed(2) + " triệu");
    } else if (cleanedPrice >= 1000000000) {
      setPlaceholderPrice((cleanedPrice / 1000000000).toFixed(2) + " tỷ");
    }
  };

  const handleTotal = () => {
    const total = rawPrice * area;
    const totalFormatted = Number(total).toLocaleString("de-DE");
    if (total < 1000) {
      return totalFormatted + " VND";
    } else if (total >= 1000 && total < 1000000) {
      return (total / 1000).toFixed(2) + " nghìn";
    } else if (total >= 1000000 && total < 1000000000) {
      return (total / 1000000).toFixed(2) + " triệu";
    } else if (total >= 1000000000) {
      return (total / 1000000000).toFixed(2) + " tỷ";
    }
  };

  useEffect(() => {
    if (
      rawPrice !== "" &&
      area !== "" &&
      !isNaN(rawPrice) &&
      !isNaN(area) &&
      area > 0
    ) {
      // Remove periods for calculations
      const cleanedPrice = rawPrice.replace(/\./g, "");
      let pricePerM2;

      // Price per square meter based on the range
      if (cleanedPrice >= 10000000000) {
        pricePerM2 = (cleanedPrice / 1000000000 / area).toFixed(2) + " tỷ/m²";
      } else if (cleanedPrice >= 1000000000 && cleanedPrice < 10000000000) {
        pricePerM2 = (cleanedPrice / 1000000 / area).toFixed(2) + " triệu/m²";
      } else if (cleanedPrice >= 10000000) {
        pricePerM2 = (cleanedPrice / 1000000 / area).toFixed(2) + " triệu/m²";
      } else if (cleanedPrice >= 1000000 && cleanedPrice < 10000000) {
        pricePerM2 = (cleanedPrice / 1000 / area).toFixed(2) + " nghìn/m²";
      } else if (cleanedPrice >= 1000) {
        pricePerM2 = (cleanedPrice / 1000 / area).toFixed(2) + " nghìn/m²";
      }
      setCalculate(pricePerM2);
    }
  }, [rawPrice, area]);

  useEffect(() => {
    setFormData({
      ...formData,
      main_info: {
        type: bdsType,
        area: unit === "agreement" ? area : area,
        price: unit === "agreement" ? 0 : rawPrice,
        unit: unit,
      },
    });
  }, [bdsType, price, area, unit]);

  return (
    <div className="w-full border p-4 rounded-xl my-5">
      <h1 className="font-semibold text-lg">Thông tin chính</h1>
      <div className=" mt-4 w-full relative">
        <label className="text-sm font-semibold" htmlFor="type">
          Loại BĐS
        </label>
        <select
          className="w-full border p-3 my-3 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
          name="type"
          id="type"
          onChange={(e) => setBDSType(e.target.value)}
        >
          <option value="">Chọn loại BĐS</option>
          {formData.demand === "Bán" && (
            <>
              {sell_type.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </>
          )}
          {formData.demand === "Cho thuê" && (
            <>
              {rent_type.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </>
          )}
        </select>

        <label className="text-sm font-semibold" htmlFor="area">
          Diện tích
        </label>
        <div className="relative">
          <input
            type="text"
            className=" w-full border p-3 my-3 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
            onKeyPress={handleKeyPress}
            placeholder="Nhập diện tích"
            maxLength={8}
            onChange={(e) => setArea(e.target.value)}
            name="area"
            id="area"
          />
          <span className="absolute right-5 top-1/2 transform -translate-y-1/2 p-1.5 text-xs bg-neutral-200 rounded-lg">
            m²
          </span>
        </div>
        <div className="flex gap-3">
          <div className="w-2/3">
            <label className="text-sm font-semibold" htmlFor="price">
              Mức giá
            </label>
            <input
              type="text"
              className={`w-full border p-3 my-3 rounded-3xl ${
                unit === "agreement" ? "bg-slate-100 cursor-not-allowed" : ""
              } border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300`}
              onKeyPress={handleKeyPress}
              onChange={(e) => handlePrice(e.target.value)}
              placeholder="Nhập giá"
              maxLength={unit === "VND" ? 19 : 15}
              value={unit === "agreement" ? " " : price}
              disabled={unit === "agreement"}
              name="price"
              id="price"
            />
            <div className="flex gap-2">
              {priceError && (
                <p className="text-red-600 text-xs">- {priceError}</p>
              )}
              {areaError && (
                <p className="text-red-600 text-xs">- {areaError}</p>
              )}
              {typeError && (
                <p className="text-red-600 text-xs">- {typeError}</p>
              )}
            </div>
          </div>
          <div className="w-1/3">
            <label className="text-sm font-semibold" htmlFor="unit">
              Đơn vị
            </label>
            <select
              className=" w-full border p-3 my-3 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
              onChange={(e) => setUnit(e.target.value)}
              name="unit"
              id="unit"
            >
              <option value="VND">VND</option>
              <option value="priceoversquare">Giá / m²</option>
              <option value="agreement">Thỏa thuận</option>
            </select>
          </div>
        </div>

        {price !== "" && unit === "VND" && (
          <p className="text-sm">
            Tổng trị giá <span className="font-bold">{placeholderPrice}</span>{" "}
            (~
            {calculate})
          </p>
        )}

        {price !== "" && unit === "priceoversquare" && (
          <p className="text-sm">
            Giá <span className="font-bold">{placeholderPrice}/m²</span> (Tổng
            trị giá ~{handleTotal()})
          </p>
        )}
      </div>
    </div>
  );
};

export default MainInfo;
