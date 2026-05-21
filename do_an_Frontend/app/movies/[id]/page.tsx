'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  release_date: string;
  poster: string;
  trailer_url?: string;
  status: string;
  genres?: Genre[];
}

export default function MovieDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  // NextJS 16 bắt unwrap Promise
  const { id } = use(params);

  const [movie, setMovie] =
    useState<Movie | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchMovie = async () => {

      try {

        console.log("Đang lấy phim:", id);

        const response =
          await api.get(`/movies/${id}/`);

        console.log(
          "DATA:",
          response.data
        );

        setMovie(response.data);

      } catch (error: any) {

        console.error(
          "Lỗi API:",
          error.response?.data
        );

      } finally {

        setLoading(false);

      }

    };

    fetchMovie();

  }, [id]);

  if (loading) {

    return (
      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      text-2xl
      text-white
      ">
        Đang tải phim...
      </div>
    );

  }

  if (!movie) {

    return (
      <div className="
      min-h-screen
      flex
      items-center
      justify-center
      text-red-500
      text-2xl
      ">
        Không tìm thấy phim
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-dark pb-20">

      {/* BACKDROP */}

      <div className="
      relative
      w-full
      h-[50vh]
      ">

<img
  src={
    movie.poster ||
    'https://placehold.co/300x450?text=No+Image'
  }
  alt={movie.title}
  className="w-full h-full object-cover"
/>

        <div
          className="
          absolute
          inset-0
          bg-gradient-to-t
          from-dark
          to-transparent
          "
        />

      </div>

      {/* CONTENT */}

      <div
      className="
      container
      mx-auto
      px-4
      -mt-32
      relative
      z-10
      "
      >

        <div
        className="
        flex
        flex-col
        md:flex-row
        gap-8
        "
        >

          {/* POSTER */}

          <div
          className="
          w-52
          md:w-72
          flex-shrink-0
          "
          >

            <img
              src={
                movie.poster
                ? `http://127.0.0.1:8000${movie.poster}`
                : '/no-image.jpg'
              }
              alt={movie.title}
              className="
              rounded-xl
              border
              border-gray-700
              "
            />

            <Link
              href={`/showtimes/${movie.id}`}
              className="
              block
              mt-6
              bg-netflix
              text-white
              py-4
              rounded-lg
              text-center
              font-bold
              hover:bg-red-700
              "
            >
              MUA VÉ NGAY
            </Link>

          </div>

          {/* INFO */}

          <div className="flex-1">

            <h1
            className="
            text-5xl
            font-black
            mb-5
            "
            >
              {movie.title}
            </h1>

            <div
            className="
            flex
            gap-3
            flex-wrap
            mb-5
            "
            >

              <span
              className="
              border
              border-gray-700
              px-3
              py-1
              rounded
              "
              >
                {movie.duration} phút
              </span>

              <span
              className="
              border
              border-gray-700
              px-3
              py-1
              rounded
              "
              >
                {movie.release_date}
              </span>

              <span
              className="
              bg-netflix
              px-3
              py-1
              rounded
              "
              >
                {movie.status}
              </span>

            </div>

            <div
            className="
            flex
            gap-2
            flex-wrap
            mb-6
            "
            >

              {movie.genres?.map(
                (genre) => (

                <span
                  key={genre.id}
                  className="
                  bg-gray-800
                  px-3
                  py-1
                  rounded-full
                  "
                >
                  {genre.name}
                </span>

              ))}

            </div>

            <p
            className="
            text-gray-400
            leading-relaxed
            "
            >
              {movie.description}
            </p>

          </div>

        </div>

      </div>

    </div>

  );

}