import { BookingRequest } from '../types';
import { formatPriceYER } from './formatters';

export function printBookingVoucher(booking: BookingRequest): boolean {
  if (!booking) return false;

  try {
    // Remove any previous print iframes
    const existing = document.getElementById('jaadabi-print-frame');
    if (existing) {
      existing.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'jaadabi-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    iframe.style.zIndex = '-9999';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return true;
    }

    const timeSlotLabel = 
      booking.timeSlot === 'evening' 
        ? 'الفترة المسائية (حفل السهرة 5:00م - 12:00 منتصف الليل)'
        : booking.timeSlot === 'morning'
        ? 'الفترة النهارية (غداء ومقيل 11:00ص - 4:30 عصراً)'
        : 'يوم كامل (صباحي ومسائي)';

    const remainingAmountYER = Math.max(0, booking.totalPriceYER - booking.depositAmountYER);

    const issueDate = new Date().toLocaleDateString('ar-YE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const acrylicNames = booking.customization?.customAcrylicNames?.enabled
      ? `${booking.customization.customAcrylicNames.groomName} & ${booking.customization.customAcrylicNames.brideName}`
      : 'غير محدد';

    const voucherHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>سند حجز كوشة - ${booking.bookingCode}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif;
      direction: rtl;
      background-color: #FFFFFF;
      color: #1F2937;
      line-height: 1.4;
      font-size: 11.5px;
      padding: 10px;
    }
    .voucher-container {
      border: 3px double #801B2E;
      border-radius: 16px;
      padding: 24px;
      background: #FFFFFF;
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }
    .corner-decor {
      position: absolute;
      width: 28px;
      height: 28px;
      border-color: #D4AF37;
      border-style: solid;
    }
    .top-right { top: 8px; right: 8px; border-width: 3px 3px 0 0; }
    .top-left { top: 8px; left: 8px; border-width: 3px 0 0 3px; }
    .bottom-right { bottom: 8px; right: 8px; border-width: 0 3px 3px 0; }
    .bottom-left { bottom: 8px; left: 8px; border-width: 0 0 3px 3px; }

    .header-table {
      width: 100%;
      border-bottom: 2px solid #D4AF37;
      padding-bottom: 14px;
      margin-bottom: 14px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #801B2E;
      letter-spacing: -0.5px;
    }
    .brand-musnad {
      font-size: 14px;
      color: #D4AF37;
      letter-spacing: 2px;
      margin-bottom: 2px;
    }
    .brand-subtitle {
      font-size: 11px;
      color: #6B7280;
    }
    .badge-code-box {
      text-align: left;
    }
    .voucher-title {
      display: inline-block;
      background: #801B2E;
      color: #F9E8B2;
      font-size: 12px;
      font-weight: bold;
      padding: 4px 12px;
      border-radius: 6px;
      margin-bottom: 6px;
    }
    .booking-number {
      font-family: monospace;
      font-size: 16px;
      font-weight: 800;
      color: #801B2E;
      letter-spacing: 1.5px;
      direction: ltr;
      display: inline-block;
      background: #FAF8F5;
      border: 1px solid #D4AF37;
      padding: 3px 10px;
      border-radius: 6px;
    }

    .section-header {
      background: #FDF9F0;
      border-right: 4px solid #801B2E;
      color: #801B2E;
      font-weight: 700;
      font-size: 12px;
      padding: 5px 10px;
      margin: 12px 0 8px 0;
      border-radius: 4px;
    }

    .grid-info {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
    }
    .grid-info td {
      padding: 5px 8px;
      border-bottom: 1px dashed #E5E7EB;
      font-size: 11px;
      vertical-align: top;
    }
    .grid-info .label {
      color: #6B7280;
      width: 25%;
      font-weight: 600;
    }
    .grid-info .value {
      color: #111827;
      width: 25%;
      font-weight: 700;
    }

    .fin-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
    }
    .fin-table th, .fin-table td {
      border: 1px solid #D1D5DB;
      padding: 7px 10px;
      text-align: right;
      font-size: 11px;
    }
    .fin-table th {
      background: #FAF5EB;
      color: #374151;
      font-weight: 700;
    }
    .fin-table .highlight-row {
      background: #FDF9F0;
      font-weight: 800;
      color: #801B2E;
      font-size: 12.5px;
    }

    .terms-box {
      margin-top: 14px;
      padding: 10px 14px;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-size: 9.5px;
      color: #4B5563;
    }
    .terms-box h4 {
      font-size: 10.5px;
      color: #801B2E;
      margin-bottom: 4px;
    }
    .terms-box ol {
      padding-right: 18px;
      line-height: 1.5;
    }

    .footer-signatures {
      width: 100%;
      margin-top: 20px;
      padding-top: 14px;
      border-top: 1px solid #E5E7EB;
    }
    .footer-signatures td {
      vertical-align: top;
      text-align: center;
      width: 50%;
    }
    .official-stamp {
      width: 90px;
      height: 90px;
      border: 2px dashed #801B2E;
      border-radius: 50%;
      margin: 8px auto 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #801B2E;
      font-size: 9px;
      font-weight: bold;
      transform: rotate(-6deg);
      line-height: 1.2;
    }
    .qr-placeholder {
      font-family: monospace;
      font-size: 9px;
      color: #9CA3AF;
      margin-top: 4px;
    }
    .contact-note {
      text-align: center;
      margin-top: 12px;
      font-size: 10px;
      color: #6B7280;
      border-top: 1px dashed #D4AF37;
      padding-top: 8px;
    }
  </style>
</head>
<body>
  <div class="voucher-container">
    <div class="corner-decor top-right"></div>
    <div class="corner-decor top-left"></div>
    <div class="corner-decor bottom-right"></div>
    <div class="corner-decor bottom-left"></div>

    <!-- Header -->
    <table class="header-table">
      <tr>
        <td style="width: 60%;">
          <div class="brand-musnad">𐩱𐩡𐩴𐩲𐩵𐩨𐩺 • AL-JA'ADABI</div>
          <div class="brand-title">كوش وأفراح الجعدبي</div>
          <div class="brand-subtitle">فخامة كوش الصالات النسائية والرجالية بطابع يمني أصيل • صنعاء - اليمن</div>
        </td>
        <td style="width: 40%;" class="badge-code-box">
          <div class="voucher-title">سند حجز وتأكيد رسمي</div>
          <div>
            <span style="font-size: 10px; color: #6B7280;">رقم السند:</span>
            <span class="booking-number">${booking.bookingCode}</span>
          </div>
          <div style="font-size: 9.5px; color: #6B7280; margin-top: 3px;">
            تاريخ الإصدار: ${issueDate}
          </div>
        </td>
      </tr>
    </table>

    <!-- Client & Event Information -->
    <div class="section-header">أولاً: بيانات العميل والمناسبة</div>
    <table class="grid-info">
      <tr>
        <td class="label">اسم المستأجر / العريس:</td>
        <td class="value">${booking.customerName}</td>
        <td class="label">رقم الهاتف للتنسيق:</td>
        <td class="value" dir="ltr" style="text-align: right;">${booking.customerPhone}</td>
      </tr>
      <tr>
        <td class="label">صالة ومكان المناسبة:</td>
        <td class="value">${booking.hallName}</td>
        <td class="label">تاريخ الحفل:</td>
        <td class="value" style="color: #801B2E;">${booking.eventDate}</td>
      </tr>
      <tr>
        <td class="label">فترة المناسبة بالصالة:</td>
        <td class="value" colspan="3">${timeSlotLabel}</td>
      </tr>
      ${booking.notes ? `
      <tr>
        <td class="label">ملاحظات وطلبات خاصة:</td>
        <td class="value" colspan="3">${booking.notes}</td>
      </tr>` : ''}
    </table>

    <!-- Kosha Customization Details -->
    <div class="section-header">ثانياً: مواصفات الكوشة والخيارات المختارة</div>
    <table class="grid-info">
      <tr>
        <td class="label">اسم موديل الكوشة:</td>
        <td class="value" style="color: #801B2E;">${booking.koshaName}</td>
        <td class="label">تنسيق الورد المعتمد:</td>
        <td class="value">${booking.customization?.flowerColor || 'النموذج القياسي'}</td>
      </tr>
      <tr>
        <td class="label">طراز المقاعد والجلسة:</td>
        <td class="value">${booking.customization?.seatingStyle || 'النموذج القياسي'}</td>
        <td class="label">طراز ونظام الإضاءة:</td>
        <td class="value">${booking.customization?.lightingMode || 'إضاءة صالة قياسية'}</td>
      </tr>
      <tr>
        <td class="label">لوحة الأسماء الإكريليك:</td>
        <td class="value" colspan="3">${acrylicNames}</td>
      </tr>
    </table>

    <!-- Financial Accounting -->
    <div class="section-header">ثالثاً: البيان المالي وسند الدفع</div>
    <table class="fin-table">
      <thead>
        <tr>
          <th>البند والتفصيل</th>
          <th style="width: 30%;">المبلغ بالريال اليمني</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>قيمة إيجار الكوشة الأساسي والتجهيز</td>
          <td>${formatPriceYER(booking.basePriceYER)}</td>
        </tr>
        ${booking.addonsPriceYER > 0 ? `
        <tr>
          <td>الإضافات والكماليات المختارة (مباخر ملكية / إضاءات ممر / دخان)</td>
          <td>${formatPriceYER(booking.addonsPriceYER)}</td>
        </tr>` : ''}
        <tr class="highlight-row">
          <td>إجمالي تكلفة الحجز والتركيب:</td>
          <td>${formatPriceYER(booking.totalPriceYER)}</td>
        </tr>
        <tr>
          <td style="color: #065F46; font-weight: 600;">عربون التثبيت المتفق عليه:</td>
          <td style="color: #065F46; font-weight: 700;">${formatPriceYER(booking.depositAmountYER)}</td>
        </tr>
        <tr>
          <td style="color: #991B1B; font-weight: 600;">المتبقي للدفع بعد اكتمال التركيب بالصالة:</td>
          <td style="color: #991B1B; font-weight: 700;">${formatPriceYER(remainingAmountYER)}</td>
        </tr>
        <tr>
          <td>طريقة الدفع المعتمدة:</td>
          <td>${booking.paymentMethod === 'kuraimi' ? 'بنك الكريمي (حساب / صراف)' : booking.paymentMethod === 'alnejm' ? 'شبكة النجم للتحويلات' : 'نقداً عند المعاينة والتركيب'}</td>
        </tr>
      </tbody>
    </table>

    <!-- Terms & Guarantees -->
    <div class="terms-box">
      <h4>الشروط والإرشادات المعتمدة:</h4>
      <ol>
        <li>يلتزم فريق كوش الجعدبي بالحضور للصالة والتجهيز قبل موعد الحفل بساعتين على الأقل.</li>
        <li>يتوجب على العميل إبلاغ إدارة الصالة بالسماح لفريق التركيب بالدخول والتجهيز بالوقت المحدد.</li>
        <li>يُدفع المبلغ المتبقي فور اكتمال التجهيز وفحص الكوشة من قبل ممثل العريس أو العروس.</li>
        <li>يحافظ العميل على سلامة الإكسسوارات والديكورات من التلف المتعمد.</li>
      </ol>
    </div>

    <!-- Signatures & Stamp -->
    <table class="footer-signatures">
      <tr>
        <td>
          <div style="font-weight: 700; color: #801B2E; font-size: 11px;">إدارة كوش وأفراح الجعدبي</div>
          <div class="official-stamp">
            <span>كوش الجعدبي</span>
            <span style="font-size: 7.5px; color: #D4AF37;">𐩱𐩡𐩴𐩲𐩵𐩨𐩺</span>
            <span>معتمد للتنفيذ</span>
            <span style="font-size: 8px;">صنعاء</span>
          </div>
        </td>
        <td>
          <div style="font-weight: 700; color: #374151; font-size: 11px;">توقيع العميل / المستأجر</div>
          <div style="margin-top: 35px; border-bottom: 1px solid #9CA3AF; width: 60%; margin-left: auto; margin-right: auto;"></div>
          <div style="font-size: 10px; color: #6B7280; margin-top: 4px;">الاسم: ${booking.customerName}</div>
        </td>
      </tr>
    </table>

    <div class="contact-note">
      لأي استفسار أو تعديل: هاتف وواتساب: <strong>777 123 456</strong> • منصة الجعدبي الرقمية لكوش الأعراس
    </div>
  </div>
</body>
</html>`;

    doc.open();
    doc.write(voucherHtml);
    doc.close();

    // Trigger native print dialog safely
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.warn('Iframe print error, falling back to window.print', e);
        window.print();
      }

      // Clean up after print dialog finishes
      setTimeout(() => {
        if (document.getElementById('jaadabi-print-frame')) {
          document.getElementById('jaadabi-print-frame')?.remove();
        }
      }, 5000);
    }, 450);

    return true;
  } catch (error) {
    console.error('Error generating voucher:', error);
    window.print();
    return false;
  }
}
