import React, { useState } from 'react';
import { 
  Crown, 
  Sparkles, 
  Lock, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Store, 
  KeyRound,
  ArrowRight,
  Heart
} from 'lucide-react';
import { AppUser } from '../types';

export const ADMIN_PASSCODE = 'admin7198';

interface AuthScreenProps {
  onLoginSuccess: (user: AppUser, targetView: 'client' | 'admin') => void;
  onContinueAsGuest: () => void;
  initialRole?: 'admin' | 'customer';
  canClose?: boolean;
  onClose?: () => void;
}

const YEMENI_CITIES = [
  'صنعاء',
  'عدن',
  'إب',
  'تعز',
  'الحديدة',
  'حضرموت (المكلا/سيئون)',
  'ذمار',
  'مأرب',
  'عمران',
  'حجة',
  'المحويت',
  'صعدة',
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLoginSuccess,
  onContinueAsGuest,
  initialRole = 'customer',
  canClose = false,
  onClose,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCity, setRegCity] = useState('صنعاء');
  const [regRole, setRegRole] = useState<'customer' | 'admin'>('customer');
  const [regAdminCode, setRegAdminCode] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Status animation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick 1-click test helpers
  const handleQuickAdminLogin = () => {
    setIsSubmitting(true);
    setSuccessMessage('مرحباً بك! جاري الدخول المباشر إلى لوحة إدارة كوش الجعدبي...');
    setTimeout(() => {
      const adminUser: AppUser = {
        id: 'usr_admin',
        name: 'مدير كوش الجعدبي',
        email: 'admin@jaadabi.ye',
        phone: '777123456',
        city: 'صنعاء',
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(adminUser, 'admin');
    }, 600);
  };

  const handleQuickCustomerLogin = () => {
    setIsSubmitting(true);
    setSuccessMessage('أهلاً بك! جاري فتح متجر ومعرض كوش الأعراس...');
    setTimeout(() => {
      const demoCustomer: AppUser = {
        id: 'usr_demo_customer',
        name: 'أحمد اليماني (عريس)',
        phone: '771234567',
        email: 'ahmed@example.ye',
        city: 'صنعاء',
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(demoCustomer, 'client');
    }, 600);
  };

  // Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const identifier = loginIdentifier.trim();
    const password = loginPassword.trim();

    if (!identifier) {
      setLoginError('يرجى إدخال اسم المستخدم أو رقم الهاتف أو البريد الإلكتروني');
      return;
    }

    if (!password) {
      setLoginError('يرجى إدخال كلمة المرور أو رمز المرور');
      return;
    }

    // Check if this is Admin
    const isAdminAttempt = 
      identifier.toLowerCase() === 'admin' || 
      identifier.toLowerCase() === 'admin@jaadabi.ye' ||
      password === ADMIN_PASSCODE;

    if (isAdminAttempt) {
      if (password === ADMIN_PASSCODE || password === 'admin') {
        setIsSubmitting(true);
        setSuccessMessage('تم التحقق من هوية المدير! جاري فتح لوحة التحكم...');
        setTimeout(() => {
          const adminUser: AppUser = {
            id: 'usr_admin',
            name: 'إدارة كوش الجعدبي',
            email: 'admin@jaadabi.ye',
            phone: '777123456',
            city: 'صنعاء',
            role: 'admin',
          };
          onLoginSuccess(adminUser, 'admin');
        }, 600);
        return;
      } else {
        setLoginError('رمز مرور المدير غير صحيح! رمز الإدارة المعتمد هو: admin7198');
        return;
      }
    }

    // Regular Customer Login
    setIsSubmitting(true);
    setSuccessMessage(`مرحباً بك يا ${identifier}! جاري الانتقال إلى متجر الكوش...`);
    setTimeout(() => {
      const customerUser: AppUser = {
        id: `usr_${Date.now()}`,
        name: identifier,
        phone: identifier.match(/^[0-9+]+$/) ? identifier : '777000000',
        city: 'صنعاء',
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(customerUser, 'client');
    }, 600);
  };

  // Submit Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regName.trim()) {
      setRegError('يرجى إدخال الاسم الكامل (اسم العريس أو العروس أو صاحب الحجز)');
      return;
    }

    if (!regPhone.trim()) {
      setRegError('يرجى إدخال رقم الهاتف اليمني للتواصل');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('كلمة المرور يجب ألا تقل عن 4 خانات');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('كلمتا المرور غير متطابقتين، يرجى إعادة التأكيد');
      return;
    }

    // If registering as Admin, verify the admin master code
    if (regRole === 'admin') {
      if (regAdminCode.trim() !== ADMIN_PASSCODE) {
        setRegError('رمز تحقق الإدارة غير صحيح! لا يمكن التسجيل كمدير بدون الرمز: admin7198');
        return;
      }

      setIsSubmitting(true);
      setSuccessMessage('تم إنشاء حساب إدارة جديد وتفعيله! جاري فتح لوحة الإدارة...');
      setTimeout(() => {
        const adminUser: AppUser = {
          id: `admin_${Date.now()}`,
          name: regName.trim(),
          phone: regPhone.trim(),
          email: regEmail.trim() || 'admin@jaadabi.ye',
          city: regCity,
          role: 'admin',
          createdAt: new Date().toISOString(),
        };
        onLoginSuccess(adminUser, 'admin');
      }, 700);
      return;
    }

    // Normal Customer Registration
    setIsSubmitting(true);
    setSuccessMessage(`أهلاً بك يا ${regName}! تم إنشاء حسابك بنجاح، جاري فتح المعرض...`);
    setTimeout(() => {
      const customerUser: AppUser = {
        id: `cust_${Date.now()}`,
        name: regName.trim(),
        phone: regPhone.trim(),
        email: regEmail.trim(),
        city: regCity,
        role: 'customer',
        createdAt: new Date().toISOString(),
      };
      onLoginSuccess(customerUser, 'client');
    }, 700);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-b from-[#1C2331] via-[#801B2E] to-[#3B0710] text-[#FAF8F5] flex flex-col justify-center items-center p-4 sm:p-6"
      dir="rtl"
    >
      {/* Background radial glow & traditional patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-black/70 pointer-events-none" />
      
      {/* Subtle traditional lattice watermark */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23FFFFFF' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-lg my-auto bg-[#FAF8F5] text-[#29170E] rounded-3xl shadow-2xl border-2 border-[#D4AF37] overflow-hidden animate-in fade-in zoom-in-95 duration-400">
        
        {/* Top Decorative Gold/Burgundy Accent Ribbon */}
        <div className="h-2 w-full bg-gradient-to-r from-[#D4AF37] via-[#801B2E] to-[#D4AF37]" />

        {/* Modal Header */}
        <div className="relative p-6 sm:p-8 pb-4 text-center border-b border-[#E8DEC8] bg-[#FAF5EB]">
          {/* Close button if modal is opened on-demand */}
          {canClose && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 rounded-xl text-[#7A6A5A] hover:text-[#801B2E] hover:bg-white/80 transition-colors"
              aria-label="إغلاق"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {/* Himyarite Monogram Seal */}
          <div className="relative w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-[#801B2E] via-[#601221] to-[#3B0710] border-2 border-[#D4AF37] shadow-lg flex flex-col items-center justify-center text-[#F9E8B2]">
            <Crown className="w-6 h-6 text-[#F9E8B2] mb-0.5" />
            <span className="text-[10px] font-serif font-bold text-[#D4AF37] tracking-widest">
              𐩱𐩡𐩴𐩲𐩵𐩨𐩺
            </span>
            <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-[#1C2331] border border-[#D4AF37] text-[#D4AF37]">
              <Sparkles className="w-2.5 h-2.5" />
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold font-title text-[#29170E]">
            كوش الجعدبي للأفراح والمناسبات
          </h1>
          <p className="text-xs text-[#7A6A5A] mt-1 font-medium">
            سجّل دخولك أو أنشئ حساباً لإتمام الحجوزات أو إدارة صالات الأعراس
          </p>

          {/* Quick Demo Access Bar */}
          <div className="mt-4 pt-3 border-t border-[#E8DEC8]/70 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] text-[#801B2E] font-bold">تجربة سريعة بلمسة واحدة:</span>
            
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1C2331] text-[#F9E8B2] hover:bg-[#2B354B] border border-[#D4AF37] shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="دخول مباشر كمدير النظام لفتح لوحة التحكم"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>دخول كمدير (لوحة التحكم)</span>
            </button>

            <button
              type="button"
              onClick={handleQuickCustomerLogin}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF0DF] text-[#801B2E] hover:bg-[#F3E2C4] border border-[#D4AF37]/60 shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="دخول مباشر كعريس/زبون لتصفح الكوش والحجز"
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 fill-current" />
              <span>دخول كعريس (شاشة المتجر)</span>
            </button>
          </div>

          {/* Tabs Switcher */}
          <div className="mt-5 grid grid-cols-2 p-1 rounded-2xl bg-[#EFE8DA] border border-[#DDD3BF]">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setLoginError(null);
                setRegError(null);
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                authMode === 'login'
                  ? 'bg-white text-[#801B2E] shadow-sm border border-[#D4AF37]/40'
                  : 'text-[#6A5A4A] hover:text-[#29170E]'
              }`}
            >
              تسجيل الدخول
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setLoginError(null);
                setRegError(null);
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                authMode === 'register'
                  ? 'bg-white text-[#801B2E] shadow-sm border border-[#D4AF37]/40'
                  : 'text-[#6A5A4A] hover:text-[#29170E]'
              }`}
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>

        {/* Modal Body / Forms */}
        <div className="p-6 sm:p-8 pt-6">

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {authMode === 'login' && !successMessage && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Username / Phone / Email */}
              <div>
                <label className="block text-xs font-bold text-[#3A2A1A] mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#801B2E]" />
                  <span>اسم المستخدم أو رقم الهاتف / البريد الإلكتروني</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="مثال: admin (للإدارة) أو رقم هاتفك (77xxxxxxx)"
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#DDD3BF] focus:border-[#801B2E] focus:ring-2 focus:ring-[#801B2E]/20 text-xs sm:text-sm text-[#29170E] placeholder:text-gray-400 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-[11px] text-[#7A6A5A] mt-1">
                  * اكتب <span className="font-mono font-bold text-[#801B2E]">admin</span> لفتح لوحة التحكم، أو اسمك / هاتفك كزبون لفتح المتجر.
                </p>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#3A2A1A] flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#801B2E]" />
                    <span>كلمة المرور / رمز المرور</span>
                  </label>
                  <span className="text-[11px] text-[#801B2E] font-mono">
                    رمز المدير: admin7198
                  </span>
                </div>

                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور أو رمز الإدارة..."
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#DDD3BF] focus:border-[#801B2E] focus:ring-2 focus:ring-[#801B2E]/20 text-xs sm:text-sm text-[#29170E] placeholder:text-gray-400 outline-none transition-all"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#801B2E] transition-colors p-1"
                    title={showLoginPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Login Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#801B2E] via-[#9B2238] to-[#801B2E] hover:brightness-105 shadow-md shadow-[#801B2E]/30 border border-[#D4AF37]/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-[#F9E8B2]" />
                  <span>دخول إلى النظام والمتابعة</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= REGISTER FORM ================= */}
          {authMode === 'register' && !successMessage && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Role Picker (Customer vs Admin) */}
              <div>
                <label className="block text-xs font-bold text-[#3A2A1A] mb-1.5">
                  نوع الحساب المطلوب:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('customer')}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 ${
                      regRole === 'customer'
                        ? 'border-[#801B2E] bg-[#FAF0F2] text-[#801B2E] font-bold shadow-2xs'
                        : 'border-[#DDD3BF] bg-white text-[#6A5A4A] hover:bg-gray-50'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-[#801B2E]" />
                    <div>
                      <div className="text-xs">عريس / زبون</div>
                      <div className="text-[10px] text-gray-500 font-normal">لتصفح وحجز الكوش</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('admin')}
                    className={`p-2.5 rounded-xl border text-right transition-all flex items-center gap-2 ${
                      regRole === 'admin'
                        ? 'border-[#801B2E] bg-[#FAF0F2] text-[#801B2E] font-bold shadow-2xs'
                        : 'border-[#DDD3BF] bg-white text-[#6A5A4A] hover:bg-gray-50'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#801B2E]" />
                    <div>
                      <div className="text-xs">إدارة كوش الجعدبي</div>
                      <div className="text-[10px] text-gray-500 font-normal">يتطلب رمز التحقق</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-[#3A2A1A] mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#801B2E]" />
                  <span>الاسم الكامل</span>
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="مثال: يحيى صالح الجعدبي"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DDD3BF] focus:border-[#801B2E] focus:ring-2 focus:ring-[#801B2E]/20 text-xs sm:text-sm text-[#29170E] outline-none"
                  disabled={isSubmitting}
                />
              </div>

              {/* Phone & City in a responsive 2-column */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3A2A1A] mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#801B2E]" />
                    <span>رقم الهاتف (اليمن)</span>
                  </label>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="77xxxxxxx"
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#DDD3BF] focus:border-[#801B2E] focus:ring-2 focus:ring-[#801B2E]/20 text-xs sm:text-sm text-[#29170E] outline-none text-right"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2A1A] mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#801B2E]" />
                    <span>المحافظة / المدينة</span>
                  </label>
                  <select
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DDD3BF] focus:border-[#801B2E] focus:ring-2 focus:ring-[#801B2E]/20 text-xs sm:text-sm text-[#29170E] outline-none"
                    disabled={isSubmitting}
                  >
                    {YEMENI_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* If Admin role selected, show Admin Passcode verification field */}
              {regRole === 'admin' && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300">
                  <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                    <span>رمز تحقق الإدارة المطلوب (admin7198)</span>
                  </label>
                  <input
                    type="password"
                    value={regAdminCode}
                    onChange={(e) => setRegAdminCode(e.target.value)}
                    placeholder="أدخل رمز admin7198 للتأكيد"
                    className="w-full px-3 py-2 rounded-lg bg-white border border-amber-300 text-xs text-[#29170E] outline-none"
                    disabled={isSubmitting}
                  />
                  <p className="text-[10px] text-amber-800 mt-1">
                    * مخصص فقط لفريق عمل وإدارة كوش الجعدبي
                  </p>
                </div>
              )}

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#3A2A1A] mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#801B2E]" />
                    <span>كلمة المرور</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#DDD3BF] focus:border-[#801B2E] text-xs text-[#29170E] outline-none"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#801B2E]"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#3A2A1A] mb-1">
                    تأكيد كلمة المرور
                  </label>
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-[#DDD3BF] focus:border-[#801B2E] text-xs text-[#29170E] outline-none"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Register Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#801B2E] via-[#9B2238] to-[#801B2E] hover:brightness-105 shadow-md shadow-[#801B2E]/30 border border-[#D4AF37]/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F9E8B2]" />
                  <span>
                    {regRole === 'admin' ? 'إنشاء حساب إدارة والدخول للوحة التحكم' : 'إنشاء حساب والانتقال للمتجر'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Continue as Guest Button (User experience enhancement) */}
          <div className="mt-6 pt-4 border-t border-[#E8DEC8] flex flex-col items-center">
            <button
              type="button"
              onClick={onContinueAsGuest}
              disabled={isSubmitting}
              className="text-xs sm:text-sm font-bold text-[#801B2E] hover:text-[#5A101E] flex items-center gap-1.5 transition-colors cursor-pointer group"
            >
              <Store className="w-4 h-4 text-[#C5A059] group-hover:scale-110 transition-transform" />
              <span>أو تصفح كوش الصالات كزائر بدون تسجيل الآن</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>

            <p className="text-[11px] text-[#8A7A6A] mt-2 text-center">
              يمكنك حجز الكوشة أو تسجيل الدخول في أي وقت لاحقاً أثناء التصفح
            </p>
          </div>
        </div>

        {/* Bottom Himyarite Seal */}
        <div className="py-2.5 px-6 bg-[#FAF0DF] border-t border-[#E8DEC8] flex items-center justify-between text-[11px] text-[#6B5A4B]">
          <span className="font-serif">صنعاء • اليمن</span>
          <span className="font-serif font-bold text-[#801B2E]">𐩱𐩡𐩴𐩲𐩵𐩨𐩺 • أصالة ملكية</span>
          <span>خدمة 24/7</span>
        </div>
      </div>
    </div>
  );
};
