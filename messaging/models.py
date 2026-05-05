from django.db import models
from business.models import BusinessProfile

class Conversation(models.Model):
    TYPE_CHOICES = (
        ('public_aio', 'Public AIO'),
        ('private_dm', 'Private DM'),
    )

    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='private_dm')
    participants = models.ManyToManyField(BusinessProfile, related_name='conversations', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.type == 'public_aio':
            return "Global AIO Chat"
        return f"DM: {', '.join([p.company_name for p in self.participants.all()])}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender.company_name}: {self.content[:50]}"
