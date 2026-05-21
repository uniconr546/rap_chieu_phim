'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';

interface Seat {
  id: number | string;
  row_name: string;
  seat_number: number;
  seat_type: 'normal' | 'vip' | 'sweetbox';
  is_booked: boolean;
  is_fake?: boolean;
}

interface ShowtimeInfo {
  id: number;
  movie_title: string;
  theater_name: string;
  room_name: string;
  room: number;
  start_time: string;
  price: number;
}

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [showtime, setShowtime] =
    useState<ShowtimeInfo | null>(null);

  const [seats, setSeats] = useState<Seat[]>([]);

  const [selectedSeats, setSelectedSeats] =
    useState<Seat[]>([]);

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    fetchBookingData();
  }, []);

  const fetchBookingData = async () => {
    try {
      setLoading(true);

      // =========================
      // LẤY SUẤT CHIẾU
      // =========================
      const showtimeRes = await api.get(
        `/showtimes/${resolvedParams.id}/`
      );

      setShowtime(showtimeRes.data);

      // =========================
      // LẤY GHẾ
      // =========================
      const roomId = showtimeRes.data.room;

      try {
        const seatRes = await api.get(
          `/rooms/${roomId}/seats/?showtime_id=${resolvedParams.id}`
        );
        setSeats(seatRes.data);
      } catch (seatError) {
        console.log(
          'Chưa có ghế backend → dùng ghế mặc định'
        );

        setSeats([]);
      }
    } catch (error) {
      console.error('Lỗi load booking:', error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CHỌN GHẾ
  // =========================
  const handleSelectSeat = (seat: Seat) => {
    if (seat.is_booked) return;

    const exists = selectedSeats.find(
      (s) => s.id === seat.id
    );

    if (exists) {
      setSelectedSeats(
        selectedSeats.filter((s) => s.id !== seat.id)
      );
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // =========================
  // GIÁ GHẾ
  // =========================
  const getSeatPrice = (seat: Seat) => {
    switch (seat.seat_type) {
      case 'vip':
        return showtime
          ? Number(showtime.price) + 30000
          : 120000;

      case 'sweetbox':
        return showtime
          ? Number(showtime.price) + 70000
          : 180000;

      default:
        return showtime
          ? Number(showtime.price)
          : 90000;
    }
  };

  // =========================
  // TỔNG TIỀN
  // =========================
  const totalPrice = selectedSeats.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0
  );

  // =========================
  // MÀU GHẾ
  // =========================
  const getSeatColor = (seat: Seat) => {
    if (seat.is_booked) {
      return 'bg-gray-800 text-gray-600 cursor-not-allowed border-gray-900';
    }

    const isSelected = selectedSeats.some(
      (s) => s.id === seat.id
    );

    if (isSelected) {
      return 'bg-netflix text-white border-red-700 shadow-[0_0_10px_rgba(229,9,20,0.8)]';
    }

    switch (seat.seat_type) {
      case 'vip':
        return 'bg-purple-900 border-purple-700 hover:bg-purple-700 text-purple-200';

      case 'sweetbox':
        return 'bg-pink-900 border-pink-700 hover:bg-pink-700 text-pink-200';

      default:
        return 'bg-gray-600 border-gray-500 hover:bg-gray-400 text-gray-200';
    }
  };

  // =========================
const defaultRows = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
];

const fallbackSeats: Seat[] =
  defaultRows.flatMap((row) => {

    // =========================
    // SWEETBOX ÍT GHẾ HƠN
    // =========================
    const cols =
      row === 'L'
        ? [1, 2, 3, 4, 5]
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return cols.map((col) => {

      let seat_type:
        | 'normal'
        | 'vip'
        | 'sweetbox' = 'normal';

      // =========================
      // VIP ROW
      // =========================
      if (row === 'K') {
        seat_type = 'vip';
      }

      // =========================
      // SWEETBOX ROW
      // =========================
      if (row === 'L') {
        seat_type = 'sweetbox';
      }

      return {
        id: `${row}${col}`,
        row_name: row,
        seat_number: col,
        seat_type,
        is_booked: false,
      };
    });
  });

// =========================
// HIỂN THỊ GHẾ MẶC ĐỊNH
// SAU ĐÓ MERGE GHẾ ĐÃ ĐẶT
// =========================

const displaySeats = fallbackSeats.map(
  (defaultSeat) => {

    // tìm ghế backend trùng vị trí
    const bookedSeat = seats.find(
      (seat) =>
        seat.row_name === defaultSeat.row_name &&
        seat.seat_number ===
          defaultSeat.seat_number
    );

    // nếu có dữ liệu backend
    // thì lấy trạng thái đã đặt
    if (bookedSeat) {

      return {
        ...defaultSeat,

        is_booked:
          bookedSeat.is_booked,

        // giữ id thật backend
        id: bookedSeat.id
      };
    }

    // chưa có dữ liệu backend
    return defaultSeat;
  }
);

  // =========================
  // GROUP GHẾ
  // =========================
  const groupedSeats: Record<string, Seat[]> =
    displaySeats.reduce(
      (acc, seat) => {
        if (!acc[seat.row_name]) {
          acc[seat.row_name] = [];
        }

        acc[seat.row_name].push(seat);

        return acc;
      },
      {} as Record<string, Seat[]>
    );

  const rows = Object.keys(groupedSeats);

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-white">
        Đang tải sơ đồ ghế...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8 md:py-12">
      <div className="container mx-auto px-2 md:px-4 flex flex-col xl:flex-row gap-6 md:gap-10">

        {/* ========================= */}
        {/* SƠ ĐỒ GHẾ */}
        {/* ========================= */}
        <div className="flex-grow bg-darkPanel p-4 md:p-8 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">

          {seats.length === 0 && (
            <div className="mb-6 text-center text-yellow-400 text-sm bg-yellow-500/10 border border-yellow-500/30 py-3 rounded-lg">
              Chưa có dữ liệu ghế từ backend.
              Đang hiển thị sơ đồ mặc định.
            </div>
          )}

          <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 text-center uppercase tracking-widest">
            Màn Hình
          </h2>

          <div className="w-full max-w-xl mx-auto h-8 md:h-12 border-t-4 md:border-t-8 border-neonYellow rounded-t-[100%] shadow-[0_-15px_30px_rgba(255,232,31,0.15)] mb-10 md:mb-16 opacity-80"></div>

          {/* ========================= */}
          {/* CHÚ THÍCH GHẾ */}
          {/* ========================= */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm">

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gray-600 border border-gray-400"></div>
              <span className="text-gray-300">
                Ghế thường
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-purple-900 border border-purple-500"></div>
              <span className="text-gray-300">
                Ghế VIP
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-pink-900 border border-pink-500"></div>
              <span className="text-gray-300">
                Ghế Sweetbox
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-netflix"></div>
              <span className="text-gray-300">
                Ghế đang chọn
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gray-900 border border-gray-700"></div>
              <span className="text-gray-300">
                Đã đặt
              </span>
            </div>

          </div>

          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-max flex flex-col items-center gap-3 md:gap-4 mb-8">

              {rows.map((row) => (
                <div
                  key={row}
                  className="flex items-center gap-2 md:gap-4"
                >
                  <div className="w-4 md:w-6 font-bold text-gray-500 text-center text-sm md:text-base">
                    {row}
                  </div>

                  <div className="flex gap-1.5 md:gap-2">

                    {(groupedSeats[row] || []).map(
                      (seat) => (
                        <button
                          key={seat.id}
                          onClick={() =>
                            handleSelectSeat(seat)
                          }
                          disabled={seat.is_booked}
                          className={`
                          flex items-center justify-center rounded-t-lg border-b-[3px] md:border-b-4 text-[10px] md:text-xs font-bold transition-all duration-200 shrink-0
                          ${getSeatColor(seat)}
                          ${
                            seat.seat_type ===
                            'sweetbox'
                              ? 'w-16 h-8 md:w-22 md:h-10 lg:w-24 lg:h-11'
                              : 'w-8 h-8 md:w-10 md:h-10 lg:w-11 lg:h-11'
                          }
                        `}
                        >
                          {seat.row_name}
                          {seat.seat_number}
                        </button>
                      )
                    )}

                  </div>

                  <div className="w-4 md:w-6 font-bold text-gray-500 text-center text-sm md:text-base">
                    {row}
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* THÔNG TIN */}
        {/* ========================= */}
        <div className="w-full xl:w-[380px] flex-shrink-0">

          <div className="bg-darkPanel p-5 md:p-6 rounded-2xl border border-gray-800 shadow-xl sticky top-24">

            <h3 className="text-lg md:text-xl font-bold text-white border-b border-gray-700 pb-4 mb-4">
              Thông Tin Đặt Vé
            </h3>

            {showtime && (
              <div className="mb-6 space-y-2 text-sm md:text-base">

                <p className="text-gray-400">
                  Phim:
                  <span className="text-white font-medium ml-2">
                    {showtime.movie_title}
                  </span>
                </p>

                <p className="text-gray-400">
                  Rạp:
                  <span className="text-white font-medium ml-2">
                    {showtime.theater_name}
                  </span>
                </p>

                <p className="text-gray-400">
                  Phòng:
                  <span className="text-white font-medium ml-2">
                    {showtime.room_name}
                  </span>
                </p>

                <p className="text-gray-400">
                  Suất chiếu:
                  <span className="text-neonYellow font-bold ml-2">
                    {new Date(
                      showtime.start_time
                    ).toLocaleString('vi-VN')}
                  </span>
                </p>

              </div>
            )}

            {/* ========================= */}
            {/* GHẾ ĐANG CHỌN */}
            {/* ========================= */}
            <div className="mb-6 min-h-[80px]">

              <p className="text-gray-400 mb-2 text-sm md:text-base">
                Ghế đang chọn ({selectedSeats.length}):
              </p>

              <div className="flex flex-wrap gap-2">

                {selectedSeats.length === 0 ? (
                  <span className="text-gray-600 italic text-sm">
                    Vui lòng chọn ghế
                  </span>
                ) : (
                  selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className="bg-netflix text-white px-2 py-1 rounded font-bold text-xs"
                    >
                      {seat.row_name}
                      {seat.seat_number}
                    </span>
                  ))
                )}

              </div>
            </div>

            {/* ========================= */}
            {/* TỔNG TIỀN */}
            {/* ========================= */}
            <div className="border-t border-gray-700 pt-4 mb-6 md:mb-8">

              <div className="flex justify-between items-end">

                <span className="text-gray-400 text-sm md:text-base">
                  Tổng tiền:
                </span>

                <span className="text-2xl md:text-3xl font-black text-white">
                  {totalPrice.toLocaleString(
                    'vi-VN'
                  )}{' '}
                  VNĐ
                </span>

              </div>

            </div>

            {/* ========================= */}
            {/* BUTTON */}
            {/* ========================= */}
           <button
            disabled={selectedSeats.length === 0}
            onClick={async () => {

              try {

                // =========================
                // CREATE BOOKING
                // =========================
                const res = await api.post(
                  '/bookings/create/',
                  {
                    showtime_id: resolvedParams.id,

                    seat_ids: selectedSeats.map(
                      seat => Number(seat.id)
                    ),

                    concessions: []
                  }
                )

                // =========================
                // BOOKING ID THẬT
                // =========================
                const bookingId =
                  res.data.booking_id

                // =========================
                // CHUYỂN CHECKOUT
                // =========================
                router.push(
                  `/checkout/${bookingId}`
                )

              } catch (error) {

                console.log(error)

                alert(
                  'Không thể tạo booking'
                )

              }

            }}
            className={`w-full py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all duration-300
            ${
              selectedSeats.length > 0
                ? 'bg-neonYellow text-black hover:bg-yellow-500'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }
          `}
          >
            Tiếp Tục (Bắp Nước)
          </button>

          </div>

        </div>

      </div>
    </div>
  );
}