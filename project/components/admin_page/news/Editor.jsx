import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Quill from "quill"; // Import Quill
import QuillResizeImage from "quill-resize-image";

Quill.register("modules/imageResize", QuillResizeImage);
Quill.register("formats/size", true);

const Editor = ({ content, setContent, allowImage }) => {
  return (
    <ReactQuill
      className="h-full shadow-sm focus:ring focus:ring-blue-300"
      theme="snow"
      value={content}
      onChange={setContent}
      modules={{
        toolbar: [
          [
            { header: "1" },
            { header: "2" },
            { header: "3" },
            { header: "4" },
            { header: "5" },
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
          ],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link"],
          ...(allowImage ? [["image"]] : []),
        ],
        imageResize: {
          // Optional: You can add customization here if needed
        },
      }}
      spellCheck={false}
    />
  );
};

export default Editor;
