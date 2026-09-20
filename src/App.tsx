import React, { useState, useEffect } from 'react';
import { 
  Kosha, 
  BookingRequest, 
  ChatMessage, 
  KoshaCategory, 
  HallSize, 
  CustomizationSelections,
  BookingStatus
} from './types';
import { 
  INITIAL_KOSHAS, 
  INITIAL_BOOKINGS, 
  INITIAL_CHAT_MESSAGES, 
  REVIEWS_LIST 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { KoshaFilters } from './components/KoshaFilters';
import { KoshaCard } from './components/KoshaCard';
import { KoshaDetailModal } from './components/KoshaDetailModal';
import { BookingModal } from './components/BookingModal';
import { ChatDrawer } from './components/ChatDrawer';
import { BookingTrackerModal } from './components/BookingTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { HallsSection } from './components/HallsSection';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  Star, 
  Sparkles, 
  Crown, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  PhoneCall,
  Heart
} from 'lucide-react';

export default function App() {
  // PERSISTENT DATA STATES
  const [koshas, setKoshas] = useState<Kosha[]>(() => {
    try {
      const saved = localStorage.getItem('jaadabi_koshas');
      return saved ? JSON.parse(saved) : INITIAL_KOSHAS;
    } catch {
      return INITIAL_KOSHAS;
    }
  });

  const [bookings, setBookings] = useState<BookingRequest[]>(() => {
    try {
      const saved = localStorage.getItem('jaadabi_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('jaadabi_chat_messages');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('jaadabi_koshas', JSON.stringify(koshas));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [koshas]);

  useEffect(() => {
    try {
      localStorage.setItem('jaadabi_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('jaadabi_chat_messages', JSON.stringify(chatMessages));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [chatMessages]);

  // NAVIGATION & VIEW STATES
  const [activeView, setActiveView] = useState<'client' | 'admin'>('client');
  const [category, setCategory] = useState<KoshaCategory>('all');
  const [hallSize, setHallSize] = useState<HallSize>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'rating'>('popular');
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  // MODALS & DRAWERS
  const [selectedKoshaForDetail, setSelectedKoshaForDetail] = useState<Kosha | null>(null);
  const [selectedKoshaForBooking, setSelectedKoshaForBooking] = useState<Kosha | null>(null);
  const [activeCustomization, setActiveCustomization] = useState<CustomizationSelections | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  
  // Chat context attachment
  const [chatAttachedKosha, setChatAttachedKosha] = useState<Kosha | null>(null);
  const [chatAttachedBookingCode, setChatAttachedBookingCode] = useState<string>('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // HANDLERS
  const handleOpenDetail = (kosha: Kosha) => {
    setSelectedKoshaForDetail(kosha);
  };

  const handleStartBooking = (kosha: Kosha, customOptions?: CustomizationSelections) => {
    setSelectedKoshaForBooking(kosha);
    if (customOptions) {
      setActiveCustomization(customOptions);
    }
  };

  const handleConfirmNewBooking = (newBooking: BookingRequest) => {
    setBookings((prev) => [newBooking, ...prev]);
    showToast(`تم إرسال طلب الحجز بنجاح! رقم الحجز: ${newBooking.bookingCode}`);
  };

  const handleOpenChatWithBooking = (bookingCode: string, koshaName: string) => {
    setChatAttachedBookingCode(bookingCode);
    const foundKosha = koshas.find((k) => k.name === koshaName) || null;
    setChatAttachedKosha(foundKosha);
    setIsChatOpen(true);
  };

  const handleInquireKosha = (kosha: Kosha, defaultText?: string) => {
    setChatAttachedKosha(kosha);
    setIsChatOpen(true);
    if (defaultText) {
      handleSendMessage(defaultText, kosha.id);
    }
  };

  const handleSendMessage = (text: string, relatedKoshaId?: string, relatedBookingCode?: string) => {
    const timeStr = new Date().toLocaleTimeString('ar-YE', { hour: 'numeric', minute: '2-digit' });
    const relatedKosha = koshas.find((k) => k.id === relatedKoshaId);

    const newCustomerMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'customer',
      senderName: 'الزبون',
      text,
      timestamp: timeStr,
      relatedKoshaId,
      relatedKoshaName: relatedKosha?.name,
      relatedBookingCode,
    };

    setChatMessages((prev) => [...prev, newCustomerMsg]);

    // Simulated Owner Auto-Response for excellent realistic UX
    setTimeout(() => {
      const ownerReplies = [
        'مرحباً بك، نسعد بتواصلك. كوش الأعراس لدينا مجهزة بأفضل الديكورات ونضمن لك التجهيز المبكر بالصالة والتنسيق مع إدارة القاعة بدقة.',
        'أهلاً بك أخي الكريم ومبارك مقدماً. طلبك متاح وفريق التركيب جاهز. هل ترغب بتثبيت الموعد بدفع العربون عبر الكريمي أو النجم؟',
        'وعليكم السلام، نعم بالطبع يمكننا تعديل ألوان الورود والإضاءة بما يتناسب مع رغبتك ورغبة العروس تماماً.',
      ];
      const randomReply = ownerReplies[Math.floor(Math.random() * ownerReplies.length)];

      const autoOwnerMsg: ChatMessage = {
        id: `msg_resp_${Date.now()}`,
        sender: 'owner',
        senderName: 'إدارة كوش الجعدبي',
        text: randomReply,
        timestamp: new Date().toLocaleTimeString('ar-YE', { hour: 'numeric', minute: '2-digit' }),
        relatedKoshaId,
        relatedKoshaName: relatedKosha?.name,
        relatedBookingCode,
      };

      setChatMessages((prev) => [...prev, autoOwnerMsg]);
    }, 1800);
  };

  // ADMIN HANDLERS
  const handleUpdateBookingStatus = (bookingId: string, newStatus: BookingStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    showToast('تم تحديث حالة الحجز بنجاح');
  };

  const handleToggleKoshaAvailability = (koshaId: string) => {
    setKoshas((prev) =>
      prev.map((k) => (k.id === koshaId ? { ...k, isAvailable: !k.isAvailable } : k))
    );
    showToast('تم تحديث حالة توافر الكوشة');
  };

  const handleUpdateKoshaPrice = (koshaId: string, newPriceYER: number) => {
    setKoshas((prev) =>
      prev.map((k) =>
        k.id === koshaId
          ? { ...k, priceYER: newPriceYER, priceUSD: Math.round(newPriceYER / 540) }
          : k
      )
    );
    showToast('تم تحديث السعر بنجاح');
  };

  const handleAddNewKosha = (newKosha: Kosha) => {
    setKoshas((prev) => [newKosha, ...prev]);
    showToast('تمت إضافة الكوشة الجديدة إلى المعرض بنجاح');
  };

  const handleOwnerReplyMessage = (text: string, relatedBookingCode?: string) => {
    const newOwnerMsg: ChatMessage = {
      id: `msg_owner_${Date.now()}`,
      sender: 'owner',
      senderName: 'إدارة كوش الجعدبي (المؤجر)',
      text,
      timestamp: new Date().toLocaleTimeString('ar-YE', { hour: 'numeric', minute: '2-digit' }),
      relatedBookingCode,
    };
    setChatMessages((prev) => [...prev, newOwnerMsg]);
    showToast('تم إرسال رد المؤجر للزبون');
  };

  // FILTER & SORT LOGIC
  const filteredKoshas = koshas
    .filter((k) => {
      const matchCat = category === 'all' || k.category === category;
      const matchSize = hallSize === 'all' || k.hallSize === hallSize;
      const matchAvail = !availableOnly || k.isAvailable;
      const matchSearch =
        !searchQuery ||
        k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.hallCompatibility.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase())) ||
        k.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSize && matchAvail && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceYER - b.priceYER;
      if (sortBy === 'price_desc') return b.priceYER - a.priceYER;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
    });

  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E2022] font-cairo pb-16 lg:pb-0">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-[#1C2331] text-[#F9E8B2] px-4 py-3 rounded-2xl border border-[#D4AF37] shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onSelectCategory={(cat) => {
          setCategory(cat as KoshaCategory);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        unreadChatCount={0}
        pendingBookingsCount={pendingBookingsCount}
        favoritesCount={0}
      />

      {/* RENDER VIEW: ADMIN VS CLIENT */}
      {activeView === 'admin' ? (
        <AdminDashboard
          koshas={koshas}
          bookings={bookings}
          chatMessages={chatMessages}
          onUpdateBookingStatus={handleUpdateBookingStatus}
          onToggleKoshaAvailability={handleToggleKoshaAvailability}
          onUpdateKoshaPrice={handleUpdateKoshaPrice}
          onAddNewKosha={handleAddNewKosha}
          onOwnerReplyMessage={handleOwnerReplyMessage}
          onCloseAdmin={() => setActiveView('client')}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Section */}
          <HeroSection
            onSearch={({ category: cat, city }) => {
              if (cat) setCategory(cat);
              if (city) setSearchQuery(city);
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onExploreClick={() => {
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Main Catalog & Filter Section */}
          <section id="catalog-section" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#801B2E] mb-1.5">
                  <Crown className="w-4 h-4 text-[#C5A059]" />
                  <span>معرض كوش الأعراس</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-title text-[#29170E]">
                  تشكيلة كوش الصالات الفاخرة لعام 2026
                </h2>
                <p className="text-xs sm:text-sm text-[#6B5A4B] mt-1">
                  اختر الكوشة المناسبة لمساحة صالتك، وقم بتخصيص الألوان والإضاءة بلمسة زر
                </p>
              </div>

              {/* Quick direct chat trigger button */}
              <button
                onClick={() => setIsChatOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#FAF0DF] text-[#801B2E] hover:bg-[#F5E6CC] border border-[#D4AF37]/50 transition-colors shadow-2xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>استفسار مباشر عن توفر تاريخ محدد</span>
              </button>
            </div>

            {/* Filter Component */}
            <KoshaFilters
              category={category}
              onCategoryChange={setCategory}
              hallSize={hallSize}
              onHallSizeChange={setHallSize}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortByChange={setSortBy}
              availableOnly={availableOnly}
              onAvailableOnlyChange={setAvailableOnly}
              totalResultsCount={filteredKoshas.length}
            />

            {/* Koshas Grid */}
            {filteredKoshas.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E6DEC8] p-12 text-center max-w-md mx-auto my-8">
                <Crown className="w-12 h-12 text-[#DDD3BF] mx-auto mb-3" />
                <h3 className="text-base font-bold text-[#29170E] mb-1">
                  لم يتم العثور على كوش تطابق هذه الفلاتر
                </h3>
                <p className="text-xs text-[#7A6A5A] mb-4">
                  جرب تغيير التصنيف أو مسح كلمات البحث للاطلاع على كافة الموديلات المتاحة.
                </p>
                <button
                  onClick={() => {
                    setCategory('all');
                    setHallSize('all');
                    setSearchQuery('');
                    setAvailableOnly(false);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#801B2E] text-white hover:bg-[#681424]"
                >
                  عرض جميع الكوش
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKoshas.map((kosha) => (
                  <KoshaCard
                    key={kosha.id}
                    kosha={kosha}
                    onSelect={handleOpenDetail}
                    onBookNow={(k) => handleStartBooking(k)}
                    onInquire={(k) => handleInquireKosha(k)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Yemeni Wedding Halls Directory Section */}
          <HallsSection
            onSelectHall={(hallName) => {
              setSearchQuery(hallName);
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Testimonials & Reviews Section */}
          <section className="py-14 bg-white border-t border-[#E8DEC8]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E1] border border-[#D4AF37]/40 text-[#801B2E] text-xs font-bold mb-2">
                  <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
                  <span>آراء عرسان الجعدبي</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-title text-[#29170E]">
                  ثقة العائلات اليمنية في صالات الأعراس
                </h2>
                <p className="text-xs sm:text-sm text-[#6B5A4B] mt-1">
                  تجارب حقيقية لعرسان وعوائل احتفلوا بأبهى الليالي مع كوش وفريق عمل الجعدبي
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {REVIEWS_LIST.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#E6DEC8] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-[11px] text-[#8A7A6A]">{rev.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#4B3B2F] leading-relaxed mb-4">
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#E8DEC8] flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[#29170E] block">{rev.author}</strong>
                        <span className="text-[11px] text-[#7A6A5A]">{rev.hall} ({rev.city})</span>
                      </div>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#DDD3BF] font-semibold text-[#801B2E]">
                        {rev.koshaName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* MODALS */}
      {/* 1. Detail & Customization Modal */}
      <KoshaDetailModal
        kosha={selectedKoshaForDetail}
        onClose={() => setSelectedKoshaForDetail(null)}
        onBookNow={(k, customization) => handleStartBooking(k, customization)}
        onInquire={(k, msg) => handleInquireKosha(k, msg)}
      />

      {/* 2. Multi-step Booking Wizard */}
      <BookingModal
        kosha={selectedKoshaForBooking}
        customization={activeCustomization}
        onClose={() => {
          setSelectedKoshaForBooking(null);
          setActiveCustomization(null);
        }}
        onConfirmBooking={handleConfirmNewBooking}
        onOpenChatWithBooking={handleOpenChatWithBooking}
      />

      {/* 3. Booking Status Tracker Modal */}
      <BookingTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
        bookings={bookings}
        onOpenChatWithBooking={handleOpenChatWithBooking}
      />

      {/* 4. Live Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatAttachedKosha(null);
          setChatAttachedBookingCode('');
        }}
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        attachedKosha={chatAttachedKosha}
        attachedBookingCode={chatAttachedBookingCode}
        onClearAttachment={() => {
          setChatAttachedKosha(null);
          setChatAttachedBookingCode('');
        }}
        senderRole={activeView === 'admin' ? 'owner' : 'customer'}
      />

      {/* Global Footer */}
      <Footer
        onOpenChat={() => setIsChatOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onSelectCategory={(cat) => {
          setCategory(cat as KoshaCategory);
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Dedicated Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeView={activeView}
        onViewChange={setActiveView}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onScrollToCatalog={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        unreadChatCount={0}
        pendingBookingsCount={pendingBookingsCount}
      />
    </div>
  );
}
