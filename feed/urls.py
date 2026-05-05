from django.urls import path
from .views import (
    PostListCreateView, PostDetailView, PostLikeView, PostShareView,
    PostSaveView, PostCommentListCreateView, PostPublicDetailView,
)

urlpatterns = [
    path('posts/', PostListCreateView.as_view(), name='feed-post-list-create'),
    path('posts/<int:pk>/', PostDetailView.as_view(), name='feed-post-detail'),
    path('posts/<int:pk>/like/', PostLikeView.as_view(), name='feed-post-like'),
    path('posts/<int:pk>/share/', PostShareView.as_view(), name='feed-post-share'),
    path('posts/<int:pk>/save/', PostSaveView.as_view(), name='feed-post-save'),
    path('posts/<int:post_id>/comments/', PostCommentListCreateView.as_view(), name='feed-post-comments'),
    path('posts/<slug:slug>/', PostPublicDetailView.as_view(), name='feed-post-public-detail'),
]
