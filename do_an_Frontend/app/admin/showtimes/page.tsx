// app/admin/showtimes/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';

interface Movie {
  id: number;
  title: string;
}

interface Room {
  id: number;
  name: string;
  theater_name: string;
}

interface Showtime {
  id: number;
  movie_title: string;
  room_name: string;
  theater_name: string;
  start_time: string;
  price: number;
}

export default function AdminShowtimes() {

  // =========================
  // STATES
  // =========================

  const [movies, setMovies] = useState<Movie[]>([]);

  const [rooms, setRooms] = useState<Room[]>([]);

  const [showtimes, setShowtimes] = useState<Showtime[]>([]);

  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // =========================
  // FORM STATES
  // =========================

  const [selectedMovie, setSelectedMovie] = useState('');

  const [selectedRoom, setSelectedRoom] = useState('');

  const [showDate, setShowDate] = useState('');

  const [showTime, setShowTime] = useState('');

  const [ticketPrice, setTicketPrice] = useState('');

  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {

    fetchMovies();

    fetchRooms();

    fetchShowtimes();

  }, []);

  const fetchMovies = async () => {

    try {

      const res = await api.get('/movies/');

      setMovies(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchRooms = async () => {

    try {

      const res = await api.get('/rooms/');

      setRooms(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  const fetchShowtimes = async () => {

    try {

      setLoading(true);

      const res = await api.get('/showtimes/');

      setShowtimes(res.data);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // CREATE SHOWTIME
  // =========================
 

  const handleSaveShowtime = async () => {

    if (
      !selectedMovie ||
      !selectedRoom ||
      !showDate ||
      !showTime ||
      !ticketPrice
    ) {

      alert('Vui lòng nhập đầy đủ thông tin');

      return;

    }

    try {

      // ghép ngày + giờ
       const startDateTime = new Date(
          `${showDate}T${showTime}:00`
          ).toISOString();

    await api.post('/showtimes/', {
        movie: Number(selectedMovie),
        room: Number(selectedRoom),
        start_time: startDateTime,
        price: Number(ticketPrice)
    });

      alert('Tạo suất chiếu thành công');

      fetchShowtimes();

      // reset form
      setSelectedMovie('');
      setSelectedRoom('');
      setShowDate('');
      setShowTime('');
      setTicketPrice('');

      setIsModalOpen(false);

    } catch (error: any) {

      console.log(error);

      alert(
        JSON.stringify(
          error.response?.data
        )
      );

    }

  };

  // =========================
  // DELETE SHOWTIME
  // =========================

  const handleDelete = async (id: number) => {

    if (
      !confirm(
        'Ngài có chắc muốn xóa suất chiếu này không?'
      )
    ) return;

    try {

      await api.delete(
        `/showtimes/${id}/delete/`
      );

      fetchShowtimes();

    } catch (error) {

      console.log(error);

    }

  };

  // =========================
  // FORMAT TIME
  // =========================

  const formatDate = (datetime: string) => {
    return new Date(datetime).toLocaleDateString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
    });
  };

  const formatTime = (datetime: string) => {
    return new Date(datetime).toLocaleTimeString('vi-VN', {
      timeZone: 'Asia/Ho_Chi_Minh',
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  // =========================
  // UI
  // =========================

  return (

    <div className="bg-dark flex flex-col md:flex-row w-screen max-w-full min-h-screen overflow-x-hidden">

      {/* SIDEBAR */}
      <aside className="w-full md:w-[240px] lg:w-[260px] bg-darkPanel border-r border-gray-800 z-10 shrink-0 overflow-hidden min-h-screen">

        <div className="px-4 py-5 flex flex-col h-full">

          <h2 className="text-lg lg:text-xl font-black text-white tracking-wider mb-8 text-center md:text-left mt-2">
            <span className="text-neonYellow">
              ADMIN
            </span>{' '}
            PANEL
          </h2>

          <nav className="space-y-2 flex-1">

            <Link
              href="/admin/dashboard"
              className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all"
            >
              📊 Tổng Quan
            </Link>

            <Link
              href="/admin/movies"
              className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all"
            >
              🎬 Quản lý Phim
            </Link>

            <Link
              href="/admin/showtimes"
              className="block w-full text-left px-4 py-3 text-sm text-white bg-gray-800 font-medium rounded-lg"
            >
              🗓️ Lịch Chiếu
            </Link>

            <Link
              href="/admin/bookings"
              className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all"
            >
              🎟️ Đơn Hàng
            </Link>

            <Link
              href="/admin/combos"
              className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all"
            >
              🍿 Quản lý Combo
            </Link>
            <div className="h-px bg-gray-700 my-6 mx-2 opacity-50"></div>
            <Link href="/" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-netflix font-bold rounded-lg transition-all">
              <span className="text-lg leading-none">🔙</span> Về Trang Chủ
            </Link>
          </nav>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 w-0 min-w-0 overflow-x-hidden p-3 md:p-4 lg:p-5 mt-2">

        <div className="flex justify-between items-center mb-8">

          <div>

            <h1 className="text-2xl font-bold text-white mb-1">
              Quản Lý Lịch Chiếu
            </h1>

            <p className="text-gray-400 text-sm">
              Quản lý suất chiếu thực tế từ database
            </p>

          </div>

          <button
            onClick={() =>
              setIsModalOpen(true)
            }
            className="bg-netflix hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg"
          >
            + Tạo Suất Chiếu
          </button>

        </div>

        {/* TABLE */}
        <div className="bg-darkPanel rounded-xl border border-gray-800 overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full text-left text-sm text-gray-400 min-w-[900px]">

              <thead className="bg-black/40 text-gray-300 uppercase font-bold text-[10px] tracking-widest">

                <tr>

                  <th className="px-6 py-4">
                    ID
                  </th>

                  <th className="px-6 py-4">
                    Phim
                  </th>

                  <th className="px-6 py-4">
                    Rạp
                  </th>

                  <th className="px-6 py-4">
                    Phòng
                  </th>

                  <th className="px-6 py-4">
                    Ngày
                  </th>

                  <th className="px-6 py-4">
                    Giờ
                  </th>

                  <th className="px-6 py-4">
                    Giá
                  </th>

                  <th className="px-6 py-4 text-center">
                    Hành động
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-800">

                {showtimes.map((item) => (

                  <tr
                    key={item.id}
                    className="hover:bg-white/5"
                  >

                    <td className="px-6 py-4">
                      #{item.id}
                    </td>

                    <td className="px-6 py-4 text-white font-bold">
                      {item.movie_title}
                    </td>

                    <td className="px-6 py-4">
                      {item.theater_name}
                    </td>

                    <td className="px-6 py-4">
                      {item.room_name}
                    </td>

                    <td className="px-6 py-4">
                      {formatDate(
                        item.start_time
                      )}
                    </td>

                    <td className="px-6 py-4 text-neonYellow font-bold">
                      {formatTime(
                        item.start_time
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {item.price.toLocaleString(
                        'vi-VN'
                      )} đ
                    </td>

                    <td className="px-6 py-4 text-center">

                      <button
                        onClick={() =>
                          handleDelete(
                            item.id
                          )
                        }
                        className="text-netflix hover:text-red-400 font-bold"
                      >
                        🗑️ Xóa
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>

      </main>

      {/* MODAL */}
      {isModalOpen && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

          <div
            className="absolute inset-0 bg-black/80"
            onClick={() =>
              setIsModalOpen(false)
            }
          />

          <div className="bg-darkPanel border border-gray-700 rounded-2xl w-full max-w-xl relative z-10">

            <div className="p-6 border-b border-gray-800 flex justify-between items-center">

              <h2 className="text-xl font-bold text-white">
                Tạo Suất Chiếu
              </h2>

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="text-2xl text-gray-400"
              >
                ×
              </button>

            </div>

            <div className="p-6 space-y-4">

              {/* MOVIE */}
              <div>

                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                  Chọn phim
                </label>

                <select
                  value={selectedMovie}
                  onChange={(e) =>
                    setSelectedMovie(
                      e.target.value
                    )
                  }
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
                >

                  <option value="">
                    -- Chọn phim --
                  </option>

                  {movies.map((movie) => (

                    <option
                      key={movie.id}
                      value={movie.id}
                    >
                      {movie.title}
                    </option>

                  ))}

                </select>

              </div>

              {/* ROOM */}
              <div>

                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                  Chọn phòng
                </label>

                <select
                  value={selectedRoom}
                  onChange={(e) =>
                    setSelectedRoom(
                      e.target.value
                    )
                  }
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
                >

                  <option value="">
                    -- Chọn phòng --
                  </option>

                  {rooms.map((room) => (

                    <option
                      key={room.id}
                      value={room.id}
                    >
                      {room.theater_name} - {room.name}
                    </option>

                  ))}

                </select>

              </div>

              {/* DATE TIME */}
              <div className="grid grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                    Ngày
                  </label>

                  <input
                    type="date"
                    value={showDate}
                    onChange={(e) =>
                      setShowDate(
                        e.target.value
                      )
                    }
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />

                </div>

                <div>

                  <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                    Giờ
                  </label>

                  <input
                    type="time"
                    value={showTime}
                    onChange={(e) =>
                      setShowTime(
                        e.target.value
                      )
                    }
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
                  />

                </div>

              </div>

              {/* PRICE */}
              <div>

                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                  Giá vé
                </label>

                <input
                  type="number"
                  value={ticketPrice}
                  onChange={(e) =>
                    setTicketPrice(
                      e.target.value
                    )
                  }
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />

              </div>

            </div>

            <div className="p-6 border-t border-gray-800 flex justify-end gap-3">

              <button
                onClick={() =>
                  setIsModalOpen(false)
                }
                className="px-5 py-2.5 text-gray-300"
              >
                Hủy
              </button>

              <button
                onClick={handleSaveShowtime}
                className="px-6 py-2.5 bg-netflix hover:bg-red-700 text-white rounded-lg font-bold"
              >
                Tạo suất chiếu
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}