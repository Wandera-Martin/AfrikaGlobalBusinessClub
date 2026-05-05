from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from events.models import Event
from business.models import BusinessProfile
from notifications.models import Notification

@receiver(post_save, sender=Event)
def notify_new_event(sender, instance, created, **kwargs):
    if created:
        verified_businesses = BusinessProfile.objects.filter(is_verified=True)
        content_type = ContentType.objects.get_for_model(Event)
        
        notifications = []
        for business in verified_businesses:
            notifications.append(
                Notification(
                    recipient=business,
                    notification_type='SYSTEM',
                    content_type=content_type,
                    object_id=instance.id,
                    message=f"New Event Published: {instance.title}"
                )
            )
        
        if notifications:
            Notification.objects.bulk_create(notifications)
