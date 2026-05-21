from django.urls import path

from .views import (
    theaters,
    theater_detail,

    rooms,
    room_detail,

    seats,
    room_seats,
    generate_seats,

    showtimes,
    showtime_detail,
    delete_showtime,
    update_showtime
)

urlpatterns = [

    # =========================
    # THEATERS
    # =========================
    path('theaters/', theaters),
    path('theaters/<int:pk>/', theater_detail),

    # =========================
    # ROOMS
    # =========================
    path('rooms/', rooms),
    path('rooms/<int:pk>/', room_detail),
    path('rooms/<int:room_id>/seats/', room_seats),

    # =========================
    # ROOM SEATS
    # =========================
    path(
        'rooms/<int:room_id>/seats/',
         room_seats
    ),

    # =========================
    # GENERATE SEATS
    # =========================
    path(
        'generate-seats/',
        generate_seats
    ),

    # =========================
    # SHOWTIMES
    # =========================
    path('showtimes/', showtimes),
    path('showtimes/<int:pk>/delete/', delete_showtime),
    path('showtimes/<int:pk>/update/', update_showtime),
    path(
        'showtimes/<int:pk>/',
        showtime_detail
    ),
]