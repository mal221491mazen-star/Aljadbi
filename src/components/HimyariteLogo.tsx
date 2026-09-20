import React from 'react';

interface HimyariteLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'gold';
  showTagline?: boolean;
}

export const HimyariteLogo: React.FC<HimyariteLogoProps> = ({
  size = 'md',
  variant = 'gold',
  showTagline = true,
}) => {
  const isDark = variant === 'dark';

  return (
    <div className="flex items-center gap-2 sm:gap-3 select-none" id="brand-logo-container">
      {/* Symbolic Himyarite Qamariya & Musnad Geometric Monogram */}
      <div
        className={`relative flex items-center justify-center rounded-xl transition-transform hover:scale-105 shrink-0 ${
          size === 'sm'
            ? 'w-8 h-8 sm:w-9 sm:h-9'
            : size === 'lg'
            ? 'w-12 h-12 sm:w-14 sm:h-14'
            : size === 'xl'
            ? 'w-14 h-14 sm:w-16 sm:h-16'
            : 'w-9 h-9 sm:w-11 sm:h-11'
        } ${
          isDark
            ? 'bg-gradient-to-br from-[#2D1B0A] via-[#1E140A] to-[#120B05] border border-[#C5A059]/40 shadow-lg'
            : 'bg-gradient-to-br from-[#801B2E] via-[#5C1320] to-[#3B0C14] border border-[#D4AF37]/50 shadow-md shadow-[#5C1320]/20'
        }`}
      >
        {/* Subtle geometric Qamariya inner pattern */}
        <div className="absolute inset-0 opacity-25 flex items-center justify-center pointer-events-none">
          <svg viewBox="0 0 40 40" className="w-full h-full text-[#D4AF37]">
            <polygon
              points="20,2 38,20 20,38 2,20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="2 1"
            />
            <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>

        {/* Ancient Himyarite Musnad Inscription glyphs for JDB (الجعدبي: 𐩴 𐩲 𐩵) */}
        <span
          className={`font-serif font-bold tracking-wider leading-none text-center ${
            size === 'sm'
              ? 'text-sm sm:text-base'
              : size === 'lg'
              ? 'text-xl sm:text-2xl'
              : size === 'xl'
              ? 'text-2xl sm:text-3xl'
              : 'text-base sm:text-xl'
          } ${
            isDark
              ? 'text-[#E5C158] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
              : 'text-[#F9E8B2] drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]'
          }`}
          title="نقش حميري قديم: الجعدبي"
        >
          𐩴𐩵
        </span>

        {/* Golden corner decorative accents */}
        <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-[#D4AF37]"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-[#D4AF37]"></div>
      </div>

      {/* Brand Typographic Title */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-baseline gap-1 sm:gap-1.5">
          <span
            className={`font-bold font-title tracking-tight truncate ${
              size === 'sm'
                ? 'text-lg sm:text-xl'
                : size === 'lg'
                ? 'text-2xl sm:text-3xl'
                : size === 'xl'
                ? 'text-3xl sm:text-4xl'
                : 'text-xl sm:text-2xl'
            } ${
              isDark
                ? 'text-white'
                : 'text-[#2B170E]'
            }`}
          >
            الجَعْدَبي
          </span>
          <span className="text-[10px] sm:text-xs px-1.5 py-0.5 rounded bg-[#C5A059]/15 text-[#8C6D1F] border border-[#C5A059]/30 font-medium whitespace-nowrap shrink-0">
            لكوش الأعراس
          </span>
        </div>

        {showTagline && (
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#7A6B5D] whitespace-nowrap">
            <span className="text-[#C5A059]">✦</span>
            <span>فخامة ملكية • طابع يمني أصيل</span>
            <span className="text-[#C5A059]">✦</span>
          </div>
        )}
      </div>
    </div>
  );
};
