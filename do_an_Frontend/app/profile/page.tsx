// app/profile/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 1. Import bộ điều hướng vào đây
import { QRCodeSVG } from 'qrcode.react';

interface TicketHistory {
  id: string;
  movieTitle: string;
  showtime: string;
  room: string;
  seats: string;
  totalPrice: number;
  bookingCode: string;
  status: 'upcoming' | 'completed';
}

export default function ProfilePage() {
  const router = useRouter(); // 2. Khởi tạo bộ điều hướng

  // Dữ liệu giả lập: Thông tin user
  const user = {
    name: 'Unicorn Đại Vương',
    email: 'unicorn@example.com',
    memberLevel: 'VIP',
    totalPoints: 1250
  };

  // Dữ liệu giả lập: Lịch sử đặt vé
  const [tickets] = useState<TicketHistory[]>([
    {
      id: 'TK-001',
      movieTitle: 'Dune: Part Two',
      showtime: '19:00 - 19/05/2026',
      room: 'CINEMA 01',
      seats: 'C1, C2',
      totalPrice: 265000,
      bookingCode: 'UNICORN-DUNE-8923A',
      status: 'upcoming'
    },
    {
      id: 'TK-002',
      movieTitle: 'Spider-Man: No Way Home',
      showtime: '20:30 - 10/05/2026',
      room: 'IMAX 02',
      seats: 'D3, D4',
      totalPrice: 385000,
      bookingCode: 'UNICORN-SPDY-1129B',
      status: 'completed'
    }
  ]);

  // 3. HÀM XỬ LÝ ĐĂNG XUẤT PHÁT MỘT KHỎI HỆ THỐNG
const handleLogout = () => {

localStorage.removeItem('access')
localStorage.removeItem('refresh')
localStorage.removeItem('token')
localStorage.removeItem('username')

window.location.href='/'

}

  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* HEADER: THÔNG TIN TÀI KHOẢN & NÚT ĐĂNG XUẤT */}
        <div className="bg-darkPanel p-6 md:p-8 rounded-2xl border border-gray-800 shadow-xl mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-24 h-24 bg-gradient-to-tr from-netflix to-purple-600 rounded-full flex items-center justify-center text-3xl border-4 border-gray-800 shadow-[0_0_15px_rgba(229,9,20,0.5)]">
              🦄
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">{user.name}</h1>
              <p className="text-gray-400">{user.email}</p>
              <div className="mt-2 inline-block bg-neonYellow text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Thành viên {user.memberLevel}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="text-center md:text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Điểm tích lũy</p>
              <p className="text-3xl font-black text-neonYellow">{user.totalPoints} <span className="text-sm text-gray-500">pts</span></p>
            </div>
            
            {/* 4. NÚT ĐĂNG XUẤT HIỆU ỨNG GLOW XỊN XÒ */}
            <button 
              onClick={handleLogout}
              className="mt-2 bg-transparent hover:bg-netflix border-2 border-netflix text-white hover:text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(229,9,20,0.2)] hover:shadow-[0_0_20px_rgba(229,9,20,0.6)] text-sm uppercase tracking-wider cursor-pointer"
            >
              Đăng Xuất
            </button>
          </div>
        </div>

        {/* BODY: LỊCH SỬ ĐẶT VÉ */}
        <div className="flex items-center mb-8">
          <div className="w-1 h-8 bg-netflix mr-3 rounded-full"></div>
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Vé Của Tôi</h2>
        </div>

        <div className="space-y-8">
          {tickets.map((ticket) => (
            <div key={ticket.id} className={`flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl border ${ticket.status === 'upcoming' ? 'border-netflix/50' : 'border-gray-800 opacity-70'}`}>
              
              {/* Nửa trái: Thông tin phim */}
              <div className="bg-darkPanel p-6 md:p-8 flex-grow relative">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${ticket.status === 'upcoming' ? 'bg-netflix text-white' : 'bg-gray-700 text-gray-300'}`}>
                      {ticket.status === 'upcoming' ? 'Sắp chiếu' : 'Đã xem'}
                    </span>
                    <h3 className="text-2xl font-black text-white mt-3">{ticket.movieTitle}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Mã đơn hàng</p>
                    <p className="font-mono text-gray-300">{ticket.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Suất chiếu</p>
                    <p className="font-bold text-neonYellow">{ticket.showtime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Phòng chiếu</p>
                    <p className="font-bold text-white">{ticket.room}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Ghế</p>
                    <p className="font-bold text-white">{ticket.seats}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Tổng tiền</p>
                    <p className="font-bold text-white">{ticket.totalPrice.toLocaleString('vi-VN')} đ</p>
                  </div>
                </div>

                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark rounded-full border-l border-gray-800 z-10"></div>
              </div>

              {/* Đường đứt nét ngăn cách */}
              <div className="hidden md:block w-px bg-transparent border-l-2 border-dashed border-gray-700 relative"></div>
              <div className="md:hidden h-px w-full bg-transparent border-t-2 border-dashed border-gray-700 relative"></div>

              {/* Nửa phải: QR Code */}
              <div className="bg-darkPanel p-6 md:p-8 flex flex-col items-center justify-center min-w-[250px] relative">
                 <div className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-dark rounded-full border-r border-gray-800 z-10"></div>
                
                <p className="text-sm text-gray-400 mb-4 text-center">Đưa mã này cho nhân viên rạp</p>
                
                <div className={`p-3 bg-white rounded-xl ${ticket.status === 'completed' ? 'opacity-50 grayscale' : ''}`}>
                  <QRCodeSVG 
                    value={ticket.bookingCode} 
                    size={140} 
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"Q"}
                  />
                </div>
                
                <p className="font-mono text-xs text-gray-500 mt-4 tracking-widest">{ticket.bookingCode}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}