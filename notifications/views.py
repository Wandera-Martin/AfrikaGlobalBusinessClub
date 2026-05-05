from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # We only return notifications for the authenticated user's business profile
        if hasattr(self.request.user, 'business_profile'):
            return Notification.objects.filter(recipient=self.request.user.business_profile)
        return Notification.objects.none()

    @action(detail=True, methods=['patch'])
    def read(self, request, pk=None):
        """Mark a single notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save(update_fields=['is_read'])
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all unread notifications as read for current user"""
        if hasattr(request.user, 'business_profile'):
            profile = request.user.business_profile
            count = Notification.objects.filter(recipient=profile, is_read=False).update(is_read=True)
            return Response({'status': f'{count} notifications marked as read'})
        return Response({'status': 'no profile'}, status=400)
