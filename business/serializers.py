from rest_framework import serializers
from django_countries.serializers import CountryFieldMixin
from .models import BusinessProfile


class BusinessProfileSerializer(CountryFieldMixin, serializers.ModelSerializer):
    posts_count = serializers.SerializerMethodField()
    applications_received_count = serializers.SerializerMethodField()

    class Meta:
        model = BusinessProfile
        fields = [
            'id', 'company_name', 'company_description', 'website_url',
            'year_established', 'employee_count', 'annual_revenue',
            'country', 'primary_sector', 'additional_sectors', 'membership_tier',
            'onboarding_completed', 'onboarding_skipped', 'is_verified',
            'posts_count', 'applications_received_count', 'dp', 'cover_photo',
            'slug',
        ]
        read_only_fields = [
            'onboarding_completed', 'onboarding_skipped', 'is_verified',
            'posts_count', 'applications_received_count', 'slug',
        ]

    def get_posts_count(self, obj):
        # Lazy import to avoid circular deps
        from feed.models import Post
        return Post.objects.filter(business=obj, is_published=True).count()

    def get_applications_received_count(self, obj):
        from opportunities.models import OpportunityApplication
        return OpportunityApplication.objects.filter(opportunity__business=obj).count()
