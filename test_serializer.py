import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from business.models import Post, Opportunity
from business.serializers import PostSerializer

try:
    posts = Post.objects.filter(post_type='opportunity').select_related('opportunity')
    serializer = PostSerializer(posts, many=True)
    data = serializer.data
    print("SUCCESS")
except Exception as e:
    import traceback
    traceback.print_exc()
