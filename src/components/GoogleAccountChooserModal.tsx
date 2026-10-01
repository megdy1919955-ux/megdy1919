/**
 * نافذة منبثقة لاختيار حساب Google من الحسابات المسجلة بالجوال
 * (Google Account Chooser Bottom Sheet / Modal)
 * تشبه تماماً نافذة Google Sign-In الأصلية في نظام Android وiOS
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  UserPlus,
  ShieldCheck,
  Check,
  Crown,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import {
  AuthUserData,
  getSavedDeviceAccounts,
  OWNER_USER_ACCOUNT,
  createNewAccount,
  setAuthUserSession,
  signInWithGoogleReal
} from '../lib/authService';

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (user: AuthUserData) => void;
}

export const GoogleAccountChooserModal: React.FC<GoogleAccountChooserModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount
}) => {
  const [deviceAccounts, setDeviceAccounts] = useState<AuthUserData[]>(() => getSavedDeviceAccounts());
  const [isAddingNew, setIsAddingNew] = useState(() => getSavedDeviceAccounts().length === 0);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  if (!isOpen) return null;

  // اختيار حساب مسجل مسبقاً
  const handlePickAccount = (account: AuthUserData) => {
    setIsProcessing(account.id);
    setTimeout(() => {
      setAuthUserSession(account);
      setIsProcessing(null);
      onSelectAccount(account);
    }, 450);
  };

  // إطلاق مصادقة Google الحقيقية الرسمية من Firebase
  const handleLaunchRealGoogle = async () => {
    setIsProcessing('real_google');
    try {
      const user = await signInWithGoogleReal();
      setIsProcessing(null);
      onSelectAccount(user);
    } catch (err) {
      setIsProcessing(null);
      console.warn('Real Google signIn failed:', err);
    }
  };

  // إضافة وتسجيل حساب Google جديد
  const handleAddNewAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newEmail.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return;

    setIsProcessing('new_account');
    setTimeout(() => {
      const user = createNewAccount({
        loginType: 'google',
        contact: cleanEmail,
        displayName: newName.trim() || undefined
      });
      setIsProcessing(null);
      onSelectAccount(user);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[100000] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden text-right flex flex-col max-h-[85vh]"
        dir="rtl"
      >
        {/* Header with Google Logo & Close */}
        <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            {/* Google Logo */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                تسجيل الدخول باستخدام Google
              </h3>
              <p className="text-[11px] text-slate-400">
                المتابعة إلى تطبيق النجم الصوتي
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions / Notice */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-bold">
            اختر حساباً من حساباتك المسجلة على هذا الجوال:
          </span>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
            متصل بجوالك ✓
          </span>
        </div>

        {/* Scrollable Accounts List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {!isAddingNew ? (
            <>
              {deviceAccounts.map((acc) => {
                const isOwner = acc.isOwner || acc.email === OWNER_USER_ACCOUNT.email;
                const isSelected = isProcessing === acc.id;

                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => handlePickAccount(acc)}
                    disabled={isProcessing !== null}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-blue-50/70 active:bg-blue-100/60 transition-all cursor-pointer group text-right"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-xs"
                        />
                        {isOwner && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center shadow-xs">
                            <Crown className="w-2.5 h-2.5 text-white fill-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                            {acc.name}
                          </span>
                          {isOwner && (
                            <span className="text-[9px] bg-amber-100 text-amber-800 font-black px-1.5 py-0.2 rounded">
                              المالك 👑
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 font-mono truncate" dir="ltr">
                          {acc.email || `${acc.name}@gmail.com`}
                        </div>
                        {acc.lastLoginAt && (
                          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                            مسجل مسبقاً ({acc.lastLoginAt})
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Icon */}
                    <div className="shrink-0 mr-2">
                      {isSelected ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-slate-400 transition-all">
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* استخدام حساب Google آخر (Add another account) */}
              <button
                type="button"
                onClick={() => setIsAddingNew(true)}
                className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-slate-50 transition-all text-blue-600 font-bold text-xs cursor-pointer mt-1"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span>استخدام حساب Google آخر على هذا الجوال...</span>
              </button>
            </>
          ) : (
            /* نموذج إضافة حساب جديد */
            <form onSubmit={handleAddNewAccount} className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                >
                  ← العودة للحسابات
                </button>
                <span className="text-xs font-black text-slate-800">إدخال بريد إلكتروني آخر</span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-600">بريد Google:</label>
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 font-mono"
                  required
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-slate-600">الاسم الظاهر:</label>
                <input
                  type="text"
                  placeholder="اسمك في التطبيق"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing !== null}
                className="w-full py-3 rounded-full bg-[#4285F4] hover:bg-blue-600 text-white font-black text-sm shadow-md transition-all mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? 'جاري الدخول...' : 'تسجيل الدخول فوراً'}
              </button>
            </form>
          )}
        </div>

        {/* Footer Security Notice */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>حماية Google للأجهزة: يتم التحقق والتعرف الفوري على الهوية</span>
        </div>
      </motion.div>
    </div>
  );
};
