'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { fetchUserData } from '@/store/slices/userSlice';
import ProfileCard from './ProfileCard';

export default function ProfilePage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-lg text-gray-500">Bạn cần đăng nhập để xem trang này.</div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Cập nhật thất bại');
      } else {
        setSuccess(true);
        dispatch(fetchUserData() as any);
      }
    } catch (err) {
      setError('Có lỗi xảy ra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7fafc] via-[#e6f4f1] to-[#c6e2d8] py-12 px-4">
      <ProfileCard
        user={user}
        name={name}
        setName={setName}
        phone={phone}
        setPhone={setPhone}
        loading={loading}
        success={success}
        error={error}
        handleSubmit={handleSubmit}
      />
    </main>
  );
} 