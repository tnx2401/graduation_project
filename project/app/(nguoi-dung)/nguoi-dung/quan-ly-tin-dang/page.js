"use client"
import { AdjustmentsHorizontalIcon, CalendarIcon } from '@heroicons/react/24/outline'
import React, { useState, useEffect } from 'react'
import useStore from '@/lib/zustand'
import axios from 'axios'
import Image from 'next/image'
import Loading from '../loading'

const page = () => {
    const [categoryItem, setCategoryItem] = useState([
        { name: "Tất cả", item: [] },
        { name: "Hết hạn", item: [] },
        { name: "Sắp hết hạn", item: [] },
        { name: "Đang hiển thị", item: [] },
        { name: "Chờ hiển thị", item: [] },
        { name: "Chờ duyệt", item: [] },
        { name: "Chờ thanh toán", item: [] },
        { name: "Không duyệt", item: [] },
        { name: "Đã hạ", item: [] },
    ])
    const [currentTab, setCurrentTab] = useState(categoryItem[0]);
    const { uid } = useStore();
    const [clientUid, setClientUid] = useState(null);
    const [postData, setPostData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setClientUid(uid);
    }, [uid]);


    useEffect(() => {
        if (uid) {
            axios.get("/api/handle_posts/getPostByUserId", {
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
                return post.status === "Chờ duyệt";
            case "Chờ thanh toán":
                return post.status === "Chờ thanh toán";
            case "Không duyệt":
                return post.status === "Không duyệt";
            case "Đã hạ":
                return post.status === "Đã hạ";
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

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("vi-VN");
    };

    if (loading) {
        return <Loading />
    }

    console.log(currentTab);

    return (
        <div className=''>
            <div className='p-5 border-b pb-2 shadow'>
                <h1 className='text-2xl'>Danh sách tin</h1>
                <div className='flex gap-5 mt-5'>
                    <input className='border-gray-400 rounded-lg w-60' placeholder='Tìm theo mã tin, tiêu đề' />
                    <div className='relative'>
                        <CalendarIcon className='w-6 h-6 absolute top-1/2 left-2 -translate-y-1/2' />
                        <select className='pl-10 border-gray-400 rounded-lg'>
                            <option>Mặc định</option>
                        </select>
                    </div>
                    <button className='flex items-center gap-2 border-gray-400 border rounded-lg px-2'><AdjustmentsHorizontalIcon className='w-6 h-6' /> Lọc</button>
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
                                    item.item.map((subItem, subIndex) => (
                                        <div key={subIndex} className={`p-3 border mb-5 rounded-lg shadow ${currentTab.name === "Hết hạn" || currentTab.name === "Đã hạ" || currentTab.name === "Không duyệt" ? "bg-rose-200/50" : "bg-white"}`}>
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
                                                    <h1><span className={`${subItem.verify_status === "Đã duyệt" ? "bg-green-600" : subItem.verify_status === "Không duyệt" ? "bg-red-600" : ""} text-white p-1 px-2  rounded-md text-sm mr-2`}>{subItem.verify_status}</span>{subItem.title}</h1>
                                                    <p className='text-neutral-500 text-sm mt-2'>{subItem.demand} <span className='lowercase'>{subItem.type}</span> - {subItem.display_address}</p>
                                                    <div className='flex items-center gap-10'>
                                                        {[{ name: "Mã tin", value: subItem.id }, { name: "Ngày đăng", value: formatDate(subItem.post_start_date) }, { name: "Ngày hết hạn", value: formatDate(subItem.post_end_date) }].map((item, index) => (
                                                            <div key={index} className='text-neutral-500 text-sm mt-4'>
                                                                <h1>{item.name}</h1>
                                                                <p>{item.value}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className='flex-grow flex flex-col gap-2'>
                                                    <div className={`flex gap-10 justify-evenly rounded-lg flex-grow ${currentTab.name === "Hết hạn" || currentTab.name === "Đã hạ" || currentTab.name === "Không duyệt" ? "bg-rose-200" : "bg-green-100"}`}>
                                                        {[{ name: "Lượt xem", value: subItem.view_count }, { name: "Lượt thích", value: subItem.interested_count }].map((item, index) => (
                                                            <div key={index} className='text-neutral-500 text-sm mt-4 flex flex-col items-center'>
                                                                <h1>{item.name}</h1>
                                                                <p>{item.value}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button className='p-1 border-blue-300 border rounded-lg text-blue-300'>{currentTab.name === "Hết hạn" || currentTab.name === "Đã hạ" || currentTab.name === "Không duyệt" ? "Đăng lại" : "Đẩy tin"}</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
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