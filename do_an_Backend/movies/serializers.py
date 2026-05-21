from rest_framework import serializers
from .models import Movie, Genre


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = '__all__'


class MovieSerializer(serializers.ModelSerializer):

    genres = GenreSerializer(
        many=True,
        read_only=True
    )

    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        many=True,
        write_only=True,
        source='genres',
        required=False
    )

    poster = serializers.ImageField(
        required=False,
        allow_null=True
    )

    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'description',
            'duration',
            'release_date',
            'trailer_url',
            'poster',
            'status',
            'genres',
            'genre_ids',
            'created_at',
            'updated_at'
        ]

    def create(self, validated_data):

        genres = validated_data.pop(
            'genres',
            []
        )

        movie = Movie.objects.create(
            **validated_data
        )

        if genres:
            movie.genres.set(genres)

        return movie

    def update(self, instance, validated_data):

        genres = validated_data.pop(
            'genres',
            None
        )

        for attr, value in validated_data.items():
            setattr(
                instance,
                attr,
                value
            )

        instance.save()

        if genres is not None:
            instance.genres.set(genres)

        return instance