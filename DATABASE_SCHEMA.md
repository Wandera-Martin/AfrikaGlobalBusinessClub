# 🗄️ AGBC Unified Platform - Database Schema

## Overview

Complete database architecture for the Afrika Global Business Club unified platform integrating three modules:
- **AGBC Core** - Community & Networking
- **Marketplace** - B2B Commerce
- **Index Directory** - Verified Business Listings

---

## 📊 Module Breakdown

### Shared Core Tables (3)
- `user_profiles` - Shared user identity (from OnSpace Cloud)
- `companies` - Shared company profiles across all modules
- `country_mappings` - Geographic reference data

### AGBC Core Module (13 tables)
- `products` - Company product catalog
- `certifications` - Business certifications
- `posts` - Community feed posts
- `comments` - Post comments
- `post_likes` - Like tracking
- `opportunities` - Trade opportunities
- `applications` - Opportunity applications
- `messages` - Direct messaging
- `services` - Service marketplace
- `events` - Events and webinars
- `event_registrations` - Event attendees

### Marketplace Module (15 tables)
- `marketplace_products` - Product listings
- `product_variants` - Product variations
- `pricing_tiers` - Bulk pricing
- `supplier_profiles` - Supplier details
- `rfqs` - Request for quotations
- `rfq_responses` - Quote submissions
- `marketplace_orders` - Order records
- `order_items` - Order line items
- `marketplace_reviews` - Product/supplier reviews
- `escrow_transactions` - Payment escrow
- `disputes` - Order disputes
- `marketplace_categories` - Product categories

### Index Directory Module (5 tables)
- `company_listings` - Verified directory listings
- `sector_classifications` - Industry categories
- `ranking_factors` - Ranking algorithm data
- `listing_visibility` - View tracking

---

## 🔑 Key Relationships

### One Account → Multiple Module Identities

```
user_profiles (shared identity)
    ├── companies (shared profile)
    │   ├── products (AGBC Core)
    │   ├── certifications (AGBC Core)
    │   ├── marketplace_products (Marketplace)
    │   └── company_listings (Index)
    │
    ├── posts (AGBC Core)
    ├── opportunities (AGBC Core)
    ├── marketplace_orders (Marketplace - buyer side)
    ├── supplier_profiles (Marketplace)
    └── messages (Cross-platform)
```

### Cross-Module Data Flow

**Scenario: Order Completed**
```
1. marketplace_orders.status → 'Delivered'
2. Trigger updates → supplier_profiles.total_orders++
3. Trigger updates → companies.trade_readiness_score++
4. Trigger updates → company_listings.ranking_score++
```

---

## 🛡️ Security - Row Level Security (RLS)

All tables have RLS enabled with the following patterns:

### Public Read
```sql
-- Anyone can view active/public content
create policy "public_read_*" 
  on table_name for select 
  using (is_active = true);
```

### Owner Management
```sql
-- Users manage their own data
create policy "users_manage_own_*"
  on table_name for all
  using (auth.uid() = user_id);
```

### Scoped Access
```sql
-- Access based on relationships
create policy "buyers_and_suppliers_read_orders"
  on marketplace_orders for select
  using (auth.uid() = buyer_id or auth.uid() = supplier_id);
```

---

## ⚡ Triggers & Automation

### Profile Completion Calculator
**Trigger:** `trigger_calculate_profile_completion`
**Table:** `companies`
**Purpose:** Auto-calculate profile completion percentage based on filled fields

**Scoring:**
- Basic info (40%): name, description, sector, country
- Contact details (30%): website, logo, year established
- Export readiness (30%): export markets, certifications

### Post Engagement Counters
**Triggers:** 
- `trigger_update_post_likes` on `post_likes`
- `trigger_update_post_comments` on `comments`

**Purpose:** Maintain denormalized counts for performance

### Order Number Generator
**Trigger:** `trigger_generate_order_number`
**Table:** `marketplace_orders`
**Format:** `ORD-YYYYMMDD-{uuid-prefix}`

### Auto-Create Directory Listing
**Trigger:** `trigger_auto_create_listing`
**Table:** `companies`
**Purpose:** Automatically create Index directory entry when company profile is created

---

## 📈 Performance Indexes

### AGBC Core Indexes
```sql
idx_posts_user_id              -- Fast user post lookup
idx_posts_created_at           -- Chronological feed
idx_posts_sector_tag           -- Sector filtering
idx_opportunities_sector       -- Opportunity search
idx_messages_participants      -- Messaging queries
```

### Marketplace Indexes
```sql
idx_marketplace_products_supplier    -- Supplier products
idx_marketplace_products_category    -- Category browsing
idx_rfqs_buyer                       -- Buyer RFQ management
idx_orders_buyer / idx_orders_supplier -- Order tracking
idx_reviews_supplier                 -- Supplier rating calc
```

### Index Directory Indexes
```sql
idx_listings_sector            -- Sector filtering
idx_listings_country           -- Geographic search
idx_listings_ranking           -- Top companies
idx_listings_slug              -- SEO-friendly URLs
idx_listings_verified          -- Verified-only filter
```

---

## 🔄 Cross-Module Event Triggers (Future Enhancement)

### Planned Event Triggers

**1. Order Completion Event**
```sql
-- When order is delivered
ON marketplace_orders UPDATE (status = 'Delivered')
  → UPDATE companies.trade_readiness_score
  → UPDATE company_listings.ranking_score
  → INSERT INTO notifications
```

**2. Review Submission Event**
```sql
-- When review is created
ON marketplace_reviews INSERT
  → UPDATE supplier_profiles.rating (avg)
  → UPDATE company_listings.ranking_score
  → UPDATE ranking_factors.testimonials
```

**3. Opportunity Application Event**
```sql
-- When SME applies to opportunity
ON applications INSERT
  → UPDATE companies.trade_readiness_score
  → UPDATE ranking_factors.engagement
  → INSERT INTO notifications (to opportunity poster)
```

---

## 📊 Ranking Algorithm (Index Module)

### Ranking Score Calculation

```typescript
Ranking Score (0-100) = 
  profile_completeness × 0.25 +
  verification_status  × 0.20 +
  engagement          × 0.20 +
  export_readiness    × 0.15 +
  certifications      × 0.10 +
  testimonials        × 0.05 +
  activity_level      × 0.05
```

### Ranking Tiers
- **Elite** (90-100) - Top 10% performers
- **Premium** (80-89) - High quality verified
- **Featured** (70-79) - Good standing
- **Standard** (below 70) - Basic listing

### Update Frequency
- Real-time: Profile updates
- Daily batch: Engagement metrics, view counts
- Weekly batch: Export readiness, market analysis

---

## 🔍 Search Strategy

### Full-Text Search Columns

**Companies:**
- `company_name` (weighted 10x)
- `description` (weighted 5x)
- `sector` (weighted 3x)
- `keywords[]` (weighted 2x)

**Products:**
- `name` (weighted 10x)
- `description` (weighted 5x)
- `category` (weighted 3x)

**Opportunities:**
- `title` (weighted 10x)
- `description` (weighted 5x)
- `sector` (weighted 3x)

### Filter Combinations
```sql
-- Example: Multi-filter query
SELECT * FROM company_listings
WHERE 
  sector = 'Agriculture' AND
  country = 'Kenya' AND
  verified = true AND
  ranking_score >= 70
ORDER BY ranking_score DESC
LIMIT 20;
```

---

## 💾 Data Retention Policies

### Active Data
- All current records maintained indefinitely
- Soft deletes preferred over hard deletes

### Archived Data
- Completed orders: 7 years (legal requirement)
- Messages: 2 years
- View tracking: 90 days
- Event registrations: 1 year after event

### Audit Trail
- All deletions logged
- Status changes tracked via `updated_at`
- Critical operations require admin approval

---

## 🚀 Scaling Considerations

### Current Architecture
- PostgreSQL 15+
- Single database cluster
- RLS for security
- Indexed for performance

### Future Optimizations

**Read Replicas:**
- Public directory queries → Read replica
- Marketplace product browse → Read replica
- Write operations → Primary

**Partitioning:**
- `posts` by created_at (monthly)
- `messages` by created_at (monthly)
- `marketplace_orders` by created_at (yearly)

**Caching Layer:**
- Redis for frequently accessed data
- Company profiles (1 hour TTL)
- Product listings (30 min TTL)
- Search results (15 min TTL)

---

## 📝 Sample Queries

### Get User's Complete Profile
```sql
SELECT 
  u.*,
  c.*,
  sp.tier as marketplace_tier,
  cl.ranking_score as directory_ranking
FROM user_profiles u
LEFT JOIN companies c ON c.user_id = u.id
LEFT JOIN supplier_profiles sp ON sp.user_id = u.id
LEFT JOIN company_listings cl ON cl.user_id = u.id
WHERE u.id = :user_id;
```

### Top Ranked Companies by Sector
```sql
SELECT 
  cl.*,
  c.logo_url,
  c.export_markets
FROM company_listings cl
JOIN companies c ON c.id = cl.company_id
WHERE 
  cl.sector = :sector AND
  cl.verified = true AND
  cl.status = 'Active'
ORDER BY cl.ranking_score DESC
LIMIT 50;
```

### Marketplace Product Search
```sql
SELECT 
  mp.*,
  sp.rating as supplier_rating,
  sp.tier as supplier_tier,
  c.company_name
FROM marketplace_products mp
JOIN supplier_profiles sp ON sp.user_id = mp.supplier_id
JOIN companies c ON c.user_id = mp.supplier_id
WHERE 
  mp.category = :category AND
  mp.is_active = true AND
  mp.availability = 'In Stock'
ORDER BY sp.rating DESC, mp.views_count DESC
LIMIT 20;
```

---

## 🔧 Maintenance Tasks

### Daily
- Recalculate ranking scores for updated listings
- Update product view counts
- Process pending reviews

### Weekly
- Archive old messages
- Cleanup expired opportunities
- Update engagement metrics

### Monthly
- Generate analytics reports
- Audit RLS policies
- Optimize query performance

---

## 📞 Schema Management

### Migrations
All schema changes tracked in version-controlled migration files:
```
migrations/
  001_initial_schema.sql
  002_add_marketplace_module.sql
  003_add_index_module.sql
  004_cross_module_triggers.sql
```

### Rollback Strategy
Each migration includes:
- Forward migration (UP)
- Rollback script (DOWN)
- Data transformation steps
- Validation queries

---

## ✅ Schema Validation Checklist

- [x] All tables have RLS enabled
- [x] Foreign keys use `on delete cascade` appropriately
- [x] Timestamps use `timestamptz` for timezone awareness
- [x] Unique constraints on natural keys (email, slug, etc.)
- [x] Indexes on all foreign keys
- [x] Indexes on frequently filtered columns
- [x] Triggers maintain data consistency
- [x] Default values set appropriately
- [x] Check constraints for data validation

---

**Schema Version:** 1.0.0  
**Last Updated:** February 18, 2026  
**Total Tables:** 36  
**Total Indexes:** 25+  
**Total Triggers:** 7
