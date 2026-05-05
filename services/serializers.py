from rest_framework import serializers
from .models import Service, ServiceApplication
from business.serializers import BusinessProfileSerializer

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'title', 'description', 'price_range', 'icon', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']

class ServiceApplicationSerializer(serializers.ModelSerializer):
    business_details = BusinessProfileSerializer(source='business', read_only=True)
    service_details = ServiceSerializer(source='service', read_only=True)

    class Meta:
        model = ServiceApplication
        fields = ['id', 'service', 'business', 'project_requirements', 'status', 'created_at', 'business_details', 'service_details']
        read_only_fields = ['id', 'business', 'status', 'created_at', 'business_details', 'service_details']
