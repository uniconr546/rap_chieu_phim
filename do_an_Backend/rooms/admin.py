from django.contrib import admin

from .models import (
    Theater,
    Room
)

admin.site.register(
    Theater
)

admin.site.register(
    Room
)