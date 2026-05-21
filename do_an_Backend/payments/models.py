from django.db import models
from bookings.models import Booking

class Payment(models.Model):

    PAYMENT_STATUS = (
        ('pending', 'Chờ thanh toán'),
        ('success', 'Thành công'),
        ('failed', 'Thất bại'),
        ('refunded', 'Hoàn tiền'),
    )

    PAYMENT_METHODS = (
        ('momo', 'MoMo'),
        ('vnpay', 'VNPay'),
        ('zalopay', 'ZaloPay'),
        ('cash', 'Tiền mặt'),
    )

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name='payment'
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    payment_method = models.CharField(
        max_length=50,
        choices=PAYMENT_METHODS,
        default='cash'
    )

    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS,
        default='pending',
        db_index=True
    )

    transaction_code = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_index=True
    )

    paid_at = models.DateTimeField(
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
        return str(self.booking.booking_code)