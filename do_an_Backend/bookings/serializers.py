from rest_framework import serializers
from django.utils import timezone

from .models import (
    Booking,
    BookingSeat,
    BookingConcession,
    SeatHold
)

from theaters.models import Showtime
from theaters.models import (
    Showtime,
    Seat
)
from concessions.models import Concession

from users.serializers import UserSerializer

from theaters.serializers import ShowtimeSerializer

from concessions.serializers import (
    ConcessionSerializer
)


# =====================================================
# SEAT SERIALIZER
# =====================================================

class SeatSerializer(serializers.ModelSerializer):

    class Meta:
        model = Seat

        fields = [
            'id',
            'row_name',
            'seat_number',
            'seat_type'
        ]


# =====================================================
# BOOKING SEAT SERIALIZER
# =====================================================

class BookingSeatSerializer(
    serializers.ModelSerializer
):

    seat = SeatSerializer(
        read_only=True
    )

    seat_id = serializers.PrimaryKeyRelatedField(
        queryset=Seat.objects.all(),
        source='seat',
        write_only=True
    )

    class Meta:
        model = BookingSeat

        fields = [
            'id',
            'seat',
            'seat_id',
            'price',
        ]


# =====================================================
# BOOKING CONCESSION SERIALIZER
# =====================================================

class BookingConcessionSerializer(
    serializers.ModelSerializer
):

    concession = ConcessionSerializer(
        read_only=True
    )

    concession_id = serializers.PrimaryKeyRelatedField(
        queryset=Concession.objects.all(),
        source='concession',
        write_only=True
    )

    class Meta:
        model = BookingConcession

        fields = [
            'id',
            'concession',
            'concession_id',
            'quantity',
            'price',
        ]


# =====================================================
# BOOKING LIST SERIALIZER
# =====================================================

class BookingListSerializer(
    serializers.ModelSerializer
):

    showtime = ShowtimeSerializer(
        read_only=True
    )

    class Meta:
        model = Booking

        fields = [
            'id',
            'booking_code',
            'status',
            'total_price',
            'showtime',
            'created_at',
        ]


# =====================================================
# BOOKING DETAIL SERIALIZER
# =====================================================

class SeatSerializer(serializers.ModelSerializer):

    class Meta:
        model = Seat

        fields = [
            'id',
            'row_name',
            'seat_number',
            'seat_type'
        ]


# =========================
# BOOKING DETAIL
# =========================
class BookingDetailSerializer(serializers.ModelSerializer):

    seats = serializers.SerializerMethodField()

    showtime = serializers.SerializerMethodField()

    class Meta:
        model = Booking

        fields = [
            'id',
            'showtime',
            'seats',
            'total_price',
            'status',
            'created_at'
        ]

    # =========================
    # SHOWTIME
    # =========================
    def get_showtime(self, obj):

        return {

            'id': obj.showtime.id,

            'movie': {
                'title': obj.showtime.movie.title
            },

            'theater': {
                'name': obj.showtime.room.theater.name
            },

            'room': {
                'name': obj.showtime.room.name
            },

            'start_time': obj.showtime.start_time,

            'price': float(obj.showtime.price)
        }

    # =========================
    # SEATS
    # =========================

    def get_seats(self, obj):

        booking_seats = BookingSeat.objects.filter(
            booking=obj
        ).select_related('seat')

        return [
            {
                "id": item.seat.id,
                "row_name": item.seat.row_name,
                "seat_number": item.seat.seat_number,
                "seat_type": item.seat.seat_type,
            }
            for item in booking_seats
        ]
    # =========================
    # CONCESSIONS
    # =========================
    def get_concessions(self, obj):

        concessions = BookingConcession.objects.filter(
            booking=obj
        )

        return [

            {
                'id': item.concession.id,
                'name': item.concession.name,
                'quantity': item.quantity,
                'price': item.price
            }

            for item in concessions
        ]


# =====================================================
# CREATE BOOKING SERIALIZER
# =====================================================

class CreateBookingSerializer(
    serializers.Serializer
):

    showtime_id = serializers.IntegerField()

    seat_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )

    concessions = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )

    def validate(self, data):

        showtime_id = data.get(
            'showtime_id'
        )

        seat_ids = data.get(
            'seat_ids'
        )

        # =========================
        # SHOWTIME
        # =========================
        try:

            showtime = Showtime.objects.get(
                id=showtime_id
            )

        except Showtime.DoesNotExist:

            raise serializers.ValidationError(
                "Suất chiếu không tồn tại"
            )

        # =========================
        # BOOKED
        # =========================
        booked_seats = BookingSeat.objects.filter(
            booking__showtime=showtime,
            seat_id__in=seat_ids
        )

        if booked_seats.exists():

            raise serializers.ValidationError(
                "Một số ghế đã được đặt"
            )

        # =========================
        # DELETE EXPIRED HOLD
        # =========================
        SeatHold.objects.filter(
            expires_at__lt=timezone.now()
        ).delete()

        # =========================
        # HELD SEATS
        # =========================
        held_seats = SeatHold.objects.filter(
            showtime=showtime,
            seat_id__in=seat_ids
        )

        if held_seats.exists():

            raise serializers.ValidationError(
                "Một số ghế đang được giữ"
            )

        return data


# =====================================================
# HOLD SERIALIZER
# =====================================================

class SeatHoldSerializer(
    serializers.ModelSerializer
):

    seat = SeatSerializer(
        read_only=True
    )

    showtime = ShowtimeSerializer(
        read_only=True
    )

    class Meta:
        model = SeatHold

        fields = '__all__'


# =====================================================
# CREATE HOLD SERIALIZER
# =====================================================

class CreateSeatHoldSerializer(
    serializers.Serializer
):

    showtime_id = serializers.IntegerField()

    seat_id = serializers.IntegerField()

    def validate(self, data):

        try:

            showtime = Showtime.objects.get(
                id=data['showtime_id']
            )

        except Showtime.DoesNotExist:

            raise serializers.ValidationError(
                "Suất chiếu không tồn tại"
            )

        try:

            seat = Seat.objects.get(
                id=data['seat_id']
            )

        except Seat.DoesNotExist:

            raise serializers.ValidationError(
                "Ghế không tồn tại"
            )

        already_booked = BookingSeat.objects.filter(
            booking__showtime=showtime,
            seat=seat
        ).exists()

        if already_booked:

            raise serializers.ValidationError(
                "Ghế đã được đặt"
            )

        SeatHold.objects.filter(
            expires_at__lt=timezone.now()
        ).delete()

        already_held = SeatHold.objects.filter(
            showtime=showtime,
            seat=seat
        ).exists()

        if already_held:

            raise serializers.ValidationError(
                "Ghế đang được giữ"
            )

        return data


# =====================================================
# CHECKIN SERIALIZER
# =====================================================

class CheckInSerializer(
    serializers.Serializer
):

    booking_code = serializers.CharField()

    def validate_booking_code(
        self,
        value
    ):

        try:

            booking = Booking.objects.get(
                booking_code=value
            )

        except Booking.DoesNotExist:

            raise serializers.ValidationError(
                "Mã booking không hợp lệ"
            )

        if booking.status != 'paid':

            raise serializers.ValidationError(
                "Vé chưa thanh toán"
            )

        return value
    
class BookingSerializer(
    serializers.ModelSerializer
):

    showtime = ShowtimeSerializer(
        read_only=True
    )

    seats = SeatSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = Booking

        fields = '__all__'