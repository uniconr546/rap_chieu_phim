from rest_framework import serializers

from .models import (
    Theater,
    Room,
    Seat,
    Showtime
)


class TheaterSerializer(
    serializers.ModelSerializer
):

    class Meta:

        model = Theater

        fields = '__all__'


class RoomSerializer(
    serializers.ModelSerializer
):

    theater_name = serializers.CharField(

        source='theater.name',

        read_only=True

    )

    class Meta:

        model = Room

        fields = '__all__'


class SeatSerializer(
    serializers.ModelSerializer
):

    room_name = serializers.CharField(

        source='room.name',

        read_only=True

    )

    theater_name = serializers.CharField(

        source='room.theater.name',

        read_only=True

    )

    class Meta:

        model = Seat

        fields = '__all__'


class ShowtimeSerializer(serializers.ModelSerializer):

    movie_title = serializers.CharField(
        source='movie.title',
        read_only=True
    )

    room_name = serializers.CharField(
        source='room.name',
        read_only=True
    )

    theater_name = serializers.CharField(
        source='room.theater.name',
        read_only=True
    )

    theater_address = serializers.CharField(
        source='room.theater.address',
        read_only=True
    )

    class Meta:
        model = Showtime
        fields = '__all__'
