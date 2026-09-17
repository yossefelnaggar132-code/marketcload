'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  Store, 
  ShieldCheck, 
  FileText, 
  Search, 
  Menu, 
  X, 
  Compass, 
  User,
  ShoppingBag,
  PackageCheck,
  LogIn,
  LogOut
} from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';
import { UserRole } from '@/types';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { currentRole, switchRole, currentUser } = useMarketplaceStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'معرض الأثاث (الفيد)', icon: Compass },
    { href: '/rfq/new', label: 'طلب تفصيل مخصص (RFQ)', icon: FileText },
    { href: '/orders', label: 'الطلبات والمتابعة', icon: PackageCheck },
    { href: '/vendor/dashboard', label: 'لوحة المعرض', icon: Store },
    { href: '/admin', label: 'لوحة الإدارة', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-brand-200/50">
      {/* Top Banner for Demo Role Switcher */}
      <div className="bg-brand-900 text-brand-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>النسخة التجريبية (MVP) — صناع وتجار أثاث دمياط</span>
            <span className="text-amber-300 font-bold hidden sm:inline">• المستخدم: {currentUser?.full_name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-brand-300">تجربة الدور الحالي:</span>
            <div className="inline-flex rounded-md p-0.5 bg-brand-800 border border-brand-700">
              {(['customer', 'vendor', 'admin'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => switchRole(role)}
                  className={`px-2.5 py-0.5 rounded text-xs transition-all ${
                    currentRole === role
                      ? 'bg-brand-500 text-white font-bold shadow'
                      : 'text-brand-300 hover:text-white'
                  }`}
                >
                  {role === 'customer' && 'عميل'}
                  {role === 'vendor' && 'معرض'}
                  {role === 'admin' && 'أدمن'}
                </button>
              ))}
            </div>

            <Link
              href="/login"
              className="text-amber-300 hover:text-white text-[11px] font-bold underline mr-2"
            >
              تبديل الحساب
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-xl font-extrabold text-brand-900 block leading-tight">
                أثـاث دميـاط
              </span>
              <span className="text-[10px] text-brand-600 block tracking-wider font-semibold">
                DAMietta FURNITURE MARKET
              </span>
            </div>
          </Link>

          {/* Search bar on Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن صالون، غرفة نوم زان، مطبخ، أو اسم ورشة..."
                className="w-full pl-4 pr-10 py-2 rounded-full border border-brand-200 bg-white/90 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm transition-all"
              />
              <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-brand-400" />
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'text-brand-800 bg-brand-100/70 shadow-sm'
                      : 'text-stone-700 hover:text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-stone-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Call to action & Auth */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/rfq/new"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>طلب تفصيل خاص</span>
            </Link>

            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl text-stone-700 hover:bg-brand-50 hover:text-brand-800 text-xs font-bold transition-colors"
            >
              <LogIn className="w-4 h-4 text-brand-600" />
              <span>دخول</span>
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-brand-100 focus:outline-none"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-brand-200 bg-white/95 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="mb-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="ابحث عن أثاث..."
                className="w-full pl-4 pr-10 py-2 rounded-lg border border-brand-200 bg-stone-50 text-xs"
              />
              <Search className="absolute right-3.5 top-2.5 w-4 h-4 text-stone-400" />
            </div>
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive
                    ? 'text-brand-800 bg-brand-100 font-bold'
                    : 'text-stone-700 hover:bg-brand-50'
                }`}
              >
                <Icon className="w-4 h-4 text-brand-500" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-brand-700 hover:underline"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-stone-700 hover:underline"
            >
              حساب جديد
            </Link>
            <Link
              href="/vendor/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-amber-700 hover:underline"
            >
              تسجيل معرض
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
