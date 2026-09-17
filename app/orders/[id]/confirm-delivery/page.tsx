'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Upload, 
  ArrowRight, 
  ShieldCheck, 
  Camera, 
  Star,
  Clock
} from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';

export default function ConfirmDeliveryPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { orders, confirmDelivery } = useMarketplaceStore();
  const order = orders.find((o) => o.id === params.id) || orders[0];

  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('تم الاستلام والغرفة ممتازة وجودة خشب الزان الأحمر ممتازة ومطابقة للصور.');
  const [proofUrl, setProofUrl] = useState('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    confirmDelivery(order.id, proofUrl);

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
          <span>العودة لتفاصيل الطلب #{order.id}</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-soft space-y-6">
        <div className="space-y-1 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-stone-900">
            توثيق وتأكيد استلام الأثاث
          </h1>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            تأكيدك يحمي حقوقك ويسمح بصرف مستحقات صانع الأثاث بدمياط من حساب الضمان
          </p>
        </div>

        {success ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-stone-900">تم توثيق الاستلام وإغلاق الطلب بنجاح!</h3>
            <p className="text-xs text-stone-500">شكراً لتقييمك. جارٍ إعادتك لصفحة تفاصيل الطلب...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Delivery proof upload simulation */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                صورة توثيق الغرفة بعد التركيب والمعاينة <span className="text-rose-500">*</span>
              </label>
              <div className="border-2 border-dashed border-stone-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-stone-50/50">
                <Camera className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <span className="text-xs font-bold text-stone-800 block">اضغط لالتقاط أو رفع صورة القطعة في منزلك</span>
                <span className="text-[11px] text-stone-400 block mt-0.5">تُحفظ الصورة كمرجع ضمان ضد عيوب الصناعة</span>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                تقييم جودة النجارة والتشطيب وخشب دمياط
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      rating >= star ? 'text-amber-500' : 'text-stone-300'
                    }`}
                  >
                    <Star className="w-6 h-6 fill-current" />
                  </button>
                ))}
                <span className="text-xs font-bold text-stone-600 mr-2">({rating} من 5 نجوم)</span>
              </div>
            </div>

            {/* Feedback notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                رأيك وتعليقك على القطعة والمعرض
              </label>
              <textarea
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            {/* Guarantees Box */}
            <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>ضمان المنصة سارٍ ومستمر</span>
              </div>
              <p className="text-emerald-900/80 leading-relaxed text-[11px]">
                تأكيد الاستلام لا يُلغي ضمان المعرض على الخشب الطبيعي ومقاومة التسوس والكسر.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? 'جارٍ تأكيد الاستلام...' : 'تأكيد استلام الطلب رسمياً'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
