from rest_framework import serializers

from accounts.models import User
from events.models import Event

from .models import Registration, TeamMember


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = ['name', 'roll_number', 'email']


class RegistrationCreateSerializer(serializers.Serializer):
    event = serializers.IntegerField()
    team_name = serializers.CharField(required=False, allow_blank=True, default='')
    is_team = serializers.BooleanField(required=False, default=False)
    team_members = TeamMemberSerializer(many=True, required=False, default=list)

    def validate_event(self, value):
        event = Event.objects.filter(pk=value, is_active=True).first()
        if event is None:
            raise serializers.ValidationError('Event not found.')
        return event

    def validate(self, attrs):
        event = attrs['event']
        is_team = attrs.get('is_team', False)
        team_members = attrs.get('team_members', [])

        if is_team and not event.allow_team:
            raise serializers.ValidationError({'message': 'This event does not support team registration.'})

        if is_team and len(team_members) > event.max_team_size:
            raise serializers.ValidationError({'message': 'Team size exceeds the maximum allowed.'})

        return attrs


class EventMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title']


class LeadStudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name']

    def get_name(self, obj):
        return obj.get_full_name().strip() or obj.username


class RegistrationDetailSerializer(serializers.ModelSerializer):
    event = EventMiniSerializer(read_only=True)
    lead_student = LeadStudentSerializer(read_only=True)
    team_members = TeamMemberSerializer(many=True, read_only=True)

    class Meta:
        model = Registration
        fields = [
            'id',
            'event',
            'lead_student',
            'team_name',
            'is_team',
            'payment_status',
            'team_members',
            'created_at',
        ]
