'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { 
  Heart, 
  Bookmark, 
  Clock, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Store, 
  Check, 
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  Share2,
  CheckCircle
} from 'lucide-react';
import { VendorBadge } from '@/components/VendorBadge';
import { useMarketplaceStore } from '@/lib/store';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { products, toggleLike, toggleSave } = useMarketplaceStore();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-stone-800">المنتج غير موجود</h2>
        <Link href="/" className="mt-4 inline-block text-brand-700 font-bold underline">
          العودة لمعرض الأثاث
        </Link>
      </div>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, { value: string; adjustment: number }>>(() => {
    const initial: Record<string, { value: string; adjustment: number }> = {};
    product.customization_options?.forEach((opt) => {
      if (opt.values.length > 0) {
        initial[opt.option_name] = {
          value: opt.values[0],
          adjustment: opt.price_adjustments?.[0] || 0,
        };
      }
    });
    return initial;
  });

  const [orderSuccess, setOrderSuccess] = useState(false);

  // Calculate dynamic adjusted price
  const totalPrice = Object.values(selectedOptions).reduce(
    (acc, cur) => acc + cur.adjustment,
    product.price
  );

  const handleSelectOption = (optionName: string, value: string, adjustment: number) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: { value, adjustment },
    }));
  };

  const handlePlaceOrder = () => {
    setOrderSuccess(true);
    setTimeout(() => {
      router.push('/orders/ord-8042');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمعروضات</span>
        </Link>
      </div>

      {/* Main product view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-100 border border-brand-200 shadow-card">
            <Image
              src={product.media_urls[activeImageIndex] || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900'}
              alt={product.title}
              fill
              priority
              className="object-cover transition-all duration-300"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* Post Type Tag */}
            <div className="absolute top-4 right-4">
              {product.post_type === 'portfolio' ? (
                <span className="bg-stone-900/90 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                  معرض أعمال (Portfolio)
                </span>
              ) : (
                <span className="bg-emerald-600/90 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
                  متاح للطلب المباشر
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.media_urls.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.media_urls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    idx === activeImageIndex
                      ? 'border-brand-600 ring-2 ring-brand-300 scale-105'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Description Card */}
          <div className="bg-white rounded-2xl p-6 border border-brand-200/80 shadow-soft space-y-3">
            <h3 className="font-extrabold text-stone-900 text-base">وصف القطعة والمواصفات الدمياطية</h3>
            <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            <div className="pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-stone-100 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-400 block mb-1">نوع الخشب الأساسي</span>
                <span className="font-bold text-stone-800">🪵 {product.wood_type}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-400 block mb-1">مدة التنفيذ والتسليم</span>
                <span className="font-bold text-stone-800">⏱️ {product.manufacturing_time_days} يوماً</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-stone-400 block mb-1">بلد ومقر التصنيع</span>
                <span className="font-bold text-stone-800">📍 دمياط — مصر</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details & Purchase Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-brand-200/80 shadow-card space-y-6">
            {/* Title & Vendor info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-brand-100 text-brand-800">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(product.id)}
                    className={`p-2 rounded-full border transition-colors ${
                      product.is_liked
                        ? 'text-rose-600 bg-rose-50 border-rose-200'
                        : 'text-stone-400 border-stone-200 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${product.is_liked ? 'fill-rose-500' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleSave(product.id)}
                    className={`p-2 rounded-full border transition-colors ${
                      product.is_saved
                        ? 'text-amber-600 bg-amber-50 border-amber-200'
                        : 'text-stone-400 border-stone-200 hover:text-amber-500'
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${product.is_saved ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-stone-900 leading-snug">
                {product.title}
              </h1>

              {/* Vendor banner */}
              <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-brand-200 flex items-center justify-center text-brand-800 font-bold">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      {product.vendor?.business_name}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {product.vendor?.workshop_address || 'دمياط'}
                    </span>
                  </div>
                </div>
                {product.vendor?.tier && <VendorBadge tier={product.vendor.tier} />}
              </div>
            </div>

            {/* Price display */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60">
              <span className="text-xs text-amber-800 font-bold block mb-1">
                {product.post_type === 'portfolio' ? 'السعر التقديري للتنفيذ المخصص' : 'السعر الإجمالي:'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-brand-950">
                  {totalPrice.toLocaleString('ar-EG')}
                </span>
                <span className="text-sm font-bold text-stone-600">جنيه مصري</span>
              </div>
              <p className="text-[11px] text-amber-900/70 mt-1">
                يشمل التغليف الآمن للشحن، مع إمكانية المعاينة وفحص الأخشاب قبل الاستلام.
              </p>
            </div>

            {/* Customization Options Builder */}
            {product.customization_options && product.customization_options.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <h4 className="text-xs font-black text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>تخصيص الخامات والمقاسات حسب الرغبة:</span>
                </h4>

                {product.customization_options.map((opt) => (
                  <div key={opt.id} className="space-y-2">
                    <span className="text-xs font-bold text-stone-700 block">
                      {opt.option_name}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {opt.values.map((val, idx) => {
                        const adj = opt.price_adjustments?.[idx] || 0;
                        const isSelected = selectedOptions[opt.option_name]?.value === val;

                        return (
                          <button
                            key={val}
                            onClick={() => handleSelectOption(opt.option_name, val, adj)}
                            className={`p-2 rounded-xl text-xs text-right border transition-all ${
                              isSelected
                                ? 'border-brand-600 bg-brand-50/80 text-brand-900 font-bold shadow-sm ring-1 ring-brand-500'
                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            <div className="truncate">{val}</div>
                            {adj !== 0 && (
                              <div className="text-[10px] text-brand-600 font-semibold mt-0.5">
                                {adj > 0 ? `+${adj.toLocaleString('ar-EG')} ج` : `${adj.toLocaleString('ar-EG')} ج`}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {orderSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-center font-bold text-sm flex items-center justify-center gap-2 animate-in fade-in">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>تم استلام طلبك بنجاح! جارٍ تحويلك للتفاصيل...</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all"
                  >
                    تأكيد الطلب الفوري بالمواصفات المختارة
                  </button>

                  <Link
                    href={`/rfq/new?category=${encodeURIComponent(product.category)}`}
                    className="w-full block text-center py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs transition-colors"
                  >
                    طلب تعديلات معمارية خاصة أو استشارة الورشة
                  </Link>
                </>
              )}
            </div>

            {/* 72h Buyer Protection Note */}
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>ضمان المعاينة 72 ساعة من أثاث دمياط</span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                لا يُحوّل المبلغ للمعرض إلا بعد استلامك للمنتج وتصويره وتأكيد مطابقته للأخشاب والخامات المتفق عليها.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
