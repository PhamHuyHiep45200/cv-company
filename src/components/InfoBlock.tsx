'use client';
import Link from 'next/link';
import React from 'react';

const counters = [
  {
    value: '12k+',
    label: 'Khách hàng toàn cầu',
    desc: `Chúng tôi tự hào phục vụ mạng lưới khách hàng toàn cầu trải dài khắp các châu lục – từ những doanh nghiệp vừa và nhỏ đến các tập đoàn đa quốc gia. Với tầm nhìn quốc tế và hiểu biết sâu sắc về từng thị trường địa phương, chúng tôi đồng hành cùng khách hàng trong việc chinh phục mục tiêu kinh doanh, tối ưu hóa hiệu quả vận hành và tạo ra giá trị bền vững.`,
  },
  {
    value: '20k+',
    label: 'Hồ sơ ứng viên',
    desc: `Hồ sơ ứng viên là bản tóm lược đầy đủ và chính xác về trình độ học vấn, kinh nghiệm làm việc, kỹ năng chuyên môn cũng như định hướng nghề nghiệp của mỗi cá nhân. Thông qua hồ sơ này, nhà tuyển dụng có thể nhanh chóng nắm bắt được thông tin quan trọng, đánh giá mức độ phù hợp và tiềm năng phát triển của ứng viên đối với vị trí tuyển dụng.`,
  },
  {
    value: '18k+',
    label: 'Công ty',
    desc: `Chúng tôi là một doanh nghiệp tiên phong trong lĩnh vực Công Nghệ, cam kết mang đến những giải pháp chất lượng, sáng tạo và bền vững cho khách hàng trong và ngoài nước. Với đội ngũ nhân sự giàu kinh nghiệm, công nghệ tiên tiến và tinh thần không ngừng đổi mới, chúng tôi luôn hướng tới việc tạo ra giá trị thực tiễn, đóng góp tích cực vào sự phát triển chung của cộng đồng và nền kinh tế.`,
  },
];

export default function InfoBlock() {
  return (
    <section className="w-full bg-white flex flex-col gap-[86px] px-4 md:px-[72px] py-[120px] pb-[60px] items-center">
      {/* Top Row: Image + Text/Buttons */}
      <div className="flex flex-col md:flex-row items-center gap-[86px] w-full max-w-[1296px]">
        {/* Image */}
        <div className="flex-shrink-0 rounded-[20px] overflow-hidden w-[400px] h-[400px] bg-gray-100 shadow-lg">
          <img src="/assets/images/banner1.webp" alt="Info block main" className="object-cover w-full h-full" />
        </div>
        {/* Text + Buttons */}
        <div className="flex flex-col gap-[60px] w-full max-w-[600px]">
          <div className="flex flex-col gap-10">
            <h2 className="text-[40px] md:text-[50px] font-bold leading-[1.2] font-['Figtree'] text-black">Tại sao chọn nền tảng của chúng tôi?</h2>
            <p className="text-[16px] font-normal leading-[1.5] text-black/80 font-['Figtree']">
            Chúng tôi không chỉ cung cấp một nền tảng – chúng tôi mang đến một giải pháp toàn diện. Với giao diện thân thiện, công nghệ hiện đại và khả năng tùy chỉnh linh hoạt, nền tảng của chúng tôi giúp doanh nghiệp tiết kiệm thời gian, tối ưu chi phí và nâng cao hiệu quả vận hành.

Chúng tôi cam kết đồng hành cùng bạn với dịch vụ hỗ trợ tận tâm, bảo mật dữ liệu chặt chẽ và khả năng mở rộng vượt trội – để bạn luôn sẵn sàng phát triển trong mọi giai đoạn.
            </p>
          </div>
          <div className="flex flex-row gap-6">
            <Link href={'/jobs'} className="bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white rounded-lg px-8 py-4 font-semibold text-[18px] font-['Figtree'] shadow-md transition hover:from-[#26786b] hover:to-[#309689]">Bắt đầu ngay</Link>
            <Link href={'/about-us'} className="bg-white border border-[#309689] text-[#309689] rounded-lg px-8 py-4 font-semibold text-[18px] font-['Figtree'] shadow-md transition hover:bg-[#f7fafc]">Tìm hiểu thêm</Link>
          </div>
        </div>
      </div>
      {/* Counters Row */}
      <div className="flex flex-col md:flex-row justify-between items-start w-full max-w-[1296px] gap-8">
        {counters.map((counter, idx) => (
          <div key={idx} className="flex flex-col gap-[29px] w-[306px]">
            <span className="text-[#309689] text-[40px] font-bold font-['Figtree'] leading-[1.2]">{counter.value}</span>
            <span className="text-black text-[24px] font-semibold font-['Figtree'] leading-[1.2]">{counter.label}</span>
            <span className="text-black/80 text-[16px] font-normal font-['Figtree'] leading-[1.5]">{counter.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
} 