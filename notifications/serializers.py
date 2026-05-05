from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actor_name = serializers.CharField(source='actor.company_name', read_only=True)
    actor_id = serializers.IntegerField(source='actor.id', read_only=True)
    content_model = serializers.CharField(source='content_type.model', read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'message', 'is_read', 'created_at', 'actor_name', 'actor_id', 'content_model', 'object_id']
