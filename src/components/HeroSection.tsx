import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  Crown, 
  Search, 
  CheckCircle2, 
  Layers, 
  Clock,
  ShieldAlert
} from 'lucide-react';
import { KoshaCategory } from '../types';

interface HeroSectionProps {
  onSearch: (filters: { category: KoshaCategory; city: string; date: string }) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, onExploreClick }) => {
  const [selectedCategory, setSelectedCategory] = useState<KoshaCategory>('all');
  const [selectedCity, setSelectedCity] = useState<string>('صنعاء');
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      category: selectedCategory,
      city: selectedCity,
      date: selectedDate,
    });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4EFEA] to-[#FAF8F5] pt-8 pb-16 border-b border-[#E8DEC8]">
      {/* Subtle Yemeni Architectural Qamariya & Arch Graphic in background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none">
          <path
            d="M720 40 C520 40 400 160 300 280 C200 400 0 450 0 600 L1440 600 C1440 450 1240 400 1140 280 C1040 160 920 40' 720 40 Z"
            fill="url(#qamariya-grad)"
          />
          <defs>
            <linearGradient id="qamariya-grad" x1="720" y1="0" x2="720" y2="600" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C5A059" stopOpacity="0.3" />
              <stop offset="1" stopColor="#6B1D2F" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Heritage Badge */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF0E1] border border-[#D4AF37]/50 text-[#73531F] text-xs font-semibold shadow-xs">
            <span className="text-[#C5A059] font-serif">𐩱𐩡𐩴𐩲𐩵𐩨𐩺</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#801B2E]"></span>
            <span>كوش وأفراح الجعدبي • فخامة الصالات بروح سبئية ملكية</span>
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-title text-[#29170E] leading-tight tracking-tight">
            حيث تلتقي <span className="text-[#801B2E] relative inline-block">
              أصالة التراث
              <svg className="absolute -bottom-2 right-0 w-full h-2.5 text-[#D4AF37]/60" viewBox="0 0 100 20" preserveAspectRatio="none">
                <path d="M0,15 Q50,0 100,15" fill="none" stroke="currentColor" strokeWidth="4" />
              </svg>
            </span> بملوكية التصميم
          </h1>

          <p className="mt-5 text-base sm:text-lg md:text-xl text-[#614D3D] max-w-2xl mx-auto leading-relaxed">
            منصة الجعدبي الرقمية المتكاملة لتأجير وتخصيص أفخم كوش الأعراس النسائية والرجالية بصالات المناسبات. استعرض التشكيلات، عاين الأسعار الحقيقية، خصص تفاصيل الكوشة، واحجز موعدك مباشرة.
          </p>
        </div>

        {/* Quick Search & Availability Bar */}
        <div className="mt-10 max-w-4xl mx-auto">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#E2D6BE] shadow-xl shadow-[#5C1320]/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end"
          >
            {/* Category Selector */}
            <div>
              <label className="block text-xs font-bold text-[#4B3B2F] mb-1.5 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>نوع الكوشة والمناسبة</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as KoshaCategory)}
                className="w-full bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl px-3 py-2.5 text-sm text-[#2B1B10] focus:outline-hidden focus:border-[#801B2E] transition-colors"
              >
                <option value="all">كافة الكوش والموديلات</option>
                <option value="women">كوش نسائية ملكية</option>
                <option value="men">كوش ومجالس رجالية ومقائل</option>
                <option value="traditional">تراث يمني وزفات صنعانية</option>
                <option value="royal_vip">كوش قصور كبار الشخصيات VIP</option>
              </select>
            </div>

            {/* City / Hall Location */}
            <div>
              <label className="block text-xs font-bold text-[#4B3B2F] mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#801B2E]" />
                <span>المدينة أو منطقة الصالة</span>
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl px-3 py-2.5 text-sm text-[#2B1B10] focus:outline-hidden focus:border-[#801B2E] transition-colors"
              >
                <option value="صنعاء">صنعاء وأمانة العاصمة</option>
                <option value="عدن">عدن والمحافظات الجنوبية</option>
                <option value="إب">إب ولواء الأخضر</option>
                <option value="تعز">تعز الحالمة</option>
                <option value="حضرموت">حضرموت والمكلا</option>
                <option value="كافة المحافظات">كافة المحافظات</option>
              </select>
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-xs font-bold text-[#4B3B2F] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>تاريخ حفل الزفاف</span>
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl px-3 py-2 text-sm text-[#2B1B10] focus:outline-hidden focus:border-[#801B2E] transition-colors"
              />
            </div>

            {/* Search / Filter Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#801B2E] to-[#A3233B] hover:from-[#6B1626] hover:to-[#8E1C31] text-white font-semibold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Search className="w-4 h-4" />
                <span>بحث الكوش المتاحة</span>
              </button>
            </div>
          </form>
        </div>

        {/* Value Propositions / Key Guarantees */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-[#E8DEC8] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF0DF] text-[#801B2E] flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2E1F14]">تصاميم حصرية متجددة</h4>
              <p className="text-[11px] text-[#6E5D4E]">كوش نسائية ورجالية بمقاسات الصالات</p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-[#E8DEC8] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF0DF] text-[#801B2E] flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2E1F14]">دقة والتزام بالمواعيد</h4>
              <p className="text-[11px] text-[#6E5D4E]">حضور وتجهيز مبكر في الصالة قبل الحفل</p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-[#E8DEC8] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF0DF] text-[#801B2E] flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2E1F14]">تخصيص كامل للألوان</h4>
              <p className="text-[11px] text-[#6E5D4E]">تنسيق الورد والإضاءة ولوحات الأسماء</p>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-xs p-4 rounded-xl border border-[#E8DEC8] flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF0DF] text-[#801B2E] flex items-center justify-center shrink-0 border border-[#D4AF37]/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2E1F14]">عقد وضمان حجز رسمي</h4>
              <p className="text-[11px] text-[#6E5D4E]">تثبيت الحجز وإشراف مباشر من المؤجر</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
