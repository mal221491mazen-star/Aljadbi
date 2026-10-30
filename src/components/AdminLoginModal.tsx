import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  KeyRound
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const ADMIN_PASSCODE = 'admin7198';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPasscode('');
      setErrorMsg(null);
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmed = passcode.trim();

    if (!trimmed) {
      setErrorMsg('يرجى إدخال رمز دخول الإدارة للمتابعة');
      return;
    }

    if (trimmed === ADMIN_PASSCODE) {
      setIsSuccess(true);
      setErrorMsg(null);
      setTimeout(() => {
        onLoginSuccess();
      }, 500);
    } else {
      setErrorMsg('رمز الإدارة غير صحيح! يرجى التأكد والمحاولة مرة أخرى.');
      inputRef.current?.select();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#1C2331] text-white rounded-3xl border border-[#D4AF37]/50 shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4AF37] via-[#801B2E] to-[#D4AF37]" />

        {/* Header Icon & Title */}
        <div className="text-center mb-6 pt-2">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#801B2E] to-[#5C1320] border-2 border-[#D4AF37] flex items-center justify-center text-[#F9E8B2] shadow-lg shadow-[#801B2E]/40">
            <Lock className="w-8 h-8 text-[#F9E8B2]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-title text-[#F9E8B2]">
            تسجيل دخول لوحة الإدارة
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 mt-1.5">
            المنطقة مخصصة لإدارة كوش الجعدبي والتحكم بالحجوزات
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-200 mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>رمز الإدارة (Admin Code)</span>
            </label>

            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="أدخل رمز الإدارة للمتابعة..."
                className={`w-full px-4 py-3.5 rounded-xl bg-[#0F141D] text-white border text-sm focus:outline-none transition-all pl-12 pr-4 ${
                  errorMsg 
                    ? 'border-rose-500 ring-2 ring-rose-500/30' 
                    : isSuccess
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-[#2E384D] focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/30'
                }`}
                autoComplete="current-password"
                disabled={isSuccess}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#F9E8B2] p-1.5 transition-colors"
                title={showPassword ? 'إخفاء الرمز' : 'إظهار الرمز'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>تم التحقق بنجاح! جاري فتح لوحة الإدارة...</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSuccess}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#801B2E] via-[#A3233B] to-[#801B2E] hover:brightness-110 shadow-lg shadow-[#801B2E]/40 border border-[#D4AF37]/50 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4 text-[#F9E8B2]" />
              <span>دخول لوحة الإدارة</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSuccess}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              إلغاء والعودة للواجهة الرئيسية
            </button>
          </div>
        </form>

        {/* Security Note */}
        <div className="mt-6 pt-4 border-t border-[#2E384D] text-center">
          <p className="text-[11px] text-gray-400 leading-relaxed">
            بيانات الحجوزات وإعدادات الأسعار محمية وخاصة بمسؤولي كوش الجعدبي فقط.
          </p>
        </div>
      </div>
    </div>
  );
};
