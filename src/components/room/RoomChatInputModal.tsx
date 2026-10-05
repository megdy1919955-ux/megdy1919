import React, { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { CornerUpLeft, X } from 'lucide-react';
import { VipBroadcastChatInput } from './VipBroadcastChatInput';

export interface RoomChatInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputMessage: string;
  setInputMessage: React.Dispatch<React.SetStateAction<string>> | ((val: string) => void);
  canUserType: boolean;
  isVipBroadcastActive: boolean;
  onToggleVipBroadcast: () => void;
  vipBroadcastRemaining: number;
  onSendMessage: () => void;
  replyingToMessage?: { id: string; userName: string; text: string; avatar?: string } | null;
  onCancelReply: () => void;
  isHost?: boolean;
}

/**
 * نافذة إدخال رسائل الشات المنفصلة (مفككة بالكامل في ملف مخصص)
 * تشمل تتبع لوحة المفاتيح التلقائي عبر VisualViewport ومعاينة الرد على الرسائل وميزات البث VIP
 */
export const RoomChatInputModal: React.FC<RoomChatInputModalProps> = ({
  isOpen,
  onClose,
  inputMessage,
  setInputMessage,
  canUserType,
  isVipBroadcastActive,
  onToggleVipBroadcast,
  vipBroadcastRemaining,
  onSendMessage,
  replyingToMessage,
  onCancelReply,
  isHost = true,
}) => {
  const [viewportMetrics, setViewportMetrics] = useState<{
    height: number;
    offsetTop: number;
    keyboardOpen: boolean;
  }>({
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    offsetTop: 0,
    keyboardOpen: false,
  });

  // Track visual viewport dynamically when open to prevent gaps with on-screen keyboard
  useEffect(() => {
    if (!isOpen) return;

    const updateMetrics = () => {
      if (window.visualViewport) {
        const vv = window.visualViewport;
        const isKeyboard = vv.height < window.innerHeight * 0.85;
        setViewportMetrics({
          height: vv.height,
          offsetTop: vv.offsetTop,
          keyboardOpen: isKeyboard,
        });
      } else {
        setViewportMetrics({
          height: window.innerHeight,
          offsetTop: 0,
          keyboardOpen: false,
        });
      }
    };

    updateMetrics();
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateMetrics);
      window.visualViewport.addEventListener('scroll', updateMetrics);
    }
    window.addEventListener('resize', updateMetrics);

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateMetrics);
        window.visualViewport.removeEventListener('scroll', updateMetrics);
      }
      window.removeEventListener('resize', updateMetrics);
    };
  }, [isOpen]);

  // Stabilize viewport and instantly eliminate keyboard dismissal scroll gaps
  useEffect(() => {
    const handleViewportReset = () => {
      if (!isOpen) {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        if (document.body) document.body.scrollTop = 0;
        if (document.documentElement) document.documentElement.scrollTop = 0;
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportReset);
      window.visualViewport.addEventListener('scroll', handleViewportReset);
    }
    window.addEventListener('scroll', handleViewportReset, { passive: true });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportReset);
        window.visualViewport.removeEventListener('scroll', handleViewportReset);
      }
      window.removeEventListener('scroll', handleViewportReset);
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-x-0 z-50 flex items-end justify-center bg-transparent cursor-default select-none pointer-events-auto transition-opacity duration-75"
          style={{
            top: `${viewportMetrics.offsetTop}px`,
            height: `${viewportMetrics.height}px`,
          }}
          onPointerDown={(e) => {
            if (e.target === e.currentTarget) {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }
              onClose();
            }
          }}
        >
          <div
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md bg-[#0e1424]/95 border-t border-white/15 px-3 pt-2.5 rounded-t-2xl shadow-2xl pointer-events-auto transform-gpu ${
              viewportMetrics.keyboardOpen
                ? 'pb-2'
                : 'pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]'
            }`}
          >
            {/* CONDITIONAL REPLY PREVIEW BAR (معاينة الرد الشرطية - تظهر فقط عند وجود رد مفعل) */}
            {replyingToMessage && (
              <div className="flex items-center justify-between gap-2 p-2 mb-2 bg-[#1B2338] border border-amber-400/40 border-r-4 border-r-amber-400 rounded-xl text-xs shadow-md">
                <div className="flex items-center gap-2 min-w-0">
                  {/* Speaker Avatar Thumbnail */}
                  <img
                    src={
                      replyingToMessage.avatar ||
                      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
                    }
                    alt={replyingToMessage.userName}
                    className="w-7 h-7 rounded-full object-cover border border-amber-400/60 shadow-xs shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 text-[10px] font-black text-amber-300">
                      <CornerUpLeft className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>جاري الرد على @{replyingToMessage.userName}:</span>
                    </div>
                    <span className="text-[11px] text-slate-100 font-medium truncate">
                      {replyingToMessage.text}
                    </span>
                  </div>
                </div>
                {/* Close Icon (X) button to cancel reply */}
                <button
                  type="button"
                  onClick={onCancelReply}
                  className="p-1 text-slate-400 hover:text-red-400 rounded-full hover:bg-white/10 cursor-pointer transition-colors shrink-0"
                  title="إلغاء الرد"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* MODULAR VIP BROADCAST CHAT INPUT BAR */}
            <VipBroadcastChatInput
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              canUserType={canUserType}
              isVipBroadcastActive={isVipBroadcastActive}
              onToggleVipBroadcast={onToggleVipBroadcast}
              vipBroadcastRemaining={vipBroadcastRemaining}
              onSendMessage={onSendMessage}
              isHost={isHost}
            />
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
