// app/register/page.tsx
'use client';
import api from '@/services/api';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function RegisterPage() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (password !== confirmPassword) {
    setError('Mật khẩu xác nhận không khớp!');
    return;
  }

  if (password.length < 6) {
    setError('Mật khẩu phải có ít nhất 6 ký tự!');
    return;
  }

  try {

    const response = await api.post('/auth/register/', {
      username,
      email,
      password,
    });

    console.log(response.data);

    alert('Đăng ký thành công!');
    router.push('/login');

  } catch (error: any) {

  console.log("FULL ERROR:", error);

  console.log("RESPONSE:", error.response);

  if (error.response?.data) {

    console.log(error.response.data);

    if (error.response.data.error) {
      setError(error.response.data.error);
    } else {
      setError(JSON.stringify(error.response.data));
    }

  } else {
    setError('Không thể kết nối server');
  }
}
};

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Ảnh nền mờ ảo */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://assets.nflxext.com/ffe/siteui/vlv3/a73c4363-1dcd-4719-b3b1-3725418fd91d/fe1147dd-78be-44aa-a0e5-2d2994305a13/VN-en-20231016-popsignuptwoweeks-perspective_alpha_website_large.jpg" 
          alt="Background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/50 to-dark"></div>
      </div>

      {/* Form Đăng Ký */}
      <div className="max-w-md w-full space-y-8 bg-black/70 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-800 z-10">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">
            Đăng Ký
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Gia nhập cộng đồng Unicorn Cinema
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Họ và tên</label>
              <input
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-netflix focus:border-transparent transition-all"
                placeholder="Nguyễn Văn A"
                value={username}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-netflix focus:border-transparent transition-all"
                placeholder="unicorn@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Mật khẩu</label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-netflix focus:border-transparent transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Xác nhận mật khẩu</label>
              <input
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 bg-gray-800 border border-gray-700 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-netflix focus:border-transparent transition-all"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-netflix hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-netflix focus:ring-offset-gray-900 transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)]"
            >
              TẠO TÀI KHOẢN
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-bold text-white hover:text-netflix transition-colors">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}