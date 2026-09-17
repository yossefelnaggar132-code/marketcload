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
  Award, 
  DollarSign, 
  PackageCheck, 
  FileText, 
  TrendingUp, 
  Users,
  Eye,
  Check,
  Building
} from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';
import { VendorBadge } from '@/components/VendorBadge';
import { VendorTier } from '@/types';

export default function AdminDashboardPage() {
  const { 
    vendors, 
    orders, 
    disputes, 
    approveVendor, 
    rejectVendor, 
    updateVendorTier, 
    resolveDispute 
  } = useMarketplaceStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'disputes' | 'orders'>('overview');

  const pendingVendors = vendors.filter((v) => v.status === 'pending');
  const approvedVendors = vendors.filter((v) => v.status === 'approved');
  const openDisputes = disputes.filter((d) => d.status === 'under_review' || d.status === 'open');

  // Financial calculations
  const totalVolume = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
  const platformRevenue = Math.round(totalVolume * 0.03); // 3%
  const escrowHeldFunds = orders
    .filter((o) => o.status === 'processing' || o.status === 'ready_to_ship' || o.status === 'shipped' || o.status === 'disputed')
    .reduce((sum, o) => sum + (o.total_price || 0), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-l from-brand-950 via-stone-900 to-brand-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-brand-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>لوحة الرقابة المركزية — إدارة ماركت بليس أثاث دمياط</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            إدارة المعارض، النزاعات، والحسابات المالية
          </h1>
          <p className="text-xs text-stone-300">
            متابعة توثيق ورش دمياط، حماية أموال المشترين بنظام الضمان (Escrow)، والفصل في مطابقة خشب الزان
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لمعرض الأثاث الرئيسي</span>
        </Link>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-brand-200/70 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">معارض بانتظار التوثيق</span>
            <Building className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingVendors.length}</div>
          <p className="text-[11px] text-stone-500">تحتاج مراجعة وتدقيق السجل التجاري</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200/70 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">النزاعات المفتوحة</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600">{openDisputes.length}</div>
          <p className="text-[11px] text-stone-500">تحت التحقيق للفصل وحماية العميل</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200/70 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">إجمالي مبيعات الأثاث (GMV)</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-stone-900">{totalVolume.toLocaleString('ar-EG')} ج</div>
          <p className="text-[11px] text-emerald-700 font-bold">أموال الضمان المحتجزة: {escrowHeldFunds.toLocaleString('ar-EG')} ج</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-brand-200/70 shadow-soft space-y-1">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-bold">عمولة المنصة المحصلة (3%)</span>
            <TrendingUp className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-brand-900">{platformRevenue.toLocaleString('ar-EG')} ج</div>
          <p className="text-[11px] text-stone-500">رسوم دعم الورش والصناع بدمياط</p>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-brand-800 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          نظرة عامة والرقابة
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'vendors'
              ? 'bg-brand-800 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span>إدارة المعارض والتوثيق</span>
          {pendingVendors.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-brand-950 text-[10px] font-black">
              {pendingVendors.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('disputes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'disputes'
              ? 'bg-brand-800 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <span>مركز النزاعات والجودة</span>
          {openDisputes.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-black">
              {openDisputes.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-brand-800 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          المعاملات المالية والطلبات ({orders.length})
        </button>
      </div>

      {/* SECTION 1: Pending Vendors */}
      {(activeTab === 'overview' || activeTab === 'vendors') && (
        <div className="bg-white rounded-3xl p-6 border border-brand-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
              <span>طلبات انضمام الورش والمعارض الجديدة</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pendingVendors.length} طلب بانتظار المراجعة
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
                      العنوان: {vendor.workshop_address} | سجل تجاري: #{vendor.commercial_registration} | المدينة: {vendor.city}
                    </div>
                    <p className="text-stone-600">{vendor.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => approveVendor(vendor.id)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>اعتماد وتوثيق الورشة</span>
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

          {/* Approved Vendors List with Tier Upgrades */}
          {activeTab === 'vendors' && (
            <div className="pt-6 border-t border-stone-100 space-y-4">
              <h3 className="text-sm font-black text-stone-900">
                المعارض المعتمدة وترقية مستويات الثقة (Tiers)
              </h3>
              <div className="space-y-3">
                {approvedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">{vendor.business_name}</span>
                        <VendorBadge tier={vendor.tier} />
                      </div>
                      <div className="text-stone-500">
                        {vendor.workshop_address} | سجل: #{vendor.commercial_registration}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-stone-400 font-bold">تغيير المستوى:</span>
                      <div className="inline-flex rounded-lg border border-stone-200 p-0.5 bg-stone-50">
                        {(['basic', 'verified', 'premium'] as VendorTier[]).map((t) => (
                          <button
                            key={t}
                            onClick={() => updateVendorTier(vendor.id, t)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                              vendor.tier === t
                                ? 'bg-brand-800 text-white shadow-sm'
                                : 'text-stone-600 hover:text-stone-900'
                            }`}
                          >
                            {t.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <Link
                        href={`/vendors/${vendor.id}`}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                      >
                        معاينة
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: Disputes Resolution Center */}
      {(activeTab === 'overview' || activeTab === 'disputes') && (
        <div className="bg-white rounded-3xl p-6 border border-brand-200/80 shadow-soft space-y-4">
          <h2 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <span>مركز الفصل في النزاعات ومطابقة أخشاب دمياط</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {disputes.length} حالة مسجلة
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
                    {disp.status === 'resolved_customer' ? 'تم الفصل والحل' : 'قيد المراجعة والتحقيق'}
                  </span>
                </div>

                <p className="text-stone-700 leading-relaxed">
                  <span className="font-bold text-stone-900">موضوع الشكوى: </span>
                  {disp.reason}
                </p>

                {disp.status === 'under_review' || disp.status === 'open' ? (
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => resolveDispute(disp.id, 'تم إلزام المعرض بإعادة دهان القطعة وتغيير قماش الكراسي مع تعويض الشحن.')}
                      className="px-3.5 py-2 rounded-lg bg-brand-800 text-white font-bold text-xs hover:bg-brand-900"
                    >
                      إلزام المعرض بالتعديل الفوري
                    </button>
                    <button
                      onClick={() => resolveDispute(disp.id, 'تم رد 10% من قيمة الطلب للعميل كتعويض مباشر عن اختلاف المواصفات.')}
                      className="px-3.5 py-2 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700"
                    >
                      إقرار تعويض جزئي للعميل
                    </button>
                    <button
                      onClick={() => resolveDispute(disp.id, 'تم إلغاء الطلب واسترداد كامل المبلغ للعميل مع سحب الشارة من الورشة المخالفة.')}
                      className="px-3.5 py-2 rounded-lg bg-rose-700 text-white font-bold text-xs hover:bg-rose-800"
                    >
                      فسخ العقد واسترداد المبلغ
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
      )}

      {/* SECTION 3: Orders & Escrow */}
      {(activeTab === 'overview' || activeTab === 'orders') && (
        <div className="bg-white rounded-3xl p-6 border border-brand-200/80 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-stone-900">
              المعاملات المالية وأموال الضمان (Escrow Orders)
            </h2>
            <span className="text-xs text-stone-500 font-bold">
              إجمالي {orders.length} طلبات مسجلة
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-400 font-bold">
                  <th className="pb-3 pr-2">رقم الطلب</th>
                  <th className="pb-3">العميل</th>
                  <th className="pb-3">الورشة / المعرض</th>
                  <th className="pb-3">قيمة الطلب</th>
                  <th className="pb-3">عمولة المنصة (3%)</th>
                  <th className="pb-3">حالة الدفع</th>
                  <th className="pb-3">حالة التوصيل</th>
                  <th className="pb-3 pl-2">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/80">
                    <td className="py-3 pr-2 font-bold font-mono text-stone-900">#{o.id}</td>
                    <td className="py-3 text-stone-800">{o.customer_name || 'عميل دمياط'}</td>
                    <td className="py-3 text-stone-800">{o.vendor_name || 'معرض دمياط'}</td>
                    <td className="py-3 font-bold text-brand-950">{o.total_price.toLocaleString('ar-EG')} ج</td>
                    <td className="py-3 font-bold text-emerald-700">
                      {Math.round(o.total_price * 0.03).toLocaleString('ar-EG')} ج
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.payment_status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.payment_status === 'paid' ? 'مدفوع (في الضمان)' : 'دفع عند الاستلام'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 pl-2">
                      <Link
                        href={`/orders/${o.id}`}
                        className="text-brand-700 font-bold hover:underline"
                      >
                        عرض
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
