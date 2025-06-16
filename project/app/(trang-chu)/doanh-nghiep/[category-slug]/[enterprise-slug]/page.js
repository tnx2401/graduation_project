"use client";
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios';
import Image from 'next/image';
import Loading from '@/app/(trang-chu)/loading';
import { ChevronDownIcon, PhotoIcon } from '@heroicons/react/24/outline';
import pathFunction from '@/components/general_page/shared/pathFunction';
import Link from 'next/link';

const page = () => {

  const [enterpriseInfo, setEnterpriseInfo] = useState(null);
  const [projects, setProjects] = useState([])
  const [similarEnterprises, setSimilarEnterprises] = useState([])
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const path = usePathname();
  console.log(path);
  const splitedPath = path.split('-');
  const enterprise_id = splitedPath[splitedPath.length - 1];

  useEffect(() => {
    axios.get(`/api/handle_contact/getEnterpriseById?enterprise_id=${enterprise_id}`).then((res) => {
      setEnterpriseInfo(res.data);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
    })

    axios.get(`/api/handle_contact/getProjectsByEnterpriseId?enterprise_id=${enterprise_id}`).then((res) => {
      setProjects(res.data);
    }).catch((error) => {
      console.log(error);
    })
  }, [enterprise_id])

  useEffect(() => {
    if (!enterpriseInfo || !enterpriseInfo.main_field) return;

    axios
      .get(`/api/handle_contact/getSimilarEnterprises?category=${enterpriseInfo.main_field}&enterprise_id=${enterpriseInfo.id}`)
      .then((res) => {
        setSimilarEnterprises(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [enterpriseInfo?.main_field]);


  const handleArea = (optional_info) => {
    const data = typeof optional_info === "string" ? JSON.parse(optional_info) : optional_info;
    return <p className="my-2">{data.area} {data.mode}</p>
  }

  const extractFirstParagraph = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const firstP = doc.querySelector('p');
    return firstP ? firstP.textContent.trim() : '';
  };

  if (!enterpriseInfo) return null;

  if (loading) {
    <Loading />
  }

  return (

    <div>

      <div className="relative h-[400px]">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={enterpriseInfo.profile_image}
            alt="background cover"
            fill
            className="object-cover object-center blur-lg scale-110"
          />
        </div>

        <div className="absolute inset-0 z-10 bg-black/50" />

        <div className="relative z-20 max-w-5xl mx-auto h-full flex items-end pb-10 gap-5">
          <div className="relative w-[120px] h-[120px]">
            <Image
              src={enterpriseInfo.profile_image}
              alt="enterprise_image"
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className=''>
            <h1 className='px-5 mb-5 text-3xl text-white'>{enterpriseInfo.name}</h1>
            <ul className="flex gap-5">
              {[{ name: "Dự án sắp mở", value: projects.filter((project) => project.status === "Sắp mở bán").length }, { name: "Đang mở bán", value: projects.filter((project) => project.status === "Đang mở bán").length }, { name: "Đã bàn giao", value: projects.filter((project) => project.status === "Đã bàn giao").length }].map((item, index) => (
                <li key={index} className={`flex flex-col text-white text-lg justify-between ${index === 1 ? "border-x" : ""} border-white px-5`}>
                  <h1>{item.name}</h1>
                  <p className='font-semibold text-2xl'>{item.value}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
      <div className='max-w-5xl mx-auto mt-10'>
        <h1 className='text-2xl mb-5'>Giới thiệu</h1>
        <ul className="flex flex-col divide-y divide-gray-300">
          {[
            { name: "Lĩnh vực chính", value: enterpriseInfo.main_field },
            { name: "Địa chỉ", value: enterpriseInfo.address },
            { name: "Email", value: enterpriseInfo.email },
            { name: "Website", value: enterpriseInfo.website },
          ].map((item, index) => (
            <li key={index} className="py-4 flex">
              <span className="font-medium w-40 shrink-0">{item.name}:</span>
              <span>{item.value || "Chưa cập nhật"}</span>
            </li>
          ))}
        </ul>

        <div className="pt-5 relative">
          <div
            className={`transition-all overflow-hidden ${expanded ? 'max-h-full' : 'max-h-[300px]'
              }`}
            dangerouslySetInnerHTML={{ __html: enterpriseInfo.description }}
          />
          {!expanded && (
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}

          <div className='w-full flex items-center justify-center relative my-5'>
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-2 text-red-600 font-medium bg-white text-md flex items-center gap-1"
            >
              {expanded ? 'Thu gọn' : 'Xem thêm'}
              <ChevronDownIcon className='w-5 h-5' />
            </button>
          </div>
        </div>

        <div className='py-5'>
          {projects.length > 0 && (
            <>
              <h1 className='text-xl my-5 font-medium'>Dự án thuộc {enterpriseInfo.name}</h1>
              {projects.map((item) =>
                <Link href={`/du-an/${pathFunction.convertToSlug(item.name)}-${item.id}`} key={item.id} className="border h-60 flex shadow hover:shadow-lg transition cursor-pointer duration-75 my-5">
                  <div className="flex flex-col gap-1 w-1/4">
                    <div className="h-3/5 relative">
                      <Image src={item.images[0]} fill alt="thumbnail_1" />
                    </div>
                    <div className="h-2/5 grid grid-cols-2 gap-1">
                      <div className="relative w-full h-full">
                        <Image src={item.images[1]} alt="thumbnail_2" fill className="object-cover" />
                      </div>
                      <div className="relative w-full h-full">
                        <Image src={item.images[2]} alt="thumbnail_3" fill className="object-cover" />
                        <div className="absolute bottom-2 right-2 bg-black p-1 text-white flex gap-2">
                          <PhotoIcon className="w-6 h-6" />
                          <p>{item.images.length}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 px-6 w-3/4">
                    <p className={`px-2 py-1 rounded-lg text-xs inline-block ${item.status === 'Đang mở bán' ? "bg-green-200 text-green-700" : ""}`}>{item.status}</p>
                    <h1 className="text-xl font-medium mt-3">{item.name}</h1>
                    {handleArea(item.optional_info)}
                    <p className="text-gray-500">{item.address}</p>
                    <p className="line-clamp-2 text-gray-500 mt-2 text-sm">{extractFirstParagraph(item.preview)}</p>
                  </div>
                </Link>
              )}
            </>
          )}
        </div>

        <div className='pt-5 py-10'>
          <h1 className='text-2xl'>Các doanh nghiệp tương tự</h1>
          <div className='mt-5 flex items-center gap-5'>
            {similarEnterprises.map((item, index) => (
              <Link href={`/doanh-nghiep/${pathFunction.convertToSlug(item.main_field)}/${pathFunction.convertToSlug(item.name)}-${item.id}`} key={index} className='p-3 border inline-block'>
                <div className='w-[100px] h-[100px] relative'>
                  <Image fill src={item.profile_image} alt='enterprise_image' />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default page