'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Bookmark, Eye, Clock, Sparkles, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Product } from '@/types';
import { VendorBadge } from './VendorBadge';
import { useMarketplaceStore } from '@/lib/store';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleLike, toggleSave } = useMarketplaceStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = product.media_urls.length > 0 ? product.media_urls : [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80'
  ];

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-brand-200/80 shadow-soft hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Media Header Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={images[activeImageIndex]}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>

        {/* Post Type Badge (Available vs Portfolio) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {product.post_type === 'portfolio' ? (
            <span className="bg-stone-900/85 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>معرض أعمال (تم التسليم)</span>
            </span>
          ) : (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-sm">
              متاح للطلب الفوري
            </span>
          )}
        </div>

        {/* Trending score tag */}
        {product.trending_score > 75 && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-amber-500/95 backdrop-blur-md text-white text-[11px] px-2 py-0.5 rounded-full font-black flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 fill-white" />
              <span>رائج بدمياط</span>
            </span>
          </div>
        )}

        {/* Multi-image navigation arrows */}
        {images.length > 1 && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handlePrevImage}
              className="p-1.5 rounded-full bg-white/90 text-stone-700 shadow-md hover:bg-white pointer-events-auto transition-transform hover:scale-110"
              aria-label="الصورة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              className="p-1.5 rounded-full bg-white/90 text-stone-700 shadow-md hover:bg-white pointer-events-auto transition-transform hover:scale-110"
              aria-label="الصورة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === activeImageIndex ? 'w-4 bg-white shadow' : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Vendor info and category */}
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs font-semibold text-stone-600 truncate">
                {product.vendor?.business_name || 'معرض دمياطي'}
              </span>
              {product.vendor?.tier && (
                <VendorBadge tier={product.vendor.tier} showText={false} />
              )}
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800 whitespace-nowrap">
              {product.category}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-base text-stone-900 group-hover:text-brand-700 transition-colors line-clamp-1 mb-1">
              {product.title}
            </h3>
          </Link>

          {/* Wood Type Pill */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-brand-700 bg-amber-50/90 border border-amber-200/60 px-2 py-0.5 rounded-md font-medium inline-block">
              🪵 {product.wood_type}
            </span>
            <span className="text-xs text-stone-500 flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {product.manufacturing_time_days} يوم للتسليم
            </span>
          </div>
        </div>

        {/* Footer: Price & Interactions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
          <div>
            {product.post_type === 'portfolio' ? (
              <span className="text-sm font-bold text-brand-700">تصنيع حسب الطلب</span>
            ) : (
              <div>
                <span className="text-lg font-black text-brand-900">
                  {product.price.toLocaleString('ar-EG')}
                </span>
                <span className="text-xs text-stone-500 font-medium mr-1">جنيه</span>
              </div>
            )}
          </div>

          {/* Like & Save Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleLike(product.id)}
              className={`p-2 rounded-full transition-colors flex items-center gap-1 text-xs font-semibold ${
                product.is_liked
                  ? 'text-rose-600 bg-rose-50'
                  : 'text-stone-500 hover:text-rose-500 hover:bg-stone-100'
              }`}
              aria-label="إعجاب"
            >
              <Heart className={`w-4 h-4 ${product.is_liked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{product.likes_count || 0}</span>
            </button>

            <button
              onClick={() => toggleSave(product.id)}
              className={`p-2 rounded-full transition-colors ${
                product.is_saved
                  ? 'text-amber-600 bg-amber-50'
                  : 'text-stone-500 hover:text-amber-600 hover:bg-stone-100'
              }`}
              aria-label="حفظ"
            >
              <Bookmark className={`w-4 h-4 ${product.is_saved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
