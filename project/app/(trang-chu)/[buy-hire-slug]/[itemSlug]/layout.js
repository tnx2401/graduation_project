"use client";
import React from 'react';
import useStore from '@/lib/zustand';


export default function PostDetail({ children, chat }) {
    const { g_isChatting } = useStore();

    return (
        <div className="relative">
            <main className="">{children}</main>
            {g_isChatting && (
                <aside className="fixed z-50 bottom-0 right-0">{chat}</aside>
            )}
        </div>
    );
}
