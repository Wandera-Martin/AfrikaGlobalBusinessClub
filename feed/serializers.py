from rest_framework import serializers
from .models import Post, Comment


class CommentSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='business.company_name', read_only=True)
    is_verified = serializers.BooleanField(source='business.is_verified', read_only=True)
    dp = serializers.ImageField(source='business.dp', read_only=True)

    class Meta:
        model = Comment
        fields = [
            'id', 'post', 'business', 'content', 'created_at', 'updated_at',
            'company_name', 'is_verified', 'dp'
        ]
        read_only_fields = [
            'id', 'post', 'business', 'created_at', 'updated_at',
            'company_name', 'is_verified', 'dp'
        ]


class PostSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='business.company_name', read_only=True)
    is_verified = serializers.BooleanField(source='business.is_verified', read_only=True)
    dp = serializers.ImageField(source='business.dp', read_only=True)
    is_published = serializers.BooleanField(default=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)
    comments_count = serializers.IntegerField(source='comments.count', read_only=True)
    is_liked_by_user = serializers.SerializerMethodField()
    is_mine = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()
    applications_count = serializers.SerializerMethodField()
    author_business_id = serializers.IntegerField(source='business.id', read_only=True)
    is_saved_by_user = serializers.SerializerMethodField()
    opportunity_details = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'post_type', 'content', 'title', 'cover_image',
            'media_file', 'media_type', 'is_published', 'is_open', 'created_at',
            'updated_at', 'company_name', 'is_verified', 'dp', 'shares', 'likes_count',
            'comments_count', 'is_liked_by_user', 'is_saved_by_user', 'is_mine', 'slug',
            'has_applied', 'applications_count', 'author_business_id', 'opportunity_details'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'company_name', 'is_verified', 'dp',
            'shares', 'likes_count', 'comments_count', 'is_liked_by_user',
            'is_saved_by_user', 'is_mine', 'slug', 'has_applied', 'applications_count',
            'author_business_id', 'opportunity_details'
        ]

    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if hasattr(request.user, 'business_profile'):
                return obj.likes.filter(id=request.user.business_profile.id).exists()
        return False

    def get_is_mine(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.business.user_id == request.user.id
        return False

    def get_has_applied(self, obj):
        if obj.post_type != 'opportunity':
            return False
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if hasattr(request.user, 'business_profile') and hasattr(obj, 'opportunity'):
                try:
                    return obj.opportunity.applications.filter(
                        applicant=request.user.business_profile
                    ).exists()
                except Exception:
                    return False
        return False

    def get_applications_count(self, obj):
        if obj.post_type != 'opportunity':
            return 0
        if hasattr(obj, 'opportunity'):
            try:
                return obj.opportunity.applications.count()
            except Exception:
                return 0
        return 0

    def get_is_saved_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            if hasattr(request.user, 'business_profile'):
                return obj.saved_by.filter(id=request.user.business_profile.id).exists()
        return False

    def get_opportunity_details(self, obj):
        if obj.post_type == 'opportunity' and hasattr(obj, 'opportunity'):
            opp = obj.opportunity
            return {
                'opportunity_type': opp.opportunity_type,
                'currency': opp.currency,
                'min_value': str(opp.min_value) if opp.min_value else None,
                'max_value': str(opp.max_value) if opp.max_value else None,
                'min_value_usd': str(opp.min_value_usd) if opp.min_value_usd else None,
                'max_value_usd': str(opp.max_value_usd) if opp.max_value_usd else None,
                'deadline': opp.deadline,
                'target_country': str(opp.target_country.name) if opp.target_country else None,
                'is_featured': opp.is_featured,
            }
        return None
