import React from 'react';
import { Cloud, AlertCircle } from 'lucide-react';

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
 * كود مستقل ومخصص بالكامل لمستطيل إدخال رسائل الشات.
 * مقيد بـ 100 حرف كحد أقصى لكل رسالة، مع عداد لحظي وتنبيه عند الوصول للحد الأقصى
 * ليقوم المستخدم أو المضيف بإرسالها وكتابة ما تبقى في رسالة أخرى.
 */
export const VipBroadcastChatInput: React.FC<VipBroadcastChatInputProps> = React.memo(({
  inputMessage,
  setInputMessage,
  canUserType,
  isVipBroadcastActive,
  onToggleVipBroadcast,
  vipBroadcastRemaining,
  onSendMessage,
  isHost = true,
}) => {
  const currentLength = inputMessage.length;
  const isMaxLengthReached = currentLength >= CHAT_MAX_CHARACTERS;
  const isNearLimit = currentLength >= 85;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Strict 100 character limit enforcement
    if (rawVal.length <= CHAT_MAX_CHARACTERS) {
      setInputMessage(rawVal);
    } else {
      setInputMessage(rawVal.slice(0, CHAT_MAX_CHARACTERS));
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full" dir="rtl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          onSendMessage(e);
        }}
        className="flex items-center gap-2 w-full"
      >
        {/* Chat input box rectangle (المستطيل الواحد للرسائل) */}
        <div
          className={`relative flex-1 flex items-center border rounded-xl transition-all ${
            isMaxLengthReached
              ? 'bg-[#181a24] border-amber-400 ring-1 ring-amber-400/50'
              : isVipBroadcastActive
                ? 'bg-[#131b2e] border-cyan-500/70 ring-1 ring-cyan-500/40'
                : canUserType
                  ? 'bg-[#1A2132] border-white/10 focus-within:border-amber-400'
                  : 'bg-slate-900 border-rose-500/30 text-slate-500'
          }`}
        >
          {/* Micro VIP Cloud with 'N' button - Positioned on the LEFT side inside the rectangle */}
          <button
            type="button"
            onClick={onToggleVipBroadcast}
            className={`absolute left-1.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer select-none shrink-0 ${
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

            {/* Small remaining VIP quota count */}
            <span className={`text-[8.5px] font-mono font-black ${
              isVipBroadcastActive ? 'text-cyan-100' : 'text-amber-300'
            }`}>
              {vipBroadcastRemaining}
            </span>

            {/* Blue Active Signal Indicator when active */}
            {isVipBroadcastActive && (
              <span className="absolute -top-1 -right-0.5 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 border border-white shadow-[0_0_6px_#38bdf8]"></span>
              </span>
            )}
          </button>

          {/* Input Box - pl-14 for the micro N button on the left, pr-3.5 for RTL text, max 100 characters */}
          <input
            type="text"
            autoFocus
            maxLength={CHAT_MAX_CHARACTERS}
            disabled={!canUserType}
            value={inputMessage}
            onChange={handleInputChange}
            placeholder={
              canUserType
                ? isVipBroadcastActive
                  ? "اكتب رسالة الإعلان المتحرك VIP (حد 100 حرف)..."
                  : isHost
                    ? "اكتب رسالة كـ مضيف (حد 100 حرف)..."
                    : "إرسال رسالة للشات (حد 100 حرف)..."
                : "الدردشة مقفلة، اطلب المايك للكتابة 🔒"
            }
            className="w-full bg-transparent pl-14 pr-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-hidden"
          />

          {/* Character counter pill inside right side of the rectangle */}
          <div
            className={`absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold select-none pointer-events-none transition-colors ${
              isMaxLengthReached
                ? 'bg-amber-500/20 text-yellow-300 border border-yellow-400/40'
                : isNearLimit
                  ? 'bg-amber-500/10 text-amber-300'
                  : 'text-slate-400'
            }`}
          >
            {currentLength}/{CHAT_MAX_CHARACTERS}
          </div>
        </div>

        {/* Send button */}
        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:brightness-105 active:scale-95 transition-transform shrink-0"
        >
          إرسال
        </button>
      </form>

      {/* Guidance note when reaching or nearing limit */}
      {isMaxLengthReached && (
        <div className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold text-yellow-300/90 animate-fadeIn select-none">
          <AlertCircle className="w-3 h-3 text-yellow-400 shrink-0" />
          <span>وصلت للحد الأقصى (100 حرف). أرسل الرسالة وتابع ما تبقى في رسالة جديدة.</span>
        </div>
      )}
    </div>
  );
});

VipBroadcastChatInput.displayName = 'VipBroadcastChatInput';
