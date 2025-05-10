"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import Table from '@/components/Table';
import { Column } from '@/types/Table';
import JobPostPreview from '@/components/JobPostPreview';
import ConfirmDialog from '@/components/ConfirmDialog';
import StatusPopover from '@/components/StatusPopover';
import Pagination from '@/components/Pagination';

interface JobPost {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  salary: string;
  location: string;
  experience: string;
  deadline: string;
  status: string;
  category: {
    id: string;
    name: string;
  };
  level: {
    id: string;
    name: string;
  };
  posted_by: {
    id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function JobPostList() {
  const router = useRouter();
  const [jobPosts, setJobPosts] = React.useState<JobPost[]>([]);
  const [selectedJobPost, setSelectedJobPost] = React.useState<JobPost | null>(null);
  const [deleteDialog, setDeleteDialog] = React.useState<{
    isOpen: boolean;
    jobId: string | null;
  }>({
    isOpen: false,
    jobId: null,
  });
  const [statusPopover, setStatusPopover] = React.useState<{
    isOpen: boolean;
    jobId: string | null;
    referenceElement: HTMLElement | null;
  }>({
    isOpen: false,
    jobId: null,
    referenceElement: null,
  });
  const [pagination, setPagination] = React.useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = React.useState(false);

  const fetchJobPosts = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/job-posts?page=${page}&limit=${pagination.limit}`);
      const data = await response.json();
      setJobPosts(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching job posts:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobPosts();
  }, []);

  const handlePageChange = (page: number) => {
    fetchJobPosts(page);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteDialog({
      isOpen: true,
      jobId: id,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.jobId) return;

    try {
      await fetch(`/api/job-posts/${deleteDialog.jobId}`, {
        method: 'DELETE',
      });
      fetchJobPosts(pagination.page);
    } catch (error) {
      console.error('Error deleting job post:', error);
    } finally {
      setDeleteDialog({
        isOpen: false,
        jobId: null,
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({
      isOpen: false,
      jobId: null,
    });
  };

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>, jobId: string) => {
    setStatusPopover({
      isOpen: true,
      jobId,
      referenceElement: event.currentTarget,
    });
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!statusPopover.jobId) return;

    try {
      await fetch(`/api/job-posts/${statusPopover.jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchJobPosts(pagination.page);
    } catch (error) {
      console.error('Error updating job post status:', error);
    }
  };

  const handleStatusPopoverClose = () => {
    setStatusPopover({
      isOpen: false,
      jobId: null,
      referenceElement: null,
    });
  };

  const handlePreview = (jobPost: JobPost) => {
    setSelectedJobPost(jobPost);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'CLOSED':
        return 'bg-gray-100 text-gray-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'Đang tuyển';
      case 'CLOSED':
        return 'Đã đóng';
      case 'DRAFT':
        return 'Bản nháp';
      default:
        return status;
    }
  };

  const columns: Column[] = [
    {
      header: '#',
      accessor: 'index',
      render: (_: any, __: any, index?: number) => (index ?? 0) + 1 + (pagination.page - 1) * pagination.limit,
    },
    {
      header: 'Tiêu đề',
      accessor: 'title',
    },
    {
      header: 'Danh mục',
      accessor: 'category',
      render: (value: any) => value?.name || '-',
    },
    {
      header: 'Trạng thái',
      accessor: 'status',
      render: (value: string, row: any) => (
        <button
          onClick={(e) => handleStatusClick(e, row.id)}
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(value)} hover:opacity-80 cursor-pointer`}
        >
          {getStatusLabel(value)}
        </button>
      ),
    },
    {
      header: 'Thao tác',
      accessor: 'actions',
      render: (_: any, row: any) => (
        <div className="flex space-x-3">
          <button
            onClick={() => handlePreview(row)}
            className="text-gray-600 hover:text-gray-900"
            title="Xem trước"
          >
            <VisibilityIcon />
          </button>
          <button
            onClick={() => router.push(`/admin/job-post/edit/${row.id}`)}
            className="text-blue-600 hover:text-blue-900"
            title="Chỉnh sửa"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => handleDeleteClick(row.id)}
            className="text-red-600 hover:text-red-900"
            title="Xóa"
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];

  const emptyMessage = {
    icon: <WorkOutlineIcon className="w-12 h-12 mb-4 text-gray-400" />,
    primaryText: 'Chưa có tin tuyển dụng nào',
    secondaryText: 'Hãy thêm tin tuyển dụng mới để bắt đầu',
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Tin Tuyển Dụng</h1>
            <button
              onClick={() => router.push('/admin/job-post/create')}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <AddIcon className="mr-2" />
              Thêm Tin Tuyển Dụng
            </button>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            data={jobPosts}
            emptyMessage={emptyMessage}
            loading={loading}
          />
          
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {selectedJobPost && (
        <JobPostPreview
          jobPost={selectedJobPost}
          onClose={() => setSelectedJobPost(null)}
        />
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa tin tuyển dụng này? Hành động này không thể hoàn tác."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        confirmText="Xóa"
        cancelText="Hủy"
      />

      <StatusPopover
        isOpen={statusPopover.isOpen}
        onClose={handleStatusPopoverClose}
        onStatusChange={handleStatusChange}
        currentStatus={jobPosts.find((post) => post.id === statusPopover.jobId)?.status || ''}
        referenceElement={statusPopover.referenceElement}
      />
    </div>
  );
} 