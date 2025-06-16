import React, { useState } from "react";

const ReportOverlay = ({ reports, onClose }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!reports || reports.length === 0) return null;

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg w-[90%] max-w-3xl p-6 overflow-y-auto max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-4">
          Danh sách báo cáo ({reports.length})
        </h2>

        <div className="space-y-3">
          {reports.map((report, index) => (
            <div
              key={index}
              className="border p-3 rounded-md bg-gray-50 text-sm"
            >
              <p>
                <strong>Lý do:</strong> {report.reasons}
              </p>
              <p>
                <strong>Khác:</strong> {report.other_report}
              </p>

              <button
                className="mt-1 text-blue-600 hover:underline"
                onClick={() => toggleExpand(index)}
              >
                {expandedIndex === index ? "Ẩn chi tiết" : "Xem chi tiết"}
              </button>

              {expandedIndex === index && (
                <div className="mt-1 space-y-1">
                  <p>
                    <strong>Họ tên:</strong> {report.name}
                  </p>
                  <p>
                    <strong>SĐT:</strong> {report.phone_number}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {report.address}
                  </p>
                  <p>
                    <strong>Thời gian:</strong>{" "}
                    {new Date(report.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportOverlay;
