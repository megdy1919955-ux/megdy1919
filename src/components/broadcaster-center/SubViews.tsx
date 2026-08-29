import React, { useState } from 'react';
import { 
  ChevronRight, 
  Check, 
  Copy, 
  HelpCircle, 
  Share2, 
  Send, 
  AlertCircle, 
  Sparkles, 
  ExternalLink,
  Shield,
  FileText,
  Calendar,
  Clock,
  Coins,
  DollarSign,
  Gift,
  Search,
  Users
} from 'lucide-react';
import type { SubViewType } from '../BroadcasterCenterModal';

interface SubViewProps {
  onNavigate: (view: SubViewType) => void;
  showAlert: (msg: string) => void;
  onWhatsAppContact?: () => void;
}

/* ========================================================================= */
/* 1. MY AGENCY VIEW (وكالتي - Matching Screenshot 1)                         */
/* ========================================================================= */
export const MyAgencyView: React.FC<SubViewProps> = ({ showAlert }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    showAlert(`تم نسخ ${label} بنجاح: ${text}`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-[28px] bg-white/90 backdrop-blur-2xl border border-white/95 p-5 shadow-[0_15px_40px_rgba(180,160,130,0.15)] space-y-4">
        
        {/* Row 1: معرّف الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-[#5C3F13]">30032</span>
            <button 
              onClick={() => handleCopy('30032', 'معرّف الوكالة')}
              className="p-1 hover:bg-[#F5EFE0] rounded-lg text-[#B38022] transition-colors"
              title="نسخ"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs font-bold text-[#8C6B38]">معرّف الوكالة:</span>
        </div>

        {/* Row 2: اسم الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-[#F0EAE0]">
          <span className="font-bold text-sm text-[#5C3F13]">AbuAmjad</span>
          <span className="text-xs font-bold text-[#8C6B38]">اسم الوكالة:</span>
        </div>

        {/* Row 3: مستوى الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-[#F0EAE0]">
          <span className="font-mono font-black text-sm text-[#B38022] px-2 py-0.5 rounded-md bg-[#FAF5E8] border border-[#E2B755]/30">F</span>
          <span className="text-xs font-bold text-[#8C6B38]">مستوى الوكالة:</span>
        </div>

        {/* Row 4: معرّف رئيس الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-[#F0EAE0]">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-[#5C3F13]">82639599</span>
            <button 
              onClick={() => handleCopy('82639599', 'معرّف رئيس الوكالة')}
              className="p-1 hover:bg-[#F5EFE0] rounded-lg text-[#B38022] transition-colors"
              title="نسخ"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs font-bold text-[#8C6B38]">معرّف رئيس الوكالة:</span>
        </div>

        {/* Row 5: اسم رئيس الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-[#F0EAE0]">
          <span className="font-black text-sm text-[#5C3F13]">ابوامجدMá🎼</span>
          <span className="text-xs font-bold text-[#8C6B38]">اسم رئيس الوكالة:</span>
        </div>

        {/* Row 6: وقت الانضمام */}
        <div className="flex items-center justify-between py-2 border-b border-[#F0EAE0]">
          <span className="font-mono font-bold text-xs text-[#5C3F13] dir-ltr">(utc+0)16:13:13 2025-12-16</span>
          <span className="text-xs font-bold text-[#8C6B38]">وقت الانضمام:</span>
        </div>

        {/* Row 7: إعلان الوكالة */}
        <div className="space-y-1.5 py-2 border-b border-[#F0EAE0]">
          <span className="text-xs font-bold text-[#8C6B38] block">إعلان الوكالة:</span>
          <div className="p-3.5 bg-[#FAF7F0] rounded-2xl border border-[#E8DFC8] text-xs leading-relaxed text-[#5C3F13] font-medium">
            اي مضيف يسكر تارجت اكبر له تسكير خاص غير المضيفين معا تحيت وكالت ابو امجد بتوفيق للجميع
          </div>
        </div>

        {/* Row 8: الحالة الحالية */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-black">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>تم الانضمام</span>
          </div>
          <span className="text-xs font-bold text-[#8C6B38]">الحالة الحالية:</span>
        </div>

      </div>
    </div>
  );
};

/* ========================================================================= */
/* 2. RECORDS VIEW (سجل البث - Matching Screenshot 2)                          */
/* ========================================================================= */
export const RecordsView: React.FC<SubViewProps> = ({ showAlert }) => {
  const [selectedMonth, setSelectedMonth] = useState('08/2026');
  const [selectedDate, setSelectedDate] = useState('28/08/2026');
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-3.5 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* Top Green Warning/Exemption Notice Banner */}
      <div className="p-3 bg-[#E8F8F0] border border-[#A7E5C6] rounded-2xl text-[11px] font-bold text-[#1E7E50] leading-relaxed shadow-2xs">
        في بث هذه المناطق (XM,TR,FR,DE,IT,PH,IN,PK,VN,TH,CG,ID,US,KH,MY) لن يتم احتساب التبرعات بين المستخدمين من الدول الأخرى لاستبدال الماس.
      </div>

      {/* Monthly Section Title & Date Picker */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8DFC8] shadow-2xs text-xs font-bold text-[#5C3F13]">
          <span>{selectedMonth}</span>
          <span className="text-[10px] text-[#A89478]">▼</span>
        </div>
        <span className="text-sm font-black text-[#5C3F13]">شهريًا</span>
      </div>

      {/* Red Update Notice */}
      <div className="text-[11px] font-bold text-red-500 text-left px-1">
        .سيتم تحديث جميع البيانات كل 10 دقائق
      </div>

      {/* Monthly Statistics Card */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-4 shadow-[0_10px_30px_rgba(180,160,130,0.1)] space-y-3.5">
        
        {/* 1. إجمالي الماسات */}
        <div className="space-y-1.5">
          <div className="text-xs font-black text-[#2B6CB0] flex items-center gap-1">
            <span>💎</span>
            <span>إجمالي الماسات : 50</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#718096] bg-[#F7FAFC] p-2.5 rounded-xl border border-[#EDF2F7]">
            <div>دخل المذيع: <span className="font-bold text-[#2D3748]">50</span></div>
            <div>دخل الضيف: <span className="font-bold text-[#2D3748]">0</span></div>
            <div>المكافآت: <span className="font-bold text-[#2D3748]">0</span></div>
            <div>حصيلة الماس للغرفة: <span className="font-bold text-[#2D3748]">700</span></div>
            <div className="col-span-2">الرسالة والهدية: <span className="font-bold text-[#2D3748]">0</span></div>
            <div>إيرادات الدردشة النصية: <span className="font-bold text-[#2D3748]">0</span></div>
            <div>إيرادات المكالمات: <span className="font-bold text-[#2D3748]">0</span></div>
          </div>
        </div>

        {/* 2. إجمالي الأيام الصالحة */}
        <div className="py-2 border-t border-[#F0EAE0] flex items-center justify-between">
          <span className="text-xs font-black text-[#22543D]">إجمالي الأيام الصالحة : 1 يوميًا</span>
        </div>

        {/* 3. إجمالي المدة النشطة */}
        <div className="space-y-1.5 border-t border-[#F0EAE0] pt-2">
          <div className="text-xs font-black text-[#C05621]">
            إجمالي المدة النشطة : 242 دقائق
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#718096] bg-[#FFFAF0] p-2.5 rounded-xl border border-[#FEEBC8]">
            <div>مدة البث: <span className="font-bold text-[#7B341E]">202 دقائق</span></div>
            <div>مدة الضيف: <span className="font-bold text-[#7B341E]">40 دقائق</span></div>
          </div>
        </div>

        {/* 4. عملات اللعبة المكتسبة */}
        <div className="space-y-1 border-t border-[#F0EAE0] pt-2">
          <div className="text-xs font-black text-[#B83280]">
            عملات اللعبة المكتسبة في الغرفة هذا الشهر :5775
          </div>
          <div className="text-[11px] text-[#718096] px-1">
            دخل اللعبة: <span className="font-bold text-[#702459]">0</span>
          </div>
        </div>

        {/* 5. مدة بث اللعبة */}
        <div className="border-t border-[#F0EAE0] pt-2 text-xs font-black text-[#975A16]">
          مدة بث اللعبة : 0 دقائق
        </div>

      </div>

      {/* Daily Section Title & Date Picker */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E8DFC8] shadow-2xs text-xs font-bold text-[#5C3F13]">
          <span>{selectedDate}</span>
          <span>📅</span>
        </div>
        <span className="text-sm font-black text-[#5C3F13]">يوميًا</span>
      </div>

      {/* Daily Statistics Card */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-4 shadow-[0_10px_30px_rgba(180,160,130,0.1)] space-y-3">
        
        {/* Daily Diamonds */}
        <div className="space-y-1.5">
          <div className="text-xs font-black text-[#2B6CB0] flex items-center gap-1">
            <span>💎</span>
            <span>إجمالي الماسات : 0</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#718096] bg-[#F7FAFC] p-2.5 rounded-xl border border-[#EDF2F7]">
            <div>دخل المذيع: <span className="font-bold text-[#2D3748]">0</span></div>
            <div>دخل الضيف: <span className="font-bold text-[#2D3748]">0</span></div>
            <div>المكافآت: <span className="font-bold text-[#2D3748]">0</span></div>
            <div>حصيلة الماس للغرفة: <span className="font-bold text-[#2D3748]">0</span></div>
            <div className="col-span-2">الرسالة والهدية: <span className="font-bold text-[#2D3748]">0</span></div>
            <div>إيرادات الدردشة النصية: <span className="font-bold text-[#2D3748]">0</span></div>
            <div>إيرادات المكالمات: <span className="font-bold text-[#2D3748]">0</span></div>
          </div>
        </div>

        {/* Daily Active Duration */}
        <div className="space-y-1 border-t border-[#F0EAE0] pt-2">
          <div className="text-xs font-black text-[#B83280]">
            (No) إجمالي المدة النشطة : 0 دقائق
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#718096] px-1">
            <div>مدة البث: <span className="font-bold">0 دقائق</span></div>
            <div>مدة الضيف: <span className="font-bold">0 دقائق</span></div>
          </div>
        </div>

        {/* Daily Game Duration */}
        <div className="border-t border-[#F0EAE0] pt-2 text-xs font-black text-[#975A16]">
          مدة بث اللعبة : 0 دقائق
        </div>

        {/* Check Detail Expand Link */}
        <button 
          onClick={() => setShowDetail(!showDetail)}
          className="w-full pt-2 text-center text-xs font-bold text-[#B38022] hover:text-[#7A5210] flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Check detail</span>
          <span>{showDetail ? '▲' : '⌄'}</span>
        </button>

      </div>

    </div>
  );
};

/* ========================================================================= */
/* 3. CHANGE AGENCY VIEW (تغيير الوكالة - Matching Screenshot 3)               */
/* ========================================================================= */
export const ChangeAgencyView: React.FC<SubViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* 1. طلب التحويل */}
      <div 
        onClick={() => onNavigate('transfer_request')}
        className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/95 shadow-[0_6px_20px_rgba(180,160,130,0.12)] flex items-center justify-between hover:bg-white active:scale-98 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-[#A89478] rotate-180" />
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black text-[#5C3F13]">طلب التحويل</span>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FFA500] to-[#FFD700] text-white flex items-center justify-center text-base shadow-xs">
            🔄
          </div>
        </div>
      </div>

      {/* 2. سجل التحويل */}
      <div 
        onClick={() => onNavigate('transfer_history')}
        className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/95 shadow-[0_6px_20px_rgba(180,160,130,0.12)] flex items-center justify-between hover:bg-white active:scale-98 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-[#A89478] rotate-180" />
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black text-[#5C3F13]">سجل التحويل</span>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8A2BE2] to-[#BA55D3] text-white flex items-center justify-center text-base shadow-xs">
            📋
          </div>
        </div>
      </div>

      {/* 3. تعليقات على التحويل */}
      <div 
        onClick={() => onNavigate('transfer_faq')}
        className="p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/95 shadow-[0_6px_20px_rgba(180,160,130,0.12)] flex items-center justify-between hover:bg-white active:scale-98 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-[#A89478] rotate-180" />
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black text-[#5C3F13]">تعليقات على التحويل</span>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#718096] to-[#A0AEC0] text-white flex items-center justify-center text-base shadow-xs">
            ❓
          </div>
        </div>
      </div>

    </div>
  );
};

/* ========================================================================= */
/* 4. TRANSFER REQUEST FORM (طلب التحويل)                                    */
/* ========================================================================= */
export const TransferRequestView: React.FC<SubViewProps> = ({ onNavigate, showAlert }) => {
  const [targetId, setTargetId] = useState('');
  const [reason, setReason] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId.trim()) {
      showAlert('يرجى إدخال معرّف الوكالة المراد التحويل إليها');
      return;
    }
    if (!agreeTerms) {
      showAlert('يرجى الموافقة على شروط وقواعد التحويل أولاً');
      return;
    }
    showAlert(`تم تقديم طلب التحويل إلى الوكالة (ID: ${targetId}) بنجاح.`);
    setTimeout(() => onNavigate('transfer_history'), 1200);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-5 shadow-[0_15px_40px_rgba(180,160,130,0.15)] space-y-4">
        
        <div className="text-center space-y-1 border-b border-[#F0EAE0] pb-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FFA500] to-[#FFD700] text-white flex items-center justify-center mx-auto text-xl shadow-xs">
            🔄
          </div>
          <h3 className="text-sm font-black text-[#5C3F13]">تقديم طلب تحويل الوكالة</h3>
          <p className="text-xs text-[#8C6B38]">يحق للمذيع طلب تغيير وكالته الرسمية بعد استيفاء الشروط النظامية</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#5C3F13] block">معرّف الوكالة الجديدة (Agency ID):</label>
          <input 
            type="text"
            placeholder="مثال: 30045"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#FAF7F0] border border-[#E8DFC8] rounded-2xl text-xs font-mono font-bold text-[#5C3F13] focus:outline-none focus:border-[#B38022]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#5C3F13] block">سبب طلب التحويل (اختياري):</label>
          <textarea 
            rows={3}
            placeholder="اكتب سبب طلب النقل..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 bg-[#FAF7F0] border border-[#E8DFC8] rounded-2xl text-xs text-[#5C3F13] focus:outline-none focus:border-[#B38022] resize-none"
          />
        </div>

        <div className="p-3 bg-[#FAF5E8] border border-[#E2B755]/40 rounded-2xl text-[11px] text-[#7A5210] leading-relaxed">
          ⚠️ تنبيه: يستغرق مراجعة الطلب من 24 إلى 48 ساعة عمل ويجب ألا يكون على حسابك أي مستحقات معلقة.
        </div>

        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input 
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="rounded border-[#E8DFC8] text-[#B38022] focus:ring-0 w-4 h-4 cursor-pointer"
          />
          <span className="text-xs font-bold text-[#5C3F13]">أوافق على لوائح وسياسات تحويل المذيعين</span>
        </label>

        <button 
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-[#E2B755] via-[#B38022] to-[#7A5210] text-white font-black text-xs rounded-2xl shadow-[0_4px_12px_rgba(179,128,34,0.3)] hover:opacity-95 active:scale-98 transition-all cursor-pointer"
        >
          إرسال طلب التحويل
        </button>
      </form>
    </div>
  );
};

/* ========================================================================= */
/* 5. TRANSFER HISTORY (سجل التحويل)                                          */
/* ========================================================================= */
export const TransferHistoryView: React.FC<SubViewProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-6 shadow-[0_15px_40px_rgba(180,160,130,0.15)] text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-[#FAF5E8] text-[#B38022] flex items-center justify-center mx-auto text-xl">
          📋
        </div>
        <h3 className="text-sm font-black text-[#5C3F13]">سجل طلبات التحويل</h3>
        <p className="text-xs text-[#A89478] font-bold py-6">لا توجد طلبات تحويل معلقة حالياً</p>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 6. TRANSFER FAQ (تعليقات على التحويل)                                      */
/* ========================================================================= */
export const TransferFaqView: React.FC<SubViewProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-5 shadow-[0_15px_40px_rgba(180,160,130,0.15)] space-y-4">
        
        <h3 className="text-sm font-black text-[#5C3F13] border-b border-[#F0EAE0] pb-2">قواعد وشروط تحويل الوكالة</h3>
        
        <div className="space-y-3 text-xs text-[#5C3F13] leading-relaxed">
          <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E8DFC8]">
            <div className="font-black text-[#7A5210] mb-1">1. متى يحق لي طلب التحويل؟</div>
            <p className="text-[#8C6B38]">يحق للمذيع طلب التحويل بعد إكمال المدة المحددة في العقد أو بموافقة الطرفين.</p>
          </div>

          <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E8DFC8]">
            <div className="font-black text-[#7A5210] mb-1">2. كم تستغرق فترة المراجعة؟</div>
            <p className="text-[#8C6B38]">تتم معالجة الطلبات خلال 24 - 48 ساعة بواسطة إدارة الوكالات المركزية.</p>
          </div>

          <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E8DFC8]">
            <div className="font-black text-[#7A5210] mb-1">3. ماذا يحدث لأرباحي الحالية؟</div>
            <p className="text-[#8C6B38]">تحتفظ بكامل أرباحك وتتحول تلقائياً إلى حسابك دون أي نقصان.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ========================================================================= */
/* 7. SUPPORTERS VIEW (داعمي - Matching Screenshot 4)                          */
/* ========================================================================= */
export const SupportersView: React.FC<SubViewProps> = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026/08');

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* Month Selector Dropdown */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E8DFC8] shadow-2xs text-xs font-bold text-[#5C3F13]">
          <span>{selectedMonth}</span>
          <span className="text-[10px] text-[#A89478]">▼</span>
        </div>
        <span className="text-xs font-bold text-[#8C6B38]">الفترة المحددة</span>
      </div>

      {/* Supporter Item Card (Exact Match to Screenshot 4) */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-4 shadow-[0_10px_30px_rgba(180,160,130,0.1)] flex items-center justify-between">
        
        {/* Support Diamond Stats */}
        <div className="text-left space-y-0.5">
          <div className="text-[11px] font-bold text-[#8C6B38]">إجمالي الدعم هذا الشهر:</div>
          <div className="font-mono font-black text-sm text-[#B38022] flex items-center gap-1 justify-end">
            <span>50</span>
            <span>💎</span>
          </div>
        </div>

        {/* User Info & Badges */}
        <div className="flex items-center gap-3">
          <div className="text-right space-y-1">
            <div className="text-xs font-black text-[#5C3F13]">(عابر سبيل)</div>
            <div className="text-[10px] font-mono text-[#8C6B38]">ID:77989080</div>
            
            {/* Badges Pill Row */}
            <div className="flex items-center justify-end gap-1 text-[9px] font-bold">
              <span className="px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 border border-pink-200">16 💖</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">113 👑</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">25 ♂</span>
            </div>
          </div>

          {/* User Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#E2B755] shadow-xs">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
              alt="عابر سبيل" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* Bottom Serial Hash Matching Screenshot 4 */}
      <div className="text-center pt-8 text-[11px] font-mono text-[#A89478] font-bold tracking-widest opacity-70">
        e2b39057dc
      </div>

    </div>
  );
};

/* ========================================================================= */
/* 8. NEW USERS VIEW (مستخدم جديد - Matching Screenshot 5)                     */
/* ========================================================================= */
export const NewUsersView: React.FC<SubViewProps> = () => {
  const users = [
    { name: 'يمن', flag: '🇾🇪', star: '11 ⭐', heart: '0 🧡', tag: 'New 💰', age: '46 ♂', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
    { name: 'وسام', flag: '🇱🇧', star: '11 ⭐', heart: '0 🧡', tag: 'New 💰', age: '44 ♂', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
    { name: 'نور', flag: '🇦🇪', star: '0 ⭐', heart: '0 🧡', tag: 'New 💰', age: '31 ♂', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150' },
    { name: 'سيف', flag: '🇮🇶', star: '11 ⭐', heart: '0 🧡', tag: 'New 💰', age: '31 ♂', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
    { name: 'سالم', flag: '🇪🇬', star: '11 ⭐', heart: '0 🧡', tag: 'New 💰', age: '19 ♀', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
    { name: 'سيلين', flag: '🇸🇦', star: '11 ⭐', heart: '0 🧡', tag: 'New 💰', age: '31 ♂', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150' },
    { name: 'عمر', flag: '🇪🇬', star: '0 ⭐', heart: '0 🧡', tag: 'New 💰', age: '21 ♂', avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=150' }
  ];

  return (
    <div className="w-full max-w-md mx-auto p-3.5 space-y-2.5 pb-20 font-sans text-right" dir="rtl">
      
      {/* Users List */}
      <div className="space-y-2">
        {users.map((u, i) => (
          <div key={i} className="rounded-2xl bg-white/90 backdrop-blur-md border border-white/95 p-3 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-1 text-[9px] font-bold">
              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">{u.star}</span>
              <span className="px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 border border-pink-200">{u.heart}</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">{u.tag}</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">{u.age}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <div className="text-xs font-black text-[#5C3F13] flex items-center justify-end gap-1">
                  <span>{u.name}</span>
                  <span className="text-xs">{u.flag}</span>
                </div>
              </div>
              <div className="relative">
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-[#E2B755]/50 shadow-2xs" />
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Attractive Experience Booster Banner (Screenshot 5) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-3 bg-gradient-to-r from-[#FFF8E6] via-[#FFF2D1] to-[#FFEAB0] border-t border-[#E2B755]/60 shadow-[0_-4px_20px_rgba(180,140,60,0.15)] flex items-center gap-2.5 z-50 text-right" dir="rtl">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E2B755] to-[#7A5210] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
          18 👑
        </div>
        <p className="text-[10.5px] font-bold text-[#7A5210] leading-tight">
          تلقى هدية من مستخدم جديد لديه قدرة كبيرة على الدفع، مما سيضاعف من خبرة الجاذبية الخاصة بك
        </p>
      </div>

    </div>
  );
};

/* ========================================================================= */
/* 9. NEW USERS RULES VIEW (قواعد المستخدم الجديد)                             */
/* ========================================================================= */
export const NewUsersRulesView: React.FC<SubViewProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-5 shadow-[0_15px_40px_rgba(180,160,130,0.15)] space-y-3">
        <h3 className="text-sm font-black text-[#5C3F13] border-b border-[#F0EAE0] pb-2">قواعد ميزة المستخدم الجديد</h3>
        <ul className="space-y-2 text-xs text-[#5C3F13] leading-relaxed list-disc list-inside">
          <li>المستخدمون الجدد هم الأعضاء المنضمون للمنصة خلال آخر 14 يوماً.</li>
          <li>استقبال الهدايا من المستخدمين الجدد يمنحك نقاط جاذبية مضاعفة.</li>
          <li>يتم تحديث قائمة المستخدمين النشطين لحظياً حسب التواجد في الغرف.</li>
        </ul>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 10. EARNINGS DETAILS / SALARY SLIP (قسيمة الراتب - Matching Screenshot 6)   */
/* ========================================================================= */
export const EarningsDetailsView: React.FC<SubViewProps> = ({ onNavigate, showAlert }) => {
  const [selectedMonth, setSelectedMonth] = useState('2026/08');

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* Month Picker Dropdown */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E8DFC8] shadow-2xs text-xs font-bold text-[#5C3F13]">
          <span>{selectedMonth}</span>
          <span className="text-[10px] text-[#A89478]">▼</span>
        </div>
        <span className="text-xs font-bold text-[#8C6B38]">اختر الشهر</span>
      </div>

      {/* Card 1: إجمالي الراتب */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-5 shadow-[0_10px_30px_rgba(180,160,130,0.1)] space-y-2">
        <div className="text-xs font-bold text-[#5C3F13]">إجمالي الراتب:</div>
        <div className="font-mono font-black text-3xl text-emerald-600 text-left" dir="ltr">
          0 $
        </div>
        <div className="text-[11px] font-bold text-[#8C6B38] border-t border-[#F0EAE0] pt-2">
          إجمالي الراتب=الراتب الأساسي-الراتب الغير مفكوك
        </div>
      </div>

      {/* Card 2: الراتب الأساسي */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-4 shadow-[0_10px_30px_rgba(180,160,130,0.1)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono font-black text-base text-[#5C3F13]" dir="ltr">0 $</span>
          <span className="text-xs font-bold text-[#5C3F13] flex items-center gap-1">
            <span>الراتب الأساسي:</span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#FAF5E8] text-[#B38022] border border-[#E2B755]/50 flex items-center justify-center text-[9px] font-bold">؟</span>
          </span>
        </div>
        <div className="text-[11px] font-bold text-[#8C6B38] border-t border-[#F0EAE0] pt-2 flex items-center justify-between">
          <span className="font-mono font-bold text-[#5C3F13]" dir="ltr">0 $</span>
          <span>راتب المستوى:</span>
        </div>
      </div>

      {/* Card 3: الراتب الغير مفكوك */}
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-4 shadow-[0_10px_30px_rgba(180,160,130,0.1)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono font-black text-base text-[#5C3F13]" dir="ltr">0 $</span>
          <span className="text-xs font-bold text-[#5C3F13] flex items-center gap-1">
            <span>الراتب الغير مفكوك:</span>
            <span className="w-3.5 h-3.5 rounded-full bg-[#FAF5E8] text-[#B38022] border border-[#E2B755]/50 flex items-center justify-center text-[9px] font-bold">؟</span>
          </span>
        </div>
        <div className="text-[11px] font-bold text-[#8C6B38] border-t border-[#F0EAE0] pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-red-500 font-bold">غير مكتملة</span>
            <span className="font-mono font-bold text-[#5C3F13]">1/7</span>
          </div>
          <span>يوم (أيام) البث:</span>
        </div>
      </div>

      {/* Bottom Link: التحقق من بيانات البث */}
      <div className="pt-2 text-center">
        <button 
          onClick={() => onNavigate('records')}
          className="text-xs font-bold text-[#B38022] hover:text-[#7A5210] underline cursor-pointer"
        >
          التحقق من بيانات البث
        </button>
      </div>

    </div>
  );
};

/* ========================================================================= */
/* 11. CONTRACTS VIEW (العقود)                                                */
/* ========================================================================= */
export const ContractsView: React.FC<SubViewProps> = ({ showAlert }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-5 shadow-[0_15px_40px_rgba(180,160,130,0.15)] space-y-4">
        
        <div className="flex items-center justify-between border-b border-[#F0EAE0] pb-3">
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">عقد ساري المفعول ✅</span>
          <h3 className="text-sm font-black text-[#5C3F13]">عقد البث والوكالة الرسمي</h3>
        </div>

        <div className="space-y-2 text-xs text-[#5C3F13] leading-relaxed">
          <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E8DFC8]">
            <div className="font-bold text-[#7A5210] mb-1">الطرف الأول:</div>
            <div>وكالة AbuAmjad الرسمية (ID: 30032)</div>
          </div>

          <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E8DFC8]">
            <div className="font-bold text-[#7A5210] mb-1">الطرف الثاني (المذيع):</div>
            <div>أبو مجد(M✈️) (ID: 82639599)</div>
          </div>

          <div className="p-3 bg-[#FAF5E8] border border-[#E2B755]/40 rounded-2xl text-[11px] text-[#7A5210] space-y-1">
            <div className="font-black">بنود التعاقد:</div>
            <p>1. يحصل المذيع على كامل أرباح البث المباشر المعتمدة من المنصة.</p>
            <p>2. تلتزم الوكالة بتقديم الدعم الفني، الجوائز، وتسكير التارجت الإضافي.</p>
          </div>
        </div>

        <button 
          onClick={() => showAlert('تم تحميل نسخة من العقد الرقمي الموثق.')}
          className="w-full py-2.5 bg-gradient-to-r from-[#E2B755] to-[#7A5210] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
        >
          تحميل نسخة العقد الموثقة (PDF)
        </button>

      </div>
    </div>
  );
};

/* ========================================================================= */
/* 12. WALLET VIEW (محفظتي)                                                   */
/* ========================================================================= */
export const WalletView: React.FC<SubViewProps> = ({ showAlert }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white/90 backdrop-blur-2xl border border-white/95 p-5 shadow-[0_15px_40px_rgba(180,160,130,0.15)] space-y-4">
        
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-[#8C6B38]">رصيد المحفظة المتاح للسحب</span>
          <div className="font-mono font-black text-3xl text-[#B38022]">$0.00</div>
          <div className="text-[11px] font-bold text-[#7A5210]">50 ماسة 💎 = $0.25 تقريباً</div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button 
            onClick={() => showAlert('جاري تحويل الماسات إلى رصيد نقدي...')}
            className="py-2.5 px-3 bg-[#FAF5E8] border border-[#E2B755] text-[#7A5210] rounded-2xl text-xs font-black hover:bg-white transition-all cursor-pointer"
          >
            استبدال الماسات 💎
          </button>
          <button 
            onClick={() => showAlert('طلب سحب الرصيد إلى حسابك البنكي أو المحفظة الإلكترونية.')}
            className="py-2.5 px-3 bg-gradient-to-r from-[#E2B755] to-[#7A5210] text-white rounded-2xl text-xs font-black shadow-xs hover:opacity-95 transition-all cursor-pointer"
          >
            سحب الأرباح 💳
          </button>
        </div>

      </div>
    </div>
  );
};
