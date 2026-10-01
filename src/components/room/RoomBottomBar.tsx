import React from 'react';
import { MessageSquare, Mic, MicOff, Smile, Gift, Mail, Gamepad2, Grid } from 'lucide-react';

export interface RoomBottomBarProps {
  // حالة الأزرار الأساسية (منفصلة تماماً بدون أي منطق معقد)
  isMyMicMuted?: boolean;
  isUserOnMic?: boolean;
  unreadMessagesCount?: number;

  // دوال وتوجيهات الأزرار (كل أيقونة مستقلة بنقطة استدعاء خاصة بها)
  onOpenChatInput?: () => void;
  onToggleMyMic?: () => void;
  onToggleEmojiPicker?: () => void;
  onOpenGiftDrawer?: () => void;
  onOpenMessagesModal?: () => void;
  onOpenGamesModal?: () => void;
  onOpenToolsModal?: () => void;
}

/**
 * شريط الأيقونات السفلي (RoomBottomBar)
 * هيكل مستقل ونقي 100%، مفصول تماماً عن الشات وعن المقاعد وعن أي أوامر خلفية.
 */
export const RoomBottomBar: React.FC<RoomBottomBarProps> = ({
  isMyMicMuted = false,
  isUserOnMic = true,
  unreadMessagesCount = 0,
  onOpenChatInput,
  onToggleMyMic,
  onToggleEmojiPicker,
  onOpenGiftDrawer,
  onOpenMessagesModal,
  onOpenGamesModal,
  onOpenToolsModal
}) => {
  return (
    <div
      id="room-bottom-navigation-bar"
      className="relative z-30 px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-[#0B0D17]/80 backdrop-blur-md grid grid-cols-7 items-center justify-items-center w-full max-w-full overflow-x-hidden select-none border-t border-white/5"
    >
      {/* 1. أيقونة إدخال الشات */}
      <div id="bottom-icon-chat" className="flex items-center justify-center w-full">
        <button
          onClick={onOpenChatInput}
          title="كتابة رسالة في الدردشة"
          className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/10 shadow-sm"
        >
          <MessageSquare className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* 2. أيقونة التحكم بالمايك */}
      <div id="bottom-icon-mic" className="flex items-center justify-center w-full">
        <button
          onClick={onToggleMyMic}
          title={isMyMicMuted ? 'تشغيل المايك' : 'كتم المايك'}
          className={`w-9 h-9 rounded-full active:scale-95 flex items-center justify-center transition-all border shadow-sm ${
            isMyMicMuted
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-400 hover:bg-rose-500/30'
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30'
          }`}
        >
          {isMyMicMuted ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5" />}
        </button>
      </div>

      {/* 3. أيقونة الإيموجي والتفاعلات */}
      <div id="bottom-icon-emoji" className="flex items-center justify-center w-full">
        <button
          onClick={onToggleEmojiPicker}
          title="الإيموجي والتفاعلات"
          className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 flex items-center justify-center text-amber-400 transition-all border border-white/10 shadow-sm"
        >
          <Smile className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* 4. أيقونة الهدايا (الأيقونة البارزة في المنتصف) */}
      <div id="bottom-icon-gift" className="flex items-center justify-center w-full">
        <button
          onClick={onOpenGiftDrawer}
          title="إرسال هدية"
          className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-0.5 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 -translate-y-1 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Gift className="w-5 h-5 text-white fill-white" />
          </div>
        </button>
      </div>

      {/* 5. أيقونة صندوق الرسائل الخاصة */}
      <div id="bottom-icon-messages" className="flex items-center justify-center w-full">
        <button
          onClick={onOpenMessagesModal}
          title="الرسائل والمحادثات"
          className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/10 shadow-sm relative"
        >
          <Mail className="w-4.5 h-4.5" />
          {unreadMessagesCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#0B0D17]">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>

      {/* 6. أيقونة الألعاب */}
      <div id="bottom-icon-games" className="flex items-center justify-center w-full">
        <button
          onClick={onOpenGamesModal || onOpenToolsModal}
          title="الألعاب والمسابقات"
          className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 active:scale-95 flex items-center justify-center text-white transition-all border border-white/10 shadow-sm"
        >
          <Gamepad2 className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* 7. أيقونة الأدوات والقائمة */}
      <div id="bottom-icon-tools" className="flex items-center justify-center w-full">
        <button
          onClick={onOpenToolsModal}
          title="الأدوات والإعدادات"
          className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 flex items-center justify-center text-slate-300 hover:text-white transition-all border border-white/10 shadow-sm"
        >
          <Grid className="w-4.5 h-4.5" />
        </button>
      </div>
    </div>
  );
};
