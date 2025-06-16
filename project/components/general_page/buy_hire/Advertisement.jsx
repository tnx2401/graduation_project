"use client";
import React, { useEffect, useState } from "react";
import useStore from "@/lib/zustand";
import axios from "axios";
import Image from "next/image";
import {
  HeartIcon,
  MapPinIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import pathFunction from "../shared/pathFunction";
import Link from "next/link";

const Advertisement = ({ path }) => {
  const {
    g_district,
    g_ward,
    g_street,
    g_project,
    g_province,
    g_searchQuery,
    uid,
  } = useStore();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const handleLoadPosts = () => {
      if (g_district || g_ward || g_street || g_province) {
        axios
          .post("/api/handle_posts/getPostByLocation", {
            demand: g_searchQuery.demand === "Tìm mua" ? "Bán" : "Cho thuê",
            province: g_province,
            district: g_district,
            ward: g_ward,
            street: g_street,
            project: g_project,
          })
          .then((res) => {
            console.log(res.data.posts);
            setPosts(res.data.posts || []);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };

    handleLoadPosts();
  }, [g_searchQuery]);

  const handlePostAdClick = (post_id, advertisement_view_count, user_id) => {
    axios.post("/api/handle_posts/updateAdvertisementPostStat", {
      post_id: post_id,
      ad_view: advertisement_view_count + 1,
      user_id: user_id === uid ? null : user_id,
    });
  };

  if (posts.length === 0) {
    return null;
  } else {
    return (
      <div className="my-4 p-4 h-96 rounded-md bg-green-50">
        <h1 className="flex items-center text-md text-center mb-2">
          <span className="mr-2">
            <ShieldCheckIcon className="w-10 h-10 text-green-500" />
          </span>
          Yên tâm tìm nhà tại
          <span className="mx-2 text-green-500">
            {g_street
              ? `${g_street}, ${g_ward}`
              : g_ward
              ? `${g_ward}, ${g_district}`
              : g_district
              ? `${g_district}, ${g_province}`
              : g_province
              ? g_province
              : ""}
          </span>
          với
          <span className="mx-2 text-green-500">Tin xác thực</span>
          của batdongsan.com
        </h1>
        <div className="flex items-center justify-center gap-4">
          {posts.map((post) => {
            const getRelativeDate = (date) => {
              const postDate = new Date(date);
              const today = new Date();
              const diffTime = Math.abs(today - postDate);
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

              if (diffDays === 0) {
                return "Đăng hôm nay";
              } else if (diffDays === 1) {
                return "Đăng 1 ngày trước";
              } else {
                return `Đăng ${diffDays} ngày trước`;
              }
            };

            return (
              <Link
                key={post.id}
                href={`/${path}/${post.id}-${pathFunction.convertToSlug(
                  post.title
                )}`}
                onClick={() =>
                  handlePostAdClick(
                    post.id,
                    post.advertisement_view_count,
                    post.user_id
                  )
                }
                className="border rounded-md shadow-md bg-white hover:shadow-lg transition-shadow flex flex-col w-1/3"
              >
                <div className="w-full h-32 relative">
                  <Image
                    src={post.images_url}
                    layout="fill"
                    objectFit="cover"
                    alt="post images"
                    className="rounded-t-md"
                  />
                </div>
                <h2 className="text-sm font-medium mt-4 m-2 line-clamp-2">
                  <span className="bg-green-200 font-medium text-green-700 px-2 rounded mr-2">
                    XÁC THỰC
                  </span>
                  {post.title}
                </h2>
                <div className="flex ml-2 font-semibold text-red-600 items-center">
                  <p>
                    {post.price >= 1000000000
                      ? (post.price / 1000000000).toFixed(2) + " tỷ"
                      : post.price >= 1000000
                      ? (post.price / 1000000).toFixed(2) + " triệu"
                      : post.price.toLocaleString() + " đ"}
                  </p>
                  <p className="text-gray-500 border h-1/5 rounded-full mx-2"></p>
                  <p>{post.area} m²</p>
                </div>
                <h1 className="mx-2 my-2 flex items-center text-sm text-gray-500">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  {g_street
                    ? `${post.street}, ${post.ward}`
                    : g_ward
                    ? `${post.ward}, ${post.district}`
                    : g_district
                    ? `${post.district}, ${post.province}`
                    : g_province
                    ? `${post.province}`
                    : ""}
                </h1>
                <div className="flex mx-2 my-2 items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {post.created_at ? getRelativeDate(post.created_at) : ""}
                  </span>
                  <button className="">
                    <HeartIcon className="w-6 h-6 border border-gray-300 p-1 rounded" />
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
};

export default Advertisement;
