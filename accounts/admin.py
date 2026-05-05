from django.contrib import admin

from .models import User, EmailVerificationOTP

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_email_verified', 'is_active', 'is_staff']

@admin.register(EmailVerificationOTP)
class EmailVerificationOTPAdmin(admin.ModelAdmin):
    list_display = ['user', 'code', 'is_used', 'created_at']
    list_filter = ['is_used', 'created_at']
    search_fields = ['user__email', 'code']
