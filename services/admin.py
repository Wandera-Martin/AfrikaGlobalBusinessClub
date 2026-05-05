from django.contrib import admin
from .models import Service, ServiceApplication

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'price_range', 'is_active', 'created_at')
    list_filter = ('is_active',)
    search_fields = ('title', 'description')

@admin.register(ServiceApplication)
class ServiceApplicationAdmin(admin.ModelAdmin):
    list_display = ('business', 'service', 'status', 'created_at')
    list_filter = ('status', 'service')
    search_fields = ('business__company_name', 'project_requirements')
