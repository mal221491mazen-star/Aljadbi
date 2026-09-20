import React from 'react';
import { HimyariteLogo } from './HimyariteLogo';
import { Phone, MapPin, Clock, MessageSquare, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenChat: () => void;
  onOpenTracker: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenChat,
  onOpenTracker,
  onSelectCategory,
}) => {
  return (
    <footer className="bg-[#1C2331] text-[#E2D6BE] border-t border-[#2E384D] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-700/60">
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <HimyariteLogo variant="dark" size="md" />
            <p className="text-xs text-gray-400 leading-relaxed">
              المنصة الرقمية الأولى في اليمن المتخصصة في تأجير وتصميم كوش الأعراس النسائية والرجالية بصالات المناسبات بطابع ملوكي يمني أصيل.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E5C158]">
              <span className="font-serif">𐩱𐩡𐩴𐩲𐩵𐩨𐩺</span>
              <span>• نخدمكم في كافة المحافظات</span>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              <span>أقسام الكوش</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectCategory('women')}
                  className="hover:text-white transition-colors"
                >
                  كوش الأعراس النسائية الملكية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('men')}
                  className="hover:text-white transition-colors"
                >
                  كوش ومجالس المقائل الرجالية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('traditional')}
                  className="hover:text-white transition-colors"
                >
                  كوش التراث اليمني والزفات الصنعانية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('royal_vip')}
                  className="hover:text-white transition-colors"
                >
                  كوش القصور الملكية VIP
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="text-[#E5C158] hover:underline font-bold"
                >
                  تتبع حالة حجز برقم الحجز
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Visit */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              <span>التواصل ومقر الإدارة</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>صنعاء - حدة - شارع الستين الجنوبي (مكتب كوش الجعدبي)</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="tel:777123456" className="hover:text-white" dir="ltr">
                  +967 777 123 456
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>المعاينة الميدانية: 9:00 ص - 10:00 م</span>
              </li>
            </ul>

            <button
              onClick={onOpenChat}
              className="mt-3 w-full py-2 rounded-xl text-xs font-bold bg-[#801B2E] text-white hover:bg-[#992037] transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>بدء محادثة مباشرة الآن</span>
            </button>
          </div>

          {/* Col 4: Trust & Guarantee */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
              <span>ضمانات الخدمة والدفع</span>
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>عقد حجز إلكتروني وسند رسمي</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                طرق دفع العربون المعتمدة: حوالات بنك الكريمي، شبكة النجم، ون كاش، أو نقداً عند المعاينة.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} لمنصة <strong>الجعدبي لكوش الأعراس</strong>
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>صُممت بفخر لأعراس وأفراح اليمن السعيد</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </div>
        </div>
      </div>
    </footer>
  );
};
