from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Event, EventRegistration
from .serializers import EventSerializer, EventRegistrationSerializer
from business.models import BusinessProfile

class EventListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EventSerializer
    
    def get_queryset(self):
        return Event.objects.filter(is_active=True).order_by('event_date')

class EventJoinView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = EventRegistrationSerializer

    def create(self, request, *args, **kwargs):
        business = get_object_or_404(BusinessProfile, user=request.user)
        event_id = self.kwargs.get('pk')
        event = get_object_or_404(Event, pk=event_id, is_active=True)
        
        # Check if already registered
        registration, created = EventRegistration.objects.get_or_create(
            event=event, business=business,
            defaults={'status': 'going'}
        )
        
        if not created:
            if registration.status == 'cancelled':
                registration.status = 'going'
                registration.save()
            else:
                return Response({'detail': 'Already registered for this event.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(registration)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
