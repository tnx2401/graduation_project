"use client";
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { FaHandHoldingUsd } from "react-icons/fa";
import { GrLike } from "react-icons/gr";
import { BsStars } from "react-icons/bs";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { CheckIcon, Cog6ToothIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import useStore from '@/lib/zustand';
import axios from 'axios';
import Loading from '../loading';
import Swal from 'sweetalert2';
import { X, RefreshCw, XCircle, Crown, Sparkles, Check, Zap, CheckCircle } from 'lucide-react';

const BasicMembershipAnimation = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/434ba4e3-a1a1-4eb8-b7fc-847740dd7a12/gBGzwA7FYy.lottie"
      loop
      autoplay
      className='w-20 h-20'
    />
  );
}

const StandardMembersipAnimation = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/ca891e65-1eae-4272-a680-1ca618ca82e1/QAdjCCjN2O.lottie"
      loop
      autoplay
      className='w-32 h-32'
    />
  );
}

const PremiumMemberShipAnimation = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/bbea614a-d738-4d6c-a482-fecf94e0d3c8/N9O83ohKiu.lottie"
      loop
      autoplay
      className='w-32 h-32'
    />
  );
}

const getMembershipDetails = (membershipName) => {
  const details = {
    'Cơ bản': {
      description: "Phù hợp với môi giới mới hoặc giỏ hàng nhỏ",
      discount3: 21,
      discount6: 32,
      animation: <BasicMembershipAnimation />,
    },
    'Tiêu chuẩn': {
      description: "Phù hợp với môi giới chuyên nghiệp có giỏ hàng từ 10 BĐS",
      discount3: 26,
      discount6: 34,
      animation: <StandardMembersipAnimation />,
    },
    'Cao cấp': {
      description: "Phù hợp với môi giới có giỏ hàng và ngân sách quảng cáo lớn",
      discount3: 28,
      discount6: 39,
      animation: <PremiumMemberShipAnimation />,
    }
  };

  return details[membershipName] || {};
};

const Benefits = ({ count, label }) => (
  <h1 className={`flex gap-2 py-1 items-center ${count === 0 ? "line-through text-gray-400" : null}`}>
    {count > 0 ? (
      <p className="flex gap-3">
        <span><CheckIcon className="w-5 h-5 text-teal-500" /></span>{count}
      </p>
    ) : (
      <XMarkIcon className="w-5 h-5" />
    )}
    {label}
  </h1>
)

const MembershipDetails = ({ item }) => (
  <div>
    <p className='mb-3'>Gói tin hàng tháng</p>
    <Benefits count={item.free_gold_posts} label="Tin VIP Vàng (hiển thị 7 ngày)" />
    <Benefits count={item.free_silver_posts} label="Tin VIP Bạc (hiển thị 7 ngày)" />
    <Benefits count={item.free_normal_posts} label="Tin Thường (hiển thị 10 ngày)" />
    <Benefits count={item.free_push_posts} label="lượt đẩy cho Tin Thường" />
  </div>
);

const Page = () => {
  const [membershipInfo, setMembershipInfo] = useState();
  const [isChoosingDuration, setIsChoosingDuration] = useState(false);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [currentPack, setCurrentPack] = useState(null);
  const [user, setUser] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isOpenFunction, setIsOpenFunction] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const { uid } = useStore();

  useEffect(() => {
    axios.get(`/api/users/membership/getMembershipInfo`).then((res) => { setMembershipInfo(res.data) }).catch((err) => console.log(err));
  }, [])

  useEffect(() => {
    axios.post(`/api/users/getUserInformation`, { uid }).then((res) => { setUser(res.data[0]); setLoading(false) }).catch((err) => console.log(err));
  }, [uid])

  useEffect(() => {
    if (currentMembership?.duration?.length > 0) {
      setCurrentPack(currentMembership.duration[0]);
    }
  }, [currentMembership]);

  const handleDiscount = (id, price, percentage) => {
    if (id === 1) {
      return Math.floor(price * percentage / 1000) * 1000;
    } else if (id === 2) {
      return Math.floor(price * percentage / 1000) * 1000;
    } else {
      return Math.floor(price * percentage / 1000) * 1000;
    }
  }

  const getPostRankStyle = (postRankName) => {
    if (postRankName === "freeGoldPosts") {
      return "text-yellow-500";
    } else if (postRankName === "freeSilverPosts") {
      return "text-gray-500";
    } else if (postRankName === "freeNormalPosts") {
      return "text-green-500";
    } else {
      return;
    }
  }

  const getPostRankName = (postRankName) => {
    if (postRankName === "freeGoldPosts") {
      return "VIP Vàng";
    } else if (postRankName === "freeSilverPosts") {
      return "VIP Bạc";
    } else if (postRankName === "freeNormalPosts") {
      return "Thường";
    } else {
      return "Lượt đẩy tin";
    }
  }

  const handleBuyingMembership = () => {
    axios.post(`/api/users/membership/buyMembership`, {
      membership_id: currentMembership.id,
      user_id: uid,
      benefits: currentMembership.benefits,
      membership_duration: currentPack.name.split(" ")[0],
      total: currentPack.price.replace(/\./g, "").replace(",", "."),
    }).then(() => {
      setIsChoosingDuration(false);
      window.location.reload();
    }).catch((err) => console.log(err));

  }

  const handleCancel = () => {
    Swal.fire({
      title: 'Bạn có chắc muốn hủy hội viên?',
      text: "Hành động này sẽ xóa quyền lợi hiện tại của bạn.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Có, hủy ngay',
      cancelButtonText: 'Không, giữ lại'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.post(`/api/users/membership/cancelMembership`, {
          uid: user.uid
        }).then(() => {
          Swal.fire(
            'Đã hủy!',
            'Hội viên của bạn đã được hủy.',
            'success'
          )
          window.location.reload();
        })
      }
    })
  }

  const handleRenew = () => {
    setIsRenewing(true);
  }

  const RenewUI = () => {

    const [invoiceData, setInvoiceData] = useState([]);
    const [lastestDate, setLatestDate] = useState();

    useEffect(() => {
      if (!user?.uid) return;

      axios
        .get(`/api/users/membership/fetchLatestInvoice?uid=${user.uid}`)
        .then((res) => setInvoiceData(res.data))
        .catch((err) => console.log(err));
    }, [user?.uid]); // only run when uid is available

    useEffect(() => {
      setLatestDate(invoiceData[0]?.end_date)
    }, [invoiceData])


    const { discount3, discount6 } = getMembershipDetails(user.membership_name);
    const userMembership = membershipInfo.filter((membership) => membership.membership_name === user.membership_name);
    const item = userMembership[0];
    const pricePerMonth = item.price;

    const durations = [
      {
        label: '3 tháng',
        months: 3,
        discount: discount3,
      },
      {
        label: '6 tháng',
        months: 6,
        discount: discount6,
      },
    ];

    const handleSubmitRenew = () => {
      const lastestInvoiceDate = new Date(lastestDate); // latest expiry date
      const newExpiryDate = new Date(lastestInvoiceDate); // clone to avoid mutation

      // Add months
      newExpiryDate.setMonth(newExpiryDate.getMonth() + currentMembership.months);

      // Format total correctly (e.g., "200.000đ" -> 200000.00)
      const formattedTotal = parseFloat(currentMembership.total.replace(/\./g, "").replace(",", "."));

      axios.post(`/api/users/membership/renewMembership`, {
        user_id: user.uid,
        membership_id: user.membership_id,
        created_date: new Date(),
        end_date: newExpiryDate,
        total: formattedTotal
      })
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Gia hạn thành công!",
            text: `Hạn sử dụng mới đến ${newExpiryDate.toLocaleDateString("vi-VN")}`,
            confirmButtonText: "OK",
          }).then(() => {
            window.location.reload();
          });
        })
        .catch((error) => {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Gia hạn thất bại",
            text: "Đã xảy ra lỗi khi gia hạn. Vui lòng thử lại.",
          });
        });
    };

    return (
      <div className="flex flex-col gap-4">
        {durations.map((duration, index) => {
          const beforeDiscount = pricePerMonth * duration.months;
          const discountAmount = handleDiscount(item.id, pricePerMonth, duration.discount / 100);
          const finalMonthlyPrice = pricePerMonth - discountAmount;
          const total = finalMonthlyPrice * duration.months;

          return (
            <div
              key={index}
              className={`bg-white rounded-lg border shadow p-5 hover:-translate-y-2 transition-all cursor-pointer ${currentMembership?.months === duration?.months ? " border-blue-600" : ""}`}
              onClick={() => {
                setCurrentMembership({
                  id: item.id,
                  name: user.membership_name,
                  duration: duration.label,
                  months: duration.months,
                  discount: duration.discount,
                  total: total.toLocaleString('de-DE'),
                  saved: (discountAmount * duration.months).toLocaleString('de-DE'),
                });
              }}
            >
              <h2 className="text-lg font-semibold mb-2">{duration.label}</h2>
              <p className="text-sm text-gray-600 mb-1">
                Giá gốc: <span className="line-through">{beforeDiscount.toLocaleString('de-DE')}đ</span>
              </p>
              <p className="text-xl font-bold text-red-500 mb-5">
                {total.toLocaleString('de-DE')}đ
              </p>

            </div>
          );
        })}
        <button className='border shadow bg-red-500 p-2 rounded-lg text-white' onClick={handleSubmitRenew}>Gia hạn</button>
      </div>
    );
  };

  const rankOrder = ["freeGoldPosts", "freeSilverPosts", "freeNormalPosts", "freePushPosts"];

  const sortedBenefits = user?.benefit_usage?.slice().sort(
    (a, b) => rankOrder.indexOf(a.benefit_type) - rankOrder.indexOf(b.benefit_type)
  );

  if (loading) {
    return <Loading />
  }

  if (user?.membership_id) {
    return (
      <div className="">
        <h1 className="p-10 text-3xl font-bold border-b shadow bg-white">
          Thông tin hội viên
        </h1>
        <div className='p-6'>
          <div className="p-6 bg-white rounded-lg shadow-lg mt-5">
            <div className='flex items-center justify-between'>
              <h2 className="text-lg font-semibold flex items-center">
                Gói hội viên hiện tại:
                <span
                  className={`ml-3 px-4 py-1 text-white rounded-full shadow-lg text-sm tracking-wide uppercase font-medium ${user.membership_name === "Cơ bản"
                    ? "bg-gray-500"
                    : user.membership_name === "Tiêu chuẩn"
                      ? "bg-yellow-500"
                      : user.membership_name === "Cao cấp"
                        ? "bg-teal-500"
                        : "bg-gray-300"
                    }`}
                >
                  {user.membership_name}
                </span>
              </h2>
              <button className='hover:scale-110 transition' onClick={() => setIsOpenFunction(true)}><Cog6ToothIcon className='w-6 h-6' /></button>
            </div>

            <div className="mt-4 space-y-2 text-gray-700">
              <p className="flex justify-between">
                <span className="font-medium">📅 Ngày gia nhập:</span>
                <span className="border border-gray-300 px-4 py-1 rounded-lg shadow-sm">
                  {new Date(user.created_date).toLocaleDateString("vi-VN")}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">⏳ Ngày hết hạn:</span>
                <span className="border border-gray-300 px-4 py-1 rounded-lg shadow-sm">
                  {new Date(user.end_date).toLocaleDateString("vi-VN")}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-10 bg-white rounded-lg shadow-lg">
            <h2 className="p-5 text-xl font-semibolds rounded-t-lg border-b">
              🎁 Quyền Lợi
            </h2>
            <div className="p-6 space-y-5">
              {sortedBenefits.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 transition">
                  <p className="flex items-center">
                    {item.benefit_type === "freeGoldPosts" && "🏆"}
                    {item.benefit_type === "freeSilverPosts" && "⭐"}
                    {item.benefit_type === "freeNormalPosts" && "📌"}
                    {item.benefit_type === "freePushPosts" && "🔝"}
                    <span className={`ml-2 px-3 py-1 rounded-lg text-sm font-semibold ${getPostRankStyle(item.benefit_type)}`}>
                      {getPostRankName(item.benefit_type)}
                    </span>
                  </p>
                  <span className="text-xl font-bold text-blue-600">{item.remaining_quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {isOpenFunction && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 scale-1"></div>
              {isRenewing ? (
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-96 max-w-full transform transition-all duration-300 animate-in">
                  <div className="mb-8">
                    <div className='flex items-center justify-between'>
                      <h3 className="text-2xl font-bold text-gray-800 text-center">
                        Gia hạn gói hội viên
                      </h3>
                      <button onClick={() => setIsRenewing(false)}><XMarkIcon className='w-5 h-5' /></button>
                    </div>
                    <p className='mt-3 mb-5'>Số dư tài khoản: {(Number(user.balance)).toLocaleString("de-DE")} đ</p>
                    <RenewUI />
                  </div>
                </div>
              ) : (
                <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-96 max-w-full transform transition-all duration-300 animate-in">
                  {/* Close button */}
                  <button
                    onClick={() => setIsOpenFunction(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} />
                  </button>

                  {/* Header with icon */}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      Chức năng gói hội viên
                    </h3>
                    <div className="flex items-center justify-center text-sm text-gray-500">
                      <Sparkles size={16} className="mr-1" />
                      Quản lý membership của bạn
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={handleRenew}
                      className="group w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-300" />
                      <span>Gia hạn gói hội viên</span>
                    </button>

                    <button
                      onClick={handleCancel}
                      className="group w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                    >
                      <XCircle size={20} className="group-hover:scale-110 transition-transform duration-200" />
                      <span>Hủy gói hội viên</span>
                    </button>
                  </div>

                  {/* Decorative elements */}

                  {/* Bottom info */}
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400 text-center">
                      Thay đổi có hiệu lực ngay lập tức
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    )
  } else {
    return (
      <div className='w-full h-screen overflow-hidden relative'>
        <div className='w-full h-1/2 relative flex flex-col items-center'>
          <Image
            src="/image/bg_register.4ac632df.png"
            alt="membership-cover"
            fill
            className="object-cover"
          />
          <div className='z-10 w-full h-2/3 px-24 mt-20 text-gray-200'>
            <h1 className='text-4xl'>Gói Hội viên</h1>
            <p className='text-2xl py-2'><span className='text-red-500'>Tiết kiệm đến 39%</span> chi phí so với đăng tin/đẩy tin lẻ</p>
            <ul>
              {[{ icon: <FaHandHoldingUsd />, text: "Thảnh thơi đăng tin/đẩy tin không lo biến động giá" }, { icon: <GrLike />, text: "Quản lý ngân hàng dễ dàng và hiệu quả" }, { icon: <BsStars />, text: "Sử dụng các tính năng tiện ích nâng cao dành cho Hội viên" }].map((item, index) => (
                <li key={index} className='flex gap-5 py-2'>{item.icon} {item.text}</li>
              ))}
            </ul>
          </div>
        </div>
        <ul className='flex w-full h-full gap-10 absolute top-1/2 -translate-y-32 px-10'>
          {membershipInfo?.map((item, index) => {
            const { description, discount3, discount6, animation } = getMembershipDetails(item.membership_name);

            return (
              <li
                key={index}
                className={`w-1/3 bg-white h-full rounded-lg border shadow hover:-translate-y-5 transition-all transform duration-300 ease-in-out ${item.membership_name === 'Cơ bản' ? "pt-10" : 'pt-3'} px-5`}
              >
                <div className={`flex items-center justify-between ${item.membership_name === 'Cơ bản' ? "mb-6" : ''}`}>
                  <div>
                    <h1 className="text-xl">Hội viên {item.membership_name}</h1>
                    <p className="text-xs">{description}</p>
                  </div>
                  {animation}
                </div>
                <p>
                  từ <span className='text-2xl'>{(item.price - handleDiscount(item.id, item.price, discount6 / 100)).toLocaleString("de-DE")}</span>đ/tháng{" "}
                  <span className="text-red-500">(-{discount6}%)</span>
                </p>
                <p className='text-sm'>Tiết kiệm đến <span className='text-teal-500'>{handleDiscount(item.id, item.price, discount6 / 100).toLocaleString("de-DE")} đ mỗi tháng</span></p>
                <button className='w-full border border-red-500 text-red-500 rounded-lg my-12 py-2 hover:bg-red-100'
                  onClick={() => {
                    setIsChoosingDuration(true);
                    setCurrentMembership({
                      id: item.id,
                      name: item.membership_name,
                      animation: animation,
                      price: (item.price - handleDiscount(item.id, item.price, discount6 / 100)).toLocaleString("de-DE"),
                      benefits: {
                        freeGoldPosts: item.free_gold_posts,
                        freeSilverPosts: item.free_silver_posts,
                        freeNormalPosts: item.free_normal_posts,
                        freePushPosts: item.free_push_posts
                      },
                      duration: [
                        {
                          name: '3 tháng',
                          beforeDiscount: item.price * 3,
                          discount: discount3,
                          price: ((item.price - handleDiscount(item.id, item.price, discount3 / 100)) * 3).toLocaleString("de-DE"),
                          saved: handleDiscount(item.id, item.price, discount3 / 100).toLocaleString("de-DE")
                        },
                        {
                          name: '6 tháng',
                          beforeDiscount: item.price * 6,
                          discount: discount6,
                          price: ((item.price - handleDiscount(item.id, item.price, discount6 / 100)) * 6).toLocaleString("de-DE"),
                          saved: handleDiscount(item.id, item.price, discount6 / 100).toLocaleString("de-DE")
                        }
                      ]
                    })
                  }}>Mua ngay</button>
                <MembershipDetails item={item} />

              </li>
            );
          })}
        </ul>
        {isChoosingDuration && (
          <div className='absolute w-screen h-screen bg-black bg-opacity-50 top-0 left-0 z-50'>
            <div className='w-1/4 bg-white  rounded-lg border shadow absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
              <div className='flex justify-between items-center px-5 py-3 border-b'>
                <h1 className='py-2'>Mua gói hội viên</h1>
                <button onClick={() => setIsChoosingDuration(false)}>X</button>
              </div>
              <div className='flex items-center gap-5 p-5 bg-gray-100'>
                {currentMembership?.animation}
                <div>
                  <h1 className='text-xl'>Hội viên {currentMembership?.name}</h1>
                  <h1 className='text-sm'>Từ {currentMembership?.price} đ/tháng <span className='text-xs text-gray-400'>(khi mua 6 tháng)</span></h1>
                </div>
              </div>
              <div className='p-5'>
                <h1>Chọn thời gian</h1>
                <div>
                  {currentMembership?.duration.map((item, index) => (
                    <div key={index} className={`flex items-center justify-between border rounded-md p-3 my-3 cursor-pointer ${currentPack?.name === item.name ? 'border-black shadow-md' : ''}`}
                      onClick={() => setCurrentPack(item)}
                    >
                      <div className='flex flex-col gap-2'>
                        <h1>{item.name}</h1>
                        <h1 className='text-sm'>{item.price} đ <span className='line-through text-gray-400'>{item.beforeDiscount.toLocaleString("de-DE")} đ</span></h1>
                      </div>
                      <div className='text-xs flex flex-col items-end gap-2'>
                        <h1 className='bg-red-100 text-red-500 inline px-1'>-{item.discount}% so với mua lẻ</h1>
                        <h1>Tiết kiệm <span className='text-teal-400'>{item.saved} đ/tháng</span></h1>
                      </div>
                    </div>
                  ))}
                  <ul className='text-sm text-gray-500 list-disc pl-5'>
                    <li>Gói Hội viên có thời hạn 3 tháng hoặc 6 tháng.</li>
                    <li>Hội viên sẽ được cung cấp các quyền lợi theo từng tháng (30 ngày).</li>
                    <li>Các quyền lợi có thời hạn sử dụng trong vòng 30 ngày.</li>
                    <li>Gói Hội viên sẽ được tự động gia hạn vào cuối kì. Bạn có thể tắt chức năng tự động gia hạn này.</li>
                    <li>Từ ngày 19/07/2024, Gói Hội viên chỉ được thanh toán từ TK Chính.</li>
                  </ul>

                  <div>
                    {(() => {
                      const parsedPrice = parseFloat(
                        (currentPack?.price || "0").replace(/\./g, "").replace(",", ".")
                      );
                      const balance = Number(user?.balance);
                      return parsedPrice > balance ? (
                        <div className="bg-yellow-50 p-5 rounded-lg mt-5 flex items-center">
                          <ExclamationTriangleIcon className="w-10 h-10 text-yellow-500 inline" />
                          <h1 className="ml-2 w-1/2 flex-grow">Tài khoản chính của bạn chưa đủ tiền</h1>
                          <button className="bg-red-500 text-white rounded-lg px-2 py-2 ml-4">Nạp tiền</button>
                        </div>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>

              <div className='p-4 px-5 border-t flex justify-between'>
                <div>
                  <h1 className='text-sm text-gray-500'>Tổng cộng</h1>
                  <h1 className='text-xl'>{currentPack?.price} đ</h1>
                </div>
                <button className='bg-red-500 text-white rounded-lg py-1 px-3' onClick={handleBuyingMembership}>Thanh toán</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default Page
