from django.urls import path

from .views import (
    create_booking,
    hold_seat,
    checkin,
    BookingDetailView,
    booked_seats
)

urlpatterns = [

    path(
        'create/',
        create_booking
    ),

    path(
        'hold/',
        hold_seat
    ),

    path(
        'checkin/',
        checkin
    ),

    # =========================
    # BOOKING DETAIL
    # =========================
    path(
        '<int:pk>/',
        BookingDetailView.as_view()
    ),

    # =========================
    # BOOKED SEATS
    # =========================
    path(
        'showtime/<int:showtime_id>/booked-seats/',
        booked_seats
    ),

    path(
    'bookings/create/',
    create_booking
    ),

    path(
    'hold-seat/',
    hold_seat
    ),

]