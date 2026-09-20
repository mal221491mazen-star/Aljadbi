import React from 'react';
import { 
  Crown, 
  Ruler, 
  Star, 
  Check, 
  MessageSquare, 
  Sparkles, 
  ArrowLeft,
  CalendarCheck,
  Building2
} from 'lucide-react';
import { Kosha } from '../types';
import { formatPriceYER, formatPriceUSD } from '../utils/formatters';

interface KoshaCardProps {
  kosha: Kosha;
  onSelect: (kosha: Kosha) => void;
  onBookNow: (kosha: Kosha) => void;
  onInquire: (kosha: Kosha) => void;
}

export const KoshaCard: React.FC<KoshaCardProps> = ({
  kosha,
  onSelect,
  onBookNow,
  onInquire,
}) => {
  return (
    <div 
      className="group bg-white rounded-2xl border border-[#E6DEC8] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#C5A059] transition-all duration-300 flex flex-col"
      id={`kosha-card-${kosha.id}`}
    >
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F5F0E6]">
        <img
          src={kosha.images[0]}
          alt={kosha.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"></div>

        {/* Himyarite Tag & Category Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#801B2E] text-[#F9E8B2] border border-[#D4AF37]/50 shadow-md">
            {kosha.categoryLabel}
          </span>
          {kosha.himyariteTag && (
            <span className="px-2 py-0.5 rounded-md text-[10px] bg-black/60 backdrop-blur-xs text-[#E5C158] font-serif border border-[#D4AF37]/30">
              {kosha.himyariteTag}
            </span>
          )}
        </div>

        {/* Popular / Featured Badge */}
        {kosha.isPopular && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#C5A059] text-[#2D1B0A] shadow-md">
            <Sparkles className="w-3 h-3" />
            <span>الأكثر طلباً</span>
          </div>
        )}

        {/* Bottom Image Info: Dimensions & Hall Compatibility */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-1 rounded-md">
            <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{kosha.dimensions.width} × {kosha.dimensions.height}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-1 rounded-md text-[#F9E8B2]">
            <Building2 className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{kosha.hallSizeLabel}</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating and Reviews */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-xs text-[#7A6A5A]">
              <div className="flex items-center text-amber-500">
                <Star className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="font-bold text-[#2B1B10]">{kosha.rating}</span>
              <span>({kosha.reviewsCount} تقييم عرسان)</span>
            </div>

            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${kosha.isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="text-[11px] font-semibold text-[#5B4636]">
                {kosha.isAvailable ? 'متاحة للحجز' : 'محجوزة جزئياً'}
              </span>
            </div>
          </div>

          {/* Kosha Title */}
          <h3 
            onClick={() => onSelect(kosha)}
            className="text-lg font-bold font-title text-[#29170E] hover:text-[#801B2E] transition-colors cursor-pointer mb-2 line-clamp-1"
          >
            {kosha.name}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-[#6B5A4B] line-clamp-2 leading-relaxed mb-3">
            {kosha.description}
          </p>

          {/* Theme Color Palettes dots */}
          <div className="flex items-center gap-1.5 mb-4">
            <span className="text-[11px] text-[#7A6A5A]">الألوان الرئيسية:</span>
            <div className="flex items-center gap-1">
              {kosha.themeColors.map((color, idx) => (
                <span
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-[#DDD3BF] shadow-2xs"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                ></span>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-3 border-t border-[#F0E9DC] mt-2">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-[11px] text-[#7A6A5A] block">سعر الإيجار مع التركيب:</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg sm:text-xl font-bold font-title text-[#801B2E]">
                  {formatPriceYER(kosha.priceYER)}
                </span>
                <span className="text-xs text-[#8A7A6A] font-medium" dir="ltr">
                  ({formatPriceUSD(kosha.priceUSD)})
                </span>
              </div>
            </div>

            <div className="text-left">
              <span className="text-[10px] text-[#7A6A5A] block">العربون المطلوب:</span>
              <span className="text-xs font-bold text-[#4B3B2F]">
                {formatPriceYER(kosha.depositYER)}
              </span>
            </div>
          </div>

          {/* Buttons: Details / Book Now / Inquire */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(kosha)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#FAF8F5] text-[#4B3B2F] hover:bg-[#F0E9DC] border border-[#DDD3BF] transition-all flex items-center justify-center gap-1"
            >
              <span>معاينة وتخصيص</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onBookNow(kosha)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#801B2E] text-white hover:bg-[#681424] shadow-xs transition-all flex items-center justify-center gap-1"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#F9E8B2]" />
              <span>احجز الآن</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
