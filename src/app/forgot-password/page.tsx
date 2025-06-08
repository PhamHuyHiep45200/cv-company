"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/emails/reset-pass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gửi email thất bại.');
      }
      setSuccess('Nếu email này tồn tại, một mật khẩu mới đã được gửi về email của bạn.');
    } catch (err: any) {
      setError(err.message || 'Gửi email thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#309689] via-[#3ad29f] to-[#309689]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quên mật khẩu</h2>
        <form className="w-full mt-6 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">{error}</div>}
          {success && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm text-center">{success}</div>}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaUser /></span>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-b border-gray-300 focus:border-purple-400 outline-none bg-transparent placeholder-gray-400"
              placeholder="Nhập email của bạn"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-[#309689] to-[#3ad29f] shadow-md hover:from-[#26786b] hover:to-[#309689] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#309689] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang gửi...' : 'Tôi muốn reset mật khẩu của mình'}
          </button>
        </form>
        <div className="mt-6 text-gray-500 text-sm">
          Nhớ mật khẩu?{' '}
          <button className="text-blue-500 hover:underline" onClick={() => router.push('/login')}>Đăng nhập</button>
        </div>
      </div>
    </div>
  );
} 