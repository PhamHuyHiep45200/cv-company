"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import DescriptionIcon from '@mui/icons-material/Description';
import Table from '@/components/Table';
import { Column } from '@/types/Table';
import ApplicationDetailModal from "@/components/ApplicationDetailModal";
import StatusPopover from '@/components/StatusPopover';
import Pagination from '@/components/Pagination';

const initialData = [
  { id: 1, candidate: "John Doe", job: "Frontend Developer", status: "Pending" },
  { id: 2, candidate: "Jane Smith", job: "Backend Developer", status: "Accepted" },
];
const PAGE_SIZE = 5;

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ duyệt',
  REVIEWING: 'Đang review hồ sơ',
  ACCEPTED: 'Xác nhận hồ sơ',
  REJECTED: 'Từ chối hồ sơ',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  REVIEWING: 'bg-blue-100 text-blue-800',
  ACCEPTED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default function ApplicationList() {
  const router = useRouter();
  const [applications, setApplications] = React.useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({ status: '', email: '', name: '' });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusPopover, setStatusPopover] = useState<{ open: boolean; anchor: HTMLElement | null; appId: number | null; currentStatus: string }>(
    { open: false, anchor: null, appId: null, currentStatus: '' }
  );
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const prevFilters = useRef(filters);

  // Debounced effect for text filters
  useEffect(() => {
    // Only debounce for email or name changes
    if (
      filters.email !== prevFilters.current.email ||
      filters.name !== prevFilters.current.name
    ) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        fetchApplications();
        prevFilters.current = filters;
      }, 400);
    } else {
      // For status or page changes, call immediately
      fetchApplications();
      prevFilters.current = filters;
    }
    // eslint-disable-next-line
  }, [filters, page]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.email) params.append('email', filters.email);
      if (filters.name) params.append('name', filters.name);
      params.append('page', String(page));
      params.append('pageSize', String(PAGE_SIZE));
      const response = await fetch(`/api/applications?${params.toString()}`);
      const { data, total } = await response.json();
      setApplications(data);
      setTotal(total);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleStatusFilterChange = (status: string) => {
    setPage(1);
    setFilters({ ...filters, status });
  };

  const handleShowDetail = (app: any) => {
    setSelectedApp(app);
    setShowModal(true);
  };

  const handleStatusClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>, app: any) => {
    setStatusPopover({
      open: true,
      anchor: event.currentTarget,
      appId: app.id,
      currentStatus: app.status,
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!statusPopover.appId) return;
    try {
      await fetch(`/api/applications/${statusPopover.appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchApplications();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const columns: Column[] = [
    {
      header: '#',
      accessor: 'index',
      render: (_: any, __: any, index?: number) => (index ?? 0) + 1 + (page - 1) * PAGE_SIZE,
    },
    {
      header: 'Ứng viên',
      accessor: 'user',
      render: (value: any) => value?.name || '-',
    },
    {
      header: 'Email',
      accessor: 'user',
      render: (value: any) => value?.email || '-',
    },
    {
      header: 'Vị trí ứng tuyển',
      accessor: 'job_post',
      render: (value: any) => value?.category?.name + ' - ' + value?.level?.name,
    },
    {
      header: 'Ngày nộp',
      accessor: 'applied_at',
      render: (value: string) => new Date(value ?? "").toLocaleDateString('vi-VN'),
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (value: string, row: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${STATUS_COLORS[value] || 'bg-gray-100 text-gray-800'}`}
          onClick={(e) => handleStatusClick(e, row)}
        >
          {STATUS_LABELS[value] || value}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      accessor: 'actions',
      render: (_: any, row: any) => (
        <div className="flex space-x-3">
          <button
            onClick={() => handleShowDetail(row)}
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
          <div className="flex flex-wrap gap-4 mt-4">
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              placeholder="Tìm theo tên ứng viên"
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              name="email"
              value={filters.email}
              onChange={handleFilterChange}
              placeholder="Tìm theo email"
              className="border rounded px-3 py-2 text-sm"
            />
            <select
              name="status"
              value={filters.status}
              onChange={e => handleStatusFilterChange(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ duyệt</option>
              <option value="REVIEWING">Đang review hồ sơ</option>
              <option value="ACCEPTED">Xác nhận hồ sơ</option>
              <option value="REJECTED">Từ chối hồ sơ</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            data={applications}
            emptyMessage={emptyMessage}
            loading={loading}
          />
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / PAGE_SIZE)}
            onPageChange={setPage}
          />
          <ApplicationDetailModal
            open={showModal}
            onClose={() => setShowModal(false)}
            application={selectedApp}
          />
          <StatusPopover
            isOpen={statusPopover.open}
            onClose={() => setStatusPopover({ ...statusPopover, open: false })}
            onStatusChange={handleStatusChange}
            currentStatus={statusPopover.currentStatus}
            referenceElement={statusPopover.anchor}
            statusOptions={[
              { value: 'PENDING', label: 'Chờ duyệt', color: STATUS_COLORS['PENDING'] },
              { value: 'REVIEWING', label: 'Đang review hồ sơ', color: STATUS_COLORS['REVIEWING'] },
              { value: 'ACCEPTED', label: 'Xác nhận hồ sơ', color: STATUS_COLORS['ACCEPTED'] },
              { value: 'REJECTED', label: 'Từ chối hồ sơ', color: STATUS_COLORS['REJECTED'] },
            ]}
          />
        </div>
      </div>
    </div>
  );
} 