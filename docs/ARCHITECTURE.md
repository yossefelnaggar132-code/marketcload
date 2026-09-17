# 🏛️ Architecture & Developer Guide (دليل البنية المعمارية للمطورين)

> This document provides a complete guide for any software engineer or contributor joining this project to understand its system architecture, state flow, database schema, and how to extend it.

---

## 1. System Overview (نظرة عامة على النظام)

Damietta Furniture Marketplace is an e-commerce platform connecting traditional furniture workshops in Damietta, Egypt, with end customers nationwide.

### Core Pillars:
1. **Feed & Discovery Engine**: Real-time furniture catalog categorized by wood types and rooms with an automated trending algorithm.
2. **RFQ Engine (Request for Quotations)**: Enables custom furniture fabrication by distributing customer specifications to certified workshops.
3. **Escrow & Quality Protection**: Safeguards buyer payments for 72 hours post-delivery, verifying solid red beechwood authenticity and finish.
4. **Vendor Ecosystem**: Workshop onboarding, commercial verification, tier advancement (`Basic` → `Verified` → `Premium`), and dispute resolution.

---

## 2. Technology Stack (البنية التقنية)

| Layer | Technology | Details |
|---|---|---|
| **Framework** | Next.js 14.2 (App Router) | Server-Side Rendering (SSR) & React Client Components |
| **Language** | TypeScript 5.5 | Strictly typed domain models and store interfaces |
| **Styling** | Tailwind CSS 3.4 + PostCSS | Custom wood-craft theme (`brand` and `stone`), RTL-first layout |
| **Icons** | Lucide React | Lightweight SVG icons |
| **Database** | PostgreSQL via Supabase | Row-Level Security (RLS), custom functions, and triggers |
| **State Management** | React Store (`lib/store.ts`) | Reactive local storage syncer with mock and live modes |
| **Testing** | TestSprite CLI | AI-driven end-to-end browser regression testing |

---

## 3. Directory Structure (شجرة المجلدات)

```
damietta-furniture-marketplace/
├── app/                              # Next.js App Router routes
│   ├── admin/                        # Admin dashboard & dispute resolution
│   ├── login/                        # Unified authentication (role switcher)
│   ├── signup/                       # Customer account creation
│   ├── orders/                       # Order lifecycle & tracking
│   │   └── [id]/
│   │       ├── checkout/             # Payment processing (Paymob / COD)
│   │       ├── confirm-delivery/     # Photo proof delivery confirmation
│   │       └── dispute/              # Quality dispute filing center
│   ├── products/[id]/                # Product details with customizer
│   ├── rfq/                          # Custom manufacturing requests
│   │   ├── new/                      # Create custom RFQ
│   │   └── [id]/                     # Vendor bids comparison table
│   ├── vendor/                       # Workshop partner portal
│   │   ├── dashboard/                # Analytics, inventory, order queue
│   │   ├── products/new/             # Upload new listing (Sale vs Portfolio)
│   │   └── signup/                   # Workshop onboarding & CR verification
│   ├── vendors/[id]/                 # Public workshop storefront
│   ├── globals.css                   # Tailwind directives and custom scrollbars
│   ├── layout.tsx                    # Root layout with Navbar and Footer
│   └── page.tsx                      # Homepage with feed and trending ranking
├── components/                       # Modular UI components
│   ├── CategoryTabs.tsx              # Room filters & sorting controls
│   ├── Footer.tsx                    # Marketplace footer with guarantees
│   ├── Navbar.tsx                    # Top navigation, role badges, search
│   ├── ProductCard.tsx               # Product card with optimistic likes/saves
│   └── VendorBadge.tsx               # Verified/Premium trust badges
├── docs/                             # Documentation, PRD & execution roadmap
│   ├── ARCHITECTURE.md               # This technical guide
│   ├── PRD_مارکت_بليس_أثاث_دمياط.md   # Product Requirements Document
│   └── خطة_التنفيذ_التفصيلية_Antigravity.md # 24-week delivery roadmap
├── lib/                              # Core utilities and data layer
│   ├── mock-data.ts                  # Seed data for offline demo mode
│   ├── store.ts                      # Central client-side reactive store
│   └── supabase/                     # Supabase client and server connectors
├── supabase/migrations/              # PostgreSQL schema migrations & RLS
│   ├── 01_schema.sql                 # Table definitions & foreign keys
│   ├── 02_indexes_and_functions.sql  # Trending algorithm & triggers
│   ├── 03_rls_policies.sql           # Data isolation security rules
│   └── 04_seed_data.sql              # Initial Damietta workshop fixtures
├── testsprite-plans/                 # Automated TestSprite test definitions
├── types/                            # Domain TypeScript contracts
│   └── index.ts
└── package.json
```

---

## 4. Database Entities & Relationships (قواعد البيانات)

The PostgreSQL schema (`supabase/migrations/`) enforces relations:

```
[auth.users]
    │
    ▼
[profiles] ──── (role: customer | vendor | admin)
    │
    ├──▶ [vendors] (tier, status, CR, workshop address)
    │        │
    │        ├──▶ [products] (post_type: available | portfolio)
    │        │        │
    │        │        ├──▶ [product_customization_options]
    │        │        └──▶ [post_interactions] (like, save, comment)
    │        │
    │        └──▶ [rfq_offers]
    │
    ├──▶ [rfq_requests] (specs, wood_type, budget)
    │        │
    │        └──▶ [rfq_offers]
    │
    └──▶ [orders] (direct | custom | rfq)
             │
             ├──▶ [delivery_confirmations] (72-hour protection)
             └──▶ [disputes] (freeze escrow funds)
```

---

## 5. Roles & Permissions (الأدوار والصلاحيات)

1. **Customer (العميل)**:
   - Browse listings, filter, search, like, and save pieces.
   - Place direct orders or request customizations.
   - Submit custom RFQs and compare vendor offers.
   - Confirm delivery with photo proof or file quality disputes.

2. **Vendor / Workshop (الورشة أو المعرض)**:
   - Upload ready pieces for sale or showcase completed portfolio works.
   - Configure dynamic customization options (wood type, upholstery, finish).
   - Review open RFQs in their category and submit competitive bids.
   - Track incoming orders, production stages, and shipping.

3. **Admin (إدارة المنصة)**:
   - Verify and approve workshop registrations.
   - Arbitrate buyer-seller disputes and release/refund escrow payments.
   - Monitor platform health, commission metrics, and volume.

---

## 6. How to Continue Development (كيفية إكمال العمل)

### Step 1: Connecting a Real Supabase Project
1. Create a project on [supabase.com](https://supabase.com).
2. Run migrations in `supabase/migrations/` sequentially (01 to 04) in the SQL Editor.
3. Update `.env.local` with your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Step 2: Running Automated Tests
Ensure all changes pass the TestSprite test suite before pushing:
```bash
testsprite test run f4729a7c-f078-4ba1-a030-8d75bbaf9948 --local 3000 --local-host localhost
```

### Step 3: Contribution Guidelines
- Create a feature branch: `git checkout -b feat/my-feature`.
- Follow strict typing in `types/index.ts`.
- Verify compilation: `npx tsc --noEmit`.
- Commit with conventional commits (e.g. `feat:`, `fix:`, `docs:`).
