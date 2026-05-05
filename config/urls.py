"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/business/', include('business.urls')),
    path('api/v1/feed/', include('feed.urls')),
    path('api/v1/opportunities/', include('opportunities.urls')),
    path('api/v1/services/', include('services.urls')),
    path('api/v1/events/', include('events.urls')),
    path('api/v1/messaging/', include('messaging.urls')),
    path('api/v1/notifications/', include('notifications.urls')),
]

# Configure Admin Site Name
admin.site.site_header = "Trade Africa Global Business Club Admin"
admin.site.site_title = "Trade Africa Global Business Club Admin Portal"
admin.site.index_title = "Welcome to Trade Africa Global Business Club Portal"

from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
