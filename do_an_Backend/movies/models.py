from django.db import models

class Genre(models.Model):
    name = models.CharField(
        max_length=100,
        unique=True
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
        return self.name
    
class Movie(models.Model):
    STATUS_CHOICES = (
        ('coming_soon', 'Coming Soon'),
        ('now_showing', 'Now Showing'),
        ('stopped', 'Stopped'),
    )
    title = models.CharField(
        max_length=255
    )
    description = models.TextField()
    duration = models.IntegerField(
        help_text='Duration in minutes'
    )
    release_date = models.DateField()
    trailer_url = models.URLField(
        blank=True,
        null=True
    )
    poster = models.ImageField(
        upload_to='movies/',
        blank=True,
        null=True
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='coming_soon'
    )
    genres = models.ManyToManyField(
        Genre,
        related_name='movies'
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
        return self.title
