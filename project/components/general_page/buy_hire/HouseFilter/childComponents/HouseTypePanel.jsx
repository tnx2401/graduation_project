import React, { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import useStore from "@/lib/zustand";

const HouseTypePanel = ({ searchQuery, setSearchQuery, setIsTypePanel }) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const { g_houseType } = useStore();

  //* Xử lý trạng thái check của checkbox cha
  const handleParentChecked = (name, children = []) => {
    setCheckedItems((prev) => {
      const isParentChecked = prev[name] || false;
      const updatedItems = { ...prev };

      updatedItems[name] = !isParentChecked;

      children.forEach((child) => {
        updatedItems[child] = !isParentChecked;
      });

      console.log("Name: ", name);
      return updatedItems;
    });
  };

  //* Xử lý trạng thái check của checkbox con
  const handleChildChecked = (childName, parentName, siblings = []) => {
    setCheckedItems((prev) => {
      const updatedItems = { ...prev };

      updatedItems[childName] = !prev[childName];

      const areAllSiblingsChecked =
        siblings.length > 0 &&
        siblings.every((sibling) => updatedItems[sibling]);

      updatedItems[parentName] = areAllSiblingsChecked;

      return updatedItems;
    });
  };

  //* Áp dụng loại BĐS
  const handleApplyType = () => {
    let newType = [];
    for (const key in checkedItems) {
      if (checkedItems[key]) {
        newType.push(key);
      }
    }
    setSearchQuery({ ...searchQuery, type: newType });
    setIsTypePanel(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-5 border-b">
        <h1 className="font-semibold">Loại nhà đất</h1>
        <ArrowLeftIcon
          className="w-5 h-5 cursor-pointer"
          onClick={() => setIsTypePanel(false)}
        />
      </div>

      <div className="w-full overflow-auto">
        {g_houseType?.content[0].option.map((item, index) => (
          <div key={index} className="py-2 px-2">
            <div className="flex items-center justify-between hover:bg-neutral-200 px-2 py-1 rounded">
              <div className="flex items-center gap-2">
                {item.icon}
                <h1 className="">{item.optionName}</h1>
              </div>
              <input
                type="checkbox"
                className="rounded focus:outline-none cursor-pointer"
                checked={checkedItems[item.optionName || item] || false}
                onChange={() =>
                  handleParentChecked(item.optionName || item, item.subOption)
                }
              />
            </div>
            {item.subOption?.map((subItem, subIndex) => (
              <div
                key={subIndex}
                className="flex items-center justify-between text-neutral-600 py-1 hover:bg-neutral-200 p-2 rounded"
              >
                <h2>{subItem}</h2>
                <input
                  type="checkbox"
                  className="rounded cursor-pointer focus:outline-none"
                  checked={checkedItems[subItem] || false}
                  onChange={() =>
                    handleChildChecked(
                      subItem,
                      item.optionName || item,
                      item.subOption
                    )
                  }
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-5 p-5">
        <button
          className="w-1/4 border rounded p-2"
          onClick={() => setCheckedItems([])}
        >
          Đặt lại
        </button>
        <button
          className="border p-2 rounded w-3/4 bg-red-600 text-white"
          onClick={handleApplyType}
        >
          Áp dụng
        </button>
      </div>
    </>
  );
};

export default HouseTypePanel;
