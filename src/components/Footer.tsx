'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="w-full bg-black flex flex-col items-center gap-[80px] px-4 md:px-[202px] pt-[100px] pb-[60px] text-white"
    >
      {/* Top Row: Main Footer Content */}
      <div className="flex flex-col md:flex-row justify-between gap-[60px] md:gap-[140px] w-full max-w-[1296px]">
        {/* Logo + Description */}
        <div className="flex flex-col gap-10 max-w-[377px]">
          <div className="flex items-center gap-3">
            <img src="/assets/logos/logo.png" alt="Logo" className="w-[7rem] h-[3.5rem]" />
          </div>
          <p className="text-[20px] font-semibold font-['Lexend'] leading-[1.6] text-white/80">
            Chúng tôi kết nối ứng viên với các công việc phù hợp và doanh nghiệp uy tín. Sứ mệnh của chúng tôi là giúp việc tìm việc trở nên dễ dàng và hiệu quả.
          </p>
        </div>
        {/* Company Links */}
        <div className="flex flex-col gap-6 min-w-[160px]">
          <span className="text-[20px] font-semibold font-['Inter']">Công ty</span>
          <div className="flex flex-col gap-4 text-[16px] font-normal font-['Inter'] text-white/80">
            <a href="#" className="hover:text-[#3ad29f] transition">Về chúng tôi</a>
            <a href="#" className="hover:text-[#3ad29f] transition">Tuyển dụng</a>
            <a href="#" className="hover:text-[#3ad29f] transition">Liên hệ</a>
            <a href="#" className="hover:text-[#3ad29f] transition">Blog</a>
          </div>
        </div>
        {/* Job Categories Links */}
        <div className="flex flex-col gap-6 min-w-[160px]">
          <span className="text-[20px] font-semibold font-['Inter']">Ngành nghề</span>
          <div className="flex flex-col gap-4 text-[16px] font-normal font-['Inter'] text-white/80">
            <a href="#" className="hover:text-[#3ad29f] transition">Thiết kế</a>
            <a href="#" className="hover:text-[#3ad29f] transition">Lập trình</a>
            <a href="#" className="hover:text-[#3ad29f] transition">Marketing</a>
            <a href="#" className="hover:text-[#3ad29f] transition">Kinh doanh</a>
          </div>
        </div>
        {/* Newsletter Signup */}
        <div className="flex flex-col gap-4 max-w-[306px] w-full">
          <span className="text-[20px] font-semibold font-['Inter']">Bản tin</span>
          <span className="text-[14px] font-normal font-['Inter'] text-white/80">Đăng ký nhận thông tin việc làm mới nhất từ chúng tôi</span>
          <form className="flex flex-row gap-2 mt-2">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 rounded-[12px] px-4 py-3 bg-transparent border border-white/60 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#309689]"
            />
            <button
              type="submit"
              className="bg-[#309689] rounded-[12px] px-8 py-3 font-semibold text-[16px] font-['Inter'] transition hover:bg-[#26786b]"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
      {/* Bottom Row: Copyright & Links */}
      <div className="flex flex-col md:flex-row justify-between items-end w-full max-w-[1296px] gap-8 border-t border-white/10 pt-8">
        <span className="text-[14px] font-normal font-['Inter'] text-white/50">© Bản quyền Cổng việc làm 2024. Thiết kế bởi Figma.guru</span>
        <div className="flex flex-row gap-6 text-[16px] font-normal font-['Inter'] text-white/80">
          <a href="#" className="hover:text-[#3ad29f] transition">Chính sách bảo mật</a>
          <a href="#" className="hover:text-[#3ad29f] transition">Điều khoản sử dụng</a>
        </div>
      </div>
    </motion.footer>
  );
} 