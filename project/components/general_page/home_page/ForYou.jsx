import { ChevronDownIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const AdvertisingCard = dynamic(() => import("@/components/general_page/shared/AdvertisingCard"));

const forYouData = [
  {
    title:
      "Dộc quyền quỹ căn chủ nhà gửi bán giá rẻ nhất tại Vinhome Oceanpark 2",
    price: 8.8,
    area: 91,
    location: "Văn Giang, Hưng Yên",
    create_date: "Thời gian đăng",
  },
  {
    title:
      "Biệt thự song lập 2 mặt tiền, 170m2, sát TTTM Vincom, VIP nhất Vinhomes Ocean Park 2",
    price: 14.3,
    area: 84,
    location: "Văn Giang, Hưng Yên",
    create_date: "Thời gian đăng",
  },
  {
    title: "Bán nhanh trước tết căn 65m2 Oceanpark",
    price: 35,
    area: 170,
    location: "Văn Giang, Hưng Yên",
    create_date: "Thời gian đăng",
  },
  {
    title:
      "GĐ Cần tiền bán góc Kinh Đô view công viên mua 2022 giá 50 tỷ giờ bán lại 37 tỷ. 170m2 đất VIP nhất",
    price: 8.8,
    area: 91,
    location: "Văn Giang, Hưng Yên",
    create_date: "Thời gian đăng",
  },
  {
    title: "Bán gấp căn Sao Biển 55m2 hoàn thiện 5 tầng",
    price: 8.8,
    area: 91,
    location: "Văn Giang, Hưng Yên",
    create_date: "Thời gian đăng",
  },
];

const ForYou = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl pt-5">Bất động sản dành cho bạn</h1>

      <div className="grid grid-cols-4 gap-10">
        <Suspense fallback={<div>Loading...</div>}>
          {forYouData.map((item, index) => (
            <AdvertisingCard
              key={index}
              title={item.title}
              image={"https://placehold.co/399x200/png"}
              price={item.price}
              area={item.area}
              location={item.location}
              created_date={item.create_date}
            />
          ))}
        </Suspense>
      </div>

      <button className="flex items-center border py-2 px-10 gap-2 mx-auto rounded bg-white border-neutral-500">
        Mở rộng{" "}
        <span>
          <ChevronDownIcon className="w-4 h-4" />
        </span>
      </button>
    </div>
  );
};

export default React.memo(ForYou);
