from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.db import transaction
from django.utils import timezone
import uuid

from .models import Payment
from bookings.models import Booking

##CREATE PAYMENT
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment(request):

    booking_id = request.data.get('booking_id')
    payment_method = request.data.get('payment_method', 'momo')

    try:
        with transaction.atomic():

            booking = Booking.objects.select_for_update().get(
                id=booking_id,
                user=request.user
            )

            # ❌ không cho thanh toán lại
            if hasattr(booking, 'payment') and booking.payment.payment_status == 'success':
                return Response({"error": "Booking đã thanh toán"}, status=400)

            # ❌ không cho tạo nhiều payment
            payment, created = Payment.objects.get_or_create(
                booking=booking,
                defaults={
                    "amount": booking.total_price,
                    "payment_method": payment_method,
                    "payment_status": "pending",
                    "transaction_code": str(uuid.uuid4())[:12]
                }
            )

            return Response({
                "message": "Tạo payment thành công",
                "payment_id": payment.id,
                "amount": payment.amount,
                "status": payment.payment_status,
                "transaction_code": payment.transaction_code
            })

    except Booking.DoesNotExist:
        return Response({"error": "Booking không tồn tại"}, status=404)
    
##SIMULATE PAYMENT SUCCESS
@api_view(['POST'])
def payment_success(request):

    transaction_code = request.data.get('transaction_code')

    try:
        with transaction.atomic():

            payment = Payment.objects.select_for_update().get(
                transaction_code=transaction_code
            )

            if payment.payment_status == 'success':
                return Response({"message": "Đã thanh toán trước đó"})

            payment.payment_status = 'success'
            payment.paid_at = timezone.now()
            payment.save()

            # update booking
            booking = payment.booking
            booking.status = 'paid'
            booking.save()

            return Response({
                "message": "Thanh toán thành công",
                "booking_code": booking.booking_code,
                "amount": payment.amount
            })

    except Payment.DoesNotExist:
        return Response({"error": "Transaction không hợp lệ"}, status=404)

##PAYMENT FAILED
@api_view(['POST'])
def payment_failed(request):

    transaction_code = request.data.get('transaction_code')

    try:
        payment = Payment.objects.get(transaction_code=transaction_code)

        payment.payment_status = 'failed'
        payment.save()

        return Response({"message": "Thanh toán thất bại"})

    except Payment.DoesNotExist:
        return Response({"error": "Không tìm thấy payment"}, status=404)
    
##GET PAYMENT INFO
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payment_detail(request, booking_id):

    try:
        payment = Payment.objects.get(booking_id=booking_id)

        return Response({
            "booking_code": payment.booking.booking_code,
            "amount": payment.amount,
            "status": payment.payment_status,
            "method": payment.payment_method,
            "transaction_code": payment.transaction_code,
            "paid_at": payment.paid_at
        })

    except Payment.DoesNotExist:
        return Response({"error": "Payment không tồn tại"}, status=404)

