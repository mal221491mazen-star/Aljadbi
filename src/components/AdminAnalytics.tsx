import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import { BookingRequest, Kosha } from '../types';
import { formatPriceYER } from '../utils/formatters';
import {
  TrendingUp,
  PieChart as PieIcon,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  DollarSign,
  Building2,
  ArrowUpRight,
  ShieldAlert,
} from 'lucide-react';

interface AdminAnalyticsProps {
  bookings: BookingRequest[];
  koshas: Kosha[];
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ bookings, koshas }) => {
  // 1. Booking Status Distribution for Pie Chart
  const statusStats = useMemo(() => {
    const counts = {
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      in_preparation: bookings.filter((b) => b.status === 'in_preparation').length,
    };

    const pieData = [
      { name: 'مؤكد', value: counts.confirmed, color: '#10B981', labelEn: 'confirmed' },
      { name: 'مكتمل', value: counts.completed, color: '#3B82F6', labelEn: 'completed' },
      { name: 'ملغي', value: counts.cancelled, color: '#EF4444', labelEn: 'cancelled' },
      { name: 'قيد الانتظار', value: counts.pending, color: '#F59E0B', labelEn: 'pending' },
      { name: 'جاري التجهيز', value: counts.in_preparation, color: '#8B5CF6', labelEn: 'in_preparation' },
    ];

    const total = bookings.length || 1;
    const confirmedOrDone = counts.confirmed + counts.completed + counts.in_preparation;
    const confirmationRate = Math.round((confirmedOrDone / total) * 100);
    const cancellationRate = Math.round((counts.cancelled / total) * 100);

    return {
      counts,
      pieData: pieData.filter((d) => d.value > 0),
      rawPieData: pieData,
      total: bookings.length,
      confirmationRate,
      cancellationRate,
    };
  }, [bookings]);

  // 2. Monthly Bookings Statistics for BarChart and AreaChart
  const monthlyData = useMemo(() => {
    const monthNames: Record<string, string> = {
      '01': 'يناير',
      '02': 'فبراير',
      '03': 'مارس',
      '04': 'أبريل',
      '05': 'مايو',
      '06': 'يونيو',
      '07': 'يوليو',
      '08': 'أغسطس',
      '09': 'سبتمبر',
      '10': 'أكتوبر',
      '11': 'نوفمبر',
      '12': 'ديسمبر',
    };

    // Standard sequence of months around current season
    const monthsOrder = ['06', '07', '08', '09', '10', '11', '12'];
    const map = new Map<string, {
      monthKey: string;
      name: string;
      مؤكد: number;
      مكتمل: number;
      ملغي: number;
      'قيد الانتظار': number;
      إجمالي_الحجوزات: number;
      الإيرادات: number;
    }>();

    monthsOrder.forEach((m) => {
      map.set(m, {
        monthKey: m,
        name: monthNames[m],
        مؤكد: 0,
        مكتمل: 0,
        ملغي: 0,
        'قيد الانتظار': 0,
        إجمالي_الحجوزات: 0,
        الإيرادات: 0,
      });
    });

    bookings.forEach((b) => {
      const parts = b.eventDate ? b.eventDate.split('-') : [];
      let m = parts.length >= 2 ? parts[1] : '10';

      if (!map.has(m)) {
        map.set(m, {
          monthKey: m,
          name: monthNames[m] || m,
          مؤكد: 0,
          مكتمل: 0,
          ملغي: 0,
          'قيد الانتظار': 0,
          إجمالي_الحجوزات: 0,
          الإيرادات: 0,
        });
      }

      const item = map.get(m)!;
      item.إجمالي_الحجوزات += 1;

      if (b.status === 'confirmed') item.مؤكد += 1;
      else if (b.status === 'completed') item.مكتمل += 1;
      else if (b.status === 'cancelled') item.ملغي += 1;
      else if (b.status === 'pending') item['قيد الانتظار'] += 1;

      if (b.status !== 'cancelled') {
        item.الإيرادات += b.totalPriceYER;
      }
    });

    return Array.from(map.values());
  }, [bookings]);

  // 3. Category Breakdown
  const categoryStats = useMemo(() => {
    const cats: Record<string, { label: string; count: number; revenue: number }> = {
      women: { label: 'نسائي ملكي', count: 0, revenue: 0 },
      men: { label: 'رجالي فخم', count: 0, revenue: 0 },
      traditional: { label: 'تراث يمني', count: 0, revenue: 0 },
      royal_vip: { label: 'VIP ملكي', count: 0, revenue: 0 },
    };

    bookings.forEach((b) => {
      if (cats[b.category]) {
        cats[b.category].count += 1;
        if (b.status !== 'cancelled') {
          cats[b.category].revenue += b.totalPriceYER;
        }
      }
    });

    return Object.values(cats);
  }, [bookings]);

  // Total active bookings revenue
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.totalPriceYER, 0);

  const avgBookingValue =
    bookings.length > 0
      ? Math.round(totalRevenue / Math.max(1, bookings.filter((b) => b.status !== 'cancelled').length))
      : 0;

  return (
    <div className="space-y-6" id="admin-analytics-section" dir="rtl">
      {/* 1. Decision-Making KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Confirmed Rate */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#7A6A5A] block">معدل تأكيد الحجوزات</span>
            <div className="text-2xl font-bold font-title text-emerald-700 mt-0.5">
              {statusStats.confirmationRate}%
            </div>
            <span className="text-[10.5px] text-emerald-600 flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{statusStats.counts.confirmed + statusStats.counts.completed} حجز مؤكد ومكتمل</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Cancellation Rate */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#7A6A5A] block">نسبة الإلغاء</span>
            <div className="text-2xl font-bold font-title text-rose-700 mt-0.5">
              {statusStats.cancellationRate}%
            </div>
            <span className="text-[10.5px] text-rose-600 flex items-center gap-1 mt-1">
              <XCircle className="w-3 h-3" />
              <span>{statusStats.counts.cancelled} طلبات ملغية</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Total Confirmed Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#7A6A5A] block">إجمالي العائدات الفعلية</span>
            <div className="text-lg sm:text-xl font-bold font-title text-[#801B2E] mt-0.5">
              {formatPriceYER(totalRevenue)}
            </div>
            <span className="text-[10.5px] text-[#8A7A6A] mt-1 block">
              عقود سارية بالصالات
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#801B2E] flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-[#C5A059]" />
          </div>
        </div>

        {/* Average Booking Ticket */}
        <div className="bg-white p-4 rounded-2xl border border-[#E6DEC8] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#7A6A5A] block">متوسط قيمة الحجز</span>
            <div className="text-lg font-bold font-title text-[#29170E] mt-0.5">
              {formatPriceYER(avgBookingValue)}
            </div>
            <span className="text-[10.5px] text-purple-600 flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>شامل الباقات والإضافات</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 2. Visual Charts Row 1: Monthly Distribution & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main BarChart: Monthly Bookings by Status (col 1-8) */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-[#F0E9DC] gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-[#FAF0DF] text-[#801B2E]">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold font-title text-[#29170E]">
                  إحصائيات الحجوزات الشهرية وتوزيعها حسب الحالة
                </h3>
              </div>
              <p className="text-xs text-[#7A6A5A] mt-0.5">
                مقارنة بين الحجوزات المؤكدة، المكتملة، والملغية على مدار الأشهر لمتابعة الأداء
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span>مؤكد</span>
              </span>
              <span className="flex items-center gap-1 text-blue-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
                <span>مكتمل</span>
              </span>
              <span className="flex items-center gap-1 text-rose-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                <span>ملغي</span>
              </span>
            </div>
          </div>

          {/* Recharts BarChart */}
          <div className="w-full h-72 sm:h-80" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0E9DC" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#5B4636', fontSize: 12, fontFamily: 'Cairo' }}
                  axisLine={{ stroke: '#DDD3BF' }}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#7A6A5A', fontSize: 11 }}
                  axisLine={{ stroke: '#DDD3BF' }}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} حجز`, name]}
                  labelStyle={{ fontFamily: 'Cairo', fontWeight: 'bold', color: '#29170E' }}
                  contentStyle={{
                    backgroundColor: '#FAF8F5',
                    borderRadius: '12px',
                    borderColor: '#D4AF37',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    direction: 'rtl',
                    textAlign: 'right',
                    fontFamily: 'Cairo',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontFamily: 'Cairo', paddingTop: '10px', fontSize: '12px' }}
                />
                <Bar dataKey="مؤكد" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="مكتمل" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={30} />
                <Bar dataKey="ملغي" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-[#F0E9DC] flex items-center justify-between text-xs text-[#7A6A5A]">
            <span>💡 نصيحة المدير: التركيز على تأكيد الحجوزات قبل أسبوعين من الموعد يقلل نسبة الإلغاء.</span>
            <span className="font-bold text-[#801B2E]">مكتبة Recharts المعتمدة</span>
          </div>
        </div>

        {/* Donut Chart: Status Distribution (col 9-12) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col justify-between">
          <div className="pb-3 border-b border-[#F0E9DC] mb-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-[#FAF0DF] text-[#801B2E]">
                <PieIcon className="w-4 h-4" />
              </span>
              <h3 className="text-sm sm:text-base font-bold font-title text-[#29170E]">
                توزيع حالات الحجوزات
              </h3>
            </div>
            <p className="text-xs text-[#7A6A5A] mt-0.5">
              النسبة المئوية لكل حالة حجز لاتخاذ القرارات التشغيلية
            </p>
          </div>

          {/* Recharts PieChart */}
          <div className="w-full h-56 relative" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats.pieData.length > 0 ? statusStats.pieData : [{ name: 'لا توجد بيانات', value: 1, color: '#DDD' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusStats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => [`${value} حجز`, name]}
                  contentStyle={{
                    backgroundColor: '#FAF8F5',
                    borderRadius: '12px',
                    borderColor: '#D4AF37',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    direction: 'rtl',
                    fontFamily: 'Cairo',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold font-title text-[#29170E]">
                {statusStats.total}
              </span>
              <span className="text-[10px] text-[#7A6A5A]">إجمالي الطلبات</span>
            </div>
          </div>

          {/* Custom Status Legend List */}
          <div className="space-y-1.5 pt-2 border-t border-[#F0E9DC]">
            {statusStats.rawPieData.map((item) => {
              const count = item.value;
              const pct = statusStats.total > 0 ? Math.round((count / statusStats.total) * 100) : 0;
              return (
                <div key={item.name} className="flex items-center justify-between text-xs py-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[#5B4636] font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <strong className="text-[#29170E]">{count}</strong>
                    <span className="text-[#8A7A6A] text-[11px] w-8 text-left" dir="ltr">
                      ({pct}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Visual Charts Row 2: Monthly Financial Growth & Kosha Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue AreaChart (col 1-7) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E9DC] mb-4">
            <div>
              <h4 className="text-sm sm:text-base font-bold font-title text-[#29170E] flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-[#801B2E]" />
                <span>منحنى نمو الإيرادات الشهرية المتوقعة (ريال يمني)</span>
              </h4>
              <p className="text-xs text-[#7A6A5A] mt-0.5">
                حجم السيولة المالية المحصلة من عقود الكوش المؤكدة والمكتملة
              </p>
            </div>
          </div>

          <div className="w-full h-56" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#801B2E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#801B2E" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0E9DC" />
                <XAxis dataKey="name" tick={{ fill: '#5B4636', fontSize: 12, fontFamily: 'Cairo' }} />
                <YAxis
                  tickFormatter={(val) => `${Math.round(val / 1000)}k`}
                  tick={{ fill: '#7A6A5A', fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val: any) => [formatPriceYER(val), 'الإيراد الشهري']}
                  contentStyle={{
                    backgroundColor: '#FAF8F5',
                    borderRadius: '12px',
                    borderColor: '#D4AF37',
                    direction: 'rtl',
                    fontFamily: 'Cairo',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="الإيرادات"
                  stroke="#801B2E"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance (col 8-12) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-[#E6DEC8] shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm sm:text-base font-bold font-title text-[#29170E] pb-3 border-b border-[#F0E9DC] mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>أداء الأقسام والتصنيفات في الحجوزات</span>
            </h4>

            <div className="space-y-3.5">
              {categoryStats.map((cat) => {
                const pct = statusStats.total > 0 ? Math.round((cat.count / statusStats.total) * 100) : 0;
                return (
                  <div key={cat.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#29170E]">{cat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#801B2E] font-semibold">{formatPriceYER(cat.revenue)}</span>
                        <span className="text-[#7A6A5A]">({cat.count} حجز)</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-[#FAF5EB] rounded-full overflow-hidden border border-[#E8DEC8]">
                      <div
                        className="h-full bg-gradient-to-r from-[#801B2E] to-[#D4AF37] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0E9DC] text-[11px] text-[#6E5D4E] bg-[#FAF8F5] p-2.5 rounded-xl border border-[#DDD3BF]">
            <strong>ملاحظة للمدير:</strong> كوش الفئات النسائية الملكية تحظى بأعلى متوسط إيراد وحجم إقبال، ويوصى بزيادة موديلاتها الجديدة لموسم الصيف.
          </div>
        </div>
      </div>
    </div>
  );
};
