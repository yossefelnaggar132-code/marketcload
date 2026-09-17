'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Store, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';
import { MOCK_DISPUTES } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const { vendors, approveVendor, rejectVendor } = useMarketplaceStore();
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);

  const pendingVendors = vendors.filter((v) => v.status === 'pending');
  const approvedVendors = vendors.filter((v) => v.status === 'approved');

  const handleResolveDispute = (disputeId: string, decision: string) => {
    setDisputes((prev) =>
      prev.map((d) =>
        d.id === disputeId ? { ...d, status: 'resolved_customer' as const, resolution_notes: decision } : d
      )
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-l from-brand-950 via-stone-900 to-brand-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-brand-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة الرقابة المركزية — إدارة ماركت بليس دمياط</span>
          </div>
          <h1 className="text-2xl font-black">
            إدارة المعارض والنزاعات وتوثيق الاستلام
          </h1>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمتجر</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-brand-200/70 shadow-soft">
          <span className="text-xs text-stone-400 font-bold block">معارض بانتظار الاعتماد</span>
          <span className="text-2xl font-black text-amber-600 block mt-1">{pendingVendors.length}</span>
          <span className="text-[11px] text-stone-500">تحتاج مراجعة السجل التجاري</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200/70 shadow-soft">
          <span className="text-xs text-stone-400 font-bold block">المعارض المعتمدة النشطة</span>
          <span className="text-2xl font-black text-emerald-600 block mt-1">{approvedVendors.length}</span>
          <span className="text-[11px] text-stone-500">معارض دمياط الموثقة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200/70 shadow-soft">
          <span className="text-xs text-stone-400 font-bold block">النزاعات المفتوحة</span>
          <span className="text-2xl font-black text-rose-600 block mt-1">
            {disputes.filter(d => d.status === 'under_review').length}
          </span>
          <span className="text-[11px] text-stone-500">تحت التحقيق والفصل</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200/70 shadow-soft">
          <span className="text-xs text-stone-400 font-bold block">عمولة المنصة المقدرة</span>
          <span className="text-2xl font-black text-brand-950 block mt-1">3%</span>
          <span className="text-[11px] text-emerald-600 font-bold">رسوم مخفضة لدعم معارض دمياط</span>
        </div>
      </div>

      {/* Pending Vendors Section */}
      <div className="bg-white rounded-3xl p-6 border border-brand-200/80 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <span>طلبات انضمام المعارض الجديدة</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {pendingVendors.length} طلب
            </span>
          </h2>
        </div>

        {pendingVendors.length > 0 ? (
          <div className="space-y-3">
            {pendingVendors.map((vendor) => (
              <div
                key={vendor.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">{vendor.business_name}</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                      قيد المراجعة
                    </span>
                  </div>
                  <div className="text-stone-500">
                    العنوان: {vendor.workshop_address} | سجل تجاري: #{vendor.commercial_registration}
                  </div>
                  <p className="text-stone-600">{vendor.description}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => approveVendor(vendor.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>اعتماد وتوثيق</span>
                  </button>
                  <button
                    onClick={() => rejectVendor(vendor.id)}
                    className="px-3 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>رفض</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-stone-400 font-medium">
            لا توجد طلبات معارض معلقة حالياً، جميع المعارض مفعلة.
          </div>
        )}
      </div>

      {/* Disputes Resolution Center */}
      <div className="bg-white rounded-3xl p-6 border border-brand-200/80 shadow-soft space-y-4">
        <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
          <span>مركز الفصل في النزاعات ومطابقة الجودة</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            {disputes.length} حالة
          </span>
        </h2>

        <div className="space-y-4">
          {disputes.map((disp) => (
            <div
              key={disp.id}
              className="p-5 rounded-2xl border border-stone-200 bg-stone-50/70 space-y-3 text-xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
                <span className="font-bold text-stone-900">
                  نزاع طلب #{disp.order_id} — العميل: {disp.customer_name} | المعرض: {disp.vendor_name}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  disp.status === 'resolved_customer'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {disp.status === 'resolved_customer' ? 'تم الفصل والحل' : 'قيد المراجعة'}
                </span>
              </div>

              <p className="text-stone-700 leading-relaxed">
                <span className="font-bold text-stone-900">موضوع الشكوى: </span>
                {disp.reason}
              </p>

              {disp.status === 'under_review' ? (
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleResolveDispute(disp.id, 'تم إلزام المعرض بإعادة دهان القطعة وتغيير قماش الكراسي مع تعويض الشحن.')}
                    className="px-3.5 py-2 rounded-lg bg-brand-800 text-white font-bold text-xs hover:bg-brand-900"
                  >
                    إلزام المعرض بالتعديل الفوري
                  </button>
                  <button
                    onClick={() => handleResolveDispute(disp.id, 'تم رد 10% من قيمة الطلب للعميل كتعويض مباشر.')}
                    className="px-3.5 py-2 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
                  >
                    إقرار تعويض جزئي للعميل
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs">
                  قرار الإدارة: {disp.resolution_notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
