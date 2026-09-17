export type UserRole = 'customer' | 'vendor' | 'admin';

export type VendorTier = 'basic' | 'verified' | 'premium';
export type VendorStatus = 'pending' | 'approved' | 'rejected';

export type FurnitureCategory = 
  | 'غرف نوم'
  | 'صالونات'
  | 'مطابخ'
  | 'غرف سفرة'
  | 'مكاتب'
  | 'ديكورات وأخرى';

export type PostType = 'available' | 'portfolio';

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Vendor {
  id: string;
  profile_id: string;
  business_name: string;
  commercial_registration?: string;
  workshop_address?: string;
  city: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  tier: VendorTier;
  status: VendorStatus;
  created_at: string;
}

export interface CustomizationOption {
  id: string;
  product_id: string;
  option_name: string; // e.g. نوع الخشب, المقاس, لون القماش
  values: string[];
  price_adjustments?: number[];
}

export interface Product {
  id: string;
  vendor_id: string;
  vendor?: Vendor;
  title: string;
  description: string;
  price: number;
  category: FurnitureCategory;
  media_urls: string[];
  post_type: PostType;
  wood_type: string;
  manufacturing_time_days: number;
  trending_score: number;
  views_count: number;
  customization_options?: CustomizationOption[];
  likes_count?: number;
  saves_count?: number;
  is_liked?: boolean;
  is_saved?: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  customer_name?: string;
  customer_phone: string;
  vendor_id: string;
  vendor_name?: string;
  product_id?: string;
  product?: Product;
  order_type: 'direct' | 'custom' | 'rfq';
  selected_options: Record<string, string>;
  quantity: number;
  total_price: number;
  platform_fee: number;
  payment_method: 'online' | 'cod';
  payment_status: 'pending' | 'paid' | 'refunded';
  status: 
    | 'pending'
    | 'processing'
    | 'ready_to_ship'
    | 'shipped'
    | 'delivered_pending_confirm'
    | 'delivered_confirmed'
    | 'cancelled'
    | 'disputed';
  shipping_address: string;
  notes?: string;
  created_at: string;
  auto_confirm_deadline?: string;
}

export interface RFQRequest {
  id: string;
  customer_id: string;
  customer_name?: string;
  title: string;
  category: FurnitureCategory;
  specifications: string;
  budget_range?: string;
  sample_images: string[];
  status: 'open' | 'awarded' | 'closed' | 'expired';
  offers_count?: number;
  created_at: string;
}

export interface RFQOffer {
  id: string;
  rfq_id: string;
  vendor_id: string;
  vendor?: Vendor;
  price: number;
  notes?: string;
  delivery_days: number;
  materials_used: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export interface Dispute {
  id: string;
  order_id: string;
  customer_id: string;
  customer_name?: string;
  vendor_id: string;
  vendor_name?: string;
  reason: string;
  evidence_urls: string[];
  status: 'open' | 'under_review' | 'resolved_customer' | 'resolved_vendor' | 'compromised';
  resolution_notes?: string;
  created_at: string;
}
