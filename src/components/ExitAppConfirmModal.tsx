/**
 * نافذة تأكيد إغلاق والخروج من التطبيق
 * Exit App Confirmation Dialog (PWA / Mobile / Web)
 * Al-Najm Live (c) 2026
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';
import { backNavigation } from '../lib/backNavigation';

export const ExitAppConfirmModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleExitRequest = () => {
      setIsOpen(true);
    };

    window.addEventListener('najm_request_exit_app', handleExitRequest);
    return () => {
      window.removeEventListener('najm_request_exit_app', handleExitRequest);
    };
  }, []);

  // When modal is open, register back handler to close it if user clicks back again
  useEffect(() => {
    if (!isOpen) return;

    return backNavigation.registerHandler('exit_app_modal', 9999, () => {
      setIsOpen(false);
    });
  }, [isOpen]);

  const handleConfirmExit = async () => {
    setIsOpen(false);

    // 1. Try Capacitor native App exit on Android/iOS
    try {
      await CapApp.exitApp();
      return;
    } catch {}

    // 2. Try native AndroidBridge interface from MainActivity.java
    try {
      if ((window as any).AndroidBridge && typeof (window as any).AndroidBridge.exitApp === 'function') {
        (window as any).AndroidBridge.exitApp();
        return;
      }
    } catch {}

    // 3. Fallback for Web / PWA
    try {
      window.close();
    } catch {}

    // 4. Graceful browser goodbye screen if tab cannot be closed by script
    document.body.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#0B0B12;color:#fff;font-family:sans-serif;text-align:center;padding:24px;">
        <div style="font-size:54px;margin-bottom:16px;">⭐</div>
        <h2 style="font-size:22px;font-weight:900;margin-bottom:8px;color:#FACC15;">تطبيق النجم الصوتي</h2>
        <p style="font-size:15px;color:#94A3B8;max-width:320px;line-height:1.6;">تم الخروج من التطبيق بنجاح. يمكنك إغلاق الصفحة بأمان الآن.</p>
        <button onclick="window.location.reload()" style="margin-top:24px;padding:12px 28px;background:#FACC15;color:#0B0B12;font-weight:bold;border:none;border-radius:12px;cursor:pointer;font-size:15px;">
          إعادة فتح التطبيق 🔄
        </button>
      </div>
    `;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="najm-exit-app-backdrop"
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none pointer-events-auto"
          dir="rtl"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="w-full max-w-sm bg-gradient-to-b from-slate-900 to-[#0c0c16] border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gold accent line */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

            {/* Icon Header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner mb-4">
                <LogOut className="w-8 h-8 text-amber-400 stroke-[2.2]" />
              </div>

              <h3 className="text-xl font-black text-white mb-2">
                إغلاق تطبيق النجم؟
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium mb-6">
                هل تود حقاً الخروج وإغلاق التطبيق؟ ستفقد أي محادثة جارية أو غرفة صوتية غير محفوظة.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-slate-200 font-bold text-sm transition-all border border-white/5 cursor-pointer"
              >
                إلغاء والتراجع
              </button>

              {/* Confirm Exit Button */}
              <button
                type="button"
                onClick={handleConfirmExit}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 active:scale-95 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                نعم، إغلاق التطبيق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
