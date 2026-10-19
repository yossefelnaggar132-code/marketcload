'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Trash2, Image as ImageIcon, Sparkles, Plus, Loader2 } from 'lucide-react';
import { compressImage, FURNITURE_PRESETS, FurniturePreset } from '@/lib/image-utils';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helpText?: string;
  allowPresets?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 6,
  label = 'صور ومعروضات الأثاث',
  helpText = 'يدعم صور PNG, JPG, WebP أو مخططات حتى 10 ميجا (يتم ضغطها تلقائياً لأعلى سرعة)',
  allowPresets = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        setErrorMessage(`لقد وصلت للحد الأقصى المسموح (${maxImages} صور)`);
        setIsProcessing(false);
        return;
      }

      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      const newUrls: string[] = [];

      for (const file of filesToProcess) {
        if (!file.type.startsWith('image/')) {
          continue;
        }
        const compressed = await compressImage(file, 1200, 1200, 0.82);
        newUrls.push(compressed);
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }
    } catch (err) {
      setErrorMessage('حدث خطأ أثناء معالجة الصور، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveImage = (indexToRemove: number) => {
    onChange(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddPreset = (preset: FurniturePreset) => {
    if (images.length >= maxImages) {
      setErrorMessage(`لقد وصلت للحد الأقصى المسموح (${maxImages} صور)`);
      return;
    }
    if (!images.includes(preset.url)) {
      onChange([...images, preset.url]);
    }
  };

  return (
    <div className="space-y-3">
      {/* Label and Count */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-stone-800">
          {label} <span className="text-rose-500">*</span>
        </label>
        <span className="text-[11px] font-semibold text-stone-500">
          {images.length} من {maxImages} صور
        </span>
      </div>

      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {/* Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-brand-600 bg-brand-50/70 scale-[1.01]'
            : 'border-stone-300 hover:border-brand-500 bg-stone-50/60 hover:bg-stone-50'
        }`}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-brand-100/80 text-brand-700 flex items-center justify-center shadow-sm">
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            <span className="text-xs font-bold text-stone-800 block">
              {isProcessing
                ? 'جارٍ تجهيز وضغط الصور بجودة عالية...'
                : 'اضغط لاختيار الصور من جهازك أو اسحبها هنا'}
            </span>
            <span className="text-[11px] text-stone-500 block mt-0.5">
              {helpText}
            </span>
          </div>

          <button
            type="button"
            className="px-4 py-1.5 rounded-lg bg-brand-800 hover:bg-brand-900 text-white text-xs font-bold shadow-sm transition-colors"
          >
            تصفح الصور من جهازك
          </button>
        </div>
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-between">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Thumbnails Grid */}
      {images.length > 0 && (
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-stone-600 block">
            الصور المختارة ({images.length}):
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, idx) => (
              <div
                key={idx}
                className="relative group aspect-[4/3] rounded-xl overflow-hidden border border-brand-200 bg-stone-100 shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`صورة ${idx + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Primary Cover Badge */}
                {idx === 0 && (
                  <span className="absolute bottom-1.5 right-1.5 bg-brand-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md shadow backdrop-blur-sm">
                    صورة الغلاف
                  </span>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage(idx);
                  }}
                  className="absolute top-1.5 left-1.5 p-1 rounded-md bg-stone-900/80 hover:bg-rose-600 text-white transition-colors shadow"
                  title="حذف الصورة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ready Presets Picker */}
      {allowPresets && images.length < maxImages && (
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>أو اختر من تصاميم وموديلات دمياط الجاهزة للتجربة السريعة:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {FURNITURE_PRESETS.map((preset) => {
              const isSelected = images.includes(preset.url);
              return (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isSelected}
                  onClick={() => handleAddPreset(preset)}
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 opacity-60 cursor-default'
                      : 'bg-white hover:bg-amber-100 text-stone-800 border-amber-200 shadow-xs'
                  }`}
                >
                  <Plus className="w-3 h-3 text-amber-700" />
                  <span>{preset.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
