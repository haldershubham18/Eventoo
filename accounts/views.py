from django.contrib.auth import authenticate, get_user_model
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, SignUpSerializer

User = get_user_model()


def build_session_payload(user, access_token, refresh_token):
    full_name = user.get_full_name().strip() or user.username
    return {
        'id': user.id,
        'name': full_name,
        'email': user.email,
        'token': access_token,
        'refresh': refresh_token,
    }


class SignUpView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = SignUpSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()), [''])[0]
            return Response({'message': first_error}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        payload = build_session_payload(user, str(refresh.access_token), str(refresh))
        return Response(payload, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()), [''])[0]
            return Response({'message': first_error}, status=status.HTTP_400_BAD_REQUEST)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user = User.objects.filter(email__iexact=email).first()
        if user is None:
            return Response({'message': 'Incorrect email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        authenticated_user = authenticate(request, username=user.username, password=password)
        if authenticated_user is None:
            return Response({'message': 'Incorrect email or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        refresh = RefreshToken.for_user(authenticated_user)
        payload = build_session_payload(authenticated_user, str(refresh.access_token), str(refresh))
        return Response(payload, status=status.HTTP_200_OK)
