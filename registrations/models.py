import uuid
from django.db import models
from django.conf import settings
class Registration(models.Model):
    PAYMENT_STATUS = [
        ('pending',  'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]
    # UUID as primary key → becomes the QR code data
    id                = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event             = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='registrations')
    lead_student      = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='registrations')
    team_name         = models.CharField(max_length=100, blank=True)
    is_team           = models.BooleanField(default=False)
    payment_screenshot = models.ImageField(upload_to='payment_proofs/', blank=True)
    payment_status    = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    qr_code           = models.ImageField(upload_to='qr_codes/', blank=True)
    created_at        = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.lead_student.get_full_name()} → {self.event.title}"

    class Meta:
        unique_together = ['event', 'lead_student']  # one registration per student per event


class TeamMember(models.Model):
    registration = models.ForeignKey(Registration, on_delete=models.CASCADE, related_name='team_members')
    name         = models.CharField(max_length=100)
    roll_number  = models.CharField(max_length=20)
    email        = models.EmailField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.registration.event.title})"

