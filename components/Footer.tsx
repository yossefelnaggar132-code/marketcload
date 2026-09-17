import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-900 text-stone-300 border-t border-brand-800 mt-20">
      {/* Guarantees bar */}
      <div className="border-b border-brand-800 py-8 bg-brand-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-right">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center text-amber-300 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">أخشاب زان طبيعية معتمدة</h4>
              <p className="text-xs text-stone-400">صناعة يدوية دمياطية 100%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">حماية الشراء 72 ساعة</h4>
              <p className="text-xs text-stone-400">توثيق الاستلام وفحص الجودة</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">شحن متخصص بجميع المحافظات</h4>
              <p className="text-xs text-stone-400">تغليف كرتون وفنيين تركيب</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-brand-800 flex items-center justify-center text-rose-400 shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">ضمان حل النزاعات</h4>
              <p className="text-xs text-stone-400">فريق رقابة مباشر لإنصاف العميل</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <span className="text-lg font-black text-white">ماركت بليس أثاث دمياط</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md">
              المنصة الرقمية الأولى التي تجمع نخبة صناع ومعارض أثاث دمياط في مكان واحد. نربط العملاء بأمهر الأسطاوات والورش لتوفير أثاث كلاسيكي ومودرن عالي الجودة مباشرة من قلعة صناعة الأثاث المصرية.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">روابط هامة</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-amber-400">معرض الأثاث والفيد</Link></li>
              <li><Link href="/rfq/new" className="hover:text-amber-400">طلب تفصيل مخصص (RFQ)</Link></li>
              <li><Link href="/vendor/dashboard" className="hover:text-amber-400">انضم كمعرض بدمياط</Link></li>
              <li><Link href="/admin" className="hover:text-amber-400">لوحة المراقبة والنزاعات</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-3">الدعم والأمان</h4>
            <p className="text-xs text-stone-400 mb-2">
              جميع المعاملات المالية محمية بنظام الدفع عند الاستلام أو بوابات الدفع الرسمية.
            </p>
            <span className="inline-block text-[11px] bg-brand-800 text-amber-200 px-2.5 py-1 rounded font-semibold border border-brand-700">
              مدينة دمياط — جمهورية مصر العربية
            </span>
          </div>
        </div>

        <div className="border-t border-brand-800 mt-8 pt-6 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} ماركت بليس أثاث دمياط. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
};
