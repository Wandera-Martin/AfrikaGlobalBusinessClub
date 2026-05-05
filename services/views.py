from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Service, ServiceApplication
from .serializers import ServiceSerializer, ServiceApplicationSerializer
from business.models import BusinessProfile

class ServiceListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ServiceSerializer
    queryset = Service.objects.filter(is_active=True).order_by('-created_at')

class ServiceApplyView(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ServiceApplicationSerializer

    def perform_create(self, serializer):
        business = get_object_or_404(BusinessProfile, user=self.request.user)
        service_id = self.kwargs.get('pk')
        service = get_object_or_404(Service, pk=service_id, is_active=True)
        serializer.save(business=business, service=service)
