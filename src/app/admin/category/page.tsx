'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import Table from '@/components/Table';
import { Column } from '@/types/Table';

const categorySchema = Yup.object().shape({
  name: Yup.string()
    .required('Tên danh mục không được để trống')
    .min(2, 'Tên danh mục phải có ít nhất 2 ký tự'),
  thumbnail: Yup.string().nullable(),
});

export default function CategoryList() {
  const router = useRouter();
  const [categories, setCategories] = React.useState([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<any>(null);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    
    try {
      await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'DELETE',
      });
      fetchCategories();
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        fetchCategories();
        setIsModalOpen(false);
        resetForm();
      } else {
        console.error('Error creating category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (values: any, { setSubmitting, resetForm }: any) => {
    if (!selectedCategory) return;

    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        fetchCategories();
        setIsEditModalOpen(false);
        setSelectedCategory(null);
        resetForm();
      } else {
        console.error('Error updating category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (category: any) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: any) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const columns = [
    {
      header: '#',
      accessor: 'index',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      header: 'Ảnh',
      accessor: 'thumbnail',
      render: (thumbnail: string) =>
        thumbnail ? (
          <img
            src={thumbnail}
            alt="Thumbnail"
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <span className="text-gray-400">Không có ảnh</span>
        ),
    },
    {
      header: 'Tên Danh Mục',
      accessor: 'name',
    },
    {
      header: 'Thao Tác',
      accessor: 'actions',
      render: (value: any, row: any) => (
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
    icon: <CategoryIcon className="w-12 h-12 mb-4 text-gray-400" />,
    primaryText: 'Chưa có danh mục nào',
    secondaryText: 'Hãy thêm danh mục mới để bắt đầu',
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white rounded-xl shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Danh Mục</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <AddIcon className="mr-2" />
              Thêm Danh Mục
            </button>
          </div>
        </div>

        <div className="p-6">
          <Table
            columns={columns as Column[]}
            data={categories}
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
                <h2 className="text-xl font-bold text-gray-800">Thêm Danh Mục Mới</h2>
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
                  thumbnail: '',
                }}
                validationSchema={categorySchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên Danh Mục
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className={`w-full px-3 py-2 border rounded-lg ${
                          errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập tên danh mục"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh đại diện (thumbnail)
                      </label>
                      <Field name="thumbnail">
                        {({ field, form }: any) => (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                const formData = new FormData();
                                formData.append('file', file);
                                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                const data = await res.json();
                                if (data.success && data.name) {
                                  form.setFieldValue('thumbnail', `/uploads/${data.name}`);
                                }
                              }
                            }}
                            className="w-full px-3 py-2 border rounded-lg border-gray-300"
                          />
                        )}
                      </Field>
                      <ErrorMessage name="thumbnail" component="div" className="text-red-500 text-sm mt-1" />
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
                        {isSubmitting ? 'Đang tạo...' : 'Tạo Danh Mục'}
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
      {isEditModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Chỉnh Sửa Danh Mục</h2>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedCategory(null);
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
                  name: selectedCategory.name,
                  thumbnail: selectedCategory.thumbnail || '',
                }}
                validationSchema={categorySchema}
                onSubmit={handleEdit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Tên Danh Mục
                      </label>
                      <Field
                        name="name"
                        type="text"
                        className={`w-full px-3 py-2 border rounded-lg ${
                          errors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Nhập tên danh mục"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh đại diện (thumbnail)
                      </label>
                      <Field name="thumbnail">
                        {({ field, form }: any) => (
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                              const file = event.target.files?.[0];
                              if (file) {
                                const formData = new FormData();
                                formData.append('file', file);
                                const res = await fetch('/api/upload', { method: 'POST', body: formData });
                                const data = await res.json();
                                if (data.success && data.name) {
                                  form.setFieldValue('thumbnail', `/uploads/${data.name}`);
                                }
                              }
                            }}
                            className="w-full px-3 py-2 border rounded-lg border-gray-300"
                          />
                        )}
                      </Field>
                      {selectedCategory.thumbnail && (
                        <img src={selectedCategory.thumbnail} alt="Thumbnail" className="w-20 h-20 mt-2 rounded" />
                      )}
                      <ErrorMessage name="thumbnail" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditModalOpen(false);
                          setSelectedCategory(null);
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
      {isDeleteModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Xác nhận xóa</h2>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa danh mục "{selectedCategory.name}"?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedCategory(null);
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