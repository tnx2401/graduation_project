import React, { useEffect, useState } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const SideBar = ({ setOpenSidebar, navItems, setOpenModal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [choosenNavItem, setChoosenNavItem] = useState(null);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[45] w-screen h-screen bg-black/50"
      onClick={() => setOpenSidebar(false)}
    >
      <div
        className={`absolute top-0 left-0 pt-24 transform transition-all duration-300 ease-out h-full flex flex-col items-start bg-white ${
          isOpen ? "w-72" : "w-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="p-3 border-2 w-10/12 m-5 rounded-md"
          onClick={() => setOpenModal("login")}
        >
          Đăng nhập
        </button>
        <Link href={"/nguoi-dung/dang-tin"} className="p-3 border-2 w-10/12 m-5 rounded-md bg-red-600 text-white text-center">
          Đăng tin
        </Link>

        {navItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-between w-full p-3 ${
              choosenNavItem === item.name &&
              "border-l-2 border-orange-500 bg-neutral-200"
            }`}
          >
            <h1>{item.name}</h1>
            <div
              className="cursor-pointer"
              onClick={() =>
                setChoosenNavItem((prev) =>
                  prev === item.name ? null : item.name
                )
              }
            >
              {item.name === choosenNavItem ? (
                <ChevronRightIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
