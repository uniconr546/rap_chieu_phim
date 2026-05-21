// app/admin/dashboard/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/services/api';

export default function AdminDashboard() {

  const [movies, setMovies] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  const revenueTrend = [
    { day: 'T2', amount: 120 },
    { day: 'T3', amount: 250 },
    { day: 'T4', amount: 180 },
    { day: 'T5', amount: 320 },
    { day: 'T6', amount: 450 },
    { day: 'T7', amount: 580 },
    { day: 'CN', amount: 490 },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {

        // API Movies
        const movieRes = await api.get('/movies/');
        setMovies(movieRes.data);

        // API Bookings
        const bookingRes = await api.get('/bookings/');
        setBookings(bookingRes.data);

        console.log('MOVIES:', movieRes.data);
        console.log('BOOKINGS:', bookingRes.data);

      } catch (error) {
        console.log('API ERROR:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-dark flex flex-col md:flex-row w-screen max-w-full overflow-x-hidden">

      {/* SIDEBAR */}
      <aside className="w-full md:w-[240px] lg:w-[260px] bg-darkPanel border-r border-gray-800 z-10 shrink-0 overflow-hidden min-h-screen">
        <div className="px-4 py-5 flex flex-col h-full">

          <h2 className="text-lg lg:text-xl font-black text-white tracking-wider mb-8 text-center md:text-left mt-2">
            <span className="text-neonYellow">ADMIN</span> PANEL
          </h2>

          <nav className="space-y-2 flex-1">

            <Link
              href="/admin/dashboard"
              className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all"
            >
              📊 Tổng Quan
            </Link>

            <Link
              href="/admin/movies"
              className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all"
            >
              🎬 Quản lý Phim
            </Link>

            <Link
              href="/admin/showtimes"
              className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all"
            >
              🗓️ Lịch Chiếu
            </Link>

            <Link
              href="/admin/bookings"
              className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all"
            >
              🎟️ Đơn Hàng
            </Link>

            <Link
              href="/admin/combos"
              className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all"
            >
              🍿 Quản lý Combo
            </Link>

            <div className="h-px bg-gray-700 my-6 mx-2 opacity-50"></div>

            <Link
              href="/"
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-netflix font-bold rounded-lg transition-all"
            >
              <span className="text-lg leading-none">🔙</span>
              Về Trang Chủ
            </Link>

          </nav>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 w-0 min-w-0 overflow-x-hidden p-3 md:p-4 lg:p-5 -mt-2">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">

          <h1 className="text-2xl font-bold text-white">
            Bảng Điều Khiển
          </h1>

          <div className="text-gray-400 text-xs sm:text-sm">
            Cập nhật lần cuối:
            <span className="text-neonYellow font-bold">
              {' '}Backend Connected
            </span>
          </div>

        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">

          {[
            {
              label: 'Tổng Phim',
              value: movies.length,
              color: 'netflix',
              icon: '🎬'
            },

            {
              label: 'Doanh Thu Tháng',
              value: `${bookings.reduce(
                (total, item) => total + Number(item.total_price || 0),
                0
              ).toLocaleString()} đ`,
              color: 'green-500',
              icon: '💰'
            },

            {
              label: 'Số Vé Bán Ra',
              value: bookings.length,
              color: 'blue-500',
              icon: '🎫'
            },

          ].map((stat, index) => (

            <div
              key={index}
              className="bg-darkPanel p-4 rounded-xl border border-gray-800 hover:border-gray-600 transition-all shadow-md group"
            >

              <div className="flex justify-between items-start mb-2">

                <span className="text-xl sm:text-2xl">
                  {stat.icon}
                </span>

                <span className="text-green-500 text-[10px] sm:text-xs font-bold">
                  +12%
                </span>

              </div>

              <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">
                {stat.label}
              </p>

              <h3
                className={`text-lg sm:text-xl font-black text-white group-hover:text-${stat.color} transition-colors`}
              >
                {stat.value}
              </h3>

            </div>

          ))}
        </div>

        {/* CHART + TOP MOVIES */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 mb-8 items-start">

        {/* CHART */}
        <div className="lg:col-span-7 bg-darkPanel p-5 sm:p-6 rounded-xl border border-gray-800 shadow-xl overflow-hidden">

          <div className="flex justify-between items-center mb-6">

            <h3 className="text-base sm:text-lg font-bold text-white">
              Xu Hướng Doanh Thu
            </h3>

            <select className="bg-gray-900 border border-gray-700 text-gray-400 text-xs rounded px-2 py-1 outline-none">
              <option>7 ngày gần nhất</option>
              <option>30 ngày</option>
            </select>

          </div>

          <div className="relative h-48 w-full">

            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 700 200"
              preserveAspectRatio="none"
            >

              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#E50914', stopOpacity: 0.4 }} />
                  <stop offset="100%" style={{ stopColor: '#E50914', stopOpacity: 0 }} />
                </linearGradient>
              </defs>

              <path
                d="M0,180 Q100,140 200,80 T400,100 T600,40 T700,60 L700,200 L0,200 Z"
                fill="url(#grad)"
              />

              <path
                d="M0,180 Q100,140 200,80 T400,100 T600,40 T700,60"
                fill="none"
                stroke="#E50914"
                strokeWidth="4"
              />

            </svg>

            <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-gray-500 font-bold px-1">

              {revenueTrend.map((item, i) => (
                <span key={i}>
                  {item.day}
                </span>
              ))}

            </div>
          </div>
        </div>
          {/* TOP MOVIES */}
          <div className="lg:col-span-3 bg-darkPanel p-5 sm:p-6 rounded-xl border border-gray-800 shadow-xl">

            <h3 className="text-base sm:text-lg font-bold text-white mb-6">
              Top Phim 🎬
            </h3>

            <div className="space-y-4">

              {movies.slice(0, 5).map((movie, i) => (

                <div key={i}>

                  <div className="flex justify-between text-xs sm:text-sm mb-1.5">

                    <span className="text-gray-300 font-medium truncate pr-2">
                      {movie.title}
                    </span>

                    <span className="text-white font-bold">
                      {movie.duration} phút
                    </span>

                  </div>

                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">

                    <div
                      className="bg-netflix h-full rounded-full"
                      style={{ width: `${80 - i * 10}%` }}
                    ></div>

                  </div>

                </div>

              ))}

            </div>
          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="bg-darkPanel rounded-xl border border-gray-800 shadow-xl overflow-hidden mb-8">

          <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">

            <h3 className="text-base font-bold text-white">
              Giao Dịch Gần Đây
            </h3>

            <button className="text-gray-400 hover:text-white text-xs transition-colors font-bold uppercase tracking-widest">
              Tải Báo Cáo ⬇️
            </button>

          </div>

          <div className="w-full overflow-x-auto">

            <table className="w-full text-left text-xs sm:text-sm text-gray-400 min-w-[500px]">

              <thead className="bg-black/40 text-gray-300 uppercase font-bold text-[10px] tracking-widest">

                <tr>
                  <th className="px-5 py-3 sm:px-6 sm:py-4">Mã Vé</th>
                  <th className="px-5 py-3 sm:px-6 sm:py-4">Khách Hàng</th>
                  <th className="px-5 py-3 sm:px-6 sm:py-4">Phim</th>
                  <th className="px-5 py-3 sm:px-6 sm:py-4">Số Tiền</th>
                  <th className="px-5 py-3 sm:px-6 sm:py-4">Trạng Thái</th>
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-800">

                {bookings.map((item, i) => (

                  <tr
                    key={i}
                    className="hover:bg-white/5 transition-colors"
                  >

                    <td className="px-5 py-3 sm:px-6 sm:py-4 font-mono text-white">
                      #{item.id}
                    </td>

                    <td className="px-5 py-3 sm:px-6 sm:py-4 font-bold">
                      {item.user?.username || 'Unknown'}
                    </td>

                    <td className="px-5 py-3 sm:px-6 sm:py-4">
                      {item.movie?.title || 'No movie'}
                    </td>

                    <td className="px-5 py-3 sm:px-6 sm:py-4 text-neonYellow font-black">
                      {item.total_price || 0} đ
                    </td>

                    <td className="px-5 py-3 sm:px-6 sm:py-4">

                      <span
                        className={`px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${
                          item.status === 'completed'
                            ? 'bg-green-900/40 text-green-400 border border-green-800'
                            : 'bg-yellow-900/40 text-yellow-400 border border-yellow-800'
                        }`}
                      >
                        {item.status}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          </div>
        </div>

      </main>
    </div>
  );
}