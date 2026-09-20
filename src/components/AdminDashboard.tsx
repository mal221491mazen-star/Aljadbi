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
  Power
} from 'lucide-react';
import { Kosha, BookingRequest, ChatMessage, KoshaCategory, BookingStatus } from '../types';
import { formatPriceYER, formatPriceUSD, formatStatusLabel, getTimeSlotLabel, getPaymentMethodLabel } from '../utils/formatters';

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

  // Calculated KPI stats
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPriceYER, 0);

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const inPrepCount = bookings.filter((b) => b.status === 'in_preparation').length;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#801B2E] text-[#F9E8B2] flex items-center justify-center font-serif font-bold text-lg border border-[#D4AF37]">
                𐩴𐩵
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold font-title text-[#F9E8B2]">
                    لوحة إدارة كوش وأفراح الجعدبي
                  </h1>
                  <span className="px-2 py-0.5 rounded-md text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    بوابة المؤجر
                  </span>
                </div>
                <p className="text-[11px] text-gray-300">التحكم بالطلبات، الكوش، المواعيد، والتواصل مع الزبائن</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#801B2E] text-white hover:bg-[#9E2239] transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">إضافة كوشة جديدة</span>
                <span className="sm:hidden">إضافة</span>
              </button>

              <button
                onClick={onCloseAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-gray-200 transition-colors border border-white/10"
              >
                <Power className="w-3.5 h-3.5 text-rose-400" />
                <span>العودة للمتجر</span>
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
          <div className="space-y-4">
            {/* Filter and search bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
                <button
                  onClick={() => setBookingFilterStatus('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    bookingFilterStatus === 'all'
                      ? 'bg-[#801B2E] text-white'
                      : 'bg-[#FAF8F5] text-[#5B4636] hover:bg-[#F2EDE4]'
                  }`}
                >
                  الكل ({bookings.length})
                </button>
                <button
                  onClick={() => setBookingFilterStatus('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    bookingFilterStatus === 'pending'
                      ? 'bg-amber-600 text-white'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  قيد المراجعة ({pendingCount})
                </button>
                <button
                  onClick={() => setBookingFilterStatus('confirmed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    bookingFilterStatus === 'confirmed'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                >
                  مؤكدة ({confirmedCount})
                </button>
                <button
                  onClick={() => setBookingFilterStatus('in_preparation')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                    bookingFilterStatus === 'in_preparation'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  جاري التجهيز ({inPrepCount})
                </button>
              </div>

              <div className="w-full sm:w-72 relative">
                <input
                  type="text"
                  value={searchBookingQuery}
                  onChange={(e) => setSearchBookingQuery(e.target.value)}
                  placeholder="بحث برقم الحجز، الاسم، الصالة..."
                  className="w-full bg-[#FAF8F5] border border-[#DDD3BF] rounded-xl pr-8 pl-3 py-1.5 text-xs text-[#29170E] focus:outline-hidden focus:border-[#801B2E]"
                />
                <Search className="w-3.5 h-3.5 text-[#8A7A6A] absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Bookings Table / Cards */}
            <div className="space-y-3">
              {filteredBookings.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#E6DEC8] text-center">
                  <Package className="w-10 h-10 text-[#DDD3BF] mx-auto mb-2" />
                  <p className="text-sm font-bold text-[#5B4636]">لا توجد طلبات حجز تطابق هذا التصنيف حالياً</p>
                </div>
              ) : (
                filteredBookings.map((b) => {
                  const st = formatStatusLabel(b.status);
                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-2xl border border-[#E6DEC8] p-4 sm:p-5 shadow-xs hover:border-[#C5A059] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      {/* Left info */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={b.koshaImage}
                          alt={b.koshaName}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#DDD3BF] shrink-0"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-xs text-[#801B2E] bg-[#FAF0F2] px-2 py-0.5 rounded-md border border-[#801B2E]/20" dir="ltr">
                              {b.bookingCode}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${st.color} ${st.bg} ${st.border}`}>
                              {st.label}
                            </span>
                            <span className="text-[11px] text-[#8A7A6A]">
                              تاريخ الطلب: {b.createdAt}
                            </span>
                          </div>

                          <h3 className="text-sm sm:text-base font-bold text-[#29170E]">{b.koshaName}</h3>
                          
                          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#5B4636]">
                            <span className="flex items-center gap-1 font-semibold text-[#801B2E]">
                              <Building2 className="w-3.5 h-3.5" />
                              {b.hallName} ({b.customerCity})
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-[#29170E]">
                              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                              {b.eventDate} ({getTimeSlotLabel(b.timeSlot)})
                            </span>
                          </div>

                          <div className="mt-2 text-xs text-[#6B5A4B] flex flex-wrap items-center gap-2">
                            <span>الزبون: <strong>{b.customerName}</strong></span>
                            <span>•</span>
                            <a
                              href={`tel:${b.customerPhone}`}
                              className="text-[#801B2E] hover:underline font-bold flex items-center gap-1"
                              dir="ltr"
                            >
                              <Phone className="w-3 h-3" />
                              {b.customerPhone}
                            </a>
                            {b.notes && (
                              <span className="bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#DDD3BF] text-[11px] text-[#7A6A5A]">
                                ملاحظة: {b.notes}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right price & status action buttons */}
                      <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#F0E9DC] shrink-0">
                        <div className="text-right lg:text-left">
                          <span className="text-[11px] text-[#7A6A5A] block">الإجمالي المتفق عليه:</span>
                          <span className="text-base sm:text-lg font-bold font-title text-[#801B2E]">
                            {formatPriceYER(b.totalPriceYER)}
                          </span>
                          <span className="text-[11px] text-amber-800 block">
                            العربون: {formatPriceYER(b.depositAmountYER)} ({getPaymentMethodLabel(b.paymentMethod)})
                          </span>
                        </div>

                        {/* Status update buttons */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {b.status === 'pending' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'confirmed')}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 shadow-2xs"
                              title="تأكيد الحجز بعد استلام العربون"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تأكيد الحجز والعربون</span>
                            </button>
                          )}

                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'in_preparation')}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-2xs"
                              title="بدء مرحلة التجهيز والقص"
                            >
                              <Building2 className="w-3.5 h-3.5" />
                              <span>بدء التجهيز للتركيب</span>
                            </button>
                          )}

                          {b.status === 'in_preparation' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تم الحفل بنجاح</span>
                            </button>
                          )}

                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                if (confirm('هل أنت متأكد من إلغاء هذا الحجز؟')) {
                                  onUpdateBookingStatus(b.id, 'cancelled');
                                }
                              }}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
                            >
                              إلغاء
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
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#D4AF37]/50 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95">
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
