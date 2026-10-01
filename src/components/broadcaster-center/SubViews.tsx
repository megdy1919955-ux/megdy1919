import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  HelpCircle, 
  Share2, 
  Send, 
  AlertCircle, 
  Sparkles, 
  Shield,
  FileText,
  Calendar,
  Clock,
  DollarSign,
  Gift,
  Search,
  Users
} from 'lucide-react';
import type { SubViewType } from '../BroadcasterCenterModal';
import { HierarchyEntity } from '../../lib/hierarchyService';

interface SubViewProps {
  onNavigate: (view: SubViewType) => void;
  showAlert: (msg: string) => void;
  onWhatsAppContact?: () => void;
  hostProfile?: HierarchyEntity | null;
  currentUserId?: string;
  currentUserName?: string;
}

/* ========================================================================= */
/* 1. MY AGENCY VIEW (وكالتي)                                                */
/* ========================================================================= */
export const MyAgencyView: React.FC<SubViewProps> = ({ showAlert, hostProfile }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const agencyId = hostProfile?.agencyId || 'AG-101';
  const agencyName = 'وكالة النخبة الملكية';
  const ownerId = '1001010';
  const ownerName = 'سلطان الدوسري';
  const supervisorDelegate = hostProfile?.delegateId || 'DEL-401';
  const supervisorManager = hostProfile?.managerId || 'MGR-9901';

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
            <span className="font-mono font-black text-sm text-slate-900">{agencyId}</span>
            <button 
              onClick={() => handleCopy(agencyId, 'معرّف الوكالة')}
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
          <span className="font-bold text-sm text-slate-900">{agencyName}</span>
          <span className="text-xs font-bold text-slate-500">اسم الوكالة:</span>
        </div>

        {/* Row 3: مستوى وتصنيف الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="font-mono font-black text-xs text-amber-700 px-2.5 py-0.5 rounded-md bg-amber-50 border border-amber-200">
            وكالة ملكية معتمدة 👑
          </span>
          <span className="text-xs font-bold text-slate-500">تصنيف الوكالة:</span>
        </div>

        {/* Row 4: معرّف رئيس الوكالة */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-sm text-slate-900">{ownerId}</span>
            <button 
              onClick={() => handleCopy(ownerId, 'معرّف رئيس الوكالة')}
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
          <span className="font-black text-sm text-slate-900">{ownerName}</span>
          <span className="text-xs font-bold text-slate-500">اسم رئيس الوكالة:</span>
        </div>

        {/* Row 6: السلسلة الإدارية */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <span className="font-mono font-bold text-xs text-slate-700">
            {supervisorDelegate} ➔ {supervisorManager} (إدارة أبو أمجد)
          </span>
          <span className="text-xs font-bold text-slate-500">السلسلة الإدارية:</span>
        </div>

        {/* Row 7: الوسيط المشرف إن وجد */}
        {hostProfile?.brokerId && (
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <span className="font-mono font-bold text-xs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              {hostProfile.brokerId} (تركي الشمري)
            </span>
            <span className="text-xs font-bold text-slate-500">الوسيط المشرف:</span>
          </div>
        )}

        {/* Row 8: إعلان الوكالة */}
        <div className="space-y-1.5 py-2 border-b border-slate-100">
          <span className="text-xs font-bold text-slate-500 block">إعلان الوكالة:</span>
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed text-slate-800 font-medium">
            مرحباً بك في وكالة النخبة الملكية! نوفر أعلى حوافز التارجت والدعم الفني والمتابعة المستمرة لرواتب المذيعين.
          </div>
        </div>

        {/* Row 9: الحالة الحالية */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-black">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>مذيع معتمد رسمي ✅</span>
          </div>
          <span className="text-xs font-bold text-slate-500">الحالة:</span>
        </div>

      </div>
    </div>
  );
};

/* ========================================================================= */
/* 2. RECORDS VIEW (سجل البث)                                               */
/* ========================================================================= */
export const RecordsView: React.FC<SubViewProps> = ({ hostProfile }) => {
  const [selectedMonth] = useState('08/2026');
  const [selectedDate] = useState('28/08/2026');
  const hours = hostProfile?.hoursAchieved || 145;
  const diamonds = hostProfile?.monthlyRevenue || 3400000;

  return (
    <div className="w-full max-w-md mx-auto p-3.5 space-y-3.5 font-sans text-right" dir="rtl">
      
      {/* Top Notice Banner */}
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-[11px] font-bold text-emerald-800 leading-relaxed shadow-2xs">
        يتم احتساب ساعات وألماس البث الصوتي والمرئي الحقيقي في السيرفر وتحديث الإحصائيات لحظة بلحظة.
      </div>

      {/* Monthly Section Title & Date Picker */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-black text-slate-900">سجل إحصائيات الشهر</h3>
        <span className="text-xs font-bold font-mono bg-slate-100 text-slate-700 px-2 py-1 rounded-lg border border-slate-200">
          {selectedMonth}
        </span>
      </div>

      {/* Card with Stats */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-mono font-black text-sm text-slate-900">{diamonds.toLocaleString()} 💎</span>
          <span className="text-xs font-bold text-slate-500">إجمالي الألماس المستلم:</span>
        </div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-mono font-black text-sm text-slate-900">{hours} ساعة</span>
          <span className="text-xs font-bold text-slate-500">ساعات البث المنجزة:</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono font-black text-sm text-emerald-600">مكتمل 100% ✨</span>
          <span className="text-xs font-bold text-slate-500">حالة التارجت:</span>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 3. CHANGE AGENCY VIEW (تغيير الوكالة)                                      */
/* ========================================================================= */
export const ChangeAgencyView: React.FC<SubViewProps> = ({ onNavigate }) => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900">إجراءات تغيير الوكالة</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          يمكنك تقديم طلب نقل أو تغيير الوكالة وفقاً لشروط المنصة. يتطلب النقل موافقة الطرفين أو مرور 30 يوماً منذ آخر تحويل.
        </p>
        <button 
          onClick={() => onNavigate('transfer_request')}
          className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
        >
          تقديم طلب نقل وكالة جديد
        </button>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 4. TRANSFER REQUEST VIEW (طلب التحويل)                                     */
/* ========================================================================= */
export const TransferRequestView: React.FC<SubViewProps> = ({ showAlert, onNavigate }) => {
  const [targetAgency, setTargetAgency] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAgency.trim()) return;
    showAlert(`تم إرسال طلب النقل إلى الوكالة (${targetAgency}) بنجاح للمراجعة.`);
    onNavigate('main');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900">بيانات طلب النقل</h3>
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">معرف الوكالة الجديدة (Agency ID):</label>
          <input 
            type="text" 
            value={targetAgency}
            onChange={(e) => setTargetAgency(e.target.value)}
            placeholder="مثال: AG-102"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 outline-none focus:border-slate-400"
            required
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-600 block mb-1">سبب التحويل:</label>
          <textarea 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="اكتب سبب طلب النقل بالتفصيل..."
            rows={3}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-slate-400"
          />
        </div>
        <button 
          type="submit"
          className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-slate-800 transition-colors cursor-pointer"
        >
          إرسال طلب النقل
        </button>
      </form>
    </div>
  );
};

/* ========================================================================= */
/* 5. TRANSFER HISTORY VIEW (سجل التحويل)                                     */
/* ========================================================================= */
export const TransferHistoryView: React.FC<SubViewProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-slate-900">سجل طلبات التحويل</h3>
        <p className="text-xs text-slate-500">لا توجد طلبات تحويل سابقة مسجلة على هذا الحساب.</p>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 6. TRANSFER FAQ VIEW (تعليقات على التحويل)                                  */
/* ========================================================================= */
export const TransferFaqView: React.FC<SubViewProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-slate-900">الأسئلة الشائعة حول النقل</h3>
        <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
          <li>هل تضيع أرباحي عند نقل الوكالة؟ لا، الأرباح المستلمة تسجل باسمك.</li>
          <li>كم يستغرق طلب النقل؟ من 24 إلى 48 ساعة كحد أقصى.</li>
        </ul>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 7. SUPPORTERS VIEW (داعمي)                                                */
/* ========================================================================= */
export const SupportersView: React.FC<SubViewProps> = () => {
  const mockSupporters = [
    { name: 'فهد آل سعود', coins: '1,200,000', rank: '1 👑', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
    { name: 'صقر قريش', coins: '850,000', rank: '2 🥈', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
    { name: 'أمير الصحراء', coins: '430,000', rank: '3 🥉', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' }
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">كبار الداعمين في البث</h3>
        <div className="space-y-2.5">
          {mockSupporters.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="font-mono font-black text-xs text-amber-600">{s.coins} 🪙</span>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-900">{s.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">المرتبة {s.rank}</div>
                </div>
                <img src={s.avatar} alt={s.name} className="w-9 h-9 rounded-full object-cover border border-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 8. NEW USERS VIEW (مستخدم جديد)                                           */
/* ========================================================================= */
export const NewUsersView: React.FC<SubViewProps> = () => {
  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-slate-900">مستخدم جديد</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          استقطاب المستخدمين الجدد في غرفتك يزيد من فرصة مضاعفة نقاط الراتب ومكافآت التارجت الأسبوعية.
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
        <h3 className="text-sm font-black text-slate-900">قواعد المستخدم الجديد</h3>
        <p className="text-xs text-slate-600">شروط وقواعد احتساب تفاعل المستخدمين الجدد المنضمين خلال آخر 14 يوماً.</p>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 10. EARNINGS DETAILS (تفاصيل الأرباح)                                      */
/* ========================================================================= */
export const EarningsDetailsView: React.FC<SubViewProps> = ({ hostProfile }) => {
  const diamonds = hostProfile?.monthlyRevenue || 3400000;
  const estimatedDollars = (diamonds / 100000).toFixed(2);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2">قسيمة الراتب والأرباح</h3>
        <div className="flex items-center justify-between">
          <span className="font-mono font-black text-lg text-emerald-600">${estimatedDollars}</span>
          <span className="text-xs font-bold text-slate-600">الراتب التقديري للشهر:</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
          <span className="font-mono font-bold text-xs text-slate-800">{diamonds.toLocaleString()} 💎</span>
          <span className="text-xs font-bold text-slate-500">الألماس المحسوب:</span>
        </div>
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 11. CONTRACTS VIEW (العقود)                                                */
/* ========================================================================= */
export const ContractsView: React.FC<SubViewProps> = ({ hostProfile, currentUserName, currentUserId, showAlert }) => {
  const name = hostProfile?.name || currentUserName || 'سارة الرياض';
  const uid = hostProfile?.userId || currentUserId || '1001022';
  const agency = hostProfile?.agencyId || 'AG-101';

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black">عقد ساري المفعول ✅</span>
          <h3 className="text-sm font-black text-slate-900">عقد البث والوكالة الرسمي</h3>
        </div>

        <div className="space-y-2 text-xs text-slate-700 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">الطرف الأول (الوكالة):</div>
            <div>وكالة النخبة الملكية (كود: {agency}) - تحت إشراف إدارة أبو أمجد (MGR-9901)</div>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-900 mb-1">الطرف الثاني (المذيع المعتمد):</div>
            <div>{name} (الرقم الموحد: {uid} | الكود: {hostProfile?.id || 'HOST-101-01'})</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-800 space-y-1">
            <div className="font-black text-slate-900">بنود التعاقد:</div>
            <p>1. يحصل المذيع على كامل أرباح البث المباشر المعتمدة ومكافآت التارجت المقررة.</p>
            <p>2. تلتزم الوكالة بتقديم الدعم الفني، الجوائز، وتسكير التارجت الإضافي.</p>
          </div>
        </div>

        <button 
          onClick={() => showAlert('تم تحميل نسخة من العقد الرقمي الموثق بنجاح.')}
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
export const WalletView: React.FC<SubViewProps> = ({ hostProfile, showAlert }) => {
  const diamonds = hostProfile?.monthlyRevenue || 3400000;
  const dollars = (diamonds / 100000).toFixed(2);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4 font-sans text-right" dir="rtl">
      <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-slate-500">رصيد المحفظة المتاح للسحب</span>
          <div className="font-mono font-black text-3xl text-slate-900">${dollars}</div>
          <div className="text-[11px] font-bold text-slate-600">{diamonds.toLocaleString()} ماسة 💎</div>
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
