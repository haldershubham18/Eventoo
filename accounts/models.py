from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    ROLE_CHOICES = [
        ('student',   'Student'),
        ('organizer', 'Organizer'),
        ('admin',     'Admin'),
    ]
    role         = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')
    roll_number  = models.CharField(max_length=20, blank=True)
    phone        = models.CharField(max_length=15, blank=True)
    points_total = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.get_full_name()} ({self.username})"

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

