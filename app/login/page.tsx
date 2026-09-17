'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, ArrowLeft, Lock, Mail, ShieldCheck, Store, UserCheck } from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useMarketplaceStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    login(email, selectedRole);

    setTimeout(() => {
      if (selectedRole === 'vendor') {
        router.push('/vendor/dashboard');
      } else if (selectedRole === 'admin') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    }, 600);
  };

  const handleQuickLogin = (role: UserRole) => {
    const roleEmail = role === 'vendor' ? 'desouky@damietta.com' : role === 'admin' ? 'admin@damietta-market.gov.eg' : 'customer@damietta.com';
    login(roleEmail, role);
    if (role === 'vendor') router.push('/vendor/dashboard');
    else if (role === 'admin') router.push('/admin');
    else router.push('/');
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4 sm:px-0 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-900 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-900/20">
          <Sparkles className="w-7 h-7 text-amber-300" />
        </div>
        <h1 className="text-2xl font-black text-stone-900">
          تسجيل الدخول لمنصة أثاث دمياط
        </h1>
        <p className="text-xs text-stone-500">
          منصة تجمع ورش وصناع ومعارض دمياط بالعملاء في كافة المحافظات
        </p>
      </div>

      {/* Quick Role Tester Bar */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2 text-xs">
        <span className="font-bold text-amber-900 block">
          ⚡ تسجيل دخول تجريبي سريع بنقرة واحدة:
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('customer')}
            className="py-2 px-2.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold hover:bg-amber-100/50 transition-colors flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5 text-brand-600" />
            <span>عميل</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('vendor')}
            className="py-2 px-2.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold hover:bg-amber-100/50 transition-colors flex items-center justify-center gap-1.5"
          >
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>معرض</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin')}
            className="py-2 px-2.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold hover:bg-amber-100/50 transition-colors flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            <span>أدمن</span>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-soft space-y-5">
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Role selector in login */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">نوع الحساب</label>
            <div className="grid grid-cols-3 gap-2">
              {(['customer', 'vendor', 'admin'] as UserRole[]).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    selectedRole === r
                      ? 'bg-brand-800 text-white border-brand-800 shadow-sm'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {r === 'customer' && 'مشتري / عميل'}
                  {r === 'vendor' && 'معرض / ورشة'}
                  {r === 'admin' && 'إدارة المنصة'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-stone-700">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <Mail className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-stone-700">كلمة المرور</label>
              <a href="#" className="text-[11px] font-bold text-brand-700 hover:underline">
                نسيت كلمة المرور؟
              </a>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
              <Lock className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>{isSubmitting ? 'جارٍ تسجيل الدخول...' : 'دخول إلى الحساب'}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>

        <div className="border-t border-stone-100 pt-4 space-y-2 text-center text-xs text-stone-600">
          <div>
            ليس لديك حساب؟{' '}
            <Link href="/signup" className="font-bold text-brand-700 hover:underline">
              تسجيل حساب عميل جديد
            </Link>
          </div>
          <div>
            هل أنت صانع أو صاحب معرض بدمياط؟{' '}
            <Link href="/vendor/signup" className="font-bold text-amber-700 hover:underline">
              سجل ورشتك/معرضك الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
