from django.db import models

from django.conf import settings


class Club(models.Model):
    name        = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    organizer   = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='clubs')
    logo        = models.ImageField(upload_to='club_logos/', blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Event(models.Model):
    CATEGORY_CHOICES = [
        ('technical', 'Technical'),
        ('cultural',  'Cultural'),
        ('sports',    'Sports'),
        ('workshop',  'Workshop'),
        ('seminar',   'Seminar'),
        ('other',     'Other'),
    ]
    title                 = models.CharField(max_length=200)
    description           = models.TextField()
    club                  = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='events')
    date                  = models.DateField()
    time                  = models.TimeField()
    venue                 = models.CharField(max_length=200)
    capacity              = models.IntegerField()
    fee                   = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    category              = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    banner                = models.ImageField(upload_to='event_banners/', blank=True)
    points_value          = models.IntegerField(default=10)  # points awarded on attendance
    is_active             = models.BooleanField(default=True)
    allow_team            = models.BooleanField(default=False)
    max_team_size         = models.IntegerField(default=1)
    registration_deadline = models.DateTimeField()
    created_at            = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    @property
    def is_free(self):
        return self.fee == 0

    class Meta:
        ordering = ['date', 'time']


class Review(models.Model):
    event      = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews')
    student    = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating     = models.IntegerField(choices=[(i, f'{i} star') for i in range(1, 6)])
    comment    = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['event', 'student']  # one review per student per event

    def __str__(self):
        return f"{self.student} rated {self.event} — {self.rating}/5"

