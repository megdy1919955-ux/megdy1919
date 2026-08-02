import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Crown, Megaphone, Trophy, ThumbsUp, Rocket, Ticket, Mic, Store,
  ChevronLeft, Sparkles, Gift, Share2, Copy, Check, Users, Star, Award, Zap, Flame,
  QrCode, ArrowUpRight, FileText, UserCheck, Wallet, ArrowLeftRight, Download,
  Building, Calendar, Clock, Eye, Send, CheckCircle2, ShieldCheck, CreditCard,
  DollarSign, RefreshCw, AlertCircle, PhoneCall, Filter
} from 'lucide-react';

export type ServiceType = 
  | 'vip' 
  | 'events' 
  | 'genius' 
  | 'friendly_points' 
  | 'invitations' 
  | 'invite_card' 
  | 'agency'
  | 'broadcasters' 
  | 'mall';

interface ServicesModalProps {
  activeService: ServiceType | null;
  onClose: () => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({ activeService, onClose }) => {
  const [copiedCode, setCopiedCode] = React.useState(false);
  const [showEarningsDetails, setShowEarningsDetails] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState('2026/07');
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [selectedStarNode, setSelectedStarNode] = React.useState<{
    id: number;
    amount: string;
    diamondsReq: string;
    unlocked: boolean;
    claimed: boolean;
    title: string;
    description: string;
  } | null>(null);
  const [claimedRewards, setClaimedRewards] = React.useState<number[]>([1, 2]);

  const starNodes = [
    { id: 1, amount: '$1.00', diamondsReq: '20,000 ألماس', unlocked: true, title: 'النجمة الأولى 🌟', description: 'وصلت إلى 20,000 ألماس هدايا وتم صرف المكافأة بنجاح!' },
    { id: 2, amount: '$1.00', diamondsReq: '50,000 ألماس', unlocked: true, title: 'النجمة الثانية ⭐', description: 'وصلت إلى 50,000 ألماس هدايا وتم صرف المكافأة بنجاح!' },
    { id: 3, amount: '$7.00', diamondsReq: '100,000 ألماس', unlocked: true, title: 'النجمة الذهبية المتألقة ✨', description: 'تهانينا! حققت هدف 100,000 ألماس هدايا. يمكنك الآن استلام مكافأتك المالية المباشرة.' },
    { id: 4, amount: '$6.00', diamondsReq: '150,000 ألماس', unlocked: false, title: 'النجمة المتقدمة 💫', description: 'يتطلب الوصول إلى 150,000 ألماس هدايا لفتح هذه المكافأة. يتبقى لك 49,900 ألماس.' },
    { id: 5, amount: '$7.00', diamondsReq: '200,000 ألماس', unlocked: false, title: 'النجمة الفائقة 🌌', description: 'المستوى الأقصى للمسار النجمي. يتطلب الوصول إلى 200,000 ألماس هدايا.' },
  ];

  type ToolModalType = 
    | 'agency' 
    | 'stream_logs' 
    | 'wallet' 
    | 'change_agency' 
    | 'supporters' 
    | 'new_user' 
    | 'invoice_download' 
    | 'agency_announcements' 
    | null;

  const [activeToolModal, setActiveToolModal] = React.useState<ToolModalType>(null);
  const [withdrawAmount, setWithdrawAmount] = React.useState('5.00');
  const [withdrawMethod, setWithdrawMethod] = React.useState('usdt');
  const [withdrawAddress, setWithdrawAddress] = React.useState('0x71C...9B2d');
  const [withdrawSuccess, setWithdrawSuccess] = React.useState(false);
  const [agencyTargetId, setAgencyTargetId] = React.useState('');
  const [agencyChangeReason, setAgencyChangeReason] = React.useState('انتهاء العقد والبحث عن دعم أكبر');
  const [agencyNotes, setAgencyNotes] = React.useState('');
  const [agencyRequestSubmitted, setAgencyRequestSubmitted] = React.useState(false);
  const [thankedSupporters, setThankedSupporters] = React.useState<number[]>([]);
  const [newUserName, setNewUserName] = React.useState('');
  const [newUserPhone, setNewUserPhone] = React.useState('');
  const [newUserCategory, setNewUserCategory] = React.useState('سوالف وبودكاست');
  const [newUserRegistered, setNewUserRegistered] = React.useState(false);
  const [invoiceDownloading, setInvoiceDownloading] = React.useState(false);
  const [invoiceDownloaded, setInvoiceDownloaded] = React.useState(false);
  const [announcementText, setAnnouncementText] = React.useState('');
  const [announcementSent, setAnnouncementSent] = React.useState(false);

  React.useEffect(() => {
    setShowEarningsDetails(false);
    setIsDatePickerOpen(false);
    setActiveToolModal(null);
    setWithdrawSuccess(false);
    setAgencyRequestSubmitted(false);
    setNewUserRegistered(false);
    setInvoiceDownloaded(false);
    setAnnouncementSent(false);
  }, [activeService]);

  if (!activeService) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const renderContent = () => {
    switch (activeService) {
      case 'vip':
        return (
          <div className="space-y-4">
            {/* VIP Header Banner */}
            <div className="relative rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 p-5 text-slate-950 overflow-hidden shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full">
                    المستوى المباشر
                  </span>
                  <h3 className="text-2xl font-black mt-1">عضوية VIP8 الملكية</h3>
                  <p className="text-xs text-slate-900/80 font-bold mt-0.5">متبقي 120 يوماً على تجديد الاشتراك</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 border-2 border-yellow-200 shadow-lg">
                  <Crown className="w-8 h-8 fill-amber-300" />
                </div>
              </div>
            </div>

            {/* VIP Perks */}
            <div>
              <h4 className="text-xs font-black text-slate-900 mb-2.5">امتيازات مستوى VIP8</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { title: 'شارة VIP ذهبية', desc: 'تظهر بجانب اسمك بكل مكان', icon: Sparkles, color: 'text-amber-500' },
                  { title: 'تأثير دخول فاخر', desc: 'سيارة لامبورغيني عند دخول الروم', icon: Flame, color: 'text-rose-500' },
                  { title: 'خصم 20% بالمتجر', desc: 'على كافة الإطارات والمظاهر', icon: Gift, color: 'text-purple-500' },
                  { title: 'حماية طرد الغرف', desc: 'حصانة كاملة داخل الغرف الصوتية', icon: Crown, color: 'text-amber-600' },
                ].map((perk, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
                    <perk.icon className={`w-5 h-5 ${perk.color} shrink-0 mt-0.5`} />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{perk.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{perk.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-md hover:opacity-95 cursor-pointer">
              ترقية أو تمديد VIP
            </button>
          </div>
        );

      case 'events':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Megaphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black">فعاليات الموسم الذهبي</h3>
                  <p className="text-xs text-sky-100 font-medium">شارك في التحديات اليومية واربح ملايين الألماس</p>
                </div>
              </div>
            </div>

            {/* Active Events List */}
            <div className="space-y-2.5">
              {[
                { title: 'مهرجان الداعمين الصيفي', date: 'ينتهي بعد 2 أيام', prize: '1,000,000 ألماس', badge: 'مباشر الآن', bg: 'bg-rose-50 border-rose-100' },
                { title: 'بطولة المعارك الصوتية', date: 'تبدأ غداً الساعة 8 مساءً', prize: 'إطار طائرة أسطوري', badge: 'قريباً', bg: 'bg-purple-50 border-purple-100' },
                { title: 'مسابقة أجمل صوت', date: 'مستمرة طوال الأسبوع', prize: 'شارة نجم الغناء', badge: 'نشط', bg: 'bg-amber-50 border-amber-100' },
              ].map((ev, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl border ${ev.bg} flex items-center justify-between`}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-slate-900">{ev.title}</span>
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-slate-900 text-white">
                        {ev.badge}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium">الجائزة: <strong className="text-slate-800">{ev.prize}</strong></div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{ev.date}</div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-sky-500 text-white font-black text-xs hover:bg-sky-600 cursor-pointer">
                    انضمام
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'genius':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 text-white shadow-md text-center">
              <Trophy className="w-10 h-10 mx-auto text-yellow-300 fill-yellow-300 animate-bounce mb-1" />
              <h3 className="text-xl font-black">منصة جينيس للتتويج</h3>
              <p className="text-xs text-pink-100 font-medium">قائمة المتصدرين والأساطير على مستوى التطبيق</p>
            </div>

            {/* Top 3 Podiums */}
            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center">
                <span className="text-xs font-black text-slate-500 mb-1">#2 الأسطورة</span>
                <div className="w-10 h-10 rounded-full bg-slate-300 border-2 border-white mb-1 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" alt="Rank 2" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-800 truncate w-full">سارة</span>
                <span className="text-[10px] text-purple-600 font-mono font-bold mt-0.5">850K pt</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex flex-col items-center shadow-md -translate-y-2">
                <Crown className="w-5 h-5 text-amber-500 fill-amber-400 mb-0.5" />
                <div className="w-12 h-12 rounded-full bg-amber-400 border-2 border-amber-200 mb-1 overflow-hidden shadow-xs">
                  <img src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=150" alt="Rank 1" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-black text-slate-900 truncate w-full">الأمير أسامة</span>
                <span className="text-[10px] text-amber-600 font-mono font-black mt-0.5">1.2M pt</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center">
                <span className="text-xs font-black text-amber-700 mb-1">#3 النجم</span>
                <div className="w-10 h-10 rounded-full bg-amber-200 border-2 border-white mb-1 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Rank 3" className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-bold text-slate-800 truncate w-full">فارس</span>
                <span className="text-[10px] text-purple-600 font-mono font-bold mt-0.5">620K pt</span>
              </div>
            </div>
          </div>
        );

      case 'friendly_points':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-md flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900/80">رصيدك الحالي من النقاط</span>
                <div className="text-3xl font-black font-mono tracking-tight text-slate-950 mt-0.5">2,922</div>
                <p className="text-[11px] text-slate-900/70 font-semibold mt-1">تكتسب النقاط الودية من خلال التفاعل والإهداءات</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0 border border-amber-200 shadow-md">
                <ThumbsUp className="w-8 h-8 fill-amber-400" />
              </div>
            </div>

            {/* Redeem Rewards */}
            <div>
              <h4 className="text-xs font-black text-slate-900 mb-2">استبدال النقاط الودية</h4>
              <div className="space-y-2">
                {[
                  { title: 'إطار الوردة الرومانسية (7 أيام)', pts: '1,000 نقطة' },
                  { title: 'مؤثر ورود عند إرسال الرسائل', pts: '1,500 نقطة' },
                  { title: 'صندوق هدايا عشوائي', pts: '2,500 نقطة' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.title}</div>
                      <div className="text-[10px] text-amber-600 font-bold mt-0.5">{item.pts}</div>
                    </div>
                    <button className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-400 cursor-pointer">
                      استبدال
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'invitations':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-2">
                <Rocket className="w-7 h-7 text-amber-300" />
              </div>
              <h3 className="text-xl font-black">مركز الدعوات (ادعُ واربح)</h3>
              <p className="text-xs text-indigo-100 font-medium mt-1">احصل على 500 ألماس مجاناً لكل صديق ينضم عبر رابطك!</p>
            </div>

            {/* Invite Stats */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <div className="text-xs text-indigo-600 font-bold">الأصدقاء المدعوون</div>
                <div className="text-xl font-black text-slate-900 mt-1">14 صديقاً</div>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                <div className="text-xs text-emerald-600 font-bold">مجموع الأرباح</div>
                <div className="text-xl font-black text-emerald-700 mt-1">7,000 ألماس</div>
              </div>
            </div>

            {/* Referral Link Box */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <label className="text-xs font-bold text-slate-600 block mb-1">كود الدعوة الخاص بك</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="INVITE-99201"
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 text-center"
                />
                <button
                  onClick={() => handleCopy('INVITE-99201')}
                  className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center gap-1 hover:bg-indigo-700 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCode ? 'تم النسخ' : 'نسخ'}</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 'invite_card':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-black text-slate-900">بطاقة الدعوة الخاصة بك</h3>
              <p className="text-xs text-slate-500 mt-0.5">شارك هذه البطاقة المصممة لتسهيل انضمام أصدقائك</p>
            </div>

            {/* Stylized Invitation Card Preview */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 text-white shadow-xl relative overflow-hidden border border-indigo-400/30">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  </div>
                  <div>
                    <div className="text-xs font-black">أحمد علي</div>
                    <div className="text-[10px] text-indigo-300">دعوة للانضمام إلى الغرفة الصوتية</div>
                  </div>
                </div>
                <Ticket className="w-6 h-6 text-amber-300" />
              </div>

              {/* QR Code Concept */}
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                <div className="space-y-1">
                  <span className="text-[10px] text-amber-300 font-bold block">امسح الكود للانضمام</span>
                  <div className="text-xs font-mono font-bold text-white">ID: 8829103</div>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl p-1 flex items-center justify-center shrink-0">
                  <QrCode className="w-10 h-10 text-slate-900" />
                </div>
              </div>
            </div>

            <button className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-black text-xs shadow-md hover:bg-emerald-600 cursor-pointer flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              <span>مشاركة بطاقة الدعوة</span>
            </button>
          </div>
        );

      case 'agency':
        if (showEarningsDetails) {
          return (
            <div className="space-y-4" dir="rtl">
              {/* زر العودة إلى القائمة الرئيسية للوكالة */}
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-sm">
                <button 
                  onClick={() => setShowEarningsDetails(false)}
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                  <span>العودة إلى لوحة الوكالة</span>
                </button>
                <span className="text-xs font-black text-slate-200">تفاصيل أرباح الوكالة</span>
              </div>

              {/* شريط اختيار الشهر والتاريخ التفاعلي */}
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3.5 rounded-2xl shadow-md relative">
                <span className="text-xs font-bold text-slate-300">اختر الشهر</span>
                
                <div 
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl cursor-pointer hover:border-slate-700 transition-all"
                >
                  <span className="text-xs font-bold text-white">{selectedDate}</span>
                  <span className="text-slate-400 text-xs">▼</span>
                </div>

                {/* قائمة منسدلة لاختيار الشهور */}
                {isDatePickerOpen && (
                  <div className="absolute left-3.5 top-14 w-36 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-1.5 z-50 space-y-1">
                    {['2026/08', '2026/07', '2026/06', '2026/05'].map((date) => (
                      <div 
                        key={date}
                        onClick={() => {
                          setSelectedDate(date);
                          setIsDatePickerOpen(false);
                        }}
                        className={`text-xs px-3 py-2 rounded-xl cursor-pointer font-bold transition-all ${
                          selectedDate === date ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        {date}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* بطاقة إجمالي الراتب */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 border border-blue-500/40 rounded-3xl p-5 shadow-xl space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">إجمالي الراتب:</span>
                  <span className="text-2xl font-black text-emerald-400">76 $</span>
                </div>
                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  <p className="text-[10px] text-slate-400">إجمالي الراتب = العمولة الأساسية - العمولة المفكوكَة</p>
                  <p className="text-[10px] text-rose-400 font-bold">أرباح مجمدة $ 0.00</p>
                </div>
              </div>

              {/* العمولة الأساسية */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">العمولة الأساسية:</span>
                  <span className="text-xs text-slate-500 cursor-pointer">❓</span>
                </div>
                <span className="text-sm font-black text-blue-400">95 $</span>
              </div>

              {/* العمولة المفكوكَة */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">العمولة المفكوكَة:</span>
                    <span className="text-xs text-slate-500 cursor-pointer">❓</span>
                  </div>
                  <span className="text-sm font-black text-blue-400">19 $</span>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">ماس الوكالة المستلم:</span>
                    <span className="font-bold text-white">4,895,304</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">سعر عمولة الوكالة:</span>
                    <span className="font-bold text-white">0.8</span>
                  </div>
                </div>
              </div>

              {/* حصة الوسيط */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-md">
                <span className="text-xs font-bold text-slate-300">حصة الوسيط:</span>
                <span className="text-sm font-black text-blue-400">22 $</span>
              </div>

              {/* الراتب المرسل والسجل التاريخي */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-md space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-300">الراتب المرسل:</span>
                    <span className="text-xs text-slate-500 cursor-pointer">❓</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-400 font-black">
                    <span>🪙</span>
                    <span>54</span>
                  </div>
                </div>

                {/* قائمة العمليات والتاريخ */}
                <div className="space-y-2.5 pt-1">
                  {[
                    { amount: 3, date: "2026-07-31T04:53:41Z" },
                    { amount: 3, date: "2026-07-29T04:52:13Z" },
                    { amount: 1, date: "2026-07-25T04:48:46Z" },
                    { amount: 3, date: "2026-07-23T04:47:47Z" },
                    { amount: 5, date: "2026-07-21T04:46:36Z" },
                    { amount: 1, date: "2026-07-19T04:43:29Z" },
                    { amount: 2, date: "2026-07-18T04:42:41Z" },
                    { amount: 36, date: "2026-07-17T04:41:14Z" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-none text-xs">
                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                        <span>🪙</span>
                        <span>{item.amount}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono" dir="ltr">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* زر تنزيل بيانات المذيع في الأسفل */}
              <button className="w-full py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-2xl text-blue-400 font-bold text-xs transition-all shadow-md cursor-pointer">
                تنزيل بيانات المذيع
              </button>
            </div>
          );
        }

        return (
          <div className="space-y-4 w-full max-w-full overflow-x-hidden touch-pan-y" dir="rtl">
            {/* 1. بطاقة الأرباح العلوية الاحترافية */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 p-5 rounded-3xl text-white shadow-2xl border border-blue-500/30">
              <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-tr from-blue-400 to-indigo-500 shadow-md">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60" 
                      alt="AbuAmjad" 
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">AbuAmjad</h3>
                    <span className="text-[10px] text-blue-300 font-semibold bg-blue-500/20 px-2 py-0.5 rounded-lg border border-blue-500/30">GID:30032</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowEarningsDetails(true)}
                  className="text-[11px] font-bold text-blue-200 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md transition-all shadow-sm cursor-pointer"
                >
                  تفاصيل الأرباح
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-white/10 relative z-10">
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <span className="text-2xl font-black text-white block tracking-tight">54.00</span>
                  <span className="text-[10px] text-blue-300 font-medium">أرباح الشهر الحالي ($)</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                  <span className="text-2xl font-black text-white block tracking-tight">0</span>
                  <span className="text-[10px] text-slate-400 font-medium">أرباح الأمس ($)</span>
                </div>
              </div>
            </div>

            {/* 2. إحصائيات الوكالة */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400">إحصائيات الوكالة</h4>
                <span className="text-[10px] text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20">تحديث فوري</span>
              </div>
              
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                  <span className="text-xs text-slate-300 font-medium">إجمالي الماسات لهذا الشهر</span>
                  <span className="text-sm font-black text-blue-400">164,800</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-2xl border border-slate-800/80">
                  <span className="text-xs text-slate-300 font-medium">نسبة العمولة</span>
                  <span className="text-sm font-black text-emerald-400">0.80</span>
                </div>
              </div>
            </div>

            {/* 3. إحصائيات المشيف */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-400">إحصائيات المشيف</h4>
                <span className="text-xs text-blue-400 cursor-pointer font-bold hover:underline">عرض التفاصيل</span>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                  <span className="text-xs text-slate-300 leading-relaxed">0 المضيفين لم تستكمل أيام البث المطلوبة</span>
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold shadow-md transition-all shrink-0">عرض</button>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl">
                  <span className="text-xs text-slate-300 leading-relaxed">0 من المضيفين شهدت انخفاضًا كبيرًا (-20.00%) في الماسات</span>
                  <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold shadow-md transition-all shrink-0">عرض</button>
                </div>
              </div>
            </div>

            {/* 4. مركز المهام */}
            <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-400">مركز المهام</h4>
                <span className="text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">نشط</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-bold text-white block">توظيف مضيفين جدد:</span>
                <p className="text-[10px] text-slate-400">قم بتوظيف 1 من المضيفين الجدد الصالحين هذا الشهر</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>التقدم (1/1)</span>
                  <span className="text-amber-400">100%</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800 shadow-inner">
                  <div className="bg-gradient-to-r from-amber-600 to-yellow-500 h-full rounded-full w-full"></div>
                </div>
              </div>
            </div>

            {/* 5. بطاقات الإجراءات الخاصة (دعوة المذيعين وإنشاء وكيل شحن) */}
            <div className="grid grid-cols-1 gap-2.5">
              <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border border-blue-500/30 rounded-2xl p-3.5 flex items-center justify-between shadow-md cursor-pointer hover:border-blue-400 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 text-lg">
                    📨
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">دعوة المذيعين</span>
                    <span className="text-[10px] text-blue-200">انضمام أعضاء جدد لوكالتك</span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </div>

              <div className="bg-gradient-to-r from-slate-900 to-slate-900 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between shadow-md cursor-pointer hover:border-slate-700 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg">
                    🪙
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">إنشاء وكيل شحن (2/3)</span>
                    <span className="text-[10px] text-slate-400">إدارة الوسطاء والموزعين</span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* 6. شبكة أدواتي */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg space-y-3">
              <h4 className="text-xs font-bold text-slate-400">أدواتي</h4>
              
              <div className="grid grid-cols-4 gap-2.5 text-center">
                <div className="flex flex-col items-center justify-center gap-1.5 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl cursor-pointer hover:bg-slate-800/40 transition-all">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <span className="text-[10px] font-bold text-slate-300">معلومات الوكالة</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl cursor-pointer hover:bg-slate-800/40 transition-all">
                  <UserCheck className="w-5 h-5 text-purple-400" />
                  <span className="text-[10px] font-bold text-slate-300">مركز الوسطاء</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl cursor-pointer hover:bg-slate-800/40 transition-all">
                  <Mic className="w-5 h-5 text-rose-400" />
                  <span className="text-[10px] font-bold text-slate-300">مركز المذيعين</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl cursor-pointer hover:bg-slate-800/40 transition-all">
                  <Wallet className="w-5 h-5 text-amber-400" />
                  <span className="text-[10px] font-bold text-slate-300">محفظتي</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl cursor-pointer hover:bg-slate-800/40 transition-all">
                  <ArrowLeftRight className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] font-bold text-slate-300">سجل التحويل</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl cursor-pointer hover:bg-slate-800/40 transition-all">
                  <Download className="w-5 h-5 text-cyan-400" />
                  <span className="text-[10px] font-bold text-slate-300">Download invoice</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1.5 bg-slate-950/60 border border-slate-800/80 p-3 rounded-2xl cursor-pointer hover:bg-slate-800/40 transition-all col-span-2">
                  <Megaphone className="w-5 h-5 text-amber-500" />
                  <span className="text-[10px] font-bold text-slate-300">إعلان الوكالة</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'broadcasters':
        return (
          <div className="space-y-4 text-right bg-slate-50/90 -m-5 p-5 min-h-full relative" dir="rtl">
            {/* 1. Purple Earnings Card (Dominant Overlapping Profile Image & Symmetrical Earnings) */}
            <div className="relative mt-7 pt-9 pb-4 px-4 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl text-white shadow-xl space-y-4">
              {/* Background Glows */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

              {/* DOMINANT FLOATING PROFILE PICTURE (الصورة البارزة المتداخلة على الحد العلوي) */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-0.5 shadow-[0_10px_20px_-3px_rgba(0,0,0,0.4)] ring-4 ring-slate-50/90">
                  <div className="w-full h-full rounded-full bg-purple-950 flex items-center justify-center text-amber-300 font-black text-base border-2 border-amber-300">
                    عابر
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-purple-950 flex items-center justify-center text-[8px] text-white shadow-xs">
                    ✓
                  </div>
                </div>
              </div>

              {/* USER INFORMATION (الاسم والـ ID فقط بدون أي وسام) */}
              <div className="flex flex-col items-center justify-center text-center space-y-0.5 pt-0.5 relative z-10">
                {/* User Name */}
                <h3 className="text-base font-black text-white tracking-wide">(عابرسيل)</h3>

                {/* User UID */}
                <p className="text-[11px] text-purple-200/90 font-mono font-bold tracking-wider">UID: 77989080</p>
              </div>

              {/* Symmetrical Earnings Grid (أرباح الشهر الحالي & أرباح اليوم) */}
              <div className="grid grid-cols-2 gap-2.5 text-center pt-2 relative z-10 border-t border-white/15">
                {/* Current Month Earnings */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 space-y-1 shadow-inner hover:bg-white/15 transition-all">
                  <div className="text-[11px] font-extrabold text-purple-100">أرباح الشهر الحالي ($)</div>
                  <div className="text-xl font-black tracking-tight text-amber-300 font-mono">5.00 $</div>
                  <div className="bg-purple-950/40 rounded-xl px-2.5 py-1 text-[10px] font-bold text-purple-200 flex justify-between items-center border border-white/10">
                    <span>دخل الهدايا:</span>
                    <span className="font-mono text-amber-300 font-black">5.00 $</span>
                  </div>
                </div>

                {/* Today Earnings */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 space-y-1 shadow-inner hover:bg-white/15 transition-all">
                  <div className="text-[11px] font-extrabold text-purple-100">أرباح اليوم ($)</div>
                  <div className="text-xl font-black tracking-tight text-amber-300 font-mono">5.00 $</div>
                  <div className="bg-purple-950/40 rounded-xl px-2.5 py-1 text-[10px] font-bold text-purple-200 flex justify-between items-center border border-white/10">
                    <span>دخل الهدايا:</span>
                    <span className="font-mono text-amber-300 font-black">5.00 $</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Achievement & Host Level Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Left Card: Best Achievement */}
              <div className="bg-amber-100/80 border border-amber-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer">
                <ChevronLeft className="w-4 h-4 text-amber-700/60" />
                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-800/80 block">أفضل إنجاز</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block flex items-center gap-1">
                    557.9K <span className="text-xs">💎</span>
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl shadow-xs">
                  🏆
                </div>
              </div>

              {/* Right Card: Host Level */}
              <div className="bg-purple-100/80 border border-purple-200/90 rounded-2xl p-3.5 flex items-center justify-between shadow-xs hover:shadow-md transition-all cursor-pointer">
                <ChevronLeft className="w-4 h-4 text-purple-700/60" />
                <div className="text-right">
                  <span className="text-[10px] font-bold text-purple-800/80 block">مستوى المضيف</span>
                  <span className="text-sm font-black text-slate-900 mt-0.5 block">LV.0</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl shadow-xs">
                  🎙️
                </div>
              </div>
            </div>

            {/* 3. PERFORMANCE & MONTHLY SALARY BOX (مربع الأداء والراتب الشهري) */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-4 shadow-sm space-y-4">
              {/* Header with Salary Title & Earnings Details Button */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button 
                  onClick={() => setShowEarningsDetails(true)}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>تفاصيل الأرباح</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="bg-sky-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                    <span>🕒 29أيام 4ساعات</span>
                  </span>
                  <h4 className="text-xs font-black text-slate-800">الراتب الشهري</h4>
                </div>
              </div>

              {/* HIGH PROMINENCE STREAMING METRICS (بيانات البث المباشر) */}
              <div className="grid grid-cols-3 gap-2">
                {/* 1. Diamonds Metric Box */}
                <div className="bg-gradient-to-b from-indigo-50/60 to-slate-50 border border-indigo-100/80 p-3 rounded-2xl text-center shadow-xs hover:border-indigo-300 transition-all">
                  <div className="text-xs font-black text-indigo-600 font-mono">100.1K 💎</div>
                  <div className="text-[10px] font-bold text-slate-600 mt-1">إجمالي الألماس</div>
                  <div className="text-[9px] text-emerald-600 font-extrabold mt-0.5">($5.00)</div>
                </div>

                {/* 2. Days Metric Box */}
                <div className="bg-gradient-to-b from-amber-50/60 to-slate-50 border border-amber-200/60 p-3 rounded-2xl text-center shadow-xs hover:border-amber-300 transition-all">
                  <div className="text-xs font-black text-slate-900 font-mono">
                    <span className="text-amber-600 text-sm font-black">2</span> / 7 أيام
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 mt-1">أيام البث المؤهلة</div>
                  <div className="text-[9px] text-amber-700 font-extrabold mt-0.5">28% مكتمل</div>
                </div>

                {/* 3. Hours Metric Box */}
                <div className="bg-gradient-to-b from-purple-50/60 to-slate-50 border border-purple-200/60 p-3 rounded-2xl text-center shadow-xs hover:border-purple-300 transition-all">
                  <div className="text-xs font-black text-slate-900 font-mono">
                    <span className="text-purple-600 text-sm font-black">5</span> / 7 ساعات
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 mt-1">ساعات البث المؤهلة</div>
                  <div className="text-[9px] text-purple-700 font-extrabold mt-0.5">71% مكتمل</div>
                </div>
              </div>

              {/* STAR PATH SYSTEM (نظام المسار النجمي للمكافآت) */}
              <div className="bg-slate-950 text-white rounded-2xl p-4 space-y-3.5 border border-slate-800 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    اضغط النجمة للتفاصيل 👆
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                    <h5 className="text-xs font-black text-amber-300 tracking-wide">نظام المسار النجمي (Star Path)</h5>
                  </div>
                </div>

                {/* Glowing Curved / Linear Path */}
                <div className="relative py-3">
                  {/* Glowing Track Line */}
                  <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-slate-800 rounded-full -translate-y-1/2 z-0" />
                  <div className="absolute top-1/2 right-4 w-[60%] h-1.5 bg-gradient-to-l from-amber-400 via-yellow-400 to-amber-500 rounded-full -translate-y-1/2 z-0 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />

                  {/* Luminous Star Nodes */}
                  <div className="relative z-10 flex justify-between items-center px-1">
                    {starNodes.map((node) => {
                      const isClaimed = claimedRewards.includes(node.id);
                      return (
                        <div 
                          key={node.id} 
                          onClick={() => setSelectedStarNode({ ...node, claimed: isClaimed })}
                          className="flex flex-col items-center gap-1.5 cursor-pointer group"
                        >
                          <span className={`text-[10px] font-extrabold transition-colors ${node.unlocked ? 'text-amber-300' : 'text-slate-500'}`}>
                            {node.amount}
                          </span>

                          {/* Glowing Star Node Container */}
                          <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 border ${
                            node.unlocked 
                              ? 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 text-slate-950 border-yellow-200 shadow-[0_0_14px_rgba(245,158,11,0.9)] scale-105 group-hover:scale-125' 
                              : 'bg-slate-900 text-slate-500 border-slate-700 opacity-70 group-hover:border-slate-500'
                          }`}>
                            <Star className={`w-4 h-4 fill-current ${node.unlocked ? 'animate-pulse' : ''}`} />

                            {/* Glow Ping Effect for Unlocked & Unclaimed */}
                            {node.unlocked && !isClaimed && (
                              <span className="absolute inset-0 rounded-full bg-amber-400 animate-ping opacity-30" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Next Level Container */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3 space-y-2">
                <div className="flex justify-between items-center text-xs font-black">
                  <span className="text-slate-700">المستوى المالي القادم</span>
                  <span className="text-indigo-600 font-extrabold">$15.00</span>
                </div>
                
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full w-1/2" />
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>المستهدف: 200,000 ألماس</span>
                  <span className="text-indigo-600 font-extrabold">متبقي 💎 99,901</span>
                </div>
              </div>
            </div>

            {/* 4. My Tools Grid (أدواتي) */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-extrabold text-slate-700">أدواتي</h4>
              
              <div className="grid grid-cols-4 gap-2 text-center">
                <button 
                  onClick={() => setActiveToolModal('agency')}
                  className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-2xs hover:shadow-md active:scale-95 hover:border-indigo-300 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800">وكالتي</span>
                </button>

                <button 
                  onClick={() => setActiveToolModal('stream_logs')}
                  className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-2xs hover:shadow-md active:scale-95 hover:border-purple-300 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800 leading-tight">سجلات البث المباشر</span>
                </button>

                <button 
                  onClick={() => setActiveToolModal('wallet')}
                  className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-2xs hover:shadow-md active:scale-95 hover:border-emerald-300 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800">محفظتي</span>
                </button>

                <button 
                  onClick={() => setActiveToolModal('change_agency')}
                  className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-2xs hover:shadow-md active:scale-95 hover:border-amber-300 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                    <ArrowLeftRight className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800">تغيير الوكالة</span>
                </button>

                <button 
                  onClick={() => setActiveToolModal('supporters')}
                  className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-2xs hover:shadow-md active:scale-95 hover:border-rose-300 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                    <Star className="w-5 h-5 fill-rose-500" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800">داعمي</span>
                </button>

                <button 
                  onClick={() => setActiveToolModal('new_user')}
                  className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-2xs hover:shadow-md active:scale-95 hover:border-sky-300 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 border border-sky-100">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800">مستخدم جديد</span>
                </button>

                <button 
                  onClick={() => setActiveToolModal('invoice_download')}
                  className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-2xs hover:shadow-md active:scale-95 hover:border-violet-300 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 border border-violet-100">
                    <Download className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-black text-slate-800 leading-tight">تحميل الفاتورة</span>
                </button>

                <button 
                  onClick={() => setActiveToolModal('agency_announcements')}
                  className="flex flex-col items-center justify-center gap-2 bg-white border border-slate-200/80 p-3 rounded-2xl shadow-2xs hover:shadow-md active:scale-95 hover:border-orange-300 transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800">إعلان الوكالة</span>
                </button>
              </div>
            </div>

            {/* DETAILED SALARY VOUCHER MODAL (قسيمة الراتب التفصيلية) */}
            {showEarningsDetails && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900">قسيمة الراتب الشاملة</h3>
                        <p className="text-[10px] text-slate-500">تفاصيل المستحقات والأرباح المالية</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowEarningsDetails(false)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Month Selector */}
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-2xl border border-slate-200/80">
                    <span className="text-xs font-bold text-slate-600">شهر الاستحقاق:</span>
                    <div className="flex gap-1">
                      {['2026/08', '2026/07', '2026/06'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setSelectedDate(m)}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                            selectedDate === m 
                              ? 'bg-indigo-600 text-white shadow-xs' 
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Voucher Card Summary */}
                  <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4 rounded-2xl border border-indigo-800/50 shadow-inner space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-indigo-200">إجمالي الراتب المستحق:</span>
                      <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        مكتمل ✓
                      </span>
                    </div>

                    <div className="text-2xl font-black text-amber-300 font-mono tracking-tight text-center py-1 border-y border-white/10">
                      $5.00
                    </div>

                    <div className="text-[10px] text-slate-300 flex justify-between">
                      <span>حالة التحويل:</span>
                      <span className="text-white font-bold">تم الإيداع بالمحفظة</span>
                    </div>
                  </div>

                  {/* Salary Line Items */}
                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs font-bold">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                      <span className="text-slate-600">الراتب الأساسي:</span>
                      <span className="font-mono text-slate-900 font-black">$5.00</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                      <span className="text-slate-600">دخل الألماس والهدايا:</span>
                      <span className="font-mono text-indigo-600 font-black">100.1K 💎 ($5.00)</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                      <span className="text-slate-600">مكافآت المسار النجمي:</span>
                      <span className="font-mono text-amber-600 font-black">+$2.00</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                      <span className="text-slate-600">الراتب غير المفكوك:</span>
                      <span className="font-mono text-slate-400 font-black">$0.00</span>
                    </div>

                    <div className="flex justify-between items-center pt-1 text-slate-900 font-black">
                      <span>الراتب النهائي المدفوع:</span>
                      <span className="font-mono text-emerald-600 text-sm">$7.00</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-1 flex gap-2">
                    <button
                      onClick={() => setShowEarningsDetails(false)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer text-center"
                    >
                      إغلاق القسيمة
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STAR NODE POPUP MODAL */}
            {selectedStarNode && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-white">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-amber-300">{selectedStarNode.title}</h3>
                        <p className="text-[10px] text-slate-400">نظام المكافآت النجمي</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedStarNode(null)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">قيمة المكافأة:</span>
                      <span className="text-base font-black text-amber-400 font-mono">{selectedStarNode.amount}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">الشرط المطلوب:</span>
                      <span className="font-bold text-slate-200">{selectedStarNode.diamondsReq}</span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed pt-1 border-t border-slate-800/80">
                      {selectedStarNode.description}
                    </p>
                  </div>

                  <div className="pt-1">
                    {selectedStarNode.unlocked ? (
                      selectedStarNode.claimed ? (
                        <div className="w-full py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-black rounded-xl text-center">
                          ✓ تم استلام هذه المكافأة بنجاح
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setClaimedRewards([...claimedRewards, selectedStarNode.id]);
                            setSelectedStarNode({ ...selectedStarNode, claimed: true });
                          }}
                          className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-4 h-4" />
                          <span>استلام المكافأة المالية ({selectedStarNode.amount})</span>
                        </button>
                      )
                    ) : (
                      <div className="w-full py-2.5 bg-slate-800 border border-slate-700 text-slate-400 text-xs font-bold rounded-xl text-center">
                        🔒 غير مكتمل بعد - يلزمه المزيد من الهدايا
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TOOL MODAL: AGENCY (وكالتي) */}
            {activeToolModal === 'agency' && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900">بيانات وكالتي المعتمدة</h3>
                        <p className="text-[10px] text-slate-500">إحصائيات ومعلومات الوكالة الرسمية</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white p-4 rounded-2xl border border-indigo-700/50 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-300/30 px-2.5 py-0.5 rounded-full font-black">
                        وكالة الفئة الأولى 👑
                      </span>
                      <span className="text-[10px] font-mono text-indigo-200">ID: #104</span>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-amber-300">وكالة الأساطير الذهبية</h4>
                      <p className="text-[10px] text-purple-200 mt-0.5">Legend Official Broadcaster Agency</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-white/10 text-[11px]">
                      <div className="bg-white/10 p-2 rounded-xl">
                        <div className="text-[10px] text-slate-300">عدد المذيعين</div>
                        <div className="text-xs font-black text-white mt-0.5 font-mono">148 مذيع</div>
                      </div>
                      <div className="bg-white/10 p-2 rounded-xl">
                        <div className="text-[10px] text-slate-300">تقييم الدعم</div>
                        <div className="text-xs font-black text-emerald-400 mt-0.5 font-mono">99.8% ⭐</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-xs font-bold">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                      <span className="text-slate-600">مدير الوكالة المباشر:</span>
                      <span className="text-slate-900 font-black">الكابتن أحمد المعتمد</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                      <span className="text-slate-600">هاتف التواصل:</span>
                      <span className="font-mono text-indigo-600 font-black">+966 50 112 2334</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                      <span className="text-slate-600">تاريخ الانضمام:</span>
                      <span className="font-mono text-slate-700">2025/01/10</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-900">
                      <span className="text-slate-600">حالة العقد:</span>
                      <span className="text-emerald-600 font-black bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-[10px]">ساري ونشط ✓</span>
                    </div>
                  </div>

                  <div className="pt-1 space-y-2">
                    <button 
                      onClick={() => handleCopy('+966501122334')}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-4 h-4 text-emerald-300" /> : <PhoneCall className="w-4 h-4" />}
                      <span>{copiedCode ? 'تم نسخ رقم مدير الوكالة' : 'التواصل المباشر مع مدير الوكالة'}</span>
                    </button>
                    <button onClick={() => setActiveToolModal(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL MODAL: STREAM LOGS (سجلات البث المباشر) */}
            {activeToolModal === 'stream_logs' && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900">سجلات البث المباشر</h3>
                        <p className="text-[10px] text-slate-500">تاريخ وساعات البث والألماس المكتسب</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold">إجمالي الساعات</div>
                      <div className="text-xs font-black text-purple-600 font-mono mt-0.5">42.5 ساعة</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold">الأيام المؤهلة</div>
                      <div className="text-xs font-black text-amber-600 font-mono mt-0.5">14 / 20 يوم</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold">إجمالي الألماس</div>
                      <div className="text-xs font-black text-emerald-600 font-mono mt-0.5">245.8K 💎</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-black text-slate-700 flex justify-between items-center">
                      <span>آخر جلسات البث المباشر:</span>
                      <span className="text-[10px] text-purple-600 font-bold bg-purple-50 px-2 py-0.5 rounded-md">الشهر الحالي</span>
                    </div>

                    {[
                      { date: '2026/08/02', time: '18:30 - 21:15', dur: '2س 45د', viewers: '1,240', diamonds: '18,500 💎', valid: true },
                      { date: '2026/08/01', time: '20:00 - 22:30', dur: '2س 30د', viewers: '1,850', diamonds: '22,100 💎', valid: true },
                      { date: '2026/07/31', time: '19:00 - 21:00', dur: '2س 00د', viewers: '980', diamonds: '12,400 💎', valid: true },
                      { date: '2026/07/30', time: '21:00 - 23:30', dur: '2س 30د', viewers: '2,100', diamonds: '31,000 💎', valid: true },
                      { date: '2026/07/29', time: '18:00 - 18:40', dur: '40 دقيقة', viewers: '420', diamonds: '2,100 💎', valid: false },
                    ].map((session, idx) => (
                      <div key={idx} className="p-3 bg-white border border-slate-200/80 rounded-2xl space-y-1.5 shadow-2xs hover:border-purple-200 transition-all text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-mono font-black text-slate-900">{session.date} ({session.dur})</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${session.valid ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                            {session.valid ? 'مؤهل ✓' : 'غير مؤهل (< 1س)'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {session.time}</span>
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-400" /> {session.viewers} مشاهد</span>
                          <span className="font-mono font-black text-indigo-600">{session.diamonds}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setActiveToolModal(null)} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer">
                    إغلاق السجلات
                  </button>
                </div>
              </div>
            )}

            {/* TOOL MODAL: WALLET (محفظتي) */}
            {activeToolModal === 'wallet' && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <Wallet className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900">محفظتي المالية المباشرة</h3>
                        <p className="text-[10px] text-slate-500">إدارة الرصيد وسحب الأرباح</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white p-4 rounded-2xl border border-emerald-700/50 space-y-2 shadow-md text-center">
                    <span className="text-[10px] text-emerald-200 font-bold bg-white/10 px-2.5 py-0.5 rounded-full">
                      الرصيد القابل للسحب الفوري
                    </span>
                    <div className="text-3xl font-black text-amber-300 font-mono tracking-tight">$5.00</div>
                    <div className="text-[10px] text-emerald-200 font-mono">يعادل 100,100 ألماس هدايا 💎</div>
                  </div>

                  {withdrawSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-2 text-emerald-800">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h4 className="text-xs font-black">تم تقديم طلب السحب بنجاح!</h4>
                      <p className="text-[10px] text-emerald-700">تم إرسال طلب سحب ${withdrawAmount} إلى محفظتك. سيتم تحويل المبلغ خلال 12 ساعة.</p>
                      <button onClick={() => setWithdrawSuccess(false)} className="mt-2 text-[10px] font-bold text-emerald-700 underline cursor-pointer">
                        إجراء طلب جديد
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-700">وسيلة السحب:</label>
                        <div className="grid grid-cols-2 gap-1.5 text-xs font-bold">
                          {[
                            { id: 'usdt', name: 'USDT (TRC20)' },
                            { id: 'bank', name: 'تحويل بنكي' },
                            { id: 'payoneer', name: 'Payoneer' },
                            { id: 'stc', name: 'STC Pay' },
                          ].map((m) => (
                            <button
                              key={m.id}
                              onClick={() => setWithdrawMethod(m.id)}
                              className={`p-2 rounded-xl text-[11px] font-extrabold border transition-all cursor-pointer ${
                                withdrawMethod === m.id
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {m.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-700">المبلغ المراد سحبه ($):</label>
                        <input
                          type="text"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-black text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-black text-slate-700">عنوان الحساب / المحفظة:</label>
                        <input
                          type="text"
                          value={withdrawAddress}
                          onChange={(e) => setWithdrawAddress(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <button
                        onClick={() => setWithdrawSuccess(true)}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer text-center"
                      >
                        تأكيد طلب السحب الفوري
                      </button>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100">
                    <h5 className="text-[11px] font-black text-slate-700 mb-1.5">آخر المعاملات المالية:</h5>
                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100 font-bold">
                        <span className="text-slate-700">2026/08/01 - تحويل أرباح شهر يوليو</span>
                        <span className="font-mono text-emerald-600 font-black">+$145.00</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-xl border border-slate-100 font-bold">
                        <span className="text-slate-700">2026/07/15 - مكافأة المسار النجمي</span>
                        <span className="font-mono text-amber-600 font-black">+$7.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL MODAL: CHANGE AGENCY (تغيير الوكالة) */}
            {activeToolModal === 'change_agency' && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                        <ArrowLeftRight className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900">طلب تغيير الوكالة الحالية</h3>
                        <p className="text-[10px] text-slate-500">تقديم نموذج نقل رسمي للإدارة</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1 text-amber-900">
                    <div className="font-black flex items-center gap-1 text-amber-800">
                      <AlertCircle className="w-4 h-4" />
                      <span>معلومات الوكالة الحالية:</span>
                    </div>
                    <div className="text-[11px] font-bold">وكالة الأساطير الذهبية (ID: #104)</div>
                  </div>

                  {agencyRequestSubmitted ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-800">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h4 className="text-xs font-black">تم تقديم طلب النقل بنجاح!</h4>
                      <p className="text-[10px] text-emerald-700">طلبك قيد المراجعة الإدارية. سيتم التواصل معك خلال 24 ساعة للتحقق والتأكيد.</p>
                      <button onClick={() => setAgencyRequestSubmitted(false)} className="text-[10px] text-emerald-700 underline font-bold cursor-pointer">
                        تعديل الطلب
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div className="space-y-1">
                        <label className="font-black text-slate-700">معرف الوكالة الجديدة (Target Agency ID):</label>
                        <input
                          type="text"
                          placeholder="مثال: #205"
                          value={agencyTargetId}
                          onChange={(e) => setAgencyTargetId(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-black text-slate-900 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-black text-slate-700">سبب النقل:</label>
                        <select
                          value={agencyChangeReason}
                          onChange={(e) => setAgencyChangeReason(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                        >
                          <option value="انتهاء العقد والبحث عن دعم أكبر">انتهاء العقد والبحث عن دعم أكبر</option>
                          <option value="تغيير التخصص والنشاط">تغيير التخصص والنشاط</option>
                          <option value="ضعف التجاوب الفني">ضعف التجاوب الفني</option>
                          <option value="سبب آخر خاص">سبب آخر خاص</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-black text-slate-700">ملاحظات إضافية:</label>
                        <textarea
                          rows={2}
                          placeholder="اكتب أي تفاصيل أخرى ترغب بإيرادها للإدارة..."
                          value={agencyNotes}
                          onChange={(e) => setAgencyNotes(e.target.value)}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <button
                        onClick={() => setAgencyRequestSubmitted(true)}
                        className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all cursor-pointer text-center"
                      >
                        تقديم طلب النقل الرسمي
                      </button>
                    </div>
                  )}

                  <button onClick={() => setActiveToolModal(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                    إغلاق
                  </button>
                </div>
              </div>
            )}

            {/* TOOL MODAL: SUPPORTERS (داعمي) */}
            {activeToolModal === 'supporters' && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                        <Star className="w-5 h-5 fill-rose-500" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900">كبار داعمي المذيع</h3>
                        <p className="text-[10px] text-slate-500">تصنيف وقائمة كبار الداعمين</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {[
                      { id: 1, rank: '👑 #1', name: 'الشيخ فيصل', vip: 'VIP10', diamonds: '45,000 💎', gifts: '120 هدية فاخرة' },
                      { id: 2, rank: '🥈 #2', name: 'ملك التحديات', vip: 'VIP8', diamonds: '32,500 💎', gifts: '85 هدية فاخرة' },
                      { id: 3, rank: '🥉 #3', name: 'النسر الذهبي', vip: 'VIP7', diamonds: '18,200 💎', gifts: '42 هدية فاخرة' },
                      { id: 4, rank: '🌟 #4', name: 'سفير الجود', vip: 'VIP6', diamonds: '12,000 💎', gifts: '28 هدية فاخرة' },
                    ].map((supporter) => {
                      const isThanked = thankedSupporters.includes(supporter.id);
                      return (
                        <div key={supporter.id} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-2 shadow-2xs hover:bg-white transition-all">
                          <div className="flex items-center gap-2.5">
                            <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200">
                              {supporter.rank}
                            </span>
                            <div>
                              <div className="text-xs font-black text-slate-900 flex items-center gap-1">
                                <span>{supporter.name}</span>
                                <span className="text-[9px] bg-purple-600 text-white font-bold px-1.5 py-0.2 rounded-md">{supporter.vip}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-mono font-bold mt-0.5">{supporter.gifts}</div>
                            </div>
                          </div>

                          <div className="text-left space-y-1">
                            <div className="text-xs font-black text-indigo-600 font-mono">{supporter.diamonds}</div>
                            <button
                              onClick={() => {
                                if (!isThanked) setThankedSupporters([...thankedSupporters, supporter.id]);
                              }}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                                isThanked
                                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                  : 'bg-rose-500 hover:bg-rose-600 text-white shadow-2xs'
                              }`}
                            >
                              {isThanked ? 'تم الشكر ✓' : 'إرسال شكر 💌'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={() => setActiveToolModal(null)} className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer">
                    إغلاق القائمة
                  </button>
                </div>
              </div>
            )}

            {/* TOOL MODAL: NEW USER / INVITATION (مستخدم جديد) */}
            {activeToolModal === 'new_user' && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900">دعوة وتسجيل مستخدم/مذيع جديد</h3>
                        <p className="text-[10px] text-slate-500">دعوة مذيعين جدد للانضمام لكودك</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-gradient-to-br from-sky-800 to-indigo-900 text-white p-4 rounded-2xl border border-sky-700/50 space-y-2 shadow-md">
                    <div className="text-[10px] text-sky-200 font-bold">كود الدعوة الخاص بك:</div>
                    <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/10">
                      <span className="font-mono text-sm font-black text-amber-300">HOST-77989080</span>
                      <button onClick={() => handleCopy('HOST-77989080')} className="px-2.5 py-1 bg-white/20 hover:bg-white/30 text-white text-[10px] font-black rounded-lg cursor-pointer transition-all">
                        {copiedCode ? 'تم النسخ ✓' : 'نسخ الكود'}
                      </button>
                    </div>
                  </div>

                  {newUserRegistered ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-800">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h4 className="text-xs font-black">تم تسجيل المذيع الجديد بنجاح!</h4>
                      <p className="text-[10px] text-emerald-700">تم تسجيل ({newUserName}) تحت رابط دعوتك. ستحصل على 5% عمولة تشجيعية من أرباحه.</p>
                      <button onClick={() => setNewUserRegistered(false)} className="text-[10px] text-emerald-700 underline font-bold cursor-pointer">
                        تسجيل شخص آخر
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 text-xs">
                      <h4 className="font-black text-slate-800">تسجيل مباشر لمذيع جديد:</h4>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">اسم المذيع الجديد:</label>
                        <input
                          type="text"
                          placeholder="الاسم الكامل"
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">رقم الهاتف / الواتساب:</label>
                        <input
                          type="text"
                          placeholder="+9665..."
                          value={newUserPhone}
                          onChange={(e) => setNewUserPhone(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-600">تخصص البث المفضل:</label>
                        <select
                          value={newUserCategory}
                          onChange={(e) => setNewUserCategory(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                        >
                          <option value="سوالف وبودكاست">سوالف وبودكاست</option>
                          <option value="غناء وموسيقى">غناء وموسيقى</option>
                          <option value="ألعاب وتحديات">ألعاب وتحديات</option>
                        </select>
                      </div>

                      <button
                        onClick={() => setNewUserRegistered(true)}
                        className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer text-center"
                      >
                        تأكيد تسجيل المذيع الجديد
                      </button>
                    </div>
                  )}

                  <button onClick={() => setActiveToolModal(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                    إغلاق
                  </button>
                </div>
              </div>
            )}

            {/* TOOL MODAL: INVOICE DOWNLOAD (تحميل الفاتورة) */}
            {activeToolModal === 'invoice_download' && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
                        <Download className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900">تصدير وتحميل الفاتورة المالية</h3>
                        <p className="text-[10px] text-slate-500">معاينة وتنزيل التقرير المالي المعتمد</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2 font-mono text-xs text-slate-800">
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5 text-[11px]">
                      <span className="text-slate-500">رقم الفاتورة:</span>
                      <span className="font-black text-violet-700">INV-2026-08779</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5 text-[11px]">
                      <span className="text-slate-500">اسم المذيع:</span>
                      <span className="font-black text-slate-900">(عابرسيل)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200/60 pb-1.5 text-[11px]">
                      <span className="text-slate-500">الألماس المستلم:</span>
                      <span className="font-black text-indigo-600">100,100 💎</span>
                    </div>
                    <div className="flex justify-between pt-0.5 text-xs font-black">
                      <span className="text-slate-700">المبلغ الصافي المدفوع:</span>
                      <span className="text-emerald-600 font-bold">$12.00</span>
                    </div>
                  </div>

                  {invoiceDownloaded ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1 text-emerald-800">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                      <div className="text-xs font-black">تم تنزيل الفاتورة بنجاح!</div>
                      <div className="text-[10px] font-mono text-emerald-700">INV-2026-08779.pdf</div>
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setInvoiceDownloading(true);
                        setTimeout(() => {
                          setInvoiceDownloading(false);
                          setInvoiceDownloaded(true);
                        }, 1200);
                      }}
                      className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      {invoiceDownloading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-violet-200" />
                          <span>جاري تنزيل ملف PDF...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>تحميل الفاتورة المعتمدة (PDF)</span>
                        </>
                      )}
                    </button>
                    <button onClick={() => setActiveToolModal(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                      إغلاق
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL MODAL: AGENCY ANNOUNCEMENTS (إعلان الوكالة) */}
            {activeToolModal === 'agency_announcements' && (
              <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-sm p-5 space-y-4 shadow-2xl text-slate-900 max-h-[85vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                        <Megaphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-900">إعلانات وبلاغات الوكالة</h3>
                        <p className="text-[10px] text-slate-500">التنبيهات والرسائل الرسمية من وكالتك</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveToolModal(null)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 cursor-pointer transition-all">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 bg-orange-50/80 border border-orange-200/80 rounded-2xl space-y-1.5 shadow-2xs">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-black text-orange-900">🚨 [تنبيه هام] جدول احتساب الساعات</span>
                        <span className="text-[9px] font-bold bg-orange-200 text-orange-900 px-2 py-0.5 rounded-md">2026/08/01</span>
                      </div>
                      <p className="text-[11px] text-orange-950/90 leading-relaxed font-medium">
                        يرجى من كافة المذيعين الالتزام بفتح البث لمدة 60 دقيقة متواصلة على الأقل لاحتساب اليوم كـ (يوم مؤهل).
                      </p>
                    </div>

                    <div className="p-3 bg-indigo-50/80 border border-indigo-200/80 rounded-2xl space-y-1.5 shadow-2xs">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-black text-indigo-900">🏆 [مسابقة شهريّة] جائزة أفضل مذيع</span>
                        <span className="text-[9px] font-bold bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-md">2026/07/28</span>
                      </div>
                      <p className="text-[11px] text-indigo-950/90 leading-relaxed font-medium">
                        مكافأة $500 لأعلى 3 مذيعين في تحصيل أهداف الألماس هذا الشهر!
                      </p>
                    </div>
                  </div>

                  {announcementSent ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-emerald-800 text-xs font-black">
                      ✓ تم إرسال رسالتك لإدارة الوكالة بنجاح!
                    </div>
                  ) : (
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="text-[11px] font-black text-slate-700">إرسال استفسار/إعلان لوكالتك:</label>
                      <textarea
                        rows={2}
                        placeholder="اكتب رسالتك الموجهة لمدير الوكالة هنا..."
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-orange-500"
                      />
                      <button
                        onClick={() => setAnnouncementSent(true)}
                        className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        إرسال الرسالة للوكالة
                      </button>
                    </div>
                  )}

                  <button onClick={() => setActiveToolModal(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">
                    إغلاق
                  </button>
                </div>
              </div>
            )}
          </div>
        );

      case 'mall':
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white shadow-md flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">المركز التجاري (المتجر)</h3>
                <p className="text-xs text-rose-100 font-medium mt-0.5">تسوق أحدث الإطارات، المركبات، ومؤثرات الدخول</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                <Store className="w-7 h-7 text-white" />
              </div>
            </div>

            {/* Store Categories Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { title: 'متجر الإطارات', count: '24 إطار متوفر', color: 'bg-amber-50 border-amber-200 text-amber-800' },
                { title: 'مركبات الدخول', count: '12 سيارة أسطورية', color: 'bg-purple-50 border-purple-200 text-purple-800' },
                { title: 'فقاعات المحادثة', count: '18 تصميم ملون', color: 'bg-sky-50 border-sky-200 text-sky-800' },
                { title: 'هدايا فاخرة', count: 'جديد هذا الأسبوع', color: 'bg-rose-50 border-rose-200 text-rose-800' },
              ].map((cat, idx) => (
                <div key={idx} className={`p-3.5 rounded-2xl border ${cat.color} cursor-pointer hover:shadow-xs transition-all`}>
                  <div className="text-xs font-black">{cat.title}</div>
                  <div className="text-[10px] opacity-75 mt-0.5">{cat.count}</div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-x-hidden touch-pan-y max-w-full w-full" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col max-w-full box-border"
        >
          {/* Header Close Bar */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0 w-full max-w-full">
            <span className="text-sm font-black text-slate-800 tracking-wide">
              {activeService === 'broadcasters' ? 'مركز المذيعين' : 'تفاصيل الخدمة'}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 overflow-y-auto overflow-x-hidden flex-1 no-scrollbar w-full max-w-full touch-pan-y">
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
