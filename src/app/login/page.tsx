"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock, FaFacebookF, FaTwitter, FaGoogle } from 'react-icons/fa';
import { useLoading } from '../loading-provider';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { setLoading } = useLoading();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // The token is already set in the cookie by the server
      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Login</h2>
        <form className="w-full mt-6 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaUser />
            </span>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 w-full border-b border-gray-300 focus:border-purple-400 outline-none bg-transparent placeholder-gray-400"
              placeholder="Type your username"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaLock />
            </span>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 w-full border-b border-gray-300 focus:border-purple-400 outline-none bg-transparent placeholder-gray-400"
              placeholder="Type your password"
            />
            <span
              className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-blue-500 cursor-pointer hover:underline select-none"
              onClick={() => router.push('/forgot-password')}
            >
              Forgot password?
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-blue-400 to-pink-400 shadow-md hover:from-blue-500 hover:to-pink-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            LOGIN
          </button>
        </form>
        <div className="my-6 flex items-center w-full">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">Or Sign Up using</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex space-x-4 mb-6">
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"><FaFacebookF /></button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500 transition"><FaTwitter /></button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 transition"><FaGoogle /></button>
        </div>
        <div className="text-gray-400 text-sm mb-2">Or Sign Up using</div>
        <button className="text-blue-500 font-semibold hover:underline text-sm" onClick={() => router.push('/register')}>SIGN UP</button>
      </div>
    </div>
  );
} 