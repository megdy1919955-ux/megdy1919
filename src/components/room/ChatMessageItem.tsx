import React from 'react';
import { motion } from 'motion/react';
import { Crown, CornerUpLeft } from 'lucide-react';
import { UserProfileData } from '../AdvancedUserProfileModal';
import { ChatMessage, BubbleSkinType } from './roomTypes';
import { HostYoHoBadges } from './HostYoHoBadges';

// Helper function to return dynamic chat bubble skin styling based on equipped skin item
export const getBubbleStyles = (skin: BubbleSkinType = 'default', isHost?: boolean, isGift?: boolean) => {
  const baseClasses =
    'w-fit max-w-[98%] self-start break-words [overflow-wrap:anywhere] [word-break:break-word] rounded-2xl text-xs rounded-tr-xs shadow-xs transition-all duration-200 overflow-hidden';

  if (isGift) {
    return `${baseClasses} bg-gradient-to-r from-pink-950/90 via-purple-950/90 to-pink-950/90 border border-pink-500/50 text-pink-200 px-2.5 py-1 text-[10.5px]`;
  }

  switch (skin) {
    case 'red_gold':
      return `${baseClasses} relative bg-gradient-to-r from-red-950 via-rose-950 to-amber-950 border-2 border-amber-400/90 text-amber-100 shadow-[0_0_15px_rgba(245,158,11,0.35)] px-3 py-1.5`;
    case 'royal_gold':
      return `${baseClasses} relative bg-gradient-to-r from-amber-950 via-yellow-950 to-amber-950 border border-amber-300/80 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.25)] px-3 py-1.5`;
    case 'cyber_neon':
      return `${baseClasses} relative bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-400/80 text-cyan-100 shadow-[0_0_12px_rgba(6,182,212,0.3)] px-3 py-1.5`;
    case 'pink_velvet':
      return `${baseClasses} relative bg-gradient-to-r from-fuchsia-950 via-pink-950 to-purple-950 border border-pink-400/80 text-pink-100 shadow-[0_0_12px_rgba(236,72,153,0.3)] px-3 py-1.5`;
    case 'emerald_luxury':
      return `${baseClasses} relative bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 border border-emerald-400/80 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.3)] px-3 py-1.5`;
    case 'default':
    default:
      if (isHost) {
        return `${baseClasses} bg-gradient-to-r from-amber-950/90 via-amber-900/90 to-amber-950/90 border border-amber-500/60 text-amber-100 px-3 py-1.5`;
      }
      return `${baseClasses} bg-[#121827]/85 border border-white/10 text-slate-100 px-3 py-1.5`;
  }
};

export interface ChatMessageItemProps {
  msg: ChatMessage;
  msgIndex: number;
  isHighlighted: boolean;
  onReplyTo: (reply: { id: string; userName: string; text: string; avatar?: string }) => void;
  onOpenChatInput: () => void;
  onOpenUserProfile?: (userData: UserProfileData) => void;
  onScrollToMessage?: (messageId: string) => void;
}

export const ChatMessageItem: React.FC<ChatMessageItemProps> = React.memo(({
  msg,
  msgIndex,
  isHighlighted,
  onReplyTo,
  onOpenChatInput,
  onOpenUserProfile,
  onScrollToMessage,
}) => {
  // 1. JOIN MESSAGE
  if (msg.isJoinMessage) {
    let vipText = 'VIP 6';
    if (typeof msg.vipLevel === 'number') {
      vipText = `VIP ${msg.vipLevel}`;
    } else if (typeof msg.vipLevel === 'string') {
      const match = msg.vipLevel.match(/\d+/);
      vipText = match ? `VIP ${match[0]}` : (msg.vipLevel.startsWith('VIP') ? msg.vipLevel : `VIP ${msg.vipLevel}`);
    }

    return (
      <motion.div
        key={`${msg.id}-${msgIndex}`}
        id={`chat-msg-${msg.id}`}
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ backgroundColor: '#000000', boxShadow: 'none' }}
        className="my-1 py-1 px-3 rounded-full bg-[#000000] border border-amber-400/50 flex items-center gap-2 w-fit max-w-[98%] backdrop-blur-xs select-none"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
            onOpenUserProfile?.({
              id: msg.id,
              name: msg.userName,
              avatar:
                msg.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
              userId: `884${msg.id.slice(-4)}`,
              country: 'السعودية',
              countryFlag: '🇸🇦',
              isHost: msg.isHost
            });
          }}
          className="w-5 h-5 rounded-full ring-1 ring-amber-400/90 overflow-hidden shrink-0 cursor-pointer"
        >
          <img
            src={
              msg.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
            }
            alt={msg.userName}
            className="w-full h-full object-cover"
          />
        </div>

        <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 text-[9px] font-mono font-black shrink-0">
          {vipText}
        </span>

        <span
          onClick={(e) => {
            e.stopPropagation();
            onOpenUserProfile?.({
              id: msg.id,
              name: msg.userName,
              avatar:
                msg.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
              userId: `884${msg.id.slice(-4)}`,
              country: 'السعودية',
              countryFlag: '🇸🇦',
              isHost: msg.isHost
            });
          }}
          className="font-black text-[11px] text-[#FDE047] hover:underline cursor-pointer whitespace-nowrap"
        >
          {msg.userName}
        </span>

        <span className="text-[10.5px] text-amber-100 font-bold whitespace-nowrap">
          انضم إلى الغرفة
        </span>

        <span className="text-[12px] animate-pulse shrink-0">✨</span>
      </motion.div>
    );
  }

  // 2. LUCKY WIN ANNOUNCEMENT RECTANGLE IN CHAT
  if (msg.isLuckyWinMessage) {
    return (
      <motion.div
        key={`${msg.id}-${msgIndex}`}
        id={`chat-msg-${msg.id}`}
        initial={{ opacity: 0, x: 25, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={() => {
          onOpenUserProfile?.({
            id: msg.id,
            name: msg.userName,
            avatar: msg.avatar,
            userId: `884${msg.id.slice(-4)}`,
            country: 'السعودية',
            countryFlag: '🇸🇦'
          });
        }}
        className="my-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-amber-950/90 via-slate-950/95 to-amber-950/90 border border-amber-400/80 flex items-center gap-2 w-fit max-w-[95%] shadow-[0_2px_12px_rgba(245,158,11,0.25)] select-none cursor-pointer backdrop-blur-md"
      >
        <div className="w-5 h-5 rounded-full ring-1 ring-amber-400 overflow-hidden shrink-0">
          <img
            src={
              msg.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
            }
            alt={msg.userName}
            className="w-full h-full object-cover"
          />
        </div>

        <span className="text-[10.5px] font-black text-amber-300 truncate max-w-[85px]">
          {msg.userName}
        </span>

        <div className="flex items-center gap-1 shrink-0 font-mono">
          <span className="text-[9.5px] text-amber-100 font-bold">ربح</span>
          <span className="text-[11px] font-black text-emerald-300 drop-shadow-xs">
            +{msg.winAmount?.toLocaleString('en-US')} 🪙
          </span>
        </div>

        {msg.multiplier && (
          <span className="px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[9px] font-mono font-black shadow-xs shrink-0">
            x{msg.multiplier}
          </span>
        )}

        <span className="text-xs animate-pulse shrink-0">🎯</span>
      </motion.div>
    );
  }

  // 3. REGULAR CHAT MESSAGE WITH SWIPE TO REPLY
  let hapticTriggered = false;

  return (
    <div
      key={`${msg.id}-${msgIndex}`}
      id={`chat-msg-${msg.id}`}
      className="relative my-1 w-full max-w-full overflow-x-hidden touch-pan-y"
    >
      <motion.div
        drag="x"
        dragDirectionLock={true}
        dragConstraints={{ left: -65, right: 0 }}
        dragElastic={0.1}
        dragSnapToOrigin={true}
        onDrag={(_, info) => {
          if (info.offset.x < -30 && !hapticTriggered) {
            hapticTriggered = true;
            if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
              try {
                window.navigator.vibrate(12);
              } catch (_) {}
            }
          }
        }}
        onDragEnd={(_, info) => {
          if (info.offset.x < -30) {
            onReplyTo({
              id: msg.id,
              userName: msg.userName,
              text: msg.text,
              avatar: msg.avatar
            });
            onOpenChatInput();
          }
        }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20, height: 0, marginTop: 0, marginBottom: 0, overflow: 'hidden' }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`flex items-start gap-2 text-xs w-full max-w-full pr-1 pl-1.5 py-1 rounded-2xl ${
          isHighlighted
            ? 'ring-2 ring-amber-400 bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.6)] z-30 transition-colors duration-300'
            : ''
        }`}
      >
        {/* Avatar */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onOpenUserProfile?.({
              id: msg.id,
              name: msg.userName,
              avatar:
                msg.avatar ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
              userId: `884${msg.id.slice(-4)}`,
              country: 'السعودية',
              countryFlag: '🇸🇦',
              isHost: msg.isHost
            });
          }}
          className="relative shrink-0 mt-0.5 ml-0.5 cursor-pointer hover:scale-105 transition-transform"
          title="انقر لمعاينة بطاقة البروفايل"
        >
          <img
            src={
              msg.avatar ||
              'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
            }
            alt={msg.userName}
            className={`w-7 h-7 rounded-full object-cover border shadow-xs ${
              msg.isHost ? 'border-amber-400 ring-2 ring-amber-500/40' : 'border-white/20'
            }`}
          />
          {msg.isHost && (
            <div className="absolute -top-1.5 -right-1 z-10">
              <Crown className="w-3.5 h-3.5 text-amber-300 fill-amber-400 drop-shadow-md animate-bounce" />
            </div>
          )}
        </div>

        {/* Content Column */}
        <div className="flex flex-col min-w-0 flex-1">
          {/* User Header */}
          <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
            <span
              onClick={(e) => {
                e.stopPropagation();
                onOpenUserProfile?.({
                  id: msg.id,
                  name: msg.userName,
                  avatar:
                    msg.avatar ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
                  userId: `884${msg.id.slice(-4)}`,
                  country: 'السعودية',
                  countryFlag: '🇸🇦',
                  isHost: msg.isHost
                });
              }}
              className={`font-black text-[11px] truncate cursor-pointer hover:underline ${
                msg.isHost
                  ? (typeof msg.vipLevel === 'number'
                      ? msg.vipLevel >= 8
                      : parseInt((msg.vipLevel || 'VIP6').toString().match(/\d+/)?.[0] || '6', 10) >= 8)
                    ? 'text-red-500 font-black drop-shadow-[0_1px_2px_rgba(239,68,68,0.6)]'
                    : 'text-white font-bold'
                  : (msg.userColor || 'text-slate-200')
              }`}
              title="انقر لمعاينة بطاقة البروفايل"
            >
              {msg.userName}
            </span>

            {/* Badges */}
            {msg.isHost ? (
              <HostYoHoBadges
                heartLevel={msg.heartLevel || 39}
                crownLevel={msg.crownLevel || 111}
                vipLevel={typeof msg.vipLevel === 'string' ? msg.vipLevel : (msg.vipLevel ? `VIP${msg.vipLevel}` : 'VIP6')}
              />
            ) : msg.badges && msg.badges.length > 0 ? (
              <div className="flex items-center gap-1 flex-wrap">
                {msg.badges.map((badge, bIdx) => (
                  <span
                    key={`${badge.id || 'badge'}-${bIdx}`}
                    className={`text-[8.5px] px-1.5 py-0.2 rounded-full font-black flex items-center gap-0.5 shadow-2xs shrink-0 ${badge.bgClass}`}
                  >
                    {badge.icon && <span className="text-[9px]">{badge.icon}</span>}
                    <span>{badge.label}</span>
                  </span>
                ))}
              </div>
            ) : null}

            {/* Quick Reply Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReplyTo({
                  id: msg.id,
                  userName: msg.userName,
                  text: msg.text,
                  avatar: msg.avatar
                });
                onOpenChatInput();
              }}
              className="mr-auto opacity-40 hover:opacity-100 text-amber-300 p-0.5 hover:bg-white/10 rounded-full transition-all cursor-pointer"
              title="رد على هذه الرسالة"
            >
              <CornerUpLeft className="w-3 h-3" />
            </button>
          </div>

          {/* Dynamic Bubble */}
          <div className={getBubbleStyles(msg.bubbleSkin, msg.isHost, msg.isGift)}>
            {/* Quoted Reply */}
            {msg.replyTo && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onScrollToMessage?.(msg.replyTo!.id);
                }}
                className="mb-1.5 p-1.5 rounded-xl bg-black/40 border-r-3 border-amber-400 text-[10px] cursor-pointer hover:bg-black/60 transition-all flex items-center justify-between gap-2 group/reply shadow-inner"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold text-amber-300 text-[9.5px]">
                    @{msg.replyTo.userName}
                  </span>
                  <span className="text-slate-200 truncate text-[9px] font-medium">
                    {msg.replyTo.text}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0 bg-amber-400/20 text-amber-300 px-1.5 py-0.5 rounded-md text-[8px] font-black group-hover/reply:bg-amber-400 group-hover/reply:text-slate-950 transition-colors">
                  <span>انتقال</span>
                  <CornerUpLeft className="w-2.5 h-2.5" />
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5 break-words [overflow-wrap:anywhere] [word-break:break-word] max-w-full">
              <span
                className={`font-bold break-words [overflow-wrap:anywhere] [word-break:break-word] leading-relaxed ${
                  msg.userColor === '#EF4444' || msg.text.includes('قام بطرد')
                    ? 'text-rose-500 font-black text-xs'
                    : msg.isGift
                    ? 'text-pink-100 text-[10.5px]'
                    : 'text-slate-100 text-xs'
                }`}
              >
                {msg.text}
              </span>
              {msg.isGift && (
                <span className="text-[8px] bg-pink-500/20 text-pink-300 font-extrabold px-1 py-0.2 rounded border border-pink-400/30 shrink-0 mr-0.5">
                  ⏱️ 10ث
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

ChatMessageItem.displayName = 'ChatMessageItem';
