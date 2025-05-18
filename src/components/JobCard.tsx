'use client';

import React from 'react';

export interface JobCardProps {
  badge: string;
  icon: string;
  logo: string;
  title: string;
  timePost: string;
  category: { icon: string; text: string };
  type: { icon: string; text: string };
  salary: { icon: string; text: string };
  location: { icon: string; text: string };
  onDetailsClick?: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  badge,
  icon,
  logo,
  title,
  timePost,
  category,
  type,
  salary,
  location,
  onDetailsClick,
}) => (
  <div
    className="bg-white rounded-[20px] border border-[#F3F4F6] w-full max-w-[1296px] p-6 md:p-10 flex flex-col gap-7 shadow-[0_3px_8px_0_rgba(48,150,137,0.08)] transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl group"
  >
    <div className="flex flex-col gap-6">
      <div className="flex flex-row justify-between items-center">
        <div className="flex items-start gap-10 w-full">
          <div className="flex items-center gap-5">
            <img src={logo} alt="logo" className="w-12 h-12 rounded-full shadow" />
            <div>
              <div className="text-[22px] md:text-[28px] font-semibold font-['Figtree'] leading-[1.2] text-black">
                {title}
              </div>
              <div className="text-[15px] md:text-[16px] font-normal font-['Figtree'] leading-[19px] text-black opacity-80">
                {timePost}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <span className="bg-gradient-to-r from-[#3096891A] to-[#3ad29f1A] text-[#309689] rounded-[8px] px-4 py-1 text-[16px] font-normal font-['Figtree'] shadow-sm">
              {badge}
            </span>
          </div>
        </div>
      </div>
    </div>
    {/* Divider */}
    <div className="w-full h-px bg-gradient-to-r from-[#e6f4f1] via-[#30968933] to-[#e6f4f1] my-2" />
    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start md:items-end mt-2">
      <div className="flex items-center gap-3 min-w-[140px]">
        <img src={"/assets/logos/job-card-briefcase.svg"} alt="category" className="w-6 h-6" />
        <span className="font-semibold text-[15px] md:text-[16px] text-gray-700 font-['Figtree']">{category.text}</span>
      </div>
      <div className="flex items-center gap-3 min-w-[100px]">
        <img src={"/assets/logos/job-card-clock.svg"} alt="type" className="w-6 h-6" />
        <span className="font-semibold text-[15px] md:text-[16px] text-gray-700 font-['Figtree']">{type.text}</span>
      </div>
      <div className="flex items-center gap-3 min-w-[120px]">
        <img src={"/assets/logos/job-card-salary.svg"} alt="salary" className="w-6 h-6" />
        <span className="font-semibold text-[15px] md:text-[16px] text-gray-700 font-['Figtree']">{salary.text}</span>
      </div>
      <div className="flex items-center gap-3 min-w-[140px]">
        <img src={"/assets/logos/job-card-map-pin.svg"} alt="location" className="w-6 h-6" />
        <span className="font-semibold text-[15px] md:text-[16px] text-gray-700 font-['Figtree'] max-w-[200px] truncate">{location.text}</span>
      </div>
      <button
        className="ml-0 md:ml-auto text-nowrap mt-4 md:mt-0 bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white rounded-[8px] px-5 py-3 font-semibold text-[16px] font-['Figtree'] shadow-sm flex items-center gap-2 transition-all duration-200 hover:from-[#26786b] hover:to-[#309689]"
        onClick={onDetailsClick}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        Chi tiết công việc
      </button>
    </div>
  </div>
);

export default JobCard; 