from django.db import models
from django.contrib.auth import get_user_model
from django_countries.fields import CountryField
from django.utils.text import slugify
from django.utils.crypto import get_random_string

User = get_user_model()


class BusinessProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='business_profile')

    # Step 1 Fields
    company_name = models.CharField(max_length=255, blank=True)
    company_description = models.TextField(blank=True, null=True)
    website_url = models.URLField(blank=True, null=True)
    year_established = models.IntegerField(blank=True, null=True)
    employee_count = models.CharField(max_length=50, blank=True, null=True)
    annual_revenue = models.CharField(max_length=50, blank=True, null=True)

    # Step 2 Fields
    country = CountryField(blank=True, null=True)
    primary_sector = models.CharField(max_length=100, blank=True, null=True)
    additional_sectors = models.JSONField(default=list, blank=True)

    # Step 3 Fields
    MEMBERSHIP_CHOICES = [
        ('free', 'Free Tier'),
        ('pro', 'Professional'),
        ('business', 'Business'),
        ('enterprise', 'Enterprise'),
    ]
    membership_tier = models.CharField(max_length=20, choices=MEMBERSHIP_CHOICES, default='free')

    # Onboarding State
    onboarding_completed = models.BooleanField(default=False)
    onboarding_skipped = models.BooleanField(default=False)

    # Verification
    is_verified = models.BooleanField(default=False)

    # Media
    dp = models.ImageField(upload_to='business/dps/', blank=True, null=True)
    cover_photo = models.ImageField(upload_to='business/covers/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.company_name) if self.company_name else 'verified-business'
            random_suffix = get_random_string(6, 'abcdefghijklmnopqrstuvwxyz0123456789')
            self.slug = f"{base_slug}-{random_suffix}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email}'s Business Profile"
