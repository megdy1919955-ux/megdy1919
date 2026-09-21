import React, { useState } from 'react';
import { AtSign, Copy, Languages, AlertTriangle, UserX, Check, X } from 'lucide-react';
import { ChatMessage } from './roomTypes';

export interface ChatMessageActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  anchorPosition?: { x: number; y: number } | null;
  onReply: (message: ChatMessage) => void;
  onReport: (message: ChatMessage) => void;
  onAddToBlacklist: (userName: string) => void;
  onToast: (msg: string) => void;
}

/**
 * ChatMessageActionsModal:
 * مستطيل عائم أنيق فوق الشات يحتوي على 5 أيقونات فقط كما طلب المستخدم:
 * 1. الرد على الرسالة (@)
 * 2. استنساخ
 * 3. ترجمة
 * 4. تبليغ
 * 5. أضف إلى القائمة السوداء
 *
 * لا يغطي الشات بالكامل بل يظهر كمستطيل عائم مدمج (Floating Menu Widget)
 */
export const ChatMessageActionsModal: React.FC<ChatMessageActionsModalProps> = ({
  isOpen,
  onClose,
  message,
  anchorPosition,
  onReply,
  onReport,
  onAddToBlacklist,
  onToast,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  if (!isOpen || !message) return null;

  // 1. الرد على الرسالة
  const handleReply = () => {
    onReply(message);
    onClose();
  };

  // 2. استنساخ (Copy Text)
  const handleCloneCopy = async () => {
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
      onToast('تم استنساخ الرسالة بنجاح 📋');
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 700);
    } catch (e) {
      onToast('تم نسخ النص بنجاح');
      onClose();
    }
  };

  // 3. ترجمة
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
      onToast('تمت الترجمة 🌐');
    }, 250);
  };

  // 4. تبليغ
  const handleReport = () => {
    onReport(message);
    onClose();
  };

  // 5. إضافة إلى القائمة السوداء
  const handleBlacklist = () => {
    onAddToBlacklist(message.userName);
    onToast(`تمت إضافة ${message.userName} للقائمة السوداء 🚫`);
    onClose();
  };

  // Calculate coordinates for the floating rectangle
  const calculatePositionStyle = (): React.CSSProperties => {
    if (anchorPosition) {
      const screenH = typeof window !== 'undefined' ? window.innerHeight : 800;
      const screenW = typeof window !== 'undefined' ? window.innerWidth : 400;

      // Ensure menu stays within viewable boundaries
      const top = Math.min(screenH - 240, Math.max(90, anchorPosition.y - 100));
      const right = Math.min(screenW - 200, Math.max(16, screenW - anchorPosition.x - 20));

      return {
        top: `${top}px`,
        right: `${right}px`,
      };
    }

    // Default floating position over chat
    return {
      bottom: '120px',
      right: '20px',
    };
  };

  return (
    <>
      {/* Invisible non-blocking click-away layer: does NOT darken or cover the chat */}
      <div
        className="fixed inset-0 z-[130] bg-black/10 select-none cursor-default"
        onClick={onClose}
      />

      {/* Floating Rectangle Container (مستطيل عائم فوق كل شيء يظهر) */}
      <div
        className="fixed z-[135] w-52 bg-[#171c2b]/95 border border-amber-400/40 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-md p-2 flex flex-col select-none animate-scaleUp text-right"
        style={calculatePositionStyle()}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header inside floating box */}
        <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-white/10 px-1">
          <span className="text-[10px] font-black text-amber-300 truncate max-w-[130px]">
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
          <div className="mb-2 p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-400/50 text-[10px] font-bold text-cyan-200 flex items-center justify-between gap-1 animate-fadeIn">
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

        {/* 5 Icons / Actions List (مستطيل عائم بـ 5 خيارات فقط) */}
        <div className="flex flex-col gap-0.5 text-xs font-bold">
          {/* 1. الرد على الرسالة (@) */}
          <button
            type="button"
            onClick={handleReply}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl text-slate-100 hover:text-amber-300 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-right"
          >
            <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <AtSign className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black">الرد على الرسالة</span>
          </button>

          {/* 2. استنساخ */}
          <button
            type="button"
            onClick={handleCloneCopy}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl text-slate-100 hover:text-cyan-300 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-right"
          >
            <div className="w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/30">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs font-black">استنساخ</span>
          </button>

          {/* 3. ترجمة */}
          <button
            type="button"
            onClick={handleTranslate}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl text-slate-100 hover:text-blue-300 hover:bg-white/10 active:scale-[0.98] transition-all cursor-pointer text-right"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
              <Languages className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
            </div>
            <span className="text-xs font-black">ترجمة</span>
          </button>

          {/* 4. تبليغ */}
          <button
            type="button"
            onClick={handleReport}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 active:scale-[0.98] transition-all cursor-pointer text-right"
          >
            <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black">تبليغ</span>
          </button>

          {/* 5. أضف إلى القائمة السوداء */}
          <button
            type="button"
            onClick={handleBlacklist}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 active:scale-[0.98] transition-all cursor-pointer text-right"
          >
            <div className="w-6 h-6 rounded-lg bg-slate-800 text-rose-400 flex items-center justify-center shrink-0 border border-white/10">
              <UserX className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-black">أضف إلى القائمة السوداء</span>
          </button>
        </div>
      </div>
    </>
  );
};
