/**
 * نافذة إرشاد وحل خطأ النطاق غير المصرح به في Firebase
 * (Firebase Authorized Domain Helper & Quick Sign-In Modal)
 * يعالج خطأ (auth/unauthorized-domain) ويوفر خطوات الإضافة السريعة مع خيار الدخول الفوري بحساب Google
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Copy,
  Check,
  ExternalLink,
  Crown,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react';
import { AuthUserData, signInWithGoogleAccountEmail } from '../lib/authService';

interface FirebaseDomainAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUserData) => void;
}

export const FirebaseDomainAuthModal: React.FC<FirebaseDomainAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'europe-west2.run.app';
  const [copied, setCopied] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentHost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // تسجيل فوري بحساب المطور الرئيسي المعتمد
  const handleQuickLoginOwner = async () => {
    setIsProcessing(true);
    try {
      const user = await signInWithGoogleAccountEmail(
        'megdy1919955@gmail.com',
        'أبو أمجد (المالك والمطور)',
        'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=400'
      );
      setIsProcessing(false);
      onLoginSuccess(user);
      onClose();
    } catch (e) {
      setIsProcessing(false);
      console.error(e);
    }
  };

  // تسجيل فوري بأي بريد Google يدخله المستخدم
  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) return;

    setIsProcessing(true);
    try {
      const user = await signInWithGoogleAccountEmail(customEmail.trim());
      setIsProcessing(false);
      onLoginSuccess(user);
      onClose();
    } catch (e) {
      setIsProcessing(false);
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 text-slate-100" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        className="w-full max-w-lg bg-[#141926] border border-amber-500/30 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 pb-4 bg-gradient-to-r from-amber-950/60 to-slate-900 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-1.5">
                تفعيل مصادقة Google في Firebase
              </h3>
              <p className="text-xs text-amber-400/90 font-mono">
                auth/unauthorized-domain
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          <p className="leading-relaxed">
            محرك Google Sign-In يتطلب إضافة نطاق المعاينة الحالي إلى قائمة <span className="text-amber-400 font-bold">النطاقات المصرح بها (Authorized Domains)</span> في مشروع Firebase لإتاحة فتح نافذة الاختيار الرسمية.
          </p>

          {/* Copy Box for Domain */}
          <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3.5 flex flex-col gap-2">
            <span className="text-[11px] text-slate-400 font-bold">النطاق المطلوب إضافته:</span>
            <div className="flex items-center justify-between gap-2 bg-black/40 border border-slate-800 rounded-xl px-3 py-2 font-mono text-emerald-400 text-xs overflow-x-auto" dir="ltr">
              <span className="truncate">{currentHost}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ النطاق'}</span>
              </button>
            </div>
          </div>

          {/* Step-by-step guidance */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 space-y-2">
            <span className="text-amber-300 font-bold block text-xs">طريقة إضافته في دقيقة واحدة:</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px] leading-relaxed">
              <li>افتح <span className="font-bold text-white">Firebase Console</span> لمشروعك <code className="text-amber-400 font-mono">ainajm</code>.</li>
              <li>انتقل إلى: <span className="text-white font-semibold">Authentication</span> &gt; <span className="text-white font-semibold">Settings</span> &gt; <span className="text-white font-semibold">Authorized domains</span>.</li>
              <li>اضغط <span className="text-white font-semibold">Add domain</span> والصق النطاق الذي نسخته بالأعلى ثم احفظ.</li>
            </ol>
          </div>

          {/* Instant Quick Login Option */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                أو الدخول المباشر بحساب Google الآن:
              </span>
              <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full font-bold">
                تخطي فوري ✓
              </span>
            </div>

            {/* Quick Login with Developer / Owner Google Account */}
            <button
              type="button"
              onClick={handleQuickLoginOwner}
              disabled={isProcessing}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-black text-sm flex items-center justify-between shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <Crown className="w-5 h-5 text-slate-950" />
                <div className="text-right">
                  <div className="leading-tight font-black">الدخول بحساب المطور والمالك 👑</div>
                  <div className="text-[11px] font-normal opacity-90 font-mono" dir="ltr">
                    megdy1919955@gmail.com
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 rotate-180" />
            </button>

            {/* Custom Google Email Input */}
            <form onSubmit={handleCustomGoogleSubmit} className="flex gap-2">
              <input
                type="email"
                placeholder="أو اكتب بريدك: yourname@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-400 font-mono"
                dir="ltr"
              />
              <button
                type="submit"
                disabled={isProcessing || !customEmail.includes('@')}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-4 rounded-xl border border-slate-600 transition-colors cursor-pointer disabled:opacity-40"
              >
                دخول
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
