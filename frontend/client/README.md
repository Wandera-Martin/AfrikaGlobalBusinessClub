# Trade Africa Global Business Club — Frontend Client

> A React + TypeScript SPA (Single Page Application) serving as the user interface for the AG Business B2B networking platform.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Configuration](#environment-configuration)
6. [Routing](#routing)
7. [Pages](#pages)
8. [Component Architecture](#component-architecture)
9. [Services (API Layer)](#services-api-layer)
10. [Authentication & Token Management](#authentication--token-management)
11. [State Management & Context](#state-management--context)
12. [Key UI Patterns](#key-ui-patterns)
13. [Build & Deployment](#build--deployment)
14. [Known Issues & Development Notes](#known-issues--development-notes)

---

## Project Overview

This is the frontend for **Trade Africa Global Business Club (AG Business)**. It is a Single Page Application built with React and TypeScript, backed by a Django REST Framework API. The client handles all authentication flows, business profile onboarding, content browsing, messaging, and notifications through a fully responsive, Tailwind CSS-styled interface.

---

## Technology Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 8.x | Build tool & dev server |
| React Router DOM | 6.x | Client-side routing |
| Tailwind CSS | 3.x | Utility-first styling |
| `@react-oauth/google` | 0.13.x | Google OAuth integration |
| `lucide-react` | 0.577.x | Icon library |

---

## Project Structure

```
frontend/client/
├── src/
│   ├── App.tsx                   # Root component: routing + protected routes
│   ├── main.tsx                  # React entry point
│   │
│   ├── pages/                    # Top-level route components
│   │   ├── LandingPage.tsx       # Public marketing/landing page
│   │   ├── RegisterPage.tsx      # Multi-step registration + OTP verification
│   │   ├── LoginPage.tsx         # Login + Google OAuth
│   │   ├── ResetPasswordPage.tsx # Forgot password + reset flow
│   │   ├── DashboardPage.tsx     # Main authenticated feed dashboard
│   │   ├── OpportunitiesPage.tsx # Trade opportunities board
│   │   ├── ServicesPage.tsx      # Platform services catalogue
│   │   ├── EventsPage.tsx        # Business events listing
│   │   ├── MessagesPage.tsx      # Messaging (DMs + global chat)
│   │   ├── NetworkPage.tsx       # Business network / member directory
│   │   └── Onboarding/           # Business profile onboarding wizard
│   │       ├── index.tsx         # Wizard controller (step state)
│   │       ├── Step1BusinessInfo.tsx
│   │       ├── Step2Operations.tsx
│   │       ├── Step3Membership.tsx
│   │       └── Step4Review.tsx
│   │
│   ├── components/               # Reusable UI components
│   │   ├── Navigation/
│   │   │   ├── ProtectedLayout.tsx     # Sidebar + topbar shell for auth pages
│   │   │   ├── AccountDropdown.tsx     # User account menu (top-right)
│   │   │   └── NotificationDropdown.tsx# Notification bell + dropdown
│   │   ├── Dashboard/
│   │   │   ├── PostCard.tsx            # Rich post card (like, comment, save, share)
│   │   │   ├── PostsSection.tsx        # Feed list with create-post UI
│   │   │   ├── EventCard.tsx           # Event card for events page
│   │   │   └── ServiceCard.tsx         # Service card for services page
│   │   ├── OtpInput.tsx               # 6-digit OTP input field component
│   │   ├── VerificationModal.tsx       # OTP verification modal (post-registration)
│   │   ├── ConfirmModal.tsx            # Generic confirmation dialog
│   │   └── GoogleIcon.tsx              # Google SVG icon
│   │
│   ├── services/                 # API service modules (one per backend app)
│   │   ├── authApi.ts            # Authentication endpoints
│   │   ├── businessApi.ts        # Business profile endpoints
│   │   ├── postsApi.ts           # Feed posts & comments
│   │   ├── opportunitiesApi.ts   # Opportunities CRUD + apply
│   │   ├── servicesApi.ts        # Platform services
│   │   ├── eventsApi.ts          # Events + registration
│   │   ├── messagesApi.ts        # Conversations + messages
│   │   └── notificationsApi.ts   # Notifications + mark-read
│   │
│   ├── context/
│   │   └── ToastContext.tsx       # Global toast notification system
│   │
│   ├── utils/
│   │   ├── fetchWithAuth.ts      # Authenticated fetch interceptor (auto token refresh)
│   │   └── passwordStrength.ts   # Password strength checker utility
│   │
│   └── types/                    # Shared TypeScript type definitions
│
├── public/                       # Static assets (favicon, etc.)
├── index.html                    # HTML entry point
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ (Node 20+ recommended)
- **npm** 9+
- The [backend server](../../README_BACKEND.md) running at `http://127.0.0.1:8000`

### Installation

```bash
# From the project root, navigate to the frontend client
cd frontend/client

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at: **`http://localhost:5173`**

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start Vite dev server with HMR |
| Build | `npm run build` | Compile TypeScript + bundle for production |
| Preview | `npm run preview` | Preview the production build locally |
| Lint | `npm run lint` | Run ESLint |

---

## Environment Configuration

The API base URL is currently **hardcoded** in `src/services/authApi.ts`:

```ts
const API_BASE = 'http://127.0.0.1:8000/api/v1';
```

For a proper multi-environment setup, this should be moved to a Vite environment variable:

1. Create a `.env` file in `frontend/client/`:
   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
   ```

2. Update all service files to use:
   ```ts
   const API_BASE = import.meta.env.VITE_API_BASE_URL;
   ```

3. For production, set `VITE_API_BASE_URL` to your deployed API URL.

> **Note:** All `.env` files are gitignored by default in Vite projects. Do not commit secrets to source control.

---

## Routing

Routes are defined in `src/App.tsx` using React Router v6.

### Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `LandingPage` | Marketing landing page |
| `/login` | `LoginPage` | Login with email/password or Google |
| `/register` | `RegisterPage` | Multi-step registration + OTP verification |
| `/reset-password` | `ResetPasswordPage` | Password reset (uses uid + token from email link) |

### Protected Routes (Require Authentication)

All protected routes are wrapped in `ProtectedLayout`, which provides the sidebar navigation and topbar.

| Path | Component | Description |
|------|-----------|-------------|
| `/onboarding` | `OnboardingPage` | Business profile setup wizard |
| `/dashboard` | `DashboardPage` | Activity feed |
| `/opportunities` | `OpportunitiesPage` | Trade opportunity board |
| `/services` | `ServicesPage` | Platform services |
| `/events` | `EventsPage` | Business events |
| `/network` | `NetworkPage` | Member directory / network |
| `/messages` | `MessagesPage` | Direct messaging |

### Route Protection Logic

- `ProtectedRoute` checks for `access_token` in `localStorage`.
- If the token is absent, the user is redirected to `/login`.
- If an authenticated user visits an unknown path, they are redirected to `/`.

---

## Pages

### `LandingPage`
The public marketing page. Contains the platform's hero section, feature highlights, and call-to-action buttons (Register / Login). Accepts `onRegister` and `onLogin` props for navigation.

### `RegisterPage`
A multi-step registration form:
1. **Personal Info** — First name, last name, email, password, role (SME/Buyer)
2. **OTP Verification** — Renders `VerificationModal` for 6-digit code input after form submission

After successful OTP verification, the user receives JWT tokens, which are stored in `localStorage`, and is navigated to `/dashboard`.

### `LoginPage`
Email/password login form. Includes:
- **Google OAuth** button (powered by `@react-oauth/google`)
- Link to forgot password flow
- Link to the registration page

### `ResetPasswordPage`
Handles both stages of password reset:
1. **Request stage**: Email input → `POST /auth/forgot-password/`
2. **Reset stage**: New password form (auto-detected from `?uid=` + `?token=` query params) → `POST /auth/reset-password/`

### `DashboardPage`
The main authenticated view. Renders `PostsSection` which:
- Shows a feed of all posts
- Allows creating new posts (text, media, article)
- Each post uses `PostCard` with like, comment, save, and share actions

### `OnboardingPage`
A 4-step wizard (`Onboarding/index.tsx`) for completing the business profile:
| Step | Component | Fields |
|------|-----------|--------|
| 1 | `Step1BusinessInfo` | Company name, description, website, year, employee count, revenue |
| 2 | `Step2Operations` | Country, primary sector, additional sectors |
| 3 | `Step3Membership` | Membership tier selection |
| 4 | `Step4Review` | Summary + submit |

Users can also **skip** onboarding, which calls `POST /api/v1/business/profile/skip/`.

### `OpportunitiesPage`
Browse and create trade opportunities. Supports filtering by opportunity type and allows businesses to apply directly from the card.

### `MessagesPage`
Full messaging interface with:
- Left panel: conversation list (private DMs + global AIO chat)
- Right panel: message thread for the selected conversation
- New message composer at the bottom

### `NetworkPage`
Displays all business profiles in a card grid layout for network discovery.

### `ServicesPage` & `EventsPage`
Browse platform services and events with registration/application actions.

---

## Component Architecture

### `ProtectedLayout`
The shell that wraps all authenticated pages. Contains:
- **Sidebar navigation** with links to all main sections
- **Top bar** with the platform logo, notification bell, and account dropdown
- An `<Outlet />` for rendering the current page

### `PostCard`
The most feature-rich component in the project. Renders a feed post with:
- Business profile info (avatar, name, timestamp)
- Post content (text, image, video)
- Engagement buttons: Like, Comment, Share, Save/Bookmark
- Comment expansion panel with inline comment creation
- Delete action (post owner only)
- Opportunity-specific metadata (if post type is `opportunity`)

### `PostsSection`
Manages the feed list and post creation. Handles:
- Fetching and displaying the post list
- Create-post dialog (type selection, file upload)
- Pagination / infinite scroll state

### `OtpInput`
A custom 6-digit OTP input component. Each digit has its own `<input>` element with:
- Auto-focus to the next field on input
- Backspace support (moves focus to the previous field)
- Paste support (distributes pasted string across fields)

### `VerificationModal`
A modal dialog shown after registration to collect the OTP. Wraps `OtpInput` and handles the `POST /auth/verify-otp/` call.

### `NotificationDropdown`
A polling-based notification dropdown:
- Fetches notifications from the API on open
- Displays unread count badge on the bell icon
- Allows marking individual notifications as read

### `ToastContext`
A React Context providing a global `showToast(message, type)` function. Toast notifications appear at the top-right corner of the screen. Types: `success`, `error`, `info`.

---

## Services (API Layer)

All API calls are organized in `src/services/`. Each file maps to a backend Django app.

### Auth (`authApi.ts`)

All auth calls use plain `fetch` (no auth header needed):

| Function | Method | Endpoint |
|----------|--------|----------|
| `apiRegister` | POST | `/auth/register/` |
| `apiLogin` | POST | `/auth/login/` |
| `apiVerifyOtp` | POST | `/auth/verify-otp/` |
| `apiResendOtp` | POST | `/auth/resend-otp/` |
| `apiForgotPassword` | POST | `/auth/forgot-password/` |
| `apiResetPassword` | POST | `/auth/reset-password/` |
| `apiGoogleAuth` | POST | `/auth/google/` |
| `apiLogout` | POST | `/auth/logout/` |
| `apiRefreshToken` | POST | `/auth/token/refresh/` |

### Other Services

All other service files use `fetchWithAuth` (see below) for automatic token injection:

| File | Covers |
|------|--------|
| `businessApi.ts` | Profile CRUD, skip onboarding, list profiles, country list |
| `postsApi.ts` | Post CRUD, like, save, share, comments |
| `opportunitiesApi.ts` | Opportunity list/create, apply, save |
| `servicesApi.ts` | List services, apply |
| `eventsApi.ts` | List events, register/cancel |
| `messagesApi.ts` | Conversations, messages |
| `notificationsApi.ts` | List notifications, mark as read |

---

## Authentication & Token Management

### Token Storage

JWT tokens are stored in the browser's `localStorage`:
- `access_token` — Short-lived (5 min), sent with every API request
- `refresh_token` — Long-lived (30 days), used to obtain new access tokens

### `fetchWithAuth` Interceptor (`src/utils/fetchWithAuth.ts`)

This is the core authenticated HTTP utility. It wraps the native `fetch` API with the following behaviours:

1. **Proactive token refresh**: Before every request, the JWT payload is decoded and the expiry is checked. If the access token is expired (or will expire within 10 seconds), a refresh is triggered automatically *before* the request is made.

2. **Concurrent request queuing**: If multiple requests arrive simultaneously with an expired token, only the first triggers the refresh. All others are queued and resolved once the new token is available.

3. **Automatic logout on 401**: If the backend returns `401 Unauthorized`, all tokens are cleared from `localStorage` and the user is redirected to `/login`.

4. **403 custom event**: If the backend returns `403 Forbidden`, a `"auth-forbidden"` custom DOM event is dispatched so components can display a graceful error toast.

5. **FormData support**: If the request body is a `FormData` instance, the `Content-Type` header is intentionally omitted so the browser can set the correct `multipart/form-data` boundary.

### Google OAuth Flow

1. User clicks "Continue with Google" → `@react-oauth/google` opens the Google consent screen.
2. On success, Google returns an access token to the frontend.
3. The access token is sent to `POST /api/v1/auth/google/`.
4. The backend verifies it with Google's userinfo API and returns JWT tokens.
5. If `response.created === true`, the user is new and is redirected to `/onboarding`.

---

## State Management & Context

The app does **not** use a global state management library (no Redux, Zustand, etc.). State is managed locally in components with React `useState` and `useEffect` hooks.

The only shared global state is:
- **`ToastContext`** (`src/context/ToastContext.tsx`): Provides `showToast` to any component in the tree via `useContext`.

Authentication state is derived directly from `localStorage` — if `access_token` exists, the user is considered authenticated.

---

## Key UI Patterns

### Form Validation
All forms use controlled React inputs with local state. Validation is done inline before API calls. Errors are displayed below the relevant field or via the toast system.

### Error Handling
API service functions throw the parsed JSON error body on non-OK responses (`if (!res.ok) throw result`). Call sites use `try/catch` blocks and display errors via:
- Inline error messages in the form
- `showToast('Something went wrong', 'error')` for unexpected errors

### File Uploads
Media posts (images/videos) and business profile photos (dp, cover) are uploaded as `multipart/form-data`. The `fetchWithAuth` utility correctly omits `Content-Type` for `FormData` bodies so the browser sets the correct boundary.

### Responsive Design
The layout uses Tailwind CSS utility classes. The `ProtectedLayout` sidebar collapses on smaller screens. All page content uses `max-w-*` and responsive grid/flex utilities.

---

## Build & Deployment

### Production Build

```bash
npm run build
```

This compiles TypeScript and bundles the app into `frontend/client/dist/`. The output is a set of static HTML, CSS, and JS files.

### Serving the Build

The `dist/` folder can be served by any static file host:
- **Nginx**: Configure a root pointing to `dist/` with a `try_files $uri /index.html` fallback for SPA routing.
- **Vercel / Netlify**: Deploy the `dist/` directory directly. Configure a rewrite rule: all paths → `index.html`.
- **Serve with Django (not recommended for production)**: Django can be configured to serve the built files, but this is not ideal.

### Environment Variable for Production

Before building for production, set:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api/v1
```

And update all service files to use `import.meta.env.VITE_API_BASE_URL` instead of the hardcoded string.

---

## Known Issues & Development Notes

### Hardcoded API Base URL
The API base URL (`http://127.0.0.1:8000/api/v1`) is hardcoded in `src/services/authApi.ts`. Other service files likely mirror this. This must be refactored to use a Vite environment variable before any production deployment.

### No Persistent Auth State
The app checks `localStorage` for `access_token` at route entry. There is no React Context or global store tracking the authenticated user object across the app. Components that need user info (e.g., the business profile name in the topbar) fetch it independently.

### Polling vs. WebSockets for Notifications
The `NotificationDropdown` uses a fetch-on-open pattern (not polling or WebSockets). Real-time notifications require a persistent connection. For production, consider adding Django Channels + WebSockets, or a polling interval.

### Messaging is Not Real-Time
Similarly, the `MessagesPage` does not have real-time message delivery. Messages are loaded on conversation selection and not refreshed automatically. A WebSocket connection via Django Channels would be needed for a live chat experience.

### `src/types/` Types May Be Incomplete
The `types/` directory contains shared TypeScript interfaces. Some API responses may not be fully typed, resulting in `any` usage in certain components. These should be audited and completed.

### Build Warnings
Check `tsc_errors.log` and `build_errors.txt` in the project root for any outstanding TypeScript or build errors that may need resolving before production.

---

*Last updated: April 2026*
