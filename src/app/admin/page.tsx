'use client'
import React, { useEffect, useState } from 'react';

const roleLabels: Record<string, string> = {
  ADMIN: 'Admin',
  EMPLOYEE: 'Nhân viên',
  CANDIDATE: 'Ứng viên',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-96 text-xl">Đang tải thống kê...</div>;
  }
  if (!stats) {
    return <div className="flex justify-center items-center h-96 text-xl text-red-500">Không thể tải thống kê.</div>;
  }

  // Prepare chart data for applications by month (last 12 months)
  const months = Object.keys(stats.applicationsByMonth).sort().slice(-12);
  const maxMonth = Math.max(...months.map(m => stats.applicationsByMonth[m]));

  return (
    <div className="space-y-8 mt-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Users by role */}
        {stats.usersByRole.map((item: any, idx: number) => (
          <div
            key={item.role}
            className={`rounded-xl p-6 text-white shadow-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center`}
          >
            <span className="material-icons text-4xl mr-4 opacity-80">group</span>
            <div>
              <div className="text-2xl font-bold">{item._count.role}</div>
              <div className="text-sm opacity-80">{roleLabels[item.role] || item.role}</div>
            </div>
          </div>
        ))}
        {/* Job postings count */}
        <div className="rounded-xl p-6 text-white shadow-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center">
          <span className="material-icons text-4xl mr-4 opacity-80">work</span>
          <div>
            <div className="text-2xl font-bold">{stats.jobPostingsCount}</div>
            <div className="text-sm opacity-80">Tin tuyển dụng</div>
          </div>
        </div>
        {/* Candidates by job position (top 1) */}
        {stats.candidatesByJob[0] && (
          <div className="rounded-xl p-6 text-white shadow-lg bg-gradient-to-br from-orange-400 to-pink-500 flex items-center">
            <span className="material-icons text-4xl mr-4 opacity-80">assignment_ind</span>
            <div>
              <div className="text-2xl font-bold">{stats.candidatesByJob[0].count}</div>
              <div className="text-sm opacity-80">Ứng viên cho {stats.candidatesByJob[0].job_title}</div>
            </div>
          </div>
        )}
      </div>

      {/* Candidates by job position (table) */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="font-semibold text-lg mb-4">Ứng viên theo vị trí tuyển dụng</div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng ứng viên</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.candidatesByJob.map((row: any) => (
                <tr key={row.job_post_id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.job_title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applications by month (bar chart) */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="font-semibold text-lg mb-4">Số đơn ứng tuyển theo tháng (12 tháng gần nhất)</div>
        <div className="flex items-end gap-2 h-48">
          {months.map(month => (
            <div key={month} className="flex flex-col items-center justify-end h-full">
              <div
                className="w-8 rounded-t bg-gradient-to-t from-[#3ad29f] to-[#309689] flex items-end justify-center text-xs text-white"
                style={{ height: `${(stats.applicationsByMonth[month] / maxMonth) * 100 || 5}%`, minHeight: 10 }}
                title={`${month}: ${stats.applicationsByMonth[month]}`}
              >
                {stats.applicationsByMonth[month]}
              </div>
              <span className="text-xs mt-1 text-gray-500">{month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Applications by year (summary) */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="font-semibold text-lg mb-4">Số đơn ứng tuyển theo năm</div>
        <div className="flex gap-6">
          {Object.keys(stats.applicationsByYear).sort().map(year => (
            <div key={year} className="flex flex-col items-center">
              <span className="text-2xl font-bold text-[#309689]">{stats.applicationsByYear[year]}</span>
              <span className="text-gray-600">{year}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 