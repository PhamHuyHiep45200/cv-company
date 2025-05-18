import React from "react";

function SuccessNotify({ open }: { open: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center animate-fadeInUp relative">
        <div className="mb-4">
          <svg className="w-16 h-16 text-green-500 animate-pop" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="#e6f4f1" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 12l3 3 5-5" />
          </svg>
        </div>
        <div className="text-xl font-bold text-[#309689] text-center">Chúc mừng bạn đã ứng tuyển thành công</div>
      </div>
      <style jsx>{`
        .animate-fadeInUp {
          animation: fadeInUp 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .animate-pop {
          animation: pop 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default function ApplyModal({ open, onClose, user, jobId }: { open: boolean; onClose: () => void; user?: { name?: string; email?: string }; jobId: string }) {
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [coverLetter, setCoverLetter] = React.useState('');
  const [cvFile, setCvFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setName(user?.name || '');
    setEmail(user?.email || '');
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!cvFile) {
      setError('Vui lòng chọn file CV (.csv)');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('coverLetter', coverLetter);
      formData.append('cv', cvFile);
      const res = await fetch(`/api/job-posts/${jobId}/apply`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gửi đơn ứng tuyển thất bại');
      }
      setSuccess(true);
      setCoverLetter('');
      setCvFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      setError(err.message || 'Gửi đơn ứng tuyển thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-[#309689] text-center">Ứng tuyển vào vị trí này</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Họ và tên"
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689] bg-gray-100 cursor-not-allowed"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled
            />
            <input
              type="email"
              placeholder="Email"
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689] bg-gray-100 cursor-not-allowed"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled
            />
            {/* File upload for CV */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-[#309689]">Tải lên CV (.csv)</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white rounded-lg font-semibold shadow hover:from-[#26786b] hover:to-[#309689] transition"
                >
                  Chọn file
                </button>
                <span className="text-gray-700 text-sm truncate max-w-[160px]">
                  {cvFile ? cvFile.name : "Chưa chọn file"}
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv, .pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            <textarea
              placeholder="Thư xin việc"
              className="rounded-lg px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#309689]"
              rows={4}
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
            />
            {error && <div className="text-red-600 text-sm font-semibold">{error}</div>}
            <button
              type="submit"
              className="bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white px-6 py-3 rounded-lg font-semibold font-['Figtree'] shadow-md hover:from-[#26786b] hover:to-[#309689] transition disabled:opacity-60"
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}
            </button>
          </form>
        </div>
      </div>
      <SuccessNotify open={success} />
    </>
  );
} 