from django.db import models
from business.models import BusinessProfile

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    event_date = models.DateTimeField()
    location = models.CharField(max_length=255, help_text="Physical location or Virtual Link")
    is_virtual = models.BooleanField(default=False)
    capacity = models.IntegerField(null=True, blank=True, help_text="Leave blank for unlimited")
    image_banner = models.CharField(max_length=255, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class EventRegistration(models.Model):
    STATUS_CHOICES = (
        ('going', 'Going'),
        ('cancelled', 'Cancelled'),
    )

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registrations')
    business = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE, related_name='event_registrations')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='going')
    registration_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['event', 'business']

    def __str__(self):
        return f"{self.business.company_name} - {self.event.title}"
