from rest_framework import serializers
from .models import User

## REGISTER
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'phone']

    def create(self, validated_data):
        # Hàm create_user sẽ tự động mã hóa (hash) mật khẩu an toàn tuyệt đối
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            phone=validated_data.get('phone', ''),
            password=validated_data['password']
        )
        
        # BẢO MẬT: Ép buộc tất cả tài khoản tự đăng ký trên web đều chỉ là 'user' thường
        user.role = 'user'
        user.save()

        return user
    
## USER INFO
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role']