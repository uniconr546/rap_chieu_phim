// app/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

export default function LoginPage() {

  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');

  const handleLogin = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();
    setError('');

    if(!username || !password){

      setError(
        'Vui lòng nhập đầy đủ tài khoản và mật khẩu!'
      );

      return;
    }

    try{

      // LOGIN JWT DJANGO
      const response = await api.post(
        '/auth/login/',
        {
          username,
          password
        }
      );

      console.log(response.data);

      // LƯU JWT TOKEN
      localStorage.setItem(
        'access',
        response.data.access
      );

      localStorage.setItem(
        'refresh',
        response.data.refresh
      );

      localStorage.setItem(
        'username',
        username
      )

      // Nếu backend trả role
      if(response.data.role){

        localStorage.setItem(
          'role',
          response.data.role
        );

      }

      alert(
        'Đăng nhập thành công!'
      );

      // Nếu admin
      if(
        response.data.role === 'admin'
      ){

        window.location.href =
        '/admin/dashboard';

      }else{

        window.location.href =
        '/';

      }

    }catch(err:any){

      console.log(
        err.response?.data
      )

      const message =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      'Sai tài khoản hoặc mật khẩu';

      setError(
        '❌ ' + message
      )

    }

  }

  return (

<div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">

<div className="absolute inset-0 z-0">
<img
src="https://assets.nflxext.com/ffe/siteui/vlv3/a73c4363-1dcd-4719-b3b1-3725418fd91d/fe1147dd-78be-44aa-a0e5-2d2994305a13/VN-en-20231016-popsignuptwoweeks-perspective_alpha_website_large.jpg"
alt="Background"
className="w-full h-full object-cover opacity-30"
/>

<div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/50 to-dark"></div>

</div>

<div className="max-w-md w-full space-y-8 bg-black/70 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-800 z-10">

<div>

<h2 className="text-center text-3xl font-extrabold text-white">
Đăng Nhập
</h2>

<p className="mt-2 text-center text-sm text-gray-400">
Chào mừng ngài trở lại Unicorn Cinema
</p>

</div>

<form
className="mt-8 space-y-6"
onSubmit={handleLogin}
>

{error && (

<div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded text-sm text-center">

{error}

</div>

)}

<div className="space-y-4">

<input
type="text"
required
placeholder="Username"
value={username}
onChange={(e)=>
setUsername(
e.target.value
)}
className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
/>

<input
type="password"
required
placeholder="Mật khẩu"
value={password}
onChange={(e)=>
setPassword(
e.target.value
)}
className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
/>

</div>

<button
type="submit"
className="w-full py-3 bg-netflix rounded-lg text-white font-bold"
>

ĐĂNG NHẬP

</button>

</form>

<div className="text-center">

<p className="text-gray-400">

Chưa có tài khoản?

<Link
href="/register"
className="text-white font-bold ml-2"
>

Đăng ký ngay

</Link>

</p>

</div>

</div>

</div>

)

}