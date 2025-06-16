"use client";
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { CalendarIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Swal from 'sweetalert2';
import Loading from '@/app/(trang-chu)/loading';
import Paginate from '@/components/general_page/shared/Paginate';
import ReportOverlay from '@/components/general_page/buy_hire/ReportOverlay';

const page = () => {
  const [categoryItem, setCategoryItem] = useState([
    { name: "Tất cả", item: [] },
    { name: "Chờ duyệt", item: [] },
    { name: "Đã duyệt", item: [] },
    { name: "Không duyệt", item: [] },
    { name: "Tin đăng bị báo cáo", item: [] },
  ])
  const [postData, setPostData] = useState([]);
  const [currentTab, setCurrentTab] = useState(categoryItem[0])
  const [user, setUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState("");
  const [filterData, setFilterData] = useState("default");
  const [selectedPost, setSelectedPost] = useState([]);
  const [isOpenReport, setIsOpenReport] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) {
        return;
      }

      try {
        const token = await user.getIdToken(true);
        const res = await axios.post(`/api/admin/posts/getPost`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPostData(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [user]); // Thêm `user` vào dependency array

  const shouldPostBeInCategory = (post, categoryName) => {

    switch (categoryName) {
      case "Chờ duyệt":
        return post.verify_status === "Chờ duyệt"
      case "Đã duyệt":
        return post.verify_status === "Đã duyệt"
      case "Không duyệt":
        return post.verify_status === "Không duyệt"
      case "Tin đăng bị báo cáo":
        return post.post_reports && post.post_reports.length > 0;
      default:
        return true;
    }
  };

  useEffect(() => {
    if (postData.length > 0) {
      const newCategoryItem = categoryItem.map((category) => ({
        ...category,
        item: postData.filter((post) => shouldPostBeInCategory(post, category.name)),
      }));

      setCategoryItem(newCategoryItem);
      setLoading(false);
    }
  }, [postData])

  useEffect(() => {
    if (postData.length > 0) {
      let filteredPosts;

      if (filterData === "default") {
        filteredPosts = postData.filter((post) => {
          return (
            post.title.toLowerCase().includes(searchData.toLowerCase()) ||
            post.display_address.toLowerCase().includes(searchData.toLowerCase()) ||
            post.post_id == searchData ||
            post.contact_name.toLowerCase().includes(searchData.toLowerCase())
          )
        })
      } else {
        const date = new Date();
        const convertedDate = new Date(date.setDate(date.getDate() - Number(filterData)));
        filteredPosts = postData.filter((post) => {
          return (
            (post.title.toLowerCase().includes(searchData.toLowerCase()) ||
              post.display_address.toLowerCase().includes(searchData.toLowerCase()) ||
              post.post_id == searchData ||
              post.contact_name.toLowerCase().includes(searchData.toLowerCase())) &&
            new Date(post.post_start_date) >= convertedDate
          );
        });
      }

      const newCategoryItem = categoryItem.map((category) => ({
        ...category,
        item: filteredPosts.filter((post) => shouldPostBeInCategory(post, category.name)),
      }));

      setCategoryItem(newCategoryItem);
      setLoading(false);
    }
  }, [searchData, filterData]);


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const handleShowAllImages = (images) => {
    const imagesHtml = images.map(url => `<img src="${url}" alt="image" style="width: 150; height: 150; object-fit: cover; margin: 5px;">`).join('');

    Swal.fire({
      title: 'Danh sách ảnh',
      html: `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px;">${imagesHtml}</div>`,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Đóng',
    });
  }

  const handleShowAllInfo = (info) => {

    console.log("info", info);

    const keyMap = {
      demand: "Nhu cầu",
      street: "Đường",
      project: "Dự án",
      ward: "Phường",
      district: "Quận/Huyện",
      province: "Tỉnh/Thành phố",
      type: "Loại hình",
      area: "Diện tích (m²)",
      price: "Giá bán",
      unit: "Đơn vị tiền tệ",
      bedroom: "Số phòng ngủ",
      bathroom: "Số phòng vệ sinh",
      floor: "Tầng",
      house_direction: "Hướng nhà",
      balcony_direction: "Hướng ban công",
      contact_name: "Liên hệ",
      email: "Email",
      phone_number: "Số điện thoại",
      title: "Tiêu đề",
      post_description: "Mô tả",
      display_address: "Địa chỉ hiển thị"
    };

    const filteredInfo = Object.entries(info).filter(([key]) => keyMap[key]);

    const infoHtml = filteredInfo
      .map(([key, value]) => {
        const formattedValue = key === 'description'
          ? value.replace(/\n/g, '<br>')
          : value;

        return `<div style="margin-bottom: 10px; padding: 8px; background: #f9f9f9; border-radius: 8px;">
                  <strong style="color: #333;">${keyMap[key] || key}:</strong> 
                  <span style="color: #007bff;">${formattedValue}</span>
                </div>`;
      })
      .join('');

    Swal.fire({
      title: 'Thông tin chi tiết',
      html: `<div style="font-size: 16px; text-align: left; max-height: 400px; overflow: auto; padding: 10px; background: #fff; border-radius: 10 px;">${infoHtml}</div>`,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: 'Đóng',
    });
  };

  const handleApprove = async (post_id, user_id) => {
    try {
      await axios.post(`/api/admin/posts/updatePost`, {
        verify_status: "Đã duyệt",
        post_id: post_id,
        user_id: user_id,
      });

      setCategoryItem((prevCategoryItem) => {
        let movedPost = null;

        const updatedCategoryItem = prevCategoryItem.map((category) => {
          if (category.name === "Chờ duyệt") {
            movedPost = category.item.find(post => post.post_id === post_id);
            return {
              ...category,
              item: category.item.filter(post => post.post_id !== post_id),
            };
          }
          return category;
        });

        if (!movedPost) return prevCategoryItem;

        const updatedPost = { ...movedPost, verify_status: "Đã duyệt" };

        return updatedCategoryItem.map((category) => {
          if (category.name === "Đã duyệt") {
            return {
              ...category,
              item: [...category.item, updatedPost],
            };
          }
          if (category.name === "Tất cả") {
            return {
              ...category,
              item: category.item.map(post =>
                post.post_id === post_id ? updatedPost : post
              ),
            };
          }
          return category;
        });
      });

    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  const handleReject = async (post_id, amount, balance, uid) => {
    try {
      Swal.fire({
        title: "Từ chối tin đăng",
        input: "text",
        inputLabel: "Lý do",
        showCancelButton: true,
        inputAttributes: {
          autocomplete: "off",
        },
        inputValidator: (value) => {
          if (!value) {
            return "Hãy nhập đầy đủ thông tin!";
          }
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const reason = result.value;

          try {
            await axios.post(`/api/admin/posts/updatePost`, {
              verify_status: "Không duyệt",
              post_id: post_id,
              balance: Number(amount) + Number(balance),
              uid: uid,
              refund_reason: reason,
            });

            setCategoryItem((prevCategoryItem) => {
              let movedPost = null;

              const updatedCategoryItem = prevCategoryItem.map((category) => {
                if (category.name === "Chờ duyệt") {
                  movedPost = category.item.find(post => post.post_id === post_id);
                  return {
                    ...category,
                    item: category.item.filter(post => post.post_id !== post_id),
                  };
                }
                return category;
              });

              if (!movedPost) return prevCategoryItem;

              const updatedPost = {
                ...movedPost,
                verify_status: "Không duyệt",
                refund_reason: reason
              };

              return updatedCategoryItem.map((category) => {
                if (category.name === "Không duyệt") {
                  return {
                    ...category,
                    item: [...category.item, updatedPost],
                  };
                }
                if (category.name === "Tất cả") {
                  return {
                    ...category,
                    item: category.item.map(post =>
                      post.post_id === post_id ? updatedPost : post
                    ),
                  };
                }
                return category;
              });
            });

            setCategoryItem((prevCategoryItem) => {
              let movedPost = null;

              const updatedCategories = prevCategoryItem.map((category) => {
                if (category.name === "Chờ duyệt") {
                  movedPost = category.item.find(post => post.post_id === post_id);
                  return {
                    ...category,
                    item: category.item.filter(post => post.post_id !== post_id),
                  };
                }
                return category;
              });

              if (!movedPost) return prevCategoryItem;

              const updatedPost = { ...movedPost, verify_status: "Không duyệt", refund_reason: reason };

              return updatedCategories.map((category) => {
                if (category.name === "Không duyệt") {
                  return {
                    ...category,
                    item: [...category.item, updatedPost], // Add to "Không duyệt"
                  };
                }
                if (category.name === "Tất cả") {
                  return {
                    ...category,
                    item: category.item.map(post =>
                      post.post_id === post_id ? updatedPost : post
                    ),
                  };
                }
                return category;
              });
            });

            Swal.fire("Thành công!", "Tin đã bị loại.", "success");
          } catch (error) {
            Swal.fire("Lỗi!", "Có lỗi xảy ra khi cập nhật tin.", "error");
            console.error(error);
          }
        }
      });

    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  const handleSelectPost = (post_id, user_id) => {
    setSelectedPost((prevSelectedPost) => {
      const exists = prevSelectedPost.some(
        (item) => item.post_id === post_id
      );

      if (exists) {
        return prevSelectedPost.filter((item) => item.post_id !== post_id);
      } else {
        return [...prevSelectedPost, { post_id, user_id }];
      }
    });
  };

  const handleMutipleApprove = async () => {
    try {
      await Promise.all(
        selectedPost.map(async (post) => {
          await axios.post(`/api/admin/posts/updatePost`, {
            verify_status: "Đã duyệt",
            post_id: post.post_id,
            user_id: post.user_id,
          });
        })
      );

      setCategoryItem((prevCategoryItem) => {
        let movedPosts = [];

        const updatedCategoryItem = prevCategoryItem.map((category) => {
          if (category.name === "Chờ duyệt") {
            movedPosts = category.item.filter((post) =>
              selectedPost.some((selected) => selected.post_id === post.post_id)
            );
            return {
              ...category,
              item: category.item.filter(
                (post) =>
                  !selectedPost.some(
                    (selected) => selected.post_id === post.post_id
                  )
              ),
            };
          }
          return category;
        });

        if (movedPosts.length === 0) return prevCategoryItem;

        const updatedPosts = movedPosts.map((movedPost) => ({
          ...movedPost,
          verify_status: "Đã duyệt",
        }));

        return updatedCategoryItem.map((category) => {
          if (category.name === "Đã duyệt") {
            return {
              ...category,
              item: [...category.item, ...updatedPosts],
            };
          }
          if (category.name === "Tất cả") {
            return {
              ...category,
              item: category.item.map((post) =>
                selectedPost.some(
                  (selected) => selected.post_id === post.post_id
                )
                  ? { ...post, verify_status: "Đã duyệt" }
                  : post
              ),
            };
          }
          return category;
        });
      });

      setSelectedPost([]); // Clear selected after action
      Swal.fire("Thành công!", "Tất cả tin đã được duyệt.", "success");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };


  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  if (loading) {
    return <Loading />
  }

  console.log(postData);

  return (
    <div className=''>
      <div className='p-5 border-b pb-2 shadow'>
        <h1 className='text-3xl font-medium'>Danh sách tin</h1>
        <div className='flex gap-5 mt-5'>
          <div className={`transition-all duration-300 ${isSearching ? "w-1/4" : "w-1/6 mr-0"}`}>
            <input
              className="border-gray-400 rounded-lg w-full transition-all duration-300"
              placeholder="Tìm theo mã tin, tiêu đề, địa chỉ"
              onFocus={() => setIsSearching(true)}
              onBlur={() => setIsSearching(false)}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
          <div className="relative ml-8">
            <CalendarIcon className="w-6 h-6 absolute top-1/2 -left-7 -translate-y-1/2 z-10" />
            <select className="py-2 border border-gray-400 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setFilterData(e.target.value)}
            >
              <option value="default" className="pl-10">Mặc định</option>
              <option value="7" className="pl-10">Trong vòng 7 ngày</option>
              <option value="15" className="pl-10">Trong vòng 15 ngày</option>
              <option value="30" className="pl-10">Trong vòng 30 ngày</option>
            </select>
          </div>
        </div>
        <ul className='flex gap-5 mt-5 ml-1'>
          {categoryItem.map((item, index) => (
            <li key={index} className={`${currentTab?.name === item.name ? "border-b-2 border-red-500" : ""} pb-2`}>
              <div className='flex gap-2 cursor-pointer text-sm' onClick={() => setCurrentTab(item)}>
                <h1 className={`${currentTab?.name === item.name ? "text-red-500" : "text-black"}`}>{item.name} <span>({item.item.length})</span></h1>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='flex items-center justify-between w-3/4 mx-auto pt-10 pb-4'>
        {selectedPost.length > 0 && (
          <>
            <h1 className=''>Đã chọn {selectedPost.length} tin đăng</h1>
            <div className='flex items-center gap-3 text-sm'>
              <button className='p-2 px-5 border rounded-md' onClick={() => setSelectedPost([])}>Bỏ chọn</button>
              <button className='p-2 px-5 border rounded-md bg-green-600 text-white' onClick={handleMutipleApprove}>Duyệt tất cả</button>
            </div>
          </>
        )}
      </div>
      {categoryItem.map((item, _) => {
        if (currentTab?.name === item.name) {
          return (
            <div key={item.name} className='w-3/4 mx-auto'>
              {item.item.length > 0 ? (
                <>
                  {item.item.slice(startIndex, endIndex).map((subItem, subIndex) => (
                    <div key={subIndex} className="relative p-3 border mb-5 rounded-lg shadow">
                      <div className='flex'>
                        <div className='flex flex-col gap-3'>
                          <div className="w-[150px] h-[160px] overflow-hidden rounded-lg">
                            <Image
                              src={subItem.images[0]}
                              width={200}
                              height={200}
                              alt="post thumbnail"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button className='border mt-auto border-blue-300 text-blue-300 w-full p-1 rounded-lg text-sm hover:scale-105 hover:bg-blue-300 hover:text-white' onClick={() => handleShowAllImages(subItem.images)}>Xem toàn bộ ảnh</button>
                        </div>

                        <div className='mx-2 flex flex-col w-full'>
                          <div className='flex justify-between items-center'>
                            <h1>
                              <span className={`${subItem.verify_status === "Đã duyệt" ? "bg-green-600" : subItem.verify_status === "Không duyệt" ? "bg-red-600" : "bg-yellow-400"} text-white p-1 px-2  rounded-md text-sm mr-2`}>{subItem.verify_status}</span>
                              {subItem.title}
                              <span className="text-sm ml-2  text-green-400">{subItem.payment_status === 'Refunded' ? '(Đã hoàn tiền)' : ''}</span>
                            </h1>
                            {currentTab?.name === "Chờ duyệt" && (
                              <input type="checkbox" id="checkbox" checked={selectedPost.some((item) => item.post_id === subItem.post_id)} className="appearance-none w-4 h-4 border rounded-sm border-gray-400 checked:bg-blue-600 checked:border-transparent focus:outline-none cursor-pointer" onChange={() => handleSelectPost(subItem.post_id, subItem.user_id)} />
                            )}
                          </div>
                          <p className='text-neutral-500 text-sm mt-2'>{subItem.demand} <span className='lowercase'>{subItem.type}</span> - {subItem.display_address}</p>
                          <div className='grid grid-cols-6 items-center gap-x-10 mb-2'>
                            {[{ name: "Mã tin", value: subItem.post_id },
                            { name: "Người đăng tin", value: subItem.contact_name },
                            { name: "SĐT", value: subItem.phone_number },
                            { name: "Ngày tạo hóa đơn", value: formatDate(subItem.created_at) },
                            { name: "Ngày tin bắt đầu", value: formatDate(subItem.post_start_date) },
                            { name: "Ngày tin hết hạn", value: formatDate(subItem.post_end_date) },
                            { name: "Số tiền", value: `${Number(subItem.amount).toLocaleString("de-DE")} đ` },
                            { name: "Lượt xem tin", value: subItem.view_count },
                            { name: "Lượt yêu thích", value: subItem.interested_count },
                            ].map((item, index) => (
                              <div key={index} className='text-sm mt-4'>
                                <h1>{item.name}</h1>
                                <p className='text-neutral-500'>{item.value}</p>
                              </div>
                            ))}
                          </div>
                          <div className='mt-auto flex items-center justify-between '>
                            <div className='flex items-center gap-2'>
                              <button
                                className='px-3 p-1 text-sm border border-pink-300 text-pink-300 rounded-lg hover:scale-105 hover:bg-pink-300 hover:text-white'
                                onClick={() => handleShowAllInfo(subItem)}
                              >
                                Xem chi tiết tin đăng
                              </button>
                              {subItem.post_reports.length > 0 && (
                                <div
                                  className='relative px-3 p-1 text-sm border border-red-400 text-red-400 rounded-lg hover:scale-105 hover:bg-red-400 hover:text-white cursor-pointer'
                                  onClick={(e) => setIsOpenReport(true)}
                                >
                                  <h1 className='w-full h-full'>
                                    Báo cáo
                                  </h1>
                                  <p className='absolute -top-2 -right-2 px-1 bg-red-500 text-white rounded-full'>{subItem.post_reports.length}</p>
                                </div>
                              )}

                              {subItem.refund_reason && (
                                <p className='text-red-500 flex items-center gap-2'><ExclamationTriangleIcon className='w-6 h-6' />{subItem.refund_reason}</p>
                              )}
                            </div>
                            {subItem.verify_status === "Chờ duyệt" && (
                              <div className='flex items-center gap-5'>
                                <button className='px-5 p-1 text-sm border border-red-600 bg-red-600 text-white rounded-lg hover:scale-105'
                                  onClick={() => handleReject(subItem.post_id, subItem.amount, subItem.balance, subItem.user_id)}>Loại tin</button>
                                <button className='px-5 p-1 text-sm border border-green-600 bg-green-600 text-white rounded-lg hover:scale-105'
                                  onClick={() => handleApprove(subItem.post_id, subItem.user_id)}>Duyệt tin</button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {isOpenReport && (
                        <ReportOverlay
                          reports={subItem.post_reports}
                          onClose={() => setIsOpenReport(false)}
                        />
                      )}
                    </div>
                  ))}
                  <Paginate totalItems={item.item.length} itemsPerPage={itemsPerPage} currentPage={currentPage} onPageChange={setCurrentPage} />
                </>
              ) : (
                <p>Hiện không có tin...</p>
              )}
            </div>
          );
        }
      })}
    </div>
  )
}

export default page