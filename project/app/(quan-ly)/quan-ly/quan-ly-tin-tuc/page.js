"use client"
import CreateNew from '@/components/admin_page/news/CreateNew';
import { PencilSquareIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Link from 'next/link';
import Swal from 'sweetalert2';
import pathFunction from '@/components/general_page/shared/pathFunction';

const page = () => {
    const subject = [
        { name: "Tất cả tin tức", items: [] },
        { name: "Tin tức bất động sản", items: [] },
        { name: "Bất động sản Hà Nội", items: [] },
        { name: "Bất động sản Hồ Chí Minh", items: [] },
        { name: "Báo cáo thị trường", items: [] },
        { name: "Mua bất đông sản", items: [] },
        { name: "Bán bất động sản", items: [] },
        { name: "Thuê bất động sản", items: [] },
        { name: "Quy hoạch - Pháp lý", items: [] },
        { name: "Tài chính", items: [] },
    ]
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [currentTab, setCurrentTab] = useState(subject[0]);
    const [news, setNews] = useState([]);
    const [categorizedNews, setCategorizedNews] = useState(subject.map(s => ({ ...s, items: [] })));
    const [editInitialData, setEditInitialData] = useState(null);

    useEffect(() => {
        axios.get(`/api/admin/news/fetchNews`)
            .then((res) => {
                setNews(res.data);
            }).catch((error) => {
                console.error("Error fetching news:", error);
            });
    }, []);

    useEffect(() => {
        if (news.length > 0) {
            categorizeNews(news);
        }
    }, [news]);

    useEffect(() => {
        if (categorizedNews.length > 0) {
            setCurrentTab(categorizedNews[0]);
        }
    }, [categorizedNews]);


    const categorizeNews = (newsList) => {
        const updatedSubjects = subject.map(s => ({ ...s, items: [] })); // Reset items

        newsList.forEach(newsItem => {
            const { tags } = newsItem;
            updatedSubjects.forEach(sub => {
                if (tags.includes(sub.name)) {
                    sub.items.push(newsItem);
                }
            });
        });

        // Add all news to "Tất cả tin tức"
        updatedSubjects[0].items = [...newsList];

        setCategorizedNews(updatedSubjects);
    };

    const convertDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', options);
    }

    const handleDeleteNew = (id, title) => {
        Swal.fire({
            title: `Bạn chắc chắn muốn xoá tin "${title}"?`,
            text: "Dữ liệu sẽ bị xoá vĩnh viễn và không thể khôi phục!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xác nhận xoá",
            cancelButtonText: "Huỷ",
        }).then((firstResult) => {
            if (firstResult.isConfirmed) {
                Swal.fire({
                    title: "Bạn thực sự chắc chắn chứ?",
                    text: "Hành động này không thể hoàn tác!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#d33",
                    cancelButtonColor: "#3085d6",
                    confirmButtonText: "Tôi đồng ý xoá",
                    cancelButtonText: "Không xoá",
                }).then(async (secondResult) => {
                    if (secondResult.isConfirmed) {
                        try {
                            await axios.post("/api/admin/news/deleteNew", { id });
                            Swal.fire("Đã xoá!", `"${title}" đã được xoá thành công.`, "success").then((thirdResult) => {
                                if (thirdResult.isConfirmed) {
                                    window.location.reload();
                                }
                            })
                        } catch (error) {
                            console.error("Delete error:", error);
                            Swal.fire("Lỗi", "Đã xảy ra lỗi khi xoá bài viết.", "error");
                        }
                    }
                });
            }
        });
    };


    return (
        <>
            <div>
                <h1 className='p-5 py-8 text-2xl bg-white border-b shadow'>Tin tức</h1>

                <ul className='grid grid-cols-7 gap-3 p-3'>
                    {categorizedNews.map((item, index) => (
                        <li key={index} className={`flex items-center justify-between p-3 text-sm rounded-lg shadow cursor-pointer hover:scale-105 transition-all border ${currentTab.name === item.name ? "bg-green-600 text-white" : "text-gray-700"}`} onClick={() => setCurrentTab(item)}>
                            {item.name} <span>{item.items.length}</span>
                        </li>
                    ))}
                    <li className='flex items-center justify-center gap-2 p-3 text-sm rounded-lg shadow cursor-pointer hover:scale-105 transition-all border bg-gray-600/50 text-white'
                        onClick={() => setIsCreatingNew(true)}
                    >
                        <span><PlusCircleIcon className='w-5 h-5' /></span>Đăng tin mới
                    </li>
                </ul>

                <table className='w-full mt-10'>
                    <thead className='bg-gray-100 border-b'>
                        <tr className='text-left'>
                            <th className='p-3 w-1/12'>STT</th>
                            <th className='p-3 w-6/12'>Tiêu đề</th>
                            <th className='p-3'>Ngày đăng</th>
                            <th className='p-3'>Người đăng</th>
                            <th className='p-3'>Chức năng</th>
                            <th className='p-3'>Truy cập</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTab.items.map((item, index) => (
                            <tr key={index} className='border-b hover:bg-gray-50'>
                                <td className='p-3'>{index + 1}</td>
                                <td className='p-3'>{item.title}</td>
                                <td className='p-3'>{convertDate(item.created_date)}</td>
                                <td className='p-3'>{item.username}</td>
                                <td className='p-3 flex items-center gap-3'>
                                    <button onClick={() => setEditInitialData(item)} className='hover:scale-110'><PencilSquareIcon className='w-5 h-5' /></button>
                                    <button onClick={() => handleDeleteNew(item.id, item.title)} className='hover:scale-110'><TrashIcon className='w-5 h-5' /></button>
                                </td>
                                <td className="text-blue-400 underline">
                                    <Link href={`/tin-tuc/${pathFunction.convertToSlug(item.title)}-${item.id}`}>
                                        Tới tin đăng
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(isCreatingNew || editInitialData) && (
                <CreateNew setIsCreatingNew={setIsCreatingNew} subject={subject} initialData={editInitialData} setEditMode={setEditInitialData} />
            )}
        </>
    )
}

export default page