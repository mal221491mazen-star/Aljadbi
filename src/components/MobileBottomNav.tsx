import React from 'react';
import { Home, Layers, Search, MessageSquare, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  activeView: 'client' | 'admin';
  onViewChange: (view: 'client' | 'admin') => void;
  onOpenChat: () => void;
  onOpenTracker: () => void;
  onScrollToCatalog: () => void;
  unreadChatCount: number;
  pendingBookingsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeView,
  onViewChange,
  onOpenChat,
  onOpenTracker,
  onScrollToCatalog,
  unreadChatCount,
  pendingBookingsCount,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="التنقل السفلي للهواتف"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-lg border-t border-[#E2D6BE] shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 py-1.5"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-around text-center">
        {/* 1. Home / Explore */}
        <button
          onClick={() => {
            onViewChange('client');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[46px] ${
            activeView === 'client'
              ? 'text-[#801B2E] font-bold'
              : 'text-[#6B5A4B] hover:text-[#29170E]'
          }`}
        >
          <div className="relative">
            <Home className="w-5 h-5" />
            {activeView === 'client' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#801B2E] rounded-full"></span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">الرئيسية</span>
        </button>

        {/* 2. Catalog / Koshas */}
        <button
          onClick={() => {
            onViewChange('client');
            onScrollToCatalog();
          }}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[#6B5A4B] hover:text-[#29170E] transition-all min-h-[46px]"
        >
          <Layers className="w-5 h-5 text-[#C5A059]" />
          <span className="text-[10px] mt-0.5 leading-tight">الكوش</span>
        </button>

        {/* 3. Track Booking */}
        <button
          onClick={onOpenTracker}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-[#6B5A4B] hover:text-[#29170E] transition-all min-h-[46px]"
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 leading-tight">تتبع الحجز</span>
        </button>

        {/* 4. Live Chat */}
        <button
          onClick={onOpenChat}
          className="relative flex flex-col items-center justify-center py-1 rounded-xl text-[#6B5A4B] hover:text-[#29170E] transition-all min-h-[46px]"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-[#801B2E]" />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-emerald-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold animate-pulse">
                {unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">المحادثة</span>
        </button>

        {/* 5. Owner / Admin Dashboard Toggle */}
        <button
          onClick={() => onViewChange(activeView === 'admin' ? 'client' : 'admin')}
          className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-all min-h-[46px] ${
            activeView === 'admin'
              ? 'text-[#801B2E] font-bold bg-[#FAF0F2] border border-[#801B2E]/20'
              : 'text-[#6B5A4B] hover:text-[#29170E]'
          }`}
        >
          <div className="relative">
            <ShieldCheck className={`w-5 h-5 ${activeView === 'admin' ? 'text-[#801B2E]' : ''}`} />
            {pendingBookingsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-amber-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                {pendingBookingsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 leading-tight">
            {activeView === 'admin' ? 'المتجر' : 'الإدارة'}
          </span>
        </button>
      </div>
    </nav>
  );
};
