"use client";
import { getUserChats, sendMessage, handleSeen } from '@/lib/chat';
import React, { useEffect, useState } from 'react'
import useStore from '@/lib/zustand';
import Loading from '../loading';
import Image from 'next/image';
import { onSnapshot, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { GoDotFill } from 'react-icons/go';

const page = () => {
  const { uid } = useStore();
  const [userChats, setUserChats] = useState([]);
  const [currentChatBox, setCurrentChatBox] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const unsubscribe = onSnapshot(collection(db, "chats"), (snapshot) => {
      const updatedChats = snapshot.docs
        .map(doc => {
          const [senderId, receiverId] = doc.id.split('_');
          if (senderId === uid || receiverId === uid) {
            return {
              id: doc.id,
              ...doc.data()
            };
          }
          return null;
        })
        .filter(Boolean); // remove nulls

      setUserChats(updatedChats);
      setLoading(false);
    });

    return () => unsubscribe(); // cleanup listener
  }, [uid]);

  useEffect(() => {
    if (userChats.length === 0) return;

    // Only set if currentChatBox is null (e.g. first load)
    if (!currentChatBox) {
      setCurrentChatBox(userChats[0]);
    }
  }, [userChats, currentChatBox]);

  useEffect(() => {
    if (!currentChatBox) return;

    const chatRef = doc(db, "chats", currentChatBox.id);
    const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setMessages(docSnapshot.data().messages || []);
      }
    });

    return () => unsubscribe();
  }, [currentChatBox]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const receiverId = currentChatBox.users.find(user => user.uid !== uid)?.uid;

    await sendMessage(currentChatBox.id, uid, receiverId, newMessage);
    setNewMessage("");
  };

  const findNewestMessage = (chat) => {
    if (!chat.messages || chat.messages.length === 0) return "Không có tin nhắn nào";

    const lastMsg = chat.messages[chat.messages.length - 1];
    const otherUserIndex = chat.users.findIndex((user) => user.uid !== uid);
    const sender = lastMsg.sentBy === uid ? "Bạn" : chat.users[otherUserIndex].username;

    return `${sender}: ${lastMsg.message}`;
  }


  const updateChatInState = (chatId, updatedMessages) => {
    setUserChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, messages: updatedMessages } : chat
      )
    );
  };

  const getLastMessageTimestamp = (chat) => {
    const lastMsg = chat.messages?.[chat.messages.length - 1];
    if (!lastMsg) return 0;

    const createdAt = lastMsg.createdAt;
    return createdAt?.toMillis?.() || new Date(createdAt).getTime?.() || 0;
  };


  if (loading) {
    return <Loading />
  }

  return (
    <div className='h-screen'>
      <div className='p-5 flex gap-5 items-center h-full'>
        <div className='rounded border shadow w-1/4 bg-white h-full'>
          <h1 className='p-5'>Người dùng <span className='text-red-500'>({userChats.length})</span></h1>
          {[...userChats]
            .sort((a, b) => getLastMessageTimestamp(b) - getLastMessageTimestamp(a))
            .map((chat) => (
              <div key={chat.id} className='relative p-3 py-4 flex items-center gap-2 border-y cursor-pointer hover:bg-gray-100'
                onClick={() => { setCurrentChatBox(chat); handleSeen(chat.id, uid, updateChatInState) }}
              >
                <Image
                  src={chat.users[uid === chat.users[0].uid ? 1 : 0].profile_picture}
                  width={50}
                  height={50}
                  alt='profile_picture'
                  className='rounded-full border'
                />
                <div>
                  <p>{chat.users[uid === chat.users[0].uid ? 1 : 0].username}</p>
                  <p className='text-gray-500 text-sm line-clamp-1 mt-1'>{findNewestMessage(chat)}</p>
                </div>

                {chat.messages.length > 0 && chat.messages[chat.messages.length - 1].isRead === false && chat.messages[chat.messages.length - 1].sentBy !== uid && (
                  <GoDotFill className='text-blue-400 absolute top-1/2 -translate-y-1/2 right-2' />
                )}
              </div>
            ))}

          {userChats.length === 0 && <p className='p-5 text-center'>Không có người dùng nào</p>}

        </div>
        <div className='w-3/4 h-full border shadow bg-white flex flex-col justify-between'>
          {currentChatBox && (
            <>
              <div className='p-3 py-4 flex items-center gap-5 border-b'>
                <Image
                  src={currentChatBox.users[uid === currentChatBox.users[0].uid ? 1 : 0].profile_picture}
                  width={50}
                  height={50}
                  alt='profile_picture'
                  className='rounded-full border'
                />
                <h1 className='text-lg'>
                  {currentChatBox.users[uid === currentChatBox.users[0].uid ? 1 : 0].username}
                </h1>
              </div>

              <div className='p-5 flex flex-col gap-5 overflow-y-auto h-[80vh]'>
                {messages.map((message, i) => (
                  <div
                    key={i}
                    className={`p-3 border rounded-lg max-w-[75%] w-auto ${message.sentBy === uid ? 'self-start bg-blue-200' : 'self-end bg-gray-200'}`}
                  >
                    <p className='break-words'>{message.message}</p>
                  </div>
                ))}
              </div>

              <div className='flex items-center gap-5 px-5 py-3 border-t'>
                <input
                  type='text'
                  placeholder='Nhập tin nhắn...'
                  className='p-3 border border-gray-300 rounded-lg w-full'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  className='p-3 bg-blue-500 text-white rounded-lg'
                  onClick={handleSendMessage}
                >
                  <PaperAirplaneIcon className='w-7 h-7' />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default page