from rest_framework.decorators import api_view

from rest_framework.response import Response

from .models import Promotion

from rest_framework import generics

from .serializers import (
    PromotionSerializer
)


@api_view(['GET'])
def promotion_list(request):

    promotions = Promotion.objects.all().order_by(
        '-created_at'
    )

    serializer = PromotionSerializer(
        promotions,
        many=True
    )

    return Response(serializer.data)

class PromotionListView(generics.ListAPIView):
    queryset = Promotion.objects.filter(is_active=True)
    serializer_class = PromotionSerializer