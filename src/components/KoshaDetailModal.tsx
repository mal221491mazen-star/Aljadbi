import React, { useState } from 'react';
import { 
  X, 
  Ruler, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Crown, 
  Sliders, 
  CalendarCheck, 
  MessageSquare, 
  Info,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
  Plus,
  Check
} from 'lucide-react';
import { Kosha, KoshaAddon, CustomizationSelections } from '../types';
import { AVAILABLE_ADDONS } from '../data/initialData';
import { formatPriceYER, formatPriceUSD } from '../utils/formatters';

interface KoshaDetailModalProps {
  kosha: Kosha | null;
  onClose: () => void;
  onBookNow: (kosha: Kosha, customization: CustomizationSelections) => void;
  onInquire: (kosha: Kosha, messageText?: string) => void;
}

export const KoshaDetailModal: React.FC<KoshaDetailModalProps> = ({
  kosha,
  onClose,
  onBookNow,
  onInquire,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'details' | 'customize'>('customize');

  // Customization state
  const [flowerColor, setFlowerColor] = useState<string>(
    kosha?.flowerColorOptions[0] || 'أبيض ثلجي وأوف وايت'
  );
  const [seatingStyle, setSeatingStyle] = useState<string>(
    kosha?.seatingOptions[0] || 'كنب ملكي متصل'
  );
  const [lightingMode, setLightingMode] = useState<string>(
    kosha?.lightingModes[0] || 'إضاءة دافئة'
  );
  const [acrylicSignEnabled, setAcrylicSignEnabled] = useState<boolean>(true);
  const [groomName, setGroomName] = useState<string>('م. عبد الرحمن');
  const [brideName, setBrideName] = useState<string>('سارة');
  const [carpetStyle, setCarpetStyle] = useState<string>('سجاد ملكي عاجي');
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(['addon_incense']);

  if (!kosha) return null;

  // Calculate total additions price
  const addonsTotal = selectedAddonIds.reduce((sum, addonId) => {
    const addon = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    return sum + (addon ? addon.priceYER : 0);
  }, 0);

  const grandTotalYER = kosha.priceYER + addonsTotal;

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const currentCustomization: CustomizationSelections = {
    flowerColor,
    seatingStyle,
    lightingMode,
    carpetStyle,
    customAcrylicNames: {
      enabled: acrylicSignEnabled,
      groomName,
      brideName,
    },
    selectedAddonIds,
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
      <div 
        className="relative bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl border border-[#D4AF37]/40 shadow-2xl max-w-5xl w-full overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        id="kosha-detail-modal"
      >
        {/* Top Modal Header */}
        <div className="bg-white px-4 sm:px-5 py-3 sm:py-4 border-b border-[#E6DEC8] flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden">
            <span className="p-1.5 sm:p-2 rounded-xl bg-[#FAF0DF] text-[#801B2E] border border-[#D4AF37]/30 shrink-0">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-xl font-bold font-title text-[#29170E] truncate">{kosha.name}</h2>
                <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-[#801B2E] text-[#F9E8B2] font-semibold shrink-0">
                  {kosha.categoryLabel}
                </span>
              </div>
              {kosha.himyariteTag && (
                <p className="text-[11px] sm:text-xs text-[#8C6D1F] font-serif mt-0.5 truncate">{kosha.himyariteTag}</p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-full text-[#7A6A5A] hover:bg-[#F2EDE4] hover:text-[#29170E] transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs (معاينة ومواصفات / تخصيص الكوشة) */}
        <div className="bg-[#F4EFE6] px-5 pt-3 border-b border-[#E6DEC8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('customize')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'customize'
                  ? 'bg-[#FAF8F5] text-[#801B2E] border-t-2 border-r border-l border-[#D4AF37]/40 shadow-xs'
                  : 'text-[#6B5A4B] hover:text-[#29170E]'
              }`}
            >
              <Sliders className="w-4 h-4 text-[#C5A059]" />
              <span>تخصيص الكوشة الفوري (الألوان والإضافات)</span>
            </button>

            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-t-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'details'
                  ? 'bg-[#FAF8F5] text-[#801B2E] border-t-2 border-r border-l border-[#D4AF37]/40 shadow-xs'
                  : 'text-[#6B5A4B] hover:text-[#29170E]'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>المواصفات والصالات المتوافقة</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#7A6A5A]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ضمان التركيب والجودة من الجعدبي</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-6">
          {/* Gallery Carousel Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Main Featured Image with Gallery Controls */}
            <div className="lg:col-span-7 flex flex-col gap-2">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-black/10 border border-[#E2D6BE]">
                <img
                  src={kosha.images[activeImageIndex]}
                  alt={kosha.name}
                  className="w-full h-full object-cover"
                />

                {/* Left/Right Prev/Next Buttons */}
                {kosha.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === 0 ? kosha.images.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) =>
                          prev === kosha.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                {/* Dimensions pill */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>
                    العرض: {kosha.dimensions.width} | الارتفاع: {kosha.dimensions.height} | العمق: {kosha.dimensions.depth}
                  </span>
                </div>
              </div>

              {/* Thumbnails list */}
              {kosha.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {kosha.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-[#801B2E] scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Summary Card & Price Box */}
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E2D6BE] flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#801B2E] block mb-1">نبذة عن الطراز:</span>
                <p className="text-xs sm:text-sm text-[#5B4636] leading-relaxed mb-4">
                  {kosha.description}
                </p>

                {/* Dimensions & Capacity highlights */}
                <div className="space-y-2 bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DEC8] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A6A5A]">توافق الصالة:</span>
                    <span className="font-bold text-[#29170E]">{kosha.hallSizeLabel}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A6A5A]">أبعاد المسرح الموصى بها:</span>
                    <span className="font-bold text-[#29170E]">{kosha.dimensions.width} فما فوق</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#7A6A5A]">مدة التركيب في الصالة:</span>
                    <span className="font-bold text-emerald-700">3 - 4 ساعات قبل موعد الحفل</span>
                  </div>
                </div>
              </div>

              {/* Price Calculation Summary Box */}
              <div className="mt-4 pt-3 border-t border-[#F0E9DC]">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-[#7A6A5A]">سعر الكوشة الأساسي:</span>
                  <span className="text-sm font-semibold text-[#4B3B2F]">{formatPriceYER(kosha.priceYER)}</span>
                </div>
                {addonsTotal > 0 && (
                  <div className="flex items-baseline justify-between mb-1 text-xs text-amber-800">
                    <span>قيمة الإضافات المختارة:</span>
                    <span className="font-semibold">+{formatPriceYER(addonsTotal)}</span>
                  </div>
                )}
                <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-[#F0E9DC]">
                  <span className="text-sm font-bold text-[#29170E]">الإجمالي المقدر:</span>
                  <div className="text-left">
                    <div className="text-xl font-bold font-title text-[#801B2E]">
                      {formatPriceYER(grandTotalYER)}
                    </div>
                    <span className="text-[11px] text-[#8A7A6A]" dir="ltr">
                      ({formatPriceUSD(Math.round(grandTotalYER / 540))})
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-[#7A6A5A] flex items-center justify-between">
                  <span>العربون المطلوب لتثبيت الموعد:</span>
                  <strong className="text-[#4B3B2F]">{formatPriceYER(kosha.depositYER)}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: CUSTOMIZER SECTION */}
          {activeTab === 'customize' && (
            <div className="space-y-6 pt-2 border-t border-[#E8DEC8]">
              {/* Header */}
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#801B2E]" />
                <h3 className="text-base font-bold font-title text-[#29170E]">
                  مُخصّص تفاصيل الكوشة (اختر لمساتك الخاصة لعرسك)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 1. Flower Colors */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE]">
                  <label className="block text-xs font-bold text-[#3B281B] mb-2">
                    ١. اختر طراز وألوان باقات الزهور:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {kosha.flowerColorOptions.map((opt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setFlowerColor(opt)}
                        className={`p-2.5 rounded-xl text-xs font-medium text-right border transition-all flex items-center justify-between ${
                          flowerColor === opt
                            ? 'border-[#801B2E] bg-[#FAF0F2] text-[#801B2E] font-bold shadow-xs'
                            : 'border-[#E2D6BE] text-[#5B4636] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <span>{opt}</span>
                        {flowerColor === opt && <Check className="w-4 h-4 text-[#801B2E]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Seating Options */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE]">
                  <label className="block text-xs font-bold text-[#3B281B] mb-2">
                    ٢. نوع كراسي ومقاعد العرسان:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {kosha.seatingOptions.map((seat, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSeatingStyle(seat)}
                        className={`p-2.5 rounded-xl text-xs font-medium text-right border transition-all flex items-center justify-between ${
                          seatingStyle === seat
                            ? 'border-[#801B2E] bg-[#FAF0F2] text-[#801B2E] font-bold shadow-xs'
                            : 'border-[#E2D6BE] text-[#5B4636] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <span>{seat}</span>
                        {seatingStyle === seat && <Check className="w-4 h-4 text-[#801B2E]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Lighting Mode */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE]">
                  <label className="block text-xs font-bold text-[#3B281B] mb-2">
                    ٣. هندسة الإضاءة والمؤثرات:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {kosha.lightingModes.map((light, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setLightingMode(light)}
                        className={`p-2.5 rounded-xl text-xs font-medium text-right border transition-all flex items-center justify-between ${
                          lightingMode === light
                            ? 'border-[#801B2E] bg-[#FAF0F2] text-[#801B2E] font-bold shadow-xs'
                            : 'border-[#E2D6BE] text-[#5B4636] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <span>{light}</span>
                        {lightingMode === light && <Check className="w-4 h-4 text-[#801B2E]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Acrylic Nameplate Customizer */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE]">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-[#3B281B]">
                      ٤. لوحة أسماء العرسان أكرليك مخصصة:
                    </label>
                    <input
                      type="checkbox"
                      checked={acrylicSignEnabled}
                      onChange={(e) => setAcrylicSignEnabled(e.target.checked)}
                      className="w-4 h-4 accent-[#801B2E] cursor-pointer"
                    />
                  </div>

                  {acrylicSignEnabled ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-[#7A6A5A] mb-1">اسم العريس:</label>
                          <input
                            type="text"
                            value={groomName}
                            onChange={(e) => setGroomName(e.target.value)}
                            placeholder="مثال: المهندس أنس"
                            className="w-full bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl px-2.5 py-1.5 text-xs text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-[#7A6A5A] mb-1">اسم العروس:</label>
                          <input
                            type="text"
                            value={brideName}
                            onChange={(e) => setBrideName(e.target.value)}
                            placeholder="مثال: ريم"
                            className="w-full bg-[#FAF8F5] border border-[#D9CEBA] rounded-xl px-2.5 py-1.5 text-xs text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                          />
                        </div>
                      </div>

                      {/* Live Preview of Acrylic Sign */}
                      <div className="bg-gradient-to-r from-[#29170E] via-[#4A2616] to-[#29170E] p-3 rounded-xl text-center border border-[#D4AF37]/50 shadow-inner">
                        <span className="text-[10px] text-[#C5A059] block font-serif">معاينة لوحة الأكرليك المذهبة:</span>
                        <div className="font-serif font-bold text-lg text-[#F9E8B2] tracking-wide mt-1">
                          {groomName || 'العريس'} & {brideName || 'العروس'}
                        </div>
                        <span className="text-[10px] text-[#C5A059]/80 font-serif">𐩱𐩡𐩴𐩲𐩵𐩨𐩺 • بارك الله لهما</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#8A7A6A] py-2">
                      تم إلغاء لوحة الأسماء (يمكن استخدام الكوشة بدون لوحة مخصصة).
                    </p>
                  )}
                </div>
              </div>

              {/* 5. Selectable Luxury Addons */}
              <div>
                <label className="block text-xs font-bold text-[#3B281B] mb-2">
                  ٥. إضافات فندقية وتجهيزات الصالة الاختيارية:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {AVAILABLE_ADDONS.map((addon) => {
                    const isChecked = selectedAddonIds.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => handleToggleAddon(addon.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isChecked
                            ? 'bg-[#FAF0F2] border-[#801B2E] shadow-xs'
                            : 'bg-white border-[#E2D6BE] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#29170E]">{addon.name}</span>
                            <span
                              className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${
                                isChecked ? 'bg-[#801B2E] text-white' : 'border border-[#D9CEBA]'
                              }`}
                            >
                              {isChecked && <Check className="w-3.5 h-3.5" />}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#6E5D4E] leading-relaxed mb-2">
                            {addon.description}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[#F0E9DC] flex items-center justify-between text-xs">
                          <span className="text-[#801B2E] font-bold">+{formatPriceYER(addon.priceYER)}</span>
                          <span className="text-[11px] text-[#8A7A6A]">
                            {isChecked ? 'تمت الإضافة' : 'انقر للإضافة'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FULL DETAILS & HALL SPECS */}
          {activeTab === 'details' && (
            <div className="space-y-6 pt-2 border-t border-[#E8DEC8]">
              {/* Features list */}
              <div>
                <h4 className="text-xs font-bold text-[#29170E] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>أبرز مميزات وعناصر تصميم الكوشة:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {kosha.features.map((feat, i) => (
                    <div
                      key={i}
                      className="bg-white p-3 rounded-xl border border-[#E8DEC8] text-xs text-[#4B3B2F] flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equipment list */}
              <div>
                <h4 className="text-xs font-bold text-[#29170E] mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#801B2E]" />
                  <span>المعدات والتجهيزات المشمولة بالسعر:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {kosha.includedEquipment.map((eq, i) => (
                    <div
                      key={i}
                      className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#E8DEC8] text-xs text-[#5B4636] flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#801B2E]"></span>
                      <span>{eq}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatible Yemeni Halls */}
              <div>
                <h4 className="text-xs font-bold text-[#29170E] mb-2 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#C5A059]" />
                  <span>عينات من صالات الأعراس المتوافقة تماماً مع أبعاد الكوشة:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {kosha.hallCompatibility.map((hall, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-white border border-[#DDD3BF] text-xs font-semibold text-[#4B3B2F] shadow-2xs"
                    >
                      {hall}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Bar */}
        <div className="bg-white px-5 py-4 border-t border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#6B5A4B] order-2 sm:order-1">
            <span>هل لديك استفسار خاص قبل تثبيت الحجز؟</span>
            <button
              onClick={() => {
                onInquire(
                  kosha,
                  `السلام عليكم، أستفسر بخصوص "${kosha.name}" مع التخصيص، هل هي متوفرة؟`
                );
                onClose();
              }}
              className="text-[#801B2E] font-bold hover:underline flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>محادثة مباشرة مع المؤجر</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#5B4636] hover:bg-[#F2EDE4] transition-colors"
            >
              إغلاق
            </button>

            <button
              onClick={() => {
                onBookNow(kosha, currentCustomization);
                onClose();
              }}
              className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold bg-[#801B2E] text-white hover:bg-[#681424] shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-4 h-4 text-[#F9E8B2]" />
              <span>متابعة إرسال طلب الحجز ({formatPriceYER(grandTotalYER)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
