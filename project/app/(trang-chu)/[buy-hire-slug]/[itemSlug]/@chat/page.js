"use client";
import { useEffect, useState } from 'react';
import useStore from '@/lib/zustand';
import { getConversation, sendMessage } from '@/lib/chat';
import Image from 'next/image';
import { PaperAirplaneIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { doc, onSnapshot } from "firebase/firestore";
import { db } from '@/lib/firebase';

export default function Chat() {
    const { g_currentSender, g_currentReceiver, g_setIsChatting } = useStore();
    const [currentChatID, setCurrentChatID] = useState('');
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            const conversation = await getConversation(g_currentSender.uid, g_currentReceiver.uid);
            setCurrentChatID(conversation.chatId);

            const chatRef = doc(db, "chats", conversation.chatId);
            const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    setMessages(docSnapshot.data().messages || []);
                }
            });

            return () => unsubscribe(); // Cleanup the listener
        };

        fetchMessages();
    }, [g_currentSender, g_currentReceiver]); // Add dependencies if necessary


    const handleSendMessage = () => {
        console.log("Sending message...");
        sendMessage(currentChatID, g_currentSender.uid, g_currentReceiver.uid, newMessage);
    };

    return (
        <div className='rounded-lg border border-gray-300 m-10 h-128 bg-white w-96 shadow'>
            <div className='flex flex-col h-full'>
                <div className='flex gap-2 border-b py-3 items-center pl-3'>
                    <Image src={g_currentReceiver.profile_picture} width={35} height={35} alt='receicver_profile_picture' className='rounded-full' />
                    <h1>{g_currentReceiver.username}</h1>
                    <div className='flex items-center gap-2 ml-auto pr-3'>
                        <button onClick={() => { g_setIsChatting(false) }}><XMarkIcon className='w-5 h-5' /></button>
                    </div>
                </div>
                <div className='overflow-y-auto pt-2'>
                    {messages?.map((message, index) => (
                        <div key={index} className={`px-2 py-1 ${message.sentBy === g_currentSender.uid ? 'text-left' : 'text-right'}`}>
                            <p className={`rounded-lg p-2 inline-block text-white ${message.sentBy === g_currentSender.uid ? 'bg-blue-500' : 'bg-gray-500'}`}>{message.message}</p>
                        </div>
                    ))}
                </div>
                <div className='p-2 px-4 flex items-center justify-evenly gap-5 mt-auto'>
                    <input type='text' placeholder='Nhập tin nhắn...' className='w-full rounded-lg border-gray-300' onChange={(e) => { setNewMessage(e.target.value) }} />
                    <button onClick={handleSendMessage}><PaperAirplaneIcon className='w-7 h-7' /></button>
                </div>
            </div>
        </div>
    );
}
