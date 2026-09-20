import React, { useState } from 'react';
import { 
  X, 
  CalendarCheck, 
  Building2, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Printer, 
  MessageSquare,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { Kosha, CustomizationSelections, BookingRequest, PaymentMethod, EventTimeSlot } from '../types';
import { AVAILABLE_ADDONS, YEMENI_HALLS } from '../data/initialData';
import { formatPriceYER, formatPriceUSD, getTimeSlotLabel, getPaymentMethodLabel } from '../utils/formatters';

interface BookingModalProps {
  kosha: Kosha | null;
  customization: CustomizationSelections | null;
  onClose: () => void;
  onConfirmBooking: (booking: BookingRequest) => void;
  onOpenChatWithBooking: (bookingCode: string, koshaName: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  kosha,
  customization,
  onClose,
  onConfirmBooking,
  onOpenChatWithBooking,
}) => {
  if (!kosha) return null;

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdBooking, setCreatedBooking] = useState<BookingRequest | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [customerCity, setCustomerCity] = useState('صنعاء');
  const [hallName, setHallName] = useState(YEMENI_HALLS[0].name);
  const [customHallName, setCustomHallName] = useState('');
  const [hallAddress, setHallAddress] = useState(YEMENI_HALLS[0].area);
  const [eventDate, setEventDate] = useState('');
  const [timeSlot, setTimeSlot] = useState<EventTimeSlot>('evening');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('kuraimi');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate pricing
  const defaultCustomization: CustomizationSelections = customization || {
    flowerColor: kosha.flowerColorOptions[0] || 'أبيض ثلجي',
    seatingStyle: kosha.seatingOptions[0] || 'كنب ملكي',
    lightingMode: kosha.lightingModes[0] || 'إضاءة دافئة',
    carpetStyle: 'ممشى ملكي',
    customAcrylicNames: { enabled: false, groomName: '', brideName: '' },
    selectedAddonIds: [],
  };

  const addonsTotal = defaultCustomization.selectedAddonIds.reduce((sum, addonId) => {
    const addon = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    return sum + (addon ? addon.priceYER : 0);
  }, 0);

  const grandTotalYER = kosha.priceYER + addonsTotal;
  const depositAmountYER = kosha.depositYER;

  const handleHallSelectChange = (val: string) => {
    setHallName(val);
    if (val === 'other') {
      setHallAddress('');
    } else {
      const found = YEMENI_HALLS.find((h) => h.name === val);
      if (found) {
        setHallAddress(`${found.city} - ${found.area}`);
      }
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg('يرجى كتابة اسم صاحب الحجز الكريم');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      setErrorMsg('يرجى إدخال رقم هاتف يمني صحيح (مثال: 777123456)');
      return;
    }
    if (!eventDate) {
      setErrorMsg('يرجى تحديد تاريخ حفل الزفاف أو المناسبة');
      return;
    }

    const finalHallName = hallName === 'other' ? (customHallName || 'صالة مناسبات خاصة') : hallName;
    const randomCodeNum = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = `JDB-${randomCodeNum}`;

    const newBooking: BookingRequest = {
      id: `book_${Date.now()}`,
      bookingCode,
      koshaId: kosha.id,
      koshaName: kosha.name,
      koshaImage: kosha.images[0],
      category: kosha.category,
      customerName,
      customerPhone,
      customerWhatsapp: customerWhatsapp || customerPhone,
      customerCity,
      hallName: finalHallName,
      hallAddress: hallAddress || 'داخل الصالة المحددة',
      eventDate,
      timeSlot,
      customization: defaultCustomization,
      basePriceYER: kosha.priceYER,
      addonsPriceYER: addonsTotal,
      totalPriceYER: grandTotalYER,
      depositAmountYER,
      paymentMethod,
      status: 'pending',
      notes,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    onConfirmBooking(newBooking);
    setCreatedBooking(newBooking);
    setStep('success');
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div 
        className="relative bg-[#FAF8F5] rounded-3xl border border-[#D4AF37]/50 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        id="booking-modal-container"
      >
        {/* Modal Top Header */}
        <div className="bg-[#801B2E] text-[#F9E8B2] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-white/10 border border-[#D4AF37]/40">
              <CalendarCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-title">
                {step === 'form' ? 'طلب حجز كوشة الصالة' : 'تم استلام طلب الحجز بنجاح!'}
              </h2>
              <span className="text-[11px] text-[#F3E5AB]">كوش وأفراح الجعدبي • خدمة رقمية معتمدة</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#F9E8B2] hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: BOOKING FORM */}
        {step === 'form' && (
          <form onSubmit={handleSubmitBooking} className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-5">
            {/* Selected Kosha preview card */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E2D6BE] flex items-center gap-3.5 shadow-2xs">
              <img
                src={kosha.images[0]}
                alt={kosha.name}
                className="w-16 h-16 rounded-xl object-cover border border-[#D9CEBA] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#29170E] truncate">{kosha.name}</h4>
                  <span className="text-xs font-bold text-[#801B2E]">
                    {formatPriceYER(grandTotalYER)}
                  </span>
                </div>
                <p className="text-[11px] text-[#7A6A5A] truncate mt-0.5">
                  الورد: {defaultCustomization.flowerColor} • الجلسة: {defaultCustomization.seatingStyle}
                </p>
                {defaultCustomization.customAcrylicNames.enabled && (
                  <p className="text-[11px] text-[#801B2E] font-medium truncate">
                    لوحة الأسماء: {defaultCustomization.customAcrylicNames.groomName} & {defaultCustomization.customAcrylicNames.brideName}
                  </p>
                )}
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Event & Hall Details */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE] space-y-3">
              <h4 className="text-xs font-bold text-[#801B2E] flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>بيانات الصالة وموعد الحفل:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Date */}
                <div>
                  <label className="block text-xs font-medium text-[#4B3B2F] mb-1">
                    تاريخ المناسبة: <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                  />
                </div>

                {/* Time Slot */}
                <div>
                  <label className="block text-xs font-medium text-[#4B3B2F] mb-1">
                    فترة المناسبة في الصالة:
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value as EventTimeSlot)}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                  >
                    <option value="evening">الفترة المسائية (حفل السهرة 5م - 12ل)</option>
                    <option value="morning">الفترة النهارية (غداء ومقيل 11ص - 4:30ع)</option>
                    <option value="full_day">يوم كامل (صباحي ومسائي)</option>
                  </select>
                </div>

                {/* Hall Select */}
                <div>
                  <label className="block text-xs font-medium text-[#4B3B2F] mb-1">
                    اسم صالة الأعراس:
                  </label>
                  <select
                    value={hallName}
                    onChange={(e) => handleHallSelectChange(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                  >
                    {YEMENI_HALLS.map((h) => (
                      <option key={h.id} value={h.name}>
                        {h.name} ({h.city})
                      </option>
                    ))}
                    <option value="other">صالة أخرى غير مدرجة في القائمة...</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-medium text-[#4B3B2F] mb-1">
                    المدينة:
                  </label>
                  <select
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                  >
                    <option value="صنعاء">صنعاء وأمانة العاصمة</option>
                    <option value="عدن">عدن</option>
                    <option value="إب">إب</option>
                    <option value="تعز">تعز</option>
                    <option value="حضرموت">حضرموت</option>
                    <option value="ذمار">ذمار</option>
                  </select>
                </div>
              </div>

              {hallName === 'other' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-[#4B3B2F] mb-1">
                      اسم الصالة بالتحديد:
                    </label>
                    <input
                      type="text"
                      value={customHallName}
                      onChange={(e) => setCustomHallName(e.target.value)}
                      placeholder="مثال: قاعة اللوتس الملكية"
                      className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#4B3B2F] mb-1">
                      عنوان أو موقع الصالة:
                    </label>
                    <input
                      type="text"
                      value={hallAddress}
                      onChange={(e) => setHallAddress(e.target.value)}
                      placeholder="مثال: شارع تعز، جوار جولة..."
                      className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Customer Contact Details */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE] space-y-3">
              <h4 className="text-xs font-bold text-[#801B2E] flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>بيانات الزبون للتواصل والمتابعة:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#4B3B2F] mb-1">
                    الاسم الكامل: <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: عبد العزيز الحاشدي"
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4B3B2F] mb-1">
                    رقم الهاتف اليمني: <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="مثال: 777123456"
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#29170E] text-left focus:outline-hidden focus:border-[#801B2E]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4B3B2F] mb-1">
                  ملاحظات أو تعليمات خاصة لفريق التركيب والتجهيز:
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تفاصيل ترغب بإبلاغنا بها (أوقات دخول الصالة، لون الإضاءة المفضل، ترتيبات خاصة)..."
                  className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl p-2.5 text-xs text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                />
              </div>
            </div>

            {/* Deposit & Payment Method */}
            <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#801B2E] flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>طريقة دفع العربون لتثبيت الموعد:</span>
                </h4>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  عربون تثبيت: {formatPriceYER(depositAmountYER)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'kuraimi', label: 'حوالة بنك الكريمي إكسبرس', note: 'حساب رقم: 12345678 باسم الجعدبي' },
                  { id: 'alnejm', label: 'شبكة النجم للحوالات', note: 'حوالة باسم: معمر الجعدبي' },
                  { id: 'onecash', label: 'محفظة ون كاش OneCash', note: 'رقم المحفظة: 777123456' },
                  { id: 'cash_on_delivery', label: 'دفع نقدي (كاش)', note: 'عند المعاينة في المكتب أو وقت التركيب' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-3 rounded-xl text-right border transition-all flex flex-col justify-between ${
                      paymentMethod === m.id
                        ? 'border-[#801B2E] bg-[#FAF0F2] text-[#801B2E] shadow-2xs'
                        : 'border-[#E2D6BE] bg-[#FAF8F5] text-[#5B4636] hover:bg-[#F2EDE4]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold">{m.label}</span>
                      {paymentMethod === m.id && <Check className="w-4 h-4 text-[#801B2E]" />}
                    </div>
                    <span className="text-[10px] text-[#7A6A5A]">{m.note}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown Bottom Banner */}
            <div className="bg-[#F6EFE3] p-4 rounded-2xl border border-[#D4AF37]/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#7A6A5A] block">إجمالي تكلفة الإيجار والتركيب:</span>
                <span className="text-xl font-bold font-title text-[#801B2E]">
                  {formatPriceYER(grandTotalYER)}
                </span>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[#801B2E] text-white hover:bg-[#681424] shadow-md transition-all flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4 text-[#F9E8B2]" />
                <span>إرسال وتثبيت طلب الحجز</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: BOOKING CONFIRMATION & VOUCHER */}
        {step === 'success' && createdBooking && (
          <div className="overflow-y-auto p-6 flex-1 space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-title text-[#29170E]">
                مبارك إن شاء الله، تم استلام طلب حجزك بنجاح!
              </h3>
              <p className="text-xs text-[#6B5A4B] mt-1 max-w-md mx-auto">
                تم تسجيل حجزك في نظام الجعدبي وسيتم التواصل معك هاتفياً أو عبر الواتساب لتأكيد العربون وتفاصيل التركيب بالصالة.
              </p>
            </div>

            {/* Official Booking Voucher */}
            <div className="bg-white p-5 rounded-2xl border-2 border-[#D4AF37]/60 shadow-lg relative">
              {/* Top Voucher Barcode / Watermark */}
              <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3 mb-4">
                <div>
                  <span className="text-[10px] text-[#8C6D1F] font-serif block">𐩱𐩡𐩴𐩲𐩵𐩨𐩺 • قسيمة حجز رسمية</span>
                  <span className="text-xs font-bold text-[#29170E]">كوش وأفراح الجعدبي</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-[#FAF8F5] px-3 py-1.5 rounded-lg border border-[#DDD3BF] flex items-center gap-2">
                    <span className="text-xs text-[#7A6A5A]">رقم الحجز:</span>
                    <strong className="text-sm font-bold text-[#801B2E] tracking-wider" dir="ltr">
                      {createdBooking.bookingCode}
                    </strong>
                    <button
                      onClick={() => handleCopyCode(createdBooking.bookingCode)}
                      className="text-[#7A6A5A] hover:text-[#29170E] p-0.5"
                      title="نسخ رقم الحجز"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Voucher Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[#7A6A5A] block text-[11px]">اسم العريس / صاحب الحجز:</span>
                  <strong className="text-[#29170E]">{createdBooking.customerName}</strong>
                </div>

                <div>
                  <span className="text-[#7A6A5A] block text-[11px]">رقم الهاتف:</span>
                  <strong className="text-[#29170E]" dir="ltr">{createdBooking.customerPhone}</strong>
                </div>

                <div>
                  <span className="text-[#7A6A5A] block text-[11px]">تاريخ المناسبة:</span>
                  <strong className="text-[#801B2E]">{createdBooking.eventDate}</strong>
                </div>

                <div>
                  <span className="text-[#7A6A5A] block text-[11px]">اسم الكوشة:</span>
                  <strong className="text-[#29170E]">{createdBooking.koshaName}</strong>
                </div>

                <div>
                  <span className="text-[#7A6A5A] block text-[11px]">صالة الأعراس:</span>
                  <strong className="text-[#29170E]">{createdBooking.hallName}</strong>
                </div>

                <div>
                  <span className="text-[#7A6A5A] block text-[11px]">فترة الحفل:</span>
                  <strong className="text-[#29170E]">{getTimeSlotLabel(createdBooking.timeSlot)}</strong>
                </div>
              </div>

              {/* Total & Deposit banner */}
              <div className="mt-4 pt-3 border-t border-[#E8DEC8] flex items-center justify-between bg-[#FAF8F5] p-3 rounded-xl">
                <div>
                  <span className="text-[11px] text-[#7A6A5A] block">الإجمالي المتفق عليه:</span>
                  <span className="text-base font-bold text-[#801B2E]">
                    {formatPriceYER(createdBooking.totalPriceYER)}
                  </span>
                </div>

                <div className="text-left">
                  <span className="text-[11px] text-[#7A6A5A] block">عربون التثبيت:</span>
                  <span className="text-sm font-bold text-[#4B3B2F]">
                    {formatPriceYER(createdBooking.depositAmountYER)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FAF8F5] text-[#4B3B2F] hover:bg-[#F0E9DC] border border-[#DDD3BF] flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة / حفظ سند الحجز</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenChatWithBooking(createdBooking.bookingCode, createdBooking.koshaName);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-[#801B2E] text-white hover:bg-[#681424] flex items-center justify-center gap-1.5 shadow-md"
              >
                <MessageSquare className="w-4 h-4 text-[#F9E8B2]" />
                <span>تأكيد الحجز عبر المحادثة المباشرة مع الجعدبي</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
