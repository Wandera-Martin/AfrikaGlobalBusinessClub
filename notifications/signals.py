from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType

from feed.models import Comment
from opportunities.models import OpportunityApplication
from messaging.models import Message, Conversation
from .models import Notification

@receiver(post_save, sender=Comment)
def notify_new_comment(sender, instance, created, **kwargs):
    if created:
        post = instance.post
        # Don't notify if the user comments on their own post
        if post.business != instance.business:
            Notification.objects.create(
                recipient=post.business,
                actor=instance.business,
                notification_type='COMMENT',
                content_type=ContentType.objects.get_for_model(Comment),
                object_id=instance.id,
                message=f"{instance.business.company_name} commented on your post."
            )

@receiver(post_save, sender=OpportunityApplication)
def notify_new_application(sender, instance, created, **kwargs):
    if created:
        opportunity = instance.opportunity
        Notification.objects.create(
            recipient=opportunity.business,
            actor=instance.applicant,
            notification_type='APPLY',
            content_type=ContentType.objects.get_for_model(OpportunityApplication),
            object_id=instance.id,
            message=f"{instance.applicant.company_name} applied to your trade opportunity."
        )

@receiver(post_save, sender=Message)
def notify_new_message(sender, instance, created, **kwargs):
    if created:
        conversation = instance.conversation
        # Notify all participants except the sender
        participants = conversation.participants.exclude(id=instance.sender.id)
        for participant in participants:
            Notification.objects.create(
                recipient=participant,
                actor=instance.sender,
                notification_type='MESSAGE',
                content_type=ContentType.objects.get_for_model(Message),
                object_id=instance.id,
                message=f"You received a new message from {instance.sender.company_name}."
            )

from opportunities.models import Opportunity
from events.models import Event
from services.models import Service
from business.models import BusinessProfile

@receiver(post_save, sender=Opportunity)
def notify_new_opportunity(sender, instance, created, **kwargs):
    if created:
        content_type = ContentType.objects.get_for_model(Opportunity)
        # Notify all profiles except the creator
        profiles = BusinessProfile.objects.exclude(id=instance.business.id)
        notifications = [
            Notification(
                recipient=profile,
                actor=instance.business,
                notification_type='SYSTEM',
                content_type=content_type,
                object_id=instance.id,
                message=f"New Opportunity: {instance.business.company_name} posted a {instance.get_opportunity_type_display()}."
            ) for profile in profiles
        ]
        Notification.objects.bulk_create(notifications)

@receiver(post_save, sender=Event)
def notify_new_event(sender, instance, created, **kwargs):
    if created:
        content_type = ContentType.objects.get_for_model(Event)
        profiles = BusinessProfile.objects.all()
        notifications = [
            Notification(
                recipient=profile,
                actor=None,
                notification_type='SYSTEM',
                content_type=content_type,
                object_id=instance.id,
                message=f"New Event Added: {instance.title}. Register now!"
            ) for profile in profiles
        ]
        Notification.objects.bulk_create(notifications)

@receiver(post_save, sender=Service)
def notify_new_service(sender, instance, created, **kwargs):
    if created:
        content_type = ContentType.objects.get_for_model(Service)
        profiles = BusinessProfile.objects.all()
        notifications = [
            Notification(
                recipient=profile,
                actor=None,
                notification_type='SYSTEM',
                content_type=content_type,
                object_id=instance.id,
                message=f"New Service Available: {instance.title}."
            ) for profile in profiles
        ]
        Notification.objects.bulk_create(notifications)
