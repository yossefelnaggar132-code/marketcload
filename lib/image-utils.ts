/**
 * Utility functions for client-side image compression and preset furniture assets
 */

export interface FurniturePreset {
  id: string;
  title: string;
  category: string;
  url: string;
}

export const FURNITURE_PRESETS: FurniturePreset[] = [
  {
    id: 'preset-salon-1',
    title: 'صالون ملكي مذهب أويما',
    category: 'صالونات',
    url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-bed-1',
    title: 'غرفة نوم زان روماني مودرن',
    category: 'غرف نوم',
    url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-dining-1',
    title: 'سفرة كلاسيك 8 كراسي رخام',
    category: 'غرف سفرة',
    url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-kitchen-1',
    title: 'مطبخ خشب أرو ماسيف',
    category: 'مطابخ',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-living-1',
    title: 'ركنة نيو كلاسيك كتان تركي',
    category: 'صالونات',
    url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'preset-office-1',
    title: 'مكتب مدير خشب زان محفور',
    category: 'مكاتب',
    url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&auto=format&fit=crop&q=80',
  },
];

/**
 * Compresses an image file client-side using HTML Canvas.
 * Keeps output under ~100KB for fast rendering and safe localStorage retention.
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If not an image, read directly as data URL (e.g. PDF thumbnail/data)
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Smooth rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
