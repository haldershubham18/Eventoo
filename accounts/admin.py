from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User  

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display  = ('username', 'email', 'get_full_name', 'role', 'roll_number', 'points_total')
    list_filter   = ('role', 'is_active')
    search_fields = ('username', 'email', 'roll_number')
    fieldsets     = UserAdmin.fieldsets + (
        ('Eventoo Info', {'fields': ('role', 'roll_number', 'phone', 'points_total')}),
    )