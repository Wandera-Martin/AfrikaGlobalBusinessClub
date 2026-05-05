from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from business.models import BusinessProfile


class Post(models.Model):
    POST_TYPE_CHOICES = [
        ('text', 'Text'),
        ('media', 'Media'),
        ('article', 'Article'),
        ('opportunity', 'Opportunity'),
    ]
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]

    business = models.ForeignKey(
        BusinessProfile,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    post_type = models.CharField(max_length=20, choices=POST_TYPE_CHOICES)

    # Common content
    content = models.TextField(blank=True)

    # Article-only
    title = models.CharField(max_length=255, blank=True)
    cover_image = models.ImageField(upload_to='posts/covers/', blank=True, null=True)

    # Media-only
    media_file = models.FileField(upload_to='posts/media/', blank=True, null=True)
    media_type = models.CharField(
        max_length=10, choices=MEDIA_TYPE_CHOICES, blank=True, null=True
    )

    # Metadata
    is_published = models.BooleanField(default=True)
    is_open = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Engagement
    likes = models.ManyToManyField(BusinessProfile, related_name='liked_posts', blank=True)
    saved_by = models.ManyToManyField(BusinessProfile, related_name='saved_posts', blank=True)
    shares = models.IntegerField(default=0)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            if self.post_type == 'article' and self.title:
                base_slug = slugify(self.title)
            elif self.content:
                base_slug = slugify(self.content[:30])
                if not base_slug:
                    base_slug = 'post'
            else:
                base_slug = f'{self.post_type}-post'

            random_suffix = get_random_string(6, 'abcdefghijklmnopqrstuvwxyz0123456789')
            self.slug = f"{base_slug}-{random_suffix}"
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.post_type.upper()}] {self.business.company_name} - {self.pk}"


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    business = models.ForeignKey(BusinessProfile, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"Comment by {self.business.company_name} on Post {self.post.id}"
