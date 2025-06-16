"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col items-center justify-center">
      <h2>Có lỗi xảy ra {':('}</h2>
      <Link href={'/'}>Quay lại trang chủ</Link>
    </div>
  );
}
