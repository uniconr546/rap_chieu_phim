from django.db import models
from movies.models import Movie
from django.core.exceptions import ValidationError
from datetime import timedelta


class Theater(models.Model):
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(
        default=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    def __str__(self):
        return self.name

class Room(models.Model):
    theater = models.ForeignKey(
        Theater,
        on_delete=models.CASCADE,
        related_name='rooms'
    )
    name = models.CharField(
        max_length=100
    )
    is_active = models.BooleanField(
        default=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    def __str__(self):
        return f"{self.theater.name} - {self.name}"
    
class Seat(models.Model):

    SEAT_TYPES = (
        ('normal', 'Ghế thường'),
        ('vip', 'Ghế VIP'),
        ('couple', 'Ghế đôi'),
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='seats'
    )
    row_name = models.CharField(
        max_length=5
    )
    seat_number = models.IntegerField()
    seat_type = models.CharField(
        max_length=20,
        choices=SEAT_TYPES,
        default='normal'
    )
    is_active = models.BooleanField(
        default=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        auto_now=True
    )
    class Meta:
        unique_together = (
            'room',
            'row_name',
            'seat_number'
        )
    def __str__(self):
        return f"{self.row_name}{self.seat_number}"
    
class Showtime(models.Model):
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name='showtimes'
    )
    room = models.ForeignKey(
        Room,
        on_delete=models.CASCADE,
        related_name='showtimes'
    )
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    price = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):

            # =========================
            # CHO PHÉP CÁCH NHAU 30 PHÚT
            # =========================

            existing_showtimes = Showtime.objects.filter(
                room=self.room
            ).exclude(id=self.id)

            for show in existing_showtimes:

                # khoảng nghỉ 30 phút
                buffer_time = timedelta(minutes=30)

                # nếu bị chồng giờ
                if (
                    self.start_time < show.end_time + buffer_time
                    and
                    self.end_time > show.start_time - buffer_time
                ):

                    raise ValidationError(
                        'Phòng này cần cách suất chiếu khác ít nhất 30 phút'
                    )

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.movie.title} - {self.start_time}"

    class Meta:
        ordering = ['start_time']
        indexes = [
            models.Index(fields=['room', 'start_time']),
            models.Index(fields=['movie', 'start_time']),
        ]


