"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Swal from "sweetalert2";

import SearchBox from "../map/SearchBox";
const MapComponent = dynamic(() => import("../map/MapComponent"), {
  ssr: false,
});

const Step3 = ({ generalInfo, setGeneralInfo, setStep }) => {
  const [position, setPosition] = useState([21.0285, 105.8542]);
  const [hasPinned, setHasPinned] = useState(false);
  const [pinnedPosition, setPinnedPosition] = useState(null);

  useEffect(() => {
    setGeneralInfo({ ...generalInfo, locationOnMap: pinnedPosition });
  }, [pinnedPosition]);

  const handleCreateProject = () => {
    axios
      .post(`/api/users/enterprise/projects/handleCreateProject`, {
        generalInfo,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Tạo dự án thành công!",
          text: "Dự án của bạn đã được thêm.",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        }).then(() => {
          // Reload the page when the user clicks OK
          window.location.reload();
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Có lỗi xảy ra khi tạo dự án.",
          confirmButtonColor: "#d33",
          confirmButtonText: "Thử lại",
        });
      });
  };

  return (
    <div>
      <SearchBox
        onSelectLocation={(pos) => {
          setPosition(pos);
          setHasPinned(false);
        }}
      />
      <MapComponent
        position={position}
        setPosition={setPosition}
        setHasPinned={setHasPinned}
        setPinnedPosition={setPinnedPosition}
      />
      {hasPinned && (
        <div className="flex items-center justify-between mt-5">
          <p>
            {hasPinned
              ? "📍 Bạn đông ý chọn địa điểm này chứ."
              : "🗺️ Chọn địa điểm của dự án trên bản đồ."}
          </p>
          <button
            className=" rounded-lg bg-red-500 text-white p-2 px-4"
            // onClick={() => setStep(4)}
            onClick={handleCreateProject}
          >
            Hoàn tất thiết lập
          </button>
        </div>
      )}
    </div>
  );
};

export default Step3;
