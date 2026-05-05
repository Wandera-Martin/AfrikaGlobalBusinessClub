# Trade Africa Global Business Club — Backend API

> A Django REST Framework backend powering a B2B networking and trade platform for African SMEs and buyers.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Configuration](#environment-configuration)
6. [API Reference](#api-reference)
   - [Authentication](#authentication-apiv1auth)
   - [Business Profiles](#business-profiles-apiv1business)
   - [Feed](#feed-apiv1feed)
   - [Opportunities](#opportunities-apiv1opportunities)
   - [Services](#services-apiv1services)
   - [Events](#events-apiv1events)
   - [Messaging](#messaging-apiv1messaging)
   - [Notifications](#notifications-apiv1notifications)
7. [Data Models](#data-models)
8. [Authentication & Security](#authentication--security)
9. [Signal System](#signal-system)
10. [Admin Panel](#admin-panel)
11. [Known Development Notes](#known-development-notes)
12. [Production Checklist](#production-checklist)

---

## Project Overview

This is the backend for **Trade Africa Global Business Club (AG Business)**, a professional B2B networking platform designed to connect African SMEs (Small & Medium Enterprises) and buyers. The platform enables businesses to:

- Register and build a verified business profile
- Post to a knowledge/activity feed (text, media, articles, opportunities)
- Discover and apply for trade opportunities (supply leads, export contracts, partnerships, grants, investments, equipment)
- Browse and enroll in professional services and events
- Message other businesses directly (private DMs) or in a global chat
- Receive real-time notifications for all engagement activities

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Framework | Django 5.0.4 |
| API Layer | Django REST Framework |
| Authentication | JWT via `djangorestframework-simplejwt` |
| Social Auth | Google OAuth 2.0 (via Google userinfo endpoint) |
| Database | SQLite (development) — PostgreSQL recommended for production |
| File Storage | Local filesystem via Django's `MEDIA_ROOT` |
| CORS | `django-cors-headers` |
| Country Fields | `django-countries` |
| Currency data | `pycountry` |
| Exchange Rates | `open.er-api.com` (free, no key required) |
| Email | Console backend (development) |

---

## Project Structure

```
django pr/
├── config/                  # Django project configuration
│   ├── settings.py          # Main settings file
│   ├── urls.py              # Root URL routing
│   ├── asgi.py
│   └── wsgi.py
│
├── accounts/                # User authentication app
│   ├── models.py            # User, EmailVerificationOTP
│   ├── serializers.py       # Register, Login, ForgotPassword, ResetPassword
│   ├── views.py             # Auth endpoints
│   └── urls.py
│
├── business/                # Business profile management
│   ├── models.py            # BusinessProfile
│   ├── serializers.py
│   ├── views.py
│   ├── permissions.py       # Custom permission classes
│   └── urls.py
│
├── feed/                    # Activity feed (posts & comments)
│   ├── models.py            # Post, Comment
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── opportunities/           # Trade opportunity board
│   ├── models.py            # Opportunity (extends Post), OpportunityApplication
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── services/                # Platform services catalogue
│   ├── models.py            # Service, ServiceApplication
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── events/                  # Business events
│   ├── models.py            # Event, EventRegistration
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── messaging/               # Direct messaging
│   ├── models.py            # Conversation, Message
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── notifications/           # In-app notification system
│   ├── models.py            # Notification
│   ├── signals.py           # Auto-notification signal handlers
│   ├── views.py
│   └── urls.py
│
├── media/                   # User-uploaded files (gitignored)
├── manage.py
├── db.sqlite3               # SQLite database (development only)
└── requirements.txt
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- `pip`
- A virtual environment tool (`venv`, `conda`, etc.)

### Installation

```bash
# 1. Navigate to the project root
cd "django pr"

# 2. Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Apply database migrations
python manage.py migrate

# 5. Create a superuser (for admin panel access)
python manage.py createsuperuser

# 6. Start the development server
python manage.py runserver
```

The API will be available at: `http://127.0.0.1:8000/`

---

## Environment Configuration

Currently, all configuration lives in `config/settings.py`. Before deploying to production, the following values **must** be extracted into environment variables (e.g., via a `.env` file and `python-decouple` or `django-environ`):

| Setting | Current Value | Production Notes |
|---------|--------------|-----------------|
| `SECRET_KEY` | Hardcoded (insecure) | **Must be changed and kept secret** |
| `DEBUG` | `True` | Set to `False` in production |
| `ALLOWED_HOSTS` | `[]` | Add your domain(s) |
| `DATABASES` | SQLite | Switch to PostgreSQL |
| `EMAIL_BACKEND` | Console | Use SMTP (SendGrid, SES, etc.) |
| `GOOGLE_CLIENT_ID` | Hardcoded | Move to environment variable |
| `FRONTEND_URL` | `http://localhost:5173` | Set to production frontend URL |
| `CORS_ALLOWED_ORIGINS` | `localhost:5173` | Add production frontend domain |

### JWT Token Lifetimes

Configured in `settings.py`:
- **Access Token**: 5 minutes
- **Refresh Token**: 30 days

---

## API Reference

All endpoints are prefixed with `/api/v1/`.

### Authentication (`/api/v1/auth/`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `POST` | `register/` | ❌ | Register a new user account. Sends OTP via email. |
| `POST` | `verify-otp/` | ❌ | Verify email with the 6-digit OTP code. Returns JWT tokens. |
| `POST` | `resend-otp/` | ❌ | Resend OTP to the user's email. |
| `POST` | `login/` | ❌ | Login with email + password. Returns JWT tokens. |
| `POST` | `logout/` | ✅ | Blacklists the refresh token. |
| `POST` | `forgot-password/` | ❌ | Sends a password reset link to the user's email. |
| `POST` | `reset-password/` | ❌ | Resets the password using the uid + token from the email link. |
| `POST` | `google/` | ❌ | Google OAuth login/signup. Accepts a Google access token. |
| `POST` | `token/refresh/` | ❌ | Refresh the access token using a valid refresh token. |

#### `POST /api/v1/auth/register/`
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "Jane",
  "last_name": "Doe",
  "role": "sme"        // "sme" or "buyer"
}
```

#### `POST /api/v1/auth/verify-otp/`
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```
**Response:** `{ "access": "...", "refresh": "..." }`

#### `POST /api/v1/auth/login/`
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```
**Response:** `{ "access": "...", "refresh": "..." }`

#### `POST /api/v1/auth/google/`
```json
{
  "access_token": "<Google OAuth Access Token>"
}
```
**Response:** `{ "access": "...", "refresh": "...", "created": true }`

#### `POST /api/v1/auth/reset-password/`
```json
{
  "uid": "<base64-encoded-user-pk>",
  "token": "<password-reset-token>",
  "new_password": "NewSecurePass!",
  "confirm_password": "NewSecurePass!"
}
```

---

### Business Profiles (`/api/v1/business/`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `profile/` | ✅ | Retrieve the authenticated user's business profile. |
| `POST` | `profile/` | ✅ | Create the business profile (onboarding step 1–3). |
| `PUT/PATCH` | `profile/` | ✅ | Update the business profile. |
| `POST` | `profile/skip/` | ✅ | Mark onboarding as skipped. |
| `GET` | `profiles/` | ✅ | List all business profiles (network discovery). |
| `GET` | `countries/` | ❌ | Returns a list of all countries (for dropdown fields). |
| `GET` | `public/profiles/<slug>/` | ❌ | View a public business profile by slug. |

#### Business Profile Fields (Onboarding)

**Step 1 — Company Info:**
- `company_name`, `company_description`, `website_url`, `year_established`, `employee_count`, `annual_revenue`

**Step 2 — Operations:**
- `country` (ISO country code), `primary_sector`, `additional_sectors` (JSON array)

**Step 3 — Membership:**
- `membership_tier`: `"free"` | `"pro"` | `"business"` | `"enterprise"`

**Media:**
- `dp` (profile image, multipart upload)
- `cover_photo` (cover image, multipart upload)

---

### Feed (`/api/v1/feed/`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `posts/` | ✅ | List all published posts (reverse chronological). |
| `POST` | `posts/` | ✅ | Create a new post. |
| `GET` | `posts/<id>/` | ✅ | Retrieve a single post by ID. |
| `PUT/PATCH` | `posts/<id>/` | ✅ | Update a post (owner only). |
| `DELETE` | `posts/<id>/` | ✅ | Delete a post (owner only). |
| `POST` | `posts/<id>/like/` | ✅ | Toggle like on a post. |
| `POST` | `posts/<id>/share/` | ✅ | Increment share count. |
| `POST` | `posts/<id>/save/` | ✅ | Toggle save/bookmark on a post. |
| `GET/POST` | `posts/<id>/comments/` | ✅ | List or add comments to a post. |
| `GET` | `posts/<slug>/` | ❌ | Public view of a post by slug. |

#### Post Types
- `text` — Plain text content
- `media` — Image or video with optional text
- `article` — Long-form content with a title and cover image
- `opportunity` — Trade opportunity (managed via the Opportunities app)

#### Create Post (`POST /api/v1/feed/posts/`)
```json
{
  "post_type": "text",
  "content": "Looking for export partners in East Africa."
}
```
For `media` posts, use `multipart/form-data` and include `media_file` and `media_type` (`"image"` or `"video"`).

---

### Opportunities (`/api/v1/opportunities/`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `` (root) | ✅ | List all opportunities. |
| `POST` | `` (root) | ✅ | Post a new trade opportunity. |
| `POST` | `<id>/apply/` | ✅ | Apply to an opportunity. |
| `GET` | `<id>/applications/` | ✅ | View applications for your opportunity (owner only). |
| `POST` | `<id>/save/` | ✅ | Toggle save/bookmark on an opportunity. |

#### Opportunity Types
`supply_lead`, `export_contract`, `partnership`, `grant`, `investment`, `equipment`

#### Create Opportunity
```json
{
  "opportunity_type": "export_contract",
  "content": "Seeking exporters of Arabica coffee to Europe.",
  "currency": "USD",
  "min_value": 10000,
  "max_value": 50000,
  "deadline": "2026-06-30T00:00:00Z",
  "target_country": "DE"
}
```

> **Note:** If `currency` is not `"USD"`, the system automatically fetches the live exchange rate from `open.er-api.com` and populates `min_value_usd` / `max_value_usd`.

---

### Services (`/api/v1/services/`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `services/` | ✅ | List all active platform services. |
| `POST` | `services/<id>/apply/` | ✅ | Submit an application for a service. |
| `GET` | `applications/` | ✅ | View your own service applications. |

---

### Events (`/api/v1/events/`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `events/` | ✅ | List all active events. |
| `POST` | `events/<id>/register/` | ✅ | Register for an event. |
| `DELETE` | `events/<id>/register/` | ✅ | Cancel registration for an event. |

---

### Messaging (`/api/v1/messaging/`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `conversations/` | ✅ | List conversations the user is part of. |
| `POST` | `conversations/` | ✅ | Start a new private DM conversation. |
| `GET` | `conversations/<id>/messages/` | ✅ | Get all messages in a conversation. |
| `POST` | `conversations/<id>/messages/` | ✅ | Send a message in a conversation. |

#### Conversation Types
- `private_dm` — One-on-one direct message between two businesses
- `public_aio` — Global chat room (all businesses participate)

---

### Notifications (`/api/v1/notifications/`)

| Method | Endpoint | Auth Required | Description |
|--------|----------|:---:|-------------|
| `GET` | `notifications/` | ✅ | List all notifications for the authenticated user. |
| `POST` | `notifications/<id>/read/` | ✅ | Mark a notification as read. |

#### Notification Types
| Type | Trigger |
|------|---------|
| `LIKE` | Someone likes your post |
| `COMMENT` | Someone comments on your post |
| `APPLY` | Someone applies to your opportunity |
| `MESSAGE` | You receive a new message |
| `SYSTEM` | New opportunity, event, or service is posted |

---

## Data Models

### Entity Relationship Summary

```
User (accounts.User)
  └── BusinessProfile (1:1, business.BusinessProfile)
        ├── Post (1:N, feed.Post)
        │     ├── Comment (1:N)
        │     └── Opportunity (extends Post, opportunities.Opportunity)
        │           └── OpportunityApplication (1:N)
        ├── ServiceApplication (1:N, services.ServiceApplication)
        ├── EventRegistration (1:N, events.EventRegistration)
        ├── Conversation (M:N, messaging.Conversation)
        │     └── Message (1:N)
        └── Notification (1:N, notifications.Notification)
```

### Key Model Notes

- **`User`**: Custom user model extending `AbstractBaseUser`. Authentication is via **email** (not username). Roles: `sme` or `buyer`.
- **`BusinessProfile`**: Created after registration during onboarding. Has a unique auto-generated `slug` used for public URLs. A user has exactly one business profile.
- **`Post`**: Central content model. All feed content (text, media, article) and opportunities are posts tied to a `BusinessProfile`.
- **`Opportunity`**: Inherits from `Post` using Django multi-table inheritance. Adds financial, deadline, and targeting fields.
- **`Notification`**: Uses Django's **Generic Foreign Key** pattern so a single model can reference any content type (Post, Comment, Message, etc.).

---

## Authentication & Security

### JWT Flow

1. User logs in → receives `access` (5 min) and `refresh` (30 days) tokens.
2. All protected requests include `Authorization: Bearer <access_token>`.
3. When the access token expires, the frontend automatically calls `POST /api/v1/auth/token/refresh/` to get a new one.
4. On logout, the refresh token is **blacklisted** via `djangorestframework-simplejwt`'s token blacklist app.

### OTP Email Verification

- On registration, a 6-digit OTP is generated and emailed to the user.
- OTPs expire after **3 minutes**.
- Any new OTP generation invalidates all previous unused OTPs.

> **Development Note:** In development (`EMAIL_BACKEND = ConsoleEmailBackend`), OTPs are printed to the console (not sent via email). They are also appended to `OTP_DEBUG.txt` in the project root for easy access. **This file must be removed or excluded before production.**

### Password Reset Flow

1. `POST /auth/forgot-password/` → Generates a signed `uid` + `token` pair and emails the user a reset URL.
2. The reset URL points to the frontend (`/reset-password?uid=...&token=...`).
3. `POST /auth/reset-password/` → Validates the uid/token and sets the new password.

### Google OAuth

- The frontend obtains a Google OAuth access token via `@react-oauth/google`.
- The token is sent to `POST /auth/google/`.
- The backend verifies it by calling `https://www.googleapis.com/oauth2/v3/userinfo`.
- A user is created if they don't exist, or logged in if they do.

---

## Signal System

The `notifications` app uses Django signals to automatically create notifications. All signal handlers are in `notifications/signals.py`:

| Signal | Sender | Effect |
|--------|--------|--------|
| `post_save` | `Comment` | Notifies the post owner of a new comment (not self-comments) |
| `post_save` | `OpportunityApplication` | Notifies the opportunity owner of a new applicant |
| `post_save` | `Message` | Notifies all conversation participants (except sender) |
| `post_save` | `Opportunity` | Notifies **all** business profiles of a new opportunity |
| `post_save` | `Event` | Notifies **all** business profiles of a new event |
| `post_save` | `Service` | Notifies **all** business profiles of a new service |

> **Scalability Note:** Bulk notifications (Opportunity, Event, Service) use `bulk_create` for efficiency, but sending them to *all* profiles will become slow at scale. Consider a task queue (Celery + Redis) for production.

---

## Admin Panel

The Django admin is accessible at `/admin/`.

**Branding:**
- Header: `Trade Africa Global Business Club Admin`
- Title: `Trade Africa Global Business Club Admin Portal`
- Index Title: `Welcome to Trade Africa Global Business Club Portal`

Create a superuser with:
```bash
python manage.py createsuperuser
```

---

## Known Development Notes

- **`OTP_DEBUG.txt`**: OTP codes are written to this file in development. Remove or disable this in production (`accounts/views.py`, `RegisterView` and `ResendOTPView`).
- **Secret Key**: The `SECRET_KEY` in `settings.py` is the default insecure Django key. **It must be replaced before any deployment.**
- **SQLite**: The current database is SQLite (`db.sqlite3`). This is not suitable for multi-user production environments.
- **Currency conversion**: The `Opportunity.save()` method makes a synchronous HTTP request to `open.er-api.com`. This blocks the request thread and may cause failures if the external API is slow or down (errors are silently swallowed).
- **No rate limiting**: There is currently no rate limiting on the API endpoints. This should be added (e.g., via `django-ratelimit`) before production, especially on auth endpoints.

---

## Production Checklist

- [ ] Replace `SECRET_KEY` with a securely generated key
- [ ] Set `DEBUG = False`
- [ ] Set `ALLOWED_HOSTS` to your domain
- [ ] Switch database to PostgreSQL
- [ ] Configure a production email backend (SMTP/SendGrid/SES)
- [ ] Move `GOOGLE_CLIENT_ID` to an environment variable
- [ ] Set `FRONTEND_URL` and `CORS_ALLOWED_ORIGINS` to production URLs
- [ ] Remove or disable the `OTP_DEBUG.txt` file writer in `accounts/views.py`
- [ ] Configure `STATIC_ROOT` and run `python manage.py collectstatic`
- [ ] Configure `MEDIA_ROOT` or use a cloud storage backend (S3, GCS)
- [ ] Serve the application with Gunicorn + Nginx (not `runserver`)
- [ ] Add rate limiting to authentication endpoints
- [ ] Move bulk notification dispatch to an async task queue (Celery)
- [ ] Enable HTTPS / SSL
- [ ] Review and tighten CORS settings

---

*Last updated: April 2026*
