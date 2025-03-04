import React, { useState } from "react";
import axios from "axios";

const AssignPhonenumber = ({ userId, setHavePhonenumber }) => {
  const [isVerify, setIsVerify] = useState(false);

  const [phonenumber, setPhonenumber] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");

  const handleKeyPress = (event) => {
    const charCode = event.charCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

  const handlePhonenumber = async () => {
    if (phonenumber.trim() === "" || phonenumber.length !== 10) {
      return;
    }

    try {
      const response = await axios.post(`/api/handle_posts/checkPhonenumber`, {
        phonenumber,
      });

      if (response.status === 200) {
        setIsVerify(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError("Số điện thoại đã được sử dụng");
      } else {
        console.log(error);
      }
    }
  };

  const handleVerify = () => {
    if (verifyCode.trim() === "" || verifyCode.length !== 6) {
      return;
    }

    if (verifyCode === "240103") {
      axios
        .patch(`/api/setPhonenumber?userId=${userId}`, {
          phonenumber,
        })
        .then(() => {
          setIsVerify(false);
          setHavePhonenumber(true);
          alert("Cập nhật số điện thoại thành công!");
        })
        .catch((err) => {
          console.log("Error updating phone number: ", err);
        });
    }
  };

  return (
    <div className="absolute w-screen h-screen bg-black/50 top-0 left-0 flex items-center justify-center">
      {isVerify ? (
        <div className="w-1/4 bg-white rounded-xl ">
          <h1 className="p-5 w-full bg-black text-white font-semibold rounded-tl-xl rounded-tr-xl">
            Xác nhận số điện thoại
          </h1>
          <p className="text-sm p-5">
            Nhập mã gồm 6 số được gửi đến số điện thoại
          </p>
          <div className="px-5">
            <input
              type="text"
              className="mb-2 w-full rounded-lg text-md"
              placeholder="Nhập mã xác nhận"
              maxLength={6}
              onKeyPress={handleKeyPress}
              required
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
            ></input>
          </div>

          <button
            className="p-2 float-end border px-7 m-5 rounded-md bg-black text-white"
            onClick={handleVerify}
          >
            Xác nhận
          </button>
        </div>
      ) : (
        <div className="w-1/4 bg-white rounded-xl ">
          <h1 className="p-5 w-full bg-black text-white font-semibold rounded-tl-xl rounded-tr-xl">
            Xác nhận số điện thoại
          </h1>
          <p className="text-sm p-5">
            Bạn chưa thiết lập số điện thoại cho tài khoản này, nhập số điện
            thoại bên dưới và xác nhận để tiếp tục đăng tin.
          </p>
          <div className="px-5">
            <input
              type="text"
              className="mb-2 w-full rounded-lg text-md"
              placeholder="Nhập số điện thoại"
              maxLength={10}
              onKeyPress={handleKeyPress}
              value={phonenumber}
              onChange={(e) => setPhonenumber(e.target.value)}
              required
            ></input>
            <p className="text-red-600 text-sm">{error}</p>
          </div>

          <button
            className="p-2 float-end border px-7 m-5 rounded-md bg-black text-white"
            onClick={handlePhonenumber}
          >
            Gửi
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignPhonenumber;
