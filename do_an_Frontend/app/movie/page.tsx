// app/movie/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

// --- INTERFACES ---
interface Genre {
  id: number;
  name: string;
}

interface Showtime {
  id: number;
  start_time: string;
  room?: { id: number; name: string };
  theater?: { id: number; name: string };
  movie: number | { id: number }; // Xử lý cả 2 trường hợp Backend trả về ID hoặc Object
}

interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  poster?: string;
  status: string;
  genres?: Genre[];
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy ngày hôm nay chuẩn múi giờ Việt Nam làm mặc định
  const getTodayString = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset() * 60000;
    return new Date(today.getTime() - offset).toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());

  // Mảng 7 ngày tiếp theo
  const next7Days: Date[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  // HÀM LỌC SUẤT CHIẾU THEO PHIM VÀ NGÀY ĐANG CHỌN
  const getShowtimesForMovie = (movieId: number) => {
    return showtimes.filter((st) => {
      // Đảm bảo lấy đúng định dạng YYYY-MM-DD
      const stDate = st.start_time.split('T')[0];
      const stMovieId = typeof st.movie === 'object' ? st.movie.id : st.movie;
      
      return stMovieId === movieId && stDate === selectedDate;
    });
  };

  // HÀM LẤY GIỜ (HH:MM) TỪ CHUỖI THỜI GIAN
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, showtimesRes] = await Promise.all([
          api.get('/movies/'),
          api.get('/showtimes/') // Đảm bảo API này có tồn tại trong urls.py
        ]);
        setMovies(moviesRes.data);
        setShowtimes(showtimesRes.data);
      } catch (error) {
        console.error("Lỗi kéo dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl font-bold bg-dark">
        <span className="animate-pulse">Đang tải lịch chiếu...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* TIÊU ĐỀ */}
        <h1 className="text-4xl font-black text-white mb-8 border-l-4 border-netflix pl-4 uppercase tracking-wider">
          Lịch Chiếu Phim
        </h1>

        {/* THANH CHỌN NGÀY */}
        <div className="flex gap-3 overflow-x-auto mb-10 pb-4 custom-scrollbar">
          {next7Days.map((date: Date) => {
            const offset = date.getTimezoneOffset() * 60000;
            const dateStr = new Date(date.getTime() - offset).toISOString().split('T')[0];
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex flex-col items-center justify-center min-w-[100px] px-5 py-3 rounded-xl font-bold transition-all border ${
                  isSelected
                    ? 'bg-netflix border-netflix text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] transform scale-105'
                    : 'bg-darkPanel text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white'
                }`}
              >
                <span className="text-xs font-normal mb-1">
                  {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                </span>
                <span className="text-lg">
                  {date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                </span>
              </button>
            );
          })}
        </div>

        {/* DANH SÁCH PHIM VÀ SUẤT CHIẾU */}
        <div className="space-y-8">
          {movies.map((movie) => {
            // Lấy danh sách suất chiếu của bộ phim này trong ngày đang chọn
            const movieShowtimes = getShowtimesForMovie(movie.id);

            // Tùy chọn: Ẩn bộ phim nếu ngài không muốn hiển thị phim không có suất chiếu hôm đó
             if (movieShowtimes.length === 0) 
              return null;

            return (
              <div
                key={movie.id}
                className="bg-darkPanel p-5 md:p-6 rounded-2xl border border-gray-800 flex flex-col md:flex-row gap-6 hover:border-gray-600 transition-all shadow-lg"
              >
                {/* ẢNH POSTER */}
                <img
                  src={movie.poster ? `http://127.0.0.1:8000${movie.poster}` : '/no-image.jpg'}
                  alt={movie.title}
                  className="w-full md:w-48 h-[300px] md:h-[280px] object-cover rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] flex-shrink-0"
                />

                {/* THÔNG TIN PHIM */}
                <div className="flex-1 flex flex-col">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {movie.title}
                  </h2>

                  {/* THẺ TAGS */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="border border-gray-600 px-3 py-1 rounded text-xs font-bold text-gray-300">
                      ⏱️ {movie.duration} PHÚT
                    </span>
                    <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${
                      movie.status === "now_showing" ? "bg-green-600/20 text-green-400 border border-green-800" :
                      movie.status === "coming_soon" ? "bg-blue-600/20 text-blue-400 border border-blue-800" :
                      "bg-gray-700 text-gray-300"
                    }`}>
                      {movie.status === "now_showing" ? "ĐANG CHIẾU" : movie.status === "coming_soon" ? "SẮP CHIẾU" : movie.status}
                    </span>
                    {movie.genres?.map((genre) => (
                      <span key={genre.id} className="bg-gray-800 border border-gray-700 px-3 py-1 rounded text-xs font-bold text-gray-300">
                        {genre.name}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-400 line-clamp-2 mb-6 text-sm md:text-base leading-relaxed">
                    {movie.description}
                  </p>

                  {/* KHU VỰC SUẤT CHIẾU */}
                  <div className="mt-auto border-t border-gray-800 pt-5">
                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span>🎟️</span> Suất Chiếu
                    </h3>
                    
                    {movieShowtimes.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {movieShowtimes.map((st) => (
                          <Link
                            key={st.id}
                            href={`/booking/${st.id}`}
                            className="bg-gray-900 border border-gray-700 hover:border-netflix hover:bg-netflix/10 text-white font-black text-lg px-4 py-2 rounded-lg transition-colors shadow-sm"
                          >
                            {formatTime(st.start_time)}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">
                        Không có suất chiếu nào cho bộ phim này trong ngày {selectedDate.split('-').reverse().join('/')}
                      </p>
                    )}
                  </div>

                  {/* NÚT XEM CHI TIẾT */}
                  <div className="mt-6 flex justify-end">
                    <Link
                      href={`/movies/${movie.id}`}
                      className="text-sm font-bold text-gray-400 hover:text-white transition-colors underline underline-offset-4"
                    >
                      Xem chi tiết phim →
                    </Link>
                  </div>
                  
                </div>
              </div>
            );
          })}

          {movies.length === 0 && (
            <div className="text-center text-gray-500 py-20 bg-darkPanel rounded-2xl border border-gray-800">
              Hiện chưa có bộ phim nào trong hệ thống.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}