import React from "react";

export default function ApplicationDetailModal({
  open,
  onClose,
  application,
}: {
  open: boolean;
  onClose: () => void;
  application: any;
}) {
  if (!open || !application) return null;

  const handleSeeCV = () => {
    if (application.cv_file) {
      window.open(application.cv_file, "_blank");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-[#309689] text-center">
          Chi tiết ứng tuyển
        </h2>
        <div className="mb-4">
          <div><b>Họ tên:</b> {application.user?.name}</div>
          <div><b>Email:</b> {application.user?.email}</div>
          <div><b>Vị trí:</b> {application.job_post?.title}</div>
          <div><b>Level:</b> {application.job_post?.level?.name}</div>
          <div><b>Ngành:</b> {application.job_post?.category?.name}</div>
          <div><b>Ngày ứng tuyển:</b> {new Date(application.applied_at).toLocaleString()}</div>
          <div className="mt-2"><b>Thư xin việc:</b></div>
          <div className="border rounded p-2 bg-gray-50 mb-2 whitespace-pre-line">{application.cover_letter}</div>
        </div>
        <button
          onClick={handleSeeCV}
          className="bg-gradient-to-r from-[#309689] to-[#3ad29f] text-white px-6 py-3 rounded-lg font-semibold shadow hover:from-[#26786b] hover:to-[#309689] transition w-full"
        >
          Xem CV
        </button>
      </div>
    </div>
  );
} 