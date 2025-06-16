"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { BellAlertIcon, ChartBarIcon, CheckIcon, ChevronDownIcon, Cog6ToothIcon, FunnelIcon, IdentificationIcon, InformationCircleIcon, LockClosedIcon, MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Loading from "@/app/(trang-chu)/loading";
import Swal from "sweetalert2";

const LoadingSpinner = () => {
  <div className="flex justify-center items-center h-full">
    <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
}

const Page = () => {
  const [categoryItem, setCategoryItem] = useState([
    { name: "Quản trị viên", role_id: 1, item: [] },
    { name: "Người dùng", role_id: 2, item: [] },
    { name: "Đang bị khóa", item: [] }
  ]);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabLoading, setTabLoading] = useState(true);
  const [activeUser, setActiveUser] = useState(null);
  const tabs = [
    { name: 'info', icon: <IdentificationIcon className="w-9 h-9" />, topPosition: "top-5" },
    { name: 'statistic', icon: <ChartBarIcon className="w-9 h-9" />, topPosition: "top-24" },
  ];

  const [currentTab, setCurrentTab] = useState('info');
  const [tabData, setTabData] = useState([])
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [minimize, setMinimize] = useState([]);
  const [isOpenFunction, setIsOpenFunction] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener when unmounting
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      try {
        const token = await user.getIdToken(true);
        const res = await axios.post(
          `/api/admin/users/getUsers`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [user]); // Fetch users when `user` is available

  useEffect(() => {
    if (userData.length > 0) {
      const newCategoryItem = categoryItem.map((category) => {
        if (category.name === "Đang bị khóa") {
          return {
            ...category,
            item: userData.filter((user) => user.is_lock === true), // adjust field name if needed
          };
        }

        if (category.role_id === 2) {
          return {
            ...category,
            item: userData.filter(
              (user) => user.role_id === 2 && user.is_lock !== true
            ),
          };
        }

        // Default for other roles
        return {
          ...category,
          item: userData.filter((user) => user.role_id === category.role_id),
        };
      });

      setCategoryItem(newCategoryItem);
      setLoading(false);
    }
  }, [userData]); // Update category items when `userData` changes

  useEffect(() => {
    if (currentTab === "info") {
      setTabLoading(true);
      const userKeyMap = {
        balance: "Số dư",
        discount_balance: "Số dư khuyến mãi",
        email: "Email",
        payment_code: "Mã thanh toán",
        phone_number: "Số điện thoại",
        profile_picture: "Ảnh đại diện",
        role_id: "Vai trò",
        tax_number: "Mã số thuế",
        uid: "Mã người dùng",
        username: "Tên người dùng",
        is_lock: "Trạng thái khóa"
      };

      axios.post(`/api/admin/users/getUserById`, { uid: activeUser?.uid })
        .then((res) => {
          if (res.data && res.data[0]) {
            const filteredInfo = Object.entries(res.data[0]).reduce((acc, [key, value]) => {
              if (userKeyMap[key]) {
                acc[userKeyMap[key]] = value; // Convert keys to Vietnamese labels
              }
              return acc;
            }, {});

            setTabData(filteredInfo); // Now contains the translated keys
            setTabLoading(false);
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    } else if (currentTab === 'statistic') {
      setTabLoading(true);
      const statisticKeyMap = {
        total_spend: "Tổng số tiền đã chi",
        posts_amount: "Số lượt tin đã đăng"
      }
      axios.post(`/api/admin/users/getUserStatistic`, {
        user_id: activeUser
      }).then((res) => {
        if (res.data && res.data[0]) {
          const filteredInfo = Object.entries(res.data[0]).reduce((acc, [key, value]) => {
            if (statisticKeyMap[key]) {
              acc[statisticKeyMap[key]] = value; // Convert keys to Vietnamese labels
            }
            return acc;
          }, {});

          setTabData(filteredInfo); // Now contains the translated keys
          setTabLoading(false);
        }
      })
    }
  }, [currentTab, activeUser]);

  useEffect(() => {
    if (userData.length > 0) {
      let filteredUsers = userData.filter((user) => {
        return (
          user.username.toLowerCase().includes(searchValue.toLowerCase()) ||
          user.phone_number?.includes(searchValue)
        );
      });

      const newUsers = categoryItem.map((category) => {
        if (category.name === "Đang bị khóa") {
          return {
            ...category,
            item: filteredUsers.filter((user) => user.is_lock === true),
          };
        } else {
          return {
            ...category,
            item: filteredUsers.filter(
              (user) =>
                user.role_id === category.role_id && user.is_lock !== true // exclude locked users if needed
            ),
          };
        }
      });

      setCategoryItem(newUsers);
    }
  }, [searchValue, userData]); // Also track userData in case it changes


  //* Set user id to activeUser state
  const handleClick = (user) => {
    setActiveUser((prev) => (prev?.uid === user.uid ? null : user));
  };

  const handleFiltering = (method) => {
    if (method === 'alphabet') {
      const sortedUsers = categoryItem.map((item) => ({
        ...item,
        item: [...item.item].sort((a, b) => {
          const givenNameA = a.username.split(" ").pop(); // Last word of the name
          const givenNameB = b.username.split(" ").pop();

          return givenNameA.localeCompare(givenNameB, "vi"); // Vietnamese locale sorting
        }),
      }));

      console.log(sortedUsers);
    }
  }

  const handleMinimize = (tab) => {
    setMinimize((prev) =>
      prev.includes(tab)
        ? prev.filter((item) => item !== tab) // Remove if exists
        : [...prev, tab] // Add if not exists
    );
  };

  const handleInputChange = (key, value) => {
    setTabData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("Updated Data:", tabData);
  };

  const handleLockAccount = async (uid, status) => {
    const confirm = await Swal.fire({
      title: `Xác nhận ${status ? "khóa" : "mở khóa"} tài khoản?`,
      html: `Bạn muốn ${status ? "khóa" : "mở khóa"} tài khoản<br><strong>Tên:</strong> ${tabData["Tên người dùng"]}<br><strong>Uid:</strong> ${tabData["Mã người dùng"]}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `${status ? "Khóa" : "Mở khóa"} tài khoản`,
      cancelButtonText: "Hủy",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.post(`/api/admin/users/lockUser`, {
          isLock: status,
          uid: uid,
        }).then(() => {
          Swal.fire({
            title: "Thành công!",
            text: `Tài khoản đã ${status ? "bị khóa" : "được mở khóa"}.`,
            icon: "success",
            confirmButtonText: "Đóng"
          });
        })
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Lỗi!",
          text: "Đã xảy ra lỗi khi khóa tài khoản.",
          icon: "error",
          confirmButtonText: "Đóng"
        });
      }
    }
  };

  const handleSendNotification = async (uid) => {
    const { value: message } = await Swal.fire({
      title: 'Gửi thông báo',
      input: 'textarea',
      inputLabel: 'Nội dung thông báo',
      inputPlaceholder: 'Nhập nội dung thông báo tại đây...',
      inputAttributes: {
        'aria-label': 'Nội dung thông báo'
      },
      showCancelButton: true,
      confirmButtonText: 'Gửi',
      cancelButtonText: 'Hủy',
      inputValidator: (value) => {
        if (!value) {
          return 'Bạn cần nhập nội dung thông báo!';
        }
      }
    });

    if (message) {
      try {
        await axios.post('/api/admin/users/sendNotification', {
          uid,
          content: message
        });

        Swal.fire('Thành công!', 'Thông báo đã được gửi.', 'success');
      } catch (error) {
        Swal.fire('Lỗi!', 'Gửi thông báo thất bại.', 'error');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="" onClick={() => setIsSearching(false)}>
      <div className="p-5 pb-5 border-b border-gray-300 bg-white shadow-sm">
        <h1 className="text-3xl font-medium" onClick={() => setIsSearching(false)}>Danh sách người dùng</h1>
        <div className="flex gap-5 mt-5 items-center" onClick={(e) => e.stopPropagation()}>
          <div className={`relative ransition-all duration-300 ${isSearching ? 'w-1/4' : 'w-1/6'}`}>
            <MagnifyingGlassIcon className="absolute top-1/2 -translate-y-1/2 left-2 w-6 h-6" />
            <input
              placeholder="Tìm kiếm người dùng"
              className={`pl-10 rounded-lg border border-gray-300 focus:border-gray-600 w-full transition-all duration-300`}
              onClick={() => setIsSearching(true)}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>

        </div>
      </div>

      <div className="mt-10 px-5">
        {categoryItem.map((group, index) => (
          <div key={index} className="mt-10">
            <div className="flex items-center gap-2">
              <h2 className="text-lg">
                <span className={`font-medium`}>{group.name} <span className="text-orange-600">({group.item.length})</span></span>
              </h2>
              <button onClick={() => handleMinimize(group.name)}><ChevronDownIcon className={`w-3 h-3 transition-all duration-200 ease-in-out ${minimize.includes(group.name) ? "-rotate-90" : "rotate-0"}`} /></button>
            </div>
            {!minimize.includes(group.name) && (
              group.item.map((user, userIndex) => (
                <div key={userIndex} onClick={() => handleClick(user)}>
                  <div key={userIndex} className="border p-3 rounded-lg border-gray-200 shadow-md bg-white hover:shadow-lg my-2 transition flex justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Image
                        src={user.profile_picture}
                        width={40}
                        height={40}
                        className="rounded-full"
                        alt="profile_picture"
                      />
                      <h1>{user.username}</h1>
                    </div>
                    <button><InformationCircleIcon className="w-7 h-7" /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>

      {activeUser?.uid && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/10 cursor-pointer flex items-center justify-center" onClick={() => { setActiveUser(null); setIsEditing(false); setCurrentTab('info') }}>
          <div className="relative w-1/3 rounded-xl bg-white shadow-sm border-gray-300 border " onClick={(e) => e.stopPropagation()}>
            {tabs.map((item, index) => (
              <div key={index} className={`absolute ${item.topPosition} -left-[60px]`}>
                <button className={`px-3 py-3 ${currentTab === item.name ? "bg-black text-white" : "bg-white text-black"} rounded-tl-md rounded-bl-md`} onClick={() => setCurrentTab(item.name)}>{item.icon}</button>
              </div>
            ))}

            {currentTab === 'info' && (
              <div>
                <h1 className="text-center text-2xl py-5 border-b">Thông tin người dùng</h1>
                <div className="flex flex-col w-full mx-auto rounded-2xl p-6 h-128 overflow-auto">
                  {tabLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <div className="flex items-center space-x-4">
                        <img
                          src={tabData["Ảnh đại diện"] || "https://via.placeholder.com/96"}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full border-2 border-blue-400"
                        />
                        <div className="flex-grow">
                          {isEditing ? (
                            <>
                              <input
                                type="text"
                                value={tabData["Tên người dùng"]}
                                onChange={(e) => handleInputChange("Tên người dùng", e.target.value)}
                                className="border border-gray-200 bg-gray-50 px-2 py-1 w-full rounded-md"
                              />
                              <input
                                type="email"
                                value={tabData["Email"]}
                                onChange={(e) => handleInputChange("Email", e.target.value)}
                                className="border border-gray-200 bg-gray-50 px-2 py-1 w-full rounded-md mt-2"
                              />
                            </>
                          ) : (
                            <>
                              <h2 className="text-lg font-semibold">{tabData["Tên người dùng"]} <span className="text-xs font-normal text-red-600">{tabData["Trạng thái khóa"] ? "(Tài khoản đang bị khóa)" : ""}</span></h2>
                              <p className="text-sm text-gray-500">{tabData["Email"]}</p>
                            </>
                          )}
                        </div>
                        {tabData['Vai trò'] !== 1 && (
                          <div className="flex items-center gap-2 relative">
                            <button
                              className="hover:scale-110"
                              onClick={() => {
                                if (isEditing) {
                                  handleSave();  // Save changes
                                } else {
                                  setIsEditing(true);  // Enter edit mode
                                }
                              }}
                            >
                              {isEditing ? (
                                <CheckIcon className="w-6 h-6 text-green-600" />
                              ) : (
                                <PencilSquareIcon className="w-6 h-6" />
                              )}
                            </button>
                            <button className="hover:scale-110" onClick={() => setIsOpenFunction((prev) => !prev)}>
                              <Cog6ToothIcon className="w-6 h-6" />
                            </button>
                            {isOpenFunction && (
                              <div className="absolute right-0 top-7 w-44 border bg-white shadow rounded-lg p-2" onClick={(e) => e.stopPropagation()}>
                                {!tabData['Trạng thái khóa'] ? (
                                  <p
                                    className="text-xs p-2 border-red-400 border text-red-700 rounded-lg flex items-center gap-2 my-2 hover:scale-105 transition"
                                    onClick={() => handleLockAccount(tabData["Mã người dùng"], true)}
                                  >
                                    <LockClosedIcon className="w-3 h-3" /
                                    >Khóa tài khoản
                                  </p>
                                ) : (
                                  <p
                                    className="text-xs p-2 border-green-400 border text-green-700 rounded-lg flex items-center gap-2 my-2 hover:scale-105 transition"
                                    onClick={() => handleLockAccount(tabData["Mã người dùng"], false)}
                                  >
                                    <LockClosedIcon className="w-3 h-3" /
                                    >Mở khóa tài khoản
                                  </p>
                                )}

                                <p
                                  className="text-xs p-2 border-yellow-600 border rounded-lg flex text-yellow-600  items-center gap-2 my-2 hover:scale-105 transition"
                                  onClick={() => handleSendNotification(tabData["Mã người dùng"])}
                                >
                                  <BellAlertIcon className="w-3 h-3" />
                                  Gửi thông báo
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="my-5 grid grid-cols-2 gap-4 overflow-auto">
                        {Object.entries(tabData)
                          .filter(([key]) => key !== "Ảnh đại diện" && key !== "Tên người dùng" && key !== "Email")
                          .map(([key, value]) => (
                            <div key={key} className="border-b py-2">
                              <span className="text-gray-600 font-semibold">{key}</span>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={value || ""}
                                  onChange={(e) => handleInputChange(key, e.target.value)}
                                  className="border border-gray-200 bg-gray-50 px-2 py-1 w-full rounded-md"
                                />
                              ) : (
                                <p className="text-gray-800">{value || "Không có dữ liệu"}</p>
                              )}
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {currentTab === 'statistic' && (
              <div>
                <h1 className="text-center text-2xl py-5 border-b">Thống kê thông tin</h1>
                <div className="w-full mx-auto rounded-2xl p-6 h-128 overflow-auto">
                  {tabLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 gap-4">
                        {Object.entries(tabData)
                          .map(([key, value]) => (
                            <div key={key} className="py-2 bg-gray-50 p-2 rounded">
                              <span className="text-gray-600 font-semibold">{key}</span>
                              <p className="text-gray-800">{Number(value).toLocaleString("de-DE") || "Không có dữ liệu"} {key === "Tổng số tiền đã chi" ? "đ" : ""}</p>
                            </div>
                          ))}
                      </div>
                    </>
                  )}

                </div>
              </div>
            )}
          </div>
        </div >
      )}
    </div>
  );
};

export default Page;
