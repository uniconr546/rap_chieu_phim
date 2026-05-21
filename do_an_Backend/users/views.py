from django.shortcuts import render

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import RegisterSerializer, UserSerializer

## LOGIN API AN TOÀN
@api_view(['POST'])
def login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # Hàm authenticate sẽ tự động "thử chìa khóa" với ổ khóa đã mã hóa trong Database
    user = authenticate(username=username, password=password)

    if user is not None:
        # Mật khẩu đúng -> Tạo Token
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'role': getattr(user, 'role', 'user'), # Gửi kèm chức vụ về cho Frontend biết
            'message': 'Đăng nhập thành công!'
        })
    else:
        # Mật khẩu sai hoặc tài khoản không tồn tại -> Đuổi về!
        return Response({"error": "Sai tài khoản hoặc mật khẩu!"}, status=401)

##REGISTER API
@api_view(['POST'])
def register(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Đăng ký thành công"})

    return Response(serializer.errors, status=400)
##PROFILE API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):

    serializer = UserSerializer(request.user)

    return Response(serializer.data)
##UPDATE PROFILE
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):

    user = request.user

    user.email = request.data.get('email', user.email)
    user.phone = request.data.get('phone', user.phone)

    user.save()

    return Response({"message": "Cập nhật thành công"})
##GET ALL USERS (ADMIN ONLY)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_users(request):

    if request.user.role != 'admin':
        return Response({"error": "Không có quyền"}, status=403)

    users = User.objects.all()
    serializer = UserSerializer(users, many=True)

    return Response(serializer.data)
##DELETE USER (ADMIN)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, pk):

    if request.user.role != 'admin':
        return Response({"error": "Không có quyền"}, status=403)

    try:
        user = User.objects.get(id=pk)
        user.delete()
        return Response({"message": "Xóa user thành công"})
    except User.DoesNotExist:
        return Response({"error": "Không tìm thấy user"}, status=404)
