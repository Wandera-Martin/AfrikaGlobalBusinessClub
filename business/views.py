from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import get_object_or_404
from django_countries import countries
from .models import BusinessProfile
from .serializers import BusinessProfileSerializer


class BusinessProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = BusinessProfile.objects.get_or_create(user=request.user)
        serializer = BusinessProfileSerializer(profile)
        return Response(serializer.data)

    def post(self, request):
        profile, created = BusinessProfile.objects.get_or_create(user=request.user)
        serializer = BusinessProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            if str(request.data.get('onboarding_completed')).lower() == 'true':
                serializer.save(onboarding_completed=True)
            else:
                serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BusinessProfileSkipView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        profile, created = BusinessProfile.objects.get_or_create(user=request.user)
        profile.onboarding_skipped = True
        profile.save(update_fields=['onboarding_skipped'])
        return Response({"message": "Onboarding skipped successfully."})


class CountryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        country_list = [{"code": code, "name": str(name)} for code, name in list(countries)]
        return Response(country_list)


class BusinessProfilePublicDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        profile = get_object_or_404(BusinessProfile, slug=slug)
        serializer = BusinessProfileSerializer(profile, context={'request': request})
        return Response(serializer.data)


class BusinessProfileListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = BusinessProfile.objects.filter(
            onboarding_completed=True
        ).exclude(user=request.user)
        serializer = BusinessProfileSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)
