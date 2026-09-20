import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Calendar, 
  Sparkles, 
  MessageSquare,
  AlertCircle,
  FileText,
  Printer
} from 'lucide-react';
import { BookingRequest } from '../types';
import { formatPriceYER, formatStatusLabel, getTimeSlotLabel } from '../utils/formatters';
import { printBookingVoucher } from '../utils/voucherPrinter';

interface BookingTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: BookingRequest[];
  onOpenChatWithBooking: (bookingCode: string, koshaName: string) => void;
}

export const BookingTrackerModal: React.FC<BookingTrackerModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onOpenChatWithBooking,
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<BookingRequest | null>(
    bookings.length > 0 ? bookings[0] : null
  );
  const [errorNotFound, setErrorNotFound] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorNotFound(false);

    const term = searchCode.trim().toUpperCase();
    if (!term) return;

    const found = bookings.find(
      (b) =>
        b.bookingCode.toUpperCase() === term ||
        b.customerPhone.includes(term) ||
        b.customerName.includes(term)
    );

    if (found) {
      setSearchedBooking(found);
    } else {
      setErrorNotFound(true);
      setSearchedBooking(null);
    }
  };

  const steps = [
    { key: 'pending', label: 'استلام الطلب والتدقيق' },
    { key: 'confirmed', label: 'تأكيد الحجز واستلام العربون' },
    { key: 'in_preparation', label: 'تجهيز الورد والديكورات' },
    { key: 'completed', label: 'تم التركيب والجاهزية بالصالة' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'in_preparation':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6">
      <div 
        className="relative bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl border border-[#D4AF37]/50 shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        id="booking-tracker-modal"
      >
        {/* Header */}
        <div className="bg-[#801B2E] text-[#F9E8B2] px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-white/10 border border-[#D4AF37]/40">
              <Search className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-title">متابعة وتتبع حالة الحجز</h2>
              <p className="text-[11px] text-[#F3E5AB]">كوش وأفراح الجعدبي</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#F9E8B2] hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 border-b border-[#E6DEC8] bg-white">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="أدخل رقم الحجز (مثال: JDB-2084) أو رقم الهاتف..."
              className="flex-1 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#801B2E] text-white font-bold text-xs sm:text-sm hover:bg-[#681424] transition-colors"
            >
              بحث
            </button>
          </form>

          {/* Quick sample chips */}
          <div className="flex items-center gap-2 mt-2 text-[11px] text-[#7A6A5A]">
            <span>تجربة أرقام حجوزات سريعة:</span>
            {bookings.slice(0, 3).map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  setSearchCode(b.bookingCode);
                  setSearchedBooking(b);
                  setErrorNotFound(false);
                }}
                className="text-[#801B2E] font-bold hover:underline bg-[#FAF0DF] px-2 py-0.5 rounded-md border border-[#D4AF37]/30"
              >
                {b.bookingCode}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-5 space-y-5 flex-1">
          {errorNotFound && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-4 rounded-xl flex items-center gap-2 text-center justify-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>لم يتم العثور على حجز يطابق هذا الرقم. يرجى التأكد من الرقم والمحاولة مجدداً.</span>
            </div>
          )}

          {searchedBooking && (
            <div className="space-y-5">
              {/* Status Header Badge */}
              <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE] shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[11px] text-[#7A6A5A] block">رقم الحجز:</span>
                    <strong className="text-base font-bold text-[#801B2E] tracking-wider" dir="ltr">
                      {searchedBooking.bookingCode}
                    </strong>
                  </div>

                  {(() => {
                    const st = formatStatusLabel(searchedBooking.status);
                    return (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${st.color} ${st.bg} ${st.border}`}
                      >
                        {st.label}
                      </span>
                    );
                  })()}
                </div>

                {/* Progress Steps Timeline */}
                <div className="mt-4 pt-4 border-t border-[#F0E9DC]">
                  <div className="relative flex items-center justify-between">
                    {/* Connecting line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#E8DEC8] -translate-y-1/2 z-0"></div>
                    <div
                      className="absolute top-1/2 right-0 h-1 bg-[#801B2E] -translate-y-1/2 z-0 transition-all duration-500"
                      style={{
                        width: `${(getStepIndex(searchedBooking.status) / (steps.length - 1)) * 100}%`,
                      }}
                    ></div>

                    {steps.map((step, idx) => {
                      const currentIdx = getStepIndex(searchedBooking.status);
                      const isPastOrCurrent = idx <= currentIdx;
                      return (
                        <div key={step.key} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isPastOrCurrent
                                ? 'bg-[#801B2E] text-white ring-4 ring-[#FAF0F2]'
                                : 'bg-white border-2 border-[#DDD3BF] text-[#8A7A6A]'
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <span
                            className={`text-[10px] mt-1 text-center font-medium max-w-[70px] ${
                              isPastOrCurrent ? 'text-[#801B2E] font-bold' : 'text-[#8A7A6A]'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Booking Info Card */}
              <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE] space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={searchedBooking.koshaImage}
                    alt={searchedBooking.koshaName}
                    className="w-16 h-16 rounded-xl object-cover border border-[#D9CEBA] shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#29170E]">{searchedBooking.koshaName}</h4>
                    <p className="text-xs text-[#7A6A5A] mt-0.5">
                      الصالة: <strong>{searchedBooking.hallName}</strong>
                    </p>
                    <p className="text-[11px] text-[#801B2E] font-medium">
                      الموعد: {searchedBooking.eventDate} ({getTimeSlotLabel(searchedBooking.timeSlot)})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#F0E9DC] text-xs">
                  <div>
                    <span className="text-[#7A6A5A] block text-[11px]">اسم العريس / الزبون:</span>
                    <strong className="text-[#29170E]">{searchedBooking.customerName}</strong>
                  </div>
                  <div>
                    <span className="text-[#7A6A5A] block text-[11px]">إجمالي التكلفة:</span>
                    <strong className="text-[#801B2E]">{formatPriceYER(searchedBooking.totalPriceYER)}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => printBookingVoucher(searchedBooking)}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#FAF8F5] text-[#801B2E] hover:bg-[#F3EAD8] border border-[#D4AF37]/60 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة / حفظ سند هذا الحجز (PDF)</span>
                  </button>
                </div>
              </div>

              {/* Chat action with this booking */}
              <div className="bg-[#FAF0E1] p-4 rounded-2xl border border-[#D4AF37]/50 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-[#29170E]">هل تحتاج لتعديل تفاصيل أو موعد؟</h5>
                  <p className="text-[11px] text-[#6E5D4E]">تواصل مباشرة مع إدارة الجعدبي بخصوص هذا الحجز</p>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onOpenChatWithBooking(searchedBooking.bookingCode, searchedBooking.koshaName);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#801B2E] text-white hover:bg-[#681424] transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>محادثة حول الحجز</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
