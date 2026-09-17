-- 02_indexes_and_functions.sql
-- Performance Indexes & Calculation Functions (Following supabase-postgres-best-practices)

-- 1. Foreign Key Indexes (CRITICAL: Prevents table scans on cascades & joins)
CREATE INDEX IF NOT EXISTS idx_vendors_profile_id ON public.vendors(profile_id);
CREATE INDEX IF NOT EXISTS idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_product_customization_product_id ON public.product_customization_options(product_id);
CREATE INDEX IF NOT EXISTS idx_post_interactions_product_id ON public.post_interactions(product_id);
CREATE INDEX IF NOT EXISTS idx_post_interactions_user_id ON public.post_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_vendor_id ON public.orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON public.orders(product_id);
CREATE INDEX IF NOT EXISTS idx_rfq_requests_customer_id ON public.rfq_requests(customer_id);
CREATE INDEX IF NOT EXISTS idx_rfq_offers_rfq_id ON public.rfq_offers(rfq_id);
CREATE INDEX IF NOT EXISTS idx_rfq_offers_vendor_id ON public.rfq_offers(vendor_id);
CREATE INDEX IF NOT EXISTS idx_delivery_confirmations_order_id ON public.delivery_confirmations(order_id);
CREATE INDEX IF NOT EXISTS idx_disputes_order_id ON public.disputes(order_id);

-- 2. Query Optimization & Partial Indexes
-- Optimized Feed Query: Category + Trending Score
CREATE INDEX IF NOT EXISTS idx_products_category_trending 
ON public.products(category, trending_score DESC) 
WHERE post_type = 'available';

-- Recent products index
CREATE INDEX IF NOT EXISTS idx_products_created_at_desc 
ON public.products(created_at DESC);

-- Pending orders for auto-confirm 72h cron job
CREATE INDEX IF NOT EXISTS idx_orders_auto_confirm 
ON public.orders(status, auto_confirm_deadline) 
WHERE status = 'delivered_pending_confirm';

-- 3. Function: Calculate Trending Score for Furniture Posts
-- Formula: (Likes * 1 + Comments * 2 + Saves * 3) / ((Hours + 2) ^ 1.2) * Vendor_Tier_Multiplier
CREATE OR REPLACE FUNCTION public.calculate_product_trending_score(p_id UUID)
RETURNS DOUBLE PRECISION AS $$
DECLARE
    v_likes INT;
    v_comments INT;
    v_saves INT;
    v_hours_old NUMERIC;
    v_tier_multiplier NUMERIC := 1.0;
    v_vendor_tier VARCHAR(20);
    v_score DOUBLE PRECISION;
BEGIN
    -- Count interactions
    SELECT 
        COUNT(*) FILTER (WHERE type = 'like'),
        COUNT(*) FILTER (WHERE type = 'comment'),
        COUNT(*) FILTER (WHERE type = 'save')
    INTO v_likes, v_comments, v_saves
    FROM public.post_interactions
    WHERE product_id = p_id;

    -- Age in hours
    SELECT EXTRACT(EPOCH FROM (NOW() - created_at)) / 3600.0
    INTO v_hours_old
    FROM public.products
    WHERE id = p_id;

    -- Vendor Tier Multiplier
    SELECT v.tier INTO v_vendor_tier
    FROM public.products p
    JOIN public.vendors v ON p.vendor_id = v.id
    WHERE p.id = p_id;

    IF v_vendor_tier = 'premium' THEN
        v_tier_multiplier := 1.3;
    ELSIF v_vendor_tier = 'verified' THEN
        v_tier_multiplier := 1.15;
    ELSE
        v_tier_multiplier := 1.0;
    END IF;

    -- Compute score
    v_score := ((v_likes * 1.0 + v_comments * 2.0 + v_saves * 3.0) / POWER(COALESCE(v_hours_old, 0) + 2.0, 1.2)) * v_tier_multiplier;

    -- Update product table
    UPDATE public.products
    SET trending_score = v_score, updated_at = NOW()
    WHERE id = p_id;

    RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger: Update interaction score when a user likes/comments/saves
CREATE OR REPLACE FUNCTION public.trigger_update_trending_score()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        PERFORM public.calculate_product_trending_score(OLD.product_id);
    ELSE
        PERFORM public.calculate_product_trending_score(NEW.product_id);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_interaction_trending ON public.post_interactions;
CREATE TRIGGER trg_interaction_trending
AFTER INSERT OR DELETE ON public.post_interactions
FOR EACH ROW EXECUTE FUNCTION public.trigger_update_trending_score();
