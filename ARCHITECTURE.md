# 🏗️ AGBC Unified Shell Architecture

## Overview

This document describes the unified shell architecture that integrates three platforms:

1. **AGBC Core** - Business Community & Networking
2. **Afrindex Marketplace** - B2B Commerce Platform (Alibaba-style)
3. **Afrindex Index** - Verified Business Directory

## Architecture Pattern: Unified Shell + Micro-Modules

### Core Principle
- **One navigation shell** across all platforms
- **Persistent user session** maintained globally
- **Module-based routing** with lazy loading
- **Shared authentication** with scoped data domains
- **Event-driven** cross-module communication

---

## 📂 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── UnifiedShell.tsx      # Global navigation shell
│   │   └── Navbar.tsx             # (Legacy - replaced by UnifiedShell)
│   └── ui/                        # Shared UI components
│
├── pages/
│   ├── LandingPage.tsx            # Public landing
│   ├── AuthPage.tsx               # Authentication
│   ├── OnboardingPage.tsx         # User onboarding
│   │
│   ├── DashboardPage.tsx          # AGBC Core: Home feed
│   ├── ProfilePage.tsx            # AGBC Core: Member profiles
│   ├── OpportunitiesPage.tsx      # AGBC Core: Opportunity board
│   ├── MessagingPage.tsx          # AGBC Core: Messaging
│   ├── ServicesPage.tsx           # AGBC Core: Service marketplace
│   ├── EventsPage.tsx             # AGBC Core: Events & webinars
│   ├── SectorPage.tsx             # AGBC Core: Sector communities
│   │
│   ├── MarketplacePage.tsx        # Marketplace: B2B commerce
│   └── IndexPage.tsx              # Index: Company directory
│
├── types/
│   ├── index.ts                   # Core types (User, Company, etc.)
│   ├── marketplace.ts             # Marketplace types (Products, Orders, RFQ)
│   └── index-directory.ts         # Index types (Listings, Rankings)
│
├── lib/
│   ├── auth.ts                    # Shared authentication
│   ├── eventBus.ts                # Cross-module event system
│   ├── mockData.ts                # AGBC Core mock data
│   ├── marketplaceMockData.ts     # Marketplace mock data
│   └── indexMockData.ts           # Index mock data
│
└── constants/
    └── index.ts                   # Shared constants
```

---

## 🧭 Unified Navigation Structure

The navigation follows this mandatory order:

1. **🏠 Home** - `/dashboard` (AGBC Core feed)
2. **📌 Opportunities** - `/opportunities` (AGBC Core)
3. **📰 Events & News** - `/events` (AGBC Core)
4. **🛠 Services** - `/services` (AGBC Core)
5. **💬 Messages** - `/messages` (Cross-platform messaging)
6. **🔔 Notifications** - Dropdown (Global notifications)
7. **🛒 Marketplace** - `/marketplace` (Commerce platform)
8. **📇 Index** - `/index` (Directory platform)
9. **👤 Profile** - `/profile` (User account)

### Implementation: `UnifiedShell.tsx`

The shell provides:
- Persistent top navigation
- Global search across all platforms
- Notification center
- User profile dropdown
- Active module highlighting
- Responsive mobile navigation

---

## 🔐 Shared Identity Service

### Authentication Flow

```typescript
// lib/auth.ts

export interface User {
  id: string;
  email: string;
  role: "SME" | "Buyer" | "Admin";
  membershipTier: "Free" | "Silver" | "Gold" | "Platinum";
  isVerified: boolean;
}

// One account → Three module identities
const user = getCurrentUser();  // Shared across all modules
```

### Module-Specific Data Domains

| Module | Data Domain | Purpose |
|--------|-------------|---------|
| **AGBC Core** | Posts, Opportunities, Events, Messages | Community engagement |
| **Marketplace** | Products, Orders, RFQs, Reviews | B2B commerce |
| **Index** | Company Listings, Rankings, SEO | Business discovery |

**Key Principle:** User identity is shared, but each module maintains its own data tables.

---

## 📡 Cross-Module Event Bus

### Event System Architecture

```typescript
// lib/eventBus.ts

// Event emission
eventBus.publish(EVENTS.ORDER_COMPLETED, {
  orderId: "12345",
  supplierId: "s1",
  amount: 5000
});

// Event subscription
eventBus.subscribe(EVENTS.ORDER_COMPLETED, (data) => {
  // Update trade activity score
  // Update supplier ranking
  // Create notification
});
```

### Event Flow Examples

**1. Marketplace Order Completed**
```
Marketplace → ORDER_COMPLETED
  ↓
  ├─→ AGBC Core: Update trade readiness score
  ├─→ Index: Update supplier ranking
  └─→ Notifications: Notify buyer and seller
```

**2. Review Submitted**
```
Marketplace → REVIEW_SUBMITTED
  ↓
  ├─→ Marketplace: Update supplier rating
  ├─→ Index: Update ranking score
  └─→ AGBC Core: Update trust badge
```

**3. Opportunity Applied**
```
AGBC Core → OPPORTUNITY_APPLIED
  ↓
  ├─→ Index: Update engagement score
  ├─→ Analytics: Track conversion
  └─→ Notifications: Notify poster
```

---

## 🛒 Marketplace Module Features

### Product Management
- Product catalog with variants
- Bulk pricing tiers
- MOQ (Minimum Order Quantity) settings
- Multi-image galleries
- Certification display

### RFQ System
- Buyers post requirements
- Suppliers submit quotes
- Quote comparison
- Direct negotiation

### Order Management
- Shopping cart
- Multi-item checkout
- Order tracking
- Escrow placeholder (for backend)

### Supplier Tiers
- **Basic** - Standard listing
- **Verified** - Identity verified
- **Gold** - Premium features
- **Premium** - Full trade assurance

### Review System
- Product reviews
- Supplier ratings
- Verified purchase badge
- Helpful vote count

---

## 📇 Index Module Features

### Company Listings
- Comprehensive business profiles
- SEO-optimized pages
- Export market display
- Certification showcase
- Product/service listings

### Ranking System

**Ranking Score Calculation:**
```
Ranking Score (0-100) = 
  Profile Completeness (25%) +
  Verification Status (20%) +
  Engagement Metrics (20%) +
  Export Readiness (15%) +
  Certifications (10%) +
  Testimonials (5%) +
  Activity Level (5%)
```

**Ranking Tiers:**
- **Elite** (90-100) - Top performers
- **Premium** (80-89) - High quality
- **Featured** (70-79) - Good standing
- **Standard** (below 70) - Basic listing

### Search & Discovery
- Full-text search
- Sector filtering
- Country filtering
- Certification filtering
- Ranking tier filtering
- Export market filtering

### SEO Metadata
Each listing includes:
- Meta title
- Meta description
- Keywords
- Open Graph image
- Structured data (Schema.org)

---

## 🎨 Design Consistency

All three modules share:

### Color System
```css
--agbc-blue: #1e3a8a      /* Trust, primary */
--agbc-green: #10b981     /* Growth, success */
--agbc-gold: #f59e0b      /* Premium, accent */
```

### Typography
- **Headings:** 600-700 weight
- **Body:** 400 weight
- **Primary font:** Inter

### Component Library
- Shared `components/ui/*` (shadcn/ui)
- Consistent button styles
- Unified card designs
- Standard form elements

---

## 🔄 Module Communication Patterns

### Pattern 1: Direct Data Share
When modules need real-time shared state:
```typescript
// Shared user context
const user = getCurrentUser();  // All modules access same user
```

### Pattern 2: Event-Driven Updates
When modules need to react to changes:
```typescript
// Marketplace publishes
eventBus.publish(EVENTS.ORDER_COMPLETED, data);

// Index subscribes and updates ranking
eventBus.subscribe(EVENTS.ORDER_COMPLETED, updateRanking);
```

### Pattern 3: API-Based Integration (Future)
When backend is enabled:
```typescript
// Marketplace writes to orders table
POST /api/marketplace/orders

// Event trigger updates index
UPDATE index.company_listings 
SET ranking_score = calculate_score(user_id)
```

---

## 📊 Data Schema (Backend Ready)

### Shared Identity Schema
```sql
-- Shared across all modules
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  role VARCHAR,
  membership_tier VARCHAR,
  is_verified BOOLEAN
)
```

### AGBC Core Schema
```sql
companies, posts, comments, opportunities, 
applications, messages, services, events
```

### Marketplace Schema
```sql
marketplace_products, product_variants, pricing_tiers,
supplier_profiles, rfqs, rfq_responses,
orders, order_items, escrow_transactions,
reviews, disputes, categories
```

### Index Schema
```sql
company_listings, sector_classifications,
ranking_factors, seo_metadata, listing_visibility
```

---

## 🚀 Performance Optimizations

### Code Splitting
- Each module loaded on-demand
- Shared dependencies bundled separately
- Route-based lazy loading

### Caching Strategy
- User session cached
- Frequently accessed data cached
- Search results cached with TTL

### Bundle Optimization
- Tree-shaking for unused code
- Component lazy loading
- Image optimization (WebP)

---

## 🔒 Security Considerations

### Authentication
- JWT-based session
- Role-based access control (RBAC)
- Module-scoped permissions

### Data Isolation
- Each module queries own tables
- Cross-module access via events only
- Secure API gateway (when backend enabled)

### File Uploads
- S3 secure storage
- Virus scanning
- File type validation
- Size limits enforced

---

## 📈 Analytics & Tracking

### Cross-Module Metrics
- User engagement across platforms
- Module switching frequency
- Conversion funnels
- Drop-off points

### Module-Specific Metrics

**AGBC Core:**
- Post engagement
- Opportunity applications
- Message volume

**Marketplace:**
- Product views
- Cart abandonment
- Order completion rate

**Index:**
- Profile views
- Inquiry rate
- Ranking score trends

---

## 🛠 Development Workflow

### Adding New Features

**1. Determine Module Ownership**
```
Is it commerce? → Marketplace
Is it discovery? → Index
Is it community? → AGBC Core
```

**2. Add Types**
```typescript
// types/[module].ts
export interface NewFeature { ... }
```

**3. Add Mock Data**
```typescript
// lib/[module]MockData.ts
export const mockNewFeature = [ ... ];
```

**4. Build UI Components**
```typescript
// pages/[Module]Page.tsx
// components/features/[Feature].tsx
```

**5. Publish Events (if needed)**
```typescript
eventBus.publish(EVENTS.NEW_EVENT, data);
```

### Testing Cross-Module Integration

```typescript
// Test event flow
eventBus.publish(EVENTS.ORDER_COMPLETED, testData);
// Verify: AGBC score updated
// Verify: Index ranking updated
// Verify: Notification created
```

---

## 🔮 Future Enhancements (Phase 2+)

### Backend Integration
- Enable OnSpace Cloud
- Set up database tables
- Implement API endpoints
- Connect event bus to backend

### AI Features
- Smart supplier matching
- Product recommendations
- Fraud detection
- Price optimization

### Advanced Commerce
- Real-time inventory
- Multi-currency support
- Shipping integrations
- Payment gateway (Stripe)

### Mobile App
- React Native version
- Native push notifications
- Offline mode
- QR code scanner

---

## 📞 Support & Documentation

For questions about:
- **Architecture:** Refer to this document
- **Authentication:** See `lib/auth.ts`
- **Events:** See `lib/eventBus.ts`
- **Types:** See `types/` directory
- **UI Components:** See shadcn/ui docs

---

## ✅ Checklist: New Module Integration

- [ ] Define module-specific types in `types/[module].ts`
- [ ] Create mock data in `lib/[module]MockData.ts`
- [ ] Build main module page in `pages/[Module]Page.tsx`
- [ ] Add route to `App.tsx`
- [ ] Add navigation item to `UnifiedShell.tsx`
- [ ] Define cross-module events in `eventBus.ts`
- [ ] Test module isolation
- [ ] Test event communication
- [ ] Update this documentation

---

**Version:** 1.0  
**Last Updated:** February 2026  
**Maintained By:** Trade Afrika Group
