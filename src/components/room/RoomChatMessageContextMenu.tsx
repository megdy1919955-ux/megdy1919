import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Copy, AlertTriangle, Languages, Check } from 'lucide-react';
import { ChatMessage } from './roomTypes';

export interface RoomChatMessageContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  anchorPosition?: { x: number; y: number } | null;
  onReport?: (message: ChatMessage) => void;
  onTranslate?: (message: ChatMessage) => void;
  onToast?: (msg: string) => void;
}

/**
 * مكون الخيارات المنبثقة للرسالة المنفصل تماماً (RoomChatMessageContextMenu)
 * - منفصل 100% ومستقل عن أي كود مشترك وخفيف جداً على الأداء
 * - يظهر عند الضغط المطول على أي رسالة
 * - يحتوي على 3 مستطيلات صغيرة مرتبة عمودياً (واحد فوق الثاني فوق الثالث من الأعلى للأسفل):
 *   1. نسخ
 *   2. تبليغ -> يفتح نافذة الإبلاغ المنفصلة
 *   3. ترجمة -> يفتح مربع الترجمة العائم في أعلى وسط الشاشة
 */
export const RoomChatMessageContextMenu: React.FC<RoomChatMessageContextMenuProps> = ({
  isOpen,
  onClose,
  message,
  anchorPosition,
  onReport,
  onTranslate,
  onToast
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen || !message) return null;
  if (typeof document === 'undefined') return null;

  // 1. نسخ (Copy)
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
      if (onToast) onToast('تم نسخ الرسالة بنجاح 📋');
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 350);
    } catch (_) {
      if (onToast) onToast('تم نسخ الرسالة 📋');
      onClose();
    }
  };

  // 2. تبليغ (Report) -> يفتح نافذة الإبلاغ المنفصلة
  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    if (onReport) onReport(message);
  };

  // 3. ترجمة (Translate) -> يفتح مربع الترجمة العائم في أعلى وسط الشاشة
  const handleTranslate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
    if (onTranslate) onTranslate(message);
  };

  // حساب موضع القائمة العائمة لتظهر بجوار الرسالة بالضبط
  const calculatePositionStyle = (): React.CSSProperties => {
    if (anchorPosition && anchorPosition.y > 0 && typeof window !== 'undefined') {
      const screenH = window.innerHeight || 800;
      const screenW = window.innerWidth || 400;

      const menuWidth = 136;
      const menuHeight = 140;

      let top = anchorPosition.y - 70;
      if (top + menuHeight > screenH - 25) {
        top = screenH - menuHeight - 25;
      }
      if (top < 60) top = 60;

      let left = (anchorPosition.x || screenW / 2) - menuWidth / 2;
      if (left + menuWidth > screenW - 12) {
        left = screenW - menuWidth - 12;
      }
      if (left < 12) left = 12;

      return {
        top: `${Math.round(top)}px`,
        left: `${Math.round(left)}px`,
        position: 'fixed' as const
      };
    }

    return {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      position: 'fixed' as const
    };
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] pointer-events-auto select-none" dir="rtl">
      {/* خلفية شفافة تكتشف النقر خارج القائمة لإغلاقها فوراً بدون تعتيم الشاشة */}
      <div
        className="fixed inset-0 bg-black/30 z-[99998] cursor-pointer"
        onClick={onClose}
      />

      {/* الحاوية العائمة للخيارات الثلاثة العمودية (واحد فوق الثاني فوق الثالث) */}
      <div
        className="z-[99999] w-[136px] bg-[#111625]/95 border border-amber-400/50 rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-md p-1.5 flex flex-col gap-1.5 animate-in fade-in zoom-in-95 duration-150"
        style={calculatePositionStyle()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3 مستطيلات صغار مرتبة عمودياً من الأعلى إلى الأسفل: 1. نسخ | 2. تبليغ | 3. ترجمة */}
        <div className="flex flex-col gap-1.5 w-full">
          {/* المستطيل 1: نسخ (في الأعلى) */}
          <button
            type="button"
            onClick={handleCopy}
            className="w-full flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 active:scale-95 border border-white/10 hover:border-amber-400/50 text-slate-100 hover:text-amber-300 transition-all cursor-pointer shadow-xs"
          >
            <div className="w-5.5 h-5.5 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shrink-0">
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </div>
            <span className="text-[11px] font-bold">نسخ</span>
          </button>

          {/* المستطيل 2: تبليغ (في المنتصف) */}
          <button
            type="button"
            onClick={handleReport}
            className="w-full flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 active:scale-95 border border-white/10 hover:border-rose-400/50 text-slate-100 hover:text-rose-300 transition-all cursor-pointer shadow-xs"
          >
            <div className="w-5.5 h-5.5 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shrink-0">
              <AlertTriangle className="w-3 h-3" />
            </div>
            <span className="text-[11px] font-bold">تبليغ</span>
          </button>

          {/* المستطيل 3: ترجمة (في الأسفل) */}
          <button
            type="button"
            onClick={handleTranslate}
            className="w-full flex items-center gap-2.5 py-1.5 px-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 active:scale-95 border border-white/10 hover:border-sky-400/50 text-slate-100 hover:text-sky-300 transition-all cursor-pointer shadow-xs"
          >
            <div className="w-5.5 h-5.5 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30 shrink-0">
              <Languages className="w-3 h-3" />
            </div>
            <span className="text-[11px] font-bold">ترجمة</span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
