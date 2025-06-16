"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import useStore from "@/lib/zustand";
const Editor = dynamic(() => import("@/components/admin_page/news/Editor"), {
  ssr: false,
});

const CreateNew = ({ setIsCreatingNew, subject, initialData, setEditMode }) => {
  const isEditing = !!initialData;
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [summary, setSummary] = useState(initialData?.summary || "");
  const [tags, setTags] = useState(initialData?.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uid } = useStore();

  const replaceImageUrlsWithCloudinary = async (content) => {
    const regex = /src=\"([^">]+)\"/g;
    const base64Strings = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      const src = match[1];
      if (src.startsWith("data:image")) base64Strings.push(src);
    }
    try {
      const response = await axios.post("/api/admin/news/uploadNewImages", {
        images: base64Strings,
      });
      const uploadedImages = response.data.images;
      uploadedImages.forEach((url, index) => {
        content = content.replace(base64Strings[index], url);
      });
      return content;
    } catch (error) {
      console.error("Error uploading images:", error);
      return content;
    }
  };

  console.log(isEditing);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formattedContent = await replaceImageUrlsWithCloudinary(content);

    const payload = {
      title,
      content: formattedContent,
      tags,
      summary,
      author_id: uid,
    };

    const endpoint = isEditing
      ? "/api/admin/news/updateNew"
      : "/api/admin/news/postNew";

    axios
      .post(endpoint, isEditing ? { ...payload, id: initialData.id } : payload)
      .then(() => {
        setIsCreatingNew(false);
        alert(isEditing ? "Cập nhật thành công!" : "Tạo tin tức thành công!");
      })
      .catch((error) => {
        console.error("Error submitting news:", error);
        alert("Đã xảy ra lỗi.");
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto animate-fadeIn">
      <div className="flex items-center justify-between p-6 border-b shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Tạo tin tức mới</h1>
        <button
          className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg"
          onClick={() => {
            if (!initialData) setIsCreatingNew(false);
            setEditMode(null);
          }}
        >
          Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block mb-2 text-lg font-semibold text-gray-700"
          >
            Tiêu đề
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề..."
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-lg font-semibold text-gray-700">
            Gán nhãn cho bài đăng
          </label>
          <div className="flex flex-wrap gap-3">
            {subject.slice(1).map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setTags(
                    tags.includes(item.name)
                      ? tags.filter((tag) => tag !== item.name)
                      : [...tags, item.name]
                  )
                }
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                  tags.includes(item.name)
                    ? "bg-green-600 text-white border-green-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label
            htmlFor="summary"
            className="block mb-2 text-lg font-semibold text-gray-700"
          >
            Mô tả ngắn
          </label>
          <input
            id="summary"
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Nhập mô tả..."
            className="w-full p-3 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="content"
            className="block mb-2 text-lg font-semibold text-gray-700"
          >
            Nội dung
          </label>
          <Editor content={content} setContent={setContent} allowImage={true} />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-white font-medium rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60"
          >
            {isEditing ? "Cập nhật" : isSubmitting ? "Đang tạo..." : "Tạo mới"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNew;
