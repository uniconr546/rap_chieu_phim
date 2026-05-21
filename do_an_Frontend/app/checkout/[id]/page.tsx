'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import QRCode from 'react-qr-code'; 

interface Concession {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string | null;
}

interface TicketInfo {
  movie: string;
  theater: string;
  room: string;
  showtime: string;
  seats: string[];
  seatPrice: number;
}

type PaymentMethod =
  | 'banking'
  | 'momo'
  | 'vnpay';

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  const router = useRouter();

  // =========================
  // STATE
  // =========================
  const [concessionList, setConcessionList] =
    useState<Concession[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('banking');

  const [showQR, setShowQR] =
  useState(false);

  const [ticketInfo, setTicketInfo] =
    useState<TicketInfo>({
      movie: '',
      theater: '',
      room: '',
      showtime: '',
      seats: [],
      seatPrice: 0,
    });

  // =========================
  // LOAD DATA
  // =========================
useEffect(() => {

  if (resolvedParams.id) {

    fetchConcessions();
    fetchBookingInfo();

  }

}, [resolvedParams.id]);
  // =========================
  // LẤY COMBO
  // =========================
  const fetchConcessions = async () => {
    try {
      const res = await api.get(
        '/concessions/'
      );

      const sellingConcessions =
        res.data.filter(
          (item: any) =>
            item.status === 'selling'
        );

      setConcessionList(
        sellingConcessions
      );
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // LẤY BOOKING INFO
  // =========================
  const fetchBookingInfo = async () => {
    try {
    const res = await api.get(
      `/bookings/${resolvedParams.id}/`
    )
      const booking = res.data;

setTicketInfo({

  movie:
    booking.showtime?.movie?.title || '',

  theater:
    booking.showtime?.theater?.name || '',

  room:
    booking.showtime?.room?.name || '',

  showtime:
    booking.showtime?.start_time || '',

  seats:
    booking.seats?.map(
      (seat: any) =>
        `${seat.row_name}${seat.seat_number}`
    ) || [],

  seatPrice:
    Number(
      booking.total_price || 0
    ),

});

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // =========================
  // QUANTITY
  // =========================
  const [quantities, setQuantities] =
    useState<{
      [key: number]: number;
    }>({});

  const updateQuantity = (
    id: number,
    delta: number
  ) => {
    setQuantities((prev) => ({
      ...prev,

      [id]: Math.max(
        0,
        (prev[id] || 0) + delta
      ),
    }));
  };

  // =========================
  // TOTAL
  // =========================
  const concessionTotal =
    concessionList.reduce(
      (sum, item) =>
        sum +
        item.price *
          (quantities[item.id] || 0),
      0
    );

  const finalTotal =
    ticketInfo.seatPrice +
    concessionTotal;

  // =========================
  // PAYMENT
  // =========================
const handlePayment = () => {
  setShowQR(true);
};
const completePayment =
  async () => {

    try {

      const payload = {

        payment_method:
          paymentMethod,

        concessions:
          concessionList
            .filter(
              (item) =>
                (quantities[item.id] ||
                  0) > 0
            )
            .map((item) => ({
              concession_id:
                item.id,
              quantity:
                quantities[item.id],
            })),
      };

      await api.post(
        `/bookings/${resolvedParams.id}/payment/`,
        payload
      );

      alert(
        'Thanh toán thành công!'
      );

      setShowQR(false);

      router.push('/');

    } catch (error) {

      console.log(error);

      alert(
        'Thanh toán thất bại!'
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-white text-2xl font-bold">
        Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-12">

      <div className="container mx-auto px-4 flex flex-col xl:flex-row gap-10">

        {/* ========================= */}
        {/* COMBO */}
        {/* ========================= */}
        <div className="flex-grow space-y-6">

          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-netflix mr-3 rounded-full"></div>

            <h2 className="text-3xl font-bold text-white uppercase tracking-wider">
              Chọn Bắp & Nước
            </h2>
          </div>

          {concessionList.map(
            (item) => (

              <div
                key={item.id}
                className="bg-darkPanel p-6 rounded-2xl border border-gray-800 flex items-center justify-between hover:border-gray-600 transition-all"
              >

                <div className="flex items-center gap-6">

                  <div className="bg-gray-800 w-20 h-20 flex items-center justify-center rounded-xl overflow-hidden">

                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl">
                        🍿
                      </div>
                    )}

                  </div>

                  <div>

                    <h3 className="text-xl font-bold text-white">
                      {item.name}
                    </h3>

                    <p className="text-gray-400 text-sm">
                      {item.description}
                    </p>

                    <p className="text-neonYellow font-bold mt-1">
                      {item.price.toLocaleString(
                        'vi-VN'
                      )}{' '}
                      VNĐ
                    </p>

                  </div>

                </div>

                {/* QUANTITY */}
                <div className="flex items-center gap-4 bg-black p-2 rounded-lg border border-gray-700">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        -1
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center text-white hover:text-netflix font-bold text-xl"
                  >
                    −
                  </button>

                  <span className="w-6 text-center font-bold text-lg text-white">
                    {quantities[item.id] ||
                      0}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        1
                      )
                    }
                    className="w-8 h-8 flex items-center justify-center text-white hover:text-netflix font-bold text-xl"
                  >
                    +
                  </button>

                </div>

              </div>

            )
          )}

          {/* ========================= */}
          {/* PAYMENT METHOD */}
          {/* ========================= */}
          <div className="mt-10 p-6 bg-darkPanel rounded-2xl border border-gray-800">

            <h3 className="text-xl font-bold text-white mb-6">
              Phương Thức Thanh Toán
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* BANK */}
              <button
                onClick={() =>
                  setPaymentMethod(
                    'banking'
                  )
                }
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                ${
                  paymentMethod ===
                  'banking'
                    ? 'border-netflix bg-netflix/10'
                    : 'border-gray-800 hover:border-gray-600'
                }
              `}
              >
                <div className="text-3xl">
                  💳
                </div>

                <span className="text-sm font-bold text-white">
                  Thẻ Ngân Hàng
                </span>
              </button>

              {/* MOMO */}
              <button
                onClick={() =>
                  setPaymentMethod(
                    'momo'
                  )
                }
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                ${
                  paymentMethod ===
                  'momo'
                    ? 'border-pink-500 bg-pink-500/10'
                    : 'border-gray-800 hover:border-gray-600'
                }
              `}
              >
                <div className="text-3xl">
                  📱
                </div>

                <span className="text-sm font-bold text-white">
                  Ví MoMo
                </span>
              </button>

              {/* VNPAY */}
              <button
                onClick={() =>
                  setPaymentMethod(
                    'vnpay'
                  )
                }
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2
                ${
                  paymentMethod ===
                  'vnpay'
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-800 hover:border-gray-600'
                }
              `}
              >
                <div className="text-3xl">
                  🔳
                </div>

                <span className="text-sm font-bold text-white">
                  VNPAY QR
                </span>
              </button>

            </div>

          </div>

        </div>

        {/* ========================= */}
        {/* SUMMARY */}
        {/* ========================= */}
        <div className="w-full xl:w-96 flex-shrink-0">

          <div className="bg-darkPanel p-6 rounded-2xl border border-gray-800 shadow-2xl sticky top-28">

            <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-4 mb-6">
              Tóm Tắt Đơn Hàng
            </h3>

            <div className="space-y-4 mb-8">

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Phim:
                </span>

                <span className="text-white font-bold text-right">
                  {ticketInfo.movie}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Rạp:
                </span>

                <span className="text-white">
                  {ticketInfo.theater}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Phòng:
                </span>

                <span className="text-white">
                  {ticketInfo.room}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Suất chiếu:
                </span>

                <span className="text-neonYellow text-right">
                  {ticketInfo.showtime
                    ? new Date(
                        ticketInfo.showtime
                      ).toLocaleString(
                        'vi-VN'
                      )
                    : ''}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">
                  Ghế:
                </span>

                <span className="text-netflix font-bold">
                  {ticketInfo.seats.join(
                    ', '
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">
                  Tiền vé:
                </span>

                <span className="text-white">
                  {ticketInfo.seatPrice.toLocaleString(
                    'vi-VN'
                  )}{' '}
                  VNĐ
                </span>
              </div>

              {/* COMBO */}
              <div className="pt-4 border-t border-gray-800">

                <p className="text-gray-400 mb-2">
                  Combo:
                </p>

                {concessionTotal ===
                0 ? (
                  <p className="text-gray-600 italic text-sm">
                    Chưa chọn combo
                  </p>
                ) : (
                  concessionList
                    .filter(
                      (i) =>
                        (quantities[
                          i.id
                        ] || 0) > 0
                    )
                    .map((i) => (

                      <div
                        key={i.id}
                        className="flex justify-between text-sm mb-1"
                      >

                        <span className="text-gray-300">
                          {
                            quantities[
                              i.id
                            ]
                          }
                          x {i.name}
                        </span>

                        <span className="text-white">
                          {(
                            i.price *
                            quantities[
                              i.id
                            ]
                          ).toLocaleString(
                            'vi-VN'
                          )}{' '}
                          VNĐ
                        </span>

                      </div>

                    ))
                )}

              </div>

            </div>

            {/* TOTAL */}
            <div className="border-t border-gray-700 pt-6 mb-8">

              <div className="flex justify-between items-end">

                <span className="text-gray-400">
                  Tổng cộng:
                </span>

                <div className="text-right">

                  <span className="block text-3xl font-black text-neonYellow">
                    {finalTotal.toLocaleString(
                      'vi-VN'
                    )}

                    <span className="text-xl">
                      {' '}
                      đ
                    </span>
                  </span>

                </div>

              </div>

            </div>

            {/* BUTTON */}
            <button
              onClick={handlePayment}
              className="w-full py-4 bg-netflix hover:bg-red-700 text-white font-black text-xl rounded-xl transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)]"
            >
              THANH TOÁN NGAY
            </button>

            <p className="text-center text-gray-500 text-xs mt-4">
              Bằng việc bấm thanh toán,
              bạn đồng ý với điều khoản
              sử dụng của Unicorn Cinema.
            </p>

          </div>

        </div>

      </div>

      {showQR && (

        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">

          <div className="bg-darkPanel p-8 rounded-3xl w-[380px] border border-gray-700 text-center shadow-2xl">

            <h2 className="text-2xl font-bold text-white mb-2">
              Quét mã thanh toán
            </h2>

            <p className="text-gray-400 mb-6">
              {paymentMethod.toUpperCase()}
            </p>

            {/* QR */}
            <div className="bg-white p-4 rounded-2xl inline-block mb-6">

              <QRCode
                size={220}
                value={JSON.stringify({
                  method:
                    paymentMethod,

                  amount:
                    finalTotal,

                  booking:
                    resolvedParams.id,
                })}
              />

            </div>

            <p className="text-neonYellow text-2xl font-black mb-6">

              {finalTotal.toLocaleString(
                'vi-VN'
              )}{' '}
              đ

            </p>

            {/* BUTTONS */}
            <div className="flex gap-3">

              <button
                onClick={() =>
                  setShowQR(false)
                }
                className="flex-1 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-600"
              >
                Huỷ
              </button>

              <button
                onClick={
                  completePayment
                }
                className="flex-1 py-3 rounded-xl bg-netflix text-white font-bold hover:bg-red-700"
              >
                Hoàn thành
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}