"use client"
import { AdjustmentsHorizontalIcon, CalendarIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect } from 'react'
import useStore from '@/lib/zustand'
import axios from 'axios'
import Image from 'next/image'
import Loading from '../loading'
import Swal from 'sweetalert2'
import Paginate from '@/components/general_page/shared/Paginate'

const page = () => {
    const [categoryItem, setCategoryItem] = useState([
        { name: "Tất cả", item: [] },
        { name: "Hết hạn", item: [] },
        { name: "Sắp hết hạn", item: [] },
        { name: "Đang hiển thị", item: [] },
        { name: "Chờ hiển thị", item: [] },
        { name: "Chờ duyệt", item: [] },
        { name: "Không duyệt", item: [] },
        { name: "Đã hạ", item: [] },
    ])
    const [currentTab, setCurrentTab] = useState(categoryItem[0]);
    const { uid } = useStore();
    const [clientUid, setClientUid] = useState(null);
    const [userInformation, setUserInformation] = useState();
    const [postData, setPostData] = useState([]);
    const [searchData, setSearchData] = useState('')
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(true);
    const today = new Date();

    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    useEffect(() => {
        setClientUid(uid);
        axios.post("/api/users/getUserInformation", {
            uid: uid
        }).then((res) => {
            setUserInformation(res.data[0]);
        }).catch((error) => {
            console.log(error);
        })
    }, [uid]);

    useEffect(() => {
        if (uid) {
            axios.get("/api/users/posts/getPostByUserId", {
                params: { uid: clientUid }
            }).then((res) => {
                setPostData(res.data);
                setLoading(false);
            }).catch((error) => {
                console.log(error);
                setLoading(false);
            })
        }
    }, [clientUid])

    const shouldPostBeInCategory = (post, categoryName) => {
        const now = new Date();
        const postEndDate = new Date(post.post_end_date); // Assuming post has an `endDate`
        const postStartDate = new Date(post.post_start_date);

        switch (categoryName) {
            case "Hết hạn":
                return postEndDate < now;
            case "Sắp hết hạn":
                return postEndDate > now && (postEndDate - now) < 3 * 24 * 60 * 60 * 1000; // Less than 3 days left
            case "Đang hiển thị":
                return post.verify_status === "Đã duyệt" && now > postStartDate && now < postEndDate;
            case "Chờ hiển thị":
                return postStartDate > now;
            case "Chờ duyệt":
                return post.verify_status === "Chờ duyệt";
            case "Không duyệt":
                return post.verify_status === "Không duyệt";
            case "Đã hạ":
                return post.is_sale;
            default:
                return true;
        }
    };

    useEffect(() => {
        if (postData.length > 0) {
            const newCategoryItem = categoryItem.map((category) => ({
                ...category,
                item: postData.filter((post) => shouldPostBeInCategory(post, category.name)),
            }));

            setCategoryItem(newCategoryItem);
        }
    }, [postData])

    console.log(searchData);

    useEffect(() => {
        if (postData.length > 0) {
            let filteredPosts;

            filteredPosts = postData.filter((post) => {
                return (
                    (post.title.toLowerCase().includes(searchData.toLowerCase()) ||
                        post.display_address.toLowerCase().includes(searchData.toLowerCase()) ||
                        post.id == searchData
                    ));
            });
            const newCategoryItem = categoryItem.map((category) => ({
                ...category,
                item: filteredPosts.filter((post) => shouldPostBeInCategory(post, category.name)),
            }));
            setCategoryItem(newCategoryItem);
            setLoading(false);
        }
    }, [searchData]);

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("vi-VN");
    };

    const handleShowingDiscountButton = () => {
        if (userInformation && Array.isArray(userInformation.benefit_usage)) {
            return userInformation.benefit_usage.some(item =>
                item.benefit_type === "freePushPosts" && item.remaining_quantity > 0
            );
        }
        return false;
    }
    const handlePushPost = (order, id, rank_name, verify_status, uid, balance, amount) => {
        let cost;
        if (rank_name === "VIP Kim Cương") {
            cost = 50000;
        } else if (rank_name === "VIP Vàng") {
            cost = 35000;
        } else if (rank_name === "VIP Bạc") {
            cost = 20000;
        } else {
            cost = 5000;
        }
        if (currentTab.name === "Đang hiển thị" || currentTab.name === "Sắp hết hạn" || currentTab.name === "Tất cả" && verify_status === "Đã duyệt") {
            if (order === 0) {
                Swal.fire({
                    title: 'Thông báo',
                    text: `Phí đẩy của tin hạng ${rank_name} là ${cost.toLocaleString("de-DE")} đ, bạn có muốn tiếp tục ?`,
                    icon: 'info',
                    confirmButtonText: 'Tiếp tục',
                    showDenyButton: handleShowingDiscountButton(),
                    denyButtonText: 'Sử dụng giảm giá',
                    reverseButtons: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        axios.post("/api/handle_posts/pushPost", {
                            order: order + 1,
                            post_id: id,
                            user_id: uid,
                            balance: Number(balance) - Number(cost),
                            amount: Number(amount) + Number(cost)
                        }).then((res) => {
                            if (res.status === 200) {
                                Swal.fire({
                                    title: 'Thông báo',
                                    text: 'Đẩy tin thành công',
                                    icon: 'success',
                                    confirmButtonText: 'Oke',
                                    allowOutsideClick: true,
                                    allowEscapeKey: true,
                                }).then((result) => {
                                    if (result.isConfirmed || result.isDismissed) {
                                        // Reload the page
                                        window.location.reload();
                                    }
                                });

                            }
                        })
                    } else if (result.isDenied) {
                        axios.post("/api/handle_posts/pushPost", {
                            order: order + 1,
                            post_id: id,
                            user_id: uid,
                            balance: Number(balance),
                            amount: Number(amount),
                            minusDiscount: true,
                        }).then((res) => {
                            if (res.status === 200) {
                                Swal.fire({
                                    title: 'Thông báo',
                                    text: `Đẩy tin thành công`,
                                    icon: 'success',
                                    confirmButtonText: 'Oke'
                                }).then((result) => {
                                    if (result.isConfirmed || result.isDismissed) {
                                        // Reload the page
                                        window.location.reload();
                                    }
                                });
                            }
                        })
                    }
                })
            } else {
                Swal.fire({
                    title: 'Thông báo',
                    text: 'Bạn chỉ có thể đẩy tin 1 lần',
                    icon: 'info',
                    confirmButtonText: 'Oke'
                })
            }
        }
    }

    const handleAdvertising = (post_id) => {
        Swal.fire({
            title: "Thông báo",
            text: "Đồng ý đăng tin quảng cáo? Phí quảng cáo sẽ tính theo số lượt xem tin (1000đ/ một lượt xem)",
            icon: 'question',
            confirmButtonText: 'Oke'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/handle_posts/advertisePost`, {
                    post_id: post_id,
                    condition: true,
                }).then(() => {
                    Swal.fire(
                        {
                            title: 'Thông báo',
                            text: `Quảng cáo tin thành công!`,
                            icon: 'success',
                            confirmButtonText: 'Oke'
                        }
                    ).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            location.reload();
                        }
                    })
                })
            }
        })
    }

    const handleRemoveAdvertising = (post_id) => {
        Swal.fire({
            title: "Thông báo",
            text: "Bạn có chắc chắn muốn dừng quảng cáo?",
            icon: 'question',
            confirmButtonText: 'Oke'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(`/api/handle_posts/advertisePost`, {
                    post_id: post_id,
                    condition: false,
                }).then(() => {
                    Swal.fire(
                        {
                            title: 'Thông báo',
                            text: `Dừng quảng cáo tin thành công!`,
                            icon: 'success',
                            confirmButtonText: 'Oke'
                        }
                    ).then((result) => {
                        if (result.isConfirmed || result.isDismissed) {
                            location.reload();
                        }
                    })
                })
            }
        })
    }

    const handleToggleSaleStatus = async (post_id) => {
        const selectedPost = postData.find(post => post.id === post_id);
        if (!selectedPost) return;

        if (selectedPost.is_sale) {
            Swal.fire({
                title: 'Không thể thay đổi',
                text: 'Tin đã bán không thể chuyển lại thành đang rao bán.',
                icon: 'warning',
                confirmButtonText: 'Đã hiểu',
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Xác nhận đã bán?',
            text: 'Bạn chắc chắn muốn đánh dấu tin này là "Đã bán"?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Huỷ',
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            setPostData(prev =>
                prev.map(post =>
                    post.id === post_id ? { ...post, is_sale: true } : post
                )
            );

            await axios.put(`/api/users/posts/updateSalePost?post_id=${post_id}`);
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Lỗi',
                text: 'Không thể cập nhật trạng thái. Vui lòng thử lại.',
                icon: 'error',
                confirmButtonText: 'Đóng',
            });

            // Optional: Revert UI (though it's already not reversible in this logic)
            setPostData(prev =>
                prev.map(post =>
                    post.id === post_id ? { ...post, is_sale: false } : post
                )
            );
        }
    };


    if (loading) {
        return <Loading />
    }

    return (
        <div className=''>
            <div className='p-5 border-b pb-2 shadow' onClick={() => setIsSearching(false)}>
                <h1 className='text-2xl'>Danh sách tin</h1>
                <div className='flex gap-5 mt-5'>
                    <input
                        className={`border-gray-400 rounded-lg ${isSearching ? "w-72" : "w-40"} transition-all`}
                        placeholder='Tìm theo mã tin, tiêu đề'
                        onChange={(e) => setSearchData(e.target.value)}
                        onClick={(e) => { setIsSearching(true); e.stopPropagation() }}
                    />
                    <div className='relative'>
                        <CalendarIcon className='w-6 h-6 absolute top-1/2 left-2 -translate-y-1/2' />
                        <select className='pl-10 border-gray-400 rounded-lg'>
                            <option>Mặc định</option>
                        </select>
                    </div>
                </div>
                <ul className='flex gap-5 mt-5 ml-1'>
                    {categoryItem.map((item, index) => (
                        <li key={index} className={`${currentTab?.name === item.name ? "border-b-2 border-red-500" : ""} pb-2`}>
                            <div className='flex gap-2 cursor-pointer text-sm' onClick={() => setCurrentTab(item)}>
                                <h1>{item.name}</h1>
                                <span>({item.item.length})</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                {categoryItem.map((item) => {
                    if (currentTab?.name === item.name) {
                        return (
                            <div key={item.name} className='w-3/4 mx-auto py-10'>
                                {item.item.length > 0 ? (
                                    <>
                                        {item.item.slice(startIndex, endIndex).map((subItem, subIndex) => (
                                            <div key={subIndex} className={`p-3 border mb-5 rounded-lg shadow relative ${currentTab.name === "Hết hạn" || currentTab.name === "Đã hạ" || currentTab.name === "Không duyệt" ? "bg-rose-200/50" : "bg-white"}`}>
                                                <span className={`${subItem.rank_name === 'VIP Kim Cương' ? 'bg-red-500' : subItem.rank_name === 'VIP Vàng' ? 'bg-yellow-500' : subItem.rank_name === 'VIP Bạc' ? 'bg-green-500' : 'bg-gray-500'} text-white px-2 py-1 rounded-md absolute top-4 -left-2 text-xs shadow`}>{subItem.rank_name}</span>
                                                <div className='flex'>
                                                    <div className="w-[150px] h-[150px] overflow-hidden rounded-lg">
                                                        <Image
                                                            src={subItem.images[0]}
                                                            width={200}
                                                            height={200}
                                                            alt="post thumbnail"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    <div className='mx-2 border-r w-8/12'>
                                                        <h1 className=''><span className={`${subItem.verify_status === "Đã duyệt" ? "bg-green-600" : subItem.verify_status === "Không duyệt" ? "bg-red-600" : "bg-yellow-500"} text-white p-1 px-2  rounded-md text-sm mr-2`}>{subItem.verify_status}</span>{subItem.title}</h1>
                                                        <p className='text-neutral-500 text-sm mt-2'>{subItem.demand} <span className='lowercase'>{subItem.type}</span> - {subItem.display_address}</p>
                                                        {(subItem.verify_status === "Đã duyệt" &&
                                                            new Date(subItem.post_start_date) <= today &&
                                                            new Date(subItem.post_end_date) >= today) && (
                                                                <label className="flex items-center gap-2 cursor-pointer mt-3">
                                                                    <span
                                                                        className={`text-sm font-medium ${!subItem.is_sale ? "text-green-600" : "text-red-600"
                                                                            }`}
                                                                    >
                                                                        {!subItem.is_sale ? "Đang rao bán" : "Đã bán"}
                                                                    </span>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={subItem.is_sale}
                                                                        onChange={() => handleToggleSaleStatus(subItem.id)}
                                                                        className="sr-only"
                                                                    />

                                                                    <div
                                                                        className={`w-10 h-5 rounded-full relative transition-colors duration-300
                                                                        ${subItem.is_sale ? "bg-red-500" : "bg-green-500"}`}
                                                                    >
                                                                        <div
                                                                            className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0 scale-90
                                                                            transition-all duration-300 ease-in-out
                                                                            ${subItem.is_sale ? "left-5" : "left-0"}
                                                                            `}
                                                                        ></div>
                                                                    </div>
                                                                </label>
                                                            )}
                                                        <div className='flex items-center gap-10 flex-wrap'>
                                                            {[
                                                                { name: "Mã tin", value: subItem.id },
                                                                { name: "Ngày đăng", value: formatDate(subItem.post_start_date) },
                                                                { name: "Ngày hết hạn", value: formatDate(subItem.post_end_date) },
                                                                { name: "Lượt xem từ quảng cáo", value: subItem.advertisement_view_count, show: subItem.advertisement },
                                                                { name: "Tổng chi phí cho quảng cáo", value: (Number(subItem.advertisement_view_count) * 1000).toLocaleString("de-DE"), show: subItem.advertisement },
                                                                { name: "Lý do từ chối tin đăng", value: subItem.refund_reason, show: subItem.verify_status === "Không duyệt", isReason: true }
                                                            ]
                                                                .filter(item => item.show === undefined || item.show)
                                                                .map((item, index) => (
                                                                    <div key={index} className={`text-sm mt-4 text-neutral-500`}>
                                                                        <h1>{item.name}</h1>
                                                                        <p className={`${item.isReason ? "text-red-800" : "text-neutral-500"}`}>{item.value}</p>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>

                                                    <div className='flex-grow flex flex-col gap-2'>
                                                        <div className={`grid grid-cols-2 gap-x-10 justify-evenly rounded-lg flex-grow ${currentTab.name === "Hết hạn" || currentTab.name === "Đã hạ" || currentTab.name === "Không duyệt" ? "bg-rose-200" : "bg-green-100"}`}>
                                                            {[{ name: "Lượt xem", value: subItem.view_count }, { name: "Lượt thích", value: subItem.interested_count }].map((item, index) => (
                                                                <div key={index} className='text-neutral-500 text-sm mt-4 flex flex-col items-center'>
                                                                    <h1>{item.name}</h1>
                                                                    <p>{item.value}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className='flex gap-3'>
                                                            {new Date(subItem.post_end_date) > today && !subItem.advertisement && subItem.verify_status !== "Không duyệt" && (
                                                                <button className='p-1 border-blue-300 border rounded-lg text-blue-300 w-1/2 hover:scale-105' onClick={() => handleAdvertising(subItem.id)}>Quảng cáo</button>
                                                            )}
                                                            {new Date(subItem.post_end_date) > today && subItem.advertisement && subItem.verify_status !== "Không duyệt" && (
                                                                <button className='p-1 border-blue-300 border rounded-lg text-blue-300 w-2/3 hover:scale-105' onClick={() => handleRemoveAdvertising(subItem.id)}>Dừng quảng cáo</button>
                                                            )}
                                                            {subItem.verify_status !== "Không duyệt" && (
                                                                <button onClick={() => handlePushPost(subItem.order, subItem.id, subItem.rank_name, subItem.verify_status, subItem.uid, subItem.balance, subItem.amount)}
                                                                    className={`p-1 border-blue-300 border rounded-lg text-blue-300 w-1/2 hover:scale-105 ${new Date(subItem.post_end_date) > today ? 'w-1/2' : 'w-full'}`}>
                                                                    {new Date(subItem.post_end_date) < today ? "Đăng lại" : "Đẩy tin"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        < Paginate totalItems={item.item.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
                                    </>
                                ) : (
                                    <p>No posts available</p>
                                )}
                            </div>
                        );
                    }

                    return null; // Ensures proper behavior when tab does not match
                })}
            </div>
        </div>
    )
}

export default page