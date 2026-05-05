from django.urls import path
from .views import (
    OpportunityListCreateView, OpportunityApplyView,
    OpportunityApplicationsListView, OpportunitySaveView,
)

urlpatterns = [
    path('', OpportunityListCreateView.as_view(), name='opportunity-list-create'),
    path('<int:post_id>/apply/', OpportunityApplyView.as_view(), name='opportunity-apply'),
    path('<int:post_id>/applications/', OpportunityApplicationsListView.as_view(), name='opportunity-applications'),
    path('<int:pk>/save/', OpportunitySaveView.as_view(), name='opportunity-save'),
]
