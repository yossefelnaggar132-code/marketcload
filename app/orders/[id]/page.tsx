'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Upload, 
  AlertTriangle,
  ArrowRight,
  Store,
  Phone
} from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';
import { MOCK_ORDERS } from '@/lib/mock-data';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { orders, confirmDelivery } = useMarketplaceStore();
  const order = orders.find((o) => o.id === params.id) || MOCK_ORDERS[0];

  const [proofUrl, setProofUrl] = useState('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600');
  const [isConfirming, setIsConfirming] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  const handleConfirm = () => {
    setIsConfirming(true);
    confirmDelivery(order.id, proofUrl);
    setTimeout(() => {
      setIsConfirming(false);
    }, 600);
  };

  const handleDispute = (e: React.FormEvent) => {
    e.preventDefault();
    setDisputeSubmitted(true);
    setTimeout(() => {
      setShowDisputeModal(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمعروضات</span>
        </Link>
      </div>

      {/* Order Status Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-soft space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <span className="text-xs text-stone-400 block">تفاصيل الطلب والفاتورة</span>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">
              طلب #{order.id}
            </h1>
          </div>
          <div className="text-left">
            <span className="text-xs text-stone-400 block">الإجمالي المدفوع:</span>
            <span className="text-2xl font-black text-brand-950">
              {order.total_price.toLocaleString('ar-EG')} جنيه
            </span>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="py-4">
          <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-emerald-800">تم الطلب والاتفاق</span>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Package className="w-5 h-5" />
              </div>
              <span className="text-emerald-800">التصنيع والتجهيز</span>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-emerald-800">تم الشحن والتسليم</span>
            </div>

            <div className="space-y-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto shadow-md transition-all ${
                order.status === 'delivered_confirmed'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-500 text-white animate-pulse'
              }`}>
                {order.status === 'delivered_confirmed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <span className={order.status === 'delivered_confirmed' ? 'text-emerald-800' : 'text-amber-800 font-extrabold'}>
                {order.status === 'delivered_confirmed' ? 'تم توثيق الاستلام' : 'مهلة الفحص 72h'}
              </span>
            </div>
          </div>
        </div>

        {/* 72h Delivery Confirmation Banner */}
        {order.status !== 'delivered_confirmed' ? (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 space-y-3">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0" />
              <span>مهلة توثيق الاستلام (متبقي 48 ساعة)</span>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              وفقاً لقواعد ماركت بليس أثاث دمياط، تم حجز مستحقات المعرض في نظام المنصة. يرجى فحص الأخشاب، الدهان، والقماش جيداً ثم رفع صورة التوثيق لاعتماد الاستلام، أو فتح نزاع في حال وجود أي عيب.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={handleConfirm}
                disabled={isConfirming}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isConfirming ? 'جارٍ الاعتماد...' : 'رفع صورة إثبات الاستلام واعتماد الطلب'}</span>
              </button>

              <button
                onClick={() => setShowDisputeModal(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>فتح نزاع / إبلاغ عن مشكلة</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>تم توثيق استلام الأثاث بنجاح، وتم تحويل مستحقات المعرض رسمياً مع إتمام ضمان الجودة.</span>
          </div>
        )}

        {/* Item Details */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <h3 className="font-bold text-stone-900 text-sm">بيانات المنتج المطلوب:</h3>
          <div className="flex gap-4 items-center bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
            <div className="w-20 h-20 rounded-xl overflow-hidden relative shrink-0 bg-stone-200">
              <img src={order.product?.media_urls[0] || 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300'} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1 text-xs">
              <h4 className="font-black text-stone-900 text-sm">{order.product?.title || 'غرفة نوم ملكية فينيسيا'}</h4>
              <div className="text-stone-500">المعرض المنفذ: <span className="font-bold text-stone-700">{order.vendor_name}</span></div>
              <div className="text-stone-500">العنوان المسجل: <span className="text-stone-700">{order.shipping_address}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-600 font-black text-base">
              <ShieldAlert className="w-5 h-5" />
              <span>فتح نزاع رسمي للطلب #{order.id}</span>
            </div>

            {disputeSubmitted ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <span>تم تسجيل النزاع، وسيتدخل فريق إدارة أثاث دمياط خلال 24 ساعة للفصل وحماية حقوقك.</span>
              </div>
            ) : (
              <form onSubmit={handleDispute} className="space-y-4 text-xs">
                <p className="text-stone-600">
                  يرجى توضيح سبب النزاع (عيوب في الأخشاب، تلف أثناء الشحن، عدم مطابقة الدهان أو المقاسات المتفق عليها):
                </p>
                <textarea
                  required
                  rows={4}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="اكتب سبب الشكوى بالتفصيل..."
                  className="w-full p-3 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDisputeModal(false)}
                    className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 font-bold"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold"
                  >
                    إرسال الشكوى للإدارة
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
