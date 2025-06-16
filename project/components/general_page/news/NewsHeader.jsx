"use client";
import React from "react";
import {
  ChevronRightIcon,
  HomeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const NewsHeader = ({ currentNew }) => {
  return (
    <div className="w-full h-12 bg-white border-b border-gray-200">
      <div className="max-w-6xl px-4 h-full flex items-center justify-between mx-auto">
        <div className="flex items-center space-x-4 text-xs">
          <Link href={'/'} className="w-4 h-4"><HomeIcon className="text-gray-700" /></Link>
          <ChevronRightIcon className="w-4 h-4 text-gray-700" />
          <Link href={'/tin-tuc'} className="text-gray-700">Tin tức</Link>
          {currentNew && (
            <>
              <ChevronRightIcon className="w-4 h-4 text-gray-700" />
              <span className="text-gray-700">{currentNew}</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4 text-xs">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-700" />
          <span className="text-gray-700">Tìm kiếm</span>
        </div>
      </div>
    </div>
  );
};

export default NewsHeader;
