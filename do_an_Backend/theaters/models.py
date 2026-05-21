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
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='showtimes')
    room = models.ForeignKey('rooms.Room', on_delete=models.CASCADE, related_name='showtimes')

    start_time = models.DateTimeField()
    end_time = models.DateTimeField(blank=True, null=True)

    price = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        # 1. tự tính end_time từ movie.duration
        if self.movie and self.start_time:
            self.end_time = self.start_time + timedelta(minutes=self.movie.duration)

        # 2. validate
        self.full_clean()

        super().save(*args, **kwargs)

    def clean(self):

        if not self.movie or not self.start_time:
            return

        buffer = timedelta(minutes=30)

        # lấy tất cả suất chiếu trong cùng phòng
        qs = Showtime.objects.filter(room=self.room).exclude(id=self.id)

        for show in qs:

            # interval có buffer
            new_start = self.start_time - buffer
            new_end = self.end_time + buffer

            old_start = show.start_time
            old_end = show.end_time

            # overlap chuẩn toán học
            if new_start < old_end and new_end > old_start:
                raise ValidationError(
                    "Phòng này cần cách suất chiếu khác ít nhất 30 phút"
                )

    def __str__(self):
        return f"{self.movie.title} - {self.start_time}"

    class Meta:
        ordering = ['start_time']
        indexes = [
            models.Index(fields=['room', 'start_time']),
        ]

