// app/admin/movies/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import api from '@/services/api';

interface Movie {
  id: number;
  title: string;
  duration: number;
  release_date: string;
  status: string;
  poster_url: string;
  trailer_img?: string;
  description?: string;
}

export default function AdminMovies() {

  const [movies, setMovies] = useState<Movie[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingMovie, setEditingMovie] =
    useState<Movie | null>(null);

  const [newMovieTitle, setNewMovieTitle] =
    useState('');

  const [newMovieDuration, setNewMovieDuration] =
    useState('');

  const [newMovieDate, setNewMovieDate] =
    useState('');

  const [newMovieStatus, setNewMovieStatus] =
    useState('now_showing');

  const [newMovieTrailer, setNewMovieTrailer] =
    useState('');

  const [newMovieDesc, setNewMovieDesc] =
    useState('');

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {

      const response =
        await api.get('/movies/');

      setMovies(response.data);

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // CHỌN ẢNH
  // =========================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = event.target.files?.[0];

    if (file) {

      if (!file.type.startsWith('image/')) {

        alert('Chỉ được upload ảnh');

        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(
          reader.result as string
        );
      };

      reader.readAsDataURL(file);
    }
  };

  const clearSelectedImage = () => {

    setSelectedFile(null);

    setImagePreview(null);

    if (fileInputRef.current) {

      fileInputRef.current.value = '';
    }
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setEditingMovie(null);

    setNewMovieTitle('');

    setNewMovieDuration('');

    setNewMovieDate('');

    setNewMovieStatus('now_showing');

    setNewMovieTrailer('');

    setNewMovieDesc('');

    clearSelectedImage();
  };

  // =========================
  // THÊM PHIM
  // =========================

  const handleSaveMovie = async () => {

    if (
      !newMovieTitle ||
      !newMovieDuration ||
      !newMovieDate ||
      !selectedFile
    ) {

      alert('Vui lòng nhập đủ thông tin');

      return;
    }

    try {

      const formData = new FormData();

      formData.append(
        'title',
        newMovieTitle
      );

      formData.append(
        'description',
        newMovieDesc ||
        'Nội dung đang cập nhật...'
      );

      formData.append(
        'duration',
        newMovieDuration
      );

      formData.append(
        'release_date',
        newMovieDate
      );

      formData.append(
        'status',
        newMovieStatus
      );

      formData.append(
        'poster',
        selectedFile
      );

      if (
        newMovieTrailer &&
        newMovieTrailer.startsWith('http')
      ) {

        formData.append(
          'trailer_url',
          newMovieTrailer
        );
      }

      await api.post(
        '/movies/create/',
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

      alert('Thêm phim thành công');

      setIsModalOpen(false);

      fetchMovies();

      resetForm();

    } catch (error: any) {

      console.log(error);

      alert('Lỗi thêm phim');

    }
  };

  // =========================
  // MỞ FORM SỬA
  // =========================

  const handleEditMovie = (
    movie: Movie
  ) => {

    setEditingMovie(movie);

    setNewMovieTitle(movie.title);

    setNewMovieDuration(
      String(movie.duration)
    );

    setNewMovieDate(
      movie.release_date
    );

    if (
      movie.status === 'Đang chiếu'
    ) {

      setNewMovieStatus(
        'now_showing'
      );

    } else if (
      movie.status === 'Sắp chiếu'
    ) {

      setNewMovieStatus(
        'coming_soon'
      );

    } else {

      setNewMovieStatus(
        'stopped'
      );
    }

    setNewMovieTrailer(
      movie.trailer_img || ''
    );

    setNewMovieDesc(
      movie.description || ''
    );

    setImagePreview(
      movie.poster_url
    );

    setIsModalOpen(true);
  };

  // =========================
  // UPDATE PHIM
  // =========================

  const handleUpdateMovie =
    async () => {

    if (
      !newMovieTitle ||
      !newMovieDuration ||
      !newMovieDate
    ) {

      alert(
        'Vui lòng nhập đủ thông tin'
      );

      return;
    }

    if (!editingMovie) return;

    try {

      const formData = new FormData();

      formData.append(
        'title',
        newMovieTitle
      );

      formData.append(
        'description',
        newMovieDesc ||
        'Nội dung đang cập nhật...'
      );

      formData.append(
        'duration',
        newMovieDuration
      );

      formData.append(
        'release_date',
        newMovieDate
      );

      formData.append(
        'status',
        newMovieStatus
      );

      if (selectedFile) {

        formData.append(
          'poster',
          selectedFile
        );
      }

      if (
        newMovieTrailer &&
        newMovieTrailer.startsWith(
          'http'
        )
      ) {

        formData.append(
          'trailer_url',
          newMovieTrailer
        );
      }

      await api.put(
        `/movies/${editingMovie.id}/update/`,
        formData,
        {
          headers: {
            'Content-Type':
              'multipart/form-data',
          },
        }
      );

      alert(
        'Cập nhật phim thành công'
      );

      setIsModalOpen(false);

      fetchMovies();

      resetForm();

    } catch (error: any) {

      console.log(error);

      alert('Lỗi cập nhật phim');
    }
  };

  // =========================
  // XÓA PHIM
  // =========================

  const handleDelete = async (
    id: number
  ) => {

    if (
      confirm(
        'Bạn chắc chắn muốn xóa?'
      )
    ) {

      try {

        await api.delete(
          `/movies/${id}/delete/`
        );

        fetchMovies();

      } catch (error) {

        console.log(error);

        alert('Xóa thất bại');
      }
    }
  };

  return (
  <div className="bg-dark flex min-h-screen text-white">

    {/* SIDEBAR */}
    <aside className="w-[260px] bg-darkPanel border-r border-gray-800 shrink-0 hidden md:block">

      <div className="px-4 py-5 flex flex-col h-full">

        <h2 className="text-2xl font-black text-white tracking-wider mb-8">
          <span className="text-neonYellow">
            ADMIN
          </span>{' '}
          PANEL
        </h2>

        <nav className="space-y-2 flex-1">

          <Link
            href="/admin/dashboard"
            className="block px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition"
          >
            📊 Tổng Quan
          </Link>

          <Link
            href="/admin/movies"
            className="block px-4 py-3 bg-netflix text-white font-bold rounded-xl"
          >
            🎬 Quản lý Phim
          </Link>

          <Link
            href="/admin/showtimes"
            className="block px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition"
          >
            🗓️ Lịch Chiếu
          </Link>

          <Link
            href="/admin/bookings"
            className="block px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition"
          >
            🎟️ Đơn Hàng
          </Link>

          <Link
            href="/admin/combos"
            className="block px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition"
          >
            🍿 Quản lý Combo
          </Link>

          <div className="border-t border-gray-700 my-4"></div>

          <Link
            href="/"
            className="block px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition"
          >
            🔙 Về Trang Chủ
          </Link>

        </nav>
      </div>
    </aside>

    {/* CONTENT */}
    <main className="flex-1 p-6 md:p-8 overflow-x-auto">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-black">
            🎬 Quản Lý Phim
          </h1>

          <p className="text-gray-400 mt-1">
            Danh sách phim trong hệ thống
          </p>

        </div>

        <button
          onClick={() => {

            resetForm();

            setIsModalOpen(true);

          }}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-bold transition"
        >
          + Thêm Phim
        </button>

      </div>

      {/* TABLE */}
      <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="bg-black/50">

              <tr className="text-gray-400 text-sm uppercase">

                <th className="px-6 py-4 text-left">
                  Poster
                </th>

                <th className="px-6 py-4 text-left">
                  Tên Phim
                </th>

                <th className="px-6 py-4 text-center">
                  Thời Lượng
                </th>

                <th className="px-6 py-4 text-center">
                  Ngày Chiếu
                </th>

                <th className="px-6 py-4 text-center">
                  Trạng Thái
                </th>

                <th className="px-6 py-4 text-center">
                  Hành Động
                </th>

              </tr>

            </thead>

            <tbody>

              {movies.map((movie) => (

                <tr
                  key={movie.id}
                  className="border-t border-gray-800 hover:bg-white/5 transition"
                >

                  <td className="px-6 py-4">

                    <img
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-14 h-20 rounded-lg object-cover"
                    />

                  </td>

                  <td className="px-6 py-4 font-bold">
                    {movie.title}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {movie.duration} phút
                  </td>

                  <td className="px-6 py-4 text-center">
                    {movie.release_date}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {movie.status}
                  </td>

                  <td className="px-6 py-4">

                    <div className="flex items-center justify-center gap-3">

                      <button
                        onClick={() =>
                          handleEditMovie(movie)
                        }
                        className="px-3 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition"
                      >
                        ✏️ Sửa
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(movie.id)
                        }
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                      >
                        🗑️ Xóa
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (

        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">

          <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center border-b border-gray-800 p-6">

              <h2 className="text-2xl font-black">

                {editingMovie
                  ? '✏️ Cập Nhật Phim'
                  : '🎬 Thêm Phim Mới'}

              </h2>

              <button
                onClick={() => {

                  setIsModalOpen(false);

                  resetForm();

                }}
                className="text-3xl"
              >
                ×
              </button>

            </div>

            {/* BODY */}
            <div className="p-6 space-y-5">

              <div>

                <label className="block mb-2 text-sm text-gray-400">
                  Poster
                </label>

                {imagePreview ? (

                  <div className="relative w-full">

                    <img
                      src={imagePreview}
                      className="w-full h-[420px] object-cover rounded-xl"
                    />

                    <button
                      onClick={clearSelectedImage}
                      className="absolute top-2 right-2 bg-red-600 w-8 h-8 rounded-full"
                    >
                      ×
                    </button>

                  </div>

                ) : (

                  <button
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="w-full h-[420px] border-2 border-dashed border-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:border-red-500 hover:text-white transition"
                  >
                    Upload
                  </button>

                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

              </div>

              <input
                type="text"
                placeholder="Tên phim"
                value={newMovieTitle}
                onChange={(e) =>
                  setNewMovieTitle(e.target.value)
                }
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4"
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="number"
                  placeholder="Thời lượng"
                  value={newMovieDuration}
                  onChange={(e) =>
                    setNewMovieDuration(e.target.value)
                  }
                  className="bg-black/40 border border-gray-700 rounded-xl p-4"
                />

                <input
                  type="date"
                  value={newMovieDate}
                  onChange={(e) =>
                    setNewMovieDate(e.target.value)
                  }
                  className="bg-black/40 border border-gray-700 rounded-xl p-4"
                />

              </div>

              <select
                value={newMovieStatus}
                onChange={(e) =>
                  setNewMovieStatus(e.target.value)
                }
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4"
              >

                <option value="now_showing">
                  Đang chiếu
                </option>

                <option value="coming_soon">
                  Sắp chiếu
                </option>

                <option value="stopped">
                  Ngừng chiếu
                </option>

              </select>

              <input
                type="text"
                placeholder="Link trailer"
                value={newMovieTrailer}
                onChange={(e) =>
                  setNewMovieTrailer(e.target.value)
                }
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4"
              />

              <textarea
                rows={5}
                placeholder="Mô tả phim"
                value={newMovieDesc}
                onChange={(e) =>
                  setNewMovieDesc(e.target.value)
                }
                className="w-full bg-black/40 border border-gray-700 rounded-xl p-4"
              />

            </div>

            {/* FOOTER */}
            <div className="border-t border-gray-800 p-6 flex justify-end gap-4">

              <button
                onClick={() => {

                  setIsModalOpen(false);

                  resetForm();

                }}
                className="px-5 py-3 bg-gray-700 rounded-xl"
              >
                Hủy
              </button>

              <button
                onClick={
                  editingMovie
                    ? handleUpdateMovie
                    : handleSaveMovie
                }
                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-bold"
              >

                {editingMovie
                  ? '💾 Cập Nhật'
                  : '🎬 Lưu Phim'}

              </button>

            </div>

          </div>

        </div>

      )}

    </main>
  </div>
);
}