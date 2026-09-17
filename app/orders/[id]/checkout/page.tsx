'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CreditCard, 
  Wallet, 
  Truck, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';

export default function OrderCheckoutPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { orders } = useMarketplaceStore();
  const order = orders.find((o) => o.id === params.id) || orders[0];

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [onlineGateway, setOnlineGateway] = useState<'card' | 'wallet' | 'instapay'>('card');
  const [shippingAddress, setShippingAddress] = useState(order?.shipping_address || 'المعادي - القاهرة');
  const [receiverPhone, setReceiverPhone] = useState(order?.customer_phone || '01012345678');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const subtotal = order?.total_price || 42000;
  const platformFee = Math.round(subtotal * 0.03); // 3%
  const shippingCost = 1500;
  const grandTotal = subtotal + shippingCost;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        router.push(`/orders/${order?.id || 'ord-101'}`);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-0 space-y-8 pb-16">
      <div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة الطلبات</span>
        </Link>
      </div>

      <div className="bg-gradient-to-l from-brand-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-2 border border-brand-700">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>الدفع الآمن وضمان أموال المشترين</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          إتمام الطلب وتأكيد الدفع #{order?.id || params.id}
        </h1>
        <p className="text-xs text-stone-300">
          أموالك محفوظة في حساب ضمان المنصة حتى استلام ومعاينة قطعة الأثاث والتأكد من مطابقة الخشب
        </p>
      </div>

      {isDone ? (
        <div className="bg-white rounded-3xl p-10 text-center space-y-4 border border-brand-200/80 shadow-soft">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-stone-900">
            {paymentMethod === 'online' ? 'تم تأكيد الدفع بنجاح!' : 'تم تأكيد حجز الطلب بنجاح!'}
          </h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
            تم إشعار المعرض ببدء تجهيز وشحن أثاث دمياط. جارٍ نقلك لصفحة متابعة تفاصيل الطلب...
          </p>
        </div>
      ) : (
        <form onSubmit={handlePay} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left / Main form */}
          <div className="md:col-span-2 space-y-6">
            {/* Delivery address */}
            <div className="bg-white rounded-3xl p-6 border border-brand-200/80 shadow-soft space-y-4">
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-600" />
                <span>عنوان التوصيل والتسليم</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">العنوان التفصيلي (الشارع، العمارة، الشقة)</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-stone-700 block">رقم هاتف المستلم لتنسيق وصول الشاحنة</label>
                  <input
                    type="tel"
                    required
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 border border-brand-200/80 shadow-soft space-y-4">
              <h3 className="text-sm font-black text-stone-900 flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-600" />
                <span>طريقة الدفع المقبولة</span>
              </h3>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('online')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'online'
                      ? 'border-brand-700 bg-brand-50/70 ring-2 ring-brand-500'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                    className="mt-1 text-brand-800 focus:ring-brand-500"
                  />
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900 text-sm">دفع إلكتروني آمن (Paymob Escrow)</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">موصى به</span>
                    </div>
                    <p className="text-stone-500">
                      فيزا، ماستركارد، فودافون كاش، محفظة إلكترونية أو إنستاباي. لا تُصرف مستحقات المعرض إلا بعد موافقتك.
                    </p>

                    {paymentMethod === 'online' && (
                      <div className="pt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setOnlineGateway('card')}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${
                            onlineGateway === 'card'
                              ? 'bg-brand-800 text-white border-brand-800'
                              : 'bg-white text-stone-600 border-stone-200'
                          }`}
                        >
                          بطاقة ائتمان / ميزة
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineGateway('wallet')}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${
                            onlineGateway === 'wallet'
                              ? 'bg-brand-800 text-white border-brand-800'
                              : 'bg-white text-stone-600 border-stone-200'
                          }`}
                        >
                          محافظ إلكترونية (فودافون كاش)
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineGateway('instapay')}
                          className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold ${
                            onlineGateway === 'instapay'
                              ? 'bg-brand-800 text-white border-brand-800'
                              : 'bg-white text-stone-600 border-stone-200'
                          }`}
                        >
                          إنستاباي InstaPay
                        </button>
                      </div>
                    )}
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-brand-700 bg-brand-50/70 ring-2 ring-brand-500'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-brand-800 focus:ring-brand-500"
                  />
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-stone-900 text-sm">الدفع عند الاستلام والمعاينة (COD)</span>
                    <p className="text-stone-500">
                      تدفع لمندوب شحن دمياط بعد فحص الخشب والغرفة عند باب منزلك.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Summary column */}
          <div className="space-y-5">
            <div className="bg-white rounded-3xl p-6 border border-brand-200/80 shadow-soft space-y-4">
              <h3 className="text-sm font-black text-stone-900 border-b border-stone-100 pb-3">
                ملخص الفاتورة
              </h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-stone-600">
                  <span>سعر القطعة الأساسي:</span>
                  <span className="font-bold text-stone-900">{subtotal.toLocaleString('ar-EG')} ج</span>
                </div>
                <div className="flex items-center justify-between text-stone-600">
                  <span>مصاريف شحن ونقل دمياط:</span>
                  <span className="font-bold text-stone-900">{shippingCost.toLocaleString('ar-EG')} ج</span>
                </div>
                <div className="flex items-center justify-between text-stone-500 text-[11px]">
                  <span>رسوم حماية المنصة (3%):</span>
                  <span className="text-emerald-700 font-bold">مشمولة بالسعر</span>
                </div>

                <div className="border-t border-stone-200 pt-3 flex items-center justify-between">
                  <span className="font-black text-stone-900 text-sm">الإجمالي النهائي:</span>
                  <span className="font-black text-brand-900 text-base">
                    {grandTotal.toLocaleString('ar-EG')} جنيه
                  </span>
                </div>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-500 space-y-1">
                <div className="flex items-center gap-1 font-bold text-stone-800">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>فترة حماية المعاينة: 72 ساعة</span>
                </div>
                <p>لديك 72 ساعة بعد وصول الأثاث لمطابقة خشب الزان والدهانات والتأكد من سلامة الغرفة.</p>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-black text-xs shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isProcessing
                  ? 'جارٍ الاتصال ببوابة الدفع...'
                  : paymentMethod === 'online'
                  ? 'الدفع الآن وتأكيد الطلب'
                  : 'تأكيد طلب الشحن (دفع عند الاستلام)'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
