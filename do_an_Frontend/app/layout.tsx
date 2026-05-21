// app/layout.tsx
import './globals.css';
import Navbar from '../components/Navbar'; // Import thanh điều hướng thông minh vào đây

export const metadata = {
  title: 'LH Cinema',
  description: 'Hệ thống đặt vé rạp chiếu phim hàng đầu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-dark text-white min-h-screen flex flex-col" suppressHydrationWarning>
        
        {/* Gọi thanh điều hướng thông minh */}
        <Navbar />

        {/* NỘI DUNG CÁCH TRANG SẼ ĐƯỢC CHÈN VÀO ĐÂY */}
        <main className="flex-grow pt-20">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-black py-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© 2026 Unicorn Cinema. Thiết kế bởi Unicorn Đại Vương.</p>
        </footer>
      </body>
    </html>
  );
}