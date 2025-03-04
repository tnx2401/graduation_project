import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const Contact = ({ formData, setFormData }) => {
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [isExpand, setIsExpand] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;
      axios
        .get(`/api/users?userId=${userId}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        })
        .then((res) => {
          setContactName(res.data.username);
          setEmail(res.data.email);
          if (res.data.phone_number) {
            setPhonenumber(res.data.phone_number);
          }
        })
        .catch((error) => {
          console.log("Error fetching user with ID: ", userId, error);
        });
    } else {
    }
  }, []);

  const handleKeyPress = (event) => {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    setFormData({
      ...formData,
      contact_info: {
        contactName: contactName,
        email: email,
        phonenumber: phonenumber,
      },
    });
  }, [contactName, email, phonenumber]);

  return (
    <div className="w-full border p-4 rounded-xl my-5">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-lg">Thông tin liên hệ</h1>
        <button onClick={() => setIsExpand((prev) => !prev)}>
          <ChevronDownIcon
            className={`w-4 h-4 ${
              isExpand ? "rotate-180" : ""
            } transition-all duration-200 ease-in-out`}
          />
        </button>
      </div>
      {isExpand && (
        <div className="mt-5">
          <label className="text-sm font-semibold" htmlFor="title">
            Tên liên hệ
          </label>
          <input
            type="text"
            className=" w-full border p-3 my-3 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
          />

          <label className="text-sm font-semibold" htmlFor="title">
            Email{" "}
            <span className="text-xs text-neutral-400">(không bắt buộc)</span>
          </label>
          <input
            type="text"
            className=" w-full border p-3 my-3 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className=" font-semibold" htmlFor="title">
            Số điện thoại
          </label>
          <input
            type="text"
            className=" w-full border p-3 my-3 rounded-3xl border-neutral-200 text-sm focus:ring-0 focus:outline-none focus:border-neutral-300"
            value={phonenumber}
            onKeyPress={handleKeyPress}
            onChange={(e) => setPhonenumber(e.target.value)}
            disabled
          />
        </div>
      )}
    </div>
  );
};

export default Contact;
