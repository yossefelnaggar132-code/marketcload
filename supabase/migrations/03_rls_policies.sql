-- 03_rls_policies.sql
-- Row Level Security (RLS) Policies for Multi-Role Marketplace (Customer / Vendor / Admin)

-- Enable RLS on all public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_customization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current auth user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Vendors Policies
CREATE POLICY "Approved vendors are viewable by everyone" 
ON public.vendors FOR SELECT 
USING (status = 'approved' OR profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "Vendors can update their own store details" 
ON public.vendors FOR UPDATE 
USING (profile_id = auth.uid() OR public.is_admin());

CREATE POLICY "New vendors can register" 
ON public.vendors FOR INSERT 
WITH CHECK (profile_id = auth.uid());

-- 3. Products Policies
CREATE POLICY "Products are publicly viewable" 
ON public.products FOR SELECT USING (true);

CREATE POLICY "Vendors can insert their own products" 
ON public.products FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.vendors 
        WHERE id = vendor_id AND profile_id = auth.uid()
    ) OR public.is_admin()
);

CREATE POLICY "Vendors can update their own products" 
ON public.products FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.vendors 
        WHERE id = vendor_id AND profile_id = auth.uid()
    ) OR public.is_admin()
);

CREATE POLICY "Vendors can delete their own products" 
ON public.products FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.vendors 
        WHERE id = vendor_id AND profile_id = auth.uid()
    ) OR public.is_admin()
);

-- 4. Product Customization Options Policies
CREATE POLICY "Customization options are publicly viewable" 
ON public.product_customization_options FOR SELECT USING (true);

CREATE POLICY "Vendors can manage customization options for their products" 
ON public.product_customization_options FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.products p
        JOIN public.vendors v ON p.vendor_id = v.id
        WHERE p.id = product_id AND v.profile_id = auth.uid()
    ) OR public.is_admin()
);

-- 5. Post Interactions Policies
CREATE POLICY "Interactions are viewable by everyone" 
ON public.post_interactions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can interact (like, save, comment)" 
ON public.post_interactions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interactions (unlike, unsave)" 
ON public.post_interactions FOR DELETE 
USING (auth.uid() = user_id);

-- 6. Orders Policies (Strict Isolation)
CREATE POLICY "Customers view their own orders" 
ON public.orders FOR SELECT 
USING (customer_id = auth.uid() OR public.is_admin());

CREATE POLICY "Vendors view orders placed with them" 
ON public.orders FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.vendors 
        WHERE id = vendor_id AND profile_id = auth.uid()
    )
);

CREATE POLICY "Customers can place orders" 
ON public.orders FOR INSERT 
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Vendors can update their order status (processing, shipped)" 
ON public.orders FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.vendors 
        WHERE id = vendor_id AND profile_id = auth.uid()
    ) OR public.is_admin()
);

-- 7. RFQ Requests Policies
CREATE POLICY "Open RFQs are viewable by registered users and vendors" 
ON public.rfq_requests FOR SELECT USING (true);

CREATE POLICY "Customers can create RFQs" 
ON public.rfq_requests FOR INSERT 
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update/close their own RFQs" 
ON public.rfq_requests FOR UPDATE 
USING (customer_id = auth.uid() OR public.is_admin());

-- 8. RFQ Offers Policies
CREATE POLICY "Customer of the RFQ can view offers, and vendor can view their own offer" 
ON public.rfq_offers FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.rfq_requests r 
        WHERE r.id = rfq_id AND r.customer_id = auth.uid()
    )
    OR EXISTS (
        SELECT 1 FROM public.vendors v 
        WHERE v.id = vendor_id AND v.profile_id = auth.uid()
    )
    OR public.is_admin()
);

CREATE POLICY "Vendors can submit offers on RFQs" 
ON public.rfq_offers FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.vendors 
        WHERE id = vendor_id AND profile_id = auth.uid()
    )
);

-- 9. Delivery Confirmations Policies
CREATE POLICY "Parties involved can view delivery confirmations" 
ON public.delivery_confirmations FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.orders o
        JOIN public.vendors v ON o.vendor_id = v.id
        WHERE o.id = order_id AND (o.customer_id = auth.uid() OR v.profile_id = auth.uid())
    ) OR public.is_admin()
);

CREATE POLICY "Customers can submit delivery confirmation" 
ON public.delivery_confirmations FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_id AND customer_id = auth.uid()
    )
);

-- 10. Disputes Policies
CREATE POLICY "Involved parties and admins can view disputes" 
ON public.disputes FOR SELECT 
USING (
    customer_id = auth.uid() 
    OR EXISTS (
        SELECT 1 FROM public.vendors 
        WHERE id = vendor_id AND profile_id = auth.uid()
    ) 
    OR public.is_admin()
);

CREATE POLICY "Customers can open disputes" 
ON public.disputes FOR INSERT 
WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Admins can resolve disputes" 
ON public.disputes FOR UPDATE 
USING (public.is_admin());
