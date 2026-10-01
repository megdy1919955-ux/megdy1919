import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Lottie from 'lottie-react';
import {
  X,
  Radio,
  GripHorizontal,
  Link as LinkIcon,
  Plus,
  Sparkles,
  Check,
  Trash2,
  Crown,
  Flame,
  Gift,
  Zap,
  Upload,
  Pencil,
  RotateCcw,
  Image as ImageIcon,
  CheckCircle2,
  FolderOpen,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import {
  getStoredEmojiConfigs,
  saveStoredEmojiConfigs,
  EmojiLottieConfig,
  fetchAndCacheNetworkLottie,
  getStoredUserCustomReactions,
  saveStoredUserCustomReactions,
  CustomReactionItemOverride,
  getCachedLottieSchema
} from '../lib/lottieCache';
import { isDeveloper, getActiveAppRole, AppRole } from '../lib/roleService';

interface MovableEmojiLottiePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSendEmojiReaction: (emoji: string, customAssetPath?: string, glowColor?: string) => void;
}

// Reaction Item Definition for Najm Voice Room
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

const PRESET_GLOW_COLORS = [
  { name: 'ذهبي', color: '#F59E0B' },
  { name: 'وردي', color: '#EC4899' },
  { name: 'سماوي', color: '#3B82F6' },
  { name: 'أحمر', color: '#EF4444' },
  { name: 'أخضر', color: '#10B981' },
  { name: 'بنفسجي', color: '#8B5CF6' },
];

// Helper to preserve animated files (GIF, SVG, Lottie) and optimize static photos
async function optimizeImageForIcon(file: File, maxDim = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    // 1. If JSON Lottie Animation
    if (fileName.endsWith('.json') || fileType === 'application/json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonText = e.target?.result as string;
          JSON.parse(jsonText); // Validate JSON
          const dataUri = `data:application/json;base64,${btoa(unescape(encodeURIComponent(jsonText)))}`;
          resolve(dataUri);
        } catch {
          reject(new Error('ملف Lottie JSON غير صالح'));
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
      return;
    }

    // 2. If Animated GIF - KEEP 100% NATIVE ANIMATION FRAMES (DO NOT FLATTEN WITH CANVAS)
    if (fileType === 'image/gif' || fileName.endsWith('.gif')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    // 3. If SVG vector / animated SVG
    if (fileType === 'image/svg+xml' || fileName.endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    // 4. If animated WebP / APNG or lightweight image (< 300KB)
    if (file.size <= 300 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    // 5. For heavy static raster photos (JPG, high-res PNG) -> Resize to maxDim crisp icon
    const reader = new FileReader();
    reader.onload = (e) => {
      const srcData = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(srcData);
          return;
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const webpData = canvas.toDataURL('image/webp', 0.9);
          if (webpData && webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // fallback
        }
        const pngData = canvas.toDataURL('image/png');
        resolve(pngData);
      };
      img.onerror = () => resolve(srcData);
      img.src = srcData;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const CATEGORY_TABS = [
  { id: 'free', label: 'مجاني' },
  { id: 'featured', label: 'مميزة' },
  { id: 'custom', label: 'مخصص' },
  { id: 'vip', label: 'VIP' },
  { id: 'activity', label: 'نشاط' },
] as const;

type CategoryTabId = (typeof CATEGORY_TABS)[number]['id'];

export const MovableEmojiLottiePicker: React.FC<MovableEmojiLottiePickerProps> = ({
  isOpen,
  onClose,
  onSendEmojiReaction,
}) => {
  const [activeTab, setActiveTab] = useState<CategoryTabId>('free');
  const [currentRole, setCurrentRole] = useState<AppRole>(() => getActiveAppRole());
  const isDev = isDeveloper(currentRole);
  const [slideDirection, setSlideDirection] = useState<'right' | 'left'>('right');
  const [configs, setConfigs] = useState<Record<string, EmojiLottieConfig>>(() => getStoredEmojiConfigs());
  const [userOverrides, setUserOverrides] = useState<Record<string, CustomReactionItemOverride>>(() => getStoredUserCustomReactions());

  const touchStartPos = useRef<{ x: number; y: number; time: number } | null>(null);

  // Edit / Customization Modal State for a selected Item
  const [editingItem, setEditingItem] = useState<ReactionItem | null>(null);
  const [customImageBase64, setCustomImageBase64] = useState<string>('');
  const [customLabelInput, setCustomLabelInput] = useState<string>('');
  const [customGlowColor, setCustomGlowColor] = useState<string>('#F59E0B');
  const [saveSuccessToast, setSaveSuccessToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Custom Lottie URL Form State (under custom tab)
  const [newEmoji, setNewEmoji] = useState('✨');
  const [newUrl, setNewUrl] = useState('');
  const [newGlow, setNewGlow] = useState('#F59E0B');
  const [isAddingUrl, setIsAddingUrl] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setConfigs(getStoredEmojiConfigs());
      setUserOverrides(getStoredUserCustomReactions());
    };
    const handleRoleChanged = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.role) {
        setCurrentRole(customEvent.detail.role);
      }
    };
    window.addEventListener('lottie_config_updated', handleUpdate);
    window.addEventListener('app_role_changed', handleRoleChanged);
    return () => {
      window.removeEventListener('lottie_config_updated', handleUpdate);
      window.removeEventListener('app_role_changed', handleRoleChanged);
    };
  }, []);

  const switchTab = (tabId: CategoryTabId, direction?: 'right' | 'left') => {
    const currentIdx = CATEGORY_TABS.findIndex((t) => t.id === activeTab);
    const targetIdx = CATEGORY_TABS.findIndex((t) => t.id === tabId);
    setSlideDirection(direction || (targetIdx >= currentIdx ? 'right' : 'left'));
    setActiveTab(tabId);
  };

  // Gesture Listeners for Swiping / Dragging Left & Right between Category Pages
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartPos.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartPos.current.x;
    const deltaY = touchEndY - touchStartPos.current.y;
    const deltaTime = Date.now() - touchStartPos.current.time;
    touchStartPos.current = null;

    // Detect horizontal swipe intent (deltaX threshold > 28px, predominantly horizontal)
    if (Math.abs(deltaX) > 28 && Math.abs(deltaX) > Math.abs(deltaY) * 0.9 && deltaTime < 900) {
      const currentIdx = CATEGORY_TABS.findIndex((t) => t.id === activeTab);

      // Swiping to the Right (deltaX > 0): Flip to next category in order (مجاني -> مميزة -> مخصص -> VIP -> نشاط)
      if (deltaX > 0) {
        const nextIdx = (currentIdx + 1) % CATEGORY_TABS.length;
        switchTab(CATEGORY_TABS[nextIdx].id, 'right');
      }
      // Swiping to the Left (deltaX < 0): Flip to previous category (نشاط -> VIP -> مخصص -> مميزة -> مجاني)
      else if (deltaX < 0) {
        const prevIdx = (currentIdx - 1 + CATEGORY_TABS.length) % CATEGORY_TABS.length;
        switchTab(CATEGORY_TABS[prevIdx].id, 'left');
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchStartPos.current) return;
    const deltaX = e.clientX - touchStartPos.current.x;
    const deltaY = e.clientY - touchStartPos.current.y;
    const deltaTime = Date.now() - touchStartPos.current.time;
    touchStartPos.current = null;

    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 0.9 && deltaTime < 900) {
      const currentIdx = CATEGORY_TABS.findIndex((t) => t.id === activeTab);
      if (deltaX > 0) {
        const nextIdx = (currentIdx + 1) % CATEGORY_TABS.length;
        switchTab(CATEGORY_TABS[nextIdx].id, 'right');
      } else if (deltaX < 0) {
        const prevIdx = (currentIdx - 1 + CATEGORY_TABS.length) % CATEGORY_TABS.length;
        switchTab(CATEGORY_TABS[prevIdx].id, 'left');
      }
    }
  };

  // Open Edit Modal for a specific reaction item
  const handleOpenEditModal = (item: ReactionItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const existing = userOverrides[item.id];
    setEditingItem(item);
    setCustomImageBase64(existing?.customImage || '');
    setCustomLabelInput(existing?.customLabel || item.label);
    setCustomGlowColor(existing?.customGlow || item.glow || '#F59E0B');
  };

  // Handle file upload from phone memory (Gallery / Storage)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedDataUri = await optimizeImageForIcon(file, 256);
      setCustomImageBase64(optimizedDataUri);
    } catch (err: any) {
      alert(err?.message || 'تعذر معالجة الملف، يرجى اختيار صورة صالحة');
    }
  };

  // Save custom shape into the icon permanently
  const handleSaveCustomShape = () => {
    if (!editingItem) return;
    const updated: Record<string, CustomReactionItemOverride> = {
      ...userOverrides,
      [editingItem.id]: {
        id: editingItem.id,
        emoji: editingItem.emoji,
        customImage: customImageBase64.trim() || undefined,
        customLabel: customLabelInput.trim() || editingItem.label,
        customGlow: customGlowColor,
      }
    };
    saveStoredUserCustomReactions(updated);
    setUserOverrides(updated);
    setSaveSuccessToast(`تم حفظ تصميم "${customLabelInput || editingItem.label}" بنجاح في الأيقونة!`);
    setTimeout(() => {
      setSaveSuccessToast(null);
      setEditingItem(null);
    }, 1200);
  };

  // Reset / Restore default shape for the editing item
  const handleRestoreDefaultShape = () => {
    if (!editingItem) return;
    const updated = { ...userOverrides };
    delete updated[editingItem.id];
    saveStoredUserCustomReactions(updated);
    setUserOverrides(updated);
    setSaveSuccessToast('تمت استعادة الشكل الافتراضي للأيقونة.');
    setTimeout(() => {
      setSaveSuccessToast(null);
      setEditingItem(null);
    }, 1000);
  };

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

  // Render vertical scrollable reaction items (from top to bottom)
  const renderVerticalReactionGrid = (items: ReactionItem[]) => (
    <div className="h-full w-full grid grid-cols-4 gap-2.5 overflow-y-auto custom-scrollbar p-1 content-start touch-pan-y">
      {items.map((item) => {
        const override = userOverrides[item.id];
        const customCfg = configs[item.emoji];

        const activeImage = override?.customImage;
        const displayLabel = override?.customLabel || item.label;
        const activePath = activeImage || customCfg?.lottieAssetPath || item.lottiePath || 'emojis/laugh.json';
        const activeGlow = override?.customGlow || customCfg?.glowColor || item.glow || '#F59E0B';

        return (
          <div
            key={item.id}
            id={`reaction-card-${item.id}`}
            onClick={() => {
              onSendEmojiReaction(item.emoji, activePath, activeGlow);
              onClose();
            }}
            className="group relative bg-[#F7F9FC] hover:bg-amber-400/10 border border-slate-200/80 hover:border-amber-400 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 transition-all duration-200 active:scale-95 shadow-xs hover:shadow-md cursor-pointer select-none"
          >
            {/* Direct Upload / Edit Icon Button (Strictly Developer only) */}
            {isDev && (
              <button
                onClick={(e) => handleOpenEditModal(item, e)}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-slate-900/90 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-400 text-white flex items-center justify-center shadow-md transition-all z-20 active:scale-90 cursor-pointer"
                title="إدخال وتخصيص الشكل من ذاكرة الهاتف 📁 (المبرمج)"
              >
                <Upload className="w-3 h-3 text-emerald-300 group-hover:animate-bounce" />
              </button>
            )}

            {/* Custom Design Indicator Badge */}
            {activeImage && (
              <span
                className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-xs"
                style={{ backgroundColor: activeGlow }}
                title="شكل مخصص محفوظ"
              />
            )}

            {item.isVip && !activeImage && (
              <div className="absolute top-1 left-1 bg-amber-400 text-slate-950 p-0.5 rounded-full text-[8px] font-black shadow-2xs">
                <Crown className="w-2.5 h-2.5" />
              </div>
            )}

            {/* Visual Icon / Uploaded Design */}
            <div className="w-10 h-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-115 filter drop-shadow-sm overflow-hidden">
              {activeImage ? (
                activeImage.startsWith('data:application/json') ? (
                  <div className="w-9 h-9 flex items-center justify-center pointer-events-none">
                    <Lottie
                      animationData={getCachedLottieSchema(item.id, activeImage)}
                      loop={true}
                      autoplay={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                ) : (
                  <img
                    src={activeImage}
                    alt={displayLabel}
                    className="w-9 h-9 object-contain rounded-xl drop-shadow-sm"
                  />
                )
              ) : (
                <span className="text-3xl">{item.emoji}</span>
              )}
            </div>

            {/* Label */}
            <span className="text-[10.5px] font-bold text-slate-700 group-hover:text-amber-600 truncate max-w-full text-center dir-rtl">
              {displayLabel}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 pointer-events-none flex items-end justify-center p-0 sm:p-3"
      >
        {/* Invisible Click Catcher to Close without any dark background dimming */}
        <div
          className="absolute inset-0 bg-transparent pointer-events-auto cursor-default"
          onClick={onClose}
        />

        {/* Stable Fixed Bottom Dock Modal */}
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 30, stiffness: 350 }}
          className="pointer-events-auto w-full max-w-md bg-white/95 border-t border-x sm:border border-slate-200/90 rounded-t-3xl sm:rounded-3xl p-3.5 shadow-[0_-12px_45px_rgba(0,0,0,0.2)] text-slate-900 space-y-2.5 backdrop-blur-2xl select-none relative z-10"
          dir="rtl"
        >
          {/* Subtle Top Indicator Line */}
          <div className="w-full flex items-center justify-center pb-0.5">
            <div className="w-10 h-1 bg-slate-300 rounded-full" />
          </div>

          {/* Top Tabs Bar */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
            <div className="flex items-center gap-4 text-xs font-black">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => switchTab(tab.id)}
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
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Swipeable Category Container (Left & Right Swipe between Categories / Vertical Scroll for Icons) */}
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className="h-[290px] w-full relative overflow-hidden select-none"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: slideDirection === 'right' ? 40 : -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: slideDirection === 'right' ? -40 : 40 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="w-full h-full"
              >
                {/* 1. مجاني Tab Panel */}
                {activeTab === 'free' && (
                  <div className="w-full h-full overflow-hidden">
                    {renderVerticalReactionGrid(FREE_REACTIONS)}
                  </div>
                )}

                {/* 2. مميزة Tab Panel */}
                {activeTab === 'featured' && (
                  <div className="w-full h-full overflow-hidden">
                    {renderVerticalReactionGrid(FEATURED_REACTIONS)}
                  </div>
                )}

                {/* 3. مخصص Tab Panel */}
                {activeTab === 'custom' && (
                  <div className="h-full space-y-3 overflow-y-auto custom-scrollbar p-1 touch-pan-y">
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

                {/* 4. VIP Tab Panel */}
                {activeTab === 'vip' && (
                  <div className="w-full h-full overflow-hidden">
                    {renderVerticalReactionGrid(VIP_REACTIONS)}
                  </div>
                )}

                {/* 5. نشاط Tab Panel */}
                {activeTab === 'activity' && (
                  <div className="w-full h-full overflow-hidden">
                    {renderVerticalReactionGrid(ACTIVITY_REACTIONS)}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Instruction */}
          {isDev && (
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-bold px-1">
              <span className="flex items-center gap-1 text-emerald-700">
                <Upload className="w-3 h-3 text-emerald-600" />
                <span>اضغط أيقونة الرفع ⬆️ فوق أي رمز لإدخال تصميمك وحفظه من هاتفك (خاص بالمبرمج)</span>
              </span>
            </div>
          )}

          {/* CUSTOM SHAPE UPLOAD MODAL FROM PHONE MEMORY */}
          <AnimatePresence>
            {isDev && editingItem && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute inset-0 z-30 bg-white/95 backdrop-blur-md rounded-3xl p-4 flex flex-col justify-between overflow-y-auto"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="space-y-3">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">
                          تخصيص شكل التعبير ({editingItem.label})
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          اختر تصميماً أو صورة من ذاكرة الجوال لحفظها في هذه الأيقونة
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingItem(null)}
                      className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hidden File Input for Phone Memory / Gallery */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,.gif,.png,.jpg,.jpeg,.webp,.svg,.json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {/* Upload / File Picker Zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors text-center"
                  >
                    {customImageBase64 ? (
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-16 h-16 rounded-2xl p-1 border-2 shadow-md flex items-center justify-center bg-slate-900 overflow-hidden"
                          style={{ borderColor: customGlowColor }}
                        >
                          {customImageBase64.startsWith('data:application/json') ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <Lottie
                                animationData={getCachedLottieSchema('preview', customImageBase64)}
                                loop={true}
                                autoplay={true}
                                style={{ width: '100%', height: '100%' }}
                              />
                            </div>
                          ) : (
                            <img
                              src={customImageBase64}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          )}
                        </div>
                        <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          تم اختيار الشكل (انقر للتغيير من المعرض)
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <FolderOpen className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-emerald-800 block">
                            انقر لاختيار تصميم أو صورة من ذاكرة الهاتف
                          </span>
                          <span className="text-[9.5px] text-slate-500 block mt-0.5">
                            يدعم: صور PNG شفافة، GIF متحركة، JPG، SVG، أو ملفات Lottie JSON
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Label Input */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-700">
                      اسم التعبير (اختياري):
                    </label>
                    <input
                      type="text"
                      value={customLabelInput}
                      onChange={(e) => setCustomLabelInput(e.target.value)}
                      placeholder={editingItem.label}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Glow Color Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-700 flex items-center justify-between">
                      <span>لون التوهج التفاعلي:</span>
                      <span className="font-mono text-[9px] text-slate-400">{customGlowColor}</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {PRESET_GLOW_COLORS.map((preset) => (
                        <button
                          key={preset.color}
                          type="button"
                          onClick={() => setCustomGlowColor(preset.color)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                            customGlowColor === preset.color ? 'scale-125 ring-2 ring-slate-800' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: preset.color, borderColor: '#fff' }}
                          title={preset.name}
                        />
                      ))}
                      <input
                        type="color"
                        value={customGlowColor}
                        onChange={(e) => setCustomGlowColor(e.target.value)}
                        className="w-6 h-6 rounded-md bg-transparent cursor-pointer border-none"
                        title="اختر لون مخصص"
                      />
                    </div>
                  </div>

                  {/* Live Toast Confirmation */}
                  {saveSuccessToast && (
                    <div className="p-2 bg-emerald-600 text-white rounded-xl text-xs font-black text-center animate-bounce flex items-center justify-center gap-1.5 shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{saveSuccessToast}</span>
                    </div>
                  )}
                </div>

                {/* Modal Action Buttons */}
                <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                  <button
                    onClick={handleSaveCustomShape}
                    className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black rounded-xl text-xs transition-all shadow-md active:scale-98 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>حفظ في الأيقونة</span>
                  </button>

                  {userOverrides[editingItem.id] && (
                    <button
                      onClick={handleRestoreDefaultShape}
                      className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 font-bold rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                      title="استعادة الشكل الأصلي"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>استعادة الأصلي</span>
                    </button>
                  )}

                  <button
                    onClick={() => setEditingItem(null)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

