'use client';

import React from 'react';
import { FurnitureCategory, PostType } from '@/types';
import { Flame, Clock, Sparkles } from 'lucide-react';

interface CategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedPostType: string;
  onSelectPostType: (type: string) => void;
  sortBy: 'trending' | 'latest';
  onSelectSort: (sort: 'trending' | 'latest') => void;
}

const CATEGORIES: { label: string; value: string }[] = [
  { label: 'جميع المعروضات', value: 'all' },
  { label: '🛏️ غرف نوم', value: 'غرف نوم' },
  { label: '🛋️ صالونات وركنات', value: 'صالونات' },
  { label: '🍽️ غرف سفرة', value: 'غرف سفرة' },
  { label: '🍳 مطابخ خشب ومودرن', value: 'مطابخ' },
  { label: '💼 مكاتب وديكورات', value: 'مكاتب' },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedPostType,
  onSelectPostType,
  sortBy,
  onSelectSort,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => onSelectCategory(cat.value)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                isSelected
                  ? 'bg-brand-800 text-white shadow-md scale-105'
                  : 'bg-white text-stone-700 hover:bg-brand-50 border border-brand-200/70'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filter Options Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-brand-200/50">
        {/* Post Type Filter (All / Available / Portfolio) */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-brand-200/60 shadow-sm text-xs font-semibold">
          <button
            onClick={() => onSelectPostType('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedPostType === 'all' ? 'bg-brand-100 text-brand-900 font-bold' : 'text-stone-600'
            }`}
          >
            الكل
          </button>
          <button
            onClick={() => onSelectPostType('available')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedPostType === 'available' ? 'bg-emerald-100 text-emerald-900 font-bold' : 'text-stone-600'
            }`}
          >
            متاح للبيع الفوري
          </button>
          <button
            onClick={() => onSelectPostType('portfolio')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              selectedPostType === 'portfolio' ? 'bg-amber-100 text-amber-900 font-bold' : 'text-stone-600'
            }`}
          >
            معرض تسليمات سابقة (Portfolio)
          </button>
        </div>

        {/* Sorting Switcher */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-stone-500">الترتيب:</span>
          <button
            onClick={() => onSelectSort('trending')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
              sortBy === 'trending'
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm font-bold'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>الأكثر رواجاً (Trending)</span>
          </button>
          <button
            onClick={() => onSelectSort('latest')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border transition-all ${
              sortBy === 'latest'
                ? 'bg-brand-800 text-white border-brand-800 shadow-sm font-bold'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>الأحدث نشرًا</span>
          </button>
        </div>
      </div>
    </div>
  );
};
