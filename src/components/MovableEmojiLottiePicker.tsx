import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Radio, GripHorizontal, Link as LinkIcon, Plus, Sparkles, Check, Trash2, Crown, Flame, Gift, Zap } from 'lucide-react';
import {
  getStoredEmojiConfigs,
  saveStoredEmojiConfigs,
  EmojiLottieConfig,
  fetchAndCacheNetworkLottie
} from '../lib/lottieCache';

interface MovableEmojiLottiePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSendEmojiReaction: (emoji: string, customAssetPath?: string, glowColor?: string) => void;
  onOpenVoiceRemote: () => void;
}

// Reaction Item Definition matching YoHo Voice Room
interface ReactionItem {
  id: string;
  emoji: string;
  label: string;
  lottiePath?: string;
  glow?: string;
  isVip?: boolean;
}

const FREE_REACTIONS: ReactionItem[] = [
  { id: 'light', emoji: '🔴', label: 'ضوء', lottiePath: 'emojis/party.json', glow: '#EF4444' },
  { id: 'hands', emoji: '🖐️', label: 'أيادي', lottiePath: 'emojis/clap.json', glow: '#3B82F6' },
  { id: 'happy', emoji: '😎', label: 'السعيدة', lottiePath: 'emojis/laugh.json', glow: '#F59E0B' },
  { id: 'stigma', emoji: '😁', label: 'وصمة', lottiePath: 'emojis/laugh.json', glow: '#10B981' },
  { id: 'gift', emoji: '🎁', label: 'هدية', lottiePath: 'emojis/party.json', glow: '#EC4899' },
  { id: 'angry', emoji: '😡', label: 'غاضب', lottiePath: 'emojis/shock.json', glow: '#DC2626' },
  { id: 'thanks', emoji: '💖', label: 'شكرا', lottiePath: 'emojis/heart.json', glow: '#F43F5E' },
  { id: 'slots', emoji: '🎰', label: 'رقم', lottiePath: 'emojis/party.json', glow: '#8B5CF6' },
  { id: 'rose_smile', emoji: '🌹', label: 'ابتسامة', lottiePath: 'emojis/heart.json', glow: '#F43F5E' },
  { id: 'love', emoji: '😍', label: 'حب', lottiePath: 'emojis/heart.json', glow: '#E11D48' },
  { id: 'fun', emoji: '😋', label: 'مرح', lottiePath: 'emojis/laugh.json', glow: '#F59E0B' },
  { id: 'pampered', emoji: '☺️', label: 'مدلع', lottiePath: 'emojis/heart.json', glow: '#F43F5E' },
  { id: 'sanitizer', emoji: '🧴', label: 'المطهر', lottiePath: 'emojis/shock.json', glow: '#06B6D4' },
  { id: 'sad', emoji: '😢', label: '$Sad$', lottiePath: 'emojis/cry.json', glow: '#3B82F6' },
  { id: 'little', emoji: '🤏', label: '$Litte$', lottiePath: 'emojis/laugh.json', glow: '#EAB308' },
  { id: 'cool_mask', emoji: '🕶️', label: 'بارد', lottiePath: 'emojis/laugh.json', glow: '#10B981' },
  { id: 'inject', emoji: '💉', label: '$Inject$', lottiePath: 'emojis/shock.json', glow: '#8B5CF6' },
  { id: 'surprise', emoji: '😱', label: '$Surprise$', lottiePath: 'emojis/shock.json', glow: '#F59E0B' },
  { id: 'teasing', emoji: '😜', label: '$Teasing$', lottiePath: 'emojis/laugh.json', glow: '#EC4899' },
  { id: 'thinking', emoji: '🤔', label: '$Thinking$', lottiePath: 'emojis/shock.json', glow: '#6366F1' },
  { id: 'yes', emoji: '😉', label: 'YES', lottiePath: 'emojis/laugh.json', glow: '#10B981' },
  { id: 'girl', emoji: '🤦‍♀️', label: '$Girl$', lottiePath: 'emojis/cry.json', glow: '#EC4899' },
  { id: 'pleading', emoji: '🥺', label: '$Pleading$', lottiePath: 'emojis/cry.json', glow: '#3B82F6' },
  { id: 'man', emoji: '🤦‍♂️', label: '$Man$', lottiePath: 'emojis/cry.json', glow: '#64748B' },
  { id: 'wronged', emoji: '🥺', label: 'wronged', lottiePath: 'emojis/cry.json', glow: '#3B82F6' },
  { id: 'no', emoji: '☝️', label: '$No$', lottiePath: 'emojis/shock.json', glow: '#EF4444' },
  { id: 'peace', emoji: '✌️', label: '$Peace$', lottiePath: 'emojis/party.json', glow: '#10B981' },
  { id: 'helpless', emoji: '🤣', label: 'عاجز', lottiePath: 'emojis/laugh.json', glow: '#F59E0B' },
  { id: 'flying_kiss', emoji: '😘', label: 'flying kiss', lottiePath: 'emojis/heart.json', glow: '#F43F5E' },
  { id: 'sleepy', emoji: '🥱', label: 'sleepy', lottiePath: 'emojis/shock.json', glow: '#64748B' },
  { id: 'really', emoji: '😎', label: 'Really !', lottiePath: 'emojis/laugh.json', glow: '#3B82F6' },
  { id: 'laughing', emoji: '😂', label: '$Laughing$', lottiePath: 'emojis/laugh.json', glow: '#F59E0B' },
  { id: 'enjoyable', emoji: '👳', label: 'ممتع', lottiePath: 'emojis/party.json', glow: '#EAB308' },
  { id: 'tea', emoji: '☕', label: 'شاي', lottiePath: 'emojis/party.json', glow: '#D97706' },
  { id: 'monkey', emoji: '🙈', label: '$Monkey$', lottiePath: 'emojis/shock.json', glow: '#A855F7' },
  { id: 'clapping', emoji: '👏', label: 'تصفيق', lottiePath: 'emojis/clap.json', glow: '#10B981' },
  { id: 'mask_heart', emoji: '😷', label: 'حب', lottiePath: 'emojis/heart.json', glow: '#EC4899' },
  { id: 'right_kiss', emoji: '😘', label: 'الحق قبلة', lottiePath: 'emojis/heart.json', glow: '#F43F5E' },
  { id: 'love_mask', emoji: '🥰', label: 'Love', lottiePath: 'emojis/heart.json', glow: '#E11D48' },
  { id: 'dice', emoji: '🎲', label: 'حجر النرد', lottiePath: 'emojis/party.json', glow: '#6366F1' },
  { id: 'wink', emoji: '😉', label: '$Wink$', lottiePath: 'emojis/laugh.json', glow: '#10B981' },
  { id: 'fashion', emoji: '😎', label: 'موضه', lottiePath: 'emojis/laugh.json', glow: '#3B82F6' },
  { id: 'left_kiss', emoji: '💋', label: 'قبيلة اليسار', lottiePath: 'emojis/heart.json', glow: '#EC4899' },
];

const FEATURED_REACTIONS: ReactionItem[] = [
  { id: 'fire', emoji: '🔥', label: 'طاقة نارية', lottiePath: 'emojis/party.json', glow: '#F97316' },
  { id: 'crown', emoji: '👑', label: 'تاج VIP', lottiePath: 'emojis/party.json', glow: '#F59E0B' },
  { id: 'diamond', emoji: '💎', label: 'ماس براق', lottiePath: 'emojis/heart.json', glow: '#3B82F6' },
  { id: 'rocket', emoji: '🚀', label: 'صاروخ', lottiePath: 'emojis/party.json', glow: '#EF4444' },
  { id: 'trophy', emoji: '🏆', label: 'كأس البطولة', lottiePath: 'emojis/party.json', glow: '#EAB308' },
  { id: 'lightning', emoji: '⚡', label: 'صاعقة', lottiePath: 'emojis/shock.json', glow: '#8B5CF6' },
  { id: 'star', emoji: '🌟', label: 'نجم سوبر', lottiePath: 'emojis/party.json', glow: '#F59E0B' },
  { id: 'music', emoji: '🎶', label: 'أنغام', lottiePath: 'emojis/party.json', glow: '#EC4899' },
];

const VIP_REACTIONS: ReactionItem[] = [
  { id: 'vip_dragon', emoji: '🐉', label: 'التنين الذهبي', lottiePath: 'emojis/party.json', glow: '#F59E0B', isVip: true },
  { id: 'vip_lion', emoji: '🦁', label: 'الأسد المبتسم', lottiePath: 'emojis/party.json', glow: '#EAB308', isVip: true },
  { id: 'vip_eagle', emoji: '🦅', label: 'نسر الملوك', lottiePath: 'emojis/party.json', glow: '#3B82F6', isVip: true },
  { id: 'vip_castle', emoji: '🏰', label: 'القصر الملكي', lottiePath: 'emojis/party.json', glow: '#A855F7', isVip: true },
];

const ACTIVITY_REACTIONS: ReactionItem[] = [
  { id: 'act_game', emoji: '🎮', label: 'تحدي الألعاب', lottiePath: 'emojis/party.json', glow: '#10B981' },
  { id: 'act_bullseye', emoji: '🎯', label: 'الهدف المباشر', lottiePath: 'emojis/party.json', glow: '#EF4444' },
  { id: 'act_mic', emoji: '🎤', label: 'نجم المايك', lottiePath: 'emojis/clap.json', glow: '#EC4899' },
  { id: 'act_drum', emoji: '🥁', label: 'إيقاع الغرفة', lottiePath: 'emojis/party.json', glow: '#F59E0B' },
];

export const MovableEmojiLottiePicker: React.FC<MovableEmojiLottiePickerProps> = ({
  isOpen,
  onClose,
  onSendEmojiReaction,
  onOpenVoiceRemote,
}) => {
  const [activeTab, setActiveTab] = useState<'free' | 'featured' | 'custom' | 'vip' | 'activity'>('free');
  const [configs, setConfigs] = useState<Record<string, EmojiLottieConfig>>(() => getStoredEmojiConfigs());

  // Custom Lottie URL Form State
  const [newEmoji, setNewEmoji] = useState('✨');
  const [newUrl, setNewUrl] = useState('');
  const [newGlow, setNewGlow] = useState('#F59E0B');
  const [isAddingUrl, setIsAddingUrl] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setConfigs(getStoredEmojiConfigs());
    };
    window.addEventListener('lottie_config_updated', handleUpdate);
    return () => window.removeEventListener('lottie_config_updated', handleUpdate);
  }, []);

  if (!isOpen) return null;

  const handleAddCustomLottieUrl = () => {
    if (!newUrl.trim()) return;
    const finalEmoji = newEmoji.trim() || '💫';
    const updated = {
      ...configs,
      [finalEmoji]: {
        emoji: finalEmoji,
        category: 'fire' as const,
        lottieAssetPath: newUrl.trim(),
        glowColor: newGlow,
        speed: 1.0,
      },
    };
    saveStoredEmojiConfigs(updated);
    setConfigs(updated);
    fetchAndCacheNetworkLottie(newUrl.trim(), finalEmoji);
    setNewUrl('');
    setIsAddingUrl(false);
  };

  const handleDeleteCustomConfig = (emojiKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const copy = { ...configs };
    delete copy[emojiKey];
    saveStoredEmojiConfigs(copy);
    setConfigs(copy);
  };

  const renderReactionGrid = (items: ReactionItem[]) => (
    <div className="grid grid-cols-4 gap-2.5 max-h-72 overflow-y-auto custom-scrollbar p-1">
      {items.map((item) => {
        const customCfg = configs[item.emoji];
        const activePath = customCfg?.lottieAssetPath || item.lottiePath || 'emojis/laugh.json';
        const activeGlow = customCfg?.glowColor || item.glow || '#F59E0B';

        return (
          <button
            key={item.id}
            onClick={() => {
              onSendEmojiReaction(item.emoji, activePath, activeGlow);
              onClose();
            }}
            className="group relative bg-[#F7F9FC] hover:bg-amber-400/10 border border-slate-200/80 hover:border-amber-400 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs hover:shadow-md cursor-pointer"
          >
            {item.isVip && (
              <div className="absolute top-1 left-1 bg-amber-400 text-slate-950 p-0.5 rounded-full text-[8px] font-black shadow-2xs">
                <Crown className="w-2.5 h-2.5" />
              </div>
            )}
            
            <div className="text-3xl transition-transform duration-200 group-hover:scale-115 filter drop-shadow-sm">
              {item.emoji}
            </div>

            <span className="text-[10.5px] font-bold text-slate-700 group-hover:text-amber-600 truncate max-w-full text-center dir-rtl">
              {item.label}
            </span>

            {/* Subtle glow indicator dot if custom Lottie is bound */}
            {customCfg && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-1 ring-white"
                style={{ backgroundColor: activeGlow }}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 pointer-events-auto bg-transparent flex items-end justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        {/* Movable & Draggable Card Modal */}
        <motion.div
          drag
          dragMomentum={false}
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 120, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 120, opacity: 0, scale: 0.96 }}
          className="pointer-events-auto w-full max-w-md bg-white border border-slate-200/90 rounded-3xl p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.4)] text-slate-900 space-y-2.5 backdrop-blur-2xl select-none"
          dir="rtl"
        >
          {/* Drag Handle */}
          <div className="w-full flex items-center justify-center cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity">
            <div className="w-12 h-1.5 bg-slate-300 rounded-full flex items-center justify-center">
              <GripHorizontal className="w-4 h-4 text-slate-600" />
            </div>
          </div>

          {/* Top Tabs Bar - Exact YoHo Order */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <div className="flex items-center gap-4 text-xs font-black">
              {[
                { id: 'free', label: 'مجاني' },
                { id: 'featured', label: 'مميزة' },
                { id: 'custom', label: 'مخصص' },
                { id: 'vip', label: 'VIP' },
                { id: 'activity', label: 'نشاط' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative py-1 transition-colors cursor-pointer ${
                      isActive ? 'text-emerald-600 font-extrabold' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onClose();
                  onOpenVoiceRemote();
                }}
                className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 text-[10px] font-black hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                title="تفعيل التحكم بالصوت المباشر للمايك"
              >
                <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
                <span>الريموت الصوتي 🎙️</span>
              </button>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab Views Content */}
          {activeTab === 'free' && renderReactionGrid(FREE_REACTIONS)}
          {activeTab === 'featured' && renderReactionGrid(FEATURED_REACTIONS)}
          {activeTab === 'vip' && renderReactionGrid(VIP_REACTIONS)}
          {activeTab === 'activity' && renderReactionGrid(ACTIVITY_REACTIONS)}

          {activeTab === 'custom' && (
            <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar p-1">
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <span className="text-[11px] font-extrabold text-slate-800 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5 text-amber-500" />
                  إضافة رابط Lottie مخصص:
                </span>
                <button
                  onClick={() => setIsAddingUrl(!isAddingUrl)}
                  className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black rounded-xl text-[10px] hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>إضافة رابط</span>
                </button>
              </div>

              {/* URL Form */}
              {isAddingUrl && (
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-300 space-y-2 animate-fadeIn">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="رمز (مثال: 🔥)"
                      value={newEmoji}
                      onChange={(e) => setNewEmoji(e.target.value)}
                      className="w-16 px-2 py-1.5 bg-white border border-slate-300 rounded-xl text-center text-sm"
                    />
                    <input
                      type="text"
                      placeholder="رابط Lottie (https://...json)"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs dir-ltr"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <span>لون الإشعاع:</span>
                      <input
                        type="color"
                        value={newGlow}
                        onChange={(e) => setNewGlow(e.target.value)}
                        className="w-6 h-6 rounded-md bg-transparent cursor-pointer border-none"
                      />
                    </div>
                    <button
                      onClick={handleAddCustomLottieUrl}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>حفظ وتشغيل</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Links Cards */}
              <div className="grid grid-cols-2 gap-2">
                {(Object.values(configs) as EmojiLottieConfig[])
                  .filter(
                    (c) => c.lottieAssetPath.startsWith('http://') || c.lottieAssetPath.startsWith('https://')
                  )
                  .map((cfg) => (
                    <div
                      key={cfg.emoji}
                      onClick={() => {
                        onSendEmojiReaction(cfg.emoji, cfg.lottieAssetPath, cfg.glowColor);
                        onClose();
                      }}
                      className="p-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-400 rounded-2xl flex items-center justify-between gap-2 transition-all cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-2xl">{cfg.emoji}</span>
                        <div className="truncate">
                          <span className="block text-[11px] font-bold text-slate-800 truncate">
                            {cfg.emoji} رابط مخصص
                          </span>
                          <span className="block text-[9px] text-slate-500 truncate dir-ltr">
                            {cfg.lottieAssetPath}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteCustomConfig(cfg.emoji, e)}
                        className="p-1 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="حذف الرابط"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Footer Hint */}
          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 text-center font-bold flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>انقر على أي رمز لتشغيله واقعياً فوق مايك المستخدم فوراً 🎙️</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
