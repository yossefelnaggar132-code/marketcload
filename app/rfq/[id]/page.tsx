'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Clock, 
  Store, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Award,
  Layers,
  MessageSquare
} from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';
import { VendorBadge } from '@/components/VendorBadge';
import { MOCK_RFQS } from '@/lib/mock-data';

export default function RFQDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { rfqs } = useMarketplaceStore();

  // Find rfq or fallback to mock
  const rfq = rfqs.find((r) => r.id === params.id) || MOCK_RFQS[0];
  const offers = (rfq as any).offers || MOCK_RFQS[0].offers || [];

  const [acceptedOfferId, setAcceptedOfferId] = useState<string | null>(null);

  const handleAcceptOffer = (offerId: string) => {
    setAcceptedOfferId(offerId);
    setTimeout(() => {
      router.push('/orders/ord-8042');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمعروضات</span>
        </Link>
      </div>

      {/* RFQ Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-soft space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-brand-100 text-brand-900">
              {rfq.category}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
              طلب مفتوح لتلقي العروض
            </span>
          </div>
          <span className="text-xs text-stone-500">
            رقم الطلب: #{rfq.id.slice(0, 8)}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
          {rfq.title}
        </h1>

        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/60 space-y-2">
          <span className="text-xs font-bold text-stone-700 block">المواصفات المطلوبة من العميل:</span>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed whitespace-pre-line">
            {rfq.specifications}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-stone-600">
          <div>
            <span className="text-stone-400 block">الميزانية التقريبية:</span>
            <span className="font-bold text-brand-900 text-sm">{rfq.budget_range || 'حسب عروض الأسعار'}</span>
          </div>
          <div>
            <span className="text-stone-400 block">العميل صاحب الطلب:</span>
            <span className="font-bold text-stone-800">{rfq.customer_name || 'عميل مسجل'}</span>
          </div>
          <div>
            <span className="text-stone-400 block">تاريخ الإرسال:</span>
            <span className="font-bold text-stone-800">{new Date(rfq.created_at).toLocaleDateString('ar-EG')}</span>
          </div>
        </div>
      </div>

      {/* Bids & Offers Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
            <span>عروض الأسعار المقدمة من ورش دمياط</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-800 text-white">
              {offers.length} عروض
            </span>
          </h2>
          <span className="text-xs text-stone-500">
            قارن بين أسعار وخامات وفترات تنفيذ كل ورشة
          </span>
        </div>

        {acceptedOfferId && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-sm text-center flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>تم قبول العرض واعتماد الطلب! جارٍ نقلك لصفحة متابعة تنفيذ الطلب...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer: any) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl p-6 border border-brand-200/80 shadow-soft hover:shadow-lg transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Vendor Header */}
                <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-800 font-bold">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900">
                        {offer.vendor?.business_name}
                      </h3>
                      <span className="text-[11px] text-stone-500">
                        {offer.vendor?.city || 'دمياط'}
                      </span>
                    </div>
                  </div>
                  {offer.vendor?.tier && <VendorBadge tier={offer.vendor.tier} />}
                </div>

                {/* Offer Price */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone-500 block">عرض السعر النهائي:</span>
                    <span className="text-2xl font-black text-brand-950">
                      {offer.price.toLocaleString('ar-EG')}
                    </span>
                    <span className="text-xs font-bold text-stone-600 mr-1">جنيه</span>
                  </div>
                  <div className="text-left text-xs font-bold text-brand-800">
                    <Clock className="w-4 h-4 inline-block ml-1" />
                    <span>خلال {offer.delivery_days} يوماً</span>
                  </div>
                </div>

                {/* Materials & Notes */}
                <div className="space-y-2 text-xs">
                  <div className="bg-stone-50 p-2.5 rounded-xl">
                    <span className="text-stone-400 block mb-0.5">الخامات المعتمدة في العرض:</span>
                    <span className="font-bold text-stone-800">{offer.materials_used}</span>
                  </div>

                  <p className="text-stone-600 leading-relaxed p-1">
                    "{offer.notes}"
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                <button
                  disabled={acceptedOfferId !== null}
                  onClick={() => handleAcceptOffer(offer.id)}
                  className="flex-1 py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  قبول هذا العرض وبدء التنفيذ
                </button>
                <button
                  type="button"
                  className="p-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-bold flex items-center gap-1"
                >
                  <MessageSquare className="w-4 h-4 text-brand-600" />
                  <span>محادثة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
