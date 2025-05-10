'use client'
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import api from '@/utils/api';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import JobPostForm, { JobPostFormValues } from '@/components/JobPostForm';

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

export default function EditJobPost() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [jobPost, setJobPost] = useState<JobPost | null>(null);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobPostResponse, categoriesResponse, levelsResponse] = await Promise.all([
          api.get(`/job-posts/${params.id}`),
          fetch('/api/categories'),
          fetch('/api/levels')
        ]);

        const jobPostData = jobPostResponse.data;
        const categoriesData = await categoriesResponse.json();
        const levelsData = await levelsResponse.json();

        setJobPost(jobPostData);
        setCategories(categoriesData);
        setLevels(levelsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load job post data');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleSubmit = async (values: JobPostFormValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      const updateData = {
        title: values.title,
        description: values.description,
        requirements: values.requirements,
        benefits: values.benefits,
        salary: values.salary,
        location: values.location,
        experience: values.experience || '0',
        deadline: values.deadline,
        status: jobPost?.status || 'OPEN',
        category_id: values.category_id,
        level_id: values.level_id,
        posted_by_id: jobPost?.posted_by?.id || user?.id
      };

      await api.put(`/job-posts/${params.id}`, updateData);

      router.push('/admin/job-post');
    } catch (error) {
      console.error('Error updating job post:', error);
      setError('Failed to update job post');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !jobPost) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error || 'Job post not found'}
        </div>
      </div>
    );
  }

  // Format the deadline date to YYYY-MM-DD for the date input
  const formattedDeadline = jobPost.deadline ? new Date(jobPost.deadline).toISOString().split('T')[0] : '';

  const initialValues: JobPostFormValues = {
    title: jobPost.title || '',
    description: jobPost.description || '',
    requirements: jobPost.requirements || '',
    benefits: jobPost.benefits || '',
    salary: jobPost.salary || '',
    location: jobPost.location || '',
    experience: jobPost.experience || '',
    deadline: formattedDeadline,
    category_id: jobPost.category?.id || '',
    level_id: jobPost.level?.id || '',
    posted_by_id: jobPost.posted_by?.id || user?.id || '',
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <WorkOutlineIcon className="text-blue-600 mr-2 animate-pulse-icon" style={{ fontSize: '2rem' }} />
            <h1 className="text-2xl font-bold text-gray-800">Chỉnh Sửa Tin Tuyển Dụng</h1>
          </div>
        </div>

        <JobPostForm
          initialValues={initialValues}
          categories={categories}
          levels={levels}
          onSubmit={handleSubmit}
          submitButtonText="Cập nhật tin tuyển dụng"
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