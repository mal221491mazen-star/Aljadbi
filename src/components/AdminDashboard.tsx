import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Plus, 
  Edit3, 
  Phone, 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  DollarSign, 
  CalendarRange, 
  Filter, 
  Search,
  ChevronDown,
  Sparkles,
  Layers,
  Power,
  Printer,
  ArrowUpDown,
  Copy,
  Check,
  X,
  ExternalLink
} from 'lucide-react';
import { Kosha, BookingRequest, ChatMessage, KoshaCategory, BookingStatus } from '../types';
import { formatPriceYER, formatPriceUSD, formatStatusLabel, getTimeSlotLabel, getPaymentMethodLabel } from '../utils/formatters';
import { printBookingVoucher } from '../utils/voucherPrinter';

interface AdminDashboardProps {
  koshas: Kosha[];
  bookings: BookingRequest[];
  chatMessages: ChatMessage[];
  onUpdateBookingStatus: (bookingId: string, newStatus: BookingStatus) => void;
  onToggleKoshaAvailability: (koshaId: string) => void;
  onUpdateKoshaPrice: (koshaId: string, newPriceYER: number) => void;
  onAddNewKosha: (newKosha: Kosha) => void;
  onOwnerReplyMessage: (text: string, relatedBookingCode?: string) => void;
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  koshas,
  bookings,
  chatMessages,
  onUpdateBookingStatus,
  onToggleKoshaAvailability,
  onUpdateKoshaPrice,
  onAddNewKosha,
  onOwnerReplyMessage,
  onCloseAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'koshas' | 'schedule' | 'messages' | 'settings'>('bookings');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('all');
  const [searchBookingQuery, setSearchBookingQuery] = useState<string>('');
  
  // Add new kosha modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newKoshaName, setNewKoshaName] = useState('');
  const [newKoshaCategory, setNewKoshaCategory] = useState<'women' | 'men' | 'traditional' | 'royal_vip'>('women');
  const [newKoshaPriceYER, setNewKoshaPriceYER] = useState('400000');
  const [newKoshaDepositYER, setNewKoshaDepositYER] = useState('80000');
  const [newKoshaWidth, setNewKoshaWidth] = useState('7.0 متر');
  const [newKoshaHeight, setNewKoshaHeight] = useState('3.8 متر');
  const [newKoshaImage, setNewKoshaImage] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80');
  const [newKoshaDesc, setNewKoshaDesc] = useState('');

  // Quick reply state
  const [replyText, setReplyText] = useState('');

  // Sorting and interaction state for bookings
  const [bookingSortBy, setBookingSortBy] = useState<'newest' | 'event_date' | 'price_desc' | 'price_asc'>('newest');
  const [copiedBookingCode, setCopiedBookingCode] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedBookingCode(code);
    setTimeout(() => setCopiedBookingCode(null), 2000);
  };

  // Calculated KPI stats
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPriceYER, 0);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const inPrepCount = bookings.filter((b) => b.status === 'in_preparation').length;
  const completedCount = bookings.filter((b) => b.status === 'completed').length;

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = bookingFilterStatus === 'all' || b.status === bookingFilterStatus;
    const matchesSearch =
      !searchBookingQuery ||
      b.bookingCode.toLowerCase().includes(searchBookingQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchBookingQuery.toLowerCase()) ||
      b.customerPhone.includes(searchBookingQuery) ||
      b.hallName.toLowerCase().includes(searchBookingQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (bookingSortBy === 'event_date') {
      return a.eventDate.localeCompare(b.eventDate);
    }
    if (bookingSortBy === 'price_desc') {
      return b.totalPriceYER - a.totalPriceYER;
    }
    if (bookingSortBy === 'price_asc') {
      return a.totalPriceYER - b.totalPriceYER;
    }
    return b.id.localeCompare(a.id);
  });

  const handleSaveNewKosha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKoshaName.trim()) return;

    const price = parseInt(newKoshaPriceYER) || 350000;
    const deposit = parseInt(newKoshaDepositYER) || 70000;

    const created: Kosha = {
      id: `kosha_${Date.now()}`,
      name: newKoshaName,
      himyariteTag: '𐩱𐩡𐩴𐩲𐩵𐩨𐩺 • طراز حصري جديد',
      category: newKoshaCategory,
      categoryLabel:
        newKoshaCategory === 'women'
          ? 'نسائي ملكي'
          : newKoshaCategory === 'men'
          ? 'رجالي فخم'
          : newKoshaCategory === 'traditional'
          ? 'تراث يمني'
          : 'VIP ملكي',
      hallSize: 'large',
      hallSizeLabel: 'كافة صالات الأعراس',
      priceYER: price,
      priceUSD: Math.round(price / 540),
      depositYER: deposit,
      images: [newKoshaImage],
      dimensions: {
        width: newKoshaWidth,
        height: newKoshaHeight,
        depth: '2.5 متر',
      },
      hallCompatibility: ['صالة الرويشان', 'صالة الفخامة', 'قاعة أفق', 'كافة الصالات'],
      features: [
        'أقواس ورود ملكية منسقة بعناية فائقة',
        'طقم كراسي ملكية مذهبة مع إضاءات ليد',
        'فريق تركيب وإشراف متكامل طوال الحفل',
      ],
      includedEquipment: ['كنبة عرسان فاخرة', 'طاولات ضيافة', 'إضاءات سبوت لايت'],
      description: newKoshaDesc || 'كوشة فاخرة صُممت خصيصاً لتناسب صالات الأعراس بأبهى حلة وجودة عالية.',
      themeColors: [
        { name: 'ذهبي', hex: '#D4AF37' },
        { name: 'أبيض', hex: '#FFFFFF' },
      ],
      flowerColorOptions: ['أبيض ثلجي', 'وردي باودر', 'عنابي وذهبي'],
      seatingOptions: ['كنب ملكي متصل', 'كرسيين منفصلين مذهبين'],
      lightingModes: ['إضاءة دافئة', 'إضاءة ساطعة'],
      isAvailable: true,
      rating: 5.0,
      reviewsCount: 1,
      isPopular: true,
      isFeatured: true,
      createdAt: new Date().toISOString().substring(0, 10),
    };

    onAddNewKosha(created);
    setIsAddModalOpen(false);
    setNewKoshaName('');
    setNewKoshaDesc('');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-16" id="admin-dashboard-container">
      {/* Top Admin Navigation Header */}
      <div className="bg-[#1C2331] text-white border-b border-[#2E384D] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#801B2E] text-[#F9E8B2] flex items-center justify-center font-serif font-bold text-base sm:text-lg border border-[#D4AF37] shrink-0">
                𐩴𐩵
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-xs sm:text-base font-bold font-title text-[#F9E8B2] truncate">
                    إدارة كوش الجعدبي
                  </h1>
                  <span className="hidden xs:inline-block px-2 py-0.5 rounded-md text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    بوابة المؤجر
                  </span>
                </div>
                <p className="hidden md:block text-[11px] text-gray-300">التحكم بالطلبات، الكوش، المواعيد، والتواصل مع الزبائن</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold bg-[#801B2E] text-white hover:bg-[#9E2239] transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">إضافة كوشة</span>
                <span className="sm:hidden">إضافة</span>
              </button>

              <button
                onClick={onCloseAdmin}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-gray-200 transition-colors border border-white/10"
              >
                <Power className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">العودة للمتجر</span>
                <span className="sm:hidden">خروج</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* KPI Dashboard Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#7A6A5A]">إجمالي الإيرادات المقدرة</span>
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-title text-[#29170E]">
              {formatPriceYER(totalRevenue)}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">حجوزات نشطة ومؤكدة</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#7A6A5A]">طلبات جديدة معلقة</span>
              <span className="p-2 rounded-lg bg-amber-50 text-amber-700">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-title text-amber-700">
              {pendingCount} طلبات
            </div>
            <span className="text-[11px] text-amber-600 font-medium">تحتاج تأكيد العربون والرد</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#7A6A5A]">حجوزات قيد التجهيز للصالات</span>
              <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
                <Building2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-title text-blue-700">
              {inPrepCount} مناسبات
            </div>
            <span className="text-[11px] text-blue-600 font-medium">جاهزة للتركيب الميداني</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-[#E2D6BE] shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#7A6A5A]">إجمالي كوش المعرض</span>
              <span className="p-2 rounded-lg bg-purple-50 text-purple-700">
                <Package className="w-4 h-4" />
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-title text-[#29170E]">
              {koshas.length} كوشة
            </div>
            <span className="text-[11px] text-purple-600 font-medium">جاهزة للتأجير الرقمي</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl border border-[#E6DEC8] p-1.5 mb-6 flex items-center gap-1 overflow-x-auto no-scrollbar shadow-xs">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'bookings'
                ? 'bg-[#801B2E] text-white shadow-xs'
                : 'text-[#5B4636] hover:bg-[#FAF8F5]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>إدارة طلبات الحجز ({bookings.length})</span>
            {pendingCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-[#29170E] text-[10px] flex items-center justify-center font-bold">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('koshas')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'koshas'
                ? 'bg-[#801B2E] text-white shadow-xs'
                : 'text-[#5B4636] hover:bg-[#FAF8F5]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>إدارة الكوش والأسعار ({koshas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'schedule'
                ? 'bg-[#801B2E] text-white shadow-xs'
                : 'text-[#5B4636] hover:bg-[#FAF8F5]'
            }`}
          >
            <CalendarRange className="w-4 h-4" />
            <span>جدول المواعيد والصالات</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === 'messages'
                ? 'bg-[#801B2E] text-white shadow-xs'
                : 'text-[#5B4636] hover:bg-[#FAF8F5]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>محادثات الزبائن ({chatMessages.length})</span>
          </button>
        </div>

        {/* TAB 1: BOOKINGS MANAGEMENT */}
        {activeTab === 'bookings' && (
          <div className="space-y-4" id="admin-bookings-tab-content">
            {/* Control & Organization Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-3.5">
              {/* Top Row: Status Filters */}
              <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#F0E9DC]">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full sm:w-auto">
                  <button
                    onClick={() => setBookingFilterStatus('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      bookingFilterStatus === 'all'
                        ? 'bg-[#801B2E] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-[#5B4636] hover:bg-[#F2EDE4] border border-[#E6DEC8]'
                    }`}
                  >
                    <span>الكل</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-black/10 text-[10px]">
                      {bookings.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setBookingFilterStatus('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      bookingFilterStatus === 'pending'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>قيد المراجعة</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-700/20 text-[10px]">
                      {pendingCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setBookingFilterStatus('confirmed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      bookingFilterStatus === 'confirmed'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>مؤكدة</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-emerald-700/20 text-[10px]">
                      {confirmedCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setBookingFilterStatus('in_preparation')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      bookingFilterStatus === 'in_preparation'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>جاري التجهيز</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-blue-700/20 text-[10px]">
                      {inPrepCount}
                    </span>
                  </button>

                  <button
                    onClick={() => setBookingFilterStatus('completed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      bookingFilterStatus === 'completed'
                        ? 'bg-slate-700 text-white shadow-xs'
                        : 'bg-slate-50 text-slate-800 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>مكتملة</span>
                    <span className="px-1.5 py-0.2 rounded-md bg-slate-700/20 text-[10px]">
                      {completedCount}
                    </span>
                  </button>
                </div>

                <div className="text-xs text-[#7A6A5A] hidden md:block">
                  إجمالي المبالغ: <strong className="text-[#801B2E]">{formatPriceYER(sortedBookings.reduce((sum, b) => sum + b.totalPriceYER, 0))}</strong>
                </div>
              </div>

              {/* Second Row: Search & Sort Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                {/* Search Input */}
                <div className="w-full sm:flex-1 relative">
                  <input
                    type="text"
                    value={searchBookingQuery}
                    onChange={(e) => setSearchBookingQuery(e.target.value)}
                    placeholder="بحث برقم الحجز، اسم العريس، الصالة، أو رقم الهاتف..."
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl pr-9 pl-8 py-2 text-xs sm:text-sm text-[#29170E] focus:outline-hidden focus:border-[#801B2E] focus:ring-1 focus:ring-[#801B2E]/20 transition-all placeholder:text-[#9A8A7A]"
                  />
                  <Search className="w-4 h-4 text-[#8A7A6A] absolute right-3 top-1/2 -translate-y-1/2" />
                  {searchBookingQuery && (
                    <button
                      onClick={() => setSearchBookingQuery('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8A7A6A] hover:text-[#29170E] p-1 rounded-full hover:bg-gray-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Sort dropdown */}
                <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-2 bg-[#FAF8F5] p-1 rounded-xl border border-[#DDD3BF]">
                  <span className="text-[11px] text-[#7A6A5A] flex items-center gap-1 pr-2 font-medium shrink-0">
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#801B2E]" />
                    <span>ترتيب بحسب:</span>
                  </span>

                  <select
                    value={bookingSortBy}
                    onChange={(e) => setBookingSortBy(e.target.value as any)}
                    className="bg-white border border-[#E6DEC8] rounded-lg px-2.5 py-1 text-xs font-semibold text-[#29170E] focus:outline-hidden focus:border-[#801B2E] cursor-pointer"
                  >
                    <option value="newest">⏱️ الأحدث تسجيلاً</option>
                    <option value="event_date">📅 موعد المناسبة الأقرب</option>
                    <option value="price_desc">💰 الأعلى سعراً</option>
                    <option value="price_asc">🏷️ الأقل سعراً</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Status Sub-bar */}
            <div className="flex items-center justify-between text-xs px-2 text-[#7A6A5A]">
              <span>
                عرض <strong>{sortedBookings.length}</strong> من إجمالي <strong>{bookings.length}</strong> طلبات حجز
              </span>
              {bookingFilterStatus !== 'all' && (
                <button
                  onClick={() => setBookingFilterStatus('all')}
                  className="text-[#801B2E] hover:underline font-bold"
                >
                  إلغاء التصفية وعرض الكل
                </button>
              )}
            </div>

            {/* Bookings Cards List */}
            <div className="space-y-4">
              {sortedBookings.length === 0 ? (
                <div className="bg-white p-10 rounded-2xl border border-[#E6DEC8] text-center shadow-xs">
                  <Package className="w-12 h-12 text-[#DDD3BF] mx-auto mb-3" />
                  <h3 className="text-sm sm:text-base font-bold text-[#5B4636]">
                    لا توجد طلبات حجز تطابق هذا البحث أو التصنيف
                  </h3>
                  <p className="text-xs text-[#8A7A6A] mt-1 max-w-sm mx-auto">
                    جرب تغيير خيارات التصفية أو مسح عبارة البحث لرؤية كافة الحجوزات المسجلة.
                  </p>
                  {(bookingFilterStatus !== 'all' || searchBookingQuery) && (
                    <button
                      onClick={() => {
                        setBookingFilterStatus('all');
                        setSearchBookingQuery('');
                      }}
                      className="mt-3.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#801B2E] text-white hover:bg-[#681424] transition-colors"
                    >
                      إعادة ضبط البحث
                    </button>
                  )}
                </div>
              ) : (
                sortedBookings.map((b) => {
                  const st = formatStatusLabel(b.status);
                  const isCopied = copiedBookingCode === b.bookingCode;
                  const remainingAmount = Math.max(0, b.totalPriceYER - b.depositAmountYER);

                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-[#E6DEC8] hover:border-[#D4AF37] transition-all shadow-xs overflow-hidden flex flex-col"
                    >
                      {/* 1. Header Strip */}
                      <div className="bg-[#FAF8F5] px-4 py-3 border-b border-[#F0E9DC] flex flex-wrap items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#DDD3BF] shadow-2xs">
                            <span className="text-[10.5px] text-[#7A6A5A]">رقم الحجز:</span>
                            <strong className="text-xs sm:text-sm font-mono font-bold text-[#801B2E] tracking-wider" dir="ltr">
                              {b.bookingCode}
                            </strong>
                            <button
                              onClick={() => handleCopyCode(b.bookingCode)}
                              className="text-[#8A7A6A] hover:text-[#801B2E] p-0.5"
                              title="نسخ رقم الحجز"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <span className="text-[11px] text-[#8A7A6A] hidden sm:inline">
                            تسجيل: {b.createdAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${st.color} ${st.bg} ${st.border}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            <span>{st.label}</span>
                          </span>

                          <span className="text-[11px] bg-white px-2 py-0.5 rounded-md border border-[#DDD3BF] text-[#5B4636] font-medium">
                            {getTimeSlotLabel(b.timeSlot)}
                          </span>
                        </div>
                      </div>

                      {/* 2. Structured Middle Body */}
                      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4">
                        {/* Kosha Image & Basic info (col 1-4) */}
                        <div className="lg:col-span-4 flex items-start gap-3.5">
                          <img
                            src={b.koshaImage}
                            alt={b.koshaName}
                            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-[#DDD3BF] shrink-0 shadow-2xs"
                          />
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#C5A059] font-serif block">
                              𐩱𐩡𐩴𐩲𐩵𐩨𐩺 • كوشة معتمدة
                            </span>
                            <h3 className="text-sm sm:text-base font-bold font-title text-[#29170E] leading-snug">
                              {b.koshaName}
                            </h3>
                            <div className="text-xs text-[#801B2E] font-medium flex items-center gap-1">
                              <Building2 className="w-3.5 h-3.5 shrink-0" />
                              <span>{b.hallName} ({b.customerCity})</span>
                            </div>
                            <div className="text-xs text-[#5B4636] flex items-center gap-1 font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                              <span>{b.eventDate}</span>
                            </div>
                          </div>
                        </div>

                        {/* Customer & Customization Details (col 5-8) */}
                        <div className="lg:col-span-5 space-y-2 border-t lg:border-t-0 lg:border-r border-[#F0E9DC] pt-3 lg:pt-0 lg:pr-4">
                          {/* Customer */}
                          <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                            <div>
                              <span className="text-[#8A7A6A] text-[11px] block">صاحب الحجز:</span>
                              <strong className="text-[#29170E] text-sm">{b.customerName}</strong>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <a
                                href={`tel:${b.customerPhone}`}
                                className="px-2 py-1 rounded-lg bg-[#FAF8F5] hover:bg-[#F2EDE4] text-[#801B2E] font-bold text-xs border border-[#DDD3BF] flex items-center gap-1"
                                dir="ltr"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{b.customerPhone}</span>
                              </a>

                              <a
                                href={`https://wa.me/${b.customerWhatsapp ? b.customerWhatsapp.replace(/\+/g, '') : b.customerPhone.replace(/\+/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] border border-emerald-200 flex items-center gap-1"
                                title="تواصل عبر الواتساب"
                              >
                                <span>واتساب</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          {/* Customizations summary */}
                          {b.customization && (
                            <div className="bg-[#FAF5EB] p-2.5 rounded-xl border border-[#E8DEC8] text-[11px] text-[#5C4533] space-y-0.5">
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 font-medium">
                                <span>ورد: <strong>{b.customization.flowerColor}</strong></span>
                                <span>جلسة: <strong>{b.customization.seatingStyle}</strong></span>
                                <span>إضاءة: <strong>{b.customization.lightingMode}</strong></span>
                              </div>
                              {b.customization.customAcrylicNames?.enabled && (
                                <div className="text-[#801B2E] font-bold truncate">
                                  أسماء إكريليك: {b.customization.customAcrylicNames.groomName} & {b.customization.customAcrylicNames.brideName}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Notes if present */}
                          {b.notes && (
                            <div className="text-[11px] text-[#6B5A4B] bg-[#FAF8F5] p-2 rounded-lg border border-[#EDE4D2]">
                              <span className="font-semibold text-[#801B2E]">ملاحظات:</span> {b.notes}
                            </div>
                          )}
                        </div>

                        {/* Financial Box (col 9-12) */}
                        <div className="lg:col-span-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DEC8] flex flex-col justify-between">
                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-[#7A6A5A] text-[11px]">الإجمالي:</span>
                              <strong className="text-sm font-bold text-[#801B2E]">
                                {formatPriceYER(b.totalPriceYER)}
                              </strong>
                            </div>

                            <div className="flex items-center justify-between text-emerald-800">
                              <span className="text-[11px]">العربون:</span>
                              <strong className="font-bold">
                                {formatPriceYER(b.depositAmountYER)}
                              </strong>
                            </div>

                            <div className="flex items-center justify-between text-[#8A7A6A] pt-1 border-t border-[#E8DEC8]">
                              <span className="text-[11px]">المتبقي عند التركيب:</span>
                              <strong className="font-bold text-[#29170E]">
                                {formatPriceYER(remainingAmount)}
                              </strong>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-[#E8DEC8] flex items-center justify-between text-[10.5px] text-[#7A6A5A]">
                            <span>طريقة الدفع:</span>
                            <span className="font-medium text-[#29170E]">
                              {getPaymentMethodLabel(b.paymentMethod)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 3. Operational Actions Footer */}
                      <div className="bg-[#FAF8F5]/60 px-4 py-3 border-t border-[#F0E9DC] flex flex-wrap items-center justify-between gap-2.5">
                        {/* Status progression button */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-98 transition-all flex items-center gap-1.5 shadow-2xs"
                              title="تأكيد الحجز بعد استلام العربون"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تأكيد الحجز واستلام العربون</span>
                            </button>
                          )}

                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'in_preparation')}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-98 transition-all flex items-center gap-1.5 shadow-2xs"
                              title="بدء مرحلة التجهيز والقص"
                            >
                              <Building2 className="w-3.5 h-3.5" />
                              <span>بدء التجهيز للتركيب بالصالة</span>
                            </button>
                          )}

                          {b.status === 'in_preparation' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-black active:scale-98 transition-all flex items-center gap-1.5 shadow-2xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>تأكيد اكتمال الحفل بنجاح</span>
                            </button>
                          )}

                          {b.status === 'completed' && (
                            <span className="px-3 py-1 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>تم الحفل بنجاح وأُغلقت الخدمة</span>
                            </span>
                          )}
                        </div>

                        {/* Secondary tools: Print Voucher, Chat, Cancel */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => printBookingVoucher(b)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-[#801B2E] bg-white hover:bg-[#FAF0E1] border border-[#D4AF37]/70 flex items-center gap-1.5 shadow-2xs transition-all"
                            title="طباعة أو تصدير سند رسمي لهذا الحجز بصيغة PDF"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#801B2E]" />
                            <span>طباعة سند الحجز</span>
                          </button>

                          <button
                            onClick={() => {
                              setActiveTab('messages');
                              onOwnerReplyMessage(`بخصوص الحجز رقم ${b.bookingCode} الخاص بكوشة ${b.koshaName}: `, b.bookingCode);
                            }}
                            className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#5B4636] bg-white hover:bg-gray-100 border border-[#DDD3BF] flex items-center gap-1.5 shadow-2xs transition-all"
                            title="فتح محادثة الزبائن بخصوص هذا الحجز"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>محادثة الزبون</span>
                          </button>

                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من إلغاء الحجز رقم ${b.bookingCode}؟`)) {
                                  onUpdateBookingStatus(b.id, 'cancelled');
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
                            >
                              إلغاء الحجز
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* TAB 2: KOSHA INVENTORY & PRICING */}
        {activeTab === 'koshas' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold font-title text-[#29170E]">
                قائمة كوش المعرض والأسعار والتحكم بالتوافر
              </h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#801B2E] text-white hover:bg-[#681424] shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة كوشة جديدة</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {koshas.map((k) => (
                <div
                  key={k.id}
                  className="bg-white rounded-2xl border border-[#E6DEC8] overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10]">
                    <img src={k.images[0]} alt={k.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#801B2E] text-white">
                        {k.categoryLabel}
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded-md">
                      {k.dimensions.width} × {k.dimensions.height}
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-[#29170E] mb-1">{k.name}</h3>
                      <p className="text-[11px] text-[#6B5A4B] line-clamp-2 mb-3">{k.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#F0E9DC] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#7A6A5A]">سعر الإيجار:</span>
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            defaultValue={k.priceYER}
                            onBlur={(e) => {
                              const val = parseInt(e.target.value);
                              if (val && val !== k.priceYER) {
                                onUpdateKoshaPrice(k.id, val);
                              }
                            }}
                            className="w-28 text-right bg-[#FAF8F5] border border-[#DDD3BF] rounded-lg px-2 py-1 text-xs font-bold text-[#801B2E]"
                          />
                          <span className="text-[10px] text-[#7A6A5A]">ر.ي</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs text-[#7A6A5A]">حالة التوافر:</span>
                        <button
                          onClick={() => onToggleKoshaAvailability(k.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            k.isAvailable
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {k.isAvailable ? 'متاحة للزبائن' : 'معطلة مؤقتاً'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SCHEDULE & CONFLICT PREVENTER */}
        {activeTab === 'schedule' && (
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E9DC] pb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold font-title text-[#29170E]">
                  جدول مواعيد صالات الأعراس وتوزيع الكوش
                </h2>
                <p className="text-xs text-[#7A6A5A]">
                  نظام ذكي يمنع تضارب المواعيد لنفس الكوشة في نفس اليوم والفترة
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {bookings.length === 0 ? (
                <p className="text-center text-xs text-[#7A6A5A] py-8">لا توجد مواعيد مسجلة حالياً</p>
              ) : (
                bookings
                  .sort((a, b) => a.eventDate.localeCompare(b.eventDate))
                  .map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8DEC8] flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#801B2E] text-white flex flex-col items-center justify-center text-center shrink-0">
                          <span className="text-[10px] font-medium leading-none">موعد</span>
                          <span className="text-xs font-bold leading-tight mt-0.5">
                            {b.eventDate.split('-')[2] || '15'}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#29170E]">{b.hallName}</span>
                            <span className="text-[10px] bg-[#FAF0DF] text-[#801B2E] px-2 py-0.5 rounded-md font-bold">
                              {b.koshaName}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#7A6A5A] mt-0.5">
                            الزبون: {b.customerName} ({b.customerPhone}) • الفترة: {getTimeSlotLabel(b.timeSlot)}
                          </p>
                        </div>
                      </div>

                      <div className="text-left">
                        <span className="text-xs font-bold text-[#801B2E]" dir="ltr">{b.bookingCode}</span>
                        <span className="block text-[10px] text-emerald-700 font-semibold">مؤكد بالصالة</span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: DIRECT MESSAGES INBOX */}
        {activeTab === 'messages' && (
          <div className="bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs space-y-4">
            <div className="border-b border-[#F0E9DC] pb-3">
              <h2 className="text-sm sm:text-base font-bold font-title text-[#29170E]">
                صندوق رسائل واستفسارات الزبائن المباشرة
              </h2>
              <p className="text-xs text-[#7A6A5A]">
                يمكنك كتابة رد مباشر من هنا وسيصل للزبون فوراً في المحادثة
              </p>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto p-2 bg-[#FAF8F5] rounded-xl border border-[#DDD3BF]">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-xl text-xs ${
                    msg.sender === 'owner'
                      ? 'bg-[#FAF0F2] border border-[#801B2E]/20 text-[#801B2E]'
                      : 'bg-white border border-[#DDD3BF] text-[#29170E]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold">{msg.senderName} ({msg.sender === 'owner' ? 'أنت - المؤجر' : 'الزبون'})</span>
                    <span className="text-[10px] text-[#8A7A6A]">{msg.timestamp}</span>
                  </div>
                  {msg.relatedKoshaName && (
                    <span className="text-[10px] font-semibold text-[#801B2E] block mb-1">
                      الكوشة المستفسر عنها: {msg.relatedKoshaName}
                    </span>
                  )}
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!replyText.trim()) return;
                onOwnerReplyMessage(replyText);
                setReplyText('');
              }}
              className="flex items-center gap-2 pt-2"
            >
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="اكتب ردك للزبون بصفتك صاحب كوش الجعدبي..."
                className="flex-1 bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl px-3.5 py-2.5 text-xs text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#801B2E] text-white font-bold text-xs hover:bg-[#681424] transition-colors"
              >
                إرسال الرد
              </button>
            </form>
          </div>
        )}
      </div>

      {/* ADD NEW KOSHA MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl border border-[#D4AF37]/50 shadow-2xl max-w-xl w-full p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[#F0E9DC] pb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#FAF0DF] text-[#801B2E]">
                  <Plus className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold font-title text-[#29170E]">
                  إضافة كوشة وموديل جديد إلى المعرض
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full text-[#7A6A5A] hover:bg-[#FAF8F5]"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewKosha} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#4B3B2F] mb-1">اسم الكوشة:</label>
                <input
                  type="text"
                  required
                  value={newKoshaName}
                  onChange={(e) => setNewKoshaName(e.target.value)}
                  placeholder="مثال: كوشة عرش مأرب المذهبة"
                  className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl p-2.5 text-[#29170E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#4B3B2F] mb-1">تصنيف الكوشة:</label>
                  <select
                    value={newKoshaCategory}
                    onChange={(e) => setNewKoshaCategory(e.target.value as any)}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl p-2 text-[#29170E]"
                  >
                    <option value="women">كوش نسائية ملكية</option>
                    <option value="men">كوش ومقائل رجالية</option>
                    <option value="traditional">تراث يمني وزفات صنعانية</option>
                    <option value="royal_vip">كوش قصور كبار الشخصيات VIP</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#4B3B2F] mb-1">سعر التأجير (ريال يمني):</label>
                  <input
                    type="number"
                    required
                    value={newKoshaPriceYER}
                    onChange={(e) => setNewKoshaPriceYER(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl p-2 text-[#29170E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#4B3B2F] mb-1">العربون المطلوب:</label>
                  <input
                    type="number"
                    required
                    value={newKoshaDepositYER}
                    onChange={(e) => setNewKoshaDepositYER(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl p-2 text-[#29170E]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4B3B2F] mb-1">عرض الكوشة:</label>
                  <input
                    type="text"
                    value={newKoshaWidth}
                    onChange={(e) => setNewKoshaWidth(e.target.value)}
                    placeholder="مثال: 7.0 متر"
                    className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl p-2 text-[#29170E]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#4B3B2F] mb-1">رابط صورة الكوشة:</label>
                <input
                  type="url"
                  value={newKoshaImage}
                  onChange={(e) => setNewKoshaImage(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl p-2 text-[#29170E]"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block font-medium text-[#4B3B2F] mb-1">الوصف والمميزات:</label>
                <textarea
                  rows={2}
                  value={newKoshaDesc}
                  onChange={(e) => setNewKoshaDesc(e.target.value)}
                  placeholder="وصف رائع للكوشة ونوع الورد والكراسي..."
                  className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl p-2 text-[#29170E]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E9DC]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#5B4636] hover:bg-[#FAF8F5]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#801B2E] text-white hover:bg-[#681424]"
                >
                  حفظ ونشر الكوشة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
