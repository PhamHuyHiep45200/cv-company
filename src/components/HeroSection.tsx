'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const logos = [
  '/assets/logos/logo1.svg',
  '/assets/logos/logo2.svg',
  '/assets/logos/logo3.svg',
  '/assets/logos/logo4.svg',
  '/assets/logos/logo5.svg',
  '/assets/logos/logo6.svg',
  '/assets/logos/logo7.svg',
  '/assets/logos/logo8.svg',
  '/assets/logos/logo9.svg',
  '/assets/logos/logo10.svg',
  '/assets/logos/logo11.svg',
  '/assets/logos/logo12.svg',
  '/assets/logos/logo13.svg',
  '/assets/logos/logo14.svg',
  '/assets/logos/logo15.svg',
  '/assets/logos/logo16.svg',
  '/assets/logos/logo17.svg',
  '/assets/logos/logo18.svg',
];

export default function HeroSection() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push('/jobs');
    }
  };

  return (
    <section className="relative flex flex-col items-center gap-[80px] px-4 md:px-[166px] pt-12 pb-0 w-full min-h-[700px] bg-gradient-to-br from-[#309689] via-[#3ad29f] to-[#1e293b] overflow-hidden">
      {/* Overlay for effect */}
      <div className="absolute inset-0 bg-black/60 pointer-events-none z-0" />
      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center gap-14 mt-8">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold text-center font-['Figtree'] leading-tight tracking-tight drop-shadow-lg bg-gradient-to-r from-white via-[#3ad29f] to-white bg-clip-text text-transparent">
            Tìm kiếm công việc mơ ước của bạn<br />Dễ dàng & Nhanh chóng
          </h1>
          <form onSubmit={handleSearch} className="flex items-center bg-white/90 rounded-2xl px-6 py-4 w-full max-w-[500px] shadow-lg border border-[#e0e7ef]">
            <input
              type="text"
              placeholder="Tìm kiếm công việc, công ty..."
              className="flex-1 outline-none text-gray-700 bg-transparent text-lg font-['Figtree'] placeholder-gray-400"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="ml-4 bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white px-7 py-2 rounded-lg font-semibold text-lg shadow transition hover:from-[#26786b] hover:to-[#309689] flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" /></svg>
              Tìm kiếm
            </button>
          </form>
        </div>
        {/* Feature Icons */}
        <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-10 w-full max-w-[700px] mt-4">
          <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl p-5 w-[180px] hover:bg-white/20 transition group shadow-md">
            <img src="/assets/logos/feature-briefcase.svg" alt="Feature 1" className="w-10 h-10 mb-2 group-hover:scale-110 transition" />
            <span className="text-white font-semibold text-lg font-['Figtree'] tracking-tight text-center">Ứng tuyển dễ dàng</span>
          </div>
          <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl p-5 w-[180px] hover:bg-white/20 transition group shadow-md">
            <img src="/assets/logos/feature-candidate.svg" alt="Feature 2" className="w-10 h-10 mb-2 group-hover:scale-110 transition" />
            <span className="text-white font-semibold text-lg font-['Figtree'] tracking-tight text-center">Công ty xác thực</span>
          </div>
          <div className="flex flex-col items-center bg-white/10 border border-white/20 rounded-xl p-5 w-[180px] hover:bg-white/20 transition group shadow-md">
            <img src="/assets/logos/feature-building.svg" alt="Feature 3" className="w-10 h-10 mb-2 group-hover:scale-110 transition" />
            <span className="text-white font-semibold text-lg font-['Figtree'] tracking-tight text-center">Phát triển sự nghiệp</span>
          </div>
        </div>
      </div>
    </section>
  );
} 