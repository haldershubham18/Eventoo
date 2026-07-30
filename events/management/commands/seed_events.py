from datetime import date, datetime, time, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from events.models import Club, Event


class Command(BaseCommand):
    help = 'Seed test clubs and events.'

    def handle(self, *args, **options):
        User = get_user_model()

        organizer, created = User.objects.get_or_create(
            username='eventoo.organizer',
            defaults={
                'email': 'organizer@example.com',
                'first_name': 'Eventoo',
                'last_name': 'Organizer',
                'role': 'organizer',
            },
        )
        if created:
            organizer.set_password('ChangeMe123!')
            organizer.save(update_fields=['password'])
        elif organizer.role != 'organizer':
            organizer.role = 'organizer'
            organizer.save(update_fields=['role'])

        club_specs = [
            {
                'name': 'Eventoo Tech Club',
                'description': 'A community for hands-on developers and builders.',
            },
            {
                'name': 'Eventoo Culture Club',
                'description': 'Celebrating music, arts, and campus creativity.',
            },
        ]
        clubs = []
        for spec in club_specs:
            club, _ = Club.objects.update_or_create(
                name=spec['name'],
                defaults={
                    'description': spec['description'],
                    'organizer': organizer,
                },
            )
            clubs.append(club)

        now = timezone.now()
        event_specs = [
            {
                'title': 'Hack the Campus',
                'description': 'A fast-paced build challenge for web and mobile ideas.',
                'club': clubs[0],
                'date': (now + timedelta(days=14)).date(),
                'time': time(10, 0),
                'venue': 'Innovation Lab',
                'capacity': 80,
                'fee': '0.00',
                'category': 'technical',
                'points_value': 25,
                'is_active': True,
                'allow_team': True,
                'max_team_size': 4,
                'registration_deadline': now + timedelta(days=12),
            },
            {
                'title': 'Rhythm Night',
                'description': 'An evening of live music, dance, and open mic performances.',
                'club': clubs[1],
                'date': (now + timedelta(days=18)).date(),
                'time': time(18, 30),
                'venue': 'Main Auditorium',
                'capacity': 250,
                'fee': '150.00',
                'category': 'cultural',
                'points_value': 15,
                'is_active': True,
                'allow_team': False,
                'max_team_size': 1,
                'registration_deadline': now + timedelta(days=15),
            },
            {
                'title': 'Campus Cup 5K',
                'description': 'A friendly run across campus trails and landmarks.',
                'club': clubs[0],
                'date': (now + timedelta(days=21)).date(),
                'time': time(7, 0),
                'venue': 'Sports Complex',
                'capacity': 120,
                'fee': '50.00',
                'category': 'sports',
                'points_value': 20,
                'is_active': True,
                'allow_team': True,
                'max_team_size': 5,
                'registration_deadline': now + timedelta(days=19),
            },
            {
                'title': 'Design Thinking Workshop',
                'description': 'Practical workshop on turning ideas into prototypes.',
                'club': clubs[1],
                'date': (now + timedelta(days=24)).date(),
                'time': time(14, 0),
                'venue': 'Seminar Hall B',
                'capacity': 60,
                'fee': '0.00',
                'category': 'workshop',
                'points_value': 30,
                'is_active': True,
                'allow_team': False,
                'max_team_size': 1,
                'registration_deadline': now + timedelta(days=22),
            },
            {
                'title': 'Future of AI Seminar',
                'description': 'Industry talk on emerging AI tools and responsible adoption.',
                'club': clubs[0],
                'date': (now + timedelta(days=28)).date(),
                'time': time(11, 0),
                'venue': 'Conference Room 2',
                'capacity': 100,
                'fee': '100.00',
                'category': 'seminar',
                'points_value': 18,
                'is_active': True,
                'allow_team': False,
                'max_team_size': 1,
                'registration_deadline': now + timedelta(days=26),
            },
        ]

        created_count = 0
        for spec in event_specs:
            event, created = Event.objects.update_or_create(
                title=spec['title'],
                defaults=spec,
            )
            created_count += int(created)

        self.stdout.write(self.style.SUCCESS(
            f'Seed complete: 1 organizer, {len(clubs)} clubs, {len(event_specs)} events ready.'
        ))
