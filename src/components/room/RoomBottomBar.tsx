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
      style={{
        backgroundColor: hexToRgba(
          config.bottomBarBgColor || '#0D121F',
          (config.bottomBarOpacity ?? 90) / 100
        ),
        borderColor: config.bottomBarBorderColor || 'rgba(255, 255, 255, 0.1)',
        backdropFilter: `blur(${config.bottomBarBackdropBlur || 16}px)`
      }}
      className="relative z-30 px-3 py-1.5 border-t flex items-center justify-between gap-1 w-full max-w-full overflow-x-hidden select-none"
    >
      {/* Far Right (1st in DOM): Chat Input Popup Toggle Button */}
      <button
        onClick={onOpenChatInput}
        title={isChatLocked && !canUserTypeInChat ? 'الدردشة مقفلة للمستمعين 🔒' : 'إرسال رسالة'}
        style={{
          backgroundColor: isChatLocked && !canUserTypeInChat ? undefined : config.bottomButtonsBg || '#1A2234'
        }}
        className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-md relative ${
          isChatLocked && !canUserTypeInChat
            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50 hover:bg-rose-900/80 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
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

      {/* 2nd from Right (2nd in DOM): Mic Toggle Button (Visible ONLY when user is sitting on a mic seat) */}
      {isUserOnMic && (
        <button
          onClick={onToggleMyMic}
          title={
            isMySeatMutedByAdmin
              ? 'الميكروفون مكتوم إدارياً 🔒 (استخدم نافذة البروفايل للتحكم)'
              : isMyMicMuted
              ? 'فتح المايك (Unmute)'
              : 'كتم المايك (Mute)'
          }
          style={{
            backgroundColor:
              isMySeatMutedByAdmin || isMyMicMuted ? undefined : config.bottomButtonsBg || '#1A2234'
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow-md relative ${
            isMySeatMutedByAdmin
              ? 'bg-rose-950/90 border border-rose-500 text-rose-300 ring-2 ring-rose-500/40 opacity-90'
              : isMyMicMuted
              ? 'bg-red-500/80 text-white'
              : 'text-slate-300 hover:brightness-125'
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
      )}

      {/* 3rd from Right (3rd in DOM): Emoji Button */}
      <button
        onClick={onToggleEmojiPicker}
        style={{
          backgroundColor: config.bottomButtonsBg || '#1A2234'
        }}
        className="w-8 h-8 rounded-full hover:brightness-125 text-yellow-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative"
      >
        <Smile className="w-4 h-4" />
      </button>

      {/* Center (4th in DOM): Prominent Glowing Gift Box Button */}
      <button
        id="room-gift-button"
        onClick={onOpenGiftDrawer}
        style={{
          boxShadow: `0 0 ${config.bottomGiftGlowIntensity ?? 16}px ${
            config.bottomGiftGlowColor || '#ec4899'
          }`
        }}
        className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 p-0.5 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 -translate-y-0.5 animate-pulse"
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
          <Gift className="w-4.5 h-4.5 text-white fill-white" />
        </div>
      </button>

      {/* 3rd from Left (5th in DOM): YoHo Private Messages / Chat Bottom Sheet Button */}
      <button
        id="btn-room-bottom-messages"
        onClick={onOpenMessagesModal}
        style={{
          backgroundColor: config.bottomButtonsBg || '#1A2234'
        }}
        className="w-8 h-8 rounded-full hover:brightness-125 text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-md relative group"
        title="الرسائل والمحادثات الخاصة (دردشة)"
      >
        <Mail className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
        <span className="absolute -top-0.5 -right-0.5 bg-[#FF4D61] text-white text-[8px] font-mono font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#0D121F] shadow-sm animate-pulse">
          3
        </span>
      </button>

      {/* 2nd from Left (6th in DOM): Gamepad Games Button */}
      <button
        onClick={onOpenToolsModal}
        className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-600 via-purple-600 to-pink-500 text-white flex items-center justify-center cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.5)] transition-transform hover:scale-105"
        title="الألعاب التفاعلية والأدوات"
      >
        <Gamepad2 className="w-4 h-4" />
      </button>

      {/* Far Left (7th in DOM): Grid Menu Button */}
      <button
        id="room-bottom-left-actions"
        onClick={onOpenToolsModal}
        style={{
          backgroundColor: config.bottomButtonsBg || '#1A2234'
        }}
        className="w-8 h-8 rounded-full hover:brightness-125 text-slate-300 flex items-center justify-center cursor-pointer transition-colors shadow-md"
        title="الأدوات الأساسية والألعاب"
      >
        <Grid className="w-4 h-4" />
      </button>
    </div>
  );
};
