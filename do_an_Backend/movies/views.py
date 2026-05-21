from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Movie, Genre
from .serializers import MovieSerializer, GenreSerializer


# =====================
# GET ALL MOVIES
# =====================

@api_view(['GET'])
def movie_list(request):

    movies = Movie.objects.all().order_by('-id')

    search = request.GET.get('search')

    if search:
        movies = movies.filter(
            title__icontains=search
        )

    movie_status = request.GET.get('status')

    if movie_status:
        movies = movies.filter(
            status=movie_status
        )

    genre = request.GET.get('genre')

    if genre:
        movies = movies.filter(
            genres__id=genre
        )

    serializer = MovieSerializer(
        movies,
        many=True,
        context={
            'request': request
        }
    )

    return Response(serializer.data)


# =====================
# DETAIL
# =====================

@api_view(['GET'])
def movie_detail(request, pk):

    try:

        movie = Movie.objects.get(
            id=pk
        )

        serializer = MovieSerializer(
            movie,
            context={
                'request': request
            }
        )

        return Response(serializer.data)

    except Movie.DoesNotExist:

        return Response(
            {
                "error":
                "Không tìm thấy phim"
            },
            status=404
        )


# =====================
# CREATE MOVIE
# =====================

@api_view(['POST'])
@permission_classes([IsAuthenticated])

def movie_create(request):

    if request.user.role != 'admin':

        return Response(
            {
                "error":
                "Không có quyền"
            },
            status=403
        )

    serializer = MovieSerializer(

        data=request.data,

        context={
            'request': request
        }

    )

    if serializer.is_valid():

        movie = serializer.save()

        return Response(

            MovieSerializer(
                movie,
                context={
                    'request': request
                }
            ).data,

            status=201

        )

    print(serializer.errors)

    return Response(

        serializer.errors,

        status=400

    )


# =====================
# UPDATE
# =====================

@api_view(['PUT'])

@permission_classes([IsAuthenticated])

def movie_update(
    request,
    pk
):

    try:

        movie = Movie.objects.get(
            id=pk
        )

    except Movie.DoesNotExist:

        return Response(
            {
                "error":
                "Không tìm thấy phim"
            },
            status=404
        )

    if request.user.role != 'admin':

        return Response(
            {
                "error":
                "Không có quyền"
            },
            status=403
        )

    serializer = MovieSerializer(

        movie,

        data=request.data,

        partial=True,

        context={
            'request': request
        }

    )

    if serializer.is_valid():

        serializer.save()

        return Response(
            serializer.data
        )

    return Response(
        serializer.errors,
        status=400
    )


# =====================
# DELETE
# =====================

@api_view(['DELETE'])

@permission_classes([IsAuthenticated])

def movie_delete(
    request,
    pk
):

    try:

        movie = Movie.objects.get(
            id=pk
        )

    except Movie.DoesNotExist:

        return Response(
            {
                "error":
                "Không tìm thấy"
            },
            status=404
        )

    if request.user.role != 'admin':

        return Response(
            {
                "error":
                "Không có quyền"
            },
            status=403
        )

    movie.delete()

    return Response(
        {
            "message":
            "Đã xóa"
        }
    )