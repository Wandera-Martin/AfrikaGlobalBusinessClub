import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import get_object_or_404
from business.models import BusinessProfile
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer


class PostListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = Post.objects.select_related('opportunity').filter(is_published=True)

        post_type = request.query_params.get('type')
        if post_type:
            queryset = queryset.filter(post_type=post_type)

        exclude_type = request.query_params.get('exclude_type')
        if exclude_type:
            queryset = queryset.exclude(post_type=exclude_type)

        posts = queryset.order_by('-created_at')
        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)

    def post(self, request):
        try:
            profile = request.user.business_profile
        except BusinessProfile.DoesNotExist:
            return Response({"detail": "Business profile not found."}, status=status.HTTP_404_NOT_FOUND)

        post_type = request.data.get('post_type')

        # Opportunity creation is handled by the opportunities app
        if post_type == 'opportunity':
            return Response(
                {"detail": "Use /api/v1/opportunities/ to create opportunity posts."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = PostSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(business=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk, request):
        post = get_object_or_404(Post, pk=pk)
        return post

    def get(self, request, pk):
        post = self.get_object(pk, request)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

    def patch(self, request, pk):
        post = self.get_object(pk, request)
        if post.business.user != request.user:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        serializer = PostSerializer(post, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        post = self.get_object(pk, request)
        if post.business.user != request.user:
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
        post.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PostLikeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            profile = request.user.business_profile
        except (Post.DoesNotExist, BusinessProfile.DoesNotExist):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        if post.likes.filter(id=profile.id).exists():
            post.likes.remove(profile)
            liked = False
        else:
            post.likes.add(profile)
            liked = True

            if post.business != profile:
                from notifications.models import Notification
                from django.contrib.contenttypes.models import ContentType
                Notification.objects.create(
                    recipient=post.business,
                    actor=profile,
                    notification_type='LIKE',
                    content_type=ContentType.objects.get_for_model(Post),
                    object_id=post.id,
                    message=f"{profile.company_name} liked your post."
                )

        return Response({"likes_count": post.likes.count(), "is_liked_by_user": liked})


class PostShareView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        post.shares += 1
        post.save(update_fields=['shares'])
        return Response({"shares_count": post.shares})


class PostSaveView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
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


class PostCommentListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        comments = post.comments.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request, post_id):
        try:
            post = Post.objects.get(pk=post_id)
            profile = request.user.business_profile
        except (Post.DoesNotExist, BusinessProfile.DoesNotExist):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(post=post, business=profile)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostPublicDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        post = get_object_or_404(Post, slug=slug, is_published=True)
        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)
