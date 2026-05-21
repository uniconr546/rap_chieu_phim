from django.db import models

class Concession(models.Model):

    STATUS_CHOICES = [
        ('selling', 'Đang bán'),
        ('stopped', 'Ngừng bán'),
    ]

    name = models.CharField(
        max_length=255
    )

    description = models.TextField()

    price = models.IntegerField()

    image = models.ImageField(
        upload_to='concessions/',
        blank=True,
        null=True
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='selling'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.name