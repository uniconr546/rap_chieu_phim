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

from .serializers import BookingDetailSerializer, BookingSerializer



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

            showtime = Showtime.objects.select_for_update().get(
                id=showtime_id
            )

            booking = Booking.objects.create(
                user=request.user,
                showtime=showtime,
                booking_code=str(uuid.uuid4())[:10],
                status='pending',
                total_price=0
            )

            total = 0

            seats = Seat.objects.filter(
                id__in=seat_ids,
                room=showtime.room
            )

            for seat in seats:

                existing = BookingSeat.objects.filter(
                    showtime=showtime,
                    seat=seat
                ).exists()

                if existing:
                    return Response(
                        {"error": f"Ghế {seat} đã được đặt"},
                        status=400
                    )

                # =========================
                # GIÁ GHẾ
                # =========================
                seat_price = showtime.price

                if seat.seat_type == 'vip':
                    seat_price = 150000

                elif seat.seat_type == 'sweetbox':
                    seat_price = 190000

                BookingSeat.objects.create(
                    booking=booking,
                    showtime=showtime,
                    seat=seat,
                    price=seat_price
                )

                total += seat_price

                print(
                    seat.row_name,
                    seat.seat_number,
                    seat.seat_type,
                    seat_price
                )

                print("TOTAL:", total)

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

        concessions = request.data.get(
            'concessions',
            []
        )

        total = booking.total_price

        # =========================
        # ADD CONCESSIONS
        # =========================
        for item in concessions:

            try:

                concession = Concession.objects.get(
                    id=item['concession_id']
                )

            except Concession.DoesNotExist:

                return Response({
                    "error": "Combo không tồn tại"
                }, status=400)

            quantity = item.get(
                'quantity',
                1
            )

            BookingConcession.objects.create(
                booking=booking,
                concession=concession,
                quantity=quantity,
                price=concession.price * quantity
            )

            total += concession.price * quantity

        # =========================
        # UPDATE BOOKING
        # =========================
        booking.total_price = total

        booking.status = 'paid'

        booking.save()

        return Response({

            "message": "Thanh toán thành công",

            "booking_id": booking.id,

            "payment_method": payment_method,

            "total_price": total

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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):

    bookings = Booking.objects.filter(
        user=request.user
    ).order_by('-created_at')

    serializer = BookingSerializer(
        bookings,
        many=True
    )

    return Response(serializer.data)