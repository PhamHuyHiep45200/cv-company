'use client';
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import Table from '@/components/Table';
import { Column } from '@/types/Table';

interface Level {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

const levelSchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên vị trí không được để trống')
    .min(2, 'Tên vị trí phải có ít nhất 2 ký tự'),
});

export default function LevelList() {
  const [levels, setLevels] = React.useState<Level[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedLevel, setSelectedLevel] = React.useState<Level | null>(null);

  React.useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/levels');
      const data = await response.json();
      setLevels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching levels:', error);
      setLevels([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLevel) return;
    
    try {
      const response = await fetch(`/api/levels/${selectedLevel.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchLevels();
        setIsDeleteModalOpen(false);
        setSelectedLevel(null);
      } else {
        console.error('Error deleting level');
      }
    } catch (error) {
      console.error('Error deleting level:', error);
    }
  };

  const handleSubmit = async (values: { name: string }, { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }) => {
    try {
      const response = await fetch('/api/levels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        await fetchLevels();
        setIsModalOpen(false);
        resetForm();
      } else {
        console.error('Error creating level');
      }
    } catch (error) {
      console.error('Error creating level:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values: { name: string }, { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }) => {
    if (!selectedLevel) return;

    try {
      const response = await fetch(`/api/levels/${selectedLevel.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        await fetchLevels();
        setIsEditModalOpen(false);
        setSelectedLevel(null);
        resetForm();
      } else {
        console.error('Error updating level');
      }
    } catch (error) {
      console.error('Error updating level:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (level: Level) => {
    setSelectedLevel(level);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (level: Level) => {
    setSelectedLevel(level);
    setIsDeleteModalOpen(true);
  };

  const columns: Column[] = [
    {
      header: '#',
      accessor: 'index',
      render: (_: unknown, __: unknown, index?: number) => (index ?? 0) + 1,
    },
    {
      header: 'Tên Vị Trí',
      accessor: 'name',
    },
    {
      header: 'Thao Tác',
      accessor: 'actions',
      render: (_: unknown, row: Level) => (
        <div className="flex space-x-3">
          <button
            onClick={() => openEditModal(row)}
            className="text-blue-600 hover:text-blue-900"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => openDeleteModal(row)}
            className="text-red-600 hover:text-red-900"
          >
            <DeleteIcon />
          </button>
        </div>
      ),
    },
  ];

  const emptyMessage = {
    icon: <WorkOutlineIcon className="w-12 h-12 mb-4 text-gray-400" />,
    primaryText: 'Chưa có vị trí nào',
    secondaryText: 'Hãy thêm vị trí mới để bắt đầu',
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Vị Trí</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <AddIcon className="mr-2" />
              Thêm Vị Trí
            </button>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={columns}
            data={levels}
            emptyMessage={emptyMessage}
          />
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Thêm Vị Trí Mới</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="p-6">
              <Formik
                initialValues={{
                  name: '',
                }}
                validationSchema={levelSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên Vị Trí
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className={`w-full px-3 py-2 border rounded-lg ${
                          errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập tên vị trí"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Đang tạo...' : 'Tạo Vị Trí'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedLevel && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Chỉnh Sửa Vị Trí</h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedLevel(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="p-6">
              <Formik
                initialValues={{
                  name: selectedLevel.name,
                }}
                validationSchema={levelSchema}
                onSubmit={handleEdit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên Vị Trí
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className={`w-full px-3 py-2 border rounded-lg ${
                          errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập tên vị trí"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditModalOpen(false);
                          setSelectedLevel(null);
                        }}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedLevel && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Xác nhận xóa</h2>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa vị trí &quot;{selectedLevel.name}&quot;?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedLevel(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 