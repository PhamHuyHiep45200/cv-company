"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CategoryIcon from '@mui/icons-material/Category';
import WorkIcon from '@mui/icons-material/Work';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [showPopover, setShowPopover] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPopover(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      // Close the popover
      setShowPopover(false);
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed w-64 h-screen bg-white shadow-md flex flex-col">
        <div className="flex items-center h-20 px-6 border-b">
          <span className="font-bold text-xl text-gray-800">
            COOL <span className="text-gray-400">ADMIN</span>
          </span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link
            href="/admin"
            className={`flex items-center px-4 py-2 rounded-lg ${
              pathname === "/admin"
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <DashboardIcon className="mr-3" /> Bảng Điều Khiển
          </Link>
          <Link
            href="/admin/user-manager"
            className={`flex items-center px-4 py-2 rounded-lg ${
              pathname.startsWith("/admin/user-manager")
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <GroupIcon className="mr-3" /> Quản Lý Người Dùng
          </Link>
          <Link
            href="/admin/job-post"
            className={`flex items-center px-4 py-2 rounded-lg ${
              pathname.startsWith("/admin/job-post")
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <WorkOutlineIcon className="mr-3" /> Tin Tuyển Dụng
          </Link>
          <Link
            href="/admin/category"
            className={`flex items-center px-4 py-2 rounded-lg ${
              pathname.startsWith("/admin/category")
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <CategoryIcon className="mr-3" /> Danh Mục
          </Link>
          <Link
            href="/admin/level"
            className={`flex items-center px-4 py-2 rounded-lg ${
              pathname.startsWith("/admin/level")
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <WorkIcon className="mr-3" /> Vị Trí
          </Link>
          <Link
            href="/admin/application"
            className={`flex items-center px-4 py-2 rounded-lg ${
              pathname.startsWith("/admin/application")
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <DescriptionIcon className="mr-3" /> Đơn Ứng Tuyển
          </Link>
          <Link
            href="/admin/interview"
            className={`flex items-center px-4 py-2 rounded-lg ${
              pathname.startsWith("/admin/interview")
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <EventNoteIcon className="mr-3" /> Phỏng Vấn
          </Link>
          <Link
            href="/admin/notification"
            className={`flex items-center px-4 py-2 rounded-lg ${
              pathname.startsWith("/admin/notification")
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <NotificationsActiveIcon className="mr-3" /> Thông Báo
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Topbar */}
        <header className="fixed top-0 right-0 left-64 h-20 bg-white shadow flex items-center px-8 justify-between z-10">
          <div className="flex items-center w-1/2">
            {pathname !== "/admin" && (
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
              >
                <ArrowBackIcon className="mr-1" />
                <span>Quay lại</span>
              </button>
            )}
            {/* <input
              type="text"
              placeholder="Tìm kiếm dữ liệu & báo cáo..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg">🔍</button> */}
          </div>
          <div className="flex items-center space-x-6">
            <div className="relative" ref={popoverRef}>
              <button
                onClick={() => setShowPopover(!showPopover)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="User"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-700">John Doe</span>
              </button>

              {/* Popover Menu */}
              {showPopover && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogoutIcon className="mr-2 text-gray-500" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="pt-20 p-8 min-h-screen bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
