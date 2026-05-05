from rest_framework import serializers
from .models import Opportunity, OpportunityApplication


class OpportunityApplicationSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='applicant.company_name', read_only=True)
    is_verified = serializers.BooleanField(source='applicant.is_verified', read_only=True)
    dp = serializers.ImageField(source='applicant.dp', read_only=True)

    class Meta:
        model = OpportunityApplication
        fields = [
            'id', 'opportunity', 'applicant', 'marketplace_account_id', 'message',
            'status', 'created_at', 'company_name', 'is_verified', 'dp'
        ]
        read_only_fields = [
            'id', 'opportunity', 'applicant', 'status', 'created_at',
            'company_name', 'is_verified', 'dp'
        ]
