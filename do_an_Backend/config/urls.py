from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [

    # =====================================
    # DJANGO ADMIN
    # =====================================
    path(
        'admin/',
        admin.site.urls
    ),

    # =====================================
    # AUTH
    # =====================================
    path(
        'api/auth/login/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'
    ),

    path(
        'api/auth/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),

    path(
        'api/auth/',
        include('users.urls')
    ),

    # =====================================
    # USERS
    # =====================================
    path(
        'api/users/',
        include('users.urls')
    ),

    # =====================================
    # MOVIES
    # =====================================
    path(
        'api/movies/',
        include('movies.urls')
    ),

    # =====================================
    # THEATERS + ROOMS + SEATS + SHOWTIMES
    # =====================================
    path(
        'api/',
        include('theaters.urls')
    ),

    # =====================================
    # BOOKINGS
    # =====================================
    path(
        'api/bookings/',
        include('bookings.urls')
    ),

    # =====================================
    # CONCESSIONS
    # =====================================
    path(
        'api/concessions/',
        include('concessions.urls')
    ),

    path(
    'api/promotions/',
    include('promotions.urls')
),

]

# =====================================
# MEDIA FILES
# =====================================
if settings.DEBUG:

    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )