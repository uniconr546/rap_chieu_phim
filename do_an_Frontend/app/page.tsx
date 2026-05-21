'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import MovieCard from '@/components/MovieCard';

interface MovieProps {
  id:number;
  title:string;
  description:string;
  duration:number;
  poster?:string;
  trailer_url?:string;
}

export default function HomePage(){

  const [movies,setMovies]=useState<MovieProps[]>([]);
  const [currentBanner,setCurrentBanner]=useState(0);

  // Lấy phim từ Django
  useEffect(()=>{

    const fetchMovies=async()=>{

      try{

        const response=await api.get('/movies/');

        setMovies(response.data);

      }catch(error){

        console.log(error);

      }

    }

    fetchMovies();

  },[]);


  // Tự chạy banner
  useEffect(()=>{

    if(movies.length===0) return;

    const timer=setInterval(()=>{

      setCurrentBanner(prev=>

        prev===movies.length-1
          ? 0
          : prev+1

      );

    },5000);

    return ()=>clearInterval(timer);

  },[movies]);


  const bannerMovie=movies[currentBanner];

  return(

<div className="animate-[fadeIn_0.5s_ease-out]">

{/* BANNER */}

<div className="relative w-full h-[70vh] mb-12 overflow-hidden">

<div className="absolute inset-0">

<img
src={
bannerMovie?.poster ||
"https://placehold.co/1920x1080?text=LH+CINEMA"
}
alt="Banner"
className="
w-full
h-full
object-cover
opacity-40
transition-all
duration-1000
"
/>

<div
className="
absolute
inset-0
bg-gradient-to-t
from-dark
via-dark/70
to-transparent
"
/>

</div>

<div
className="
absolute
bottom-20
left-10
md:left-24
max-w-2xl
z-10
"
>

<h1
className="
text-5xl
md:text-7xl
font-black
text-white
mb-4
"
>

{bannerMovie?.title || "LH CINEMA"}

</h1>

<p
className="
text-lg
text-gray-300
mb-6
line-clamp-3
"
>

{bannerMovie?.description ||
"Trải nghiệm điện ảnh đỉnh cao"}

</p>

<div className="flex gap-4">

<Link
href={`/movies/${bannerMovie?.id}`}
className="
bg-netflix
hover:bg-red-700
px-8
py-3
rounded-md
font-bold
transition
"
>

Chi Tiết

</Link>

{bannerMovie?.trailer_url && (

<a
href={bannerMovie.trailer_url}
target="_blank"
className="
bg-white
text-black
px-8
py-3
rounded-md
font-bold
hover:bg-gray-300
"
>

Trailer

</a>

)}

</div>

</div>

{/* Dấu chấm chuyển slide */}

<div
className="
absolute
bottom-6
left-1/2
-translate-x-1/2
flex
gap-3
z-20
"
>

{movies.map((_,index)=>(

<button
key={index}
onClick={()=>setCurrentBanner(index)}
className={`
w-3
h-3
rounded-full
transition-all

${currentBanner===index

? 'bg-netflix scale-125'

: 'bg-gray-500'

}

`}
/>

))}

</div>

</div>


{/* DANH SÁCH PHIM */}

<div className="container mx-auto px-4 mb-16">

<div className="flex items-center mb-8">

<div className="w-1 h-8 bg-netflix mr-3 rounded-full"/>

<h2
className="
text-3xl
font-bold
uppercase
"
>

PHIM ĐANG CHIẾU

</h2>

</div>

<div
className="
grid
grid-cols-2
md:grid-cols-3
lg:grid-cols-4
xl:grid-cols-5
gap-6
"
>

{movies.map(movie=>(

<MovieCard
key={movie.id}
movie={movie}
/>

))}

</div>

</div>

</div>

)

}