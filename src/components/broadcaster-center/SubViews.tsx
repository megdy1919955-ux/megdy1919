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
/* 1. MY AGENCY VIEW (وكالتي)                                                */
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
      <div className="rounded-[28px] bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        
        {/* Row 1: معرّف الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-slate-900">30032</span>
            <button 
              onClick={() => handleCopy('30032', 'معرّف الوكالة')}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="نسخ"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs font-bold text-slate-500">معرّف الوكالة:</span>
        </div>

        {/* Row 2: اسم الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="font-bold text-sm text-slate-900">AbuAmjad</span>
          <span className="text-xs font-bold text-slate-500">اسم الوكالة:</span>
        </div>

        {/* Row 3: مستوى الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="font-mono font-black text-sm text-slate-900 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200">F</span>
          <span className="text-xs font-bold text-slate-500">مستوى الوكالة:</span>
        </div>

        {/* Row 4: معرّف رئيس الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-slate-900">82639599</span>
            <button 
              onClick={() => handleCopy('82639599', 'معرّف رئيس الوكالة')}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="نسخ"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-xs font-bold text-slate-500">معرّف رئيس الوكالة:</span>
        </div>

        {/* Row 5: اسم رئيس الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="font-black text-sm text-slate-900">ابوامجدMá🎼</span>
          <span className="text-xs font-bold text-slate-500">اسم رئيس الوكالة:</span>
        </div>

        {/* Row 6: وقت الانضمام */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="font-mono font-bold text-xs text-slate-700 dir-ltr">(utc+0)16:13:13 2025-12-16</span>
          <span className="text-xs font-bold text-slate-500">وقت الانضمام:</span>
        </div>

        {/* Row 7: إعلان الوكالة */}
        <div className="space-y-1.5 py-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 block">إعلان الوكالة:</span>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-800 font-medium">
            اي مضيف يسكر تارجت اكبر له تسكير خاص غير المضيفين معا تحيت وكالت ابو امجد بتوفيق للجميع
          </div>
        </div>

        {/* Row 8: الحالة الحالية */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-black">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>تم الانضمام</span>
          </div>
          <span className="text-xs font-bold text-slate-500">الحالة الحالية:</span>
        </div>

      </div>
    </div>
  );
};

/* ========================================================================= */
/* 2. RECORDS VIEW (سجل البث)                                               */
/* ========================================================================= */
export const RecordsView: React.FC<SubViewProps> = ({ showAlert }) => {
  const [selectedMonth, setSelectedMonth] = useState('08/2026');
  const [selectedDate, setSelectedDate] = useState('28/08/2026');
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-3.5 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* Top Green Warning/Exemption Notice Banner */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] font-bold text-emerald-800 leading-relaxed shadow-2xs">
        في بث هذه المناطق (XM,TR,FR,DE,IT,PH,IN,PK,VN,TH,CG,ID,US,KH,MY) لن يتم احتساب التبرعات بين المستخدمين من الدول الأخرى لاستبدال الماس.
      </div>

      {/* Monthly Section Title & Date Picker */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
          <span>{selectedMonth}</span>
          <span className="text-[10px] text-slate-400">▼</span>
        </div>
        <span className="text-sm font-black text-slate-900">شهريًا</span>
      </div>

      {/* Red Update Notice */}
      <div className="text-[11px] font-bold text-rose-500 text-left px-1">
        .سيتم تحديث جميع البيانات كل 10 دقائق
      </div>

      {/* Monthly Statistics Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-3.5">
        
        {/* 1. إجمالي الماسات */}
        <div className="space-y-1.5">
          <div className="text-xs font-black text-slate-900 flex items-center gap-1">
            <span>💎</span>
            <span>إجمالي الماسات : 50</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div>دخل المذيع: <span className="font-bold text-slate-900">50</span></div>
            <div>دخل الضيف: <span className="font-bold text-slate-900">0</span></div>
            <div>المكافآت: <span className="font-bold text-slate-900">0</span></div>
            <div>حصيلة الماس للغرفة: <span className="font-bold text-slate-900">700</span></div>
            <div className="col-span-2">الرسالة والهدية: <span className="font-bold text-slate-900">0</span></div>
            <div>إيرادات الدردشة النصية: <span className="font-bold text-slate-900">0</span></div>
            <div>إيرادات المكالمات: <span className="font-bold text-slate-900">0</span></div>
          </div>
        </div>

        {/* 2. إجمالي الأيام الصالحة */}
        <div className="py-2 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-black text-emerald-700">إجمالي الأيام الصالحة : 1 يوميًا</span>
        </div>

        {/* 3. إجمالي المدة النشطة */}
        <div className="space-y-1.5 border-t border-slate-100 pt-2">
          <div className="text-xs font-black text-slate-800">
            إجمالي المدة النشطة : 242 دقائق
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div>مدة البث: <span className="font-bold text-slate-900">202 دقائق</span></div>
            <div>مدة الضيف: <span className="font-bold text-slate-900">40 دقائق</span></div>
          </div>
        </div>

        {/* 4. عملات اللعبة المكتسبة */}
        <div className="space-y-1 border-t border-slate-100 pt-2">
          <div className="text-xs font-black text-slate-900">
            عملات اللعبة المكتسبة في الغرفة هذا الشهر :5775
          </div>
          <div className="text-[11px] text-slate-600 px-1">
            دخل اللعبة: <span className="font-bold text-slate-900">0</span>
          </div>
        </div>

        {/* 5. مدة بث اللعبة */}
        <div className="border-t border-slate-100 pt-2 text-xs font-black text-slate-700">
          مدة بث اللعبة : 0 دقائق
        </div>

      </div>

      {/* Daily Section Title & Date Picker */}
      <div className="flex items-center justify-between px-1 pt-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
          <span>{selectedDate}</span>
          <span>📅</span>
        </div>
        <span className="text-sm font-black text-slate-900">يوميًا</span>
      </div>

      {/* Daily Statistics Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-3">
        
        {/* Daily Diamonds */}
        <div className="space-y-1.5">
          <div className="text-xs font-black text-slate-900 flex items-center gap-1">
            <span>💎</span>
            <span>إجمالي الماسات : 0</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div>دخل المذيع: <span className="font-bold text-slate-900">0</span></div>
            <div>دخل الضيف: <span className="font-bold text-slate-900">0</span></div>
            <div>المكافآت: <span className="font-bold text-slate-900">0</span></div>
            <div>حصيلة الماس للغرفة: <span className="font-bold text-slate-900">0</span></div>
            <div className="col-span-2">الرسالة والهدية: <span className="font-bold text-slate-900">0</span></div>
            <div>إيرادات الدردشة النصية: <span className="font-bold text-slate-900">0</span></div>
            <div>إيرادات المكالمات: <span className="font-bold text-slate-900">0</span></div>
          </div>
        </div>

        {/* Daily Active Duration */}
        <div className="space-y-1 border-t border-slate-100 pt-2">
          <div className="text-xs font-black text-slate-800">
            (No) إجمالي المدة النشطة : 0 دقائق
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-600 px-1">
            <div>مدة البث: <span className="font-bold text-slate-900">0 دقائق</span></div>
            <div>مدة الضيف: <span className="font-bold text-slate-900">0 دقائق</span></div>
          </div>
        </div>

        {/* Daily Game Duration */}
        <div className="border-t border-slate-100 pt-2 text-xs font-black text-slate-700">
          مدة بث اللعبة : 0 دقائق
        </div>

        {/* Check Detail Expand Link */}
        <button 
          onClick={() => setShowDetail(!showDetail)}
          className="w-full pt-2 text-center text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 cursor-pointer"
        >
          <span>Check detail</span>
          <span>{showDetail ? '▲' : '⌄'}</span>
        </button>

      </div>

    </div>
  );
};

/* ========================================================================= */
/* 3. CHANGE AGENCY VIEW (تغيير الوكالة)                                     */
/* ========================================================================= */
export const ChangeAgencyView: React.FC<SubViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* 1. طلب التحويل */}
      <div 
        onClick={() => onNavigate('transfer_request')}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black text-slate-900">طلب التحويل</span>
          <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center text-base shadow-xs">
            🔄
          </div>
        </div>
      </div>

      {/* 2. سجل التحويل */}
      <div 
        onClick={() => onNavigate('transfer_history')}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black text-slate-900">سجل التحويل</span>
          <div className="w-9 h-9 rounded-xl bg-slate-700 text-white flex items-center justify-center text-base shadow-xs">
            📋
          </div>
        </div>
      </div>

      {/* 3. تعليقات على التحويل */}
      <div 
        onClick={() => onNavigate('transfer_faq')}
        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
      >
        <ChevronRight className="w-5 h-5 text-slate-400 rotate-180" />
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-black text-slate-900">تعليقات على التحويل</span>
          <div className="w-9 h-9 rounded-xl bg-slate-600 text-white flex items-center justify-center text-base shadow-xs">
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
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        
        <div className="text-center space-y-1 border-b border-slate-100 pb-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center mx-auto text-xl shadow-xs">
            🔄
          </div>
          <h3 className="text-sm font-black text-slate-900">تقديم طلب تحويل الوكالة</h3>
          <p className="text-xs text-slate-500">يحق للمذيع طلب تغيير وكالته الرسمية بعد استيفاء الشروط النظامية</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">معرّف الوكالة الجديدة (Agency ID):</label>
          <input 
            type="text"
            placeholder="مثال: 30045"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">سبب طلب التحويل (اختياري):</label>
          <textarea 
            rows={3}
            placeholder="اكتب سبب طلب النقل..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white resize-none"
          />
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-[11px] text-amber-800 leading-relaxed font-medium">
          ⚠️ تنبيه: يستغرق مراجعة الطلب من 24 إلى 48 ساعة عمل ويجب ألا يكون على حسابك أي مستحقات معلقة.
        </div>

        <label className="flex items-center gap-2 cursor-pointer pt-1">
          <input 
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="rounded border-slate-300 text-slate-800 focus:ring-0 w-4 h-4 cursor-pointer"
          />
          <span className="text-xs font-bold text-slate-700">أوافق على لوائح وسياسات تحويل المذيعين</span>
        </label>

        <button 
          type="submit"
          className="w-full py-3 bg-slate-900 text-white font-black text-xs rounded-2xl shadow-xs hover:bg-slate-800 active:scale-98 transition-all cursor-pointer border border-slate-700"
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
      <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto text-xl">
          📋
        </div>
        <h3 className="text-sm font-black text-slate-900">سجل طلبات التحويل</h3>
        <p className="text-xs text-slate-400 font-bold py-6">لا توجد طلبات تحويل معلقة حالياً</p>
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
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        
        <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">قواعد وشروط تحويل الوكالة</h3>
        
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-black text-slate-900 mb-1">1. متى يحق لي طلب التحويل؟</div>
            <p className="text-slate-600">يحق للمذيع طلب التحويل بعد إكمال المدة المحددة في العقد أو بموافقة الطرفين.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-black text-slate-900 mb-1">2. كم تستغرق فترة المراجعة؟</div>
            <p className="text-slate-600">تتم معالجة الطلبات خلال 24 - 48 ساعة بواسطة إدارة الوكالات المركزية.</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-black text-slate-900 mb-1">3. ماذا يحدث لأرباحي الحالية؟</div>
            <p className="text-slate-600">تحتفظ بكامل أرباحك وتتحول تلقائياً إلى حسابك دون أي نقصان.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ========================================================================= */
/* 7. SUPPORTERS VIEW (داعمي)                                                */
/* ========================================================================= */
export const SupportersView: React.FC<SubViewProps> = () => {
  const [selectedMonth, setSelectedMonth] = useState('2026/08');

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* Month Selector Dropdown */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
          <span>{selectedMonth}</span>
          <span className="text-[10px] text-slate-400">▼</span>
        </div>
        <span className="text-xs font-bold text-slate-500">الفترة المحددة</span>
      </div>

      {/* Supporter Item Card */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        
        {/* Support Diamond Stats */}
        <div className="text-left space-y-0.5">
          <div className="text-[11px] font-bold text-slate-500">إجمالي الدعم هذا الشهر:</div>
          <div className="font-mono font-black text-sm text-slate-900 flex items-center gap-1 justify-end">
            <span>50</span>
            <span>💎</span>
          </div>
        </div>

        {/* User Info & Badges */}
        <div className="flex items-center gap-3">
          <div className="text-right space-y-1">
            <div className="text-xs font-black text-slate-900">(عابر سبيل)</div>
            <div className="text-[10px] font-mono text-slate-500">ID:77989080</div>
            
            {/* Badges Pill Row */}
            <div className="flex items-center justify-end gap-1 text-[9px] font-bold">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">16 💖</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">113 👑</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">25 ♂</span>
            </div>
          </div>

          {/* User Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-300 shadow-2xs">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" 
              alt="عابر سبيل" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>

      {/* Bottom Serial Hash */}
      <div className="text-center pt-8 text-[11px] font-mono text-slate-400 font-bold tracking-widest opacity-80">
        e2b39057dc
      </div>

    </div>
  );
};

/* ========================================================================= */
/* 8. NEW USERS VIEW (مستخدم جديد)                                            */
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
          <div key={i} className="rounded-2xl bg-white border border-slate-200 p-3 shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-1 text-[9px] font-bold">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">{u.star}</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">{u.heart}</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">{u.tag}</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">{u.age}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <div className="text-xs font-black text-slate-900 flex items-center justify-end gap-1">
                  <span>{u.name}</span>
                  <span className="text-xs">{u.flag}</span>
                </div>
              </div>
              <div className="relative">
                <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs" />
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sticky Bottom Attractive Experience Booster Banner */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-md flex items-center gap-2.5 z-50 text-right" dir="rtl">
        <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
          18 👑
        </div>
        <p className="text-[10.5px] font-bold text-slate-800 leading-tight">
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
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">قواعد ميزة المستخدم الجديد</h3>
        <ul className="space-y-2 text-xs text-slate-700 leading-relaxed list-disc list-inside">
          <li>المستخدمون الجدد هم الأعضاء المنضمون للمنصة خلال آخر 14 يوماً.</li>
          <li>استقبال الهدايا من المستخدمين الجدد يمنحك نقاط جاذبية مضاعفة.</li>
          <li>يتم تحديث قائمة المستخدمين النشطين لحظياً حسب التواجد في الغرف.</li>
        </ul>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 10. EARNINGS DETAILS / SALARY SLIP (قسيمة الراتب)                          */
/* ========================================================================= */
export const EarningsDetailsView: React.FC<SubViewProps> = ({ onNavigate }) => {
  const [selectedMonth, setSelectedMonth] = useState('2026/08');

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* Month Picker Dropdown */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-bold text-slate-800">
          <span>{selectedMonth}</span>
          <span className="text-[10px] text-slate-400">▼</span>
        </div>
        <span className="text-xs font-bold text-slate-500">اختر الشهر</span>
      </div>

      {/* Card 1: إجمالي الراتب */}
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-2">
        <div className="text-xs font-bold text-slate-800">إجمالي الراتب:</div>
        <div className="font-mono font-black text-3xl text-emerald-600 text-left" dir="ltr">
          0 $
        </div>
        <div className="text-[11px] font-bold text-slate-500 border-t border-slate-100 pt-2">
          إجمالي الراتب=الراتب الأساسي-الراتب الغير مفكوك
        </div>
      </div>

      {/* Card 2: الراتب الأساسي */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono font-black text-base text-slate-900" dir="ltr">0 $</span>
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <span>الراتب الأساسي:</span>
            <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-[9px] font-bold">؟</span>
          </span>
        </div>
        <div className="text-[11px] font-bold text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
          <span className="font-mono font-bold text-slate-800" dir="ltr">0 $</span>
          <span>راتب المستوى:</span>
        </div>
      </div>

      {/* Card 3: الراتب الغير مفكوك */}
      <div className="rounded-3xl bg-white border border-slate-200 p-4 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono font-black text-base text-slate-900" dir="ltr">0 $</span>
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
            <span>الراتب الغير مفكوك:</span>
            <span className="w-3.5 h-3.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-[9px] font-bold">؟</span>
          </span>
        </div>
        <div className="text-[11px] font-bold text-slate-500 border-t border-slate-100 pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-rose-500 font-bold">غير مكتملة</span>
            <span className="font-mono font-bold text-slate-800">1/7</span>
          </div>
          <span>يوم (أيام) البث:</span>
        </div>
      </div>

      {/* Bottom Link: التحقق من بيانات البث */}
      <div className="pt-2 text-center">
        <button 
          onClick={() => onNavigate('records')}
          className="text-xs font-bold text-slate-700 hover:text-slate-900 underline cursor-pointer"
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
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">عقد ساري المفعول ✅</span>
          <h3 className="text-sm font-black text-slate-900">عقد البث والوكالة الرسمي</h3>
        </div>

        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">الطرف الأول:</div>
            <div>وكالة AbuAmjad الرسمية (ID: 30032)</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">الطرف الثاني (المذيع):</div>
            <div>أبو مجد(M✈️) (ID: 82639599)</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-800 space-y-1">
            <div className="font-black text-slate-900">بنود التعاقد:</div>
            <p>1. يحصل المذيع على كامل أرباح البث المباشر المعتمدة من المنصة.</p>
            <p>2. تلتزم الوكالة بتقديم الدعم الفني، الجوائز، وتسكير التارجت الإضافي.</p>
          </div>
        </div>

        <button 
          onClick={() => showAlert('تم تحميل نسخة من العقد الرقمي الموثق.')}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer border border-slate-700 transition-colors"
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
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-slate-500">رصيد المحفظة المتاح للسحب</span>
          <div className="font-mono font-black text-3xl text-slate-900">$0.00</div>
          <div className="text-[11px] font-bold text-slate-600">50 ماسة 💎 = $0.25 تقريباً</div>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button 
            onClick={() => showAlert('جاري تحويل الماسات إلى رصيد نقدي...')}
            className="py-2.5 px-3 bg-slate-100 border border-slate-200 text-slate-800 rounded-2xl text-xs font-black hover:bg-slate-200 transition-all cursor-pointer"
          >
            استبدال الماسات 💎
          </button>
          <button 
            onClick={() => showAlert('طلب سحب الرصيد إلى حسابك البنكي أو المحفظة الإلكترونية.')}
            className="py-2.5 px-3 bg-slate-900 text-white rounded-2xl text-xs font-black shadow-xs hover:bg-slate-800 transition-all cursor-pointer border border-slate-700"
          >
            سحب الأرباح 💳
          </button>
        </div>

      </div>
    </div>
  );
};
