from django.urls import path
from .views import (
    movie_list,
    movie_detail,
    movie_create,
    movie_update,
    movie_delete
)

urlpatterns = [
    path('', movie_list),
    path('<int:pk>/', movie_detail),
    path('create/', movie_create),
    path('<int:pk>/update/', movie_update),
    path('<int:pk>/delete/', movie_delete),
]