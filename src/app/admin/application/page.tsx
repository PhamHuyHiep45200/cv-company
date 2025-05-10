"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import DescriptionIcon from '@mui/icons-material/Description';
import Table from '@/components/Table';
import { Column } from '@/types/Table';

const initialData = [
  { id: 1, candidate: "John Doe", job: "Frontend Developer", status: "Pending" },
  { id: 2, candidate: "Jane Smith", job: "Backend Developer", status: "Accepted" },
];
const PAGE_SIZE = 5;

export default function ApplicationList() {
  const router = useRouter();
  const [applications, setApplications] = React.useState([]);

  React.useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications');
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const columns: Column[] = [
    {
      header: '#',
      accessor: 'index',
      render: (_: any, __: any, index?: number) => (index ?? 0) + 1,
    },
    {
      header: 'Ứng viên',
      accessor: 'candidate',
      render: (value: any) => value?.name || '-',
    },
    {
      header: 'Vị trí ứng tuyển',
      accessor: 'jobPost',
      render: (value: any) => value?.title || '-',
    },
    {
      header: 'Ngày nộp',
      accessor: 'createdAt',
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'PENDING' 
            ? 'bg-yellow-100 text-yellow-800'
            : value === 'APPROVED'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {value === 'PENDING' ? 'Chờ duyệt' : value === 'APPROVED' ? 'Đã duyệt' : 'Từ chối'}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      accessor: 'actions',
      render: (_: any, row: any) => (
        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/admin/application/${row.id}`)}
            className="text-blue-600 hover:text-blue-900"
          >
            Xem chi tiết
          </button>
        </div>
      ),
    },
  ];

  const emptyMessage = {
    icon: <DescriptionIcon className="w-12 h-12 mb-4 text-gray-400" />,
    primaryText: 'Chưa có đơn ứng tuyển nào',
    secondaryText: 'Các đơn ứng tuyển sẽ xuất hiện ở đây',
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Đơn Ứng Tuyển</h1>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            data={applications}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>
    </div>
  );
} 