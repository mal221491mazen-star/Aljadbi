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
import { printBookingVoucher } from '../utils/voucherPrinter';

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
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdBooking, setCreatedBooking] = useState<BookingRequest | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [printSuccessNotice, setPrintSuccessNotice] = useState<boolean>(false);

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

  if (!kosha) return null;

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

  const handlePrintVoucher = () => {
    if (!createdBooking) return;
    setIsPrinting(true);
    setPrintSuccessNotice(true);
    printBookingVoucher(createdBooking);
    setTimeout(() => {
      setIsPrinting(false);
    }, 2000);
    setTimeout(() => {
      setPrintSuccessNotice(false);
    }, 7000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
      <div 
        className="relative bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl border border-[#D4AF37]/50 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        id="booking-modal-container"
      >
        {/* Modal Top Header */}
        <div className="bg-[#801B2E] text-[#F9E8B2] px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-white/10 border border-[#D4AF37]/40">
              <CalendarCheck className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <div>
              <h2 className="text-sm sm:text-lg font-bold font-title">
                {step === 'form' ? 'طلب حجز كوشة الصالة' : 'تم استلام طلب الحجز بنجاح!'}
              </h2>
              <span className="text-[10px] sm:text-[11px] text-[#F3E5AB]">كوش وأفراح الجعدبي • خدمة رقمية معتمدة</span>
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
            <div className="bg-[#F6EFE3] p-4 rounded-2xl border border-[#D4AF37]/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-auto text-right">
                <span className="text-xs text-[#7A6A5A] block">إجمالي تكلفة الإيجار والتركيب:</span>
                <span className="text-lg sm:text-xl font-bold font-title text-[#801B2E]">
                  {formatPriceYER(grandTotalYER)}
                </span>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-xl text-sm font-bold bg-[#801B2E] text-white hover:bg-[#681424] shadow-md transition-all flex items-center justify-center gap-2"
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

            {/* Official Booking Voucher Card */}
            <div 
              id="official-booking-voucher"
              className="bg-white p-5 sm:p-6 rounded-2xl border-2 border-[#D4AF37] shadow-xl relative overflow-hidden"
            >
              {/* Decorative Corner Accents */}
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#801B2E]"></div>
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#801B2E]"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#801B2E]"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#801B2E]"></div>

              {/* Top Voucher Barcode / Watermark */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#D4AF37]/40 pb-3 mb-4 gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8C6D1F] font-serif">
                    <span>𐩱𐩡𐩴𐩲𐩵𐩨𐩺</span>
                    <span>•</span>
                    <span className="font-sans font-bold">سند حجز وتأكيد معتمد</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold font-title text-[#801B2E]">
                    كوش وأفراح الجعدبي
                  </h4>
                  <span className="text-[10px] text-[#7A6A5A]">خدمة تأجير كوش الصالات النسائية والرجالية • صنعاء</span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#D4AF37]/50 flex items-center gap-2 shadow-2xs">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-[#7A6A5A]">رقم السند:</span>
                      <strong className="text-sm sm:text-base font-bold text-[#801B2E] tracking-wider font-mono" dir="ltr">
                        {createdBooking.bookingCode}
                      </strong>
                    </div>
                    <button
                      onClick={() => handleCopyCode(createdBooking.bookingCode)}
                      className="text-[#7A6A5A] hover:text-[#801B2E] p-1.5 rounded-lg hover:bg-white transition-colors"
                      title="نسخ رقم الحجز"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Voucher Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EDE4D2]">
                  <span className="text-[#7A6A5A] block text-[10.5px]">المستأجر / العريس:</span>
                  <strong className="text-[#29170E] text-xs sm:text-sm">{createdBooking.customerName}</strong>
                </div>

                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EDE4D2]">
                  <span className="text-[#7A6A5A] block text-[10.5px]">رقم هاتف التنسيق:</span>
                  <strong className="text-[#29170E] text-xs sm:text-sm font-mono" dir="ltr">{createdBooking.customerPhone}</strong>
                </div>

                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EDE4D2]">
                  <span className="text-[#7A6A5A] block text-[10.5px]">تاريخ الحفل:</span>
                  <strong className="text-[#801B2E] text-xs sm:text-sm">{createdBooking.eventDate}</strong>
                </div>

                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EDE4D2]">
                  <span className="text-[#7A6A5A] block text-[10.5px]">اسم الكوشة المختارة:</span>
                  <strong className="text-[#29170E] text-xs sm:text-sm">{createdBooking.koshaName}</strong>
                </div>

                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EDE4D2]">
                  <span className="text-[#7A6A5A] block text-[10.5px]">صالة الأعراس:</span>
                  <strong className="text-[#29170E] text-xs sm:text-sm">{createdBooking.hallName}</strong>
                </div>

                <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EDE4D2]">
                  <span className="text-[#7A6A5A] block text-[10.5px]">فترة الحفل بالصالة:</span>
                  <strong className="text-[#29170E] text-xs sm:text-sm">{getTimeSlotLabel(createdBooking.timeSlot)}</strong>
                </div>
              </div>

              {/* Kosha Customization Summary */}
              {createdBooking.customization && (
                <div className="mt-3 bg-[#FAF5EB] p-3 rounded-xl border border-[#E8DEC8] text-[11px] text-[#5C4533] space-y-1">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-medium">
                    <span>لون الورد: <strong>{createdBooking.customization.flowerColor}</strong></span>
                    <span>طراز الجلسة: <strong>{createdBooking.customization.seatingStyle}</strong></span>
                    <span>الإضاءة: <strong>{createdBooking.customization.lightingMode}</strong></span>
                  </div>
                  {createdBooking.customization.customAcrylicNames.enabled && (
                    <div className="text-[#801B2E] font-bold">
                      لوحة الأسماء الإكريليكية: {createdBooking.customization.customAcrylicNames.groomName} & {createdBooking.customization.customAcrylicNames.brideName}
                    </div>
                  )}
                </div>
              )}

              {/* Total & Deposit banner */}
              <div className="mt-4 pt-3 border-t border-[#E8DEC8] grid grid-cols-2 sm:grid-cols-3 gap-2 bg-[#FDF9F0] p-3.5 rounded-xl border border-[#E8DEC8]">
                <div>
                  <span className="text-[10.5px] text-[#7A6A5A] block">إجمالي تكلفة الحجز:</span>
                  <span className="text-sm sm:text-base font-bold text-[#801B2E]">
                    {formatPriceYER(createdBooking.totalPriceYER)}
                  </span>
                </div>

                <div>
                  <span className="text-[10.5px] text-[#065F46] block">عربون التثبيت:</span>
                  <span className="text-sm sm:text-base font-bold text-[#065F46]">
                    {formatPriceYER(createdBooking.depositAmountYER)}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10.5px] text-[#991B1B] block">المتبقي عند التركيب:</span>
                  <span className="text-sm sm:text-base font-bold text-[#991B1B]">
                    {formatPriceYER(Math.max(0, createdBooking.totalPriceYER - createdBooking.depositAmountYER))}
                  </span>
                </div>
              </div>

              {/* Official Seal and stamp placeholder in UI */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#7A6A5A] pt-2 border-t border-dashed border-[#E0D4C0]">
                <span>حالة الطلب: <strong className="text-amber-700">قيد المراجعة وتأكيد العربون</strong></span>
                <span className="font-serif text-[#C5A059]">ختم إدارة كوش الجعدبي المعتمد ✦</span>
              </div>
            </div>

            {/* Printing Notification Toast */}
            {printSuccessNotice && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تم إنشاء سند الحجز بنجاح وإرساله للطباعة / الحفظ بصيغة PDF!</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                id="print-booking-voucher-btn"
                type="button"
                onClick={handlePrintVoucher}
                disabled={isPrinting}
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-bold bg-[#FAF8F5] text-[#801B2E] hover:bg-[#F3EAD8] active:scale-98 border-2 border-[#D4AF37] flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer min-h-[44px]"
              >
                <Printer className="w-4 h-4 text-[#801B2E]" />
                <span>{isPrinting ? 'جاري تجهيز وطباعة السند...' : 'طباعة / حفظ سند الحجز'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenChatWithBooking(createdBooking.bookingCode, createdBooking.koshaName);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#801B2E] to-[#A3233B] text-white hover:brightness-105 active:scale-98 flex items-center justify-center gap-2 shadow-md transition-all min-h-[44px]"
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
