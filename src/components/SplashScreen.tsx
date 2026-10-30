import React, { useEffect, useState } from 'react';
import { Sparkles, Crown } from 'lucide-react';

interface SplashScreenProps {
  onFinish?: () => void;
  durationMs?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  durationMs = 2000,
}) => {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Animate progress smoothly
    const intervalTime = 30;
    const totalSteps = durationMs / intervalTime;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const currentProgress = Math.min(100, Math.round((step / totalSteps) * 100));
      setProgress(currentProgress);

      if (step >= totalSteps) {
        clearInterval(timer);
        setIsFadingOut(true);
        setTimeout(() => {
          setIsDone(true);
          onFinish?.();
        }, 500);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [durationMs, onFinish]);

  if (isDone) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#1C2331] via-[#801B2E] to-[#450A15] text-white transition-opacity duration-500 overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      dir="rtl"
    >
      {/* Background Decorative Himyarite Geometric Patterns & Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/15 via-transparent to-black/60 pointer-events-none" />
      
      {/* Subtle traditional lattice watermark */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23FFFFFF' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md w-full animate-in fade-in zoom-in-90 duration-700">
        
        {/* Royal Crest Monogram with Shimmer Gold Ring */}
        <div className="relative mb-6">
          <div className="absolute -inset-3 bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] rounded-full blur-md opacity-40 animate-pulse" />
          
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-[#801B2E] via-[#5A101E] to-[#1C2331] border-2 border-[#D4AF37] shadow-2xl flex flex-col items-center justify-center p-3">
            {/* Crown Icon */}
            <Crown className="w-8 h-8 text-[#F9E8B2] filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] mb-1" />
            
            {/* Musnad Calligraphy in gold */}
            <span className="text-sm font-serif font-bold text-[#D4AF37] tracking-widest drop-shadow-xs" title="الجعدبي بالمسند الحميري">
              𐩱𐩡𐩴𐩲𐩵𐩨𐩺
            </span>
          </div>

          <div className="absolute -bottom-2 -left-2 p-1.5 rounded-full bg-[#1C2331] border border-[#D4AF37] text-[#D4AF37] shadow-md">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
        </div>

        {/* Brand Names */}
        <h1 className="text-3xl sm:text-4xl font-extrabold font-title tracking-tight text-[#FAF8F5] drop-shadow-md mb-2">
          كوش الجعدبي
        </h1>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C2331]/80 border border-[#D4AF37]/50 text-[#F9E8B2] text-xs font-semibold mb-3">
          <span>𐩱𐩡𐩴𐩲𐩵𐩨𐩺</span>
          <span>•</span>
          <span>فخامة الأعراس والقصور اليمنية</span>
        </div>

        <p className="text-xs sm:text-sm text-[#F3E5AB]/90 max-w-xs mb-8 leading-relaxed font-light">
          تجهيز وتنسيق أفخم كوش صالات الأعراس والمناسبات في صنعاء وعموم محافظات اليمن
        </p>

        {/* Progress Bar Container */}
        <div className="w-full max-w-xs space-y-2">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden p-0.5 border border-[#D4AF37]/30 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#C5A059] via-[#F9E8B2] to-[#D4AF37] rounded-full transition-all duration-150 ease-out shadow-[0_0_8px_#D4AF37]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#F3E5AB]/75 px-1 font-mono">
            <span>جاري تهيئة المعرض الملكي...</span>
            <span dir="ltr">{progress}%</span>
          </div>
        </div>

        {/* Skip button for quick user convenience */}
        <button
          onClick={() => {
            setIsFadingOut(true);
            setTimeout(() => {
              setIsDone(true);
              onFinish?.();
            }, 300);
          }}
          className="mt-6 text-[11px] text-[#F3E5AB]/60 hover:text-[#F3E5AB] transition-colors underline underline-offset-4 cursor-pointer"
        >
          تخطي والبدء مباشرة
        </button>
      </div>

      {/* Bottom Yemeni Heritage Seal */}
      <div className="absolute bottom-4 text-center text-[10px] text-[#F9E8B2]/40 tracking-wider font-serif">
        صنعاء • اليمن | رمز الأصالة والفخامة الملكية
      </div>
    </div>
  );
};
