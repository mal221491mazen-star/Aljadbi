export function formatPriceYER(amount: number): string {
  return new Intl.NumberFormat('ar-YE', {
    maximumFractionDigits: 0,
  }).format(amount) + ' ر.ي';
}

export function formatPriceUSD(amount: number): string {
  return '$' + amount.toLocaleString('en-US');
}

export function formatStatusLabel(status: string): { label: string; color: string; bg: string; border: string } {
  switch (status) {
    case 'confirmed':
      return {
        label: 'حجز مؤكد ومعتمد',
        color: 'text-emerald-700',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
      };
    case 'pending':
      return {
        label: 'قيد المراجعة والتدقيق',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
      };
    case 'in_preparation':
      return {
        label: 'جاري التجهيز للتركيب',
        color: 'text-blue-700',
        bg: 'bg-blue-50',
        border: 'border-blue-200',
      };
    case 'completed':
      return {
        label: 'تم الحفل بنجاح',
        color: 'text-gray-700',
        bg: 'bg-gray-100',
        border: 'border-gray-200',
      };
    case 'cancelled':
      return {
        label: 'ملغي',
        color: 'text-rose-700',
        bg: 'bg-rose-50',
        border: 'border-rose-200',
      };
    default:
      return {
        label: status,
        color: 'text-gray-700',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
      };
  }
}

export function getPaymentMethodLabel(method: string): string {
  switch (method) {
    case 'kuraimi':
      return 'حوالة بنك الكريمي إكسبرس';
    case 'alnejm':
      return 'حوالة شبكة النجم للحوالات';
    case 'onecash':
      return 'محفظة ون كاش الرقمية';
    case 'cash_on_delivery':
      return 'دفع نقدي (كاش) عند المعاينة والتركيب';
    default:
      return method;
  }
}

export function getTimeSlotLabel(slot: string): string {
  switch (slot) {
    case 'evening':
      return 'الفترة المسائية (حفل السهرة 5:00 م - 12:00 ل)';
    case 'morning':
      return 'الفترة النهارية (غداء ومقيل 11:00 ص - 4:30 ع)';
    case 'full_day':
      return 'يوم كامل (صباحي ومسائي)';
    default:
      return slot;
  }
}
