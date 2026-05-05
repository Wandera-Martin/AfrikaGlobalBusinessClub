import pycountry
from django.db import models
from django_countries.fields import CountryField
from feed.models import Post
from business.models import BusinessProfile


try:
    CURRENCY_CHOICES = [(c.alpha_3, f"{c.name} ({c.alpha_3})") for c in pycountry.currencies]
except Exception:
    CURRENCY_CHOICES = [('USD', 'US Dollar (USD)')]


class Opportunity(Post):
    OPPORTUNITY_TYPE_CHOICES = [
        ('supply_lead', 'Supply Lead'),
        ('export_contract', 'Export Contract'),
        ('partnership', 'Partnership'),
        ('grant', 'Grant'),
        ('investment', 'Investment'),
        ('equipment', 'Equipment'),
    ]

    opportunity_type = models.CharField(max_length=50, choices=OPPORTUNITY_TYPE_CHOICES)

    # Financials
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='USD')
    min_value = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    max_value = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    min_value_usd = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)
    max_value_usd = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)

    # Details
    deadline = models.DateTimeField(blank=True, null=True)
    target_country = CountryField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Auto-convert home currency values to USD equivalents
        if self.currency and self.currency != 'USD':
            import requests
            from decimal import Decimal
            try:
                response = requests.get(
                    f'https://open.er-api.com/v6/latest/{self.currency}', timeout=3
                )
                data = response.json()
                if data.get('result') == 'success':
                    rate = data['rates'].get('USD')
                    if rate:
                        rate_decimal = Decimal(str(rate))
                        if self.min_value is not None:
                            self.min_value_usd = self.min_value * rate_decimal
                        if self.max_value is not None:
                            self.max_value_usd = self.max_value * rate_decimal
            except Exception:
                pass  # Fail silently — don't block saves if API is down
        elif self.currency == 'USD':
            self.min_value_usd = self.min_value
            self.max_value_usd = self.max_value

        super().save(*args, **kwargs)

    def __str__(self):
        return f"[OPPORTUNITY] {self.business.company_name} — {self.opportunity_type}"


class OpportunityApplication(models.Model):
    opportunity = models.ForeignKey(
        Opportunity, on_delete=models.CASCADE, related_name='applications'
    )
    applicant = models.ForeignKey(
        BusinessProfile, on_delete=models.CASCADE, related_name='applications_made'
    )
    marketplace_account_id = models.CharField(max_length=255)
    message = models.TextField(blank=True)

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['opportunity', 'applicant']
        ordering = ['-created_at']

    def __str__(self):
        return f"Application by {self.applicant.company_name} for {self.opportunity.id}"
