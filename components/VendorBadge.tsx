import React from 'react';
import { VendorTier } from '@/types';
import { Award, CheckCircle2, Shield } from 'lucide-react';

interface VendorBadgeProps {
  tier: VendorTier;
  showText?: boolean;
}

export const VendorBadge: React.FC<VendorBadgeProps> = ({ tier, showText = true }) => {
  if (tier === 'premium') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-sm" title="معرض بريميوم موثوق بعقود وضمان دمياطي">
        <Award className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
        {showText && <span>بريميوم دمياط</span>}
      </span>
    );
  }

  if (tier === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 border border-blue-200" title="معرض موثق بالسجل التجاري وموقع الورشة">
        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
        {showText && <span>موثّق</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-normal bg-stone-100 text-stone-600 border border-stone-200">
      <Shield className="w-3 h-3 text-stone-400" />
      {showText && <span>معرض نشط</span>}
    </span>
  );
};
