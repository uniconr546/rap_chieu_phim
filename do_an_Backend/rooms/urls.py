from django.urls import path

from .views import (
    theater_list,
    room_list
)

urlpatterns = [

    path(
        'theaters/',
        theater_list
    ),

    path(
        'rooms/',
        room_list
    ),

]