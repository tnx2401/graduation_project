"use client";
import React, { useEffect, useState } from 'react';
import axios from "axios";
import Image from 'next/image';
import { DevicePhoneMobileIcon, MapPinIcon } from '@heroicons/react/24/outline';
import Loading from '../loading';
import Link from 'next/link';
import pathFunction from '@/components/general_page/shared/pathFunction';
import SearchBox from '@/components/general_page/contacts/SearchBox';

const page = () => {
  const [currentContactList, setCurrentContactList] = useState("Cá nhân môi giới");
  const [brokerData, setBrokerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortList, setSortList] = useState([
    {
      name: "Nhà đất bán", amount: 0,
      subList: [
        { name: "Bán căn hộ chung cư", amount: 0 },
        { name: "Bán chung cư mini, căn hộ dịch vụ", amount: 0 },
        { name: "Bán nhà riêng", amount: 0 },
        { name: "Bán nhà biệt thự, liền kề", amount: 0 },
        { name: "Bán nhà mặt phố", amount: 0 },
        { name: "Bán shophouse, nhà phố thương mại", amount: 0 },
        { name: "Bán đất nền dự án", amount: 0 },
        { name: "Bán đất", amount: 0 },
        { name: "Bán trang trại, khu nghỉ dưỡng", amount: 0 },
        { name: "Bán condotel", amount: 0 },
        { name: "Bán kho, nhà xưởng", amount: 0 },
        { name: "Bán loại bất động sản khác", amount: 0 },
      ]
    },
    {
      name: "Nhà đất cho thuê", amount: 0,
      subList: [
        { name: "Cho thuê căn hộ chung cư", amount: 0 },
        { name: "Cho thuê chung cư mini, căn hộ dịch vụ", amount: 0 },
        { name: "Cho thuê nhà riêng", amount: 0 },
        { name: "Cho thuê nhà biệt thự, liền kề", amount: 0 },
        { name: "Cho thuê nhà mặt phố", amount: 0 },
        { name: "Cho thuê shophouse, nhà phố thương mại", amount: 0 },
        { name: "Cho thuê nhà trọ, phòng trọ", amount: 0 },
        { name: "Cho thuê văn phòng", amount: 0 },
        { name: "Cho thuê, sang nhượng cửa hàng, ki ốt", amount: 0 },
        { name: "Cho thuê kho, nhà xưởng, đất", amount: 0 },
        { name: "Cho thuê loại bất động sảm khác", amount: 0 }
      ]
    }
  ])

  useEffect(() => {
    axios.get(`/api/handle_contact/getBrokers`)
      .then((res) => {
        const filteredData = res.data.filter((item) =>
          item.address && item.phone_number && item.locations
        );
        setBrokerData(filteredData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleLocation = (location) => {
    const joinedLocation = location.split("|");

    return <ul className='text-sm'>
      {joinedLocation.map((item, index) => (
        <li key={index} className='bg-gray-100 p-1 my-2 rounded-md'>
          <span className='border-2 border-l-red-500 mr-2'></span> {item.trim()}
        </li>
      ))}
    </ul>
  }

  const handleSearch = async (filters) => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/handle_contact/searchBrokers`, { filters });
      const filteredData = res.data.data.filter(
        (item) => item.address && item.phone_number && item.locations
      );
      setBrokerData(filteredData);
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
      <SearchBox type={"Nhà môi giới"} onSearch={handleSearch} />
      <div className='mt-10'>
        <h1 className='font-medium'>Danh bạ nhà môi giới ({brokerData.length})</h1>
        <div className='mt-5 text-sm'>
          {["Công ty môi giới", "Cá nhân môi giới"].map((item, index) => (
            <button
              key={index}
              onClick={() => setCurrentContactList(item)}
              className={` px-2 py-1 border ${currentContactList === item ? "text-black bg-gray-200" : "text-gray-300"}`}>{item}</button>
          ))}
        </div>
        {brokerData.map((item, index) => (
          <div key={index} className='p-3 my-5 flex gap-5 w-full border'>
            <div className='relative w-[200px] h-[150px] overflow-hidden'>
              <Image
                src={item.profile_picture}
                fill
                alt='profile_image'
                className='object-cover'
              />
            </div>
            <div className='flex flex-col w-2/3'>
              <Link className='text-lg font-medium cursor-pointer hover:text-gray-400' href={`/nha-moi-gioi/${pathFunction.convertToSlug(item.username)}-${item.uid}`}>{item.username}</Link>
              <p className='flex items-center mt-2 gap-2 text-sm text-gray-500'><MapPinIcon className='w-5 h-5' />{item.address}</p>
              <p className='flex items-center mt-3 gap-2 text-sm text-gray-500'><DevicePhoneMobileIcon className='w-5 h-5' />{item.phone_number}</p>
            </div>
            <div className='w-5/12'>
              <h1 className='font-medium border-b border-gray-300'>Khu vực cá nhân môi giới</h1>
              {handleLocation(item.locations)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page