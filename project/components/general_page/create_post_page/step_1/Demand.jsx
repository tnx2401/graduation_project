import React from "react";
import { TagIcon, KeyIcon } from "@heroicons/react/24/outline";

const Demand = ({ formData, setFormData }) => {
  return (
    <div className="w-full border p-4 rounded-xl">
      <h1 className="font-semibold text-xl">Nhu cầu</h1>
      <div className="flex py-2 gap-4">
        <button
          className={`w-1/2 text-left border ${
            formData.demand === "Bán" ? "border-black" : ""
          } p-3 py-5 rounded-xl`}
          onClick={() => setFormData({ ...formData, demand: "Bán" })}
        >
          <TagIcon className="w-6 h-6 " />
          Bán
        </button>
        <button
          className={`w-1/2 text-left border ${
            formData.demand === "Cho thuê" ? "border-black" : ""
          } p-3 py-5 rounded-xl`}
          onClick={() => setFormData({ ...formData, demand: "Cho thuê" })}
        >
          <KeyIcon className="w-6 h-6" />
          Cho thuê
        </button>
      </div>
    </div>
  );
};

export default Demand;
