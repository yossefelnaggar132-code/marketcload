'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Plus, Trash2, Upload, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { useMarketplaceStore } from '@/lib/store';
import { FurnitureCategory, PostType } from '@/types';
import { ImageUploader } from '@/components/ImageUploader';

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct, vendors } = useMarketplaceStore();
  const currentVendor = vendors[0];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(35000);
  const [category, setCategory] = useState<FurnitureCategory>('غرف نوم');
  const [postType, setPostType] = useState<PostType>('available');
  const [woodType, setWoodType] = useState('خشب زان أحمر روماني طبيعي');
  const [manufacturingDays, setManufacturingDays] = useState(15);
  const [mediaUrls, setMediaUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80'
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Customization builder
  const [customOptions, setCustomOptions] = useState<Array<{ name: string; valuesStr: string }>>([
    { name: 'لون الدهان', valuesStr: 'شامبين مذهب, أوف وايت عسلي, أبيض دوكو' },
    { name: 'نوع القماش', valuesStr: 'قطيفة تركي, كتان معالج' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddOption = () => {
    setCustomOptions([...customOptions, { name: '', valuesStr: '' }]);
  };

  const handleRemoveOption = (index: number) => {
    setCustomOptions(customOptions.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, field: 'name' | 'valuesStr', val: string) => {
    const updated = [...customOptions];
    updated[index][field] = val;
    setCustomOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mediaUrls.length === 0) {
      setErrorMsg('يرجى رفع صورة واحدة على الأقل لقطعة الأثاث أو اختيار نموذج');
      return;
    }

    setIsSubmitting(true);

    const formattedOptions = customOptions
      .filter(o => o.name.trim() && o.valuesStr.trim())
      .map((o, idx) => ({
        id: `opt-new-${idx}`,
        product_id: '',
        option_name: o.name.trim(),
        values: o.valuesStr.split(',').map(v => v.trim()),
        price_adjustments: o.valuesStr.split(',').map((_, i) => i * 500)
      }));

    const created = addProduct({
      vendor_id: currentVendor.id,
      vendor: currentVendor,
      title,
      description,
      price: postType === 'portfolio' ? 0 : Number(price),
      category,
      post_type: postType,
      wood_type: woodType,
      manufacturing_time_days: Number(manufacturingDays),
      media_urls: mediaUrls,
      customization_options: formattedOptions,
    });

    setTimeout(() => {
      router.push(`/products/${created.id}`);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div>
        <Link
          href="/vendor/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-500 hover:text-brand-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للوحة المعرض</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-200/80 shadow-soft space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">
            رفع قطعة أثاث جديدة لمعرضك بدمياط
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            سيتم عرض المنتج في الفيد الرئيسي وإتاحته للشراء المباشر أو التخصيص
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Post Type Selector (Available vs Portfolio) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              طبيعة المنشور (نوع العرض) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPostType('available')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  postType === 'available'
                    ? 'border-brand-700 bg-brand-50/80 text-brand-950 font-bold ring-2 ring-brand-500'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="block text-sm font-black">متاح للطلب والشراء المباشر</span>
                <span className="block text-[11px] text-stone-500 mt-0.5">جاهز للتسليم أو التصنيع بمواصفات وأسعار محددة</span>
              </button>

              <button
                type="button"
                onClick={() => setPostType('portfolio')}
                className={`p-3 rounded-xl border text-right transition-all ${
                  postType === 'portfolio'
                    ? 'border-brand-700 bg-brand-50/80 text-brand-950 font-bold ring-2 ring-brand-500'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="block text-sm font-black">معرض أعمال (Portfolio)</span>
                <span className="block text-[11px] text-stone-500 mt-0.5">قطعة تم تسليمها وتصنيعها مسبقاً لعرض خبرات الورشة</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              اسم وموديل القطعة <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: صالون ملكي أويما دمياطي مع ترابيزة رخام"
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                الفئة <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FurnitureCategory)}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm bg-stone-50 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                <option value="غرف نوم">غرف نوم</option>
                <option value="صالونات">صالونات وركنات</option>
                <option value="غرف سفرة">غرف سفرة</option>
                <option value="مطابخ">مطابخ</option>
                <option value="مكاتب">مكاتب وديكورات</option>
              </select>
            </div>

            {postType === 'available' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-800">
                  السعر الأساسي (بالجنيه المصري) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold"
                />
              </div>
            )}
          </div>

          {/* Wood Type & Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                نوع الخشب المستخدم <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={woodType}
                onChange={(e) => setWoodType(e.target.value)}
                placeholder="مثال: خشب زان أحمر روماني طبيعي"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-800">
                مدة التصنيع والتجهيز (بالأيام)
              </label>
              <input
                type="number"
                min={1}
                value={manufacturingDays}
                onChange={(e) => setManufacturingDays(Number(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Real interactive multi-image uploader */}
          <ImageUploader
            images={mediaUrls}
            onChange={setMediaUrls}
            maxImages={8}
            label="صور قطعة الأثاث ومعروضات الورشة"
            helpText="ارفع صور واضحة من جهازك أو هاتفك لزوايا القطعة ونقوش الأويما ونوع الخشب"
            allowPresets={true}
          />

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-800">
              الوصف الكامل والمقاسات والمحتويات <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب مواصفات القطعة وعدد المقاعد أو الضلف والضمان المقدم..."
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Dynamic Customization Options Builder */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-stone-900">
                  خيارات التخصيص المتاحة للمشتري
                </h4>
                <p className="text-[11px] text-stone-400">
                  أضف خيارات تتيح للمشتري تحديد الدهان أو القماش أو المقاس
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddOption}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة خيار تخصيص</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {customOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <input
                    type="text"
                    placeholder="اسم الخيار (مثلاً: لون الدهان)"
                    value={opt.name}
                    onChange={(e) => handleOptionChange(idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white"
                  />
                  <input
                    type="text"
                    placeholder="القيم مفصولة بفواصل (مثلاً: ذهبي, أبيض, أستر)"
                    value={opt.valuesStr}
                    onChange={(e) => handleOptionChange(idx, 'valuesStr', e.target.value)}
                    className="flex-2 px-3 py-1.5 rounded-lg border border-stone-200 text-xs bg-white w-1/2"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                    aria-label="حذف الخيار"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-xl bg-brand-800 hover:bg-brand-900 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'جارٍ رفع القطعة للفيد...' : 'نشر القطعة الآن في ماركت بليس أثاث دمياط'}
          </button>
        </form>
      </div>
    </div>
  );
}
