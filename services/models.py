from django.db import models
from business.models import BusinessProfile

class Service(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price_range = models.CharField(max_length=100, blank=True)
    icon = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ServiceApplication(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    )

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='applications')
    business = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE, related_name='service_applications')
    project_requirements = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.business.company_name} - {self.service.title}"
