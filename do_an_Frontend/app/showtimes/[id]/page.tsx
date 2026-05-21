// app/showtimes/[id]/page.tsx
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
  poster: string;
  duration: number;
  genres: Genre[];
}

interface Showtime {
  id: number;
  start_time: string;
  end_time: string;
  price: number;
  room_name: string;
}

interface Theater {
  id: number;
  name: string;
  address: string;
  showtimes: Showtime[];
}

export default function ShowtimesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  // FIX NEXTJS 15
  const { id: movieId } = use(params);

  const [movie, setMovie] = useState<Movie | null>(null);

  const [theaters, setTheaters] = useState<Theater[]>([]);

  const [loading, setLoading] = useState(true);

  // ===== TẠO DANH SÁCH 7 NGÀY =====
  const generateDates = () => {

    const arr = [];

    for (let i = 0; i < 7; i++) {

      const d = new Date();

      d.setDate(d.getDate() + i);

      arr.push({

        id: d.toISOString().split('T')[0],

        label:
          i === 0
            ? 'Hôm nay'
            : i === 1
            ? 'Ngày mai'
            : d.toLocaleDateString('vi-VN', {
                weekday: 'long',
              }),

        display: d.toLocaleDateString('vi-VN'),

      });

    }

    return arr;

  };

  const [dates] = useState(generateDates());

  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {

    if (dates.length > 0) {

      setSelectedDate(dates[0].id);

    }

  }, [dates]);

  // ===== LOAD DỮ LIỆU =====
  useEffect(() => {

    if (!selectedDate) return;

    const fetchData = async () => {

      try {

        setLoading(true);

        // ===== LẤY THÔNG TIN PHIM =====
        const movieRes = await api.get(
          `/movies/${movieId}/`
        );

        setMovie(movieRes.data);

        // ===== LẤY DANH SÁCH SUẤT CHIẾU =====
      const showtimeRes = await api.get(
        `/showtimes/?movie_id=${movieId}&date=${selectedDate}`
      );

    const grouped = showtimeRes.data.reduce((acc: any, item: any) => {

      const theaterName =
        item.theater_name || 'Unicorn Cinema';

      if (!acc[theaterName]) {

        acc[theaterName] = {
          id: item.room,
          name: theaterName,
          address: item.theater_address || '',
          showtimes: []
        };
      }

      acc[theaterName].showtimes.push({
        id: item.id,

        time: new Date(item.start_time)
          .toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
          }),

        room_name: item.room_name,

        price: Number(item.price)
      });

      return acc;

    }, {});

    setTheaters(Object.values(grouped));

      } catch (error) {

        console.log(
          'Lỗi lấy suất chiếu:',
          error
        );

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, [movieId, selectedDate]);

  // ===== FORMAT GIỜ =====
  const formatTime = (datetime: string) => {

    return new Date(datetime).toLocaleTimeString(
      'vi-VN',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );

  };

  if (loading && !movie) {

    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-white text-xl">
        Đang tải lịch chiếu...
      </div>
    );

  }

  return (

    <div className="min-h-screen bg-dark pb-20">

      {/* HEADER PHIM */}
      {movie && (

        <div className="bg-[#111111] border-b border-gray-800 pt-24 pb-6 px-4">

          <div className="container mx-auto flex items-center gap-6">

            <img
              src={movie.poster}
              alt={movie.title}
              className="w-24 md:w-32 rounded-lg border border-gray-700 shadow-lg object-cover"
            />

            <div>

              <h1 className="text-2xl md:text-4xl font-black text-white mb-2">
                {movie.title}
              </h1>

              <p className="text-gray-400 text-sm md:text-base">

                ⏱️ {movie.duration} phút

                {' | '}

                🎬{' '}

                {movie.genres?.map(
                  (g) => g.name
                ).join(', ')}

              </p>

            </div>

          </div>

        </div>

      )}

      <div className="container mx-auto px-4 mt-8 max-w-6xl">

        {/* CHỌN NGÀY */}
        <div className="mb-8">

          <h2 className="text-lg font-bold text-white mb-4 uppercase tracking-widest border-l-4 border-netflix pl-3">
            Chọn Ngày Chiếu
          </h2>

          <div className="flex gap-3 overflow-x-auto pb-4">

            {dates.map((date) => (

              <button
                key={date.id}
                onClick={() =>
                  setSelectedDate(date.id)
                }
                className={`flex flex-col items-center justify-center min-w-[100px] p-3 rounded-xl border transition-all ${
                  selectedDate === date.id
                    ? 'bg-netflix border-netflix text-white'
                    : 'bg-black/40 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >

                <span className="text-xs mb-1">
                  {date.label}
                </span>

                <span className="text-lg font-black">
                  {date.display}
                </span>

              </button>

            ))}

          </div>

        </div>

        {/* DANH SÁCH RẠP */}
        <div className="space-y-6">

          {theaters.length > 0 ? (

            theaters.map((theater) => (

              <div
                key={theater.id}
                className="bg-[#151515] border border-gray-800 rounded-2xl p-5"
              >

                {/* THÔNG TIN RẠP */}
                <div className="mb-4 pb-4 border-b border-gray-800">

                  <h3 className="text-xl font-bold text-white mb-1">
                    {theater.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    📍 {theater.address}
                  </p>

                </div>

                {/* SUẤT CHIẾU */}
                <div className="flex flex-wrap gap-3">

                  {theater.showtimes.map((showtime) => (

                    <Link
                      key={showtime.id}
                      href={`/booking/${showtime.id}`}
                      className="group flex flex-col items-center justify-center px-5 py-3 bg-gray-900 border border-gray-700 rounded-lg hover:border-netflix hover:bg-netflix/10 transition-all"
                    >

                      <span className="text-lg font-black text-white group-hover:text-netflix">

                        {formatTime(
                          showtime.start_time
                        )}

                      </span>

                      <span className="text-[11px] text-gray-400 mt-1">
                        {showtime.room_name}
                      </span>

                      <span className="text-[10px] text-neonYellow mt-1">
                        {Number(showtime.price).toLocaleString('vi-VN')} đ
                      </span>

                    </Link>

                  ))}

                </div>

              </div>

            ))

          ) : (

            <div className="bg-[#151515] border border-gray-800 rounded-2xl p-10 text-center">

              <p className="text-gray-400 text-lg">
                Không có suất chiếu cho ngày này
              </p>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}