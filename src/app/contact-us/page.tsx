'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function ContactUsPage() {
  return (
    <main className="w-full min-h-screen bg-[#f7fafc] flex flex-col items-center">
      {/* Hero Section */}
      <motion.section initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="w-full bg-gradient-to-r from-[#309689] via-[#3ad29f] to-[#309689] py-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-0" />
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold font-['Figtree'] text-white mb-6 drop-shadow-lg">Liên hệ với chúng tôi</h1>
          <p className="text-lg md:text-2xl text-white/90 font-['Figtree'] mb-8 drop-shadow">
            Chúng tôi rất mong nhận được phản hồi từ bạn! Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi, góp ý hoặc cơ hội hợp tác nào.
          </p>
        </div>
      </motion.section>

      {/* Contact Form & Info */}
      <motion.section initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }} className="w-full max-w-4xl flex flex-col md:flex-row gap-8 px-4 py-16 items-start">
        {/* Contact Form */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-8 border border-[#e6f4f1]">
          <h2 className="text-2xl font-bold font-['Figtree'] text-[#309689] mb-6">Gửi tin nhắn cho chúng tôi</h2>
          <form className="flex flex-col gap-6">
            <input type="text" placeholder="Tên của bạn" className="rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689] font-['Figtree']" />
            <input type="email" placeholder="Email của bạn" className="rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689] font-['Figtree']" />
            <textarea placeholder="Nội dung tin nhắn" rows={5} className="rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689] font-['Figtree']" />
            <button type="submit" className="bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white px-8 py-3 rounded-lg font-bold font-['Figtree'] shadow-lg hover:from-[#26786b] hover:to-[#309689] transition text-lg">Gửi tin nhắn</button>
          </form>
        </div>
        {/* Contact Info */}
        <div className="flex-1 flex flex-col gap-8 items-center md:items-start">
          <div className="bg-[#EBF5F4] rounded-2xl p-8 w-full shadow-md border border-[#d1e7e4] flex flex-col gap-4">
            <h3 className="text-xl font-bold font-['Figtree'] text-[#309689] mb-2">Thông tin liên hệ</h3>
            <div className="flex flex-col gap-2 text-gray-700 font-['Figtree']">
              <span><b>Địa chỉ:</b> 123 Đường Chính, Quận 1, TP. Hồ Chí Minh</span>
              <span><b>Điện thoại:</b> (123) 456-7890</span>
              <span><b>Email:</b> contact@jobportal.com</span>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.7835992053265!2d105.81288073831891!3d21.001309910531827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ad490c3331c5%3A0x38cce1b37de2c3f6!2sVincom%20Mega%20Mall%20Royal%20City!5e0!3m2!1svi!2s!4v1747327875737!5m2!1svi!2s"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '16px', boxShadow: '0 4px 24px rgba(48,150,137,0.10)' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
              className="rounded-2xl shadow-lg w-full max-w-[400px] h-[300px] object-cover"
            ></iframe>
          </div>
        </div>
      </motion.section>
    </main>
  );
} 