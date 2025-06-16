"use client"
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios'
import Image from 'next/image';
import React, { useEffect, useState } from 'react'

const page = () => {
  const [enterpriseData, setEnterpriseData] = useState([]);
  const [categoryItems, setCategoryItems] = useState([
    { name: "Tất cả", items: [] },
    { name: "Đã duyệt", items: [] },
    { name: "Chờ duyệt", items: [] },
    { name: "Đã từ chối", items: [] }
  ])
  const [currentTab, setCurrentTab] = useState({});
  const [seeEnterpriseInfo, setSeeEnterpriseInfo] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] = useState(null)

  useEffect(() => {
    axios.get("/api/admin/enterprise/getEnterprise").then((res) => {
      setEnterpriseData(res.data);
    }).catch((err) => {
      console.log("Error fetching enterprise: ", err);
    })
  }, [])

  const shouldPostBeInCategory = (enterprise, categoryName) => {
    switch (categoryName) {
      case "Đã duyệt":
        return enterprise.status === "Đã duyệt";
      case "Chờ duyệt":
        return enterprise.status === "Chờ duyệt";
      case "Đã từ chối":
        return enterprise.status === "Đã từ chối";
      default:
        return true;
    }
  };

  useEffect(() => {
    if (enterpriseData.length > 0) {
      const newCategoryItem = categoryItems.map((category) => ({
        ...category,
        items: enterpriseData.filter((enterprise) => shouldPostBeInCategory(enterprise, category.name)),
      }));

      setCategoryItems(newCategoryItem);
    }
  }, [enterpriseData])

  useEffect(() => {
    if (categoryItems[0]?.items) {
      setCurrentTab(categoryItems[0]);
    }
  }, [categoryItems]);


  const handleAcceptEnterprise = (id) => {
    if (id) {
      axios.post(`/api/admin/enterprise/handleAcceptEnterprise`, {
        id
      }).then(() => {
        alert("Duyệt thành công");
      }).catch((err) => {
        console.log("Error accepting enterprise: ", err);
      })
    }
  }

  const handleRejectEnterprise = () => {

  }


  const getStatusBgColor = (status) => {
    switch (status) {
      case "Chờ duyệt":
        return "bg-yellow-100";
      case "Đã duyệt":
        return "bg-green-100";
      case "Đã từ chối":
      case "Không duyệt":
        return "bg-red-100";
      default:
        return "bg-white";
    }
  };

  return (
    <div className=''>
      <div className='p-5 pt-7 bg-white border-b shadow'>
        <h1 className='text-3xl'>Doanh nghiệp</h1>
        <ul className='flex items-center gap-5 mt-7 text-sm'>
          {categoryItems.map((item, index) => (
            <li key={index} className={`${currentTab.name === item.name ? "text-orange-700 border-b-2 border-orange-700" : ""} py-1 cursor-pointer`}
              onClick={() => setCurrentTab(item)}>
              {item.name} <span>({item.items.length})</span>
            </li>
          ))}
        </ul>
      </div>
      {seeEnterpriseInfo ? (
        <div className='w-3/4 mx-auto py-5 flex gap-5 h-[90%]'>
          <div className='w-2/5'>
            {[...currentTab.items]?.sort((a, b) => (
              new Date(b.created_date.replace(' ', 'T')) - new Date(a.created_date.replace(' ', 'T'))
            )).map((item) => (
              <div key={item.id} className={`border border-gray-300 p-2 px-4 my-2 flex items-center gap-5 ${selectedEnterprise?.name === item.name ? "bg-gray-100" : getStatusBgColor(item.status)} rounded-lg shadow hover:scale-105 transition cursor-pointer`} onClick={() => setSelectedEnterprise(item)}>
                <Image src={item.profile_image} width={60} height={60} alt='enterprise_image' className='border-gray-400 border rounded-lg' />
                <div className=''>
                  <h1 className='text-sm'>{item.name}</h1>
                  <p className='text-xs p-1 px-3 mt-2 rounded-lg inline-block bg-gray-200'>{item.main_field}</p>
                </div>
                <EyeIcon className='w-6 h-6 ml-auto text-blue-500' />
              </div>
            ))}
          </div>
          <div className='bg-white w-3/5 my-2 h-[700px] p-5 border shadow rounded-lg overflow-auto'>
            <div className='flex gap-5 justify-between'>
              <div className='flex'>
                <div className='w-[80px] h-[80px] relative'>
                  <Image src={selectedEnterprise?.profile_image} fill alt='profile_image' className='border border-gray-300 rounded-lg' />
                </div>
                <div className='flex flex-col pl-5'>
                  <h1 className='text-xl'>{selectedEnterprise?.name}</h1>
                  {selectedEnterprise.status === "Chờ duyệt" && (
                    <div className="flex space-x-4 mt-4 text-sm">
                      <button className="px-4 py-1 border border-green-600 text-green-600 rounded-lg hover:bg-green-700 hover:text-white transition" onClick={() => handleAcceptEnterprise(selectedEnterprise.id)}>
                        Duyệt doanh nghiệp
                      </button>
                      <button className="px-4 py-1 border border-red-500 text-red-500 rounded-lg hover:bg-red-600 hover:text-white transition" onClick={handleRejectEnterprise}>
                        Từ chối duyệt
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <XMarkIcon className='w-10 h-10 cursor-pointer' onClick={() => { setSeeEnterpriseInfo(false); setSelectedEnterprise(null) }} />
            </div>

            <ul className='mt-5'>
              {[{ name: "Lĩnh vực chính", value: selectedEnterprise?.main_field },
              { name: "Địa chỉ", value: selectedEnterprise?.address },
              { name: "Email", value: selectedEnterprise.email },
              { name: "Website", value: selectedEnterprise.website },
              { name: "Trạng thái", value: selectedEnterprise.status },
              { name: "Tên người lập", value: selectedEnterprise.username },
              { name: "Số điện thoại", value: selectedEnterprise.phone_number }
              ].map((item, index) => (
                <li key={index} className="grid grid-cols-2 gap-3 py-3">
                  <span className="text-green-600">{item.name}</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>

            <div className='mt-5' dangerouslySetInnerHTML={{ __html: selectedEnterprise.description }}></div>
          </div>
        </div>
      ) : (
        <div className='w-3/4 mx-auto py-5'>
          {Array.isArray(currentTab.items) && (
            <div className='w-3/4 mx-auto py-5'>
              {[...currentTab.items].sort((a, b) => (
                new Date(b.created_date?.replace(' ', 'T')) - new Date(a.created_date?.replace(' ', 'T'))
              )).map((item) => (
                <div key={item.id}
                  className={`border border-gray-300 p-2 px-4 my-2 flex items-center gap-5 ${getStatusBgColor(item.status)} rounded-lg shadow hover:scale-105 transition cursor-pointer`}
                  onClick={() => { setSeeEnterpriseInfo(true); setSelectedEnterprise(item) }}
                >
                  <Image src={item.profile_image} width={60} height={60} alt='enterprise_image' className='border-gray-400 border rounded-lg' />
                  <div>
                    <h1 className='text-sm'>{item.name}</h1>
                    <p className='text-xs p-1 px-3 mt-2 rounded-lg inline-block bg-gray-200'>{item.main_field}</p>
                  </div>
                  <EyeIcon className='w-6 h-6 ml-auto text-blue-500' />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default page