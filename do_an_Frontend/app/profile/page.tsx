// app/profile/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import api from '@/services/api';

interface Booking {
  id: number;
  total_price: number;
  booking_code: string;
  payment_status: string;
  created_at: string;

  showtime: {
    id: number;
    start_time: string;

    movie: {
      title: string;
    };

    room?: {
      name: string;
    };
  };

  seats: {
    seat_number: string;
  }[];
}

export default function ProfilePage() {

  const [bookings, setBookings] =
    useState<Booking[]>([]);

  const [loading, setLoading] =
    useState(true);

  // USER INFO
  const user = {
    name:
      localStorage.getItem('username') ||
      'Người dùng',

    email:
      localStorage.getItem('email') ||
      'user@gmail.com',

    memberLevel: 'VIP',
    totalPoints: 1250
  };

  // LOAD BOOKINGS
  useEffect(() => {

    const fetchBookings = async () => {

      try {

        const token =
          localStorage.getItem('access');

        const response =
          await api.get(
            '/bookings/my-bookings/',
            {
              headers: {
                Authorization:
                  `Bearer ${token}`
              }
            }
          );

        setBookings(response.data);

      } catch (error) {

        console.error(
          'Lỗi tải vé:',
          error
        );

      } finally {

        setLoading(false);

      }

    };

    fetchBookings();

  }, []);

  // FORMAT DATE
  const formatDateTime = (
    dateString: string
  ) => {

    return new Date(
      dateString
    ).toLocaleString(
      'vi-VN',
      {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }
    );

  };

  // CHECK UPCOMING
  const isUpcoming = (
    startTime: string
  ) => {

    return (
      new Date(startTime) > new Date()
    );

  };

  // LOGOUT
  const handleLogout = () => {

    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    window.location.href = '/';

  };

  if (loading) {

    return (

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

        Đang tải vé...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-dark py-12">

      <div
        className="
        container
        mx-auto
        px-4
        max-w-5xl
        "
      >

        {/* HEADER */}
        <div
          className="
          bg-darkPanel
          p-6
          md:p-8
          rounded-2xl
          border
          border-gray-800
          shadow-xl
          mb-10
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-6
          "
        >

          <div
            className="
            flex
            flex-col
            sm:flex-row
            items-center
            gap-6
            text-center
            sm:text-left
            "
          >

<div
  className="
  w-24
  h-24
  bg-gradient-to-tr
  from-netflix
  to-purple-600
  rounded-full
  flex
  items-center
  justify-center
  text-4xl
  font-black
  text-white
  uppercase
  border-4
  border-gray-800
  shadow-[0_0_15px_rgba(229,9,20,0.5)]
  "
>

  {user.name.charAt(0)}

</div>

            <div>

              <h1
                className="
                text-3xl
                font-black
                text-white
                "
              >

                {user.name}

              </h1>

              <p className="text-gray-400">

                {user.email}

              </p>

              <div
                className="
                mt-2
                inline-block
                bg-neonYellow
                text-black
                text-xs
                font-bold
                px-3
                py-1
                rounded-full
                uppercase
                "
              >

                Thành viên {user.memberLevel}

              </div>

            </div>

          </div>

          <div
            className="
            flex
            flex-col
            items-center
            md:items-end
            gap-4
            "
          >

            <div
              className="
              text-center
              md:text-right
              "
            >

              <p
                className="
                text-xs
                text-gray-500
                uppercase
                "
              >

                Điểm tích lũy

              </p>

              <p
                className="
                text-3xl
                font-black
                text-neonYellow
                "
              >

                {user.totalPoints} pts

              </p>

            </div>

            <button
              onClick={handleLogout}

              className="
              bg-transparent
              hover:bg-netflix
              border-2
              border-netflix
              text-white
              font-bold
              py-2
              px-6
              rounded-lg
              transition-all
              "
            >

              Đăng Xuất

            </button>

          </div>

        </div>

        {/* TITLE */}
        <div
          className="
          flex
          items-center
          mb-8
          "
        >

          <div
            className="
            w-1
            h-8
            bg-netflix
            mr-3
            rounded-full
            "
          ></div>

          <h2
            className="
            text-2xl
            font-bold
            text-white
            uppercase
            "
          >

            Vé Của Tôi

          </h2>

        </div>

        {/* BOOKINGS */}
        <div className="space-y-8">

          {bookings.length > 0 ? (

            bookings.map((booking) => {

              const upcoming =
                isUpcoming(
                  booking.showtime.start_time
                );

              return (

                <div

                  key={booking.id}

                  className={`
                  flex
                  flex-col
                  md:flex-row
                  rounded-2xl
                  overflow-hidden
                  shadow-2xl
                  border

                  ${
                    upcoming
                      ? 'border-netflix/50'
                      : 'border-gray-800 opacity-70'
                  }
                  `}
                >

                  {/* LEFT */}
                  <div
                    className="
                    bg-darkPanel
                    p-6
                    md:p-8
                    flex-grow
                    relative
                    "
                  >

                    <div
                      className="
                      flex
                      justify-between
                      items-start
                      mb-4
                      "
                    >

                      <div>

                        <span
                          className={`
                          text-xs
                          font-bold
                          px-3
                          py-1
                          rounded-full
                          uppercase

                          ${
                            upcoming
                              ? 'bg-netflix text-white'
                              : 'bg-gray-700 text-gray-300'
                          }
                          `}
                        >

                          {upcoming
                            ? 'Sắp chiếu'
                            : 'Đã xem'
                          }

                        </span>

                        <h3
                          className="
                          text-2xl
                          font-black
                          text-white
                          mt-3
                          "
                        >

                          {
                            booking.showtime.movie.title
                          }

                        </h3>

                      </div>

                      <div className="text-right">

                        <p
                          className="
                          text-sm
                          text-gray-400
                          "
                        >

                          Mã đơn hàng

                        </p>

                        <p
                          className="
                          font-mono
                          text-gray-300
                          "
                        >

                          #{booking.id}

                        </p>

                      </div>

                    </div>

                    <div
                      className="
                      grid
                      grid-cols-2
                      md:grid-cols-4
                      gap-4
                      mt-6
                      "
                    >

                      <div>

                        <p
                          className="
                          text-xs
                          text-gray-500
                          uppercase
                          "
                        >

                          Suất chiếu

                        </p>

                        <p
                          className="
                          font-bold
                          text-neonYellow
                          "
                        >

                          {formatDateTime(
                            booking.showtime.start_time
                          )}

                        </p>

                      </div>

                      <div>

                        <p
                          className="
                          text-xs
                          text-gray-500
                          uppercase
                          "
                        >

                          Phòng

                        </p>

                        <p
                          className="
                          font-bold
                          text-white
                          "
                        >

                          {
                            booking.showtime.room?.name
                          }

                        </p>

                      </div>

                      <div>

                        <p
                          className="
                          text-xs
                          text-gray-500
                          uppercase
                          "
                        >

                          Ghế

                        </p>

                        <p
                          className="
                          font-bold
                          text-white
                          "
                        >

                          {booking.seats
                            ?.map(
                              (seat) =>
                                seat.seat_number
                            )
                            .join(', ')}

                        </p>

                      </div>

                      <div>

                        <p
                          className="
                          text-xs
                          text-gray-500
                          uppercase
                          "
                        >

                          Tổng tiền

                        </p>

                        <p
                          className="
                          font-bold
                          text-white
                          "
                        >

                          {booking.total_price.toLocaleString(
                            'vi-VN'
                          )} đ

                        </p>

                      </div>

                    </div>

                  </div>

                  {/* QR */}
                  <div
                    className="
                    bg-darkPanel
                    p-6
                    md:p-8
                    flex
                    flex-col
                    items-center
                    justify-center
                    min-w-[250px]
                    border-t
                    md:border-t-0
                    md:border-l
                    border-dashed
                    border-gray-700
                    "
                  >

                    <p
                      className="
                      text-sm
                      text-gray-400
                      mb-4
                      text-center
                      "
                    >

                      Đưa mã này cho nhân viên rạp

                    </p>

                    <div
                      className={`
                      p-3
                      bg-white
                      rounded-xl

                      ${
                        !upcoming
                          ? 'opacity-50 grayscale'
                          : ''
                      }
                      `}
                    >

                      <QRCodeSVG
                        value={
                          booking.booking_code
                        }

                        size={140}

                        bgColor="#ffffff"

                        fgColor="#000000"

                        level="Q"
                      />

                    </div>

                    <p
                      className="
                      font-mono
                      text-xs
                      text-gray-500
                      mt-4
                      tracking-widest
                      "
                    >

                      {
                        booking.booking_code
                      }

                    </p>

                  </div>

                </div>

              );

            })

          ) : (

            <div
              className="
              text-center
              text-gray-500
              py-20
              bg-darkPanel
              rounded-2xl
              border
              border-gray-800
              "
            >

              Bạn chưa đặt vé nào.

            </div>

          )}

        </div>

      </div>

    </div>

  );

}