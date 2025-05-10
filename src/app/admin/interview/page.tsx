"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import EventNoteIcon from '@mui/icons-material/EventNote';
import Table from '@/components/Table';
import { Column } from '@/types/Table';

const initialData = [
  { id: 1, candidate: "John Doe", interviewer: "Alice Admin", date: "2024-06-01", status: "Scheduled" },
  { id: 2, candidate: "Jane Smith", interviewer: "Bob Boss", date: "2024-06-02", status: "Completed" },
];
const PAGE_SIZE = 5;

export default function InterviewList() {
  const router = useRouter();
  const [interviews, setInterviews] = React.useState([]);

  React.useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch('/api/interviews');
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error('Error fetching interviews:', error);
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
      header: 'Vị trí',
      accessor: 'jobPost',
      render: (value: any) => value?.title || '-',
    },
    {
      header: 'Ngày phỏng vấn',
      accessor: 'interviewDate',
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN'),
    },
    {
      header: 'Thời gian',
      accessor: 'interviewTime',
      render: (value: string) => value || '-',
    },
    {
      header: 'Địa điểm',
      accessor: 'location',
      render: (value: string) => value || '-',
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'SCHEDULED' 
            ? 'bg-blue-100 text-blue-800'
            : value === 'COMPLETED'
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}>
          {value === 'SCHEDULED' ? 'Đã lên lịch' : value === 'COMPLETED' ? 'Đã hoàn thành' : 'Đã hủy'}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      accessor: 'actions',
      render: (_: any, row: any) => (
        <div className="flex space-x-3">
          <button
            onClick={() => router.push(`/admin/interview/${row.id}`)}
            className="text-blue-600 hover:text-blue-900"
          >
            Xem chi tiết
          </button>
        </div>
      ),
    },
  ];

  const emptyMessage = {
    icon: <EventNoteIcon className="w-12 h-12 mb-4 text-gray-400" />,
    primaryText: 'Chưa có lịch phỏng vấn nào',
    secondaryText: 'Các lịch phỏng vấn sẽ xuất hiện ở đây',
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Lịch Phỏng Vấn</h1>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            data={interviews}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>
    </div>
  );
} 