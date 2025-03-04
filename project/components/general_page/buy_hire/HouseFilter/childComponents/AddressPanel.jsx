import React, { useState, useEffect } from "react";
import data from "@/public/local.json";
import Swal from "sweetalert2";
import useStore from "@/lib/zustand";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";

const AddressPanel = ({
  setSearchQuery,
  setStoredAddress,
  setIsAddressPanel,
}) => {
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);
  const [streetList, setStreetList] = useState([]);

  const [address, setAddress] = useState({
    district: "",
    ward: { name: "", prefix: "" },
    street: { name: "", prefix: "" },
    project: "",
  });

  const { g_setProvince, g_province } = useStore();

  //* Lấy danh sách quận/huyện khi chọn tỉnh/thành
  useEffect(() => {
    if (g_province) {
      const filteredList = data.filter((item) => item.name === g_province);
      setDistrictList(filteredList[0].districts);
    }
  }, [g_province]);

  //* Lấy danh sách phường/xã, đường/phố khi chọn quận/huyện
  useEffect(() => {
    const filteredList = districtList?.filter(
      (item) => item.name === address.district
    );

    if (filteredList) {
      setWardList(filteredList[0]?.wards);
      setStreetList(filteredList[0]?.streets);
    } else {
      return;
    }
  }, [address.district]);

  //* Xử lý chọn tỉnh/thành
  const handleProvinceChange = (event) => {
    let newProvince = event.target.value;
    if (g_province.trim() !== "") {
      Swal.fire({
        title: "Bạn có chắc muốn thay đổi?",
        text: "Việc chọn tỉnh/thành phố mới sẽ thay thế những lựa chọn trước đó.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Không",
      }).then((result) => {
        if (result.isConfirmed) {
          g_setProvince(newProvince);
        }
      });
    } else {
      console.log("Updating province without confirmation.");
      g_setProvince(newProvince);
    }
  };

  //* Áp dụng địa chỉ
  const handleApplyAddress = () => {
    let newAddress = {};

    if (g_province.trim() !== "") {
      newAddress = {
        province: g_province,
      };

      if (address.district.trim() !== "") {
        newAddress = {
          district:
            address.district.startsWith("Huyện") ||
            address.district.startsWith("Quận")
              ? address.district
              : `Quận ${address.district}`,
          province: g_province,
        };

        if (address.ward.name.trim() !== "") {
          newAddress = {
            ward: `${address.ward.prefix} ${address.ward.name}`,
            district:
              address.district.startsWith("Huyện") ||
              address.district.startsWith("Quận")
                ? address.district
                : `Quận ${address.district}`,
          };

          if (address.street.name.trim() !== "") {
            newAddress = {
              street: `${address.street.prefix} ${address.street.name}`,
              ward: `${address.ward.prefix} ${address.ward.name}`,
            };
          }
        }
      }

      setSearchQuery((prev) => {
        const updatedAddress = [...prev.address];

        // If this address is not already stored, add it
        if (updatedAddress.length > 0) {
          if (newAddress.district && newAddress.province) {
            const index = updatedAddress.findIndex(
              (item) => item.province === newAddress.province && !item.district
            );
            if (index !== -1) {
              updatedAddress[index] = newAddress;
            } else {
              updatedAddress.push(newAddress);
            }
          } else if (newAddress.ward && newAddress.district) {
            const index = updatedAddress.findIndex(
              (item) => item.district === newAddress.district && !item.strret
            );
            if (index !== -1) {
              updatedAddress[index] = newAddress;
            } else {
              updatedAddress.push(newAddress);
            }
          } else if (newAddress.street && newAddress.ward) {
            const index = updatedAddress.findIndex(
              (item) => item.ward === newAddress.ward && !item.street
            );
            if (index !== -1) {
              updatedAddress[index] = newAddress;
            } else {
              updatedAddress.push(newAddress);
            }
          }
        } else {
          updatedAddress.push(newAddress);
        }

        return {
          ...prev,
          address: updatedAddress,
        };
      });

      // Update the storedAddress for reference
      setStoredAddress((prev) => {
        // If this address is not already stored, add it
        if (
          !prev.some((item) => JSON.stringify(item) === JSON.stringify(address))
        ) {
          return [...prev, address];
        }
        return prev; // Do nothing if it's already stored
      });

      // Reset address state
      setAddress((prev) => ({
        ...prev,
        district: "",
        ward: { name: "", prefix: "" },
        street: { name: "", prefix: "" },
      }));
    }

    // Close the address panel
    setIsAddressPanel(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-5 border-b">
        <h1 className="font-semibold">Khu vực & Dự án</h1>
        <ArrowLeftIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => setIsAddressPanel(false)}
        />
      </div>

      <div className="w-full overflow-auto p-5">
        <label htmlFor="province">Chọn tỉnh/thành</label>
        <select
          onChange={handleProvinceChange}
          className="w-full rounded-lg my-3 p-2"
          id="province"
          value={g_province}
        >
          <option value="">Chọn tỉnh/thành</option>
          {data.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <label htmlFor="district">Chọn quận/huyện</label>
        <select
          onChange={(e) =>
            setAddress({
              ...address,
              district: e.target.value,
            })
          }
          className="w-full rounded-lg my-3 p-2"
          id="district"
          disabled={g_province.trim() === ""}
        >
          <option value="">Chọn quận/huyện</option>
          {districtList?.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>

        <label htmlFor="ward">Chọn phường/xã</label>
        <select
          onChange={(e) =>
            setAddress({
              ...address,
              ward: JSON.parse(e.target.value),
            })
          }
          className="w-full rounded-lg my-3 p-2"
          id="ward"
          disabled={address.district.trim() === ""}
        >
          <option value="">Chọn phường/xã</option>
          {wardList?.map((item, index) => (
            <option
              key={index}
              value={JSON.stringify({
                name: item.name,
                prefix: item.prefix,
              })}
            >
              {item.name}
            </option>
          ))}
        </select>

        <label htmlFor="street">Chọn đường/phố</label>
        <select
          onChange={(e) => {
            setAddress({
              ...address,
              street: JSON.parse(e.target.value),
            });
          }}
          className="w-full rounded-lg my-3 p-2"
          id="street"
          disabled={address.ward.name.trim() === ""}
        >
          <option value="">Chọn đường/phố</option>
          {streetList?.map((item, index) => (
            <option
              key={index}
              value={JSON.stringify({
                name: item.name,
                prefix: item.prefix,
              })}
            >
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-auto flex items-center justify-between gap-5 p-5">
        <button
          className="w-1/4 border rounded p-2"
          onClick={() => {
            g_setProvince("");
            setAddress({
              district: "",
              ward: { name: "", prefix: "" },
              street: { name: "", prefix: "" },
              project: "",
            });
          }}
        >
          Đặt lại
        </button>
        <button
          className="border p-2 rounded w-3/4 bg-red-600 text-white"
          onClick={handleApplyAddress}
        >
          Áp dụng
        </button>
      </div>
    </>
  );
};

export default AddressPanel;
