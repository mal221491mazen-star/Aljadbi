import React from 'react';
import { 
  Crown, 
  Sparkles, 
  Users, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  X,
  Compass
} from 'lucide-react';
import { KoshaCategory, HallSize } from '../types';

interface KoshaFiltersProps {
  category: KoshaCategory;
  onCategoryChange: (cat: KoshaCategory) => void;
  hallSize: HallSize;
  onHallSizeChange: (size: HallSize) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: 'popular' | 'price_asc' | 'price_desc' | 'rating';
  onSortByChange: (sort: 'popular' | 'price_asc' | 'price_desc' | 'rating') => void;
  availableOnly: boolean;
  onAvailableOnlyChange: (val: boolean) => void;
  totalResultsCount: number;
}

export const KoshaFilters: React.FC<KoshaFiltersProps> = ({
  category,
  onCategoryChange,
  hallSize,
  onHallSizeChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  availableOnly,
  onAvailableOnlyChange,
  totalResultsCount,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E6DEC8] p-4 sm:p-5 shadow-sm mb-8">
      {/* Category Pills Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 border-b border-[#F0E9DC] no-scrollbar">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            category === 'all'
              ? 'bg-[#801B2E] text-white shadow-sm'
              : 'bg-[#FAF8F5] text-[#5B4938] hover:bg-[#F2ECE0]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>كافة التشكيلات</span>
        </button>

        <button
          onClick={() => onCategoryChange('women')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            category === 'women'
              ? 'bg-[#801B2E] text-white shadow-sm'
              : 'bg-[#FAF8F5] text-[#5B4938] hover:bg-[#F2ECE0]'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>كوش نسائية ملكية</span>
        </button>

        <button
          onClick={() => onCategoryChange('men')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            category === 'men'
              ? 'bg-[#801B2E] text-white shadow-sm'
              : 'bg-[#FAF8F5] text-[#5B4938] hover:bg-[#F2ECE0]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>كوش ومقائل رجالية</span>
        </button>

        <button
          onClick={() => onCategoryChange('traditional')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            category === 'traditional'
              ? 'bg-[#801B2E] text-white shadow-sm'
              : 'bg-[#FAF8F5] text-[#5B4938] hover:bg-[#F2ECE0]'
          }`}
        >
          <span className="text-[#C5A059]">𐩪</span>
          <span>تراث يمني وزفات صنعانية</span>
        </button>

        <button
          onClick={() => onCategoryChange('royal_vip')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            category === 'royal_vip'
              ? 'bg-gradient-to-r from-[#801B2E] to-[#B32742] text-[#F9E8B2] shadow-sm'
              : 'bg-[#FAF8F5] text-[#801B2E] hover:bg-[#F2ECE0]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>قصور VIP الملكية</span>
        </button>
      </div>

      {/* Secondary Controls: Search, Hall Size, Sorting */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search input */}
        <div className="lg:col-span-5 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث باسم الكوشة، الصالة، الألوان، أو المواصفات..."
            className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl pr-9 pl-8 py-2 text-xs sm:text-sm text-[#2B1B10] placeholder-[#8A7869] focus:outline-hidden focus:border-[#801B2E]"
          />
          <Search className="w-4 h-4 text-[#8A7869] absolute right-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#8A7869] hover:text-[#2B1B10]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Hall Size Filter */}
        <div className="lg:col-span-3">
          <select
            value={hallSize}
            onChange={(e) => onHallSizeChange(e.target.value as HallSize)}
            className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2B1B10] focus:outline-hidden focus:border-[#801B2E]"
          >
            <option value="all">كافة أحجام الصالات</option>
            <option value="large">صالات كبرى وقصور (400+ فرد)</option>
            <option value="medium">صالات متوسطة (150-350 فرد)</option>
            <option value="small">صالات مصغرة وخاصة</option>
          </select>
        </div>

        {/* Sort selector */}
        <div className="lg:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as any)}
            className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2B1B10] focus:outline-hidden focus:border-[#801B2E]"
          >
            <option value="popular">الأكثر طلباً وتقييماً</option>
            <option value="price_asc">السعر: من الأقل للأعلى</option>
            <option value="price_desc">السعر: من الأعلى للأقل</option>
            <option value="rating">أعلى تقييم للزبائن</option>
          </select>
        </div>

        {/* Available only toggle */}
        <div className="lg:col-span-2 flex items-center justify-between sm:justify-end gap-2 bg-[#FAF8F5] px-3 py-2 rounded-xl border border-[#DDD3BF]">
          <label htmlFor="avail-toggle" className="text-xs font-semibold text-[#4B3B2F] cursor-pointer">
            المتاحة للحجز فقط
          </label>
          <input
            id="avail-toggle"
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => onAvailableOnlyChange(e.target.checked)}
            className="w-4 h-4 rounded text-[#801B2E] accent-[#801B2E] cursor-pointer"
          />
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="mt-3 pt-2.5 border-t border-[#F0E9DC] flex items-center justify-between text-xs text-[#7A6959]">
        <span>
          عرض <strong className="text-[#801B2E]">{totalResultsCount}</strong> كوشة متوفرة تطابق خياراتك
        </span>
        {(searchQuery || category !== 'all' || hallSize !== 'all' || availableOnly) && (
          <button
            onClick={() => {
              onCategoryChange('all');
              onHallSizeChange('all');
              onSearchChange('');
              onAvailableOnlyChange(false);
            }}
            className="text-[#801B2E] hover:underline font-semibold flex items-center gap-1"
          >
            <span>إعادة ضبط الفلاتر</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
