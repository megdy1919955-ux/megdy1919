import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Coins, Gem, Check, Copy, ShieldCheck, Headphones, ExternalLink, Sparkles, Building2, User } from 'lucide-react';

interface RechargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userName?: string;
  currentCoins?: number;
  currentDiamonds?: number;
  onContactSupport?: () => void;
}

export const RechargeModal: React.FC<RechargeModalProps> = ({
  isOpen,
  onClose,
  userId = '1001001',
  userName = 'عابر سبيل',
  currentCoins = 0,
  currentDiamonds = 0,
  onContactSupport
}) => {
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // قائمة الوكلاء المعتمدين للشحن الرسمي
  const officialAgencies = [
    {
      id: 'agency-1',
      name: 'وكالة النجم الذهبية الرسمية (الإدارة المركزية)',
      code: 'AG-GOLD-01',
      status: 'وكيل معتمد رسمي ⭐️',
      contact: '+966500000000',
      badge: 'الوكيل الذهبي'
    },
    {
      id: 'agency-2',
      name: 'وكالة شحن وتوزيع سوريا وألمانيا',
      code: 'AG-SY-DE-02',
      status: 'وكيل معتمد دولي 🌍',
      contact: '+491500000000',
      badge: 'شحن فوري'
    },
    {
      id: 'agency-3',
      name: 'مركز وكلاء الشرق الأوسط والخليج',
      code: 'AG-GULF-03',
      status: 'خدمة 24/7 ⚡️',
      contact: '+971500000000',
      badge: 'دعم مباشر'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-xs" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col relative"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-4 text-slate-950 flex items-center justify-between shrink-0 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-300 flex items-center justify-center border border-amber-200/50 shadow-sm">
                <Coins className="w-6 h-6 fill-amber-300" />
              </div>
              <div>
                <h2 className="text-base font-black">المحفظة الرسمية ومركز وكلاء الشحن</h2>
                <p className="text-[11px] font-bold text-slate-900/80">الشحن الآمن والموثق حصراً عبر الوكلاء المعتمدين</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-950/20 hover:bg-slate-950/30 text-slate-950 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main Body */}
          <div className="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">

            {/* Current Balance Showcase (Read-Only) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Coins Balance */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100/70 border border-amber-200/80 shadow-xs">
                <div className="flex items-center gap-1.5 text-amber-900 text-xs font-black mb-1">
                  <Coins className="w-4 h-4 text-amber-600 fill-amber-500" />
                  <span>رصيد الكوينز الحالي</span>
                </div>
                <div className="text-xl font-black font-mono text-amber-700 tracking-tight">
                  {currentCoins.toLocaleString('en-US')}
                </div>
                <span className="text-[10px] text-amber-800/80 font-bold block mt-0.5">معتمد ومحمي سحابياً</span>
              </div>

              {/* Diamonds Balance */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-100/70 border border-sky-200/80 shadow-xs">
                <div className="flex items-center gap-1.5 text-sky-900 text-xs font-black mb-1">
                  <Gem className="w-4 h-4 text-sky-600 fill-sky-500" />
                  <span>رصيد الألماس الحالي</span>
                </div>
                <div className="text-xl font-black font-mono text-sky-700 tracking-tight">
                  {currentDiamonds.toLocaleString('en-US')}
                </div>
                <span className="text-[10px] text-sky-800/80 font-bold block mt-0.5">أرباح ودعم المضيفين</span>
              </div>
            </div>

            {/* User ID Box for Agency Recharge */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-slate-300">معرف الحساب (ID) المعتمد للشحن:</span>
                </div>
                <button
                  onClick={handleCopyId}
                  className="flex items-center gap-1 text-[11px] font-black bg-amber-400 hover:bg-amber-300 text-slate-950 px-2.5 py-1 rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-slate-950" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الـ ID</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950/80 border border-amber-400/40 rounded-xl p-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">{userName}</span>
                <span className="font-mono text-lg font-black text-amber-300 tracking-wider">
                  {userId}
                </span>
              </div>
            </div>

            {/* Central Directive Notice (كما طلبت تماماً) */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-dashed border-amber-400/60 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-black text-amber-950">تنويه رسمي بخصوص الشحن المالي:</h4>
                <p className="text-xs font-bold text-slate-700 leading-relaxed">
                  لشحن رصيدك، يرجى التواصل مع الوكيل المعتمد أو شحن الرصيد عبر معرف المستخدم <span className="font-mono font-black text-amber-700">({userId})</span> في لوحة التحكم (Dashboard).
                </p>
                <p className="text-[11px] font-medium text-slate-500">
                  🔒 عمليات الشحن والتزويد المالي مقفلة ومحمية أمنياً، وتتم حصراً من خلال الوكلاء المعتمدين لحماية الحسابات.
                </p>
              </div>
            </div>

            {/* Verified Official Recharge Agencies List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>وكلاء الشحن المعتمدون رسمياً:</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  وكلاء موثقون ✓
                </span>
              </div>

              <div className="space-y-2">
                {officialAgencies.map((agency) => (
                  <div
                    key={agency.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/90 rounded-2xl flex items-center justify-between transition-all"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">{agency.name}</span>
                        <span className="text-[9px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-md">
                          {agency.badge}
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                        <span>كود الوكيل: <span className="font-mono">{agency.code}</span></span>
                        <span>•</span>
                        <span className="text-emerald-600 font-black">{agency.status}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleCopyId();
                        if (onContactSupport) {
                          onContactSupport();
                        } else {
                          window.dispatchEvent(new CustomEvent('najm_open_customer_service'));
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-colors cursor-pointer flex items-center gap-1 shadow-xs shrink-0"
                    >
                      <Headphones className="w-3.5 h-3.5 text-amber-400" />
                      <span>تواصل للشحن</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Guarantee Note */}
            <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200/80 flex items-center gap-2 text-[11px] font-medium text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>الرصيد محمي وموثق مباشرة على قاعدة البيانات السحابية (Firebase Cloud).</span>
            </div>

            {/* Direct Support Button */}
            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('najm_open_customer_service'));
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-amber-300 font-black text-xs shadow-md hover:opacity-95 cursor-pointer flex items-center justify-center gap-2 border border-amber-400/30"
            >
              <Headphones className="w-4 h-4 text-amber-400" />
              <span>محادثة خدمة عملاء الوكالات والشحن المعتمد</span>
            </button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
