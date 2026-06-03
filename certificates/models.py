from django.db import models

class Certificate(models.Model):
    registration = models.OneToOneField(
        'registrations.Registration',
        on_delete=models.CASCADE,
        related_name='certificate'
    )
    issued_at = models.DateTimeField(auto_now_add=True)
    pdf_file  = models.FileField(upload_to='certificates/', blank=True)

    def __str__(self):
        return f"Certificate — {self.registration}"

