from django.contrib import admin

from .models import Certificate

@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display  = ('registration', 'issued_at')
    search_fields = ('registration__lead_student__username',)

