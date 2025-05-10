import React from 'react';

const overviewCards = [
  {
    color: 'from-pink-500 to-purple-500',
    icon: 'person',
    value: '10,368',
    label: 'members online',
  },
  {
    color: 'from-green-400 to-green-600',
    icon: 'shopping_cart',
    value: '388,688',
    label: 'items sold',
  },
  {
    color: 'from-orange-400 to-pink-500',
    icon: 'event',
    value: '1,086',
    label: 'this week',
  },
  {
    color: 'from-green-400 to-lime-500',
    icon: 'attach_money',
    value: '$1,060,386',
    label: 'total earnings',
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8 mt-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-6 text-white shadow-lg bg-gradient-to-br ${card.color} flex items-center`}
          >
            <span className="material-icons text-4xl mr-4 opacity-80">{card.icon}</span>
            <div>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="text-sm opacity-80">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Reports and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow p-6 col-span-2 flex flex-col">
          <div className="font-semibold text-lg mb-4">Recent Reports</div>
          {/* Placeholder for area chart */}
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="w-full h-48 bg-gradient-to-r from-blue-100 to-green-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400">[Area Chart Placeholder]</span>
            </div>
            <div className="flex justify-between w-full mt-4 text-sm text-gray-500">
              <span>January</span>
              <span>March</span>
              <span>May</span>
              <span>July</span>
            </div>
            <div className="flex gap-4 mt-4">
              <span className="flex items-center text-blue-500"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>Products</span>
              <span className="flex items-center text-green-500"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>Services</span>
              <span className="text-green-600 ml-4">↑ 25% Products</span>
              <span className="text-red-500">↓ 10% Services</span>
            </div>
          </div>
        </div>
        {/* Chart By % */}
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <div className="font-semibold text-lg mb-4">Char By %</div>
          {/* Placeholder for donut chart */}
          <div className="w-48 h-48 flex items-center justify-center">
            <svg viewBox="0 0 36 36" className="w-full h-full">
              <circle cx="18" cy="18" r="16" fill="#f3f4f6" />
              <path
                d="M18 2 a 16 16 0 0 1 13.856 24.485"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="4"
              />
              <path
                d="M31.856 26.485 A 16 16 0 1 1 18 2"
                fill="none"
                stroke="#ef4444"
                strokeWidth="4"
              />
            </svg>
          </div>
          <div className="flex gap-4 mt-4">
            <span className="flex items-center text-blue-500"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>Products</span>
            <span className="flex items-center text-red-500"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>Services</span>
          </div>
        </div>
      </div>
    </div>
  );
} 