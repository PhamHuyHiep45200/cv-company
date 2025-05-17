import React from 'react';

export default function AboutPage() {
  return (
    <main className="w-full min-h-screen bg-[#f7fafc] flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#309689] via-[#3ad29f] to-[#309689] py-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold font-['Figtree'] text-white mb-6 drop-shadow-lg">Về chúng tôi</h1>
          <p className="text-lg md:text-2xl text-white/90 font-['Figtree'] mb-8 drop-shadow">
            Chúng tôi kết nối những người tài năng với các công ty tuyệt vời. Sứ mệnh của chúng tôi là giúp việc tìm kiếm việc làm trở nên dễ dàng, minh bạch và truyền cảm hứng cho tất cả mọi người.
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="w-full max-w-[1100px] px-4 py-16 flex flex-col md:flex-row gap-12 items-center justify-center">
        <div className="flex-1 flex flex-col gap-6">
          <h2 className="text-3xl font-bold font-['Figtree'] text-[#309689] mb-2">Sứ mệnh của chúng tôi</h2>
          <p className="text-lg text-gray-700 font-['Figtree']">
            Sứ mệnh của chúng tôi là trao quyền cho người tìm việc và nhà tuyển dụng bằng cách cung cấp một nền tảng thân thiện, liền mạch giúp kết nối ý nghĩa và phát triển sự nghiệp. Chúng tôi tin vào sự minh bạch, đa dạng và đổi mới trong môi trường làm việc.
          </p>
          <h2 className="text-3xl font-bold font-['Figtree'] text-[#309689] mt-8 mb-2">Tầm nhìn của chúng tôi</h2>
          <p className="text-lg text-gray-700 font-['Figtree']">
            Trở thành cổng thông tin việc làm hàng đầu, thay đổi cách mọi người tìm việc và các công ty tìm kiếm nhân tài, giúp quá trình này trở nên thú vị và hiệu quả cho tất cả mọi người.
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80" alt="Teamwork" className="rounded-2xl shadow-lg w-full max-w-[400px] object-cover" />
        </div>
      </section>

      {/* Our Values Section */}
      <section className="w-full bg-white py-16 flex flex-col items-center">
        <h2 className="text-3xl font-bold font-['Figtree'] text-[#309689] mb-10">Giá trị cốt lõi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-[1100px] w-full px-4">
          <div className="bg-[#EBF5F4] rounded-xl p-8 flex flex-col items-center shadow-md border border-[#d1e7e4]">
            <span className="text-4xl mb-4">🤝</span>
            <h3 className="text-xl font-semibold font-['Figtree'] text-[#309689] mb-2">Hợp tác</h3>
            <p className="text-gray-700 text-center font-['Figtree']">Chúng tôi làm việc cùng nhau để đạt được nhiều hơn, trân trọng mọi ý kiến và ý tưởng.</p>
          </div>
          <div className="bg-[#EBF5F4] rounded-xl p-8 flex flex-col items-center shadow-md border border-[#d1e7e4]">
            <span className="text-4xl mb-4">🌱</span>
            <h3 className="text-xl font-semibold font-['Figtree'] text-[#309689] mb-2">Phát triển</h3>
            <p className="text-gray-700 text-center font-['Figtree']">Chúng tôi thúc đẩy sự phát triển cá nhân và nghề nghiệp cho người dùng và đội ngũ của mình.</p>
          </div>
          <div className="bg-[#EBF5F4] rounded-xl p-8 flex flex-col items-center shadow-md border border-[#d1e7e4]">
            <span className="text-4xl mb-4">💡</span>
            <h3 className="text-xl font-semibold font-['Figtree'] text-[#309689] mb-2">Đổi mới</h3>
            <p className="text-gray-700 text-center font-['Figtree']">Chúng tôi đón nhận những ý tưởng và công nghệ mới để cải thiện trải nghiệm tìm việc.</p>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="w-full max-w-[1100px] px-4 py-16 flex flex-col items-center">
        <h2 className="text-3xl font-bold font-['Figtree'] text-[#309689] mb-10">Gặp gỡ đội ngũ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          <div className="flex flex-col items-center bg-white rounded-xl p-8 shadow-md border border-[#e6f4f1]">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Team member" className="w-24 h-24 rounded-full mb-4 object-cover shadow" />
            <h3 className="text-xl font-bold font-['Figtree'] text-[#309689]">Alex Johnson</h3>
            <p className="text-gray-700 font-['Figtree']">Giám đốc điều hành & Đồng sáng lập</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl p-8 shadow-md border border-[#e6f4f1]">
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Team member" className="w-24 h-24 rounded-full mb-4 object-cover shadow" />
            <h3 className="text-xl font-bold font-['Figtree'] text-[#309689]">Maria Lee</h3>
            <p className="text-gray-700 font-['Figtree']">Trưởng phòng sản phẩm</p>
          </div>
          <div className="flex flex-col items-center bg-white rounded-xl p-8 shadow-md border border-[#e6f4f1]">
            <img src="https://randomuser.me/api/portraits/men/54.jpg" alt="Team member" className="w-24 h-24 rounded-full mb-4 object-cover shadow" />
            <h3 className="text-xl font-bold font-['Figtree'] text-[#309689]">Samuel Green</h3>
            <p className="text-gray-700 font-['Figtree']">Kỹ sư trưởng</p>
          </div>
        </div>
      </section>
    </main>
  );
} 