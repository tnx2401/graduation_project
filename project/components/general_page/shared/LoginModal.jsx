"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UserIcon,
  LockClosedIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";

//! Import for login
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";
import axios from "axios";

import useStore from "../../../lib/zustand";

// * Login Component
const Login = ({ setOpenModal, setMode, handleSignInWithGoogle }) => {
  return (
    <div className="xl:flex flex-row items-center h-full">
      <div className="relative xl:w-2/5 xl:h-full w-full bg-rose-50 flex items-center justify-center xl:rounded-tl-lg xl:rounded-bl-lg">
        <Image src="/image/image.png" width={300} height={200} alt="image" />
        <Image
          src="https://staticfile.batdongsan.com.vn/images/logo/standard/red/logo.svg"
          alt="logo"
          width={150}
          height={150}
          className="absolute top-10 left-10"
        />
      </div>

      <div className="relative bg-white px-8 py-10 xl:w-3/5 xl:h-full w-full flex flex-col xl:rounded-tr-lg xl:rounded-br-lg">
        <h1 className="font-medium">Xin chào bạn</h1>
        <h1 className="text-2xl mt-2 font-medium">Đăng nhập để tiếp tục</h1>

        <div className="relative">
          <input
            type="text"
            className="border-2 w-full p-2.5 rounded-lg mt-10 pl-10 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
            placeholder="SĐT chính hoặc email"
          />
          <UserIcon className="w-5 h-5 absolute top-1/2 transform translate-y-2.5 left-3" />
        </div>

        <div className="relative">
          <input
            type="password"
            className="border-2 w-full p-2.5 rounded-lg mt-5 pl-10 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
            placeholder="Mật khẩu"
          />
          <LockClosedIcon className="w-5 h-5 absolute top-1/2 transform -translate-y-0 left-3" />
        </div>

        <button className="w-full p-2.5 mt-5 rounded-lg text-white bg-red-600">
          Đăng nhập
        </button>

        <div className="flex justify-between mt-3 text-sm">
          <div className="flex items-center">
            <input type="checkbox" id="rememberMe" />
            <label className="ml-2" htmlFor="rememberMe">
              Nhớ tài khoản
            </label>
          </div>
          <Link href={"/"} className="text-orange-500 hover:text-orange-600">
            Quên mật khẩu
          </Link>
        </div>

        <p className="flex w-full justify-center mt-3 text-neutral-400">
          <span className="border-b border-gray-300 w-1/3"></span>
          <span className="px-2">Hoặc</span>
          <span className="border-b border-gray-300 w-1/3"></span>
        </p>

        <div className="flex-grow">
          <button
            className="w-full p-2.5 mt-5 rounded-lg text-black border-2 flex items-center justify-center"
            onClick={handleSignInWithGoogle}
          >
            <Image
              src="/image/google.png"
              width={30}
              height={30}
              alt="google-icon"
            />
            Đăng nhập với Google
          </button>
        </div>

        <p className="text-center text-xs mt-5">
          Chưa là thành viên?{" "}
          <button className="text-blue-500" onClick={() => setMode("sign_up")}>
            Đăng ký
          </button>{" "}
          tại đây
        </p>

        <button
          className="text-2xl text-neutral-400 absolute top-5 right-10"
          onClick={() => setOpenModal(false)}
        >
          X
        </button>
      </div>
    </div>
  );
};

const SignUp = ({
  error,
  setOpenModal,
  setMode,
  setPhoneNumber,
  handleSignInWithGoogle,
  handleSignInWithPhoneNumber,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignInWithPhoneNumber();
  };

  return (
    <div className="xl:flex flex-row items-center h-full">
      <div className="relative xl:w-2/5 xl:h-full w-full bg-rose-50 flex items-center justify-center xl:rounded-tl-lg xl:rounded-bl-lg">
        <Image src="/image/image.png" width={300} height={200} alt="image" />
        <Image
          src="https://staticfile.batdongsan.com.vn/images/logo/standard/red/logo.svg"
          alt="logo"
          width={150}
          height={150}
          className="absolute top-10 left-10"
        />
      </div>

      <div className="relative bg-white px-8 py-10 xl:w-3/5 xl:h-full w-full flex flex-col xl:rounded-tr-lg xl:rounded-br-lg">
        <h1 className="font-medium">Xin chào bạn</h1>
        <h1 className="text-2xl mt-2 font-medium">Đăng ký tài khoản mới</h1>

        <form className="relative" onSubmit={handleSubmit}>
          <input
            type="text"
            className="border-2 w-full p-2.5 rounded-lg mt-10 pl-10 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
            placeholder="Nhập số điện thoại"
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <PhoneIcon className="w-5 h-5 absolute top-1/2 transform -translate-y-6 left-3" />

          <button
            type="submit"
            className="w-full p-2.5 mt-5 rounded-lg text-white bg-red-600"
            id="sign-up-button"
            onClick={handleSubmit}
          >
            Tiếp tục
          </button>
        </form>
        <p className="text-sm text-red-500 pt-2">{error}</p>

        <p className="flex w-full justify-center mt-3 text-neutral-400">
          <span className="border-b border-gray-300 w-1/3"></span>
          <span className="px-2">Hoặc</span>
          <span className="border-b border-gray-300 w-1/3"></span>
        </p>

        <div className="flex-grow">
          <button
            className="w-full p-2.5 mt-5 rounded-lg text-black border-2 flex items-center justify-center"
            onClick={handleSignInWithGoogle}
          >
            <Image
              src="/image/google.png"
              width={30}
              height={30}
              alt="google-icon"
            />
            Đăng nhập với Google
          </button>
        </div>

        <p className="text-center text-xs mt-5">
          Đã có tài khoản?{" "}
          <button className="text-blue-500" onClick={() => setMode("login")}>
            Đăng nhập
          </button>{" "}
          tại đây
        </p>

        <button
          className="text-2xl text-neutral-400 absolute top-5 right-10"
          onClick={() => {
            setOpenModal(false);
            setMode("login");
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

// * Main Modal
const Modal = ({ openModal, setOpenModal, handleLoginSuccess }) => {
  const [mode, setMode] = useState(openModal);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const setUsername = useStore((state) => state.setUsername);
  const setProfileImage = useStore((state) => state.setProfileImage);

  useEffect(() => {
    if (openModal && mode === "sign_up" && !window.recaptchaVerifier) {
      const button = document.getElementById("sign-up-button");
      if (!button) {
        console.error("Button with ID 'sign-up-button' not found.");
        return;
      }

      try {
        console.log("Initializing RecaptchaVerifier...");
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "sign-up-button",
          {
            size: "invisible",
            callback: (response) => {
              console.log("reCAPTCHA solved");
              onSignInSubmit();
            },
          }
        );

        window.recaptchaVerifier.render().then(() => {
          console.log("reCAPTCHA widget rendered");
        });
      } catch (error) {
        console.error("Error initializing RecaptchaVerifier:", error);
      }
    }
  }, [openModal, mode]);

  const handleSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithPopup(auth, provider);
      const userInfo = result.user;

      const creationTime = new Date(userInfo.metadata.creationTime).getTime();
      const token = await userInfo.getIdToken();
      const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;

      localStorage.setItem("authToken", token);
      localStorage.setItem("authExpiresAt", expiresAt);

      // Check if the user is new (created in the last 5 seconds)
      if (creationTime >= new Date().getTime() - 5000) {
        try {
          // Post new user data to the server
          await axios.post(
            "/api/users",
            {
              uid: userInfo.uid,
              username: userInfo.displayName,
              contacts: [],
              balance: 0,
              discount_balance: 0,
              member_type: 2,
              profile_picture: userInfo.photoURL,
              phone_number: null,
              email: userInfo.email,
              payment_code: null,
              tax_number: null,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
        } catch (error) {
          console.error(
            "Error adding user: ",
            error.response?.data || error.message
          );
        }
      }

      // Set state regardless of whether the user is new or existing
      setUsername(userInfo.displayName);
      setProfileImage(userInfo.photoURL);
      setOpenModal("");
      handleLoginSuccess();
    } catch (error) {
      console.log("Error during sign-in: ", error);
    }
  };

  const handleSignInWithPhoneNumber = () => {
    if (phoneNumber.trim() === "") {
      setError("Bạn chưa nhập số điện thoại");
      return;
    }

    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("SMS sent!");
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        setError("Đã xảy ra lỗi khi gửi mã xác minh. Vui lòng thử lại.");
      });
  };

  if (!openModal) return null;

  return (
    <div
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      className="fixed inset-0 top-0 z-50 flex w-full h-full items-center justify-center"
    >
      {/* Invisible button for RecaptchaVerifier */}
      <button id="sign-up-button" style={{ display: "none" }}></button>

      <div className="xl:w-5/12 md:w-6/12 w-11/12 xl:h-[42rem] bg-black">
        {mode === "login" && (
          <Login
            setOpenModal={setOpenModal}
            setMode={setMode}
            handleSignInWithGoogle={handleSignInWithGoogle}
          />
        )}
        {mode === "sign_up" && (
          <SignUp
            error={error}
            setOpenModal={setOpenModal}
            setMode={setMode}
            setPhoneNumber={setPhoneNumber}
            handleSignInWithGoogle={handleSignInWithGoogle}
            handleSignInWithPhoneNumber={handleSignInWithPhoneNumber}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
