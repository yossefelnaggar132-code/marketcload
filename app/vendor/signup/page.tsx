'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, Sparkles, ArrowLeft, ShieldCheck, CheckCircle2, FileText, MapPin, Phone, User, Mail, Lock } from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';

export default function VendorSignupPage() {
  const router = useRouter();
  const { signupVendor } = useMarketplaceStore();

  const [businessName, setBusinessName] = useState('');
  const [commercialRegistration, setCommercialRegistration] = useState('');
  const [workshopAddress, setWorkshopAddress] = useState('');
  const [specialty, setSpecialty] = useState('صالونات كلاسيك وأويما دمياطي');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    signupVendor({
      business_name: businessName,
      commercial_registration: commercialRegistration,
      workshop_address: workshopAddress,
      city: 'دمياط',
      specialty,
      full_name: fullName,
      email,
      phone,
    });

    setSuccess(true);
    setTimeout(() => {
      router.push('/vendor/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 sm:px-0 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-l from-brand-900 via-stone-900 to-amber-950 text-white p-8 rounded-3xl shadow-xl space-y-3 border border-brand-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
          <Store className="w-3.5 h-3.5" />
          <span>انضمام المعارض وصناع الأثاث بدمياط</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          سجل ورشتك أو معرضك في المنصة المركزية لأثاث دمياط
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          اعرض قطعك الجاهزة للبيع مباشرة بدون عمولات وسيط باهظة، واستقبل طلبات المناقصات وتفصيل الغرف المخصصة (RFQ) من العملاء في شتى أنحاء مصر.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-soft space-y-6">
        {success ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-stone-900">
              تم استلام طلب انضمام معرضك بنجاح!
            </h3>
            <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
              حالتك الأولية الآن: <span className="font-bold text-amber-700">قيد المراجعة والتوثيق</span>. يمكنك البدء في استكشاف لوحة المعرض وإعداد معروضاتك ريثما يتم تدقيق السجل التجاري من قبل الإدارة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Section 1: Business info */}
            <div>
              <h3 className="text-sm font-black text-stone-900 mb-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-brand-600" />
                <span>بيانات المعرض أو الورشة</span>
              </h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    الاسم التجاري للمعرض أو الورشة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="مثال: مؤسسة الدسوقي لصناعة الأثاث الكلاسيك والمودرن"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">
                      رقم السجل التجاري أو البطاقة الضريبية <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={commercialRegistration}
                      onChange={(e) => setCommercialRegistration(e.target.value)}
                      placeholder="مثال: CR-764921"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">
                      التخصص الأساسي في الأثاث <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    >
                      <option value="صالونات كلاسيك وأويما دمياطي">صالونات كلاسيك وأويما دمياطي</option>
                      <option value="غرف نوم كلاسيك ومودرن خشب زان">غرف نوم كلاسيك ومودرن خشب زان</option>
                      <option value="سفرة ومطابخ أرو وقرو وزان">سفرة ومطابخ أرو وقرو وزان</option>
                      <option value="أثاث قصور وتفصيل خاص">أثاث قصور ومشاريع خاصة</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    عنوان الورشة أو المعرض بدمياط <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={workshopAddress}
                    onChange={(e) => setWorkshopAddress(e.target.value)}
                    placeholder="مثال: طريق المحور - بجوار سوق الخشب المركزي، دمياط"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Owner profile */}
            <div className="pt-2 border-t border-stone-100">
              <h3 className="text-sm font-black text-stone-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-600" />
                <span>بيانات المسؤول وصاحب الشأن</span>
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">
                      اسم الصانع أو المدير المسئول <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مثال: الحاج إبراهيم الدسوقي"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">
                      رقم الهاتف المباشر (واتساب للتواصل) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01223456789"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">
                      البريد الإلكتروني للوحة المعرض <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="workshop@damietta.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-stone-700">
                      كلمة المرور <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Note about verification */}
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">ميثاق جودة صناع دمياط</span>
                <span>بإرسال هذا النموذج تتعهد بصحة رقم السجل التجاري واستخدام الأخشاب الطبيعية المذكورة في المعروضات لضمان ثقة المشتري.</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-brand-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'جارٍ تسجيل المعرض وتجهيز الحساب...' : 'تقديم طلب انضمام المعرض'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="border-t border-stone-100 pt-4 text-center text-xs text-stone-600">
          لديك حساب معرض مسجل مسبقاً؟{' '}
          <Link href="/login" className="font-bold text-brand-700 hover:underline">
            تسجيل الدخول للوحة المعرض
          </Link>
        </div>
      </div>
    </div>
  );
}
