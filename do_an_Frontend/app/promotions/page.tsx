'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';

interface Promotion {
  id: number;
  title: string;
  description: string;
  code: string;
  discount_percent?: number;
  image?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
}

export default function PromotionsPage() {

  const [promotions, setPromotions] =
    useState<Promotion[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH PROMOTIONS
  // =========================
  useEffect(() => {

    const fetchPromotions =
      async () => {

      try {

        const res =
          await api.get(
            '/promotions/'
          );

        // chỉ lấy KM đang hoạt động
        const activePromotions =
          res.data.filter(
            (item: Promotion) =>
              item.status === 'active'
          );

        setPromotions(
          activePromotions
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);

      }

    };

    fetchPromotions();

  }, []);

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (

      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-dark
        text-white
        text-2xl
        font-bold
        "
      >

        Đang tải khuyến mãi...

      </div>

    );

  }

  return (

    <div
      className="
      min-h-screen
      bg-dark
      "
    >

      <div
        className="
        container
        mx-auto
        px-4
        py-16
        "
      >

        {/* TITLE */}
        <div className="mb-12">

          <h1
            className="
            text-4xl
            md:text-5xl
            font-black
            text-white
            uppercase
            tracking-wider
            border-l-4
            border-netflix
            pl-4
            "
          >

            Khuyến Mãi Hot

          </h1>

          <p
            className="
            text-gray-400
            mt-4
            text-lg
            "
          >

            Ưu đãi hấp dẫn dành riêng cho khách hàng Unicorn Cinema

          </p>

        </div>

        {/* EMPTY */}
        {promotions.length === 0 && (

          <div
            className="
            bg-darkPanel
            border
            border-gray-800
            rounded-2xl
            p-16
            text-center
            "
          >

            <div className="text-6xl mb-6">
              🎁
            </div>

            <h2
              className="
              text-2xl
              font-bold
              text-white
              mb-4
              "
            >

              Hiện chưa có khuyến mãi

            </h2>

            <p className="text-gray-500">
              Vui lòng quay lại sau.
            </p>

          </div>

        )}

        {/* LIST */}
        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-8
          "
        >

          {promotions.map((promo) => (

            <div
              key={promo.id}

              className="
              bg-gradient-to-br
              from-gray-900
              to-black
              rounded-2xl
              overflow-hidden
              border
              border-gray-800
              hover:border-netflix
              transition-all
              shadow-xl
              "
            >

              {/* IMAGE */}
              <div
                className="
                h-52
                overflow-hidden
                "
              >

                <img
                  src={
                    promo.image
                      ? `http://127.0.0.1:8000${promo.image}`
                      : 'https://placehold.co/600x400?text=Promotion'
                  }

                  alt={promo.title}

                  className="
                  w-full
                  h-full
                  object-cover
                  hover:scale-105
                  transition-transform
                  duration-500
                  "
                />

              </div>

              {/* CONTENT */}
              <div className="p-6">

                <div
                  className="
                  inline-block
                  bg-netflix
                  px-3
                  py-1
                  rounded-full
                  text-xs
                  font-black
                  mb-4
                  "
                >

                  🎉 ƯU ĐÃI

                </div>

                <h2
                  className="
                  text-2xl
                  font-black
                  text-white
                  mb-3
                  "
                >

                  {promo.title}

                </h2>

                <p
                  className="
                  text-gray-400
                  mb-6
                  line-clamp-3
                  "
                >

                  {promo.description}

                </p>

                {/* CODE */}
                <div
                  className="
                  bg-black
                  border
                  border-dashed
                  border-netflix
                  rounded-xl
                  p-4
                  mb-6
                  text-center
                  "
                >

                  <p className="text-gray-500 text-sm mb-1">
                    Mã khuyến mãi
                  </p>

                  <p
                    className="
                    text-2xl
                    font-black
                    text-neonYellow
                    tracking-widest
                    "
                  >

                    {promo.code}

                  </p>

                </div>

                {/* DATE */}
                <div
                  className="
                  flex
                  justify-between
                  text-sm
                  text-gray-500
                  mb-6
                  "
                >

                  <span>

                    {promo.start_date
                      ? new Date(
                          promo.start_date
                        ).toLocaleDateString(
                          'vi-VN'
                        )
                      : ''}

                  </span>

                  <span>

                    {promo.end_date
                      ? new Date(
                          promo.end_date
                        ).toLocaleDateString(
                          'vi-VN'
                        )
                      : ''}

                  </span>

                </div>

                {/* BUTTON */}
                <button
                  className="
                  w-full
                  py-3
                  rounded-xl
                  bg-netflix
                  hover:bg-red-700
                  text-white
                  font-black
                  transition-all
                  shadow-[0_0_20px_rgba(229,9,20,0.3)]
                  "
                >

                  Sử Dụng Ngay

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}