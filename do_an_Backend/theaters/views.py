from django.shortcuts import render

from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework.response import Response

from .models import (
    Theater,
    Room,
    Seat,
    Showtime
)

from .serializers import (
    TheaterSerializer,
    RoomSerializer,
    SeatSerializer,
    ShowtimeSerializer
)

from bookings.models import BookingSeat


# =========================================
# THEATER API
# =========================================
@api_view(['GET', 'POST'])
def theaters(request):

    # GET ALL THEATERS
    if request.method == 'GET':

        data = Theater.objects.all()

        serializer = TheaterSerializer(
            data,
            many=True
        )

        return Response(serializer.data)

    # CREATE THEATER
    serializer = TheaterSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=201
        )

    return Response(
        serializer.errors,
        status=400
    )


# =========================================
# THEATER DETAIL
# =========================================
@api_view(['GET'])
def theater_detail(request, pk):

    try:

        theater = Theater.objects.get(id=pk)

        serializer = TheaterSerializer(
            theater
        )

        return Response(serializer.data)

    except Theater.DoesNotExist:

        return Response({
            "error": "Không tìm thấy rạp"
        }, status=404)


# =========================================
# ROOM API
# =========================================
@api_view(['GET', 'POST'])
def rooms(request):

    # GET ALL ROOMS
    if request.method == 'GET':

        data = Room.objects.all()

        theater_id = request.GET.get(
            'theater_id'
        )

        # FILTER THEATER
        if theater_id:

            data = data.filter(
                theater_id=theater_id
            )

        serializer = RoomSerializer(
            data,
            many=True
        )

        return Response(serializer.data)

@api_view(['POST'])
def create_room(request):

    serializer = RoomSerializer(data=request.data)

    if serializer.is_valid():

        room = serializer.save()

        # AUTO CREATE SEATS
        for r in range(room.rows):

            for c in range(1, room.cols + 1):

                seat_type = 'normal'

                # VIP ROW
                if chr(65 + r) == 'C':
                    seat_type = 'vip'

                # SWEETBOX ROW
                if chr(65 + r) == 'D':
                    seat_type = 'sweetbox'

                Seat.objects.create(
                    room=room,
                    row_name=chr(65 + r),
                    seat_number=c,
                    seat_type=seat_type
                )

        return Response(serializer.data)

    return Response(serializer.errors, status=400)

@api_view(['GET'])
def room_seats(request, room_id):

    showtime_id = request.GET.get('showtime_id')

    seats = Seat.objects.filter(room_id=room_id)

    booked_seat_ids = []

    # Lấy danh sách ghế đã đặt
    if showtime_id:

        booked_seat_ids = BookingSeat.objects.filter(
            showtime_id=showtime_id
        ).values_list('seat_id', flat=True)

    data = []

    for seat in seats:

        data.append({
            "id": seat.id,
            "row_name": seat.row_name,
            "seat_number": seat.seat_number,
            "seat_type": seat.seat_type,

            # thêm trạng thái ghế
            "is_booked": seat.id in booked_seat_ids
        })

    return Response(data)

# =========================================
# ROOM DETAIL
# =========================================
@api_view(['GET'])
def room_detail(request, pk):

    try:

        room = Room.objects.get(id=pk)

        serializer = RoomSerializer(
            room
        )

        return Response(serializer.data)

    except Room.DoesNotExist:

        return Response({
            "error": "Không tìm thấy phòng"
        }, status=404)


# =========================================
# SEAT GENERATOR
# =========================================
@api_view(['POST'])
@permission_classes([
    IsAuthenticated
])
def generate_seats(request):

    room_id = request.data.get(
        'room_id'
    )

    try:

        room = Room.objects.get(
            id=room_id
        )

    except Room.DoesNotExist:

        return Response({
            "error": "Room không tồn tại"
        }, status=404)

    seats = []

    for r in range(room.rows):

        for c in range(1, room.cols + 1):

            seat = Seat.objects.create(

                room=room,

                row_name=chr(65 + r),

                seat_number=c,

                seat_type='normal'

            )

            seats.append(seat.id)

    return Response({

        "message": "Tạo ghế thành công",

        "total": len(seats)

    })


# =========================================
# SEAT LIST
# =========================================
@api_view(['GET'])
def seats(request):

    data = Seat.objects.all()

    room_id = request.GET.get(
        'room_id'
    )

    if room_id:

        data = data.filter(
            room_id=room_id
        )

    serializer = SeatSerializer(
        data,
        many=True
    )

    return Response(
        serializer.data
    )


# =========================================
# SHOWTIME API
# =========================================
@api_view(['GET', 'POST'])
def showtimes(request):

    # =====================================
    # GET SHOWTIMES
    # =====================================
    if request.method == 'GET':

        data = Showtime.objects.all().order_by(
            'start_time'
        )

        movie_id = request.GET.get(
            'movie_id'
        )

        room_id = request.GET.get(
            'room_id'
        )

        theater_id = request.GET.get(
            'theater_id'
        )

        date = request.GET.get(
            'date'
        )

        # FILTER MOVIE
        if movie_id:

            data = data.filter(
                movie_id=movie_id
            )

        # FILTER ROOM
        if room_id:

            data = data.filter(
                room_id=room_id
            )

        # FILTER THEATER
        if theater_id:

            data = data.filter(
                room__theater_id=theater_id
            )

        # FILTER DATE
        if date:

            data = data.filter(
                start_time__date=date
            )

        serializer = ShowtimeSerializer(
            data,
            many=True
        )

        return Response(
            serializer.data
        )

    # =====================================
    # CREATE SHOWTIME
    # =====================================
    serializer = ShowtimeSerializer(
        data=request.data
    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data,
            status=201
        )

    return Response(
        serializer.errors,
        status=400
    )


# =========================================
# SHOWTIME DETAIL
# =========================================
@api_view(['GET'])
def showtime_detail(request, pk):

    try:

        showtime = Showtime.objects.get(
            id=pk
        )

        serializer = ShowtimeSerializer(
            showtime
        )

        return Response(
            serializer.data
        )

    except Showtime.DoesNotExist:

        return Response({
            "error": "Không tìm thấy suất chiếu"
        }, status=404)
    

# =========================================
# DELETE SHOWTIME
# =========================================
@api_view(['DELETE'])
def delete_showtime(request, pk):

    try:
        showtime = Showtime.objects.get(id=pk)
        showtime.delete()

        return Response({
            "message": "Xóa suất chiếu thành công"
        }, status=200)

    except Showtime.DoesNotExist:
        return Response({
            "error": "Không tìm thấy suất chiếu"
        }, status=404)
    
# =========================================
# UPDATE SHOWTIME
# =========================================
@api_view(['PUT', 'PATCH'])
def update_showtime(request, pk):

    try:
        showtime = Showtime.objects.get(id=pk)

    except Showtime.DoesNotExist:
        return Response({
            "error": "Không tìm thấy suất chiếu"
        }, status=404)

    # PUT = update full, PATCH = update partial
    serializer = ShowtimeSerializer(
        showtime,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()

        return Response({
            "message": "Cập nhật suất chiếu thành công",
            "data": serializer.data
        }, status=200)

    return Response(serializer.errors, status=400)