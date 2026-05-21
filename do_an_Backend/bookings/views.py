from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import RetrieveAPIView

from django.db import transaction
from django.utils import timezone

from datetime import timedelta
import uuid

from .models import (
    Booking,
    BookingSeat,
    BookingConcession,
    SeatHold
)

from theaters.models import Showtime, Seat
from concessions.models import Concession

from .serializers import BookingDetailSerializer


# =====================================================
# CREATE BOOKING
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):

    data = request.data

    showtime_id = data.get('showtime_id')

    seat_ids = data.get('seat_ids', [])

    concessions = data.get('concessions', [])

    if not seat_ids:
        return Response(
            {"error": "Chưa chọn ghế"},
            status=400
        )

    try:

        with transaction.atomic():

            # =========================
            # SHOWTIME
            # =========================
            showtime = Showtime.objects.select_for_update().get(
                id=showtime_id
            )

            # =========================
            # CREATE BOOKING
            # =========================
            booking = Booking.objects.create(
                user=request.user,
                showtime=showtime,
                booking_code=str(uuid.uuid4())[:10],
                status='pending',
                total_price=0
            )

            total = 0

            # =========================
            # LẤY GHẾ
            # =========================
            seats = Seat.objects.filter(
                id__in=seat_ids,
                room=showtime.room
            )

            print("SEATS:", seats)

            # =========================
            # BOOKING SEATS
            # =========================
            for seat in seats:

                existing = BookingSeat.objects.filter(
                    showtime=showtime,
                    seat=seat
                ).exists()

                if existing:

                    return Response(
                        {
                            "error": f"Ghế {seat} đã được đặt"
                        },
                        status=400
                    )

                # tạo booking seat
                BookingSeat.objects.create(
                    booking=booking,
                    showtime=showtime,
                    seat=seat,
                    price=showtime.price
                )

                # cộng tiền từng ghế
                total += float(showtime.price)

            # =========================
            # CONCESSIONS
            # =========================
            for item in concessions:

                try:

                    concession = Concession.objects.get(
                        id=item['concession_id']
                    )

                except Concession.DoesNotExist:

                    return Response(
                        {
                            "error": "Concession không tồn tại"
                        },
                        status=400
                    )

                qty = item.get('quantity', 1)

                BookingConcession.objects.create(
                    booking=booking,
                    concession=concession,
                    quantity=qty,
                    price=concession.price * qty
                )

                total += float(concession.price) * qty

            # =========================
            # UPDATE TOTAL
            # =========================
            booking.total_price = total

            booking.save()

            # =========================
            # XOÁ HOLD
            # =========================
            SeatHold.objects.filter(
                showtime=showtime,
                seat_id__in=seat_ids
            ).delete()

            return Response({

                "message": "Đặt vé thành công",

                "booking_id": booking.id,

                "booking_code": booking.booking_code,

                "total_price": total

            })

    except Showtime.DoesNotExist:

        return Response(
            {"error": "Showtime không tồn tại"},
            status=404
        )
# =====================================================
# BOOKED SEATS
# =====================================================

@api_view(['GET'])
def booked_seats(request, showtime_id):

    bookings = Booking.objects.filter(
        showtime_id=showtime_id,
        status='paid'
    )

    seat_ids = []

    for booking in bookings:

        seat_ids.extend(
            booking.seats.values_list(
                'id',
                flat=True
            )
        )

    return Response(seat_ids)


# =====================================================
# HOLD SEAT
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def hold_seat(request):

    showtime_id = request.data.get(
        'showtime_id'
    )

    seat_id = request.data.get(
        'seat_id'
    )

    # =========================
    # XOÁ HOLD HẾT HẠN
    # =========================
    SeatHold.objects.filter(
        expires_at__lt=timezone.now()
    ).delete()

    # =========================
    # KIỂM TRA GHẾ ĐÃ BOOK
    # =========================
    already_booked = BookingSeat.objects.filter(
        showtime_id=showtime_id,
        seat_id=seat_id
    ).exists()

    if already_booked:

        return Response(
            {
                "error": "Ghế đã được đặt"
            },
            status=400
        )

    # =========================
    # KIỂM TRA GHẾ ĐANG HOLD
    # =========================
    exists = SeatHold.objects.filter(
        showtime_id=showtime_id,
        seat_id=seat_id
    ).exclude(
        user=request.user
    ).exists()

    if exists:

        return Response(
            {
                "error": "Ghế đang được người khác giữ"
            },
            status=400
        )

    # =========================
    # UPDATE HOLD NẾU ĐÃ CÓ
    # =========================
    hold, created = SeatHold.objects.update_or_create(

        user=request.user,

        showtime_id=showtime_id,

        seat_id=seat_id,

        defaults={
            "expires_at":
            timezone.now() + timedelta(minutes=5)
        }
    )

    return Response({

        "message": "Giữ ghế thành công",

        "hold_id": hold.id,

        "expires_at": hold.expires_at

    })

# =====================================================
# PAYMENT
# =====================================================

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def payment(request, booking_id):

    try:

        booking = Booking.objects.get(
            id=booking_id,
            user=request.user
        )

        if booking.status == 'paid':

            return Response({
                "error": "Booking đã thanh toán"
            }, status=400)

        payment_method = request.data.get(
            'payment_method',
            'banking'
        )

        booking.status = 'paid'

        booking.save()

        return Response({

            "message": "Thanh toán thành công",

            "booking_id": booking.id,

            "payment_method": payment_method

        })

    except Booking.DoesNotExist:

        return Response({
            "error": "Booking không tồn tại"
        }, status=404)


# =====================================================
# CHECK-IN
# =====================================================

@api_view(['POST'])
def checkin(request):

    code = request.data.get('booking_code')

    try:

        booking = Booking.objects.get(
            booking_code=code
        )

        if booking.status != 'paid':

            return Response(
                {"error": "Vé chưa thanh toán"},
                status=400
            )

        booking.status = 'checked_in'

        booking.save()

        return Response({

            "message": "Check-in thành công",

            "booking_code": booking.booking_code

        })

    except Booking.DoesNotExist:

        return Response(
            {"error": "Mã không hợp lệ"},
            status=404
        )


# =====================================================
# BOOKING DETAIL
# =====================================================

class BookingDetailView(RetrieveAPIView):

    queryset = Booking.objects.all()

    serializer_class = BookingDetailSerializer

    permission_classes = [IsAuthenticated]