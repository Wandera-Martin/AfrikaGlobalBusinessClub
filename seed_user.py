import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from business.models import BusinessProfile

User = get_user_model()

# Create test user
user, created = User.objects.get_or_create(email='test@example.com', defaults={'first_name': 'Test', 'last_name': 'User'})
if created:
    user.set_password('password123')
    user.is_active = True
    user.save()

# Create business profile
profile, p_created = BusinessProfile.objects.get_or_create(user=user, defaults={
    'company_name': 'Test Company LLC',
    'company_description': 'A company for testing the application.',
    'onboarding_completed': True,
    'is_verified': True,
})

print(f"User created: {created}, Profile created: {p_created}")
print(f"Login with: test@example.com / password123")
