from django.db import transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from events.models import Event

from .models import Registration, TeamMember
from .serializers import RegistrationCreateSerializer, RegistrationDetailSerializer


class RegisterForEventView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = RegistrationCreateSerializer(data=request.data)
        if not serializer.is_valid():
            event_error = serializer.errors.get('event')
            if event_error:
                message = event_error[0]
                if message == 'Event not found.':
                    return Response({'message': message}, status=status.HTTP_404_NOT_FOUND)
                return Response({'message': message}, status=status.HTTP_400_BAD_REQUEST)
            message = serializer.errors.get('message')
            if message:
                return Response({'message': message[0]}, status=status.HTTP_400_BAD_REQUEST)
            first_error = next(iter(serializer.errors.values()), ['Invalid data.'])[0]
            return Response({'message': first_error}, status=status.HTTP_400_BAD_REQUEST)

        event = serializer.validated_data['event']
        lead_student = request.user
        now = timezone.now()

        if event.registration_deadline < now:
            return Response({'message': 'Registration deadline has passed.'}, status=status.HTTP_400_BAD_REQUEST)

        if Registration.objects.filter(event=event, lead_student=lead_student).exists():
            return Response({'message': 'You are already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)

        current_count = Registration.objects.filter(event=event).count()
        if current_count >= event.capacity:
            return Response({'message': 'This event is full.'}, status=status.HTTP_400_BAD_REQUEST)

        team_name = serializer.validated_data.get('team_name', '')
        is_team = serializer.validated_data.get('is_team', False)
        team_members = serializer.validated_data.get('team_members', [])

        with transaction.atomic():
            registration = Registration.objects.create(
                event=event,
                lead_student=lead_student,
                team_name=team_name,
                is_team=is_team,
            )

            if is_team:
                for member_data in team_members:
                    TeamMember.objects.create(registration=registration, **member_data)

        detail = RegistrationDetailSerializer(registration)
        return Response(detail.data, status=status.HTTP_201_CREATED)


class MyRegistrationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        registrations = Registration.objects.filter(
            lead_student=request.user
        ).select_related('event', 'lead_student').prefetch_related('team_members').order_by('-created_at')
        serializer = RegistrationDetailSerializer(registrations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Create your views here.
