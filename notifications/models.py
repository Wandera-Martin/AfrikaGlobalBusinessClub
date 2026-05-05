from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from business.models import BusinessProfile

class Notification(models.Model):
    NOTIFICATION_TYPES = (
        ('LIKE', 'Like'),
        ('COMMENT', 'Comment'),
        ('APPLY', 'Application'),
        ('MESSAGE', 'Message'),
        ('SYSTEM', 'System'),
    )

    recipient = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE, related_name='notifications')
    actor = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE, related_name='notifications_triggered', null=True, blank=True)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    
    # Generic relation to the specific object (Post, Comment, Message, OpportunityApplication)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')
    
    message = models.CharField(max_length=255)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.recipient.company_name}: {self.message}"
