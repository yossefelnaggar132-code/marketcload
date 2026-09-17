'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  AlertTriangle, 
  ArrowRight, 
  Upload, 
  ShieldAlert, 
  CheckCircle2, 
  FileText
} from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';

export default function OrderDisputePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { orders, createDispute } = useMarketplaceStore();
  const order = orders.find((o) => o.id === params.id) || orders[0];

  const [disputeCategory, setDisputeCategory] = useState('نوع الخشب غير مطابق للمتفق عليه');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const fullReason = `[${disputeCategory}] ${description}`;
    createDispute({
      order_id: order.id,
      reason: fullReason,
      evidence_urls: [evidenceUrl],
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        router.push(`/orders/${order.id}`);
      }, 1500);
    }, 800);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-0 space-y-6 pb-16">
      <div>
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>إلغاء والعودة لتفاصيل الطلب #{order.id}</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-soft space-y-6">
        <div className="space-y-1 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-2">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            فتح نزاع ومطالبة بفحص الجودة
          </h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            يتم تجميد أموال الطلب في حساب الضمان فوراً، وتتدخل إدارة المنصة للفصل بينك وبين الورشة
          </p>
        </div>

        {success ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-stone-900">تم تسجيل النزاع وتجميد المستحقات بنجاح!</h3>
            <p className="text-xs text-stone-500">تم إرسال الملف للجنة فض النزاعات بدمياط. جارٍ نقلك للطلب...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">
                سبب النزاع والمطالبة <span className="text-rose-500">*</span>
              </label>
              <select
                value={disputeCategory}
                onChange={(e) => setDisputeCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option value="نوع الخشب غير مطابق للمتفق عليه (ليس زان أحمر)">نوع الخشب غير مطابق للمتفق عليه (ليس زان أحمر)</option>
                <option value="اختلاف المقاسات والأبعاد عن المطلوب في العقد">اختلاف المقاسات والأبعاد عن المطلوب في العقد</option>
                <option value="عيوب واضحة في دهانات الاستر أو الأويما والخدوش">عيوب واضحة في دهانات الاستر أو الأويما والخدوش</option>
                <option value="نوع ولون القماش مختلف أو تالف">نوع ولون القماش مختلف أو تالف</option>
                <option value="تأخر التسليم لأكثر من 15 يوماً دون إشعار">تأخر التسليم لأكثر من 15 يوماً دون إشعار</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">
                تفاصيل الشكوى بدقة <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اشرح المشكلة بالتفصيل ومقدار الفرق عن المواصفات المتفق عليها..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                إرفاق صور الأدلة والمطابقة (خشب، دهان، كسر) <span className="text-rose-500">*</span>
              </label>
              <div className="border-2 border-dashed border-stone-300 hover:border-rose-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50">
                <Upload className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-stone-800 block">اضغط لرفع صور وفيديوهات الإثبات</span>
                <span className="text-[11px] text-stone-400 block mt-0.5">تقوم الإدارة بمقارنتها مع صور العقد والورشة</span>
              </div>
            </div>

            <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldAlert className="w-4 h-4 text-rose-700" />
                <span>إجراءات الحماية المتبعة:</span>
              </div>
              <p className="text-rose-900/80 text-[11px] leading-relaxed">
                يتم إيقاف تحويل أي أموال للمعرض، ومطالبته بإصلاح العيب أو إعادة الدهان أو استرجاع القطعة ورد المبلغ للمشتري خلال 48 ساعة.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-black text-xs shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? 'جارٍ تسجيل الشكوى...' : 'تأكيد فتح النزاع رسمياً'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
