'use client';

import { useState, useEffect } from 'react';
import { Product, RFQRequest, Order, UserRole, Vendor, Dispute } from '@/types';
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

// Global reactive singleton state across components
interface StoreState {
  currentRole: UserRole;
  currentUser: AuthUser;
  products: Product[];
  rfqs: RFQRequest[];
  orders: Order[];
  vendors: Vendor[];
  disputes: Dispute[];
  searchQuery: string;
}

let globalState: StoreState = {
  currentRole: 'customer',
  currentUser: DEFAULT_USERS.customer,
  products: MOCK_PRODUCTS,
  rfqs: MOCK_RFQS,
  orders: MOCK_ORDERS,
  vendors: MOCK_VENDORS,
  disputes: MOCK_DISPUTES,
  searchQuery: '',
};

let isHydrated = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(l => l());
}

function syncLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('damietta_role', globalState.currentRole);
      localStorage.setItem('damietta_products', JSON.stringify(globalState.products));
      localStorage.setItem('damietta_rfqs', JSON.stringify(globalState.rfqs));
      localStorage.setItem('damietta_orders', JSON.stringify(globalState.orders));
      localStorage.setItem('damietta_vendors', JSON.stringify(globalState.vendors));
      localStorage.setItem('damietta_disputes', JSON.stringify(globalState.disputes));
    } catch {}
  }
}

function initHydration() {
  if (isHydrated || typeof window === 'undefined') return;
  isHydrated = true;

  try {
    const savedRole = localStorage.getItem('damietta_role') as UserRole;
    if (savedRole && (['customer', 'vendor', 'admin'] as UserRole[]).includes(savedRole)) {
      globalState.currentRole = savedRole;
      globalState.currentUser = DEFAULT_USERS[savedRole];
    }

    const savedProducts = localStorage.getItem('damietta_products');
    if (savedProducts) globalState.products = JSON.parse(savedProducts);

    const savedRfqs = localStorage.getItem('damietta_rfqs');
    if (savedRfqs) globalState.rfqs = JSON.parse(savedRfqs);

    const savedOrders = localStorage.getItem('damietta_orders');
    if (savedOrders) globalState.orders = JSON.parse(savedOrders);

    const savedVendors = localStorage.getItem('damietta_vendors');
    if (savedVendors) globalState.vendors = JSON.parse(savedVendors);

    const savedDisputes = localStorage.getItem('damietta_disputes');
    if (savedDisputes) globalState.disputes = JSON.parse(savedDisputes);
  } catch {}
}

export function useMarketplaceStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    initHydration();
    const handler = () => setTick(t => t + 1);
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  const switchRole = (role: UserRole) => {
    globalState.currentRole = role;
    globalState.currentUser = DEFAULT_USERS[role];
    syncLocalStorage();
    notify();
  };

  const setSearchQuery = (query: string) => {
    globalState.searchQuery = query;
    notify();
  };

  const login = (email: string, role: UserRole) => {
    const user: AuthUser = {
      ...DEFAULT_USERS[role],
      email: email || DEFAULT_USERS[role].email,
    };
    globalState.currentRole = role;
    globalState.currentUser = user;
    syncLocalStorage();
    notify();
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
    globalState.currentRole = 'customer';
    globalState.currentUser = user;
    syncLocalStorage();
    notify();
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

    globalState.vendors = [newVendor, ...globalState.vendors];
    globalState.currentRole = 'vendor';
    globalState.currentUser = user;
    syncLocalStorage();
    notify();

    return { user, vendor: newVendor };
  };

  const toggleLike = (productId: string) => {
    globalState.products = globalState.products.map(p => {
      if (p.id === productId) {
        const isLiked = !p.is_liked;
        const likesCount = (p.likes_count || 0) + (isLiked ? 1 : -1);
        const trendingScore = p.trending_score + (isLiked ? 1.5 : -1.5);
        return { ...p, is_liked: isLiked, likes_count: Math.max(0, likesCount), trending_score: trendingScore };
      }
      return p;
    });
    syncLocalStorage();
    notify();
  };

  const toggleSave = (productId: string) => {
    globalState.products = globalState.products.map(p => {
      if (p.id === productId) {
        const isSaved = !p.is_saved;
        const savesCount = (p.saves_count || 0) + (isSaved ? 1 : -1);
        return { ...p, is_saved: isSaved, saves_count: Math.max(0, savesCount) };
      }
      return p;
    });
    syncLocalStorage();
    notify();
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
    globalState.products = [created, ...globalState.products];
    syncLocalStorage();
    notify();
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
    globalState.rfqs = [created, ...globalState.rfqs];
    syncLocalStorage();
    notify();
    return created;
  };

  const createOrder = (orderData: Partial<Order>) => {
    const subtotal = orderData.total_price || 30000;
    const fee = Math.round(subtotal * 0.03);
    const newOrder: Order = {
      id: 'ord-' + Math.floor(100000 + Math.random() * 900000),
      customer_id: globalState.currentUser.id,
      customer_name: globalState.currentUser.full_name,
      customer_phone: globalState.currentUser.phone || '+20 100 000 0000',
      vendor_id: orderData.vendor_id || globalState.vendors[0].id,
      vendor_name: orderData.vendor_name || globalState.vendors[0].business_name,
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

    globalState.orders = [newOrder, ...globalState.orders];
    syncLocalStorage();
    notify();
    return newOrder;
  };

  const confirmDelivery = (orderId: string, proofUrl: string) => {
    globalState.orders = globalState.orders.map(o => {
      if (o.id === orderId) {
        return { 
          ...o, 
          status: 'delivered_confirmed' as const,
          notes: (o.notes ? o.notes + ' | ' : '') + 'تم توثيق الاستلام بالصور.'
        };
      }
      return o;
    });
    syncLocalStorage();
    notify();
  };

  const createDispute = (data: { order_id: string; reason: string; evidence_urls: string[] }) => {
    const targetOrder = globalState.orders.find(o => o.id === data.order_id);
    const newDispute: Dispute = {
      id: 'disp-' + Date.now(),
      order_id: data.order_id,
      customer_id: globalState.currentUser.id,
      customer_name: globalState.currentUser.full_name,
      vendor_id: targetOrder?.vendor_id || 'v-1',
      vendor_name: targetOrder?.vendor_name || 'معرض دمياط',
      reason: data.reason,
      evidence_urls: data.evidence_urls,
      status: 'under_review',
      created_at: new Date().toISOString(),
    };

    globalState.disputes = [newDispute, ...globalState.disputes];
    globalState.orders = globalState.orders.map(o => o.id === data.order_id ? { ...o, status: 'disputed' as const } : o);
    syncLocalStorage();
    notify();
    return newDispute;
  };

  const approveVendor = (vendorId: string) => {
    globalState.vendors = globalState.vendors.map(v => v.id === vendorId ? { ...v, status: 'approved' as const, tier: 'verified' as const } : v);
    syncLocalStorage();
    notify();
  };

  const rejectVendor = (vendorId: string) => {
    globalState.vendors = globalState.vendors.map(v => v.id === vendorId ? { ...v, status: 'rejected' as const } : v);
    syncLocalStorage();
    notify();
  };

  return {
    currentRole: globalState.currentRole,
    currentUser: globalState.currentUser,
    searchQuery: globalState.searchQuery,
    setSearchQuery,
    switchRole,
    login,
    signupCustomer,
    signupVendor,
    products: globalState.products,
    rfqs: globalState.rfqs,
    orders: globalState.orders,
    vendors: globalState.vendors,
    disputes: globalState.disputes,
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
