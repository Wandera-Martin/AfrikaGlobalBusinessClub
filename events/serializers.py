from rest_framework import serializers
from .models import Event, EventRegistration
from business.serializers import BusinessProfileSerializer

class EventSerializer(serializers.ModelSerializer):
    registered_count = serializers.SerializerMethodField()
    has_registered = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'event_date', 'location', 
            'is_virtual', 'capacity', 'image_banner', 'is_active', 
            'registered_count', 'has_registered', 'created_at'
        ]

    def get_registered_count(self, obj):
        return obj.registrations.filter(status='going').count()

    def get_has_registered(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            # Assuming business profile exists for user
            return obj.registrations.filter(business__user=request.user, status='going').exists()
        return False

class EventRegistrationSerializer(serializers.ModelSerializer):
    business_details = BusinessProfileSerializer(source='business', read_only=True)
    
    class Meta:
        model = EventRegistration
        fields = ['id', 'event', 'business', 'status', 'registration_date', 'business_details']
        read_only_fields = ['id', 'event', 'business', 'registration_date', 'business_details']
