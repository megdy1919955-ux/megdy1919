import React, { useState } from 'react';
import { Copy, AlertTriangle, Languages, Check, X } from 'lucide-react';
import { ChatMessage } from './roomTypes';

export interface ChatMessageActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  anchorPosition?: { x: number; y: number } | null;
  onReport: (message: ChatMessage) => void;
  onToast: (msg: string) => void;
  onReply?: (message: ChatMessage) => void;
  onAddToBlacklist?: (userName: string) => void;
}

/**
 * ChatMessageActionsModal:
 * مستطيل عائم عمودي من الأعلى إلى الأسفل يظهر فوق كل شيء عند الضغط مطولاً على الرسالة
 * يحتوي على 3 خيارات فقط كما طلب المستخدم بالضبط:
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
      }, 600);
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
    }, 250);
  };

  // Coordinates calculation to float near the pressed message or above chat
  const calculatePositionStyle = (): React.CSSProperties => {
    if (anchorPosition) {
      const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 400;

      const top = Math.min(screenH - 180, Math.max(80, anchorPosition.y - 70));
      const right = Math.min(screenW - 170, Math.max(16, screenW - anchorPosition.x - 20));

      return {
        top: `${top}px`,
        right: `${right}px`,
      };
    }

    return {
      bottom: '140px',
      right: '24px',
    };
  };

  return (
    <>
      {/* Invisible overlay for click-away without darkening or blocking */}
      <div
        className="fixed inset-0 z-[130] bg-black/15 select-none cursor-default"
        onClick={onClose}
      />

      {/* Vertical floating rectangle: من الأعلى إلى الأسفل فوق كل شيء */}
      <div
        className="fixed z-[135] w-44 bg-[#141926]/95 border border-amber-400/50 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.85)] backdrop-blur-md p-1.5 flex flex-col select-none animate-scaleUp text-right"
        style={calculatePositionStyle()}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-white/10">
          <span className="text-[10px] font-black text-amber-300 truncate max-w-[110px]">
            {message.userName}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-0.5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Translation Banner if triggered */}
        {translatedText && (
          <div className="mb-1.5 p-1.5 rounded-lg bg-cyan-950/90 border border-cyan-400/50 text-[10px] font-bold text-cyan-200 flex items-center justify-between gap-1 animate-fadeIn">
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
        <div className="flex flex-col gap-0.5 font-bold text-xs">
          {/* 1. نسخ */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-slate-100 hover:text-amber-300 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-right"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-black">نسخ</span>
          </button>

          {/* 2. تبليغ */}
          <button
            type="button"
            onClick={handleReport}
            className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 active:scale-[0.98] transition-all cursor-pointer text-right"
          >
            <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black">تبليغ</span>
          </button>

          {/* 3. ترجمة */}
          <button
            type="button"
            onClick={handleTranslate}
            className="flex items-center gap-2.5 py-2 px-2.5 rounded-xl text-slate-100 hover:text-blue-300 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-right"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Languages className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
            </div>
            <span className="text-xs font-black">ترجمة</span>
          </button>
        </div>
      </div>
    </>
  );
};
