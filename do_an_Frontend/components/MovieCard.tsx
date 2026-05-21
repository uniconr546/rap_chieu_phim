import Link from 'next/link';

// 1. Khai báo "Chứng minh thư" cho bộ phim (Định nghĩa kiểu dữ liệu)
interface MovieProps {
  id: number;
  title: string;
  description?: string;
  duration: number;
  release_date?: string;
  trailer_url?: string;

  // thêm dòng này
  poster?: string;

  age_rating?: string;
  rating?: string;
  status?: string;
}

// 2. Gắn cái chứng minh thư đó vào biến { movie }
export default function MovieCard({ movie }: { movie: MovieProps }) {
  return (
    <Link href={`/movies/${movie.id}`} className="group relative cursor-pointer block">
      <div className="relative overflow-hidden rounded-lg transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(229,9,20,0.4)]">
        
        <div className="absolute top-2 left-2 bg-netflix text-white text-xs font-bold px-2 py-1 rounded z-10 shadow-lg">
          {movie.age_rating || 'C16'}
        </div>
        
        <img
          src={
            movie.poster
              ? movie.poster
              : "https://placehold.co/300x450?text=No+Poster"
          }
          alt={movie.title}
          className="w-full h-[380px] object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <button className="bg-netflix text-white w-full py-2 rounded font-bold hover:bg-red-700 transition-colors mb-2">
            Đặt Vé
          </button>
        </div>
      </div>
      
      <div className="mt-3">
        <h3 className="font-bold text-lg text-white truncate group-hover:text-netflix transition-colors">
          {movie.title}
        </h3>
        <div className="flex justify-between items-center text-xs text-gray-400 mt-1">
          <span className="bg-gray-800 text-neonYellow px-2 py-0.5 rounded font-bold">
            ★ {movie.rating || '8.8'}
          </span>
          <span>{movie.duration} phút</span>
        </div>
      </div>
    </Link>
  );
}