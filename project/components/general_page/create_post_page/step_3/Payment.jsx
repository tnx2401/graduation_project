import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import {
  ChevronRightIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import useStore from "@/lib/zustand";

const timeSlots = [
  "00:00 ➝ 00:30",
  "00:30 ➝ 01:00",
  "01:00 ➝ 01:30",
  "01:30 ➝ 02:00",
  "02:00 ➝ 02:30",
  "02:30 ➝ 03:00",
  "03:00 ➝ 03:30",
  "03:30 ➝ 04:00",
  "04:00 ➝ 04:30",
  "04:30 ➝ 05:00",
  "05:00 ➝ 05:30",
  "05:30 ➝ 06:00",
  "06:00 ➝ 06:30",
  "06:30 ➝ 07:00",
  "07:00 ➝ 07:30",
  "07:30 ➝ 08:00",
  "08:00 ➝ 08:30",
  "08:30 ➝ 09:00",
  "09:00 ➝ 09:30",
  "09:30 ➝ 10:00",
  "10:00 ➝ 10:30",
  "10:30 ➝ 11:00",
  "11:00 ➝ 11:30",
  "11:30 ➝ 12:00",
  "12:00 ➝ 12:30",
  "12:30 ➝ 13:00",
  "13:00 ➝ 13:30",
  "13:30 ➝ 14:00",
  "14:00 ➝ 14:30",
  "14:30 ➝ 15:00",
  "15:00 ➝ 15:30",
  "15:30 ➝ 16:00",
  "16:00 ➝ 16:30",
  "16:30 ➝ 17:00",
  "17:00 ➝ 17:30",
  "17:30 ➝ 18:00",
  "18:00 ➝ 18:30",
  "18:30 ➝ 19:00",
  "19:00 ➝ 19:30",
  "19:30 ➝ 20:00",
  "20:00 ➝ 20:30",
  "20:30 ➝ 21:00",
  "21:00 ➝ 21:30",
  "21:30 ➝ 22:00",
  "22:00 ➝ 22:30",
  "22:30 ➝ 23:00",
  "23:00 ➝ 23:30",
  "23:30 ➝ 24:00",
];

const Payment = ({ formData, setFormData }) => {
  const [postRank, setPostRank] = useState([]);
  const [selectedRank, setSelectedRank] = useState({});
  const [selectedOption, setSelectedOption] = useState({});
  const [startDate, setStartDate] = useState(new Date());
  const [postTime, setPostTime] = useState("Đăng ngay bây giờ");
  const [isSelectDiscount, setIsSelectDiscount] = useState(false);
  const [discountInfo, setDiscountInfo] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const { uid } = useStore();

  const handleEndDate = () => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + parseInt(selectedOption.days));

    return `${endDate.getDate().toString().padStart(2, "0")}/${(
      endDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${endDate.getFullYear()}`;
  };

  useEffect(() => {
    setFormData({
      ...formData,
      payment: {
        rank: selectedRank.name,
        startDate: startDate.toISOString(),
        postTime: postTime,
        duration: selectedOption.days,
        moneyperday: selectedOption.price_per_day,
        total: selectedOption.total_price,
      },
    });
  }, [selectedRank, selectedOption, postTime, startDate]);

  useEffect(() => {
    axios(`/api/handle_posts/getPostRanks`)
      .then((res) => {
        setPostRank(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

    axios
      .post(`/api/users/getUserInformation`, {
        uid: uid,
      })
      .then((res) => {
        console.log(res.data);
        setDiscountInfo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (postRank && postRank.length > 0) {
      setSelectedRank(postRank[2]);
    }
  }, [postRank]);

  useEffect(() => {
    if (
      selectedRank &&
      Array.isArray(selectedRank.prices) &&
      selectedRank.prices.length > 0
    ) {
      setSelectedOption(selectedRank.prices[0]); // Only set if prices exist
    }
  }, [selectedRank]);

  const handleSelectDiscount = () => {
    setIsSelectDiscount(!isSelectDiscount);
  };

  const rankOrder = [
    "freeGoldPosts",
    "freeSilverPosts",
    "freeNormalPosts",
    "freePushPosts",
  ];

  const sortedBenefits = discountInfo[0]?.benefit_usage
    ?.slice()
    .sort(
      (a, b) =>
        rankOrder.indexOf(a.benefit_type) - rankOrder.indexOf(b.benefit_type)
    );

  const getPostRankName = (postRankName) => {
    if (postRankName === "freeGoldPosts") {
      return "Miễn phí tin hạng VIP Vàng";
    } else if (postRankName === "freeSilverPosts") {
      return "Miễn phí tin hạng VIP Bạc";
    } else if (postRankName === "freeNormalPosts") {
      return "Miễn phí tin thường";
    } else {
      return;
    }
  };

  const handleApplyDiscount = () => {
    let requireDuration;
    const discountRankName = getPostRankName(selectedDiscount);

    if (selectedDiscount === "freeNormalPosts") {
      requireDuration = 10;
    } else {
      requireDuration = 7;
    }

    if (
      discountRankName
        .toLowerCase()
        .includes(selectedRank.name.toLowerCase()) &&
      selectedOption.days === requireDuration
    ) {
      setIsSelectDiscount(false);
      setFormData({
        ...formData,
        payment: {
          ...formData.payment,
          total: 0,
        },
        discount: selectedDiscount,
      });
    } else {
      setDiscountMessage(`Không thỏa mãn điều kiện áp dụng khuyến mãi`);
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full">
      <h1 className="font-semibold">Chọn loại tin</h1>
      <p className="text-xs mt-2 font-light">
        💡 Vị trí hiển thị càng cao, tỉ lệ chuyển đổi từ click thành liên hệ
        càng lớn
      </p>
      <div className="grid grid-cols-4 gap-3 mt-2">
        {postRank.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-3 border cursor-pointer ${
              selectedRank?.name === item.name ? "border-black border-2" : ""
            }`}
            onClick={() => setSelectedRank(item)}
          >
            <div dangerouslySetInnerHTML={{ __html: item.image }}></div>
            <h1 className="font-semibold">{item.name}</h1>
            <p className="text-xs">{item.description}</p>
            <p className="text-xs mt-5">{item.base_price} đ/ngày</p>
          </div>
        ))}
      </div>

      <div className="p-5 bg-gray-100 mt-5 rounded-2xl">
        <p className="text-xs mb-3">Đăng dài ngày hơn, tiết kiệm hơn!</p>
        <div className="grid grid-cols-3 gap-3">
          {selectedRank.prices?.map((item, index) => (
            <div
              key={index}
              className={`bg-white p-4 rounded-xl border ${
                selectedOption?.days === item.days
                  ? "border-black border-2"
                  : "border-gray-400/80"
              } border cursor-pointer flex items-center justify-between`}
              onClick={() => setSelectedOption(item)}
            >
              <div>
                <h1 className="font-semibold">{item.days} ngày</h1>
                <p>{item.price_per_day} đ/ngày</p>
              </div>

              <input
                type="radio"
                checked={selectedOption?.days === item.days}
                readOnly
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex mt-5 gap-2">
        <div className="w-1/2 flex flex-col">
          <label htmlFor="ngay-bat-dau" className="text-sm font-bold">
            Ngày bắt đầu
          </label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            className="rounded-full border border-gray-300 w-full mt-3 py-3"
            name="ngay-bat-dau"
          />
          <p className="text-xs py-2">Kết thúc ngày {handleEndDate()}</p>
        </div>
        <div className="w-1/2 flex flex-col">
          <label htmlFor="hen-gio" className="text-sm font-bold">
            Hẹn giờ đăng tin
          </label>
          <select
            className="rounded-full border border-gray-300 w-full mt-3 py-3"
            onChange={(e) => setPostTime(e.target.value)}
            name="hen-gio"
          >
            <option value="now">Đăng ngay bây giờ</option>
            {timeSlots.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="mt-5 flex border rounded-xl p-3 bg-gray-50 cursor-pointer"
        onClick={handleSelectDiscount}
      >
        <h1 className="flex items-center gap-3">
          <SparklesIcon className="w-5 h-5" />
          {formData.discount ? (
            <div className="flex items-center gap-1">
              {getPostRankName(selectedDiscount)}
              <span className="text-xs text-gray-400">(Đã áp dụng)</span>
            </div>
          ) : (
            "Chọn khuyến mãi"
          )}
        </h1>
        <ChevronRightIcon className="w-5 h-5 ml-auto" />
      </div>

      {isSelectDiscount && (
        <div className="absolute top-0 left-0 bg-black/50 w-full h-screen z-50">
          <div className="flex flex-col absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-1/2 shadow bg-white rounded-xl">
            <div className="flex items-center justify-between gap-52 mb-6  p-5 border-b shadow-sm">
              <h1 className="font-semibold">Chọn khuyến mãi</h1>
              <button
                onClick={() => {
                  setIsSelectDiscount(false);
                  setDiscountMessage("");
                }}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            {!sortedBenefits && (
              <div className="flex flex-col items-center h-full">
                <p className="text-gray-500">Không có khuyến mãi nào...</p>
              </div>
            )}
            {sortedBenefits
              ?.filter(
                (item) =>
                  [
                    "freeGoldPosts",
                    "freeSilverPosts",
                    "freeNormalPosts",
                  ].includes(item.benefit_type) && item.remaining_quantity > 0
              )
              .map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between rounded-xl p-3 mx-5 my-2 cursor-pointer hover:bg-gray-100 ${
                    item.benefit_type === selectedDiscount
                      ? "border-black border bg-gray-100"
                      : "border border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedDiscount(item.benefit_type);
                    setDiscountMessage("");
                  }}
                >
                  <div>
                    <h1 className="font-semibold">
                      {getPostRankName(item.benefit_type)}
                    </h1>
                    <p className="text-xs">
                      Áp dụng với tin đăng trong{" "}
                      <span>
                        {getPostRankName(item.benefit_type)
                          .toLowerCase()
                          .includes("tin thường")
                          ? "7 ngày"
                          : "10 ngày"}
                      </span>
                    </p>
                  </div>
                  <p className="">
                    SL:{" "}
                    <span className="font-semibold">
                      {item.remaining_quantity}
                    </span>
                  </p>
                </div>
              ))}
            {selectedDiscount && (
              <div className="mt-auto flex flex-col">
                <p className="px-5 text-red-500 text-xs text-center">
                  {discountMessage}
                </p>
                <div className="ml-auto">
                  {formData.discount && (
                    <button>
                      <p
                        className="p-3 px-6 rounded-lg m-3 text-white bg-gray-300"
                        onClick={() => {
                          setSelectedDiscount("");
                          setDiscountMessage("");
                          setFormData({
                            ...formData,
                            payment: {
                              ...formData.payment,
                              total: selectedOption.total_price,
                            },
                            discount: null,
                          });
                          setIsSelectDiscount(false);
                        }}
                      >
                        Hủy khuyến mãi
                      </p>
                    </button>
                  )}
                  <button
                    className="p-3 px-6 rounded-lg m-3 text-white bg-red-500"
                    onClick={handleApplyDiscount}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
