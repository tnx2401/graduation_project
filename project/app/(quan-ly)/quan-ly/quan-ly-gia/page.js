"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Cog6ToothIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import Loading from '@/app/(trang-chu)/loading';
import Swal from 'sweetalert2';

const page = () => {

    const [postRankPrices, setPostRankPrices] = useState([]);
    const [membershipPrices, setMembershipPrices] = useState([]);

    const [currentPostRank, setCurrentPostRank] = useState(null);
    const [currentEditPrice, setCurrentEditPrice] = useState(null);
    const [editedPrices, setEditedPrices] = useState({});

    const [currentMembership, setCurrentMembership] = useState(null);
    const [editedMembership, setEditedMembership] = useState({});


    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('/api/admin/posts/getPostRanks')
            .then(res => {
                setPostRankPrices(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            })

        axios.get('/api/admin/membership/getMembershipPrices')
            .then(res => {
                setMembershipPrices(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            })
    }, [])

    console.log(postRankPrices);

    const getCardStyle = (name) => {
        if (name === 'VIP Kim Cương') {
            return 'bg-teal-300';
        } else if (name === 'VIP Vàng') {
            return 'bg-yellow-300';
        } else if (name === 'VIP Bạc') {
            return 'bg-gray-300';
        } else {
            return 'bg-green-400';
        }
    }

    const getTitleStyle = (name) => {
        if (name === 'VIP Kim Cương') {
            return 'text-teal-800';
        } else if (name === 'VIP Vàng') {
            return 'text-yellow-800';
        } else if (name === 'VIP Bạc') {
            return 'text-gray-800';
        } else {
            return 'text-green-800';
        }
    }

    const handlePriceChange = (priceId, days, newValue) => {
        setEditedPrices((prev) => ({
            ...prev,
            [priceId]: { price_per_day: newValue, days: days },
        }))
    }

    const handleSubmitChanges = () => {
        Swal.fire({
            text: 'Bạn có chắc chắn muốn lưu thay đổi?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'green',
            cancelButtonColor: 'red'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/api/admin/posts/updatePostRanks', { editedPrices })
                    .then(res => {
                        Swal.fire({
                            text: 'Lưu thay đổi thành công',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: 'green'
                        }).then(() => {
                            window.location.reload();
                        })
                    })
                    .catch(err => {
                        console.error(err);
                        Swal.fire({
                            text: 'Lưu thay đổi thất bại',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: 'red'
                        })
                    })
            }
        })
    }

    console.log(editedMembership);

    const handleSubmitMembershipChanges = () => {
        Swal.fire({
            text: 'Bạn có chắc chắn muốn lưu thay đổi?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Lưu',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'green',
            cancelButtonColor: 'red'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post('/api/admin/membership/updateMembershipPrices', { editedMembership })
                    .then(res => {
                        Swal.fire({
                            text: 'Lưu thay đổi thanh công thành công',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: 'green'
                        }).then(() => {
                            window.location.reload();
                        })
                    })
                    .catch(err => {
                        console.error(err);
                        Swal.fire({
                            text: 'Lưu thay đổi thất bại',
                            icon: 'error',
                            confirmButtonText: 'OK',
                            confirmButtonColor: 'red'
                        })
                    })
            }
        })
    }

    if (loading) {
        return <Loading />
    }

    return (
        <div>
            <h1 className='p-5 border-b shadow text-2xl py-8 bg-white'>Quản lý giá tin</h1>
            <h1 className='pt-5 px-5 text-xl'>Các gói hạng tin hiện tại <span className='text-red-500'>({postRankPrices.length})</span></h1>
            {/* <div className='grid grid-cols-4'>
                <div className='flex items-center justify-center p-5 border rounded-lg m-5 shadow-lg bg-gray-400/50 hover:scale-105 transition-all cursor-pointer'>
                    <PlusCircleIcon className='w-20 h-20 text-white' />
                </div>
                {postRankPrices.map((rank, index) => (
                    <div key={index} className={`p-5 border rounded-lg m-5 shadow-lg ${getCardStyle(rank.name)} hover:scale-105 transition-all cursor-pointer`} onClick={() => setCurrentPostRank(rank)}>
                        <div className='flex items-center justify-between border-b pb-2'>
                            <h1 className={`text-2xl ${getTitleStyle(rank.name)}`}>{rank.name}</h1>
                            <button><Cog6ToothIcon className='h-7 w-7' /></button>
                        </div>
                        {rank.rank_prices.map((price, index) => (
                            <div key={index} className='border p-3 w-full bg-white rounded-lg my-5 flex flex-col gap-5 cursor-pointer'>
                                <h1 className='flex items-center justify-between'>Gói: <span>{price.days} ngày</span></h1>
                                <h1 className='flex items-center justify-between'>Giá tiền: <span className='text-green-600'>{price.price_per_day.toLocaleString("de-DE")}đ/ngày</span></h1>
                            </div>
                        ))}
                    </div>
                ))}
            </div> */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-5 py-5'>
                <div className='flex items-center justify-center p-6 border rounded-xl shadow bg-gray-100 hover:scale-105 transition cursor-pointer'>
                    <PlusCircleIcon className='w-10 h-10 text-gray-600' />
                </div>
                {postRankPrices.map((rank, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-xl shadow hover:scale-[1.02] transition cursor-pointer ${getCardStyle(rank.name)}`}
                        onClick={() => setCurrentPostRank(rank)}
                    >
                        <div className='flex items-center justify-between border-b pb-2 mb-3'>
                            <h1 className={`text-lg font-semibold ${getTitleStyle(rank.name)}`}>{rank.name}</h1>
                            <Cog6ToothIcon className='w-5 h-5 text-gray-700' />
                        </div>
                        {rank.rank_prices.map((price, i) => (
                            <div key={i} className='bg-white p-3 rounded-lg mb-3 shadow-sm'>
                                <div className='flex justify-between text-sm'>
                                    <span>Gói:</span>
                                    <span>{price.days} ngày</span>
                                </div>
                                <div className='flex justify-between text-sm'>
                                    <span>Giá:</span>
                                    <span className='text-green-600 font-medium'>
                                        {price.price_per_day.toLocaleString("de-DE")}đ/ngày
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <h1 className='pt-5 px-5 text-xl'>Các gói hội viên hiện tại <span className='text-red-500'>({membershipPrices.length})</span></h1>
            <div className='grid grid-cols-4'>
                <div className='flex items-center justify-center p-5 border rounded-lg m-5 shadow-lg bg-gray-400/50 hover:scale-105 transition-all cursor-pointer'>
                    <PlusCircleIcon className='h-20 w-20 text-white' />
                </div>
                {membershipPrices.map((membership, index) => (
                    <div key={index} className={`p-5 border rounded-lg m-5 shadow-lg bg-red-500 hover:scale-105 transition-all cursor-pointer`} onClick={() => { setCurrentMembership(membership); setEditedMembership({ ...membership }) }}>
                        <div className='flex items-center justify-between border-b pb-2'>
                            <h1 className='text-2xl text-white'>{membership.membership_name}</h1>
                            <button><Cog6ToothIcon className='h-7 w-7 text-white' /></button>
                        </div>
                        <div className='border p-3 w-full bg-white rounded-lg my-5 flex flex-col gap-5'>
                            <h1 className='flex items-center justify-between'>Giá tiền: <span className='text-green-600'>{membership.price.toLocaleString("de-DE")}đ/tháng</span></h1>
                            <ul>
                                {[{ name: "Tin vàng miễn phí", value: membership.free_gold_posts }, { name: "Tin bạc miễn phí", value: membership.free_silver_posts }, { name: "Tin thường miễn phí", value: membership.free_normal_posts }, { name: "Lượt đẩy tin miễn phí", value: membership.free_push_posts }].map((item, index) => (
                                    <li key={index} className='flex items-center justify-between my-3'>
                                        {item.name}: <span className='text-green-600'>{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            {currentPostRank && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50' onClick={() => { setCurrentPostRank(null); setEditedPrices({}) }}>
                    <div
                        className='bg-white max-w-md w-full mx-3 rounded-xl p-6 shadow-lg relative'
                        onClick={(e) => { e.stopPropagation() }}
                    >
                        <h2 className='text-xl font-bold border-b pb-2 mb-4'>Chỉnh sửa: {currentPostRank.name}</h2>
                        {currentPostRank.rank_prices.map((price, index) => (
                            <div key={index} className='bg-gray-50 p-3 rounded-lg mb-4'>
                                <div className='flex justify-between text-sm mb-1'>
                                    <span>Gói:</span><span>{price.days} ngày</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span>Giá:</span>
                                    {currentEditPrice?.id === price.id ? (
                                        <input
                                            type='number'
                                            className='w-24 p-1 border rounded text-green-600 text-right'
                                            value={editedPrices[price.id]?.price_per_day ?? price.price_per_day}
                                            onChange={(e) => handlePriceChange(price.id, price.days, e.target.value)}
                                        />
                                    ) : (
                                        <span
                                            className='text-green-600 font-semibold cursor-pointer'
                                            onClick={() => setCurrentEditPrice(price)}
                                        >
                                            {editedPrices[price.id]?.price_per_day?.toLocaleString("de-DE") ?? price.price_per_day.toLocaleString("de-DE")}đ/ngày
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {Object.keys(editedPrices).length > 0 && (
                            <button
                                className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mt-3 float-right'
                                onClick={handleSubmitChanges}
                            >
                                Lưu thay đổi
                            </button>
                        )}
                    </div>
                </div>
            )}

            {currentMembership && (
                <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center' onClick={() => { setCurrentMembership(null); setEditedMembership({}) }}>
                    <div className='bg-white p-5 rounded-lg w-1/3' onClick={(e) => { e.stopPropagation() }}>
                        <h1 className='text-2xl border-b pb-2'>Chỉnh sửa gói hội viên</h1>
                        <h1 className='pt-5 pb-2'>Tên gói: <span>{currentMembership.membership_name}</span></h1>
                        <div className='border p-3 w-full bg-white rounded-lg my-5 flex flex-col gap-5'>
                            {[{ name: "Giá tiền", alt: "price", value: currentMembership.price },
                            { name: "Tin vàng miễn phí", alt: "free_gold_posts", value: currentMembership.free_gold_posts },
                            { name: "Tin bạc miễn phí", alt: "free_silver_posts", value: currentMembership.free_silver_posts },
                            { name: "Tin thường miễn phí", alt: "free_normal_posts", value: currentMembership.free_normal_posts },
                            { name: "Lượt đẩy tin miễn phí", alt: "free_push_posts", value: currentMembership.free_push_posts }].map((item, index) => (
                                <div key={index} className='flex items-center justify-between'>
                                    <h1>{item.name}</h1>
                                    <input
                                        type='text'
                                        className='border p-1 rounded-lg text-green-600 text-left'
                                        value={editedMembership[item.alt] ?? item.value}
                                        onChange={(e) => setEditedMembership({ ...editedMembership, [item.alt]: e.target.value })} />
                                </div>

                            ))}
                        </div>
                        {Object.keys(editedMembership).length > 0 && (
                            <button className='bg-red-500 text-white rounded-lg p-2 mt-5 float-right' onClick={handleSubmitMembershipChanges}>Lưu thay đổi</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default page