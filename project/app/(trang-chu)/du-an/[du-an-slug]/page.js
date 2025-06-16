"use client"
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import Loading from '@/app/(nguoi-dung)/nguoi-dung/loading'
import LoanCalculator from '@/components/general_page/project/LoanCalculator'
import AdvertisingCard from '@/components/general_page/shared/AdvertisingCard'
import pathFunction from '@/components/general_page/shared/pathFunction'
import axios from 'axios'
import { usePathname } from 'next/navigation'
import { ArrowsPointingOutIcon, BuildingOffice2Icon, ChevronDownIcon, EnvelopeIcon, PhotoIcon, ShareIcon } from '@heroicons/react/24/outline'

const ProjectMapContainer = dynamic(() => import("@/components/general_page/project/ProjectMapContainer"), { ssr: false })

const page = () => {

    const sectionRefs = {
        general: useRef(null),
        posts: useRef(null),
        premise: useRef(null),
        location: useRef(null),
        loan: useRef(null),
    }

    const [projectInfo, setProjectInfo] = useState(null);
    const [posts, setPosts] = useState([]);
    const [selectedTab, setSelectedTab] = useState("Tổng quan");
    const [hoveredTab, setHoveredTab] = useState(null);
    const [expandPreview, setExpandReview] = useState(false);
    const [isSeeingPremise, setIsSeeingPremise] = useState(false);
    const [loading, setLoading] = useState(true);

    const path = usePathname();
    const splittedPath = path.split("-");
    const projectId = splittedPath[splittedPath.length - 1];

    useEffect(() => {
        axios.get(`/api/handle_projects/getProjectInfoById?projectId=${projectId}`).then((res) => {
            setProjectInfo(res.data);
            setLoading(false);
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    useEffect(() => {
        axios.get(`/api/handle_projects/getPostByProject?projectName=${projectInfo?.name}`).then((res) => {
            setPosts(res.data);
        }).catch((error) => {
            console.log(error);
        })
    }, [projectInfo])

    if (loading) {
        return <Loading />
    }

    console.log(posts);

    return (
        <div className='max-w-6xl mx-auto pt-10 overflow-x-hidden'>
            <div className='flex items-center justify-between'>
                <div>
                    <div className='flex text-sm items-center gap-1 text-gray-500'>
                        <Link href={"/du-an"}>Dự án</Link>
                        <p>/</p>
                        <h1>{projectInfo.province}</h1>
                        <p>/</p>
                        <h1>{projectInfo.district}</h1>
                        <p>/</p>
                        <h1 className='text-black'>{projectInfo.type} {projectInfo.name}</h1>
                    </div>
                    <h1 className='text-4xl my-3'>{projectInfo.name}</h1>
                    <div className='flex gap-1'>
                        <p className='text-gray-600'>{projectInfo.address}.</p>
                        <button className='text-red-900' onClick={() => { sectionRefs["premise"].current?.scrollIntoView({ behavior: 'smooth' }) }}>Xem bản đồ</button>
                    </div>
                </div>
                <button className='p-2 flex gap-2 hover:bg-gray-100 rounded-lg'><ShareIcon className='w-6 h-6' />Chia sẻ</button>
            </div>

            <div className='w-full flex h-96 my-5 gap-1'>
                <div className={`${projectInfo.images.length > 5 ? "w-1/2" : "w-2/3"} h-full relative`}>
                    <Image src={projectInfo.images[0]} className='rounded-l-lg object-cover' fill alt="project_picture" />
                    {projectInfo.optional_info.area && (
                        <div className='absolute bottom-5 left-5 text-white flex gap-2 z-10'>
                            <BuildingOffice2Icon className='w-12 h-12' />
                            <div>
                                <p>{projectInfo.optional_info.area}</p>
                                <p>{projectInfo.optional_info.mode}</p>
                            </div>
                        </div>
                    )}
                </div>
                {projectInfo.images.length > 5 ? (
                    <div className={`grid gap-1 w-1/2 grid-cols-2 relative`}>
                        {[projectInfo.images[1], projectInfo.images[2], projectInfo.images[3], projectInfo.images[4]].map((item, index) => (
                            <div key={index} className='w-full h-full relative'>
                                <Image src={item} className={`${index + 1 === 2 ? "rounded-tr-lg" : ""} ${index + 1 === 4 ? "rounded-br-lg" : ""} object-cover`} fill alt="project_picture" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`grid gap-1 w-1/3 grid-cols-1 relative`}>
                        <div className="absolute bottom-2 right-2 bg-black p-1 rounded text-white flex gap-2 z-10">
                            <PhotoIcon className="w-6 h-6" />
                            <p>{projectInfo.images.length}</p>
                        </div>
                        {[projectInfo.images[1], projectInfo.images[2]].map((item, index) => (
                            <div key={index} className='w-full h-full relative'>
                                <Image src={item} className={`${index + 1 === 1 ? "rounded-tr-lg" : ""} ${index + 1 === 2 ? "rounded-br-lg" : ""} object-cover`} fill alt="project_picture" />
                            </div>
                        ))}

                    </div>
                )}
            </div>

            <div className="relative border-b">
                <ul className="flex gap-10 items-center mt-7 mb-5 relative z-10">
                    {[
                        { name: "Tổng quan", description: "Giới thiệu về dự án" },
                        ...(posts.length > 0
                            ? [{ name: "Bán & Cho thuê", description: "Danh sách tin rao" }]
                            : []),
                        { name: "Mặt bằng dự án", description: "Tổng thể hạ tầng" },
                        { name: "Vị trí", description: "Bản đồ dự án" },
                        { name: "Ước tính khoản vay", description: "Hỗ trợ tính lãi suất" },
                    ].map((item, index) => (
                        <li
                            key={index}
                            className={`relative cursor-pointer ${selectedTab === item.name || hoveredTab === item.name
                                ? "text-black"
                                : "text-gray-400"
                                }`}
                            onClick={() => {
                                setSelectedTab(item.name);
                                const sectionKey = ['Tổng quan', 'Bán & Cho thuê', 'Mặt bằng dự án', 'Vị trí', 'Ước tính khoản vay'];
                                const refKeys = ['general', 'posts', 'premise', 'location', 'loan'];
                                const keyIndex = sectionKey.indexOf(item.name);
                                if (keyIndex !== -1) {
                                    sectionRefs[refKeys[keyIndex]].current?.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            onMouseEnter={() => setHoveredTab(item.name)}
                            onMouseLeave={() => setHoveredTab(null)}
                        >
                            <h1 className="font-medium text-xl">{item.name}</h1>
                            <p className="text-xs">{item.description}</p>

                            {(selectedTab === item.name || hoveredTab === item.name) && (
                                <div className="absolute -bottom-5 border-b-2 border-orange-600 w-full"></div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-b border-gray-200 w-screen z-0"></div>
            </div>

            <div className='mt-10 flex gap-5'>
                <div className='w-[65%]'>
                    <h1 className='text-2xl font-medium mb-5' ref={sectionRefs.general}>Tổng quan {projectInfo.name}</h1>
                    <div className='relative'>
                        <div
                            className={`overflow-hidden transition-all duration-300 ${expandPreview ? 'max-h-[10000px]' : 'max-h-[700px]'
                                }`}
                            style={{ overflow: 'hidden' }}
                            dangerouslySetInnerHTML={{ __html: projectInfo.preview }}
                        />

                        {!expandPreview && (
                            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                        )}

                        <div className='w-full flex items-center justify-center relative my-5'>
                            <button
                                onClick={() => setExpandReview(!expandPreview)}
                                className="mt-2 text-red-600 font-medium bg-white text-md flex items-center gap-1"
                            >
                                {expandPreview ? 'Thu gọn' : 'Xem thêm'}
                                <ChevronDownIcon className='w-5 h-5' />
                            </button>
                        </div>
                    </div>

                    {posts.length > 0 && (
                        <div className='mt-10 p-5 bg-gray-100 shadow border border-gray-300 rounded-lg' ref={sectionRefs.posts}>
                            <h1 className='text-2xl font-medium'>Các tin đăng bán thuộc dự án {projectInfo.name}</h1>
                            <div className="flex gap-5 overflow-x-auto overflow-y-hidden">
                                {posts.map((item, index) => {
                                    console.log("Post item:", item); // Check if item.title exists

                                    const demandSlug = pathFunction.convertToSlug(item.demand);
                                    const typeSlug = pathFunction.convertToSlug(item.type);
                                    const idSlug = pathFunction.convertToSlug(item.id.toString());
                                    const titleSlug = pathFunction.convertToSlug(item.title);

                                    return (
                                        <Link
                                            href={`/${demandSlug}-${typeSlug}/${idSlug}-${titleSlug}`}
                                            key={index}
                                            className="min-w-[calc(100%/3-1.25rem)] flex-shrink-0"
                                        >
                                            <AdvertisingCard
                                                title={item.title}
                                                image={item.image}
                                                price={item.price}
                                                area={item.area}
                                                location={`${item.district}, ${item.province}`}
                                                created_date={item.post_start_date}
                                            />
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className='mt-10' ref={sectionRefs.premise}>
                        <h1 className='text-2xl mb-5'>Mặt bằng dự án</h1>
                        <div className='w-full h-96 relative'>
                            <Image src={projectInfo.premises} fill className='border-gray-300 border rounded-lg object-cover' alt='mat-bang-du-an' />
                            <div className='absolute bottom-5 right-5 z-10 bg-black/80 rounded-full p-2 cursor-pointer' onClick={() => setIsSeeingPremise(true)}>
                                <ArrowsPointingOutIcon className='w-8 h-8 text-white' />
                            </div>
                        </div>
                    </div>

                    <div className='my-10' ref={sectionRefs.location}>
                        <h1 className='text-2xl mb-5' >Vị trí dự án {projectInfo.name}</h1>
                        <ProjectMapContainer center={projectInfo.location.split(',').map(parseFloat)} projectName={projectInfo.name} />
                    </div>

                    <div className='my-10' ref={sectionRefs.loan}>
                        <h1 className='text-2xl mb-5'>Ước tính khoản vay</h1>
                        <LoanCalculator />
                    </div>

                </div>
                <div className='w-[35%]'>
                    <div className='p-6 bg-gray-50 rounded-lg border text-sm text-center flex flex-col items-center justify-center'>
                        <h1 className='font-medium text-lg'>Liên hệ tư vấn miễn phí</h1>
                        <p className='text-gray-500'>Hãy để lại thông tin của bạn để nhận tư vẫn và các cập nhật mới nhất của dự án này</p>
                        <button className='flex gap-3 items-center justify-center text-white bg-teal-600 p-3 w-full mt-5 rounded-lg'><EnvelopeIcon className='w-5 h-5' /> Liên hệ lại tôi</button>
                    </div>
                </div>
            </div>
            {isSeeingPremise && (
                <div
                    className="fixed top-0 left-0 w-screen h-screen bg-black/70 z-50 flex items-center justify-center cursor-pointer"
                    onClick={() => setIsSeeingPremise(false)}
                >
                    <div onClick={(e) => e.stopPropagation()}>
                        <Image
                            src={projectInfo.premises}
                            alt="Premise"
                            width={1200}
                            height={800}
                            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-xl"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default page