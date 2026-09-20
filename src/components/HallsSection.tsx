import React from 'react';
import { Building2, Users, MapPin, Sparkles, Check } from 'lucide-react';
import { YEMENI_HALLS } from '../data/initialData';
import { YemeniHall } from '../types';

interface HallsSectionProps {
  onSelectHall: (hallName: string) => void;
}

export const HallsSection: React.FC<HallsSectionProps> = ({ onSelectHall }) => {
  return (
    <section className="py-12 border-t border-[#E8DEC8] bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E1] border border-[#D4AF37]/40 text-[#801B2E] text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>تغطية صالات الأعراس</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-title text-[#29170E]">
            جاهزية كاملة لكافة صالات وقصور الأفراح في اليمن
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6B5A4B]">
            فريق كوش الجعدبي يمتلك خبرة هندسية واسعة بمقاسات ومسارح ومداخل كافة صالات الأعراس، مما يضمن التثبيت المثالي بدون أي مفاجآت في ليلة العمر.
          </p>
        </div>

        {/* Halls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {YEMENI_HALLS.map((hall) => (
            <div
              key={hall.id}
              className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs hover:border-[#C5A059] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#801B2E] bg-[#FAF0F2] px-2.5 py-0.5 rounded-full border border-[#801B2E]/20">
                    {hall.city}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-[#7A6A5A]">
                    <Users className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>سعة: {hall.capacity}</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm sm:text-base text-[#29170E] mb-1">{hall.name}</h3>
                <p className="text-xs text-[#7A6A5A] flex items-center gap-1 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#801B2E] shrink-0" />
                  <span>{hall.area}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-[#F0E9DC] flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>متوافق مع كوش الجعدبي</span>
                </span>
                <button
                  onClick={() => onSelectHall(hall.name)}
                  className="text-xs font-bold text-[#801B2E] hover:underline"
                >
                  استعراض الكوش المتوافقة
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cultural Yemeni Wedding Rituals Card */}
        <div className="mt-12 bg-gradient-to-r from-[#2B170E] via-[#4A1E14] to-[#2B170E] rounded-3xl p-6 sm:p-8 text-[#FAF8F5] border border-[#D4AF37]/40 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E5C158] mb-2">
                <span>𐩱𐩡𐩴𐩲𐩵𐩨𐩺</span>
                <span>•</span>
                <span>فخر الهوية اليمنية السبئية والحميرية</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-title text-[#F9E8B2] mb-3">
                أعراس اليمن بطقوسها العريقة وفخامتها الملكية
              </h3>
              <p className="text-xs sm:text-sm text-[#E2D6BE] leading-relaxed">
                من ليلة الحناء بالمشاقر الصنعانية والريحان العطري، إلى زفة العروس بين القمريات الملونة، ومجالس المقيل والمسامرة الرجالية المهيبة، نصمم كل كوشة ومنصة لتكون امتداداً حقيقياً لفرحة العائلة اليمنية وفخارها التليد.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-2">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-xs">
                <strong className="text-[#F9E8B2] block">تجهيزات خاصة لزفات الحناء:</strong>
                <span className="text-[#DDD3BF]">قمريات صنعانية، دلال يمنية، ومباخر البخور العدني</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-xs">
                <strong className="text-[#F9E8B2] block">منصات ومجالس المقيل الرجالي:</strong>
                <span className="text-[#DDD3BF]">مساند ملكية مذهبة وهندسة إضاءة دافئة تلائم الوجهاء</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
