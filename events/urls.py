from django.urls import path

from .views import ClubListView, EventDetailView, EventListView

urlpatterns = [
    path('', EventListView.as_view(), name='event-list'),
    path('<int:pk>/', EventDetailView.as_view(), name='event-detail'),
    path('clubs/', ClubListView.as_view(), name='club-list'),
]
