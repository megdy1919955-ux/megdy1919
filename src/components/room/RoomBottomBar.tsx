import React from 'react';
import { MessageSquare, Lock, Mic, MicOff, Smile, Gift, Mail, Gamepad2, Grid } from 'lucide-react';
import { MainRoomCustomizerConfig } from '../../types/roomCustomizer';
import { hexToRgba } from '../../lib/roomCustomizerService';

export interface RoomBottomBarProps {
  mainRoomConfig?: MainRoomCustomizerConfig;
  isChatLocked: boolean;
  canUserTypeInChat: boolean;
  isUserOnMic: boolean;
  isMySeatMutedByAdmin: boolean;
  isMyMicMuted: boolean;
  showEmojiPicker: boolean;
  onOpenChatInput: () => void;
  onToggleMyMic: () => void;
  onToggleEmojiPicker: () => void;
  onOpenGiftDrawer: () => void;
  onOpenMessagesModal: () => void;
  onOpenToolsModal: () => void;
}

export const RoomBottomBar: React.FC<RoomBottomBarProps> = ({
  mainRoomConfig,
  isChatLocked,
  canUserTypeInChat,
  isUserOnMic,
  isMySeatMutedByAdmin,
  isMyMicMuted,
  showEmojiPicker,
  onOpenChatInput,
  onToggleMyMic,
  onToggleEmojiPicker,
  onOpenGiftDrawer,
  onOpenMessagesModal,
  onOpenToolsModal
}) => {
  const config = mainRoomConfig || ({} as MainRoomCustomizerConfig);

  return (
    <div
      id="room-bottom-navigation-bar"
      style={{
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      }}
      className="relative z-30 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] bg-transparent grid grid-cols-7 items-center justify-items-center w-full max-w-full overflow-x-hidden select-none border-t-0"
    >
      {/* 1. Slot 1 (Far Right in RTL): Chat Input Popup Toggle Button */}
      <div id="room-bottom-chat-slot" className="flex items-center justify-center w-full">
        <button
          id="room-bottom-chat-button"
          onClick={onOpenChatInput}
          title={isChatLocked && !canUserTypeInChat ? 'الدردشة مقفلة للمستمعين 🔒' : 'إرسال رسالة'}
          style={{
            backgroundColor: isChatLocked && !canUserTypeInChat ? undefined : config.bottomButtonsBg || 'rgba(26, 34, 52, 0.75)'
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md relative backdrop-blur-sm border border-white/10 active:scale-95 ${
            isChatLocked && !canUserTypeInChat
              ? 'bg-rose-950/80 text-rose-300 border-rose-500/50 hover:bg-rose-900/80 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
              : 'hover:brightness-125 text-slate-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          {isChatLocked && !canUserTypeInChat ? (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[9px] shadow-md border border-[#0D121F] animate-pulse">
              <Lock className="w-2.5 h-2.5 stroke-[2.5]" />
            </span>
          ) : (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-red-500 ring-1.5 ring-[#0D121F]" />
          )}
        </button>
      </div>

      {/* 2. Slot 2 (2nd from Right in RTL): Mic Toggle Button (Fixed Slot - Visibility.INVISIBLE when not on mic) */}
      <div id="room-bottom-mic-slot" className="flex items-center justify-center w-full">
        <button
          id="room-bottom-mic-button"
          onClick={isUserOnMic ? onToggleMyMic : undefined}
          disabled={!isUserOnMic}
          aria-hidden={!isUserOnMic}
          tabIndex={isUserOnMic ? 0 : -1}
          title={
            !isUserOnMic
              ? undefined
              : isMySeatMutedByAdmin
              ? 'الميكروفون مكتوم إدارياً 🔒 (استخدم نافذة البروفايل للتحكم)'
              : isMyMicMuted
              ? 'فتح المايك (Unmute)'
              : 'كتم المايك (Mute)'
          }
          style={{
            backgroundColor:
              isMySeatMutedByAdmin || isMyMicMuted ? undefined : config.bottomButtonsBg || 'rgba(26, 34, 52, 0.75)'
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md relative backdrop-blur-sm border border-white/10 transition-all duration-150 ${
            !isUserOnMic
              ? 'invisible pointer-events-none opacity-0 select-none'
              : isMySeatMutedByAdmin
              ? 'visible opacity-100 bg-rose-950/90 border-rose-500 text-rose-300 ring-2 ring-rose-500/40 cursor-pointer active:scale-95'
              : isMyMicMuted
              ? 'visible opacity-100 bg-red-500/85 text-white hover:brightness-110 cursor-pointer active:scale-95'
              : 'visible opacity-100 text-slate-300 hover:brightness-125 cursor-pointer active:scale-95'
          }`}
        >
          {isMySeatMutedByAdmin ? (
            <div className="relative flex items-center justify-center">
              <MicOff className="w-4 h-4 text-rose-300 stroke-[2.5]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 ring-1 ring-white" />
            </div>
          ) : isMyMicMuted ? (
            <MicOff className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <Mic className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>
      </div>

      {/* 3. Slot 3 (3rd from Right in RTL): Emoji Picker Button */}
      <div id="room-bottom-emoji-slot" className="flex items-center justify-center w-full">
        <button
          id="room-bottom-emoji-button"
          onClick={onToggleEmojiPicker}
          style={{
            backgroundColor: config.bottomButtonsBg || 'rgba(26, 34, 52, 0.75)'
          }}
          className="w-8 h-8 rounded-full hover:brightness-125 text-yellow-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative backdrop-blur-sm border border-white/10 active:scale-95"
          title="الملصقات والإيموجي"
        >
          <Smile className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Slot 4 (Center in RTL): Prominent Glowing Gift Box Button */}
      <div id="room-bottom-gift-slot" className="flex items-center justify-center w-full">
        <button
          id="room-gift-button"
          onClick={onOpenGiftDrawer}
          style={{
            boxShadow: `0 0 ${config.bottomGiftGlowIntensity ?? 16}px ${
              config.bottomGiftGlowColor || '#ec4899'
            }`
          }}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 p-0.5 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 -translate-y-0.5 animate-pulse"
          title="إرسال هدية"
        >
          <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Gift className="w-4.5 h-4.5 text-white fill-white" />
          </div>
        </button>
      </div>

      {/* 5. Slot 5 (3rd from Left in RTL): Messages / Chat Bottom Sheet Button */}
      <div id="room-bottom-messages-slot" className="flex items-center justify-center w-full">
        <button
          id="btn-room-bottom-messages"
          onClick={onOpenMessagesModal}
          style={{
            backgroundColor: config.bottomButtonsBg || 'rgba(26, 34, 52, 0.75)'
          }}
          className="w-8 h-8 rounded-full hover:brightness-125 text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative group backdrop-blur-sm border border-white/10 active:scale-95"
          title="الرسائل والمحادثات الخاصة (دردشة)"
        >
          <Mail className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
          <span className="absolute -top-0.5 -right-0.5 bg-[#FF4D61] text-white text-[8px] font-mono font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#0D121F] shadow-sm animate-pulse">
            3
          </span>
        </button>
      </div>

      {/* 6. Slot 6 (2nd from Left in RTL): Gamepad Games Button */}
      <div id="room-bottom-games-slot" className="flex items-center justify-center w-full">
        <button
          id="room-bottom-gamepad-button"
          onClick={onOpenToolsModal}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 via-purple-600 to-pink-500 text-white flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-transform hover:scale-105 active:scale-95 border border-white/10"
          title="الألعاب التفاعلية والأدوات"
        >
          <Gamepad2 className="w-4 h-4" />
        </button>
      </div>

      {/* 7. Slot 7 (Far Left in RTL): Grid Menu Button */}
      <div id="room-bottom-grid-slot" className="flex items-center justify-center w-full">
        <button
          id="room-bottom-left-actions"
          onClick={onOpenToolsModal}
          style={{
            backgroundColor: config.bottomButtonsBg || 'rgba(26, 34, 52, 0.75)'
          }}
          className="w-8 h-8 rounded-full hover:brightness-125 text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-md backdrop-blur-sm border border-white/10 active:scale-95"
          title="الأدوات الأساسية والألعاب"
        >
          <Grid className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
