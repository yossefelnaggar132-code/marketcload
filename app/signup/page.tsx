'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, User, Mail, Lock, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';

export default function CustomerSignupPage() {
  const router = useRouter();
  const { signupCustomer } = useMarketplaceStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('القاهرة');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    signupCustomer({
      full_name: fullName,
      email,
      phone,
      city,
    });

    setSuccess(true);
    setTimeout(() => {
      router.push('/');
    }, 1200);
  };

  return (
    <div className="max-w-lg mx-auto py-10 px-4 sm:px-0 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-900/20">
          <Sparkles className="w-7 h-7 text-amber-300" />
        </div>
        <h1 className="text-2xl font-black text-stone-900">
          إنشاء حساب مشتري / عميل جديد
        </h1>
        <p className="text-xs text-stone-500">
          تصفح آلاف قطع أثاث دمياط الأصلية واطلب تفصيل صالونك وغرفتك مباشرة من ورش التصنيع
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-soft space-y-5">
        {success ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-stone-900">أهلاً بك في ماركت بليس أثاث دمياط!</h3>
            <p className="text-xs text-stone-500">تم تسجيل حسابك بنجاح. جارٍ توجيهك للمعرض الرئيسي...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">الاسم ثلاثي أو ثنائي بالكامل <span className="text-rose-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: أحمد محمد المهدي"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
                <User className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">البريد الإلكتروني <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@gmail.com"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <Mail className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">رقم الهاتف (واتساب) <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01012345678"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <Phone className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">المحافظة / المدينة <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="القاهرة">القاهرة</option>
                    <option value="الجيزة">الجيزة</option>
                    <option value="الإسكندرية">الإسكندرية</option>
                    <option value="دمياط">دمياط</option>
                    <option value="الدقهلية">الدقهلية (المنصورة)</option>
                    <option value="الشرقية">الشرقية</option>
                    <option value="أسيوط">أسيوط وباقي الصعيد</option>
                  </select>
                  <MapPin className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-stone-700">كلمة المرور <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <Lock className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{isSubmitting ? 'جارٍ إنشاء الحساب...' : 'تأكيد التسجيل وبدء التسوق'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="border-t border-stone-100 pt-4 text-center text-xs text-stone-600 space-y-1">
          <div>
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="font-bold text-brand-700 hover:underline">
              تسجيل الدخول
            </Link>
          </div>
          <div>
            أنت صانع أو صاحب معرض بدمياط؟{' '}
            <Link href="/vendor/signup" className="font-bold text-amber-700 hover:underline">
              انضم كمعرض معتمد بدمياط
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
