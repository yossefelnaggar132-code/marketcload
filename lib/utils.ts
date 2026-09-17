import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Normalizes Arabic text for flexible and tolerant search:
 * - Removes tashkeel (diacritics)
 * - Normalizes various Alif forms (أ, إ, آ, ٱ -> ا)
 * - Normalizes Taa Marbouta to Haa (ة -> ه)
 * - Normalizes Alif Maqsura to Yaa (ى -> ي)
 * - Removes Tatweel (ـ)
 */
export function normalizeArabic(text?: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .replace(/ـ/g, '')
    .trim();
}

/**
 * Matches query against multiple candidate strings using Arabic normalization
 */
export function matchesArabicSearch(query: string, ...candidates: (string | undefined | null)[]): boolean {
  const normalizedQuery = normalizeArabic(query);
  if (!normalizedQuery) return true;

  // Split query into keywords so multi-word search works (e.g. "صالون زان")
  const keywords = normalizedQuery.split(/\s+/).filter(Boolean);

  return keywords.every(kw => 
    candidates.some(candidate => {
      if (!candidate) return false;
      return normalizeArabic(candidate).includes(kw);
    })
  );
}
