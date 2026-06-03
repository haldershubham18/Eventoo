from django.db import models
from django.conf import settings
class Attendance(models.Model):
    registration = models.OneToOneField(
        'registrations.Registration',
        on_delete=models.CASCADE,
        related_name='attendance'
    )
    scanned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attended: {self.registration}"


class PointsLog(models.Model):
    student      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='points_log')
    event        = models.ForeignKey('events.Event', on_delete=models.CASCADE)
    points_earned = models.IntegerField()
    reason       = models.CharField(max_length=200)
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.username} +{self.points_earned} pts ({self.event.title})"

    class Meta:
        ordering = ['-created_at']
