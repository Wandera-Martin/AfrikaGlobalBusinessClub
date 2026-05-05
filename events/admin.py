from django.contrib import admin
from .models import Event, EventRegistration

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_date', 'location', 'is_virtual', 'is_active')
    list_filter = ('is_virtual', 'is_active', 'event_date')
    search_fields = ('title', 'description')

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = ('event', 'business', 'status', 'registration_date')
    list_filter = ('status', 'event')
    search_fields = ('business__company_name', 'event__title')
