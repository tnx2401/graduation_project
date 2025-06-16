"use client"
import React, { useEffect, useState } from "react";
import useStore from "@/lib/zustand";
import axios from "axios";
import Loading from "../loading";
import { FaUser, FaPhone, FaEnvelope, FaMoneyBill, FaGift, FaCreditCard, FaFileInvoice, FaMapMarked } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import { CheckIcon, ExclamationTriangleIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

const Page = () => {
    const { uid } = useStore();
    const [userInformation, setUserInformation] = useState(null);
    const [editInfo, setEditInfo] = useState()
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [currentTab, setCurrentTab] = useState('user')
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (uid) {
            axios
                .post(`/api/users/getUserInformation`, { uid })
                .then((res) => {
                    setUserInformation(res.data[0]);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [uid]);

    useEffect(() => {
        if (userInformation) {
            setEditInfo({
                username: userInformation.username,
                phone_number: userInformation.phone_number,
                email: userInformation.email,
                address: userInformation.address,
                self_description: userInformation.self_description,
                tax_number: userInformation.tax_number,
            })
        }
    }, [userInformation])


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert to Base64
            reader.onloadend = () => {
                setSelectedImage(reader.result);  // Store Base64 string
                setPreviewImage(URL.createObjectURL(file));  // For previewing
            };
        }
    };

    const handleUpdatePost = async () => {
        try {
            await axios.post(`/api/users/updateUserInfo/`, {
                uid: userInformation.uid,
                username: editInfo.username === userInformation.username ? null : editInfo.username,
                profile_picture: selectedImage,
                phone_number: editInfo.phone_number === userInformation.phone_number ? null : editInfo.phone_number,
                email: editInfo.email === userInformation.email ? null : editInfo.email,
                address: editInfo.address === userInformation.address ? null : editInfo.address,
                self_description: editInfo.self_description === userInformation.self_description ? null : editInfo.self_description,
                tax_number: editInfo.tax_number === userInformation.tax_number ? null : editInfo.tax_number,
            }).then(() => {
                window.location.reload();
            }).catch((err) => {
                console.log(err);
            });

        } catch (error) {
            console.error("Error updating user info:", error);
        }
    };

    const handleDiscard = () => {
        setIsEditing(false);
        setPreviewImage(null);
        setSelectedImage(null);
    }

    if (loading) {
        return <Loading />;
    }


    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="w-full h-full rounded-2xl p-8">
                <div className="flex items-center gap-6 pb-6">
                    <div className="relative w-[75px] h-[75px]">
                        <Image src={previewImage || userInformation.profile_picture} width={75} height={75} alt="profile"
                            className="rounded-full border-2 border-blue-500 object-cover"
                            style={{ width: "75px", height: "75px" }} />
                        {isEditing && (
                            <input type="file" accept="image/*" onChange={handleFileChange}
                                className="absolute top-0 left-0 w-full h-full rounded-full cursor-pointer opacity-0" />
                        )}
                    </div>
                    <div>
                        {isEditing ? (
                            <div>
                                <input value={editInfo.username} spellCheck={false} onChange={(e) => setEditInfo((prev) => ({ ...prev, username: e.target.value }))}
                                    className="bg-gray-200 border-gray-200 rounded-lg w-96" />

                            </div>
                        ) : (
                            <div>
                                <h1 className="text-3xl font-semibold">{userInformation.username}</h1>
                            </div>
                        )}
                        <p className="text-gray-500">{userInformation.role_name}</p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <button className={`p-2 px-5 border-t border-l border-b rounded-tl-xl rounded-bl-xl ${currentTab === `user` ? `bg-black text-white` : `bg-white text-black`}`}
                                onClick={() => setCurrentTab('user')}
                            >
                                Thông tin cá nhân
                            </button>
                            <button className={`p-2 px-5 border rounded-tr-xl rounded-br-xl ${currentTab === `subscriber` ? `bg-black text-white` : `bg-white text-black`}`}
                                onClick={() => setCurrentTab('subscriber')}
                            >
                                Thông tin hội viên
                            </button>
                            {!userInformation.address && !userInformation.self_description && (
                                <p className="flex items-center gap-3 ml-3 text-yellow-500"><span><ExclamationTriangleIcon className="w-5 h-5" /></span>Cập nhật đầy đủ thông tin để xuất hiện trên danh bạ nhà môi giới</p>
                            )}
                        </div>
                        {!isEditing ? (
                            <button className="hover:scale-110" onClick={() => setIsEditing(true)} ><PencilSquareIcon className="w-7 h-7" /></button>
                        ) : (
                            <div className="flex gap-5">
                                <button className="hover:scale-110" onClick={handleUpdatePost} ><CheckIcon className="w-7 h-7 text-green-600" /></button>
                                <button className="hover:scale-110" onClick={handleDiscard} ><XMarkIcon className="w-7 h-7 text-red-600" /></button>
                            </div>
                        )}
                    </div>
                    <InfoRow icon={<FaUser />} label="Mã người dùng" value={userInformation.uid} />
                    <InfoRow icon={<FaPhone />} label="Số điện thoại" value={userInformation.phone_number} isEditing={!userInformation.phone_number ? isEditing : null} infoName="phone_number" editInfo={editInfo} setEditInfo={setEditInfo} />
                    <InfoRow icon={<FaMapMarked />} label="Địa chỉ" value={userInformation.address} isEditing={isEditing} infoName="address" editInfo={editInfo} setEditInfo={setEditInfo} />
                    <InfoRow icon={<MdOutlineDescription />} label="Mô tả" value={userInformation.self_description} isEditing={isEditing} infoName="self_description" editInfo={editInfo} setEditInfo={setEditInfo} />
                    <InfoRow icon={<FaEnvelope />} label="Email" value={userInformation.email} isEditing={isEditing} infoName="email" editInfo={editInfo} setEditInfo={setEditInfo} />
                    <InfoRow icon={<FaMoneyBill />} label="Tài khoản chính" value={`${Number(userInformation.balance).toLocaleString("de-DE")} VND`} />
                    <InfoRow icon={<FaGift />} label="Tài khoản khuyến mãi" value={`${Number(userInformation.discount_balance).toLocaleString("de-DE")} VND`} />
                    <InfoRow icon={<FaCreditCard />} label="Mã giao dịch" value={userInformation.payment_code} />
                    <InfoRow icon={<FaFileInvoice />} label="Mã số thuế" value={userInformation.tax_number} isEditing={isEditing} infoName="tax_number" editInfo={editInfo} setEditInfo={setEditInfo} />
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon, label, value, isEditing, infoName, editInfo, setEditInfo }) => (
    <div className="flex items-center bg-white p-4 rounded-lg gap-2">
        <div className="text-gray-600 text-xl mr-4">{icon}</div>
        <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">{label}</p>
            {isEditing ? (
                infoName === "self_description" ? (
                    <textarea spellCheck={false} rows={8} className="bg-gray-200 border-gray-200 rounded-lg w-full resize-none" value={editInfo[infoName] || ""} onChange={(e) => { setEditInfo((prev) => ({ ...prev, [infoName]: e.target.value })) }}></textarea>
                ) : (
                    <input spellCheck={false} className="bg-gray-200 border-gray-200 rounded-lg w-full" value={editInfo[infoName] || ""} onChange={(e) => { setEditInfo((prev) => ({ ...prev, [infoName]: e.target.value })) }} />
                )
            ) : (
                <p className="text-lg font-medium">{value ? value : "Chưa có dữ liệu"}</p>
            )}
        </div>
    </div>
);

export default Page;
