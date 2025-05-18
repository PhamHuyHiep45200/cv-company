'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CategorySection() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .finally(() => setLoading(false));
  }, []);

  const handleFindJobs = (catName: string) => {
    router.push(`/jobs?search=${encodeURIComponent(catName)}`);
  };

  return (
    <section className="flex flex-col items-center gap-[60px] py-[60px] pb-[120px] w-full bg-[#f7fafc]">
      {/* Header */}
      <div className="flex flex-col items-center gap-10 max-w-[900px] px-4">
        <h2 className="text-[40px] md:text-[50px] font-bold leading-[1.2] text-center font-['Figtree'] tracking-tight text-black">Tìm kiếm theo ngành nghề</h2>
        <p className="text-[16px] font-normal leading-[1.2] text-black opacity-80 font-['Figtree'] text-center">
        Tại EU, giá trị được tăng cường bằng sự tinh tế, ở giữa sự tinh tế là sự kết hợp hoàn hảo. Sự mềm mại từ khối lượng tạo thành các yếu tố trong mạng lưới liên kết chặt chẽ. Phần thân trên nhẹ nhàng với khối lượng mềm mại, mang đến giá trị và sự phát triển của sự điều chỉnh ở phần dưới. Nụ cười rạng rỡ, phần thân trên tươi sáng, thật sự sống động và tràn đầy sức sống. Những chuyển động mạnh mẽ mang lại sức sống cho phần dưới, hỗ trợ sự phát triển trong hành trình đều đặn. Chuyển động mạnh mẽ từ hai phía tạo ra giá trị và sự chăm sóc trong những khoảnh khắc nhẹ nhàng. Phần tinh hoa được thể hiện qua phong cách thanh lịch. Sự chuyển động nhanh nhẹn và đồng bộ tạo nên vẻ đẹp, trong sự phát triển không ngừng. Chuyển động được thể hiện rõ ràng qua những liên kết trong phương pháp và hiệu quả thực tế. Sự phát triển tập trung vào phần dưới với sự điều chỉnh nhẹ nhàng. Những chuyển động trong sự mềm mại giúp duy trì trạng thái ổn định. Mạng lưới chặt chẽ hỗ trợ sự phát triển mạnh mẽ của phần dưới với sự tinh tế hiện tại.
        </p>
      </div>
      {/* Category Cards */}
      <div className="flex flex-wrap justify-center gap-6 w-full max-w-[1296px] px-4">
        {loading ? (
          <div className="text-center w-full py-12 text-lg text-gray-500">Đang tải ngành nghề...</div>
        ) : categories.length === 0 ? (
          <div className="text-center w-full py-12 text-lg text-gray-500">Không có ngành nghề nào.</div>
        ) : (
          categories.map((cat, idx) => (
            <div
              key={cat.id || idx}
              className="bg-white rounded-[20px] shadow-[0_3px_8px_0_rgba(48,150,137,0.05)] flex flex-col items-center justify-center gap-6 w-[306px] h-[280px] p-8 transition-transform hover:scale-105 hover:shadow-xl border border-[#e6f4f1]"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-[#3096891A] rounded-full mb-2">
                <img src={cat.thumbnail || '/assets/category-icons/agriculture-2.svg'} alt={cat.name} className="w-12 h-12" />
              </div>
              <span className="text-[24px] font-bold font-['Figtree'] text-black text-center leading-[1.2]">{cat.name}</span>
              <span className="bg-[#3096891A] text-[#309689] rounded-[8px] px-4 py-1 text-[16px] font-normal font-['Figtree'] shadow-sm mt-2 cursor-pointer" onClick={() => handleFindJobs(cat.name)}>Tìm việc</span>
            </div>
          ))
        )}
      </div>
    </section>
  );
} 