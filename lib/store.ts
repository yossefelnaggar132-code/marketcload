'use client';

import { useState, useEffect } from 'react';
import { Product, RFQRequest, Order, UserRole, Vendor, Profile, Dispute } from '@/types';
import { MOCK_PRODUCTS, MOCK_RFQS, MOCK_ORDERS, MOCK_VENDORS, MOCK_DISPUTES } from './mock-data';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  vendor_id?: string;
}

const DEFAULT_USERS: Record<UserRole, AuthUser> = {
  customer: {
    id: 'cust-1',
    email: 'customer@damietta.com',
    role: 'customer',
    full_name: 'أحمد سامي المهدي',
    phone: '+20 101 234 5678',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  vendor: {
    id: 'prof-v1',
    email: 'desouky@damietta.com',
    role: 'vendor',
    full_name: 'الحاج إبراهيم الدسوقي',
    phone: '+20 122 345 6789',
    vendor_id: 'v-1',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  admin: {
    id: 'admin-1',
    email: 'admin@damietta-market.gov.eg',
    role: 'admin',
    full_name: 'م. شريف المنزلاوي (مدير الرقابة)',
    phone: '+20 100 987 6543',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  }
};

export function useMarketplaceStore() {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');
  const [currentUser, setCurrentUser] = useState<AuthUser>(DEFAULT_USERS.customer);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [rfqs, setRfqs] = useState<RFQRequest[]>(MOCK_RFQS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES);

  // Load persisted state if exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('damietta_role') as UserRole;
      if (savedRole && (['customer', 'vendor', 'admin'] as UserRole[]).includes(savedRole)) {
        setCurrentRole(savedRole);
        setCurrentUser(DEFAULT_USERS[savedRole]);
      }

      const savedProducts = localStorage.getItem('damietta_products');
      if (savedProducts) {
        try { setProducts(JSON.parse(savedProducts)); } catch {}
      }

      const savedRfqs = localStorage.getItem('damietta_rfqs');
      if (savedRfqs) {
        try { setRfqs(JSON.parse(savedRfqs)); } catch {}
      }

      const savedOrders = localStorage.getItem('damietta_orders');
      if (savedOrders) {
        try { setOrders(JSON.parse(savedOrders)); } catch {}
      }

      const savedVendors = localStorage.getItem('damietta_vendors');
      if (savedVendors) {
        try { setVendors(JSON.parse(savedVendors)); } catch {}
      }

      const savedDisputes = localStorage.getItem('damietta_disputes');
      if (savedDisputes) {
        try { setDisputes(JSON.parse(savedDisputes)); } catch {}
      }
    }
  }, []);

  const switchRole = (role: UserRole) => {
    setCurrentRole(role);
    setCurrentUser(DEFAULT_USERS[role]);
    if (typeof window !== 'undefined') {
      localStorage.setItem('damietta_role', role);
    }
  };

  const login = (email: string, role: UserRole) => {
    const user: AuthUser = {
      ...DEFAULT_USERS[role],
      email: email || DEFAULT_USERS[role].email,
    };
    setCurrentRole(role);
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('damietta_role', role);
    }
    return user;
  };

  const signupCustomer = (data: { full_name: string; email: string; phone: string; city: string }) => {
    const user: AuthUser = {
      id: 'cust-' + Date.now(),
      email: data.email,
      role: 'customer',
      full_name: data.full_name,
      phone: data.phone,
    };
    setCurrentRole('customer');
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('damietta_role', 'customer');
    }
    return user;
  };

  const signupVendor = (data: {
    business_name: string;
    commercial_registration: string;
    workshop_address: string;
    city: string;
    specialty: string;
    full_name: string;
    email: string;
    phone: string;
  }) => {
    const newVendorId = 'v-' + Date.now();
    const newVendor: Vendor = {
      id: newVendorId,
      profile_id: 'prof-' + Date.now(),
      business_name: data.business_name,
      commercial_registration: data.commercial_registration,
      workshop_address: data.workshop_address,
      city: data.city || 'دمياط',
      description: `ورشة ومعرض متخصص في ${data.specialty} بمدينة دمياط.`,
      tier: 'basic',
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const user: AuthUser = {
      id: newVendor.profile_id,
      email: data.email,
      role: 'vendor',
      full_name: data.full_name,
      phone: data.phone,
      vendor_id: newVendorId,
    };

    setVendors(prev => {
      const updated = [newVendor, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_vendors', JSON.stringify(updated));
      }
      return updated;
    });

    setCurrentRole('vendor');
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      localStorage.setItem('damietta_role', 'vendor');
    }

    return { user, vendor: newVendor };
  };

  const toggleLike = (productId: string) => {
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === productId) {
          const isLiked = !p.is_liked;
          const likesCount = (p.likes_count || 0) + (isLiked ? 1 : -1);
          const trendingScore = p.trending_score + (isLiked ? 1.5 : -1.5);
          return { ...p, is_liked: isLiked, likes_count: Math.max(0, likesCount), trending_score: trendingScore };
        }
        return p;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_products', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleSave = (productId: string) => {
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === productId) {
          const isSaved = !p.is_saved;
          const savesCount = (p.saves_count || 0) + (isSaved ? 1 : -1);
          return { ...p, is_saved: isSaved, saves_count: Math.max(0, savesCount) };
        }
        return p;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_products', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const addProduct = (newProduct: Omit<Product, 'id' | 'created_at' | 'trending_score' | 'views_count'>) => {
    const created: Product = {
      ...newProduct,
      id: 'prod-' + Date.now(),
      created_at: new Date().toISOString(),
      trending_score: 50.0,
      views_count: 1,
      likes_count: 0,
      saves_count: 0,
      is_liked: false,
      is_saved: false,
    };
    setProducts(prev => {
      const updated = [created, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_products', JSON.stringify(updated));
      }
      return updated;
    });
    return created;
  };

  const addRFQ = (newRFQ: Omit<RFQRequest, 'id' | 'created_at' | 'status' | 'offers_count'>) => {
    const created: RFQRequest = {
      ...newRFQ,
      id: 'rfq-' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'open',
      offers_count: 0,
    };
    setRfqs(prev => {
      const updated = [created, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_rfqs', JSON.stringify(updated));
      }
      return updated;
    });
    return created;
  };

  const createOrder = (orderData: Partial<Order>) => {
    const subtotal = orderData.total_price || 30000;
    const fee = Math.round(subtotal * 0.03); // 3% platform commission
    const newOrder: Order = {
      id: 'ord-' + Math.floor(100000 + Math.random() * 900000),
      customer_id: currentUser.id,
      customer_name: currentUser.full_name,
      customer_phone: currentUser.phone || '+20 100 000 0000',
      vendor_id: orderData.vendor_id || vendors[0].id,
      vendor_name: orderData.vendor_name || vendors[0].business_name,
      product_id: orderData.product_id,
      product: orderData.product,
      order_type: orderData.order_type || 'direct',
      selected_options: orderData.selected_options || {},
      quantity: orderData.quantity || 1,
      total_price: subtotal,
      platform_fee: fee,
      payment_method: orderData.payment_method || 'online',
      payment_status: orderData.payment_method === 'online' ? 'paid' : 'pending',
      status: 'processing',
      shipping_address: orderData.shipping_address || 'القاهرة - مصر',
      notes: orderData.notes,
      created_at: new Date().toISOString(),
    };

    setOrders(prev => {
      const updated = [newOrder, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_orders', JSON.stringify(updated));
      }
      return updated;
    });

    return newOrder;
  };

  const confirmDelivery = (orderId: string, proofUrl: string) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === orderId) {
          return { 
            ...o, 
            status: 'delivered_confirmed' as const,
            notes: (o.notes ? o.notes + ' | ' : '') + 'تم توثيق الاستلام بالصور.'
          };
        }
        return o;
      });
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_orders', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const createDispute = (data: { order_id: string; reason: string; evidence_urls: string[] }) => {
    const targetOrder = orders.find(o => o.id === data.order_id);
    const newDispute: Dispute = {
      id: 'disp-' + Date.now(),
      order_id: data.order_id,
      customer_id: currentUser.id,
      customer_name: currentUser.full_name,
      vendor_id: targetOrder?.vendor_id || 'v-1',
      vendor_name: targetOrder?.vendor_name || 'معرض دمياط',
      reason: data.reason,
      evidence_urls: data.evidence_urls,
      status: 'under_review',
      created_at: new Date().toISOString(),
    };

    setDisputes(prev => {
      const updated = [newDispute, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_disputes', JSON.stringify(updated));
      }
      return updated;
    });

    // Also flag the order
    setOrders(prev => {
      const updated = prev.map(o => o.id === data.order_id ? { ...o, status: 'disputed' as const } : o);
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_orders', JSON.stringify(updated));
      }
      return updated;
    });

    return newDispute;
  };

  const approveVendor = (vendorId: string) => {
    setVendors(prev => {
      const updated = prev.map(v => v.id === vendorId ? { ...v, status: 'approved' as const, tier: 'verified' as const } : v);
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_vendors', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const rejectVendor = (vendorId: string) => {
    setVendors(prev => {
      const updated = prev.map(v => v.id === vendorId ? { ...v, status: 'rejected' as const } : v);
      if (typeof window !== 'undefined') {
        localStorage.setItem('damietta_vendors', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return {
    currentRole,
    currentUser,
    switchRole,
    login,
    signupCustomer,
    signupVendor,
    products,
    rfqs,
    orders,
    vendors,
    disputes,
    toggleLike,
    toggleSave,
    addProduct,
    addRFQ,
    createOrder,
    confirmDelivery,
    createDispute,
    approveVendor,
    rejectVendor,
  };
}
