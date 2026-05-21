from rest_framework import serializers

from .models import (
    Theater,
    Room
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