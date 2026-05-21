// app/admin/movies/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// 1. IMPORT CÔNG CỤ GỌI API CỦA NGÀI
import api from '@/services/api'; 

// 2. CHUẨN HÓA KIỂU DỮ LIỆU THEO DJANGO (Dùng snake_case)
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
  // KHỞI TẠO DANH SÁCH RỖNG CHỜ BACKEND TRẢ VỀ
  const [movies, setMovies] = useState<Movie[]>([]);

  // TỰ ĐỘNG GỌI API KHI VÀO TRANG
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies/'); 
      setMovies(response.data);
    } catch (error) {
      console.error("Lỗi kéo danh sách phim:", error);
    }
  };

  // TRẠNG THÁI POPUP & FORM (Đã bổ sung các biến cho form ngài thiết kế thêm)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieDuration, setNewMovieDuration] = useState('');
  const [newMovieDate, setNewMovieDate] = useState('');
  const [newMovieStatus, setNewMovieStatus] = useState('now_showing');
  const [newMovieTrailer, setNewMovieTrailer] = useState('');
  const [newMovieDesc, setNewMovieDesc] = useState('');
  
  // TRẠNG THÁI ẢNH UP LÊN
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chỉ chọn file ảnh (png, jpg, webp...)');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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

// HÀM LƯU PHIM BẰNG FORM-DATA (UPLOAD FILE THỰC TẾ)
const handleSaveMovie = async () => {
    // Lưu ý: Kiểm tra selectedFile thay vì imagePreview
    if (!newMovieTitle || !newMovieDuration || !newMovieDate || !selectedFile) {
      alert('Vui lòng điền đủ Tên, Thời lượng, Ngày chiếu và Upload Ảnh Poster!');
      return;
    }

    try {
      // Đóng gói dữ liệu vào hộp FormData chuyên dụng để gửi File
      const formData = new FormData();
      
      // Các tên trường (tham số đầu tiên) phải KHỚP 100% với models.py của Django
      formData.append('title', newMovieTitle);
      formData.append('description', newMovieDesc || 'Nội dung đang cập nhật...'); // Bắt buộc có
      formData.append('duration', newMovieDuration || '120');
      formData.append('release_date', newMovieDate);
      formData.append('status', newMovieStatus); // Sẽ gửi 'coming_soon', 'now_showing'...
      
      // Nhét trực tiếp File vật lý vào biến 'poster'
      formData.append('poster', selectedFile); 

    if(
      newMovieTrailer &&
      newMovieTrailer.startsWith("http")
    ){
      formData.append(
          "trailer_url",
          newMovieTrailer
      )
    }

      // Gửi sang Backend với Header báo hiệu đây là gói hàng chứa File
      await api.post('/movies/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      alert('Thêm phim và Upload ảnh thành công rực rỡ!');
      setIsModalOpen(false);
      fetchMovies(); // Tải lại bảng phim

      // Reset form
      setNewMovieTitle(''); setNewMovieDuration(''); setNewMovieDate('');
      setNewMovieStatus('coming_soon'); setNewMovieTrailer(''); setNewMovieDesc('');
      clearSelectedImage();

    }catch (error:any){

 console.log("FULL ERROR:",error)

 console.log(
   "STATUS:",
   error.response?.status
 )

 console.log(
   "DATA:",
   error.response?.data
 )

 console.log(
   "MESSAGE:",
   error.message
 )

 alert(
   "Mở Console F12 xem lỗi"
 )

}
}
  // HÀM XÓA PHIM THỰC TẾ
  const handleDelete = async (id: number) => {
    if (confirm('Ngài có chắc chắn muốn xóa bộ phim này khỏi hệ thống?')) {
      try {
        await api.delete(`/movies/${id}/delete/`)
        fetchMovies(); // Load lại bảng sau khi xóa
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
        alert("Xóa thất bại!");
      }
    }
  };

  return (
    <div className="bg-dark flex flex-col md:flex-row w-screen max-w-full min-h-screen overflow-x-hidden">     
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-[240px] lg:w-[260px] bg-darkPanel border-r border-gray-800 z-10 shrink-0 overflow-hidden min-h-screen">
        <div className="px-4 py-5 flex flex-col h-full">
          <h2 className="text-lg lg:text-xl font-black text-white tracking-wider mb-8 text-center md:text-left mt-2">
            <span className="text-neonYellow">ADMIN</span> PANEL
          </h2>
          <nav className="space-y-2 flex-1">
            <Link href="/admin/dashboard" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
              📊 Tổng Quan
            </Link>
            <Link href="/admin/movies" className="block w-full text-left px-4 py-3 text-sm bg-netflix text-white font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(229,9,20,0.4)]">
              🎬 Quản lý Phim
            </Link>
            <Link href="/admin/showtimes" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
              🗓️ Lịch Chiếu
            </Link>
            <Link href="/admin/bookings" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
              🎟️ Đơn Hàng
            </Link>
            <Link href="/admin/combos" className="block w-full text-left px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-white font-medium rounded-lg transition-all">
              🍿 Quản lý Combo
            </Link>
            <div className="h-px bg-gray-700 my-6 mx-2 opacity-50"></div>
            <Link href="/" className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-400 hover:bg-gray-800 hover:text-netflix font-bold rounded-lg transition-all">
              <span className="text-lg leading-none">🔙</span> Về Trang Chủ
            </Link>
          </nav>
        </div>
      </aside>

      {/* NỘI DUNG CHÍNH */}
      <main className="flex-1 w-0 min-w-0 overflow-x-hidden p-3 md:p-4 lg:p-5 mt-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Danh Sách Phim</h1>
            <p className="text-gray-400 text-xs sm:text-sm">Quản lý kho phim trực tiếp với Database Django</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-netflix hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-lg transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] flex items-center gap-2 text-sm"
          >
            <span className="text-lg leading-none">+</span> Thêm Phim
          </button>
        </div>

        {/* BẢNG PHIM */}
        <div className="bg-darkPanel rounded-xl border border-gray-800 shadow-xl overflow-hidden mb-8">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400 min-w-[700px]">
              <thead className="bg-black/40 text-gray-300 uppercase font-bold text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Poster</th>
                  <th className="px-6 py-4">Tên Phim</th>
                  <th className="px-6 py-4">Thời Lượng</th>
                  <th className="px-6 py-4">Khởi Chiếu</th>
                  <th className="px-6 py-4">Trạng Thái</th>
                  <th className="px-6 py-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {movies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/5 transition-colors items-center">
                    <td className="px-6 py-3">
                      <img src={movie.poster_url} alt={movie.title} className="w-10 h-14 object-cover rounded border border-gray-700 shadow-sm" />
                    </td>
                    <td className="px-6 py-4 font-bold text-white text-sm">{movie.title}</td>
                    <td className="px-6 py-4">{movie.duration} phút</td>
                    <td className="px-6 py-4 font-mono text-xs">{movie.release_date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase 
                        ${movie.status === 'Đang chiếu' ? 'bg-green-900/40 text-green-400 border border-green-800' : 
                          movie.status === 'Sắp chiếu' ? 'bg-blue-900/40 text-blue-400 border border-blue-800' : 
                          'bg-gray-800/40 text-gray-400 border border-gray-700'}`}
                      >
                        {movie.status || 'Đang chiếu'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-4">
                        <button className="text-neonYellow hover:text-yellow-300 transition-colors font-bold text-xs uppercase tracking-wider">✏️ Sửa</button>
                        <button onClick={() => handleDelete(movie.id)} className="text-netflix hover:text-red-400 transition-colors font-bold text-xs uppercase tracking-wider">🗑️ Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {movies.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      Chưa có phim nào trong hệ thống.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* POPUP (MODAL) THÊM PHIM MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-5xl h-[92vh] rounded-2xl border border-gray-800 bg-[#111111] shadow-2xl flex flex-col">
            {/* HEADER */}
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-800 bg-[#151515] px-6 py-4">
              <div>
                <h2 className="text-2xl font-black text-white">🎬 Thêm Phim Mới</h2>
                <p className="text-sm text-gray-400 mt-1">Quản lý thông tin phim chuẩn hệ thống rạp chiếu</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-800 hover:bg-red-600 text-white transition-all text-xl">×</button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* LEFT - POSTER */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Poster Phim</label>
                    {imagePreview ? (
                      <div className="relative group">
                        <img src={imagePreview} alt="Poster Preview" className="w-full h-[420px] object-cover rounded-2xl border border-gray-700 shadow-xl" />
                        <button onClick={clearSelectedImage} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/70 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all">×</button>
                      </div>
                    ) : (
                      <button onClick={() => fileInputRef.current?.click()} className="w-full h-[420px] border-2 border-dashed border-gray-700 hover:border-red-500 rounded-2xl flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-red-500 transition-all bg-black/30">
                        <span className="text-6xl">🎬</span>
                        <div className="text-center">
                          <p className="font-bold text-lg">Upload Poster</p>
                          <p className="text-sm text-gray-500 mt-1">PNG, JPG, WEBP</p>
                        </div>
                      </button>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                  </div>
                </div>

                {/* RIGHT - FORM */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tên Phim</label>
                    <input type="text" value={newMovieTitle} onChange={(e) => setNewMovieTitle(e.target.value)} placeholder="Ví dụ: Avengers Endgame" className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Thời Lượng</label>
                      <input type="number" value={newMovieDuration} onChange={(e) => setNewMovieDuration(e.target.value)} placeholder="120 phút" className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none focus:border-red-500" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Ngày Khởi Chiếu</label>
                      <input type="date" value={newMovieDate} onChange={(e) => setNewMovieDate(e.target.value)} className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none focus:border-red-500" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Thể Loại</label>
                      <select className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none focus:border-red-500">
                        <option>Hành động</option>
                        <option>Kinh dị</option>
                        <option>Viễn tưởng</option>
                        <option>Hoạt hình</option>
                        <option>Tình cảm</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Trạng Thái</label>
                      <select value={newMovieStatus} onChange={(e) => setNewMovieStatus(e.target.value)} className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none focus:border-red-500">
                        <option value="now_showing">Đang chiếu</option>
                        <option value="coming_soon">Sắp chiếu</option>
                        <option value="stopped">Ngừng chiếu</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Link Trailer</label>
                    <input type="text" value={newMovieTrailer} onChange={(e) => setNewMovieTrailer(e.target.value)} placeholder="https://youtube.com/..." className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none focus:border-red-500" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mô Tả Phim</label>
                    <textarea rows={5} value={newMovieDesc} onChange={(e) => setNewMovieDesc(e.target.value)} placeholder="Nhập nội dung mô tả phim..." className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-white outline-none resize-none focus:border-red-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-gray-800 bg-[#151515] px-6 py-4">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold transition-all">Hủy</button>
              <button onClick={handleSaveMovie} className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/30 transition-all">🎬 Lưu Phim</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}