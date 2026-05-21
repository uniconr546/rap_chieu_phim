from rest_framework.decorators import (
    api_view,
    permission_classes
)

from rest_framework.permissions import (
    IsAuthenticated
)

from rest_framework.response import Response
from rest_framework.parsers import (
    MultiPartParser,
    FormParser
)

from .models import Concession
from .serializers import (
    ConcessionSerializer
)


@api_view(['GET'])
def concession_list(request):

    concessions = Concession.objects.filter(
    status='selling'
)

    serializer=ConcessionSerializer(

        concessions,

        many=True,

        context={
            'request':request
        }

    )

    return Response(
        serializer.data
    )


from rest_framework.decorators import (
    api_view,
    permission_classes,
    parser_classes
)

@api_view(['POST'])
@permission_classes([
    IsAuthenticated
])

@parser_classes([
    MultiPartParser,
    FormParser
])

def concession_create(request):

    serializer=ConcessionSerializer(

        data=request.data,

        context={
            'request':request
        }

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


@api_view(['DELETE'])
@permission_classes([
    IsAuthenticated
])

def concession_delete(
    request,
    pk
):

    concession=Concession.objects.get(
        pk=pk
    )

    concession.delete()

    return Response({

        'message':
        'Đã xóa'

    })