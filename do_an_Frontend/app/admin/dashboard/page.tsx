// app/admin/dashboard/page.tsx
'use client';
import Link from 'next/link';

export default function AdminDashboard() {
  const revenueTrend = [
    { day: 'T2', amount: 120 },
    { day: 'T3', amount: 250 },
    { day: 'T4', amount: 180 },
    { day: 'T5', amount: 320 },
    { day: 'T6', amount: 450 },
    { day: 'T7', amount: 580 },
    { day: 'CN', amount: 490 },
  ];

  return (
<div className="bg-dark flex flex-col md:flex-row w-screen max-w-full overflow-x-hidden">    
      
      {/* =========================================
        CỘT BÊN TRÁI: SIDEBAR (CHIẾM CHÍNH XÁC 1/5)
        Dùng md:w-1/5 và md:flex-none để cấm nó tự phình to
        =========================================
      */}
<aside className="w-full md:w-[240px] lg:w-[260px] bg-darkPanel border-r border-gray-800 z-10 shrink-0 overflow-hidden min-h-screen">
  <div className="px-4 py-5 flex flex-col h-full">
    <h2 className="text-lg lg:text-xl font-black text-white tracking-wider mb-8 text-center md:text-left mt-2">
      <span className="text-neonYellow">ADMIN</span> PANEL
    </h2>
    
    <nav className="space-y-2 flex-1">
      <Link href="/admin/dashboard" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
        📊 Tổng Quan
      </Link>
      <Link href="/admin/movies" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
        🎬 Quản lý Phim
      </Link>
      <Link href="/admin/showtimes" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
        🗓️ Lịch Chiếu
      </Link>
      <Link href="/admin/bookings" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
        🎟️ Đơn Hàng
      </Link>
      {/* Nút Combo đây ạ */}
      <Link href="/admin/combos" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
        🍿 Quản lý Combo
      </Link>

      <div className="h-px bg-gray-700 my-6 mx-2 opacity-50"></div>

      <Link href="/" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-netflix font-bold rounded-lg transition-all">
        <span className="text-lg leading-none">🔙</span> Về Trang Chủ
      </Link>
    </nav>
  </div>
</aside>

      {/* =========================================
        CỘT BÊN PHẢI: NỘI DUNG CHÍNH (CHIẾM CHÍNH XÁC 4/5)
        Dùng md:w-4/5 và md:flex-none. 
        min-w-0 là THẦN CHÚ bắt buộc để bảng/biểu đồ bên trong không đẩy rách khung.
        =========================================
      */}
<main className="flex-1 w-0 min-w-0 overflow-x-hidden p-3 md:p-4 lg:p-5 -mt-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
          <h1 className="text-2xl font-bold text-white">Bảng Điều Khiển</h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Cập nhật lần cuối: <span className="text-neonYellow font-bold">12:30 - Hôm nay</span>
          </div>
        </div>

        {/* 1. HÀNG THẺ THỐNG KÊ (QUICK STATS) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Doanh thu tháng', value: '125.4M', color: 'netflix', icon: '💰' },
            { label: 'Vé bán ra', value: '1,248', color: 'neonYellow', icon: '🎟️' },
            { label: 'Khách mới', value: '+452', color: 'blue-500', icon: '👥' },
            { label: 'Lấp đầy', value: '78.5%', color: 'green-500', icon: '📈' },
          ].map((stat, index) => (
            <div key={index} className="bg-darkPanel p-4 rounded-xl border border-gray-800 hover:border-gray-600 transition-all shadow-md group">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xl sm:text-2xl">{stat.icon}</span>
                <span className="text-green-500 text-[10px] sm:text-xs font-bold">+12%</span>
              </div>
              <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className={`text-lg sm:text-xl font-black text-white group-hover:text-${stat.color} transition-colors`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* 2. KHU VỰC BIỂU ĐỒ & BÁO CÁO (CHART SECTION) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          
          {/* Biểu đồ xu hướng doanh thu */}
          <div className="xl:col-span-2 bg-darkPanel p-5 sm:p-6 rounded-xl border border-gray-800 shadow-xl overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base sm:text-lg font-bold text-white">Xu Hướng Doanh Thu</h3>
              <select className="bg-gray-900 border border-gray-700 text-gray-400 text-xs rounded px-2 py-1 outline-none">
                <option>7 ngày gần nhất</option>
                <option>30 ngày</option>
              </select>
            </div>
            
            <div className="relative h-48 w-full">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#E50914', stopOpacity:0.4}} />
                    <stop offset="100%" style={{stopColor:'#E50914', stopOpacity:0}} />
                  </linearGradient>
                </defs>
                <path d="M0,180 Q100,140 200,80 T400,100 T600,40 T700,60 L700,200 L0,200 Z" fill="url(#grad)" />
                <path d="M0,180 Q100,140 200,80 T400,100 T600,40 T700,60" fill="none" stroke="#E50914" strokeWidth="4" />
              </svg>
              <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-gray-500 font-bold px-1">
                {revenueTrend.map((item, i) => <span key={i}>{item.day}</span>)}
              </div>
            </div>
          </div>

          {/* Top phim doanh thu cao nhất */}
          <div className="bg-darkPanel p-5 sm:p-6 rounded-xl border border-gray-800 shadow-xl">
            <h3 className="text-base sm:text-lg font-bold text-white mb-6">Top Phim 🎬</h3>
            <div className="space-y-4">
              {[
                { title: 'Dune: Part Two', revenue: '45.2M', percent: 85 },
                { title: 'Spider-Man', revenue: '32.8M', percent: 65 },
                { title: 'Oppenheimer', revenue: '28.5M', percent: 55 },
                { title: 'The Batman', revenue: '12.4M', percent: 30 },
              ].map((movie, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                    <span className="text-gray-300 font-medium truncate pr-2">{movie.title}</span>
                    <span className="text-white font-bold">{movie.revenue}</span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-netflix h-full rounded-full" style={{ width: `${movie.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. BẢNG GIAO DỊCH GẦN ĐÂY */}
        <div className="bg-darkPanel rounded-xl border border-gray-800 shadow-xl overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-base font-bold text-white">Giao Dịch Gần Đây</h3>
            <button className="text-gray-400 hover:text-white text-xs transition-colors font-bold uppercase tracking-widest">Tải Báo Cáo ⬇️</button>
          </div>
          
          {/* Bọc bảng trong thẻ này để lỡ bảng quá dài thì CHỈ cuộn bảng, không cuộn cả trang */}
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
                {[
                  { id: 'UC-8921', name: 'Unicorn Đại Vương', movie: 'Dune: Part Two', amount: '265,000', status: 'Xong' },
                  { id: 'UC-8922', name: 'Nguyễn Văn A', movie: 'Spider-Man', amount: '150,000', status: 'Xong' },
                  { id: 'UC-8923', name: 'Trần Thị B', movie: 'Oppenheimer', amount: '385,000', status: 'Chờ' },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3 sm:px-6 sm:py-4 font-mono text-white">{item.id}</td>
                    <td className="px-5 py-3 sm:px-6 sm:py-4 font-bold">{item.name}</td>
                    <td className="px-5 py-3 sm:px-6 sm:py-4">{item.movie}</td>
                    <td className="px-5 py-3 sm:px-6 sm:py-4 text-neonYellow font-black">{item.amount} đ</td>
                    <td className="px-5 py-3 sm:px-6 sm:py-4">
                      <span className={`px-2 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase ${item.status === 'Xong' ? 'bg-green-900/40 text-green-400 border border-green-800' : 'bg-yellow-900/40 text-yellow-400 border border-yellow-800'}`}>
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