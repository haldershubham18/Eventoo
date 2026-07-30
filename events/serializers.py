from rest_framework import serializers

from accounts.models import User

from .models import Club, Event


class OrganizerSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name']

    def get_name(self, obj):
        return obj.get_full_name().strip() or obj.username


class ClubSerializer(serializers.ModelSerializer):
    organizer = OrganizerSerializer(read_only=True)

    class Meta:
        model = Club
        fields = ['id', 'name', 'description', 'logo', 'organizer']


class EventSerializer(serializers.ModelSerializer):
    club = serializers.SerializerMethodField()
    is_free = serializers.ReadOnlyField()

    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'club',
            'date',
            'time',
            'venue',
            'capacity',
            'fee',
            'category',
            'banner',
            'points_value',
            'is_active',
            'allow_team',
            'max_team_size',
            'registration_deadline',
            'created_at',
            'is_free',
        ]

    def get_club(self, obj):
        return {
            'id': obj.club_id,
            'name': obj.club.name,
        }
