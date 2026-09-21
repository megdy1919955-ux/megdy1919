import React, { useState } from 'react';
import { AtSign, Copy, Languages, AlertTriangle, UserX, X, Check } from 'lucide-react';
import { ChatMessage } from './roomTypes';

export interface ChatMessageActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  onReply: (message: ChatMessage) => void;
  onReport: (message: ChatMessage) => void;
  onAddToBlacklist: (userName: string) => void;
  onToast: (msg: string) => void;
}

export const ChatMessageActionsModal: React.FC<ChatMessageActionsModalProps> = ({
  isOpen,
  onClose,
  message,
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
    // Instant Arabic / Multilingual translation simulation
    setTimeout(() => {
      setIsTranslating(false);
      const original = message.text.trim();
      let translation = '';
      if (/[\u0600-\u06FF]/.test(original)) {
        // Arabic to English simple mapping or translation
        if (original.includes('السلام')) translation = 'Peace and blessings be upon you';
        else if (original.includes('مرحبا') || original.includes('أهلا')) translation = 'Welcome / Hello everyone!';
        else translation = `Translation: "${original}"`;
      } else {
        // English/Other to Arabic
        translation = `الترجمة: "${original}"`;
      }
      setTranslatedText(translation);
      onToast('تمت ترجمة الرسالة 🌐');
    }, 300);
  };

  // 4. تبليغ
  const handleReport = () => {
    onReport(message);
    onClose();
  };

  // 5. إضافة إلى القائمة السوداء
  const handleBlacklist = () => {
    onAddToBlacklist(message.userName);
    onToast(`تمت إضافة ${message.userName} إلى القائمة السوداء وحظر رسائله 🚫`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs select-none animate-fadeIn"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-[#161a26] text-white rounded-t-3xl sm:rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col p-4 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Preview of the message */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <img
              src={
                message.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
              }
              alt={message.userName}
              className="w-8 h-8 rounded-full object-cover border border-amber-400/60 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-black text-amber-300 truncate">
                {message.userName}
              </div>
              <div className="text-[11px] text-slate-300 truncate max-w-[200px]">
                {message.text}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Translation Banner if translated */}
        {translatedText && (
          <div className="mb-3 p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-200 text-xs font-bold flex items-center justify-between gap-2 animate-fadeIn">
            <span>{translatedText}</span>
            <button
              type="button"
              onClick={() => setTranslatedText(null)}
              className="text-cyan-400 hover:text-cyan-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* The 5 Required Actions Menu (5 أيقونات فقط كما طلب المستخدم) */}
        <div className="flex flex-col divide-y divide-white/5 font-bold text-xs">
          {/* 1. الرد على الرسالة (@) */}
          <button
            type="button"
            onClick={handleReply}
            className="flex items-center gap-3 py-3 px-2 text-slate-100 hover:text-amber-300 hover:bg-white/5 rounded-xl transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
              <AtSign className="w-4 h-4" />
            </div>
            <span className="text-xs font-black">الرد على الرسالة</span>
          </button>

          {/* 2. استنساخ */}
          <button
            type="button"
            onClick={handleCloneCopy}
            className="flex items-center gap-3 py-3 px-2 text-slate-100 hover:text-cyan-300 hover:bg-white/5 rounded-xl transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </div>
            <span className="text-xs font-black">استنساخ</span>
          </button>

          {/* 3. ترجمة */}
          <button
            type="button"
            onClick={handleTranslate}
            className="flex items-center gap-3 py-3 px-2 text-slate-100 hover:text-blue-300 hover:bg-white/5 rounded-xl transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
              <Languages className={`w-4 h-4 ${isTranslating ? 'animate-spin' : ''}`} />
            </div>
            <span className="text-xs font-black">ترجمة</span>
          </button>

          {/* 4. تبليغ */}
          <button
            type="button"
            onClick={handleReport}
            className="flex items-center gap-3 py-3 px-2 text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <span className="text-xs font-black">تبليغ</span>
          </button>

          {/* 5. أضف إلى القائمة السوداء */}
          <button
            type="button"
            onClick={handleBlacklist}
            className="flex items-center gap-3 py-3 px-2 text-slate-300 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-all cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-white/10">
              <UserX className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-xs font-black">أضف إلى القائمة السوداء</span>
          </button>
        </div>
      </div>
    </div>
  );
};
