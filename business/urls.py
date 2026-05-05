from django.urls import path
from .views import (
    BusinessProfileView,
    BusinessProfileSkipView,
    CountryListView,
    BusinessProfilePublicDetailView,
    BusinessProfileListView,
)

urlpatterns = [
    path('profile/', BusinessProfileView.as_view(), name='business_profile'),
    path('profile/skip/', BusinessProfileSkipView.as_view(), name='business_profile_skip'),
    path('profiles/', BusinessProfileListView.as_view(), name='business_profile_list'),
    path('countries/', CountryListView.as_view(), name='country_list'),
    path('public/profiles/<slug:slug>/', BusinessProfilePublicDetailView.as_view(), name='public_profile_detail'),
]
