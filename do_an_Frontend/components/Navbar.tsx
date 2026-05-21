'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLetter, setUserLetter] = useState('U');

  useEffect(() => {

    const checkLogin = () => {

      const token =
        localStorage.getItem('access') ||
        localStorage.getItem('token');

      const username =
        localStorage.getItem('username');

      if (token) {

        setIsLoggedIn(true);

        if (username) {
          setUserLetter(
            username.charAt(0).toUpperCase()
          );
        }

      } else {

        setIsLoggedIn(false);
        setUserLetter('U');

      }

    };

    checkLogin();

    window.addEventListener(
      'storage',
      checkLogin
    );

    return () => {

      window.removeEventListener(
        'storage',
        checkLogin
      );

    };

  }, []);

  return (

<header className="fixed w-full top-0 z-50 bg-black/60 backdrop-blur-md border-b border-gray-800">

<div className="container mx-auto px-4 h-20 flex items-center justify-between">

{/* LOGO */}

<Link
href="/"
className="text-3xl font-black text-netflix tracking-tighter"
>
LH<span className="text-white">CINEMA</span>
</Link>

{/* MENU */}

<nav className="hidden md:flex space-x-8 font-medium">

<Link
href="/"
className="text-white hover:text-netflix"
>
Trang Chủ
</Link>

<Link
href="/movie"
className="text-gray-300 hover:text-white"
>
Lịch Chiếu
</Link>

<Link
href="/promotions"
className="text-gray-300 hover:text-white"
>
Khuyến Mãi
</Link>

</nav>

{/* RIGHT */}

<div className="flex items-center space-x-5">

<button
className="text-white hover:text-netflix"
>

<svg
className="w-6 h-6"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>

<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
/>

</svg>

</button>

<Link
href="/admin/dashboard"
className="hidden md:block bg-neonYellow text-black px-5 py-2 rounded-md font-bold"
>

Quản Trị

</Link>

{/* ĐĂNG NHẬP / AVATAR */}

{isLoggedIn ? (

<Link
href="/profile"
title="Hồ sơ cá nhân"
className="
w-10
h-10
rounded-full
bg-gradient-to-tr
from-netflix
to-purple-600
text-white
font-black
flex
items-center
justify-center
border-2
border-gray-700
hover:scale-110
transition-all
uppercase
shadow-[0_0_15px_rgba(229,9,20,0.5)]
"
>

{userLetter}

</Link>

) : (

<Link
href="/login"
className="
bg-netflix
hover:bg-red-700
text-white
px-5
py-2
rounded-md
font-semibold
transition-all
shadow-[0_0_15px_rgba(229,9,20,0.5)]
"
>

Đăng nhập

</Link>

)}

</div>

</div>

</header>

  );

}