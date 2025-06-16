"use client";
import dynamic from "next/dynamic";

const Diamond = dynamic(() => import("./CardRank/Diamond"), { ssr: false });
const Gold = dynamic(() => import("./CardRank/Gold"), { ssr: false });
const Silver = dynamic(() => import("./CardRank/Silver"), { ssr: false });
const Normal = dynamic(() => import("./CardRank/Normal"), { ssr: false });

const RANK_COMPONENTS = {
  "VIP Kim Cương": Diamond,
  "VIP Vàng": Gold,
  "VIP Bạc": Silver,
  "Tin thường": Normal,
};

const HouseCard = ({ cardData, path, hasUid }) => {
  const RankComponent = RANK_COMPONENTS[cardData.rank_name];
  return (
    <div className="mt-5 w-full flex flex-col gap-5">
      {RankComponent && (
        <RankComponent cardData={cardData} path={path} hasUid={hasUid} />
      )}
    </div>
  );
};

export default HouseCard;
