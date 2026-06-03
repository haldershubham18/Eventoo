from django.contrib import admin

from .models import Registration, TeamMember

class TeamMemberInline(admin.TabularInline):
    model  = TeamMember
    extra  = 0

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display   = ('lead_student', 'event', 'payment_status', 'is_team', 'created_at')
    list_filter    = ('payment_status', 'is_team')
    search_fields  = ('lead_student__username', 'event__title')
    readonly_fields = ('id', 'qr_code', 'created_at')
    inlines        = [TeamMemberInline]
    # Quick action to verify payment
    actions        = ['verify_payment', 'reject_payment']

    def verify_payment(self, request, queryset):
        queryset.update(payment_status='verified')
        self.message_user(request, f"{queryset.count()} payment(s) verified.")
    verify_payment.short_description = "Mark selected as Payment Verified"

    def reject_payment(self, request, queryset):
        queryset.update(payment_status='rejected')
        self.message_user(request, f"{queryset.count()} payment(s) rejected.")
    reject_payment.short_description = "Mark selected as Payment Rejected"
