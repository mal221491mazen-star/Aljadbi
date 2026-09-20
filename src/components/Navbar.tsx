import React, { useState } from 'react';
import { HimyariteLogo } from './HimyariteLogo';
import { 
  Sparkles, 
  MessageSquare, 
  Search, 
  ShieldCheck, 
  PhoneCall, 
  Menu, 
  X, 
  CalendarClock,
  Heart,
  Store
} from 'lucide-react';

interface NavbarProps {
  activeView: 'client' | 'admin';
  onViewChange: (view: 'client' | 'admin') => void;
  onOpenChat: () => void;
  onOpenTracker: () => void;
  onSelectCategory: (cat: string) => void;
  unreadChatCount: number;
  pendingBookingsCount: number;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onViewChange,
  onOpenChat,
  onOpenTracker,
  onSelectCategory,
  unreadChatCount,
  pendingBookingsCount,
  favoritesCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6DEC8] shadow-xs">
      {/* Top Banner with Yemeni Cultural Greetings & Direct Contact */}
      <div className="bg-gradient-to-r from-[#5C1320] via-[#801B2E] to-[#5C1320] text-[#F9E8B2] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="hidden sm:inline font-medium">
              حجوزات موسم الأعراس متاحة الآن في جميع صالات صنعاء والمحافظات اليمنية
            </span>
            <span className="sm:hidden font-medium">
              كوش الأعراس والمناسبات اليمنية الفاخرة
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="hidden md:flex items-center gap-1 text-[#F3E5AB]">
              <CalendarClock className="w-3.5 h-3.5" />
              <span>أوقات المعاينة: 9 ص - 10 م</span>
            </span>
            <a
              href="tel:777123456"
              className="flex items-center gap-1.5 hover:text-white transition-colors bg-[#FAF8F5]/10 px-2.5 py-0.5 rounded-full"
            >
              <PhoneCall className="w-3 h-3" />
              <span dir="ltr">777 123 456</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Brand Logo */}
          <div 
            className="cursor-pointer shrink-0"
            onClick={() => {
              onViewChange('client');
              onSelectCategory('all');
            }}
          >
            <HimyariteLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#F2EDE4]/70 p-1.5 rounded-full border border-[#E2D8C0]">
            <button
              onClick={() => {
                onViewChange('client');
                onSelectCategory('all');
              }}
              className="px-4 py-2 rounded-full text-sm font-medium text-[#3A2A1A] hover:bg-white hover:text-[#801B2E] transition-all shadow-xs"
            >
              الرئيسية
            </button>
            <button
              onClick={() => {
                onViewChange('client');
                onSelectCategory('women');
              }}
              className="px-3.5 py-2 rounded-full text-sm font-medium text-[#5B4636] hover:bg-white hover:text-[#801B2E] transition-all"
            >
              كوش نسائية
            </button>
            <button
              onClick={() => {
                onViewChange('client');
                onSelectCategory('men');
              }}
              className="px-3.5 py-2 rounded-full text-sm font-medium text-[#5B4636] hover:bg-white hover:text-[#801B2E] transition-all"
            >
              كوش ومقائل رجالية
            </button>
            <button
              onClick={() => {
                onViewChange('client');
                onSelectCategory('traditional');
              }}
              className="px-3.5 py-2 rounded-full text-sm font-medium text-[#5B4636] hover:bg-white hover:text-[#801B2E] transition-all"
            >
              تراث يمني وزفات
            </button>
            <button
              onClick={() => {
                onViewChange('client');
                onSelectCategory('royal_vip');
              }}
              className="px-3.5 py-2 rounded-full text-sm font-medium text-[#801B2E] font-semibold hover:bg-white transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              VIP ملكي
            </button>
          </nav>

          {/* Action Buttons & Portal Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Track Booking Button (Desktop/Tablet) */}
            <button
              id="track-booking-btn"
              onClick={onOpenTracker}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl text-[#523A25] bg-[#EFE9DC] hover:bg-[#E5DDCC] border border-[#DDD3BF] transition-all min-h-[44px]"
              title="متابعة حالة حجزك برقم الحجز"
            >
              <Search className="w-3.5 h-3.5 text-[#801B2E]" />
              <span>تتبع الحجز</span>
            </button>

            {/* Live Chat with Owner Button */}
            <button
              id="open-chat-btn"
              onClick={onOpenChat}
              className="relative flex items-center gap-1.5 px-2.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-[#801B2E] to-[#A3233B] hover:brightness-105 shadow-sm transition-all min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden md:inline">محادثة المؤجر</span>
              <span className="hidden xs:inline md:hidden">محادثة</span>
              {unreadChatCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold animate-bounce shadow-xs">
                  {unreadChatCount}
                </span>
              )}
            </button>

            {/* Admin / Client Switcher Badge */}
            <button
              id="admin-toggle-btn"
              onClick={() => onViewChange(activeView === 'admin' ? 'client' : 'admin')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-xs font-semibold rounded-xl transition-all border min-h-[44px] ${
                activeView === 'admin'
                  ? 'bg-[#1C2331] text-[#E5C158] border-[#E5C158]/50 shadow-md'
                  : 'bg-white text-[#523A25] border-[#D4AF37]/50 hover:bg-[#FAF5EC]'
              }`}
              title="التبديل بين واجهة الزبائن ولوحة تحكم إدارة الكوش والحجوزات"
            >
              {activeView === 'admin' ? (
                <>
                  <Store className="w-4 h-4 text-[#E5C158]" />
                  <span className="hidden xs:inline">لوحة الإدارة</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#801B2E]" />
                  <span className="hidden sm:inline">لوحة الإدارة</span>
                  <span className="hidden xs:inline sm:hidden">الإدارة</span>
                  {pendingBookingsCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {pendingBookingsCount}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#523A25] hover:bg-[#EFE9DC] active:bg-[#E2D8C0] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E6DEC8] flex flex-col gap-2 bg-[#FAF8F5]">
            <button
              onClick={() => {
                onViewChange('client');
                onSelectCategory('all');
                setMobileMenuOpen(false);
              }}
              className="text-right px-4 py-2 text-sm font-medium text-[#3A2A1A] hover:bg-[#EFE9DC] rounded-lg"
            >
              جميع الكوش
            </button>
            <button
              onClick={() => {
                onViewChange('client');
                onSelectCategory('women');
                setMobileMenuOpen(false);
              }}
              className="text-right px-4 py-2 text-sm font-medium text-[#5B4636] hover:bg-[#EFE9DC] rounded-lg"
            >
              كوش الأعراس النسائية الملكية
            </button>
            <button
              onClick={() => {
                onViewChange('client');
                onSelectCategory('men');
                setMobileMenuOpen(false);
              }}
              className="text-right px-4 py-2 text-sm font-medium text-[#5B4636] hover:bg-[#EFE9DC] rounded-lg"
            >
              كوش ومجالس الأعراس الرجالية
            </button>
            <button
              onClick={() => {
                onViewChange('client');
                onSelectCategory('traditional');
                setMobileMenuOpen(false);
              }}
              className="text-right px-4 py-2 text-sm font-medium text-[#5B4636] hover:bg-[#EFE9DC] rounded-lg"
            >
              كوش التراث اليمني والزفات الصنعانية
            </button>
            <button
              onClick={() => {
                onViewChange('client');
                onSelectCategory('royal_vip');
                setMobileMenuOpen(false);
              }}
              className="text-right px-4 py-2 text-sm font-semibold text-[#801B2E] hover:bg-[#EFE9DC] rounded-lg flex items-center justify-between"
            >
              <span>كوش كبار الشخصيات VIP</span>
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
            </button>

            <div className="pt-2 border-t border-[#E6DEC8] flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenTracker();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-right px-4 py-2.5 text-sm font-medium bg-[#EFE9DC] text-[#523A25] rounded-lg flex items-center justify-between"
              >
                <span>متابعة حالة حجز سابق</span>
                <Search className="w-4 h-4 text-[#801B2E]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
