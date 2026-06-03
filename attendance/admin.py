from django.contrib import admin

from .models import Attendance, PointsLog

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display  = ('registration', 'scanned_at')
    search_fields = ('registration__lead_student__username',)

@admin.register(PointsLog)
class PointsLogAdmin(admin.ModelAdmin):
    list_display = ('student', 'event', 'points_earned', 'reason', 'created_at')
    list_filter  = ('event',)
