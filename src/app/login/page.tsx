"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaUser, FaLock, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { useLoading } from '../loading-provider';
import { useGoogleLogin } from '@react-oauth/google';
import { fetchUserData } from '@/store/slices/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const { setLoading } = useLoading();
  const [authenticate, setAuthenticate] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  // Watch authenticate and fetch user info if token exists
  useEffect(() => {
    if (authenticate) {
      try {
        dispatch(fetchUserData() as any);
      } catch (error) {
        setAuthenticate(false);
      }
    }
  }, [authenticate]);

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

      setAuthenticate(true);
      if (redirectPath) {
        router.push(redirectPath);
      } else if (data.user && data.user.role === 'CANDIDATE') {
        router.push('/');
      } else {
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async tokenResponse => {
      setLoading(true);
      setError('');
      try {
        const userInfoRes = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`);
        const userInfo = await userInfoRes.json();
        if (!userInfo.email) {
          throw new Error('Google did not return an email.');
        }
        // Call SNS login API
        const snsRes = await fetch('/api/auth/sns-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            avatar: userInfo.picture,
          }),
        });
        const snsData = await snsRes.json();
        if (!snsRes.ok || !snsData.success) {
          throw new Error(snsData.message || 'SNS login failed');
        }
        setAuthenticate(true);
        if (redirectPath) {
          router.push(redirectPath);
        } else if (snsData.user && snsData.user.role === 'CANDIDATE') {
          router.push('/');
        } else {
          router.push('/admin');
        }
      } catch (err: any) {
        setError(err.message || 'SNS login failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#309689] via-[#3ad29f] to-[#309689]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
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
              placeholder="Nhập email của bạn"
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
              placeholder="Nhập mật khẩu của bạn"
            />
            <span
              className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-blue-500 cursor-pointer hover:underline select-none"
              onClick={() => router.push('/forgot-password')}
            >
              Quên mật khẩu?
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-[#309689] to-[#3ad29f] shadow-md hover:from-[#26786b] hover:to-[#309689] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#309689] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ĐĂNG NHẬP
          </button>
        </form>
        <div className="my-6 flex items-center w-full">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">Hoặc đăng nhập bằng</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="flex space-x-4 mb-6">
          <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 transition" onClick={() => login()} aria-label="Login with Google">
            <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_17_40)">
                <path d="M47.532 24.552c0-1.636-.146-3.192-.418-4.668H24.48v9.02h13.02c-.56 3.02-2.24 5.58-4.76 7.308v6.06h7.7c4.5-4.144 7.092-10.24 7.092-17.72z" fill="#4285F4"/>
                <path d="M24.48 48c6.48 0 11.92-2.144 15.892-5.828l-7.7-6.06c-2.144 1.44-4.892 2.3-8.192 2.3-6.3 0-11.64-4.256-13.552-9.976H2.56v6.24C6.52 43.36 14.68 48 24.48 48z" fill="#34A853"/>
                <path d="M10.928 28.436A14.77 14.77 0 0 1 9.6 24c0-1.54.264-3.032.728-4.436v-6.24H2.56A23.98 23.98 0 0 0 0 24c0 3.86.92 7.52 2.56 10.676l8.368-6.24z" fill="#FBBC05"/>
                <path d="M24.48 9.56c3.528 0 6.66 1.216 9.14 3.6l6.84-6.84C36.4 2.144 30.96 0 24.48 0 14.68 0 6.52 4.64 2.56 13.324l8.368 6.24c1.912-5.72 7.252-9.976 13.552-9.976z" fill="#EA4335"/>
              </g>
              <defs>
                <clipPath id="clip0_17_40">
                  <rect width="48" height="48" fill="white"/>
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
        <div className="text-gray-400 text-sm mb-2">Hoặc đăng ký bằng</div>
        <button className="text-blue-500 font-semibold hover:underline text-sm" onClick={() => router.push('/register')}>ĐĂNG KÝ</button>
      </div>
    </div>
  );
} 