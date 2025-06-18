"use client"
import SearchBox from '@/components/general_page/contacts/SearchBox'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import Image from 'next/image'
import { DevicePhoneMobileIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'
import Loading from '../../loading'
import Normal from '@/components/general_page/buy_hire/CardRank/Normal'

const Page = () => {
  const path = usePathname();
  const [currentBroker, setCurrentBroker] = useState("");
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = path.split('-').pop();
    axios.get(`/api/handle_contact/getBrokerById?userId=${id}`).then((res) => {
      setCurrentBroker(res.data);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
    })
  }, [path])

  useEffect(() => {
    if (currentBroker.uid) {
      axios.get(`/api/handle_contact/getBrokerPosts?uid=${currentBroker.uid}`).then((res) => {
        setPostData(res.data);
      }).catch((error) => {
        console.log(error);
      })
    }
  }, [currentBroker])

  const handleLocation = (location) => {
    const joinedLocation = location.split("|");

    return <ul className='text-sm text-gray-500'>
      {joinedLocation.map((item, index) => (
        <li key={index} className='p-1 my-2 rounded-md flex items-center'>
          - {item.trim()}
        </li>
      ))}
    </ul>
  }

  console.log(currentBroker);
  console.log(postData);

  if (loading) {
    return <Loading />
  }

  return (
    <div className='max-w-5xl mx-auto'>
      <div className='h-1'></div>
      <SearchBox type={"Nhà môi giới"} />
      <div className='mt-10'>
        <div className='flex'>
          <div className='w-[150px] h-[150px] relative mx-10'>
            <Image src={currentBroker.profile_picture} fill alt='profile_picture' />
          </div>
          <div className='flex flex-col'>
            <h1 className='text-lg font-medium'>{currentBroker.username}</h1>
            <div className='mt-2 text-gray-500 flex flex-col gap-y-3'>
              <p className='flex items-center gap-2'><MapPinIcon className='w-5 h-5' />{currentBroker.address}</p>
              <p className='flex items-center gap-2'><DevicePhoneMobileIcon className='w-5 h-5' />{currentBroker.phone_number}</p>
              <p className='flex items-center gap-2'><EnvelopeIcon className='w-5 h-5' />{currentBroker.email}</p>
            </div>
          </div>
        </div>

        <div className='mt-10'>
          <h1 className=' border-b border-gray-400 pb-2 text-xl font-medium'>Giới thiệu</h1>
          <h2 className='mt-5 text-xl font-medium'>Khu vực môi giới</h2>
          <p className='text-gray-500 text-sm mt-3'>Nhà môi giới {currentBroker.username} môi giới ở những khu vực sau:</p>
          {handleLocation(currentBroker.locations)}

          <h2 className='mt-10 text-xl font-medium'>Nhà môi giới tự giới thiệu</h2>
          <p className='text-gray-500 text-sm'>{currentBroker.self_description}</p>

          <h2 className='mt-10 text-xl font-medium'>Danh sách tin đăng ({postData.length})</h2>
          {!postData.length > 0 ? (
            <p className='text-center text-gray-500 my-10'>Chưa có tin đăng gần đây...</p>
          ) : (
            <div className='mt-5 flex flex-col gap-5'>
              {postData.map((item, index) => (
                <Normal key={index} cardData={item} path={item.demand === 'Bán' ? 'nha-dat-ban' : 'nha-dat-cho-thue'} />
              ))}
            </div>

          )}
        </div>
      </div>
    </div>
  );
}

export default Page;
