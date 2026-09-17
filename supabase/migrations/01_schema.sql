-- 01_schema.sql
-- Damietta Furniture Marketplace - Initial Database Schema
-- Compatible with Supabase & PostgreSQL 15+

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'vendor', 'admin')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Vendors Table (Furnishing Workshops & Showrooms in Damietta)
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
    business_name VARCHAR(255) NOT NULL,
    commercial_registration VARCHAR(100),
    workshop_address TEXT,
    city VARCHAR(100) DEFAULT 'دمياط' NOT NULL,
    description TEXT,
    logo_url TEXT,
    banner_url TEXT,
    tier VARCHAR(20) DEFAULT 'basic' NOT NULL CHECK (tier IN ('basic', 'verified', 'premium')),
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Products Table (Furniture Items & Portfolio Showcases)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    category VARCHAR(50) NOT NULL CHECK (category IN ('غرف نوم', 'صالونات', 'مطابخ', 'غرف سفرة', 'مكاتب', 'ديكورات وأخرى')),
    media_urls TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    post_type VARCHAR(20) DEFAULT 'available' NOT NULL CHECK (post_type IN ('available', 'portfolio')),
    wood_type VARCHAR(100) DEFAULT 'خشب زان أحمر روماني',
    manufacturing_time_days INT DEFAULT 15,
    trending_score DOUBLE PRECISION DEFAULT 0.0 NOT NULL,
    views_count INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Product Customization Options
CREATE TABLE IF NOT EXISTS public.product_customization_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    option_name VARCHAR(100) NOT NULL, -- e.g., نوع الخشب, المقاس, لون القماش
    values TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
    price_adjustments NUMERIC(12, 2)[] DEFAULT '{}'::NUMERIC(12, 2)[],
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Post Interactions (Likes, Comments, Saves)
CREATE TABLE IF NOT EXISTS public.post_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('like', 'comment', 'save')),
    comment_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_product_interaction UNIQUE (product_id, user_id, type)
);

-- 6. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    order_type VARCHAR(20) DEFAULT 'direct' NOT NULL CHECK (order_type IN ('direct', 'custom', 'rfq')),
    selected_options JSONB DEFAULT '{}'::JSONB,
    quantity INT DEFAULT 1 NOT NULL,
    total_price NUMERIC(12, 2) NOT NULL,
    platform_fee NUMERIC(12, 2) DEFAULT 0 NOT NULL,
    payment_method VARCHAR(20) DEFAULT 'cod' NOT NULL CHECK (payment_method IN ('online', 'cod')),
    payment_status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    status VARCHAR(30) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'processing', 'ready_to_ship', 'shipped', 'delivered_pending_confirm', 'delivered_confirmed', 'cancelled', 'disputed')),
    shipping_address TEXT NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    notes TEXT,
    shipped_at TIMESTAMPTZ,
    auto_confirm_deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. RFQ Requests (General Specification Requests for Damietta Craftsmen)
CREATE TABLE IF NOT EXISTS public.rfq_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    specifications TEXT NOT NULL,
    budget_range VARCHAR(100),
    sample_images TEXT[] DEFAULT '{}'::TEXT[],
    status VARCHAR(20) DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'awarded', 'closed', 'expired')),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. RFQ Offers (Vendor Bids on RFQ)
CREATE TABLE IF NOT EXISTS public.rfq_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES public.rfq_requests(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    price NUMERIC(12, 2) NOT NULL,
    notes TEXT,
    delivery_days INT NOT NULL DEFAULT 20,
    materials_used TEXT,
    status VARCHAR(20) DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_vendor_rfq_offer UNIQUE (rfq_id, vendor_id)
);

-- 9. Delivery Confirmations (Photo/Video Proof with 72h window)
CREATE TABLE IF NOT EXISTS public.delivery_confirmations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE,
    proof_media_urls TEXT[] DEFAULT '{}'::TEXT[],
    customer_notes TEXT,
    confirmed_at TIMESTAMPTZ,
    is_auto_confirmed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. Disputes Table
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE RESTRICT,
    reason TEXT NOT NULL,
    evidence_urls TEXT[] DEFAULT '{}'::TEXT[],
    status VARCHAR(20) DEFAULT 'open' NOT NULL CHECK (status IN ('open', 'under_review', 'resolved_customer', 'resolved_vendor', 'compromised')),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    resolved_at TIMESTAMPTZ
);
