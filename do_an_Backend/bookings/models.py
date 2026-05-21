from django.db import models
from concessions.models import Concession
from users.models import User
from theaters.models import Showtime, Seat
from django.utils import timezone
from datetime import timedelta

class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Chờ thanh toán'),
        ('paid', 'Đã thanh toán'),
        ('cancelled', 'Đã hủy'),
        ('expired', 'Hết hạn'),
        ('refunded', 'Đã hoàn tiền'),
        ('checked_in', 'Đã check-in'),
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    showtime = models.ForeignKey(
        Showtime,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        db_index=True
    )
    booking_code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True
    )
    qr_code = models.ImageField(
        upload_to='tickets/qrcodes/',
        blank=True,
        null=True
    )
    checked_in_at = models.DateTimeField(
        blank=True,
        null=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    def __str__(self):
        return self.booking_code
    
class BookingSeat(models.Model):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='booking_seats'
    )
    showtime = models.ForeignKey(
        Showtime,
        on_delete=models.CASCADE,
        related_name='booked_seats'
    )
    seat = models.ForeignKey(
        Seat,
        on_delete=models.CASCADE
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    class Meta:
        unique_together = (
            'showtime',
            'seat'
        )

class BookingConcession(models.Model):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='booking_concessions'
    )
    concession = models.ForeignKey(
        Concession,
        on_delete=models.CASCADE
    )
    quantity = models.IntegerField(
        default=1
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

class SeatHold(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )
    showtime = models.ForeignKey(
        Showtime,
        on_delete=models.CASCADE
    )
    seat = models.ForeignKey(
        Seat,
        on_delete=models.CASCADE
    )
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    class Meta:
        unique_together = (
            'showtime',
            'seat'
        )
    def is_expired(self):
        return timezone.now() > self.expires_at
    @staticmethod
    def create_hold(user, showtime, seat):

        return SeatHold.objects.create(
            user=user,
            showtime=showtime,
            seat=seat,
            expires_at=timezone.now() + timedelta(minutes=5)
        )
