'use client'
import React, { useMemo, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
import Table from '@/components/Table';
import { Column } from '@/types/Table';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '@/hooks/useAuth';
import { withAuth } from '@/components/withAuth';
import api from '@/utils/api';

type TabType = 'ADMIN' | 'EMPLOYEE' | 'CANDIDATE';

const initialUserData: any = {
  admin: [
    { id: 1, name: 'Michael Holz', email: 'michael@company.com', role: 'Admin', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', date: '2013-10-04', status: 'Active' },
    { id: 2, name: 'Paula Wilson', email: 'paula@company.com', role: 'Publisher', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', date: '2014-08-05', status: 'Active' },
    { id: 3, name: 'Antonio Moreno', email: 'antonio@company.com', role: 'Publisher', avatar: 'https://randomuser.me/api/portraits/men/54.jpg', date: '2015-11-05', status: 'Suspended' },
    { id: 4, name: 'Mary Saveley', email: 'mary@company.com', role: 'Reviewer', avatar: 'https://randomuser.me/api/portraits/women/65.jpg', date: '2016-09-06', status: 'Active' },
    { id: 5, name: 'Martin Sommer', email: 'martin@company.com', role: 'Moderator', avatar: 'https://randomuser.me/api/portraits/men/76.jpg', date: '2017-08-12', status: 'Inactive' },
  ],
  employee: [
    { id: 6, name: 'Eve Employee', email: 'eve@company.com', role: 'Employee', avatar: 'https://randomuser.me/api/portraits/women/12.jpg', date: '2018-01-10', status: 'Active' },
    { id: 7, name: 'Sam Staff', email: 'sam@company.com', role: 'Employee', avatar: 'https://randomuser.me/api/portraits/men/23.jpg', date: '2019-03-15', status: 'Inactive' },
  ],
  candidate: [
    { id: 8, name: 'Carl Candidate', email: 'carl@company.com', role: 'Candidate', avatar: 'https://randomuser.me/api/portraits/men/34.jpg', date: '2020-05-20', status: 'Active' },
    { id: 9, name: 'Dana Dreamer', email: 'dana@company.com', role: 'Candidate', avatar: 'https://randomuser.me/api/portraits/women/45.jpg', date: '2021-07-22', status: 'Suspended' },
  ],
};

const statusStyles: any = {
  Active: 'text-green-600',
  Inactive: 'text-yellow-500',
  Suspended: 'text-red-500',
};
const statusDot: any = {
  Active: 'bg-green-500',
  Inactive: 'bg-yellow-400',
  Suspended: 'bg-red-500',
};

// Add validation schema
const employeeSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  phone_number: Yup.string()
    .required('Phone number is required')
    .matches(/^[0-9]+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Vui lòng nhập họ và tên')
    .min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
  email: Yup.string()
    .email('Email không hợp lệ')
    .required('Vui lòng nhập email'),
  phone: Yup.string()
    .required('Vui lòng nhập số điện thoại')
    .matches(/^[0-9]+$/, 'Số điện thoại chỉ được chứa số')
    .min(10, 'Số điện thoại phải có ít nhất 10 số'),
});

// Add password change validation schema
const passwordChangeSchema = Yup.object().shape({
  oldPassword: Yup.string()
    .required('Vui lòng nhập mật khẩu cũ')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  newPassword: Yup.string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: Yup.string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
});

function UserManager() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = React.useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [activeTab, setActiveTab] = React.useState<TabType>('CANDIDATE');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [deleteUser, setDeleteUser] = useState<any>(null);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<any>(null);
  const [showActivateConfirm, setShowActivateConfirm] = useState(false);
  const [userToActivate, setUserToActivate] = useState<any>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [userToChangePassword, setUserToChangePassword] = useState<any>(null);

  React.useEffect(() => {
    fetchUsers();
    // Use global user info from Redux
    if (user) {
      const isUserAdmin = user.role === 'ADMIN';
      setIsAdmin(isUserAdmin);
      setUserRole(user.role);
      if (isUserAdmin) {
        setActiveTab('ADMIN');
      } else if (user.role === 'EMPLOYEE') {
        setActiveTab('EMPLOYEE');
      }
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const users = Array.isArray(response.data) ? response.data : [];
      setUsers(users);
      setTotalPages(Math.ceil(users.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setTotalPages(1);
    }
  };

  const handleCreateUser = async (values: any, { resetForm }: any) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          role: 'EMPLOYEE',
          status: 'ACTIVE',
        }),
      });

      if (response.ok) {
        await fetchUsers();
        setShowCreateModal(false);
        resetForm();
      } else {
        console.error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleEdit = async (values: any, { resetForm }: any) => {
    try {
      const response = await fetch(`/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }

      await fetchUsers();
      setShowEdit(false);
      setEditUser(null);
      resetForm();
    } catch (error) {
      console.error('Error updating user:', error);
      // You can add a toast or alert here to show the error to the user
    }
  };

  const handleDelete = () => {
    setUserData((prev: any) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((u: any) => u.id !== deleteUser.id),
    }));
    setShowDelete(false);
    setDeleteUser(null);
  };

  const handleDeactivate = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'INACTIVE' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to deactivate user');
      }

      await fetchUsers();
      setShowDeactivateConfirm(false);
      setUserToDeactivate(null);
    } catch (error) {
      console.error('Error deactivating user:', error);
    }
  };

  const handleActivate = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'ACTIVE' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to activate user');
      }

      await fetchUsers();
      setShowActivateConfirm(false);
      setUserToActivate(null);
    } catch (error) {
      console.error('Error activating user:', error);
    }
  };

  const handleChangePassword = async (values: any, { resetForm }: any) => {
    try {
      const response = await fetch(`/api/users/${userToChangePassword.id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      setShowChangePassword(false);
      setUserToChangePassword(null);
      resetForm();
    } catch (error) {
      console.error('Error changing password:', error);
    }
  };

  const openEdit = (user: any) => {
    setEditUser(user);
    setShowEdit(true);
  };

  const openDelete = (user: any) => {
    setDeleteUser(user);
    setShowDelete(true);
  };

  const openDeactivateConfirm = (user: any) => {
    setUserToDeactivate(user);
    setShowDeactivateConfirm(true);
  };

  const openActivateConfirm = (user: any) => {
    setUserToActivate(user);
    setShowActivateConfirm(true);
  };

  const openChangePassword = (user: any) => {
    setUserToChangePassword(user);
    setShowChangePassword(true);
  };

  const getColumns = (): Column[] => {
    const baseColumns: Column[] = [
      {
        header: '#',
        accessor: 'index',
        render: (_: any, __: any, index?: number) => ((currentPage - 1) * ITEMS_PER_PAGE) + (index ?? 0) + 1,
      },
      {
        header: 'Họ và tên',
        accessor: 'name',
        render: (value: string) => value || '-',
      },
      {
        header: 'Email',
        accessor: 'email',
        render: (value: string) => value || '-',
      },
      {
        header: 'Số điện thoại',
        accessor: 'phone',
        render: (value: string) => value || '-',
      },
      {
        header: 'Trạng thái',
        accessor: 'status',
        render: (value: string) => (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'ACTIVE' 
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {value === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        ),
      },
    ];

    // Add actions column for all tabs if user is admin
    if (isAdmin) {
      baseColumns.push({
        header: 'Thao tác',
        accessor: 'actions',
        render: (_: any, row: any) => (
          <div className="flex space-x-3">
            <button
              onClick={() => openEdit(row)}
              className="text-yellow-600 hover:text-yellow-900"
            >
              Chỉnh sửa
            </button>
            {row.role === 'ADMIN' ? (
              <button
                onClick={() => openChangePassword(row)}
                className="text-blue-600 hover:text-blue-900"
              >
                Đổi mật khẩu
              </button>
            ) : (
              row.status === 'ACTIVE' ? (
                <button
                  onClick={() => openDeactivateConfirm(row)}
                  className="text-red-600 hover:text-red-900"
                >
                  Khóa hoạt động
                </button>
              ) : (
                <button
                  onClick={() => openActivateConfirm(row)}
                  className="text-green-600 hover:text-green-900"
                >
                  Mở hoạt động
                </button>
              )
            )}
          </div>
        ),
      });
    }

    return baseColumns;
  };

  const emptyMessage = {
    icon: <PersonIcon className="w-12 h-12 mb-4 text-gray-400" />,
    primaryText: 'Chưa có người dùng nào',
    secondaryText: 'Danh sách người dùng sẽ xuất hiện ở đây',
  };

  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    const filtered = users.filter((user: any) => user.role === activeTab);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [users, activeTab, currentPage]);

  // Add pagination component
  const Pagination = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const maxVisiblePages = 3;
    let visiblePages = pages;

    if (totalPages > maxVisiblePages) {
      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      visiblePages = Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    return (
      <div className="flex items-center justify-center gap-1 mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-colors
            ${currentPage === 1 ? 'text-gray-300 border-gray-200 bg-white' : 'text-black border-gray-300 bg-white hover:bg-gray-100'}`}
        >
          &lt;
        </button>
        {visiblePages.map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm font-medium transition-colors
              ${currentPage === page
                ? 'bg-orange-400 text-white border-orange-400'
                : 'bg-white text-black border-gray-300 hover:bg-gray-100'}`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`w-8 h-8 flex items-center justify-center rounded-lg border text-sm transition-colors
            ${currentPage === totalPages ? 'text-gray-300 border-gray-200 bg-white' : 'text-black border-gray-300 bg-white hover:bg-gray-100'}`}
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Quản Lý Người Dùng</h1>
            {isAdmin && activeTab === 'EMPLOYEE' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <AddIcon className="mr-2" />
                Thêm Người Dùng
              </button>
            )}
          </div>
        </div>

        <div className="border-b">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {isAdmin && (
              <button
                onClick={() => setActiveTab('ADMIN')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ADMIN'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Quản trị viên
              </button>
            )}
            {(isAdmin || userRole === 'EMPLOYEE') && (
              <button
                onClick={() => setActiveTab('EMPLOYEE')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'EMPLOYEE'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Nhân viên
              </button>
            )}
            <button
              onClick={() => setActiveTab('CANDIDATE')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'CANDIDATE'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Ứng viên
            </button>
          </nav>
        </div>

        <div className="p-6">
          <Table
            columns={getColumns()}
            data={filteredUsers}
            emptyMessage={emptyMessage}
          />
          <Pagination />
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Thêm Người Dùng Mới</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <CloseIcon />
              </button>
            </div>

            <Formik
              initialValues={{
                name: '',
                email: '',
                phone: '',
                password: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleCreateUser}
            >
              {({ isSubmitting }) => (
                <Form className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập họ và tên"
                      />
                      <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập email"
                      />
                      <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <Field
                        type="text"
                        name="phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập số điện thoại"
                      />
                      <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu
                      </label>
                      <Field
                        type="password"
                        name="password"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập mật khẩu"
                      />
                      <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Đang thêm...' : 'Thêm người dùng'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEdit && editUser && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa thông tin</h2>
              <button
                onClick={() => {
                  setShowEdit(false);
                  setEditUser(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <CloseIcon />
              </button>
            </div>

            <Formik
              initialValues={{
                name: editUser.name || '',
                email: editUser.email || '',
                phone: editUser.phone || '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleEdit}
            >
              {({ isSubmitting }) => (
                <Form className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Họ và tên
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập họ và tên"
                      />
                      <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập email"
                      />
                      <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Số điện thoại
                      </label>
                      <Field
                        type="text"
                        name="phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập số điện thoại"
                      />
                      <ErrorMessage name="phone" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEdit(false);
                        setEditUser(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {showDeactivateConfirm && userToDeactivate && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Xác nhận khóa hoạt động</h2>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn khóa hoạt động của người dùng {userToDeactivate.name}?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeactivateConfirm(false);
                    setUserToDeactivate(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleDeactivate(userToDeactivate.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Khóa hoạt động
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Activate Confirmation Modal */}
      {showActivateConfirm && userToActivate && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Xác nhận mở hoạt động</h2>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn mở hoạt động của người dùng {userToActivate.name}?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowActivateConfirm(false);
                    setUserToActivate(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleActivate(userToActivate.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Mở hoạt động
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && userToChangePassword && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Đổi mật khẩu</h2>
              <button
                onClick={() => {
                  setShowChangePassword(false);
                  setUserToChangePassword(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <CloseIcon />
              </button>
            </div>

            <Formik
              initialValues={{
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={passwordChangeSchema}
              onSubmit={handleChangePassword}
            >
              {({ isSubmitting }) => (
                <Form className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu cũ
                      </label>
                      <Field
                        type="password"
                        name="oldPassword"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập mật khẩu cũ"
                      />
                      <ErrorMessage name="oldPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Mật khẩu mới
                      </label>
                      <Field
                        type="password"
                        name="newPassword"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập mật khẩu mới"
                      />
                      <ErrorMessage name="newPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Xác nhận mật khẩu
                      </label>
                      <Field
                        type="password"
                        name="confirmPassword"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowChangePassword(false);
                        setUserToChangePassword(null);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
}

// Export with role-based protection
export default UserManager; 