import os
import django
import sys

# Add the current directory to sys.path so django can find the settings
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agbc.settings')
django.setup()

from events.models import Event
from services.models import Service
from notifications.models import Notification
from business.models import BusinessProfile
import datetime
from django.utils import timezone

businesses = BusinessProfile.objects.filter(is_verified=True).count()
print(f"Verified Businesses: {businesses}")

initial_notifs = Notification.objects.filter(notification_type='SYSTEM').count()

print("Creating Test Event...")
evt = Event.objects.create(
    title="Test Auto Event",
    description="This is a test event to verify signals",
    event_date=timezone.now() + datetime.timedelta(days=1),
    location="Virtual",
    is_virtual=True
)

evt_notifs = Notification.objects.filter(notification_type='SYSTEM').count()
print(f"Notifications increased by: {evt_notifs - initial_notifs} (Expected {businesses})")

print("Creating Test Service...")
svc = Service.objects.create(
    title="Test Auto Service",
    description="This is a test service to verify signals"
)

svc_notifs = Notification.objects.filter(notification_type='SYSTEM').count()
print(f"Notifications increased by: {svc_notifs - evt_notifs} (Expected {businesses})")

evt.delete()
svc.delete()
num_deleted, _ = Notification.objects.filter(message__icontains="Test Auto").delete()
print(f"Cleanup deleted {num_deleted} Test Auto notifications.")
