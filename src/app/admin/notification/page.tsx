"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Table from '@/components/Table';
import { Column } from '@/types/Table';

const initialData = [
  { id: 1, title: "Welcome", content: "Welcome to the platform!", date: "2024-06-01" },
  { id: 2, title: "Update", content: "System update scheduled.", date: "2024-06-02" },
];
const PAGE_SIZE = 5;

export default function NotificationList() {
  const router = useRouter();
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const columns: Column[] = [
    {
      header: '#',
      accessor: 'index',
      render: (_: any, __: any, index?: number) => (index ?? 0) + 1,
    },
    {
      header: 'Tiêu đề',
      accessor: 'title',
      render: (value: string) => value || '-',
    },
    {
      header: 'Nội dung',
      accessor: 'content',
      render: (value: string) => value?.substring(0, 50) + (value?.length > 50 ? '...' : '') || '-',
    },
    {
      header: 'Người nhận',
      accessor: 'recipient',
      render: (value: any) => value?.name || '-',
    },
    {
      header: 'Ngày gửi',
      accessor: 'createdAt',
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'READ' 
            ? 'bg-green-100 text-green-800'
            : 'bg-blue-100 text-blue-800'
        }`}>
          {value === 'READ' ? 'Đã đọc' : 'Chưa đọc'}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      accessor: 'actions',
      render: (_: any, row: any) => (
        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/admin/notification/${row.id}`)}
            className="text-blue-600 hover:text-blue-900"
          >
            Xem chi tiết
          </button>
        </div>
      ),
    },
  ];

  const emptyMessage = {
    icon: <NotificationsIcon className="w-12 h-12 mb-4 text-gray-400" />,
    primaryText: 'Chưa có thông báo nào',
    secondaryText: 'Các thông báo sẽ xuất hiện ở đây',
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Thông Báo</h1>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            data={notifications}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>
    </div>
  );
} 