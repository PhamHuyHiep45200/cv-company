'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch } from 'react-redux';
import { clearUser } from '@/store/slices/userSlice';
import { deleteCookie } from 'cookies-next';
import { motion } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });
    dispatch(clearUser());
    router.push('/login');
  };

  const handleUpdateInfo = () => {
    setPopoverOpen(false);
    router.push('/profile');
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full sticky top-0 z-50 flex justify-center bg-black/40 backdrop-blur-md border-b border-white/5 shadow-lg"
    >
      <nav className="w-full max-w-[1296px] flex flex-row justify-between items-center py-4 px-4 md:px-0">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="font-extrabold text-[22px] font-['Figtree'] text-white tracking-wide drop-shadow hover:text-[#3ad29f] transition">
          <img src="/assets/logos/logo.png" alt="Logo" className="w-[7rem] h-[3.5rem] drop-shadow-lg" />
          </Link>
        </div>
        {/* Menu */}
        <ul className="flex flex-row gap-6 md:gap-10 bg-white/0 rounded-xl px-2 py-1">
          <li>
            <Link href="/" className={`text-white text-[16px] font-medium font-['Figtree'] hover:opacity-100 hover:text-[#3ad29f] transition${pathname === '/' ? ' opacity-100 text-[#3ad29f] font-semibold' : ''}`}>Trang chủ</Link>
          </li>
          <li>
            <Link href="/jobs" className={`text-white text-[16px] font-medium font-['Figtree'] hover:opacity-100 hover:text-[#3ad29f] transition${pathname.startsWith('/jobs') ? ' opacity-100 text-[#3ad29f] font-semibold' : ''}`}>Việc làm</Link>
          </li>
          <li>
            <Link href="/about-us" className={`text-white text-[16px] font-medium font-['Figtree'] hover:opacity-100 hover:text-[#3ad29f] transition${pathname === '/about-us' ? ' opacity-100 text-[#3ad29f] font-semibold' : ''}`}>Về chúng tôi</Link>
          </li>
          <li>
            <Link href="/contact-us" className={`text-white text-[16px] font-medium font-['Figtree'] hover:opacity-100 hover:text-[#3ad29f] transition${pathname === '/contact-us' ? ' opacity-100 text-[#3ad29f] font-semibold' : ''}`}>Liên hệ</Link>
          </li>
        </ul>
        {/* Buttons or User */}
        <div className="flex flex-row gap-4 items-center relative">
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="text-white text-[16px] font-semibold font-['Figtree'] px-4 py-2 rounded-lg hover:bg-white/20 hover:text-[#3ad29f] transition focus:outline-none focus:ring-2 focus:ring-[#309689]">Đăng nhập</Link>
              <Link href="/register" className="bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white text-[16px] font-bold font-['Figtree'] px-6 py-2 rounded-lg shadow-lg hover:scale-105 hover:from-[#26786b] hover:to-[#309689] transition uppercase focus:outline-none focus:ring-2 focus:ring-[#3ad29f]">Đăng ký</Link>
            </>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition text-white font-semibold focus:outline-none focus:ring-2 focus:ring-[#309689]"
                onClick={() => setPopoverOpen((v) => !v)}
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name || 'User'} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="w-8 h-8 rounded-full bg-[#3ad29f] flex items-center justify-center text-white font-bold text-lg">{user?.name?.charAt(0) || '?'}</span>
                )}
                <span>{user?.name || 'Người dùng'}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {popoverOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                  {(user?.role ?? '') && ['ADMIN', 'EMPLOYEE'].includes(user?.role ?? '') && (
                    <button
                      onClick={() => { setPopoverOpen(false); router.push('/admin'); }}
                      className="w-full text-left px-4 py-2 text-blue-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      Quản Lý Admin
                    </button>
                  )}
                  <button
                    onClick={handleUpdateInfo}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                  >
                    Cập nhật thông tin
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded-b-lg"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </motion.header>
  );
} 