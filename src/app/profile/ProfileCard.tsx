import { motion } from 'framer-motion';

export default function ProfileCard({ user, name, setName, phone, setPhone, loading, success, error, handleSubmit }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 border border-[#e6f4f1]"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full bg-[#3ad29f] flex items-center justify-center overflow-hidden shadow-lg mb-2">
          {user.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-4xl font-bold">{user.name?.charAt(0) || '?'}</span>
          )}
        </div>
        <div className="text-[22px] font-bold text-[#309689] font-['Figtree']">{user.name}</div>
        <div className="text-gray-500 text-[16px]">{user.email}</div>
        <div className="flex gap-2 mt-1">
          <span className="bg-[#e6f4f1] text-[#309689] rounded px-3 py-1 text-xs font-semibold">{user.role}</span>
          <span className={`rounded px-3 py-1 text-xs font-semibold ${user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{user.status}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3ad29f] font-['Figtree']"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#3ad29f] font-['Figtree']"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white font-bold py-3 rounded-lg shadow-lg hover:from-[#26786b] hover:to-[#309689] transition mt-2 font-['Figtree'] disabled:opacity-60"
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        {success && <div className="text-green-600 text-center font-semibold mt-2 animate-bounce">Cập nhật thành công!</div>}
        {error && <div className="text-red-600 text-center font-semibold mt-2">{error}</div>}
      </form>
    </motion.div>
  );
} 