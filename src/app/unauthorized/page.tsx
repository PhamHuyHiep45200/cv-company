'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { FaLock } from 'react-icons/fa';

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center">
            <FaLock className="h-16 w-16 text-red-500" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Truy cập bị từ chối
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Xin lỗi, bạn không có quyền truy cập vào trang này.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <div className="text-center text-sm text-gray-500">
            <p>Vai trò hiện tại của bạn: <span className="font-semibold">{user?.role}</span></p>
          </div>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Quay lại
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 