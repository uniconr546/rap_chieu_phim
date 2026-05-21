from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Theater,
    Room
)

from .serializers import (
    TheaterSerializer,
    RoomSerializer
)


@api_view(['GET'])
def theater_list(request):

    theaters = Theater.objects.all()

    serializer = TheaterSerializer(

        theaters,

        many=True

    )

    return Response(
        serializer.data
    )


@api_view(['GET'])
def room_list(request):

    rooms = Room.objects.all()

    serializer = RoomSerializer(

        rooms,

        many=True

    )

    return Response(
        serializer.data
    )