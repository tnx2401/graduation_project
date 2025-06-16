"use client";
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
import axios from 'axios';
import SearchBox from '@/components/general_page/contacts/SearchBox';
import Image from 'next/image';
import { DevicePhoneMobileIcon, MapPinIcon } from '@heroicons/react/24/outline';
import pathFunction from '@/components/general_page/shared/pathFunction';
import Link from 'next/link';
import Loading from '../../loading';

const page = () => {

    const path = usePathname();
    const splittedPath = path.split("/");
    const category = splittedPath[splittedPath.length - 1];

    const [enterprises, setEnterprises] = useState([])
    const [loading, setLoading] = useState(true);

    const convertField = {
        'chu-dau-tu': "Chủ đầu tư",
        'thi-cong-xay-dung': "Thi công xây dựng",
        'tu-van-thiet-ke': "Tư vấn thiết kế",
        'san-giao-dich-bat-dong-san': "Sàn giao dịch bất động sản",
        'trang-tri-noi-that': "Trang trí nội thất",
        'vat-lieu-xay-dung': "Vật liệu xây dựng",
        'tai-chinh-phap-ly': "Tài chính pháp lý",
        'cac-linh-vuc-khac': "Các lĩnh vực khác"
    }

    useEffect(() => {
        axios.get(`/api/handle_contact/getEnterprisesByCategory?category=${convertField[category]}`).then((res) => {
            setEnterprises(res.data);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
        })
    }, [category])

    console.log(enterprises);

    const handleSearch = async (filters) => {
        setLoading(true);
        try {
            const res = await axios.post(`/api/handle_contact/searchEnterprises`, { filters });
            if (res.data) {
                const data = res.data;
                setEnterprises(data);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />
    }
    return (
        <div className='max-w-5xl mx-auto min-h-screen'>
            <div className='h-1'></div>
            <SearchBox type={'Doanh nghiệp'} onSearch={handleSearch} />

            <h1 className='text-xl my-10'>{convertField[category]}</h1>
            <p className='text-sm'>Có <span className='text-orange-600'>{enterprises.length}</span> kết quả</p>
            {enterprises.map((item, index) => (
                <Link key={index} href={`/doanh-nghiep/${pathFunction.convertToSlug(convertField[category])}/${pathFunction.convertToSlug(item.name)}-${item.id}`}
                    className='p-5 border rounded-lg flex gap-5 my-5'>
                    <div className='w-[80px] h-[80px] relative'>
                        <Image src={item.profile_image} fill alt='enterprise_image' className='object-fill' />
                    </div>
                    <div className='flex flex-col gap-1'>
                        <h1>{item.name}</h1>
                        <p className='flex items-center gap-2 text-gray-400 text-sm'><MapPinIcon className='w-5 h-5' />{item.address}</p>
                        <p className='text-sm text-gray-400 flex gap-2 mt-auto'><DevicePhoneMobileIcon className='w-5 h-5' />{item.phone_number}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default page