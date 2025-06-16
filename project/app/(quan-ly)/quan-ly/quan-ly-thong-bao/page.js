'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const notifications = [
  {
    id: 1,
    title: 'Thông báo nghỉ lễ 30/4',
    type: 'Thông báo',
    date: '2025-04-25',
  },
  {
    id: 2,
    title: 'Hệ thống sẽ bảo trì lúc 12h',
    type: 'Quan trọng',
    date: '2025-04-28',
  },
];

const NotificationItem = ({ content, created_at }) => {
  const formattedDate = new Date(created_at).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="p-4 border-b">
      <h3 className="">{content}</h3>
      <p className="text-sm text-gray-500 mt-2`">{formattedDate}</p>
    </div>
  );
};

const Page = () => {
  const [notifications, setNotifications] = useState([
    { name: "Quan trọng", items: [] },
    { name: "Thông báo", items: [] },
  ])
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('Thông báo');
  const [content, setContent] = useState('');

  useEffect(() => {
    axios.get(`/api/admin/notifications/getNotifications`)
      .then((res) => {
        const important = [];
        const normal = [];

        res.data.forEach((item) => {
          if (item.type === 'Quan trọng') important.push(item);
          else if (item.type === 'Thông báo') normal.push(item);
        });

        setNotifications([
          { name: "Quan trọng", items: important },
          { name: "Thông báo", items: normal },
        ]);
      })
      .catch((err) => {
        console.error("Failed to fetch notifications", err);
      });
  }, []);

  const thongBaoList = notifications.find(n => n.name === 'Thông báo')?.items || [];
  const quanTrongList = notifications.find(n => n.name === 'Quan trọng')?.items || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      content: content,
      type: type,
      created_at: new Date().toISOString()
    };

    try {
      await axios.post('/api/admin/notifications/addNotification', { newPost });

      // Refresh notification list after posting
      const res = await axios.get(`/api/admin/notifications/getNotifications`);
      const important = [];
      const normal = [];

      res.data.forEach((item) => {
        if (item.type === 'Quan trọng') important.push(item);
        else if (item.type === 'Thông báo') normal.push(item);
      });

      setNotifications([
        { name: "Quan trọng", items: important },
        { name: "Thông báo", items: normal },
      ]);

      setShowModal(false);
      setContent('');
      setType('Thông báo');
    } catch (error) {
      console.error('Failed to create notification', error);
    }
  };

  return (
    <div>
      <div className="p-5 border-b py-8 shadow bg-white flex justify-between items-center">
        <h1 className="text-3xl font-medium">Quản lý thông báo</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
        >
          Đăng thông báo
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-red-600 mb-2">Quan trọng</h2>
          <div className="bg-white rounded-md shadow">
            {quanTrongList.length ? (
              quanTrongList.map(item => (
                <NotificationItem key={item.id} {...item} />
              ))
            ) : (
              <p className="p-4 text-gray-500">Không có thông báo quan trọng.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Thông báo</h2>
          <div className="bg-white rounded-md shadow">
            {thongBaoList.length ? (
              thongBaoList.map(item => (
                <NotificationItem key={item.id} {...item} />
              ))
            ) : (
              <p className="p-4 text-gray-500">Không có thông báo nào.</p>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Đăng thông báo mới</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Loại thông báo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                >
                  <option value="Thông báo">Thông báo</option>
                  <option value="Quan trọng">Quan trọng</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nội dung</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows="4"
                  className="w-full border px-3 py-2 rounded-md"
                  placeholder="Nhập nội dung thông báo..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-md"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Đăng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
