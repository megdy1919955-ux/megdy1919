import React from 'react';
import { Cloud } from 'lucide-react';

export const VIP_BROADCAST_STORAGE_KEY = 'super_legend_vip_broadcast_remaining';

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
}

/**
 * VipBroadcastChatInput:
 * Component for the room chat input bar encapsulating the micro VIP 'N' broadcast toggle,
 * quota counter, glowing active signal, text input field, and send button.
 */
export const VipBroadcastChatInput: React.FC<VipBroadcastChatInputProps> = React.memo(({
  inputMessage,
  setInputMessage,
  canUserType,
  isVipBroadcastActive,
  onToggleVipBroadcast,
  vipBroadcastRemaining,
  onSendMessage
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        onSendMessage(e);
      }}
      className="flex items-center gap-2"
    >
      {/* Chat input box rectangle (المستطيل الخاص بالرسائل وبداخله زر N الصغير على اليسار) */}
      <div
        className={`relative flex-1 flex items-center border rounded-xl transition-all ${
          isVipBroadcastActive
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

          {/* Blue Active Signal Indicator when active ("عند الضغط عليه تظهر اشاره زرقاء") */}
          {isVipBroadcastActive && (
            <span className="absolute -top-1 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 border border-white shadow-[0_0_6px_#38bdf8]"></span>
            </span>
          )}
        </button>

        {/* Input Box - pl-14 for the micro N button on the left, pr-3.5 for RTL text */}
        <input
          type="text"
          autoFocus
          disabled={!canUserType}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            canUserType
              ? isVipBroadcastActive
                ? "اكتب رسالة الإعلان المتحرك VIP..."
                : "إرسال رسالة للشات..."
              : "الدردشة مقفلة، اطلب المايك للكتابة 🔒"
          }
          className="w-full bg-transparent pl-14 pr-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
        />
      </div>

      {/* Send button on the left side in RTL layout */}
      <button
        type="submit"
        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-xs cursor-pointer shadow-md hover:brightness-105 active:scale-95 transition-transform shrink-0"
      >
        إرسال
      </button>
    </form>
  );
});
