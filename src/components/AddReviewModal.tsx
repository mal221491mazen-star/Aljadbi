import React, { useState } from 'react';
import { X, Star, Heart, CheckCircle2, MessageSquare, Sparkles, Building2, User } from 'lucide-react';
import { Kosha } from '../types';

interface AddReviewModalProps {
  isOpen: boolean;
  kosha: Kosha | null;
  defaultCustomerName?: string;
  defaultHallName?: string;
  bookingCode?: string;
  onClose: () => void;
  onSubmitReview: (reviewData: {
    koshaId: string;
    koshaName: string;
    rating: number;
    comment: string;
    author: string;
    hall: string;
    city: string;
  }) => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  kosha,
  defaultCustomerName = '',
  defaultHallName = '',
  bookingCode,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState<string>(defaultCustomerName);
  const [city, setCity] = useState<string>('صنعاء');
  const [hall, setHall] = useState<string>(defaultHallName || 'صالة الأعراس');
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessNotice, setShowSuccessNotice] = useState<boolean>(false);

  // Sync props when opening
  React.useEffect(() => {
    if (defaultCustomerName) setAuthor(defaultCustomerName);
    if (defaultHallName) setHall(defaultHallName);
  }, [defaultCustomerName, defaultHallName]);

  if (!isOpen || !kosha) return null;

  const ratingDescriptions: Record<number, string> = {
    1: 'غير راضٍ تماماً 🙁',
    2: 'مقبول ويحتاج تطوير 😐',
    3: 'جيد ولطيف 🙂',
    4: 'رائع جداً وفخم 😊',
    5: 'فخامة ملكية استثنائية تفوق التوقعات! 🌟👑',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !author.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitReview({
        koshaId: kosha.id,
        koshaName: kosha.name,
        rating,
        comment: comment.trim(),
        author: author.trim(),
        hall: hall.trim() || 'صالة الأعراس',
        city: city.trim() || 'صنعاء',
      });
      setIsSubmitting(false);
      setShowSuccessNotice(true);
      setTimeout(() => {
        setShowSuccessNotice(false);
        onClose();
        setComment('');
      }, 1500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="relative bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl border border-[#D4AF37]/50 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200"
        dir="rtl"
      >
        {/* Modal Header */}
        <div className="bg-[#801B2E] text-[#F9E8B2] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-white/10 border border-[#D4AF37]/40 text-[#D4AF37]">
              <Star className="w-5 h-5 fill-current" />
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-title">تقييم الكوشة وإضافة رأيك</h3>
              <p className="text-[11px] text-[#F3E5AB]">شاركنا تجربتك الحقيقية في حفل الزفاف</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#F9E8B2] hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {showSuccessNotice ? (
          <div className="p-8 text-center space-y-3 bg-white">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-[#29170E]">شكراً جزيلاً لرأيك الكريم!</h4>
            <p className="text-xs text-[#6B5A4B] max-w-xs mx-auto">
              تم تسجيل تقييمك وتحديث متوسط تقييم كوشة ({kosha.name}) بنجاح.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
            {/* Target Kosha Summary Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#E6DEC8] flex items-center gap-3 shadow-2xs">
              <img
                src={kosha.images[0]}
                alt={kosha.name}
                className="w-14 h-14 rounded-xl object-cover border border-[#DDD3BF] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10.5px] text-[#C5A059] block font-serif">
                  𐩱𐩡𐩴𐩲𐩵𐩨𐩺 • طراز معتمد
                </span>
                <h4 className="text-sm font-bold text-[#29170E] truncate">{kosha.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#7A6A5A] mt-0.5">
                  <span>التقييم الحالي:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current inline" />
                    {kosha.rating}
                  </span>
                  <span>({kosha.reviewsCount} تقييم مسجل)</span>
                </div>
              </div>
              {bookingCode && (
                <div className="text-[10px] bg-[#FAF0DF] border border-[#D4AF37]/40 text-[#801B2E] font-mono px-2 py-1 rounded-md shrink-0">
                  حجز: {bookingCode}
                </div>
              )}
            </div>

            {/* Interactive Stars Rating Selector */}
            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] text-center space-y-2">
              <label className="block text-xs font-bold text-[#5B4636]">
                اختر عدد النجوم لتقييم الكوشة:
              </label>

              <div className="flex items-center justify-center gap-2 py-1" dir="ltr">
                {[1, 2, 3, 4, 5].map((starVal) => {
                  const isFilled = starVal <= (hoverRating || rating);
                  return (
                    <button
                      type="button"
                      key={starVal}
                      onClick={() => setRating(starVal)}
                      onMouseEnter={() => setHoverRating(starVal)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-hidden cursor-pointer"
                      title={`${starVal} نجوم`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? 'text-amber-500 fill-amber-500 drop-shadow-xs'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="text-xs font-semibold text-[#801B2E] transition-all">
                {ratingDescriptions[hoverRating || rating]}
              </div>
            </div>

            {/* Customer Name & City/Hall Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#5B4636] mb-1">
                  الاسم أو لقب العائلة: <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="مثال: أم محمد العريقي أو م. أحمد"
                    className="w-full bg-white border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                  />
                  <User className="w-3.5 h-3.5 text-[#8A7A6A] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5B4636] mb-1">
                  اسم القاعة / الصالة:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={hall}
                    onChange={(e) => setHall(e.target.value)}
                    placeholder="مثال: صالة الرويشان - صنعاء"
                    className="w-full bg-white border border-[#DDD3BF] rounded-xl px-3 py-2 text-xs text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                  />
                  <Building2 className="w-3.5 h-3.5 text-[#8A7A6A] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Review Comment Textarea */}
            <div>
              <label className="block text-xs font-bold text-[#5B4636] mb-1">
                رأيك وتجربتك بالتفصيل (نجوم وتعليق): <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب انطباعك عن تنسيق الكوشة، الورود، الإضاءة، والتزام فريق الجعدبي بموعد التجهيز..."
                className="w-full bg-white border border-[#DDD3BF] rounded-xl p-3 text-xs text-[#29170E] focus:outline-hidden focus:border-[#801B2E] resize-none"
              />
            </div>

            {/* Notice */}
            <div className="bg-[#FAF0DF] p-3 rounded-xl border border-[#D4AF37]/40 text-[11px] text-[#6E5D4E] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                سيتم تحديث متوسط تقييم الكوشة وإجمالي عدد التقييمات فوراً ليظهر لكافة زوار الموقع.
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim() || !author.trim()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#801B2E] text-white hover:bg-[#681424] font-bold text-xs sm:text-sm shadow-md transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Star className="w-4 h-4 fill-current text-[#F9E8B2]" />
                <span>{isSubmitting ? 'جاري حفظ التقييم...' : 'نشر التقييم وتحديث الكوشة'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl bg-white border border-[#DDD3BF] text-[#5B4636] hover:bg-gray-100 font-medium text-xs sm:text-sm cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
