from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from business.models import BusinessProfile

class ConversationListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConversationSerializer

    def get_queryset(self):
        user_profile = get_object_or_404(BusinessProfile, user=self.request.user)
        # Return global AIO + any private DM where they participate
        return Conversation.objects.filter(
            Q(type='public_aio') | Q(participants=user_profile)
        ).distinct().order_by('-updated_at')

class ConversationCreateView(generics.CreateAPIView):
    """
    Creates or retrieves a Direct Message conversation between the current user
    and a specified target BusinessProfile ID.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ConversationSerializer

    def create(self, request, *args, **kwargs):
        my_profile = get_object_or_404(BusinessProfile, user=request.user)
        target_profile_id = request.data.get('target_business_id')
        
        if not target_profile_id:
            return Response({'error': 'target_business_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        target_profile = get_object_or_404(BusinessProfile, id=target_profile_id)
        
        if my_profile == target_profile:
            return Response({'error': 'Cannot create a DM with yourself'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if conversation already exists
        existing_conversations = Conversation.objects.filter(type='private_dm', participants=my_profile).filter(participants=target_profile)
        
        if existing_conversations.exists():
            serializer = self.get_serializer(existing_conversations.first())
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        # Create new one
        conv = Conversation.objects.create(type='private_dm')
        conv.participants.add(my_profile, target_profile)
        serializer = self.get_serializer(conv)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class MessageListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get_queryset(self):
        conversation_id = self.kwargs.get('pk')
        conv = get_object_or_404(Conversation, id=conversation_id)
        # Ensure they have access
        if conv.type == 'private_dm':
            user_profile = get_object_or_404(BusinessProfile, user=self.request.user)
            if not conv.participants.filter(id=user_profile.id).exists():
                return Message.objects.none()
        return conv.messages.all()

    def perform_create(self, serializer):
        conversation_id = self.kwargs.get('pk')
        conv = get_object_or_404(Conversation, id=conversation_id)
        sender = get_object_or_404(BusinessProfile, user=self.request.user)
        
        # Guard clause
        if conv.type == 'private_dm' and not conv.participants.filter(id=sender.id).exists():
            raise serializers.ValidationError("You are not a participant in this conversation.")

        serializer.save(conversation=conv, sender=sender)
        # Update conversation timestamp to bump it in inbox
        conv.save() # auto_now=True will trigger

class MarkMessagesReadView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        conv = get_object_or_404(Conversation, id=pk)
        user_profile = get_object_or_404(BusinessProfile, user=request.user)
        
        # Mark all messages in this conversation where I am NOT the sender as read
        unread_msgs = conv.messages.exclude(sender=user_profile).filter(is_read=False)
        updated = unread_msgs.update(is_read=True)
        return Response({'status': 'ok', 'updated_count': updated})
