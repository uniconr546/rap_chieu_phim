from django.urls import path
from .views import (
    create_payment,
    payment_success,
    payment_failed,
    payment_detail
)

urlpatterns = [
    path('create/', create_payment),
    path('success/', payment_success),
    path('failed/', payment_failed),
    path('<int:booking_id>/', payment_detail),
]