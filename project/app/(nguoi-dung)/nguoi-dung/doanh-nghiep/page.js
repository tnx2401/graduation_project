"use client";
import React, { useState, useEffect, useRef } from 'react'
import useStore from '@/lib/zustand'
import axios from 'axios';
import Loading from '../loading';
import { CameraIcon, CheckCircleIcon, CheckIcon, ChevronRightIcon, ClipboardDocumentListIcon, Cog6ToothIcon, EyeIcon, PencilIcon, PlusCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import AssignPhonenumber from '@/components/general_page/create_post_page/step_1/AssignPhonenumber';
import CreateProject from '@/components/general_page/create_projects/CreateProject';
import { GoDotFill } from 'react-icons/go';
import { Edit3, Save, X, MapPin, Building, Calendar, User, Hash, Ruler, Eye, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import Swal from 'sweetalert2';

const Editor = dynamic(() => import('@/components/admin_page/news/Editor'), { ssr: false });
const MapComponent = dynamic(() => import('@/components/general_page/create_projects/map/MapComponent'), { ssr: false })
const MapContainer = dynamic(() => import('@/components/general_page/shared/MapContainer'), { ssr: false })

const EditableField = ({ label, value, field, icon: Icon, multiline = false, placeholder = "", isEditing, handleInputChange }) => (
    <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            {Icon && <Icon size={16} className="text-gray-500" />}
            {label}
        </label>
        {isEditing ? (
            multiline ? (
                <textarea
                    value={value || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    rows={3}
                />
            ) : (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
            )
        ) : (
            <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[2.5rem] flex items-center">
                {value || <span className="text-gray-400 italic">Chưa có thông tin</span>}
            </p>
        )}
    </div>
);

const ProjectPopup = ({ data, onClose, onSave }) => {

    const descriptionRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState(data || {});
    const [position, setPosition] = useState(data.location.split(",").map(Number));
    const [hasPinned, setHasPinned] = useState(false);
    const [pinnedPosition, setPinnedPosition] = useState(null);
    const [expandDescription, setExpandDescription] = useState(false);

    const statusOptions = ["Sắp mở bán", "Đang mở bán", "Đã bàn giao"];
    const unitOptions = ["ha", "m²"]
    const typeOptions = [
        "Căn hộ chung cư",
        "Cao ốc văn phòng",
        "Trung tâm thương mại",
        "Khu đô thị mới",
        "Khu phức hợp",
        "Nhà ở xã hội",
        "Khu nghỉ dưỡng, Sinh thái",
        "Khu công nghiệp",
        "Biệt thự liền kề",
        "Shophouse",
        "Nhà mặt phố"
    ]

    if (!data) return null;

    useEffect(() => {
        if (position) {
            const locString = position.join(",");
            if (editedData.location !== locString) {
                setEditedData(prev => ({
                    ...prev,
                    location: locString
                }));
            }
        }
    }, [position]);

    const handleInputChange = (field, newValue) => {
        setEditedData(prev => ({
            ...prev,
            [field]: newValue
        }));
    };

    const handleNestedInputChange = (parent, field, value) => {
        setEditedData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    const handleUtilityChange = (index, value) => {
        const newUtilities = [...(editedData.utilities || [])];
        newUtilities[index] = value;
        setEditedData(prev => ({
            ...prev,
            utilities: newUtilities
        }));
    };

    const addUtility = () => {
        setEditedData(prev => ({
            ...prev,
            utilities: [...(prev.utilities || []), '']
        }));
    };

    const removeUtility = (index) => {
        const newUtilities = editedData.utilities?.filter((_, i) => i !== index) || [];
        setEditedData(prev => ({
            ...prev,
            utilities: newUtilities
        }));
    };

    const handleSave = () => {
        if (onSave) {
            onSave(editedData);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedData(data);
        setIsEditing(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-hidden">
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 flex justify-between items-start border-b bg-gray-100">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editedData.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="text-2xl font-bold bg-transparent border-b-2 border-white/30 focus:border-white outline-none text-black placeholder-white/70 w-full"
                                placeholder="Tên dự án"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold">{editedData.name}</h2>
                        )}
                        <p className="text-gray-400 mt-1 flex items-center gap-2">
                            <MapPin size={16} />
                            {editedData.address}
                        </p>
                    </div>

                    <div className="flex gap-2 ml-4">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="p-2 bg-green-500 hover:bg-green-600 rounded-lg transition-colors text-white"
                                    title="Lưu"
                                >
                                    <Save size={20} />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="p-2 bg-gray-500 hover:bg-gray-600 rounded-lg transition-colors text-white"
                                    title="Hủy"
                                >
                                    <X size={20} />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                                title="Chỉnh sửa"
                            >
                                <Edit3 size={20} />
                            </button>
                        )}

                        <button
                            onClick={onClose}
                            className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                            title="Đóng"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto p-6">
                    <div className="mb-6">
                        {editedData.thumbnail && (
                            <img
                                src={editedData.thumbnail}
                                alt={editedData.name}
                                className="w-full h-64 object-cover rounded-xl shadow-md"
                            />
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin địa chỉ</h3>

                            <EditableField
                                label="Địa chỉ"
                                value={editedData.address}
                                field="address"
                                icon={MapPin}
                                multiline
                                isEditing={isEditing}
                                handleInputChange={handleInputChange}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <EditableField
                                    label="Phường/Xã"
                                    value={editedData.ward}
                                    field="ward"
                                    isEditing={isEditing}
                                    handleInputChange={handleInputChange}
                                />
                                <EditableField
                                    label="Quận/Huyện"
                                    value={editedData.district}
                                    field="district"
                                    isEditing={isEditing}
                                    handleInputChange={handleInputChange}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <EditableField
                                    label="Tỉnh/Thành phố"
                                    value={editedData.province}
                                    field="province"
                                    isEditing={isEditing}
                                    handleInputChange={handleInputChange}
                                />
                                <EditableField
                                    label="Đường"
                                    value={editedData.street}
                                    field="street"
                                    isEditing={isEditing}
                                    handleInputChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Thông tin dự án</h3>

                            <div className='space-y-2'>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    {<Calendar size={16} className="text-gray-500" />}
                                    Trạng thái
                                </label>
                                {isEditing ? (
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={editedData.status}
                                        onChange={(e) => handleInputChange("status", e.target.value)}
                                    >
                                        {statusOptions.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className='w-full px-3 py-2 rounded-lg bg-gray-50'>
                                        {editedData.status}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Building size={16} className="text-gray-500" />
                                    Loại hình
                                </label>
                                {isEditing ? (
                                    <select
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        value={editedData.type}
                                        onChange={(e) => handleInputChange("type", e.target.value)}
                                    >
                                        {typeOptions.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[2.5rem] flex items-center">
                                        {editedData.type || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                                    </p>
                                )}
                            </div>


                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Ruler size={16} className="text-gray-500" />
                                        Diện tích
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editedData.optional_info?.area || ''}
                                            onChange={(e) => handleNestedInputChange('optional_info', 'area', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        />
                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[2.5rem] flex items-center">
                                            {editedData.optional_info?.area || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Đơn vị</label>
                                    {isEditing ? (
                                        <select
                                            value={editedData.optional_info?.mode || ''}
                                            onChange={(e) => handleNestedInputChange('optional_info', 'mode', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        >
                                            {unitOptions.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>

                                    ) : (
                                        <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[2.5rem] flex items-center">
                                            {editedData.optional_info?.mode || <span className="text-gray-400 italic">Chưa có thông tin</span>}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <User size={16} className="text-gray-500" />
                                        ID Doanh nghiệp
                                    </label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[2.5rem] flex items-center">
                                        {editedData.enterprise_id || <span className="text-gray-400 italic">Không có ID</span>}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <Hash size={16} className="text-gray-500" />
                                        ID Dự án
                                    </label>
                                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[2.5rem] flex items-center">
                                        {editedData.id || <span className="text-gray-400 italic">Không có ID</span>}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">Tiện ích</h3>
                            {isEditing && (
                                <button
                                    onClick={addUtility}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    + Thêm tiện ích
                                </button>
                            )}
                        </div>

                        <div className="space-y-2 flex flex-wrap gap-2">
                            {(editedData.utilities || []).map((utility, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                value={utility}
                                                onChange={(e) => handleUtilityChange(index, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                placeholder="Nhập tiện ích"
                                            />
                                            <button
                                                onClick={() => removeUtility(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span>{utility}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 mt-8">
                        <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                            <FileText size={20} className="text-gray-500" />
                            Mô tả dự án
                        </label>
                        {isEditing ? (
                            <Editor content={editedData.preview} setContent={(value) => setEditedData({ ...editedData, preview: value })} allowImage={false} />
                        ) : (
                            <div className="relative">
                                <div
                                    ref={descriptionRef}
                                    className={`transition-max-height duration-500 ease-in-out overflow-hidden`}
                                    style={{
                                        maxHeight: expandDescription ? descriptionRef.current?.scrollHeight : 200,
                                    }}
                                >
                                    <div dangerouslySetInnerHTML={{ __html: editedData.preview }} />
                                </div>

                                {/* Fade and Arrow */}
                                {!expandDescription && (
                                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent flex justify-center items-end pointer-events-none">
                                        {/* Just fade, no interaction */}
                                    </div>
                                )}

                                <button
                                    onClick={() => setExpandDescription(!expandDescription)}
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-2 z-10 bg-white border rounded-full shadow p-1 hover:bg-gray-100 transition"
                                >
                                    {expandDescription ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="mt-8">
                            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                                <MapPin size={20} className="text-gray-500" />
                                Vị trí bản đồ
                            </label>

                            <input
                                className="w-full px-3 py-2 border mb-5 border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={position}
                                readOnly={true}
                            />

                            <MapComponent
                                position={position}
                                setPosition={setPosition}
                                setHasPinned={setHasPinned}
                                setPinnedPosition={setPinnedPosition}
                            />
                        </div>
                    ) : (
                        <div className="mt-8">
                            <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
                                <MapPin size={20} className="text-gray-500" />
                                Vị trí bản đồ
                            </label>

                            <MapContainer
                                center={editedData.location.split(",")}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const page = () => {

    const { uid } = useStore();
    const [enterprise, setEnterprise] = useState({});
    const [projects, setProjects] = useState([]);
    const [newEnterpriseInfo, setNewEnterpriseInfo] = useState({
        name: "",
        description: null,
        email: "",
        website: "",
        main_field: "",
        address: "",
        profile_image: "",
    });
    const [havePhonenumber, setHavePhonenumber] = useState(false);
    const [isAssigningEnterprise, setIsAssigningEnterprise] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);

    const [watchMode, setWatchMode] = useState('projects');
    const [isEditingEnterpriseInfo, setIsEditingEnterpriseInfo] = useState(false);
    const [isEditingProject, setIsEditingProject] = useState(null);
    const [isChoosingState, setIsChoosingState] = useState(false);
    const [isAddingNewProject, setIsAddingNewProject] = useState(false);

    const mainFieldDropdownValues = [
        "Chủ đầu tư",
        "Thi công xây dựng",
        "Tư vấn thiết kế",
        "Sàn giao dịch bất động sản",
        "Trang trí nột thất",
        "Vật liệu xây dựng",
        "Tài chính pháp lý",
        "Các lĩnh vực khác",
    ]

    useEffect(() => {
        if (!uid) return; // wait until uid is available

        axios.post('/api/users/getUserInformation', { uid }).then((res) => {
            if (res.data[0].phone_number) {
                setHavePhonenumber(true);
            }
        }).catch((err) => {
            console.log(err);
        })

        axios.get(`/api/users/getEnterpriseInformation?uid=${uid}`).then((res) => {
            setEnterprise(res.data[0]);
            setLoading(false);
        }).catch((err) => {
            console.log(err);
        })
    }, [uid])

    useEffect(() => {
        if (enterprise?.id) {
            axios.get(`/api/users/enterprise/projects/getProjects?enterprise_id=${enterprise?.id}`).then((res) => {
                setProjects(res.data);
            }).catch((error) => {
                console.log(error);
            })
        }
    }, [enterprise])

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file); // Convert to Base64
            reader.onloadend = () => {
                setNewEnterpriseInfo({ ...newEnterpriseInfo, profile_image: reader.result });  // Store Base64 string
                setPreviewImage(URL.createObjectURL(file));  // For previewing
            };
        }
    };

    const handleCreateEnterprise = () => {
        axios.post(`/api/users/enterprise/handleCreateEnterprise`, {
            uid,
            newEnterpriseInfo,
        }).then((res) => {
            alert("Thiết lâp doanh nghiệp thành công");
            window.location.reload();
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleSave = (data) => {
        axios.put(`/api/users/enterprise/projects/updateProject`, {
            data
        }).then((res) => {
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: `Đã cập nhật thông tin doanh nghiệp`,
                confirmButtonText: "OK",
            }).then(() => {
                window.location.reload();
            });
        }).catch((error) => {
            console.log(error);
        })
    }

    const handleChangeEnterpriseState = (state) => {
        axios.post(`/api/users/enterprise/handleChangeEnterpriseState`, {
            state: state,
            enterprise_id: enterprise.id
        }).then(() => {
            setEnterprise((prev) => ({ ...prev, state: state }))
        }).catch((error) => {
            console.log(error);
        })
    }

    if (loading) {
        return <Loading />
    }

    console.log(projects);


    return (
        <div className='h-screen relative'>
            <h1 className='p-5 py-8 text-2xl bg-white border-b shadow'>Tài khoản doanh nghiệp</h1>

            {!havePhonenumber && (
                <AssignPhonenumber userId={uid} setHavePhonenumber={setHavePhonenumber} />
            )}

            <div className='h-screen relative'>
                {!enterprise ? (
                    <div className='flex flex-col items-center justify-center w-full h-2/3'>
                        <h1 className='text-2xl font-semibold'>Chưa có thông tin doanh nghiệp</h1>
                        <p className='text-gray-500'>Vui lòng <button className='text-blue-400 underline' onClick={() => setIsAssigningEnterprise(true)}>cập nhật thông tin doanh nghiệp</button> để sử dụng các tính năng của hệ thống.</p>
                    </div>
                ) : (
                    enterprise.status === "Chờ duyệt" ? (
                        <div className='w-full h-[90%] flex flex-col gap-5 items-center justify-center'>
                            <CheckCircleIcon className='w-10 h-10 text-green-500' />
                            <h1>Đơn tạo doanh nghiệp đã được gửi, vui lòng chờ quản trị viên xác nhận trong vòng 24h</h1>
                        </div>
                    ) : (
                        <div className='w-3/4 mx-auto mt-10'>
                            <div className='flex gap-5 w-full'>
                                <div className='w-[125px] h-[125px] relative'>
                                    <Image src={enterprise.profile_image} fill alt='enterprise_image' className='rounded-lg border border-gray-200' />
                                </div>
                                <div className='flex flex-col'>
                                    <h1 className='text-2xl'>{enterprise.name}</h1>
                                    <div className='relative'>
                                        <p onClick={() => setIsChoosingState((prev) => !prev)} className={`mt-5 ${enterprise.state === "Đang hoạt động" ? "bg-green-500" : enterprise.state === "Đang cập nhật" ? "bg-gray-500" : "bg-rose-400"} text-white font-medium px-3 py-1 rounded-full text-sm w-fit cursor-pointer hover:scale-105 transition`}>
                                            {enterprise.state}
                                        </p>
                                        {isChoosingState && (
                                            <ul className='absolute top-14 left-0 border shadow rounded-lg text-left bg-white'>
                                                {[{ name: "Hoạt động", value: "Đang hoạt động", color: "text-green-500" }, { name: "Cập nhật", value: "Đang cập nhật", color: "text-gray-400" }, { name: "Đã bàn giao", value: "Đã bàn giao", color: "text-rose-300" }].map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className={`flex items-center gap-2 py-2 px-4 hover:bg-gray-200 ${enterprise.state === item.value ? "cursor-not-allowed disabled" : "cursor-pointer"}`}
                                                        onClick={() => handleChangeEnterpriseState(item.value)}
                                                    >
                                                        <span className={`${item.color}`}><GoDotFill /></span>
                                                        {item.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className='mt-10'>
                                <div className='w-full border-b py-5 px-2 rounded-t-lg text-left hover:bg-gray-100 flex items-center justify-between cursor-pointer' onClick={() => setWatchMode((prev) => prev === 'info' ? null : 'info')}>
                                    <div className='flex items-center gap-5'>
                                        <EyeIcon className='w-5 h-5' /> Xem thông tin doanh nghiệp
                                    </div>
                                    <div className='items-center flex gap-2' onClick={(e) => e.stopPropagation()}>
                                        {watchMode === 'info' && (
                                            isEditingEnterpriseInfo ? (
                                                <div className='flex items-center gap-3'>
                                                    <CheckIcon className='w-5 h-5 hover:scale-125 text-green-500' onClick={handleSubmitEdit} />
                                                    <XMarkIcon className='w-5 h-5 hover:scale-125 text-red-500' onClick={() => setIsEditingEnterpriseInfo(false)} />
                                                </div>
                                            ) : (
                                                < PencilIcon className='w-5 h-5 hover:scale-125' onClick={() => setIsEditingEnterpriseInfo(true)} />
                                            )
                                        )}
                                        <ChevronRightIcon className={`w-5 h-5 transition ${watchMode === 'info' ? "rotate-90" : ""}`} />
                                    </div>
                                </div>
                                {watchMode === 'info' && (
                                    <div>
                                        <ul>
                                            {[
                                                { name: "Lĩnh vực chính", value: enterprise.main_field },
                                                { name: "Địa chỉ", value: enterprise.address },
                                                { name: "Email", value: enterprise.email },
                                                { name: "Website", value: enterprise.website },
                                                { name: "Mô tả", isHtml: true, value: enterprise.description }
                                            ].map((item, index) => (
                                                <li key={index} className="mb-2">
                                                    <strong className='text-green-500'>{item.name}:</strong>{" "}
                                                    {item.isHtml ? (
                                                        <span dangerouslySetInnerHTML={{ __html: item.value }} />
                                                    ) : (
                                                        <span>{item.value || "Chưa cập nhật"}</span>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <div className='w-full border-b py-5 px-2 text-left hover:bg-gray-100 flex items-center justify-between cursor-pointer' onClick={() => setWatchMode((prev) => prev === 'projects' ? null : 'projects')}>
                                    <div className='flex items-center gap-5'>
                                        <ClipboardDocumentListIcon className='w-5 h-5' /> Dự án
                                    </div>
                                    <ChevronRightIcon className={`w-5 h-5 transition ${watchMode === 'projects' ? 'rotate-90' : ''}`} />
                                </div>
                                {watchMode === 'projects' && (
                                    <div>
                                        <ul>
                                            <li className='flex items-center gap-3 border-b py-3 mx-5 px-2 cursor-pointer hover:bg-gray-100' onClick={() => setIsAddingNewProject(true)}><span><PlusCircleIcon className='w-5 h-5' /></span>Thêm dự án mới</li>
                                            {projects.map((item, index) => (
                                                <li
                                                    key={index} className='px-2 py-3 mx-5 flex items-center justify-between hover:bg-gray-100 cursor-pointer'
                                                    onClick={() => setIsEditingProject(item)}
                                                >
                                                    <div className='flex gap-5'>
                                                        <div className='relative w-[50px] h-[50px]'>
                                                            <Image src={item.thumbnail} fill alt={`${item.name}`} className='rounded-lg' />
                                                        </div>
                                                        <div>
                                                            <h1>{item.name}</h1>
                                                            <p className='text-sm text-gray-400'>{item.address}</p>
                                                        </div>
                                                    </div>

                                                    <button><Cog6ToothIcon className='w-6 h-6' /></button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )}

                {isAssigningEnterprise && (
                    <div className='absolute flex flex-col top-0 left-0 w-[100%] h-[90%] bg-neutral-50 p-5'>
                        <h1 className='p-2 bg-red-400 rounded-md text-lg text-white'>Thiết lập tài khoản doanh nghiệp</h1>
                        {step === 1 && (
                            <>
                                <h1 className='p-3 text-lg border-b mt-5'>{step}. Thông tin cơ bản</h1>
                                <div className='mt-20 mx-auto w-2/3'>
                                    <div className='flex gap-20'>
                                        <div className='flex flex-col'>
                                            <label className='text-lg'>Ảnh đại diện</label>
                                            <div className="relative w-[150px] h-[150px] bg-gray-200 border-gray-300 rounded-lg overflow-hidden flex items-center justify-center mt-5">
                                                {previewImage ? (
                                                    <Image src={previewImage} alt="Preview" fill className="rounded-lg object-cover" />
                                                ) : (
                                                    <div className='text-center flex flex-col items-center justify-center gap-3'>
                                                        <CameraIcon className='w-10 h-10 text-gray-500' />
                                                        <p className='text-xs'>Chọn ảnh đại diện</p>
                                                    </div>
                                                )}
                                                <input type="file" accept="image/*" onChange={handleFileChange}
                                                    className="absolute top-0 left-0 w-full h-full rounded-full cursor-pointer opacity-0" />
                                            </div>
                                        </div>
                                        <div className='w-2/3'>
                                            <label className='text-lg'>Tên doanh nghiệp</label>
                                            <input type="text" className='border-gray-200 shadow focus:ring-0 bg-neutral-100 w-full p-2 py-3 rounded-md my-2' placeholder='Nhập tên doanh nghiệp'
                                                onChange={(e) => setNewEnterpriseInfo({ ...newEnterpriseInfo, name: e.target.value })} />

                                            <label className='text-lg'>Mô tả</label>
                                            <Editor content={newEnterpriseInfo.description} setContent={(value) => setNewEnterpriseInfo({ ...newEnterpriseInfo, description: value })} allowImage={false} />

                                        </div>
                                    </div>
                                </div>

                                {newEnterpriseInfo.profile_image && newEnterpriseInfo.name && newEnterpriseInfo.description && step === 1 && (
                                    <div className='fixed bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-neutral-50 p-5 border-t'>
                                        <button className='absolute top-1/2 -translate-y-1/2 right-5 bg-red-500 text-white w-1/12 p-2 rounded-lg  hover:scale-105 transition-all' onClick={() => setStep(prev => prev + 1)}>Tiếp tục</button>
                                    </div>
                                )}
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <h1 className='p-3 text-lg border-b mt-5'>{step}. Thông tin chi tiết</h1>
                                <div className='mt-10 mx-auto w-2/3'>

                                    <label className='text-lg'>Lĩnh vực hoạt động chính</label>
                                    <select className='border-gray-200 shadow focus:ring-0 bg-neutral-100 w-full p-1 py-2 rounded-md my-2 mb-7' onChange={(e) => setNewEnterpriseInfo({ ...newEnterpriseInfo, main_field: e.target.value })}>
                                        <option value="">Chọn lĩnh vực</option>
                                        {mainFieldDropdownValues.map((item, index) => {
                                            return (
                                                <option key={index} value={item}>{item}</option>
                                            )
                                        }
                                        )}
                                    </select>

                                    <label className='text-lg'>Địa chỉ doanh nghiệp</label>
                                    <input type='text' spellCheck={false} className='border-gray-200 shadow focus:ring-0 bg-neutral-100 w-full p-1 py-2 rounded-md my-2 mb-7' onChange={(e) => setNewEnterpriseInfo({ ...newEnterpriseInfo, address: e.target.value })} />

                                    <label className='text-lg'>Email</label>
                                    <input type='email' spellCheck={false} className='border-gray-200 shadow focus:ring-0 bg-neutral-100 w-full p-1 py-2 rounded-md my-2 mb-7' onChange={(e) => setNewEnterpriseInfo({ ...newEnterpriseInfo, email: e.target.value })} />


                                    <label className='text-lg'>URL Website</label>
                                    <input type='text' className='border-gray-200 shadow focus:ring-0 bg-neutral-100 w-full p-1 py-2 rounded-md my-2 mb-7' onChange={(e) => setNewEnterpriseInfo({ ...newEnterpriseInfo, website: e.target.value })} />

                                    {newEnterpriseInfo.main_field && newEnterpriseInfo.address && newEnterpriseInfo.email && step === 2 && (
                                        <div className='fixed bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-neutral-50 p-5 border-t'>
                                            <button className='absolute top-1/2 -translate-y-1/2 right-5 bg-red-500 text-white w-1/12 p-2 rounded-lg  hover:scale-105 transition-all' onClick={() => setStep(prev => prev + 1)}>Tiếp tục</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <h1 className='p-3 text-lg border-b mt-5'>{step}. Hoàn tất thiết lập</h1>
                                <div className='mt-10 mx-auto w-2/3'>
                                    <div className='flex items-center gap-10'>
                                        <div className='relative w-[120px] h-[120px] bg-gray-200  rounded-lg overflow-hidden flex items-center justify-center mt-5 border-2 border-blue-300'>
                                            <Image src={newEnterpriseInfo.profile_image} fill alt='enterprise_image' />
                                        </div>
                                        <div>
                                            <h1 className='text-xl'>{newEnterpriseInfo.name}</h1>
                                            <ul className='flex gap-10 mt-5'>
                                                {[{ name: "Dự án sắp mở", value: 0 }, { name: "Đang mở bán", value: 0 }, { name: "Đã bàn giao", value: 0 }].map((item, index) => (
                                                    <li key={index} className='flex flex-col'>
                                                        {item.name}
                                                        <span>{item.value}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-10">
                                        <h1 className="text-xl font-semibold mb-4">Giới thiệu</h1>
                                        <div className="space-y-4">
                                            {newEnterpriseInfo.address && (
                                                <div className="flex gap-4 border-b pb-5">
                                                    <h2 className="w-40 font-medium text-gray-600">Địa chỉ</h2>
                                                    <p>{newEnterpriseInfo.address}</p>
                                                </div>
                                            )}
                                            {newEnterpriseInfo.main_field && (
                                                <div className="flex gap-4 border-b pb-5">
                                                    <h2 className="w-40 font-medium text-gray-600">Lĩnh vực chính</h2>
                                                    <p>{newEnterpriseInfo.main_field}</p>
                                                </div>
                                            )}
                                            {newEnterpriseInfo.email && (
                                                <div className="flex gap-4 border-b pb-5">
                                                    <h2 className="w-40 font-medium text-gray-600">Email</h2>
                                                    <p>{newEnterpriseInfo.email}</p>
                                                </div>
                                            )}
                                            {newEnterpriseInfo.website && (
                                                <div className="flex gap-4 border-b pb-5">
                                                    <h2 className="w-40 font-medium text-gray-600">Website</h2>
                                                    <Link href={newEnterpriseInfo.website} className="text-red-600 hover:underline">
                                                        {newEnterpriseInfo.website}
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='mt-5 mb-28' dangerouslySetInnerHTML={{ __html: newEnterpriseInfo.description }}></div>

                                    <div className='fixed bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-16 bg-neutral-50 p-5 border-t'>
                                        <button className='absolute top-1/2 -translate-y-1/2 right-5 bg-red-500 text-white w-1/12 p-2 rounded-lg  hover:scale-105 transition-all' onClick={handleCreateEnterprise}>Tiếp tục</button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {isEditingProject && (
                    <ProjectPopup data={isEditingProject} onClose={() => setIsEditingProject(null)} onSave={handleSave} />
                )}
            </div>

            {
                isAddingNewProject && (
                    <CreateProject enterpriseId={enterprise?.id} setIsAddingNewProject={setIsAddingNewProject} />
                )
            }

        </div >
    )
}

export default page