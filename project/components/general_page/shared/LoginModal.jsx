"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UserIcon,
  LockClosedIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

//! Import for login
import {
  GoogleAuthProvider,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  setPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../../lib/firebase";
import axios from "axios";

import useStore from "../../../lib/zustand";

// * Login Component
const Login = ({ setOpenModal, setMode, handleSignInWithGoogle }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginWithEmailAndPassword = async () => {
    try {
      // Ensure email and password are defined
      if (!email || !password) {
        Swal.fire({
          title: "Thông báo",
          text: "Vui lòng nhập đầy đủ email và mật khẩu!",
          icon: "warning",
          confirmButtonText: "Oke",
        });
        return;
      }

      // Set persistence to keep the user logged in
      await setPersistence(auth, browserLocalPersistence);

      // Sign in with email and password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const res = await axios.post("/api/checkLock", {
        uid: user.uid,
      });

      if (res.data?.isLocked) {
        Swal.fire({
          title: "Tài khoản bị khóa",
          text: "Tài khoản của bạn hiện đang bị khóa. Vui lòng liên hệ quản trị viên.",
          icon: "error",
          confirmButtonText: "Oke",
        });

        return;
      }

      // Get user token and set expiry time
      const token = await user.getIdToken();
      const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours expiry time

      // Store token and expiration in localStorage
      localStorage.setItem("authToken", token);
      localStorage.setItem("authExpiresAt", expiresAt);

      // Show success message
      Swal.fire({
        title: "Thông báo",
        text: "Đăng nhập thành công!",
        icon: "success",
        confirmButtonText: "Oke",
      }).then(() => {
        // Redirect to a secure page (e.g., Dashboard)
        window.location.href = "/"; // Or use React Router if it's a single-page app
      });
    } catch (error) {
      Swal.fire({
        title: "Đăng nhập thất bại",
        text: "Tài khoản hoặc mật khẩu không chính xác",
        icon: "error",
        confirmButtonText: "Try Again",
      });
    }
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
        <h1 className="text-2xl mt-2 font-medium">Đăng nhập để tiếp tục</h1>

        <div className="relative">
          <input
            type="email"
            className="border-2 w-full p-2.5 rounded-lg mt-10 pl-10 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
            placeholder="SĐT chính hoặc email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <UserIcon className="w-5 h-5 absolute top-1/2 transform translate-y-2.5 left-3" />
        </div>

        <div className="relative">
          <input
            type="password"
            className="border-2 w-full p-2.5 rounded-lg mt-5 pl-10 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
            placeholder="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
          />
          <LockClosedIcon className="w-5 h-5 absolute top-1/2 transform -translate-y-0 left-3" />
        </div>

        <button
          className="w-full p-2.5 mt-5 rounded-lg text-white bg-red-600"
          onClick={handleLoginWithEmailAndPassword}
        >
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
  phoneNumber,
  setPhoneNumber,
  handleSignInWithGoogle,
  handleSignInWithPhoneNumber,
  otpInput,
  otpCode,
  setOtpCode,
  confirmOTP,
  informationInput,
  userInfoAfterPhoneLoginSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [infoError, setInfoError] = useState([]);
  const [signUpWithEmailAndPassword, setSignUpWithEmailAndPassword] =
    useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signUpWithEmailAndPassword) {
      handleEmailPasswordSignUp(email, password);
    } else {
      handleSignInWithPhoneNumber();
    }
  };

  const handleVerifyOTP = () => {
    confirmOTP();
  };

  const handleFinishLoginWithPhoneNumber = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernameRegex = /^[\p{L} ]{3,50}$/u;
    let errors = [];

    if (!emailRegex.test(email)) {
      errors.push("Địa chỉ email không hợp lệ.");
    }

    if (!usernameRegex.test(username)) {
      errors.push("Tên đăng nhập không được chứa số và chỉ giới hạn 50 ký tự.");
    }

    setInfoError(errors);

    if (errors.length === 0) {
      await setPersistence(auth, browserLocalPersistence);
      const token = await userInfoAfterPhoneLoginSuccess.getIdToken();
      const expiresAt = new Date().getTime() + 24 * 60 * 1000 * 60;
      localStorage.setItem("authToken", token);
      localStorage.setItem("expiresAt", expiresAt);

      try {
        await axios
          .post("/api/addLocalUser", {
            phone_number: phoneNumber.replace(/^(\+84)/, "0"), // Store phone number
            uid: userInfoAfterPhoneLoginSuccess.uid, // Firebase UID
            username: username, // Can be set later
            profile_picture:
              "https://res.cloudinary.com/djpi5tprc/image/upload/v1741901841/default_user_edwi3e.png",
            role_id: 2,
            contacts: [],
            balance: 0,
            discount_balance: 0,
            email: email,
            payment_code: null,
            tax_number: null,
          })
          .then(() => {
            Swal.fire({
              title: "Thông báo",
              text: "Đăng ký tài khoản thành công",
              icon: "success",
              confirmButtonText: "Oke",
            }).then((result) => {
              if (
                result.isConfirmed ||
                result.dismiss === Swal.DismissReason.close
              ) {
                window.location.reload(); // Reload the page
              }
            });
          });
      } catch (error) {
        console.error(
          "Error adding user:",
          error.response?.data || error.message
        );
      }
    }
  };

  const handleEmailPasswordSignUp = async (email, password, phoneNumber) => {
    try {
      // Set auth persistence
      await setPersistence(auth, browserLocalPersistence);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await user.getIdToken();
      const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem("authToken", token);
      localStorage.setItem("expiresAt", expiresAt);

      await axios.post("/api/addLocalUser", {
        phone_number: phoneNumber?.replace(/^(\+84)/, "0"),
        uid: user.uid,
        username: `user${user.uid}`,
        profile_picture:
          "https://res.cloudinary.com/djpi5tprc/image/upload/v1741901841/default_user_edwi3e.png",
        role_id: 2,
        contacts: [],
        balance: 0,
        discount_balance: 0,
        email: email,
        payment_code: null,
        tax_number: null,
      });

      // Show success alert
      Swal.fire({
        title: "Thông báo",
        html: "Đăng ký tài khoản thành công.",
        icon: "success",
        confirmButtonText: "Đi đến hồ sơ",
      }).then((result) => {
        if (result.isConfirmed || result.dismiss === Swal.DismissReason.close) {
          window.location.href = "/nguoi-dung/thong-tin-tai-khoan";
        }
      });
    } catch (error) {
      const errorCode = error.code || error.response?.data?.code;

      if (errorCode === "auth/email-already-in-use") {
        Swal.fire({
          title: "Email đã tồn tại",
          text: "Tài khoản với email này đã được đăng ký. Vui lòng sử dụng email khác.",
          icon: "error",
          confirmButtonText: "OK",
        });
      } else {
        console.error("Error:", error);
        Swal.fire({
          title: "Lỗi",
          text: error.message || "Đã xảy ra lỗi trong quá trình đăng ký.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
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
        {informationInput ? (
          <div className="h-full flex flex-col">
            <h1 className="text-2xl font-medium">Nhập thông tin cá nhân</h1>
            <p className="text-sm">
              Vui lòng dành ít phút để nhập thông tin cá nhân của bạn trước khi
              tiếp tục
            </p>

            <div className="mt-5">
              <label htmlFor="">Tên người dùng</label>
              <input
                type="text"
                placeholder="Nhập tên người dùng"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-2 w-full p-2.5 rounded-lg mt-2 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
              />
            </div>

            <div className="mt-5 flex-grow">
              <label htmlFor="">Email</label>
              <input
                type="text"
                spellCheck={false}
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 w-full p-2.5 rounded-lg mt-2 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
              />
            </div>

            {infoError.length > 0 &&
              infoError.map((item, index) => (
                <p key={index} className="text-sm text-red-500">
                  {item}
                </p>
              ))}
            {username && email && (
              <button
                className="bg-red-500 p-2 rounded-lg text-white"
                onClick={handleFinishLoginWithPhoneNumber}
              >
                Tiếp tục
              </button>
            )}
          </div>
        ) : (
          <>
            <h1 className="font-medium">Xin chào bạn</h1>
            <h1 className="text-2xl mt-2 font-medium">Đăng ký tài khoản mới</h1>

            <form className="relative" onSubmit={handleSubmit}>
              {otpInput ? (
                <>
                  <input
                    type="text"
                    value={otpCode}
                    className="border-2 w-full p-2.5 rounded-lg mt-10 pl-10 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
                    placeholder="Nhập mã OTP được gửi tới số điện thoại"
                    onChange={(e) => setOtpCode(e.target.value)}
                  />
                  <LockClosedIcon className="w-5 h-5 absolute top-1/2 transform -translate-y-6 left-3" />

                  <button
                    type="submit"
                    className="w-full p-2.5 mt-5 rounded-lg text-white bg-red-600"
                    id="verify-otp-button"
                    onClick={handleVerifyOTP}
                  >
                    Tiếp tục
                  </button>
                </>
              ) : (
                <>
                  {signUpWithEmailAndPassword ? (
                    <>
                      <div className="relative mt-10 mb-2">
                        <input
                          type="email"
                          value={email}
                          className="border-2 w-full p-2.5 rounded-lg pl-10 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
                          placeholder="Nhập email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <EnvelopeIcon className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                      </div>
                      <div className="relative mb-2">
                        <input
                          type="password"
                          value={password}
                          className="border-2 w-full p-2.5 rounded-lg pl-10 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
                          placeholder="Nhập mật khẩu"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <LockClosedIcon className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                      </div>
                      <button
                        className="text-sm text-red-500 hover:text-red-600 hover:underline"
                        onClick={() => setSignUpWithEmailAndPassword(false)}
                      >
                        Đăng ký với số điện thoại
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="relative mt-10 mb-2">
                        <input
                          type="text"
                          value={phoneNumber}
                          className="border-2 w-full p-2.5 rounded-lg pl-10 outline-none focus:ring-0 focus:outline-none focus:border-gray-300 border-gray-100"
                          placeholder="Nhập số điện thoại"
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <PhoneIcon className="w-5 h-5 absolute top-1/2 transform -translate-y-1/2 left-3" />
                      </div>
                      <button
                        className="text-sm text-red-500 hover:text-red-600 hover:underline"
                        onClick={() => setSignUpWithEmailAndPassword(true)}
                      >
                        Đăng ký với email & mật khẩu
                      </button>
                    </>
                  )}

                  <button
                    type="submit"
                    className="w-full p-2.5 mt-5 rounded-lg text-white bg-red-600"
                    id="sign-up-button"
                    onClick={handleSubmit}
                  >
                    Đăng ký
                  </button>
                </>
              )}
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
              <button
                className="text-blue-500"
                onClick={() => setMode("login")}
              >
                Đăng nhập
              </button>{" "}
              tại đây
            </p>
          </>
        )}
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
  const [otpInput, setOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [informationInput, setInformationInput] = useState(false);
  const [userInfoAfterPhoneLoginSuccess, setUserInfoAfterPhoneLoginSuccess] =
    useState(null);
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

  const handleSignInWithPhoneNumber = async () => {
    if (phoneNumber.trim() === "") {
      setError("Bạn chưa nhập số điện thoại");
      return;
    }

    if (!window.recaptchaVerifier) {
      setError("reCAPTCHA chưa sẵn sàng, vui lòng thử lại.");
      return;
    }
    await setPersistence(auth, browserLocalPersistence);

    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        console.log("SMS sent!");
        setOtpInput(true);
      })
      .catch((error) => {
        console.error("Error during sign-in:", error);
        setError("Đã xảy ra lỗi khi gửi mã xác minh. Vui lòng thử lại.");
        console.error(error.code, error.message, error.stack);
      });
  };

  const confirmOTP = async () => {
    try {
      const result = await window.confirmationResult.confirm(otpCode);
      const creationTime = new Date(
        result.user.metadata.creationTime
      ).getTime();

      if (creationTime >= new Date().getTime() - 5000) {
        setUserInfoAfterPhoneLoginSuccess(result.user);
        setInformationInput(true);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

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
              role_id: 2,
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
      window.location.reload();
    } catch (error) {
      console.log("Error during sign-in: ", error);
    }
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
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            handleSignInWithGoogle={handleSignInWithGoogle}
            handleSignInWithPhoneNumber={handleSignInWithPhoneNumber}
            otpInput={otpInput}
            otpCode={otpCode}
            setOtpCode={setOtpCode}
            confirmOTP={confirmOTP}
            informationInput={informationInput}
            userInfoAfterPhoneLoginSuccess={userInfoAfterPhoneLoginSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
