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
    // TODO: Implement actual forgot password logic
    setTimeout(() => {
      setSuccess('If this email exists, a reset link has been sent.');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
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
              placeholder="Type your email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-blue-400 to-pink-400 shadow-md hover:from-blue-500 hover:to-pink-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'SEND RESET LINK'}
          </button>
        </form>
        <div className="mt-6 text-gray-500 text-sm">
          Remember your password?{' '}
          <button className="text-blue-500 hover:underline" onClick={() => router.push('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
} 