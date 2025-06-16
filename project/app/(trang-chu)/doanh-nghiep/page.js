"use client";
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Image from 'next/image';
import Link from 'next/link';
import SearchBox from '@/components/general_page/contacts/SearchBox'
import pathFunction from '@/components/general_page/shared/pathFunction';
import Loading from '@/app/(nguoi-dung)/nguoi-dung/loading';

const page = () => {

  const [enterprises, setEnterprises] = useState([
    { name: "Chủ đầu tư", items: [] },
    { name: "Thi công xây dựng", items: [] },
    { name: "Tư vấn thiết kế", items: [] },
    { name: "Sàn giao dịch bất động sản", items: [] },
    { name: "Trang trí nội thất", items: [] },
    { name: "Vật liệu xây dựng", items: [] },
    { name: "Tài chính pháp lý", items: [] },
    { name: "Các lĩnh vực khác", items: [] }
  ])
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/handle_contact/getEnterprises`).then((res) => {
      const data = res.data;

      const updatedEnterprises = enterprises.map(enterprise => {
        const filteredItems = data.filter(item => item.main_field === enterprise.name);
        return {
          ...enterprise,
          items: filteredItems
        };
      });

      setEnterprises(updatedEnterprises);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
    })
  }, [])

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/handle_contact/searchEnterprises`, { filters });
      if (res.data) {
        const data = res.data;
        const updatedEnterprises = enterprises.map(enterprise => {
          const filteredItems = data.filter(item => item.main_field === enterprise.name);
          return {
            ...enterprise,
            items: filteredItems
          };
        });

        setEnterprises(updatedEnterprises);
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
    <div className='max-w-5xl mx-auto'>
      <div className='h-1'></div>
      <SearchBox type={"Doanh nghiệp"} onSearch={handleSearch} />

      <h1 className='mt-5 text-xl'>Các doanh nghiệp công ty bất động sản tại Việt Nam</h1>
      {enterprises.map((item, index) => (
        <div key={index} className='mt-10'>
          <Link href={`/doanh-nghiep/${pathFunction.convertToSlug(item.name)}`}
            className='text-xl font-medium hover:text-gray-500'>
            {item.name}
          </Link>
          <div className='flex items-center gap-5 mt-2'>
            {item.items.slice(0, 6).map((subItem, subIndex) => (
              <Link
                href={`/doanh-nghiep/${pathFunction.convertToSlug(item.name)}/${pathFunction.convertToSlug(subItem.name)}-${subItem.id}`}
                key={subIndex}
                className='p-3 border w-[150px] h-[200px] flex flex-col items-center justify-between'
              >
                <div className='w-[100px] h-[100px] relative'>
                  <Image src={subItem.profile_image} fill alt='enterprise_image' className='object-fill' />
                </div>
                <h1 className='text-center break-words w-full uppercase text-xs line-clamp-2'>
                  {subItem.name}
                </h1>
              </Link>
            ))}
          </div>
        </div>

      ))}
    </div>
  )
}

export default page