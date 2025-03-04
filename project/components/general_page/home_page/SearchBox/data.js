import { BsHouses } from "react-icons/bs";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { AiOutlineHome } from "react-icons/ai";
import {
  PiMapPinSimpleArea,
  PiBuildingsLight,
  PiOfficeChair,
  PiFactory,
  PiCity,
} from "react-icons/pi";
import { MdOutlineHouseboat, MdOutlineWarehouse } from "react-icons/md";
import { LuWarehouse, LuHousePlus } from "react-icons/lu";
import { TiHomeOutline } from "react-icons/ti";
import {
  TbBedFilled,
  TbBuildingEstate,
  TbBuildings,
  TbBuildingWarehouse,
} from "react-icons/tb";
import { CiShop } from "react-icons/ci";
import { LiaStoreAltSolid } from "react-icons/lia";

const options = [
  {
    optionFor: "Nhà đất bán",
    content: [
      {
        name: "Loại nhà đất",
        option: [
          { optionName: "Tất cả nhà đất", icon: <BsHouses /> },
          {
            optionName: "Căn hộ chung cư",
            icon: <HiOutlineBuildingOffice2 />,
            subOption: ["Chung cư mini, căn hộ dịch vụ"],
          },
          {
            optionName: "Các loại nhà bán",
            icon: <AiOutlineHome />,
            subOption: [
              "Nhà riêng",
              "Nhà biệt thự, liền kề",
              "Nhà mặt phố",
              "Shop house, nhà phố thương mại",
            ],
          },
          {
            optionName: "Các loại đất bán",
            icon: <PiMapPinSimpleArea />,
            subOption: ["Đất nền dự án", "Bán đất"],
          },
          {
            optionName: "Trang trại, khu nghỉ dưỡng",
            icon: <MdOutlineHouseboat />,
            subOption: ["Condotel"],
          },
          {
            optionName: "Kho,nhà xưởng",
            icon: <LuWarehouse />,
          },
          {
            optionName: "Bất động sản khác",
            icon: <LuHousePlus />,
          },
        ],
      },
      {
        name: "Mức giá",
        option: [
          "Tất cả mức giá",
          "Dưới 500 triệu",
          "500 - 800 triệu",
          "800 triệu - 1 tỷ",
          "1 - 2 tỷ",
          "2 - 3 tỷ",
          "3 - 5 tỷ",
          "5 - 7 tỷ",
          "7 - 10 tỷ",
          "10 - 20 tỷ",
          "20 - 30 tỷ",
          "30 - 40 tỷ",
          "40 - 60 tỷ",
          "Trên 60 tỷ",
          "Thỏa thuận",
        ],
      },
      {
        name: "Diện tích",
        option: [
          "Tất cả diện tích",
          "Dưới 30m²",
          "30m² - 50m²",
          "50m² - 80m²",
          "80m² - 100m²",
          "100m² - 150m²",
          "150m² - 200m²",
          "200m² - 250m²",
          "250m² - 300m²",
          "300m² - 500m²",
          "Trên 500m²",
        ],
      },
    ],
  },
  {
    optionFor: "Nhà đất cho thuê",
    content: [
      {
        name: "Loại nhà đất",
        option: [
          { optionName: "Tất cả nhà đất", icon: <HiOutlineBuildingOffice2 /> },
          {
            optionName: "Căn hộ chung cư",
            icon: <HiOutlineBuildingOffice2 />,
            subOption: ["Chung cư mini, căn hộ dịch vụ"],
          },
          { optionName: "Nhà riêng", icon: <TiHomeOutline /> },
          { optionName: "Nhà biệt thự, liền kề", icon: <PiBuildingsLight /> },
          { optionName: "Nhà mặt phố", icon: <MdOutlineWarehouse /> },
          { optionName: "Nhà trọ, phòng trọ", icon: <TbBedFilled /> },
          { optionName: "Shop house, nhà phố thương mại", icon: <CiShop /> },
          { optionName: "Văn phòng", icon: <PiOfficeChair /> },
          { optionName: "Cửa hàng, ki ốt", icon: <LiaStoreAltSolid /> },
          { optionName: "Kho, nhà xưởng, đất", icon: <TbBuildingWarehouse /> },
          { optionName: "Bất động sản khác", icon: <LuHousePlus /> },
        ],
      },
      {
        name: "Mức giá",
        option: [
          "Tất cả mức giá",
          "Dưới 1 triệu",
          "1 - 3 triệu",
          "3 - 5 triệu",
          "5 - 10 triệu",
          "10 - 40 triệu",
          "40 - 70 triệu",
          "70 - 100 triệu",
          "Trên 100 triệu",
          "Thỏa thuận",
        ],
      },
      {
        name: "Diện tích",
        option: [
          "Tất cả diện tích",
          "Dưới 30m²",
          "30m² - 50m²",
          "50m² - 80m²",
          "80m² - 100m²",
          "100m² - 150m²",
          "150m² - 200m²",
          "200m² - 250m²",
          "250m² - 300m²",
          "300m² - 500m²",
          "Trên 500m²",
        ],
      },
    ],
  },
  {
    optionFor: "Dự án",
    content: [
      {
        name: "Loại hình dự án",
        option: [
          { optionName: "Tất cả nhà đất", icon: <HiOutlineBuildingOffice2 /> },
          {
            optionName: "Căn hộ chung cư",
            icon: <HiOutlineBuildingOffice2 />,
            subOption: ["Chung cư mini, căn hộ dịch vụ"],
          },
          { optionName: "Cao ốc văn phòng", icon: <PiOfficeChair /> },
          { optionName: "Trung tâm thương mại", icon: <TbBuildings /> },
          { optionName: "Khu đô thị mới", icon: <TbBuildingEstate /> },
          { optionName: "Khu phức hợp", icon: <PiCity /> },
          { optionName: "Nhà ở xã hội", icon: <TiHomeOutline /> },
          {
            optionName: "Khu nghỉ dưỡng, sinh thái",
            icon: <MdOutlineHouseboat />,
          },
          { optionName: "Khu công nghiệp", icon: <PiFactory /> },
          { optionName: "Nhà biệt thự, liền kề", icon: <PiBuildingsLight /> },
          { optionName: "Shop house", icon: <CiShop /> },
          { optionName: "Nhà mặt phố", icon: <MdOutlineWarehouse /> },
          { optionName: "Dự án khác", icon: <LuHousePlus /> },
        ],
      },
      {
        name: "Mức giá",
        option: [
          "Dưới 5 triệu/m²",
          "5 - 10 triệu/m²",
          "10 - 20 triệu/m²",
          "20 - 35 triệu/m²",
          "35 - 50 triệu/m²",
          "50 - 80 triệu/m²",
          "Trên 80 triệu/m²",
        ],
      },
      {
        name: "Trạng thái",
        option: ["Sắp mở bán", "Đang mở bán", "Đã bàn giao"],
      },
    ],
  },
];

export default options;
