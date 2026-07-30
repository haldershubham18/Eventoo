from django.urls import path

from .views import MyRegistrationsView, RegisterForEventView

urlpatterns = [
    path('', RegisterForEventView.as_view(), name='register-for-event'),
    path('mine/', MyRegistrationsView.as_view(), name='my-registrations'),
]
