from django.db import models


class Theater(models.Model):

    name = models.CharField(
        max_length=255
    )

    address = models.TextField()

    phone = models.CharField(
        max_length=20,
        blank=True,
        null=True
    )

    def __str__(self):

        return self.name


class Room(models.Model):

    ROOM_TYPE_CHOICES = [

        ('standard', 'Standard'),
        ('vip', 'VIP'),
        ('imax', 'IMAX'),

    ]

    theater = models.ForeignKey(

        Theater,

        on_delete=models.CASCADE,

        related_name='rooms'

    )

    name = models.CharField(
        max_length=100
    )

    capacity = models.IntegerField()

    room_type = models.CharField(

        max_length=20,

        choices=ROOM_TYPE_CHOICES,

        default='standard'

    )

    def __str__(self):

        return f"{self.theater.name} - {self.name}"