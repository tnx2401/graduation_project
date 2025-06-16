"use client";
import { BellIcon, ChevronRightIcon, ListBulletIcon } from '@heroicons/react/24/outline'
import { CurrencyDollarIcon, Squares2X2Icon, UserGroupIcon, UsersIcon } from '@heroicons/react/24/solid'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import useStore from '@/lib/zustand';
import axios from 'axios';
import Loading from './loading';

const page = () => {
  const { uid } = useStore();
  const [userInfo, setUserInfo] = useState();
  const [notifications, setNotifications] = useState([]);
  const [notificationCategory, setNotificationCategory] = useState([
    { name: "Quan trọng", items: [] },
    { name: "Thông tin", items: [] }
  ])
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (!uid) return;
    axios.post(`/api/users/getGeneralInfo`, { uid })
      .then((res) => {
        console.log("API Response:", res.data);
        setUserInfo(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    axios.get(`/api/getNotifications?receiver_id=${uid}`).then((res) => {
      setNotifications(res.data);
    }).catch((error) => {
      console.log(error);
    })
  }, [uid]); // Depend only on uid

  useEffect(() => {
    const important = [];
    const info = [];

    notifications.forEach((item) => {
      if (item.type === 'Thông báo' || item.type === 'Quan trọng') {
        important.push(item);
      } else {
        info.push(item);
      }
    });

    const sortByTime = (a, b) => new Date(b.created_at) - new Date(a.created_at);
    important.sort(sortByTime);
    info.sort(sortByTime);

    setNotificationCategory([
      { name: "Quan trọng", items: important },
      { name: "Thông tin", items: info },
    ]);
  }, [notifications]);

  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString.replace(" ", "T"));
    const seconds = Math.floor((now - date) / 1000);

    const intervals = {
      năm: 31536000,
      tháng: 2592000,
      tuần: 604800,
      ngày: 86400,
      tiếng: 3600,
      phút: 60,
    };

    for (const [unit, value] of Object.entries(intervals)) {
      const amount = Math.floor(seconds / value);
      if (amount >= 1) {
        return `${amount} ${unit} trước`;
      }
    }

    return "Vừa xong";
  };

  const handleReadNotifications = (notification_id, receiver_id) => {
    axios
      .post(`/api/handleReadNotification`, {
        notification_id: notification_id,
        receiver_id: receiver_id,
      })
      .then(() => {
        setNotificationCategory((prev) =>
          prev.map((category) => ({
            ...category,
            items: category.items.filter((item) => item.id !== notification_id),
          }))
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  if (loading) {
    return <Loading />
  }

  return (
    <>
      <div className='border-b border-gray-400 p-7 shadow-sm flex items-center justify-between'>
        <h1 className='text-3xl'>Tổng quan</h1>
        <div className='flex flex-col items-center'>
          <BellIcon className='w-7 h-7' />
          <p className='text-sm'>Thông báo</p>
        </div>
      </div>

      <div className='p-7 mt-2'>
        <h1 className='text-xl'>Tổng quan tài khoản</h1>
        <div className='w-full mt-5'>
          <ul className='flex w-full gap-5 items-center'>
            <li className='p-3 bg-gray-200 flex flex-col gap-3 w-2/12 h-40 rounded-lg'>
              <div className='flex gap-2 items-center'>
                <ListBulletIcon className='w-6 h-6' />
                <h1>Tin đăng</h1>
              </div>

              <div className='flex-grow'>
                <h1 className='text-2xl'>{userInfo[0]?.post_count} tin</h1>
                <p className='text-sm text-gray-600'>Đang hiển thị</p>
              </div>

              <Link href={"/nguoi-dung/dang-tin"} className='text-red-700 underline flex items-center gap-1 hover:text-red-600'>Đăng tin <span><ChevronRightIcon className='w-4 h-4' /></span></Link>
            </li>

            <li className='p-3 bg-gray-200 flex flex-col gap-3 w-2/12 h-40 rounded-lg'>
              <div className='flex gap-2 items-center'>
                <UsersIcon className='w-6 h-6' />
                <h1>Liên hệ trong 30 ngày</h1>
              </div>

              <div>
                <h1 className='text-2xl'>{userInfo[0]?.contacts.length} người</h1>
                <p className='text-sm mt-1 text-green-600'>+ 0 mới vào hôm nay</p>
              </div>
            </li>

            <li className='p-3 bg-gray-200 flex flex-col gap-3 w-4/12 h-40 rounded-lg'>
              <div className='flex gap-2 items-center'>
                <CurrencyDollarIcon className='w-6 h-6' />
                <h1>Số dư</h1>
              </div>

              <div className='flex gap-5 flex-grow'>
                <div className='w-1/2 border-r border-gray-400'>
                  <h1 className='text-2xl'>{Number(userInfo[0]?.balance).toLocaleString("de-DE")} đ</h1>
                  <p className='text-sm mt-1'>Tài khoản chính</p>
                </div>
                <div className='w-1/2'>
                  <h1 className='text-2xl'>{Number(userInfo[0]?.discount_balance).toLocaleString("de-DE")} đ</h1>
                  <p className='text-sm mt-1'>Tài khoản khuyến mãi</p>
                </div>
              </div>

              <Link href={"/nguoi-dung/dang-tin"} className='text-red-700 underline flex items-center gap-1 hover:text-red-600'>Nạp tiền <span><ChevronRightIcon className='w-4 h-4' /></span></Link>
            </li>

            <li className='p-3 bg-rose-100 border-red-300 border flex flex-col gap-3 w-4/12 h-40 rounded-lg'>
              <div className='flex gap-2 items-center'>
                <UserGroupIcon className='w-6 h-6' />
                <h1>Gói hội viên</h1>
              </div>

              <p className='flex-grow'>Thảnh thơi đăng tin/đẩy tin không lo biến động giá</p>

              <Link href={"/nguoi-dung/dang-tin"} className='border border-black w-36 rounded-full p-3 flex items-center gap-1 hover:scale-105'>Tìm hiểu ngay</Link>
            </li>
          </ul>
        </div>

        <h1 className='text-xl mt-10'>Thông tin dành riêng cho bạn</h1>
        <div className='mt-3'>
          <button className='flex items-center gap-2 p-2 px-4 rounded-full border border-black bg-black text-white'><Squares2X2Icon className='w-5 h-5' />Tất cả</button>
        </div>

        <div className='flex mt-5 gap-5'>
          <div className='p-3 w-4/12 h-128 bg-gray-200 rounded-xl flex flex-col'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" data-automation-id="svg-icon" width="30" height="30" fill="none" viewBox="0 0 24 24" className="svg-icon-wrapper styles_svg-container-override__5cUGx" da-id="svg-icon"><path fill="#FF0000" fillRule="evenodd" d="M11.381 2.73c.512-.728 1.528-.984 2.32-.445.962.655 2.645 1.935 4.094 3.733S20.5 10.185 20.5 13c0 4.866-3.759 9-8.5 9s-8.5-4.134-8.5-9c0-2.025.879-4.635 2.602-6.723.664-.804 1.818-.748 2.483-.087a.253.253 0 0 0 .383-.031l2.412-3.428zm.618 17.769c1.546 0 2.8-1.437 2.8-3.21 0-1.927-1.511-3.337-2.313-3.951a.79.79 0 0 0-.974 0c-.802.613-2.313 2.024-2.313 3.951 0 1.773 1.254 3.21 2.8 3.21"></path></svg>
                <h1>Quan trọng</h1>
              </div>
              <span className='p-1 px-2 text-xs bg-red-600 text-white rounded-full '>{notificationCategory[0].items.length}</span>
            </div>
            <div className='overflow-auto flex-1 px-2'>
              {notificationCategory[0].items.map((item, index) => (
                <div
                  key={index}
                  className={`border border-gray-200 rounded-lg shadow ${item.type === 'Thông báo' ? "bg-yellow-200" : "bg-red-500"} p-2 flex flex-col text-left gap-2 my-5`}
                >
                  <h1 className="flex items-center gap-2 text-xs text-gray-600">
                    {timeAgo(item.created_at)}
                  </h1>
                  <h1 className="text-left text-sm font-medium">
                    {item.content}
                  </h1>
                  <div className="w-full">
                    <p
                      className="float-end pr-3 text-xs hover:underline text-green-700 w-fit cursor-pointer"
                      onClick={() => {
                        handleReadNotifications(item.id, item.user_id);
                      }}
                    >
                      Đánh dấu là đã đọc
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='p-3 w-4/12 h-128 bg-gray-200 rounded-xl flex flex-col'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" data-automation-id="svg-icon" width="30" height="30" fill="none" viewBox="0 0 24 24" className="svg-icon-wrapper styles_svg-container-override__5cUGx" da-id="svg-icon"><path fill="#0D1011" d="M7.5 8.5v3h4v-3z"></path><path fill="#0D1011" fillRule="evenodd" d="M2 5.75A2.75 2.75 0 0 1 4.75 3h9.5A2.75 2.75 0 0 1 17 5.75v5.5h2.25A2.75 2.75 0 0 1 22 14v3.75A3.25 3.25 0 0 1 18.75 21H5.25A3.25 3.25 0 0 1 2 17.75zM18.75 19.5a1.75 1.75 0 0 0 1.75-1.75V14c0-.69-.56-1.25-1.25-1.25H17v5c0 .966.784 1.75 1.75 1.75m-12-4.5a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5zM6 7.75A.75.75 0 0 1 6.75 7h5.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75z" clipRule="evenodd"></path></svg>
                <h1>Thông tin</h1>
              </div>

              <span className='p-1 px-2 text-xs bg-red-600 text-white rounded-full '>{notificationCategory[1].items.length}</span>
            </div>
            <div className='flex-1 overflow-auto'>
              {notificationCategory[1].items.map((item, index) => (
                <div
                  key={index}
                  className="border my-5 shadow bg-gray-50 rounded-lg p-2 flex flex-col text-left gap-2"
                >
                  <h1 className="flex items-center gap-2 text-xs text-gray-600">
                    {timeAgo(item.created_at)}
                  </h1>
                  <h1 className="text-left text-sm font-medium">
                    {item.content}
                  </h1>
                  <div className="w-full">
                    <p
                      className="float-end pr-3 text-xs hover:underline text-green-700 w-fit cursor-pointer"
                      onClick={() => {
                        handleReadNotifications(item.id, item.user_id);
                      }}
                    >
                      Đánh dấu là đã đọc
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className='p-3 w-4/12 h-128 bg-gray-200 rounded-xl'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#008080" className="size-6">
                  <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
                <h1>Gợi ý</h1>
              </div>

              <span className='p-1 px-2 text-xs bg-red-600 text-white rounded-full '>0</span>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default page