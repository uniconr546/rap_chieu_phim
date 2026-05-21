'use client';
import { useState } from 'react';
import Link from 'next/link';

// Định nghĩa cấu trúc dữ liệu Đơn hàng
interface Booking {
  id: string;
  customerName: string;
  movieTitle: string;
  showtime: string;
  room: string;
  seats: string;
  totalPrice: number;
  status: 'Thành công' | 'Đang chờ' | 'Đã hủy';
  bookingDate: string;
}

export default function AdminBookings() {
  // DỮ LIỆU GIẢ LẬP DANH SÁCH ĐƠN HÀNG
  const [bookings, setBookings] = useState<Booking[]>([
    { id: 'UC-8921', customerName: 'Unicorn Đại Vương', movieTitle: 'Dune: Part Two', showtime: '19:00 - 19/05', room: 'CINEMA 01', seats: 'C1, C2', totalPrice: 265000, status: 'Thành công', bookingDate: '19/05/2026 08:30' },
    { id: 'UC-8922', customerName: 'Nguyễn Văn A', movieTitle: 'Spider-Man: No Way Home', showtime: '20:30 - 19/05', room: 'IMAX 02', seats: 'D3', totalPrice: 150000, status: 'Đang chờ', bookingDate: '19/05/2026 09:15' },
    { id: 'UC-8923', customerName: 'Trần Thị B', movieTitle: 'Oppenheimer', showtime: '14:15 - 20/05', room: 'LUXE 03', seats: 'A1, A2, A3', totalPrice: 330000, status: 'Thành công', bookingDate: '18/05/2026 14:20' },
    { id: 'UC-8924', customerName: 'Lê Hoàng C', movieTitle: 'Dune: Part Two', showtime: '19:00 - 19/05', room: 'CINEMA 01', seats: 'F5', totalPrice: 120000, status: 'Đã hủy', bookingDate: '18/05/2026 20:00' },
  ]);

  // Hàm cập nhật trạng thái đơn hàng (Duyệt vé hoặc Hủy vé)
  const handleUpdateStatus = (id: string, newStatus: 'Thành công' | 'Đã hủy') => {
    if (confirm(`Ngài muốn chuyển đơn hàng ${id} thành "${newStatus}"?`)) {
      setBookings(bookings.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      ));
    }
  };

  return (
    // Dùng chính xác khung Layout bọc viền chống tràn
    <div className="bg-dark flex flex-col md:flex-row w-screen max-w-full min-h-screen overflow-x-hidden">     
      
      {/* =========================================
        CỘT BÊN TRÁI: SIDEBAR
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
        CỘT BÊN PHẢI: NỘI DUNG CHÍNH (flex-1 w-0 min-w-0)
        =========================================
      */}
      <main className="flex-1 w-0 min-w-0 overflow-x-hidden p-3 md:p-4 lg:p-5 mt-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Quản Lý Đơn Hàng</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Kiểm duyệt và theo dõi trạng thái mua vé của khách hàng</p>
          </div>
          
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Tìm mã vé hoặc SĐT..." 
              className="bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:ring-1 focus:ring-netflix outline-none w-full sm:w-auto"
            />
            <button className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm">
              🔍 Tìm
            </button>
          </div>
        </div>

        {/* BẢNG DANH SÁCH ĐƠN HÀNG */}
        <div className="bg-darkPanel rounded-xl border border-gray-800 shadow-xl overflow-hidden mb-8">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400 min-w-[900px]">
              <thead className="bg-black/40 text-gray-300 uppercase font-bold text-[10px] tracking-widest">
                <tr>
                  <th className="px-5 py-4">Mã Vé</th>
                  <th className="px-5 py-4">Khách Hàng</th>
                  <th className="px-5 py-4">Thông tin Suất chiếu</th>
                  <th className="px-5 py-4">Ghế</th>
                  <th className="px-5 py-4">Tổng Tiền</th>
                  <th className="px-5 py-4">Trạng Thái</th>
                  <th className="px-5 py-4 text-center">Xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-white block">{booking.id}</span>
                      <span className="text-[10px] text-gray-500">{booking.bookingDate}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-white text-sm">{booking.customerName}</td>
                    <td className="px-5 py-4">
                      <span className="text-white block font-medium mb-1">{booking.movieTitle}</span>
                      <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-[10px] mr-2">{booking.room}</span>
                      <span className="text-neonYellow text-xs font-mono">{booking.showtime}</span>
                    </td>
                    <td className="px-5 py-4 font-bold text-white">{booking.seats}</td>
                    <td className="px-5 py-4 text-white font-bold">{booking.totalPrice.toLocaleString('vi-VN')} đ</td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase 
                        ${booking.status === 'Thành công' ? 'bg-green-900/40 text-green-400 border border-green-800' : 
                          booking.status === 'Đang chờ' ? 'bg-yellow-900/40 text-yellow-400 border border-yellow-800' : 
                          'bg-gray-800/60 text-gray-500 border border-gray-700'}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        {/* Chỉ hiện nút Duyệt nếu đang chờ */}
                        {booking.status === 'Đang chờ' && (
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'Thành công')}
                            className="bg-green-600/20 text-green-500 hover:bg-green-600 hover:text-white border border-green-800 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                          >
                            ✓ Duyệt
                          </button>
                        )}
                        
                        {/* Nút Hủy (Chỉ hiện nếu chưa hủy) */}
                        {booking.status !== 'Đã hủy' && (
                          <button 
                            onClick={() => handleUpdateStatus(booking.id, 'Đã hủy')}
                            className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-800 px-3 py-1.5 rounded text-xs font-bold transition-colors"
                          >
                            ✕ Hủy
                          </button>
                        )}
                        
                        {/* Hiện chữ text mờ nếu đã hủy */}
                        {booking.status === 'Đã hủy' && (
                          <span className="text-gray-600 text-xs font-bold italic">Không thể tác động</span>
                        )}
                      </div>
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