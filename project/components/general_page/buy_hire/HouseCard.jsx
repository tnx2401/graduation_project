import Diamond from "./CardRank.jsx/Diamond";
import Gold from "./CardRank.jsx/Gold";
import Silver from "./CardRank.jsx/Silver";
import Normal from "./CardRank.jsx/Normal";

const HouseCard = ({ cardData, path }) => {
  return (
    <div className="mt-5 w-full flex flex-col gap-5">
      {cardData.rank_name === "VIP Kim Cương" && (
        <Diamond cardData={cardData} path={path} />
      )}
      {cardData.rank_name === "VIP Vàng" && (
        <Gold cardData={cardData} path={path} />
      )}
      {cardData.rank_name === "VIP Bạc" && (
        <Silver cardData={cardData} path={path} />
      )}
      {cardData.rank_name === "Tin thường" && (
        <Normal cardData={cardData} path={path} />
      )}
    </div>
  );
};

export default HouseCard;
