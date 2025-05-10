'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/api';
import JobPostForm, { JobPostFormValues } from '@/components/JobPostForm';

export default function CreateJobPost() {
  const router = useRouter();
  const { user } = useAuth();
  const [categories, setCategories] = React.useState([]);
  const [levels, setLevels] = React.useState([]);

  React.useEffect(() => {
    // Fetch categories and levels when component mounts
    const fetchData = async () => {
      try {
        const [categoriesResponse, levelsResponse] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/levels')
        ]);
        const categoriesData = await categoriesResponse.json();
        const levelsData = await levelsResponse.json();
        setCategories(categoriesData);
        setLevels(levelsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values: JobPostFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const response = await api.post('/job-posts', {
        ...values,
        status: 'OPEN',
        category_id: values.category_id,
        level_id: values.level_id,
        experience: values.experience || '0'
      });

      if (response.data) {
        router.push('/admin/job-post');
      }
    } catch (error) {
      console.error('Error creating job post:', error);
      // You can add a toast or alert here to show the error to the user
    } finally {
      setSubmitting(false);
    }
  };

  // Redirect if user is not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <WorkOutlineIcon className="text-blue-600 mr-2 animate-pulse-icon" style={{ fontSize: '2rem' }} />
            <h1 className="text-2xl font-bold text-gray-800">Tạo Tin Tuyển Dụng Mới</h1>
          </div>
        </div>

        <JobPostForm
          initialValues={{
            title: '',
            description: '',
            requirements: '',
            benefits: '',
            salary: '',
            location: '',
            experience: '',
            deadline: '',
            category_id: '',
            level_id: '',
            posted_by_id: user?.id || '',
          }}
          categories={categories}
          levels={levels}
          onSubmit={handleSubmit}
          submitButtonText="Tạo tin tuyển dụng"
          onCancel={() => router.back()}
        />
      </div>

      <style jsx global>{`
        .ck-editor-wrapper .ck-editor__editable {
          min-height: 300px !important;
        }
        .ck-editor-wrapper .ck.ck-editor__editable_inline {
          min-height: 300px !important;
        }

        @keyframes pulse-icon {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-pulse-icon {
          animation: pulse-icon 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 