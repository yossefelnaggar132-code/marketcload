'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PenTool, Upload, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';
import { FurnitureCategory } from '@/types';

const CATEGORIES: FurnitureCategory[] = [
  'غرف نوم',
  'صالونات',
  'مطابخ',
  'غرف سفرة',
  'مكاتب',
  'ديكورات وأخرى'
];

function NewRFQForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = (searchParams.get('category') as FurnitureCategory) || 'صالونات';

  const { addRFQ } = useMarketplaceStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FurnitureCategory>(initialCategory);
  const [specifications, setSpecifications] = useState('');
  const [budgetRange, setBudgetRange] = useState('30,000 - 45,000 جنيه');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !specifications) return;

    setIsSubmitting(true);
    const newRfq = addRFQ({
      customer_id: 'cust-1',
      customer_name: 'أحمد سامي المهدي',
      title,
      category,
      specifications,
      budget_range: budgetRange,
      sample_images: [
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80'
      ],
    });

    setSuccess(true);
    setTimeout(() => {
      router.push(`/rfq/${newRfq.id}`);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-soft">
      {success ? (
        <div className="text-center py-12 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-stone-900">تم نشر طلبك وتوزيعه بنجاح!</h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            تم إشعار ورش ومعارض دمياط المتخصصة في ({category}). جارٍ تحويلك لمتابعة ومقارنة العروض المقدمة...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              عنوان مختصر للطلب <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: مطلوب تصنيع صالون كلاسيك مذهب مقاس 5×4 متر"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Category Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              الفئة التخصصية <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    category === cat
                      ? 'bg-brand-800 text-white border-brand-800 shadow-sm'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Specs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              المواصفات التفصيلية والأبعاد ونوع الخشب المطلوب <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              placeholder="وضح المقاسات المطلوبة، تفضيلات نوع الخشب (زان أحمر، أرو، زان مطعم)، نوع القماش (كتان، قطيفة، جلد مقلوب)، ونوع الدهان المفضل..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Budget Range */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              الميزانية المتوقعة للطلب
            </label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="20,000 - 35,000 جنيه">20,000 - 35,000 جنيه</option>
              <option value="35,000 - 50,000 جنيه">35,000 - 50,000 جنيه</option>
              <option value="50,000 - 80,000 جنيه">50,000 - 80,000 جنيه</option>
              <option value="أكثر من 80,000 جنيه">أكثر من 80,000 جنيه (أثاث قصور وفلل)</option>
            </select>
          </div>

          {/* Simulated file upload */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              إرفاق صور أو رسومات هندسية توضيحية (اختياري)
            </label>
            <div className="border-2 border-dashed border-stone-300 hover:border-brand-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50">
              <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <span className="text-xs font-bold text-stone-700 block">اضغط لاختيار صور الموديل أو المخطط</span>
              <span className="text-[11px] text-stone-400 block mt-1">يدعم PNG, JPG, PDF بحد أقصى 10 ميجا</span>
            </div>
          </div>

          {/* Guarantees */}
          <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/60 flex items-start gap-3 text-xs text-amber-900">
            <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">حماية مشتري أثاث دمياط</span>
              <span>لا يتم تحصيل أي مبالغ الآن، الطلب مجاني وستحصل على عروض أسعار متنافسة وتختار بحرية تامة.</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'جارٍ نشر وتوزيع الطلب...' : 'إرسال الطلب لورش ومعارض دمياط'}
          </button>
        </form>
      )}
    </div>
  );
}

export default function NewRFQPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمعروضات</span>
        </Link>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-l from-brand-900 to-stone-900 text-white p-8 rounded-3xl shadow-xl space-y-2 border border-brand-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>نظام المناقصات وطلبات الأسعار (RFQ)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          اطلب تفصيل أثاث بمواصفاتك من معارض دمياط
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
          اكتب تفاصيل ومقاسات غرفتك، وسيتم إرسال الطلب تلقائياً لجميع الورش والمعارض المتخصصة في دمياط لتقديم أفضل عروض أسعار متنافسة.
        </p>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-stone-500 font-bold">جارٍ تحميل النموذج...</div>}>
        <NewRFQForm />
      </Suspense>
    </div>
  );
}
