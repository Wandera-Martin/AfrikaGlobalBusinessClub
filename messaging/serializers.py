from rest_framework import serializers
from .models import Conversation, Message
from business.serializers import BusinessProfileSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_details = BusinessProfileSerializer(source='sender', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'conversation', 'sender', 'content', 'is_read', 'timestamp', 'sender_details']
        read_only_fields = ['id', 'sender', 'timestamp', 'sender_details']

class ConversationSerializer(serializers.ModelSerializer):
    participants_details = BusinessProfileSerializer(source='participants', many=True, read_only=True)
    last_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'type', 'participants', 'created_at', 'updated_at', 'participants_details', 'last_message', 'unread_count']

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-timestamp').first()
        if last_msg:
            return MessageSerializer(last_msg).data
        return None

    def get_unread_count(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Count messages where sender is not me, and is_read is False
            return obj.messages.exclude(sender__user=request.user).filter(is_read=False).count()
        return 0
