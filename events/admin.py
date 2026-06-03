from django.contrib import admin

from .models import Club, Event, Review

@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display  = ('name', 'organizer', 'created_at')
    search_fields = ('name',)

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display  = ('title', 'club', 'date', 'venue', 'fee', 'is_active', 'category')
    list_filter   = ('category', 'is_active', 'allow_team')
    search_fields = ('title', 'venue')
    date_hierarchy = 'date'

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('event', 'student', 'rating', 'created_at')
    list_filter  = ('rating',)