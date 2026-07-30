from rest_framework import generics

from .models import Club, Event
from .serializers import ClubSerializer, EventSerializer


class EventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.filter(is_active=True).select_related('club').order_by('date', 'time')


class EventDetailView(generics.RetrieveAPIView):
    serializer_class = EventSerializer
    queryset = Event.objects.select_related('club').all()


class ClubListView(generics.ListAPIView):
    serializer_class = ClubSerializer
    queryset = Club.objects.select_related('organizer').all().order_by('name')

# Create your views here.
