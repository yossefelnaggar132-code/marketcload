'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Store, 
  PackagePlus, 
  ShoppingBag, 
  TrendingUp, 
  Eye, 
  PenTool, 
  Plus, 
  Layers,
  Sparkles,
  Award
} from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';
import { VendorBadge } from '@/components/VendorBadge';

export default function VendorDashboardPage() {
  const { products, orders, rfqs, vendors } = useMarketplaceStore();
  const currentVendor = vendors[0]; // Active demo vendor (مؤسسة الدسوقي)

  const vendorProducts = products.filter((p) => p.vendor_id === currentVendor.id);
  const vendorOrders = orders.filter((o) => o.vendor_id === currentVendor.id);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
            {currentVendor.business_name[0]}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {currentVendor.business_name}
              </h1>
              <VendorBadge tier={currentVendor.tier} />
            </div>
            <p className="text-xs text-stone-500">
              {currentVendor.workshop_address} — {currentVendor.city} | سجل تجاري: #{currentVendor.commercial_registration}
            </p>
          </div>
        </div>

        <Link
          href="/vendor/products/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>رفع منتج جديد للفيد</span>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-brand-200/60 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">إجمالي المعروضات</span>
            <PackagePlus className="w-5 h-5 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{vendorProducts.length}</div>
          <div className="text-[11px] text-stone-500">منها {vendorProducts.filter(p => p.post_type === 'available').length} متاح للبيع الفوري</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200/60 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">الطلبات الواردة</span>
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{vendorOrders.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold">1 بانتظار توثيق الاستلام (72h)</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200/60 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">طلبات RFQ المتاحة</span>
            <PenTool className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{rfqs.length}</div>
          <div className="text-[11px] text-stone-500">متاحة لتقديم عروض الأسعار</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200/60 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">مستوى المعرض الحالي</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-700 uppercase">{currentVendor.tier}</div>
          <div className="text-[11px] text-stone-500">أولوية ظهور مضاعفة ×1.3 في الفيد</div>
        </div>
      </div>

      {/* Products Management Table */}
      <div className="bg-white rounded-3xl p-6 border border-brand-200/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-stone-900">
            قائمة منتجات ومعروضات المعرض
          </h2>
          <Link
            href="/vendor/products/new"
            className="text-xs font-bold text-brand-700 hover:text-brand-900"
          >
            + إضافة قطعة جديدة
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold">
                <th className="pb-3 pr-2">المنتج</th>
                <th className="pb-3">النوع</th>
                <th className="pb-3">السعر</th>
                <th className="pb-3">الخامة</th>
                <th className="pb-3">الرواج (Trending)</th>
                <th className="pb-3 pl-2">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {vendorProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/80">
                  <td className="py-3.5 pr-2 font-bold text-stone-900 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-stone-100 relative overflow-hidden shrink-0 inline-block">
                      <img src={p.media_urls[0]} alt="" className="w-full h-full object-cover" />
                    </span>
                    <span className="truncate max-w-[200px]">{p.title}</span>
                  </td>
                  <td className="py-3.5">
                    {p.post_type === 'portfolio' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        Portfolio
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        معروض للبيع
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 font-bold text-brand-950">
                    {p.post_type === 'portfolio' ? 'حسب الطلب' : `${p.price.toLocaleString('ar-EG')} ج`}
                  </td>
                  <td className="py-3.5 text-stone-600">{p.wood_type}</td>
                  <td className="py-3.5">
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {p.trending_score.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3.5 pl-2">
                    <Link
                      href={`/products/${p.id}`}
                      className="text-brand-700 font-bold hover:underline"
                    >
                      معاينة في الفيد
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
