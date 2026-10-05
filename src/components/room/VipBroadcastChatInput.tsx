import React, { useRef, useEffect } from 'react';
import { Cloud } from 'lucide-react';

export const VIP_BROADCAST_STORAGE_KEY = 'super_legend_vip_broadcast_remaining';
export const CHAT_MAX_CHARACTERS = 100;

export const getSavedVipBroadcastQuota = (defaultQuota: number = 50): number => {
  try {
    const saved = localStorage.getItem(VIP_BROADCAST_STORAGE_KEY);
    if (saved !== null) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
  } catch (e) {}
  return defaultQuota;
};

export const saveVipBroadcastQuota = (quota: number): void => {
  try {
    localStorage.setItem(VIP_BROADCAST_STORAGE_KEY, String(Math.max(0, quota)));
  } catch (e) {}
};

export interface VipBroadcastChatInputProps {
  inputMessage: string;
  setInputMessage: (val: string) => void;
  canUserType: boolean;
  isVipBroadcastActive: boolean;
  onToggleVipBroadcast: () => void;
  vipBroadcastRemaining: number;
  onSendMessage: (e: React.FormEvent) => void;
  isHost?: boolean;
}

/**
 * VipBroadcastChatInput:
 * مستطيل إدخال صافي وأنيق بدون حشو نصوص أو عدادات متداخلة.
 * خط كتابة كبير وواضح مع تمدد مرن للأعلى والأسفل عند امتلاء النص لقراءة سلسة ومريحة.
 */
export const VipBroadcastChatInput: React.FC<VipBroadcastChatInputProps> = React.memo(({
  inputMessage,
  setInputMessage,
  canUserType,
  isVipBroadcastActive,
  onToggleVipBroadcast,
  vipBroadcastRemaining,
  onSendMessage,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // مرونة التمدد للأعلى والأسفل تلقائياً مع حجم النص المكتوب
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollH = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(Math.max(scrollH, 44), 120)}px`;
    }
  }, [inputMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawVal = e.target.value;
    if (rawVal.length <= CHAT_MAX_CHARACTERS) {
      setInputMessage(rawVal);
    } else {
      setInputMessage(rawVal.slice(0, CHAT_MAX_CHARACTERS));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      onSendMessage(e);
    }
  };

  return (
    <div className="flex flex-col w-full" dir="rtl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          onSendMessage(e);
        }}
        className="flex items-end gap-2 w-full"
      >
        {/* Chat input box rectangle (مستطيل صافي بدون أي حشو) */}
        <div
          className={`relative flex-1 flex items-end border rounded-2xl transition-all ${
            isVipBroadcastActive
              ? 'bg-[#131b2e] border-cyan-500/70 ring-1 ring-cyan-500/40'
              : canUserType
                ? 'bg-[#1A2132] border-white/10 focus-within:border-amber-400'
                : 'bg-slate-900 border-rose-500/30 text-slate-500'
          }`}
        >
          {/* Micro VIP Cloud with 'N' button - مثبت على اليسار داخل المستطيل */}
          <button
            type="button"
            onClick={onToggleVipBroadcast}
            className={`absolute left-2 bottom-2 px-1.5 py-0.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer select-none shrink-0 z-10 ${
              isVipBroadcastActive
                ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.8)] ring-1.5 ring-cyan-300'
                : 'bg-white/5 hover:bg-white/10 text-slate-400 border border-white/10'
            }`}
            title={
              isVipBroadcastActive
                ? `إعلان VIP مفعل (إشارة زرقاء 🔵) - متبقي ${vipBroadcastRemaining} رسالة`
                : `تفعيل إعلان VIP المتحرك بالسحابة N (متبقي ${vipBroadcastRemaining})`
            }
          >
            <div className="relative flex items-center justify-center">
              <Cloud className={`w-3.5 h-3.5 ${isVipBroadcastActive ? 'text-cyan-200 fill-cyan-400/50' : 'text-slate-300'}`} />
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black font-mono tracking-tighter text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.9)]">
                N
              </span>
            </div>

            {/* عداد رصيد الـ N المتبقي */}
            <span className={`text-[8.5px] font-mono font-black ${
              isVipBroadcastActive ? 'text-cyan-100' : 'text-amber-300'
            }`}>
              {vipBroadcastRemaining}
            </span>

            {/* إشارة النبض الزرقاء عند تفعيل الـ N */}
            {isVipBroadcastActive && (
              <span className="absolute -top-1 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 border border-white shadow-[0_0_6px_#38bdf8]"></span>
              </span>
            )}
          </button>

          {/* مساحة كتابة مرنة، خط كبير وواضح، تتمدد تلقائياً للأعلى والأسفل عند الامتلاء */}
          <textarea
            ref={textareaRef}
            rows={1}
            autoFocus
            maxLength={CHAT_MAX_CHARACTERS}
            disabled={!canUserType}
            value={inputMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent pl-16 pr-3.5 py-2.5 text-[15px] sm:text-base font-bold text-white focus:outline-hidden resize-none leading-relaxed overflow-y-auto max-h-[120px]"
            style={{ minHeight: '44px' }}
          />
        </div>

        {/* زر الإرسال */}
        <button
          type="submit"
          className="h-[44px] px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:brightness-105 active:scale-95 transition-transform shrink-0 flex items-center justify-center"
        >
          إرسال
        </button>
      </form>
    </div>
  );
});

VipBroadcastChatInput.displayName = 'VipBroadcastChatInput';
