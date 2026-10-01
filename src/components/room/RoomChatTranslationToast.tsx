import React from 'react';
import { createPortal } from 'react-dom';
import { Languages, X, Check } from 'lucide-react';

export interface RoomChatTranslationToastProps {
  isOpen: boolean;
  onClose: () => void;
  originalText: string;
  translatedText: string;
  senderName: string;
}

/**
 * مربع الترجمة العائم المنفصل تماماً بأعلى وسط الشاشة (RoomChatTranslationToast)
 * - منفصل 100% ومستقل عن أي كود
 * - يظهر في أعلى وسط الشاشة بشكل عائم وأنيق
 * - يعرض الترجمة الفورية واسم صاحب الرسالة مع زر إغلاق سريع
 */
export const RoomChatTranslationToast: React.FC<RoomChatTranslationToastProps> = ({
  isOpen,
  onClose,
  originalText,
  translatedText,
  senderName
}) => {
  if (!isOpen) return null;
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed top-14 left-1/2 -translate-x-1/2 z-[100000] w-[90%] max-w-[340px] pointer-events-auto select-none animate-in fade-in slide-in-from-top-4 duration-200"
      dir="rtl"
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#0f1422]/95 border border-sky-400/50 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-xl p-3 text-white flex flex-col gap-2">
        {/* شريط الإضاءة العلوي */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-400" />

        {/* رأس المربع العائم: الأيقونة + العنوان + زر الإغلاق */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
              <Languages className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold text-sky-200">ترجمة فورية للرسالة</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* النص المترجم */}
        <div className="bg-black/40 rounded-xl p-2.5 border border-white/5 flex flex-col gap-1">
          <span className="text-[10px] text-slate-400 font-medium">@{senderName}:</span>
          <p className="text-xs font-bold text-amber-200 leading-relaxed [overflow-wrap:anywhere]">
            {translatedText}
          </p>
        </div>

        {/* النص الأصلي للمقارنة */}
        <div className="px-1 text-[10.5px] text-slate-400 truncate opacity-80">
          الأصل: {originalText}
        </div>
      </div>
    </div>,
    document.body
  );
};
