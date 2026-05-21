from django.urls import path
from .views import (
    login_api,
    register,
    profile,
    update_profile,
    list_users,
    delete_user
)

urlpatterns = [
    path('login/',login_api, name='login'),
    path('register/', register),
    path('profile/', profile),
    path('profile/update/', update_profile),

    path('list/', list_users),
    path('<int:pk>/delete/', delete_user),
]
