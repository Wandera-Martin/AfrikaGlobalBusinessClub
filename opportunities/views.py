import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import get_object_or_404
from business.models import BusinessProfile
from feed.models import Post
from .models import Opportunity, OpportunityApplication
from feed.serializers import PostSerializer
from .serializers import OpportunityApplicationSerializer


class OpportunityListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Post.objects.select_related('opportunity').filter(
            post_type='opportunity', is_published=True
        )

        opp_type = request.query_params.get('opportunity_type')
        if opp_type:
            queryset = queryset.filter(opportunity__opportunity_type=opp_type)

        opp_country = request.query_params.get('target_country')
        if opp_country:
            queryset = queryset.filter(opportunity__target_country=opp_country)

        posts = queryset.order_by('-created_at')
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        try:
            profile = request.user.business_profile
        except BusinessProfile.DoesNotExist:
            return Response({"detail": "Business profile not found."}, status=status.HTTP_404_NOT_FOUND)

        content = request.data.get('content', '')
        title = request.data.get('title', '')

        opp_details_raw = request.data.get('opportunity_details', '{}')
        if isinstance(opp_details_raw, str):
            opp_details = json.loads(opp_details_raw)
        else:
            opp_details = opp_details_raw

        opp_type = opp_details.get('opportunity_type')
        curr = opp_details.get('currency', 'USD')
        min_v = opp_details.get('min_value')
        max_v = opp_details.get('max_value')
        deadline = opp_details.get('deadline')
        country = opp_details.get('target_country')

        opp = Opportunity.objects.create(
            business=profile,
            post_type='opportunity',
            title=title,
            content=content,
            opportunity_type=opp_type,
            currency=curr,
            min_value=min_v if min_v else None,
            max_value=max_v if max_v else None,
            deadline=deadline,
            target_country=country
        )
        serializer = PostSerializer(opp, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OpportunityApplyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id, post_type='opportunity', is_published=True)

        if post.business.user == request.user:
            return Response(
                {"detail": "You cannot apply to your own opportunity."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not post.is_open:
            return Response(
                {"detail": "This opportunity is no longer accepting applications."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            profile = request.user.business_profile
        except BusinessProfile.DoesNotExist:
            return Response({"detail": "Business profile not found."}, status=status.HTTP_404_NOT_FOUND)

        opportunity = get_object_or_404(Opportunity, post_ptr_id=post.id)

        if OpportunityApplication.objects.filter(opportunity=opportunity, applicant=profile).exists():
            return Response(
                {"detail": "You have already applied to this opportunity."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = OpportunityApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(opportunity=opportunity, applicant=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OpportunityApplicationsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id, post_type='opportunity')
        if post.business.user != request.user:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        opportunity = get_object_or_404(Opportunity, post_ptr_id=post.id)
        applications = opportunity.applications.all()
        serializer = OpportunityApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class OpportunitySaveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk, post_type='opportunity')
            profile = request.user.business_profile
        except (Post.DoesNotExist, BusinessProfile.DoesNotExist):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if post.saved_by.filter(id=profile.id).exists():
            post.saved_by.remove(profile)
            saved = False
        else:
            post.saved_by.add(profile)
            saved = True

        return Response({"is_saved_by_user": saved})
