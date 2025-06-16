import axios from "axios";
import React, { useEffect, useState } from "react";

const reportOptions = [
  "Địa chỉ của bất động sản",
  "Các thông tin về: giá, diện tích, mô tả ...",
  "Ảnh",
  "Trùng với tin rao khác",
  "Không liên lạc được",
  "Tin không có thật",
  "Bất động sản đã bán",
];

export default function ReportBox({ onClose, postId }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [otherFeedback, setOtherFeedback] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      reason: selectedOptions,
      other_report: otherFeedback,
      post_id: postId,
      ...formData,
    };

    axios
      .post(`/api/handle_posts/handleReportPost`, {
        payload,
      })
      .then(() => {
        alert("Báo cáo tin đăng thành công!");
      })
      .catch((error) => {
        console.log(error);
      });

    console.log("Submitting report:", payload);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-xl relative">
        <h2 className="text-xl font-bold mb-4">Báo cáo tin đăng</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <fieldset className="space-y-2">
            <legend className="font-medium mb-1">Lý do báo cáo</legend>
            {reportOptions.map((option) => (
              <label key={option} className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => toggleOption(option)}
                  className="mt-1 accent-red-500"
                />
                <span>{option}</span>
              </label>
            ))}
          </fieldset>

          <div>
            <label htmlFor="otherFeedback" className="block font-medium mb-1">
              Phản hồi khác
            </label>
            <textarea
              id="otherFeedback"
              rows={3}
              className="w-full border rounded-md p-2"
              placeholder="Nhập phản hồi của bạn..."
              value={otherFeedback}
              onChange={(e) => setOtherFeedback(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <div>
              <label htmlFor="name" className="block font-medium mb-1">
                Họ tên
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="Nguyễn Văn A"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block font-medium mb-1">
                Số điện thoại
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="0912345678"
              />
            </div>
            <div>
              <label htmlFor="address" className="block font-medium mb-1">
                Địa chỉ
              </label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
                placeholder="Số 1, Đường ABC, Quận XYZ"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Gửi báo cáo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
