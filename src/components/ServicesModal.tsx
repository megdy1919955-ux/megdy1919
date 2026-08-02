import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Crown, Megaphone, Trophy, ThumbsUp, Rocket, Ticket, Mic, Store,
  ChevronLeft, Sparkles, Gift, Share2, Copy, Check, Users, Star, Award, Zap, Flame,
  QrCode, ArrowUpRight, FileText, UserCheck, Wallet, ArrowLeftRight, Download
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

  React.useEffect(() => {
    setShowEarningsDetails(false);
    setIsDatePickerOpen(false);
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
          <div className="space-y-4" dir="rtl">
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
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
                  <Mic className="w-7 h-7 text-purple-200" />
                </div>
                <div>
                  <h3 className="text-lg font-black">مركز المذيعين وصناع المحتوى</h3>
                  <p className="text-xs text-purple-200 font-medium">إحصائيات البث المباشر والوكالات الرسمية</p>
                </div>
              </div>
            </div>

            {/* Broadcaster Stats */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl">
                <div className="text-xs text-purple-600 font-bold">ساعات البث هذا الشهر</div>
                <div className="text-xl font-black text-slate-900 mt-1">42.5 ساعة</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                <div className="text-xs text-amber-600 font-bold">عائدات الهدايا</div>
                <div className="text-xl font-black text-amber-700 mt-1">125,000 ألماس</div>
              </div>
            </div>

            <button className="w-full py-3 rounded-2xl bg-purple-600 text-white font-black text-xs shadow-md hover:bg-purple-700 cursor-pointer">
              الانضمام إلى وكالة رسمية
            </button>
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header Close Bar */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">تفاصيل الخدمة</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 overflow-y-auto flex-1 no-scrollbar">
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
