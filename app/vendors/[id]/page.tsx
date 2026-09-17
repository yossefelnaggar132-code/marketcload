'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Store, 
  MapPin, 
  FileText, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  PenTool, 
  Layers, 
  CheckCircle2, 
  Award,
  ShieldCheck
} from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';
import { VendorBadge } from '@/components/VendorBadge';
import { ProductCard } from '@/components/ProductCard';

export default function VendorPublicProfilePage({ params }: { params: { id: string } }) {
  const { vendors, products } = useMarketplaceStore();
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'portfolio'>('all');

  const vendor = vendors.find((v) => v.id === params.id) || vendors[0];

  if (!vendor) {
    return notFound();
  }

  const vendorProducts = products.filter((p) => p.vendor_id === vendor.id);
  const filteredProducts = vendorProducts.filter((p) => {
    if (activeTab === 'available') return p.post_type === 'available';
    if (activeTab === 'portfolio') return p.post_type === 'portfolio';
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لمعرض الأثاث الرئيسي</span>
        </Link>
      </div>

      {/* Hero Vendor Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-brand-200/80 shadow-soft relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-brand-700 via-brand-800 to-stone-900 text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-lg shadow-brand-900/15 shrink-0 border-2 border-brand-500/30">
              {vendor.business_name[0]}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
                  {vendor.business_name}
                </h1>
                <VendorBadge tier={vendor.tier} />
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-600" />
                  <span>{vendor.workshop_address || 'دمياط، مصر'}</span>
                </span>
                {vendor.commercial_registration && (
                  <span className="flex items-center gap-1 font-mono">
                    <FileText className="w-3.5 h-3.5 text-stone-400" />
                    <span>سجل تجاري: #{vendor.commercial_registration}</span>
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed pt-1">
                {vendor.description || 'ورشة ومعرض متخصص في صناعة أرقى الموديلات الخشبية الكلاسيكية والمودرن بأيادي أمهر صناع دمياط باستخدام أخشاب الزان الأحمر الطبيعي.'}
              </p>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <Link
              href={`/rfq/new?vendor_id=${vendor.id}&vendor_name=${encodeURIComponent(vendor.business_name)}`}
              className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-brand-950 font-black text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <PenTool className="w-4 h-4" />
              <span>طلب تفصيل خاص من هذه الورشة</span>
            </Link>
          </div>
        </div>

        {/* Decorative corner glow */}
        <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-gradient-to-r from-amber-100/30 to-transparent pointer-events-none" />
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-brand-800 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            كل الأعمال ({vendorProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'available'
                ? 'bg-brand-800 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            قطع متاحة للشراء الفوري ({vendorProducts.filter(p => p.post_type === 'available').length})
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'portfolio'
                ? 'bg-brand-800 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            معرض الأعمال السابقة Portfolio ({vendorProducts.filter(p => p.post_type === 'portfolio').length})
          </button>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          ضمان المصنعية وأخشاب الزان معتمد ومحمي بالمنصة
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8 space-y-2">
          <Store className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-base font-bold text-stone-700">لا توجد قطع مضافة في هذا القسم حالياً</h3>
          <p className="text-xs text-stone-500">يمكنك طلب تفصيل بمواصفاتك مباشرة من المعرض عبر زر RFQ أعلاه.</p>
        </div>
      )}
    </div>
  );
}
