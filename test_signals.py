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
print(f"Notifications increased by: {evt_notifs - initial_notifs}")

print("Creating Test Service...")
svc = Service.objects.create(
    title="Test Auto Service",
    description="This is a test service to verify signals"
)

svc_notifs = Notification.objects.filter(notification_type='SYSTEM').count()
print(f"Notifications increased by: {svc_notifs - evt_notifs}")

evt.delete()
svc.delete()
Notification.objects.filter(message__icontains="Test Auto").delete()
