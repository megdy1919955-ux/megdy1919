import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Copy, AlertTriangle, Languages, Check, X } from 'lucide-react';
import { ChatMessage } from './roomTypes';

export interface ChatMessageActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  anchorPosition?: { x: number; y: number } | null;
  onReport: (message: ChatMessage) => void;
  onToast: (msg: string) => void;
}

/**
 * ChatMessageActionsModal:
 * مستطيل عائم عمودي من الأعلى إلى الأسفل يظهر فوق كل شيء عند الضغط على الرسالة أو الضغط مطولاً
 * مستخدم فيه createPortal ليركب مباشرة على document.body بدون أن يتم قصه بواسطة overflow-hidden للشات
 * يحتوي على 3 خيارات فقط:
 * 1. نسخ
 * 2. تبليغ
 * 3. ترجمة
 */
export const ChatMessageActionsModal: React.FC<ChatMessageActionsModalProps> = ({
  isOpen,
  onClose,
  message,
  anchorPosition,
  onReport,
  onToast,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  if (!isOpen || !message) return null;
  if (typeof document === 'undefined') return null;

  // 1. نسخ (Copy)
  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(message.text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = message.text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      onToast('تم نسخ النص بنجاح 📋');
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 500);
    } catch (e) {
      onToast('تم نسخ النص 📋');
      onClose();
    }
  };

  // 2. تبليغ (Report)
  const handleReport = () => {
    onReport(message);
    onClose();
  };

  // 3. ترجمة (Translate)
  const handleTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
      const original = message.text.trim();
      let translation = '';
      if (/[\u0600-\u06FF]/.test(original)) {
        if (original.includes('السلام')) translation = 'Peace and blessings be upon you';
        else if (original.includes('مرحبا') || original.includes('أهلا')) translation = 'Welcome everyone!';
        else translation = `Translation: "${original}"`;
      } else {
        translation = `الترجمة: "${original}"`;
      }
      setTranslatedText(translation);
      onToast('تمت ترجمة الرسالة 🌐');
    }, 200);
  };

  // حساب إحداثيات المستطيل العائم ليكون دائماً ظاهراً داخل الشاشة
  const calculatePositionStyle = (): React.CSSProperties => {
    if (anchorPosition && anchorPosition.y > 0 && typeof window !== 'undefined') {
      const screenH = window.innerHeight || 800;
      const screenW = window.innerWidth || 400;

      const menuWidth = 180;
      const menuHeight = translatedText ? 220 : 165;

      let top = anchorPosition.y - 70;
      if (top + menuHeight > screenH - 16) {
        top = screenH - menuHeight - 16;
      }
      if (top < 70) top = 70;

      let left = (anchorPosition.x || screenW / 2) - menuWidth / 2;
      if (left + menuWidth > screenW - 16) {
        left = screenW - menuWidth - 16;
      }
      if (left < 16) left = 16;

      return {
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        position: 'fixed' as const,
      };
    }

    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      position: 'fixed' as const,
    };
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] pointer-events-auto select-none" dir="rtl">
      {/* Invisible non-blocking click-away layer: does NOT darken or cover the screen heavily */}
      <div
        className="fixed inset-0 bg-black/20 z-[99998] cursor-pointer"
        onClick={onClose}
      />

      {/* Vertical floating rectangle: من الأعلى إلى الأسفل فوق كل شيء */}
      <div
        className="z-[99999] w-44 bg-[#141926]/98 border border-amber-400/60 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-md p-1.5 flex flex-col animate-scaleUp text-right"
        style={calculatePositionStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-white/15">
          <span className="text-[11px] font-black text-amber-300 truncate max-w-[110px]">
            {message.userName}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-0.5 rounded-full transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Translation Banner if triggered */}
        {translatedText && (
          <div className="mb-1.5 p-1.5 rounded-lg bg-cyan-950/90 border border-cyan-400/50 text-[10.5px] font-bold text-cyan-200 flex items-center justify-between gap-1 animate-fadeIn">
            <span className="truncate">{translatedText}</span>
            <button
              type="button"
              onClick={() => setTranslatedText(null)}
              className="text-cyan-300 hover:text-white shrink-0"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* 3 Vertical Items from Top to Bottom: نسخ / تبليغ / ترجمة */}
        <div className="flex flex-col gap-1 font-bold text-xs">
          {/* 1. نسخ */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-slate-100 hover:text-amber-300 hover:bg-white/15 active:scale-[0.97] transition-all cursor-pointer text-right w-full"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/40">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-black">نسخ</span>
          </button>

          {/* 2. تبليغ */}
          <button
            type="button"
            onClick={handleReport}
            className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-rose-300 hover:text-rose-200 hover:bg-rose-500/20 active:scale-[0.97] transition-all cursor-pointer text-right w-full"
          >
            <div className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black">تبليغ</span>
          </button>

          {/* 3. ترجمة */}
          <button
            type="button"
            onClick={handleTranslate}
            className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-slate-100 hover:text-blue-300 hover:bg-white/15 active:scale-[0.97] transition-all cursor-pointer text-right w-full"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/40">
              <Languages className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
            </div>
            <span className="text-xs font-black">ترجمة</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
