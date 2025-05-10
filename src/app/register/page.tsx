"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaLock } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    // TODO: Implement actual register logic
    setTimeout(() => {
      setSuccess('Registration successful!');
      setLoading(false);
      setTimeout(() => router.push('/login'), 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl px-10 py-12 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign Up</h2>
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
              value={formData.email}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 w-full border-b border-gray-300 focus:border-purple-400 outline-none bg-transparent placeholder-gray-400"
              placeholder="Type your email"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaLock /></span>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 w-full border-b border-gray-300 focus:border-purple-400 outline-none bg-transparent placeholder-gray-400"
              placeholder="Type your password"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FaLock /></span>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-10 pr-4 py-2 w-full border-b border-gray-300 focus:border-purple-400 outline-none bg-transparent placeholder-gray-400"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-blue-400 to-pink-400 shadow-md hover:from-blue-500 hover:to-pink-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing up...' : 'SIGN UP'}
          </button>
        </form>
        <div className="mt-6 text-gray-500 text-sm">
          Already have an account?{' '}
          <button className="text-blue-500 hover:underline" onClick={() => router.push('/login')}>Login</button>
        </div>
      </div>
    </div>
  );
} 