'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowLeft, 
  SlidersHorizontal, 
  Layers, 
  Award, 
  ShieldCheck, 
  PenTool,
  Search
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { CategoryTabs } from '@/components/CategoryTabs';
import { useMarketplaceStore } from '@/lib/store';

export default function HomePage() {
  const { products } = useMarketplaceStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPostType, setSelectedPostType] = useState('all');
  const [sortBy, setSortBy] = useState<'trending' | 'latest'>('trending');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        // Post type filter
        if (selectedPostType !== 'all' && p.post_type !== selectedPostType) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchWood = p.wood_type.toLowerCase().includes(q);
          const matchVendor = p.vendor?.business_name.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchWood && !matchVendor) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'trending') {
          return b.trending_score - a.trending_score;
        } else {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [products, selectedCategory, selectedPostType, sortBy, searchQuery]);

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Banner with Damietta Branding */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-l from-brand-900 via-brand-800 to-stone-900 text-white p-8 sm:p-12 shadow-2xl border border-brand-700/50">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-amber-300 border border-brand-400/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>قلعة صناعة الأثاث المصري في منصة واحدة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            أثاث دمياط الأصيل.. <br />
            <span className="text-amber-300">مباشرة من الورشة لمنزلك</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            تصفح أحدث صالونات وغرف نوم دمياط المنحوتة يدوياً من أخشاب الزان الأحمر، أو أرسل مواصفاتك الخاصة لأكثر من 15 ورشة متخصصة وتلقَ عروض أسعار متنافسة.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/rfq/new"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-brand-950 font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <PenTool className="w-4 h-4" />
              <span>طلب تفصيل مخصص بمواصفاتك (RFQ)</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <a
              href="#furniture-feed"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 transition-all"
            >
              استعراض المعروضات
            </a>
          </div>
        </div>

        {/* Decorative background overlay */}
        <div className="absolute left-0 bottom-0 top-0 w-1/2 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Main Feed Section */}
      <section id="furniture-feed">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-brand-950 flex items-center gap-2">
              <span>فيد معروضات دمياط</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800">
                {filteredProducts.length} قطعة
              </span>
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              تصفح غرف النوم، الصالونات، والمطابخ المرفوعة من معارض دمياط مع تحديث لحظي للتفاعل والرواج
            </p>
          </div>

          {/* Quick Search inside feed */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="فلترة بالاسم أو نوع الخشب..."
              className="w-full pl-3 pr-9 py-2 rounded-xl border border-brand-200 bg-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <Search className="absolute right-3 top-2.5 w-4 h-4 text-stone-400" />
          </div>
        </div>

        {/* Category & Sorting Controls */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedPostType={selectedPostType}
          onSelectPostType={setSelectedPostType}
          sortBy={sortBy}
          onSelectSort={setSortBy}
        />

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-300 p-8">
            <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 mx-auto mb-3">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-800">لا توجد معروضات مطابقة للفلتر المحدد</h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto mt-1 mb-4">
              جرّب اختيار تصنيف آخر أو مسح كلمة البحث لرؤية كافة غرف وصالونات دمياط.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPostType('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-brand-800 text-white text-xs font-bold hover:bg-brand-900"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}
      </section>

      {/* RFQ Callout Banner */}
      <section className="rounded-2xl p-6 sm:p-8 bg-amber-50 border border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2.5 py-0.5 rounded-full inline-block">
            خدمة التصنيع حسب الطلب (Custom RFQ)
          </span>
          <h3 className="text-xl font-black text-amber-950">
            لديك تصميم معين أو مقاسات خاصة لغرفتك؟
          </h3>
          <p className="text-xs text-amber-900/80 max-w-xl">
            لا تتقيد بالمعروضات الجاهزة! ارفع صورة أو مخطط لمشروعك، وستتلقى عروض أسعار مفصلة من أمهر ورش الأثاث بدمياط مع إمكانية مقارنة الأسعار واختيار الأنسب.
          </p>
        </div>

        <Link
          href="/rfq/new"
          className="px-6 py-3 rounded-xl bg-brand-800 hover:bg-brand-900 text-white text-sm font-black whitespace-nowrap shadow-md hover:shadow-lg transition-all"
        >
          اطلب تسعير غرفتك الآن
        </Link>
      </section>
    </div>
  );
}
