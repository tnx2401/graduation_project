import MostWatchedNew from '@/components/general_page/news/MostWatchedNews';
import NewsHeader from '@/components/general_page/news/NewsHeader';
import Image from 'next/image';
import React from 'react'

async function getNewByID(id) {
    const res = await fetch(`http://localhost:3000/api/handle_news/getNewByID`, {
        cache: "no-store", // Ensures fresh data on every request (use "force-cache" for caching)
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id })
    });

    if (!res.ok) {
        throw new Error("Failed to fetch news");
    }

    return res.json();
}


const page = async ({ params }) => {
    const newParams = await params;
    const path = newParams['news-slug'];
    const splitedPath = path.split("-");
    const newInformation = await getNewByID(splitedPath[splitedPath.length - 1])


    const convertDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', options);
    }

    return (
        <div>
            <NewsHeader currentNew={newInformation.title} />
            <div className='max-w-6xl mx-auto px-4 py-6 mt-5'>
                <h1 className='text-4xl font-medium'>{newInformation.title}</h1>
                <div className='flex w-full gap-4'>
                    <div className='w-2/3'>
                        <div className='my-10 flex items-center gap-5'>
                            <Image src={newInformation.profile_picture} width={50} height={50} alt='profile_picture' className='rounded-full' />
                            <div className=''>
                                <h1 className='text-gray-400'>Được đăng bởi <span className='text-black'>{newInformation.username}</span></h1>
                                <p className='text-gray-400'>{newInformation.last_update ? `Cập nhật lần cuối vào ${convertDate(newInformation.last_update)}` : `Tin đăng ngày ${convertDate(newInformation.created_date)}`}</p>
                            </div>
                        </div>

                        <div>
                            <h1>{newInformation.summary}</h1>
                            <div className='my-10' dangerouslySetInnerHTML={{ __html: newInformation.content }}></div>
                        </div>
                    </div>
                    <div className='w-1/3 mt-10'>
                        <MostWatchedNew />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page