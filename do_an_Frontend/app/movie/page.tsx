// app/movie/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

interface Movie {
  id:number;
  title:string;
 description:string;
  duration:number;
  poster?:string;
  status:string;
  genres?:{
    id:number;
    name:string;
  }[];
}

export default function MoviesPage(){

  const [movies,setMovies]=useState<Movie[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{

    const fetchMovies=async()=>{

      try{

        const response=await api.get('/movies/');

        setMovies(response.data);

      }catch(error){

        console.log(error);

      }finally{

        setLoading(false);

      }

    };

    fetchMovies();

  },[]);


  if(loading){

    return(

      <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      text-white
      text-2xl
      "
      >

      Đang tải phim...

      </div>

    )

  }

  return(

<div
className="
container
mx-auto
px-4
py-16
"
>

<h1
className="
text-4xl
font-black
text-white
mb-8
"
>

LỊCH CHIẾU PHIM

</h1>

<div
className="
grid
grid-cols-1
md:grid-cols-2
gap-8
"
>

{movies.map((movie)=>(

<div
key={movie.id}

className="
bg-darkPanel
p-6
rounded-2xl
border
border-gray-800
flex
gap-6
hover:border-netflix
transition-all
"

>

<img

src={
movie.poster ||
'https://placehold.co/300x450?text=No+Poster'
}

alt={movie.title}

className="
w-32
h-48
object-cover
rounded-lg
shadow-lg
"

/>

<div className="flex-1">

<h2
className="
text-2xl
font-bold
text-white
mb-3
"
>

{movie.title}

</h2>

<div
className="
flex
flex-wrap
gap-2
mb-4
"
>

<span
className="
bg-netflix
px-3
py-1
rounded
text-xs
font-bold
"
>

{movie.duration} PHÚT

</span>

<span
className="
bg-gray-700
px-3
py-1
rounded
text-xs
font-bold
"
>

{movie.status==="now_showing"

? "ĐANG CHIẾU"

: movie.status==="coming_soon"

? "SẮP CHIẾU"

: movie.status

}

</span>

{movie.genres?.map((genre)=>(

<span

key={genre.id}

className="
bg-purple-700
px-3
py-1
rounded
text-xs
font-bold
"

>

{genre.name}

</span>

))}

</div>

<p
className="
text-gray-400
line-clamp-3
mb-4
"
>

{movie.description}

</p>

<div
className="
flex
flex-wrap
gap-3
"
>

<Link

href={`/movies/${movie.id}`}

className="
border
border-gray-600
px-4
py-2
rounded-lg
hover:bg-netflix
hover:border-netflix
transition-all
font-bold
"

>

Chi tiết

</Link>

<Link

href={`/booking/${movie.id}`}

className="
bg-netflix
px-4
py-2
rounded-lg
font-bold
hover:bg-red-700
transition
"

>

Đặt vé

</Link>

</div>

</div>

</div>

))}

</div>

</div>

)

}