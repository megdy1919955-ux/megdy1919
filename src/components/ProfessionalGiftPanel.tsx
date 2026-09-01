import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Send,
  Globe,
  Music,
  ChevronDown,
  Gift as GiftIcon,
  Crown,
  Flame,
  Check,
  Search,
  Volume2,
  Trophy,
  Star,
  Coins,
  Zap,
  Menu,
  Headphones,
  Mic,
  Plus,
  Upload,
  ArrowUpToLine,
  SlidersHorizontal,
  Wrench,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import {
  GiftItem,
  getGiftsDatabase,
  subscribeToGifts,
  getCmsUserRole,
  setCmsUserRole,
  hasCmsPermission,
  subscribeToCmsRole,
  playGiftAudioEffect,
  CmsRole,
  CMS_ROLES,
  isVideoResource,
  isMediaUrl,
  getCleanGiftEmoji
} from '../lib/giftCmsService';
import {
  getRefundVaultBalance,
  subscribeToRefundVault,
  getRecentRefundWinners,
  isRefundGift
} from '../lib/refundVaultService';
import {
  canManageGifts,
  getActiveAppRole,
  AppRole
} from '../lib/roleService';
import { GiftEditorModal } from './GiftEditorModal';

export type { GiftItem };

export interface SeatUser {
  id: number;
  userName: string;
  avatar?: string;
  isEmpty?: boolean;
}

export interface ListenerUser {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  level?: string;
  vip?: string;
  isHost?: boolean;
  isAdmin?: boolean;
  isVIP?: boolean;
}

export const DEFAULT_ROOM_LISTENERS: ListenerUser[] = [
  { id: 'aud-1', name: 'أميرة الشرق 👑', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200', role: 'مضيف الغرفة 👑', level: 'Lv.90', vip: 'VIP 10', isHost: true, isAdmin: true, isVIP: true },
  { id: 'aud-2', name: 'سارة الكابيتانو', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', role: 'أدمن الروم 🛡️', level: 'Lv.75', vip: 'VIP 6', isAdmin: true, isVIP: true },
  { id: 'aud-3', name: 'خالد العتيبي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', role: 'متحدث مايك 🎙️', level: 'Lv.64', vip: 'VIP 5', isVIP: true },
  { id: 'aud-4', name: 'مريم العدني', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', role: 'مستمع VIP 💎', level: 'Lv.58', vip: 'VIP 4', isVIP: true },
  { id: 'aud-5', name: 'الملك الكويتي', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', role: 'داعم أسطوري 🌟', level: 'Lv.82', vip: 'VIP 8', isVIP: true },
  { id: 'aud-6', name: 'الدكتورة هناء', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200', role: 'مستمع مميز ✨', level: 'Lv.48', vip: 'VIP 3', isVIP: true },
  { id: 'aud-7', name: 'وردة الأمل', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200', role: 'مستمع حاضر 🌸', level: 'Lv.35', vip: 'VIP 2' },
  { id: 'aud-8', name: 'صقر الشمال', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', role: 'عضو نشيط ⚡', level: 'Lv.29', vip: 'VIP 1' }
];

interface ProfessionalGiftPanelProps {
  isOpen: boolean;
  onClose: () => void;
  userCoins?: number | string;
  onOpenRecharge?: () => void;
  onSendGift?: (gift: GiftItem, quantity: number, targetName: string, selectedSeatIds?: number[], selectedListenerNames?: string[]) => void;
  seats?: SeatUser[];
  initialSelectedSeatIds?: number[];
  listeners?: ListenerUser[];
}

const GIFT_CATEGORIES = [
  'استرداد',
  'رائج',
  'الفعالية',
  'الدولة/المنطقة',
  'مخصصة',
  'الامتيازات',
  'مداعبة',
  'الكل'
] as const;

type CategoryType = (typeof GIFT_CATEGORIES)[number];

const MULTIPLIERS = [1, 7, 17, 77, 555, 777];

export const ProfessionalGiftPanel: React.FC<ProfessionalGiftPanelProps> = ({
  isOpen,
  onClose,
  userCoins = 353,
  onOpenRecharge,
  onSendGift,
  seats = [],
  initialSelectedSeatIds = [1],
  listeners = []
}) => {
  // Live Reactive Database & Roles
  const [giftsList, setGiftsList] = useState<GiftItem[]>(() => getGiftsDatabase());
  const [appRole, setAppRole] = useState<AppRole>(() => getActiveAppRole());
  const [activeRole, setActiveRole] = useState<CmsRole>(() => getCmsUserRole());
  const [showRoleSelector, setShowRoleSelector] = useState<boolean>(false);

  // Strictly check if current role can edit/manage gifts (Default: Developer only)
  const isCmsAuthorized = canManageGifts(appRole);

  // CMS Editor Modal State (undefined = closed, null = new gift, GiftItem = edit)
  const [editingGift, setEditingGift] = useState<GiftItem | null | undefined>(undefined);

  const [selectedTab, setSelectedTab] = useState<CategoryType>('استرداد');
  const [selectedSubTab, setSelectedSubTab] = useState<string>('الكل');

  // Default selected gift is position 0 in 'استرداد'
  const firstRefundGift = giftsList.find((g) => g.category === 'استرداد' || isRefundGift(g)) || giftsList[0];
  const [selectedGift, setSelectedGift] = useState<GiftItem>(firstRefundGift || {
    id: 'default',
    name: 'هدية استرداد',
    price: 100,
    icon: '🎁',
    category: 'استرداد'
  });

  const [giftQuantity, setGiftQuantity] = useState<number>(1);
  const [showQuantityMenu, setShowQuantityMenu] = useState<boolean>(false);
  const [customQuantity, setCustomQuantity] = useState<string>('');
  const [showCustomQtyInput, setShowCustomQtyInput] = useState<boolean>(false);
  
  // Room listeners list
  const roomListeners = listeners && listeners.length > 0 ? listeners : DEFAULT_ROOM_LISTENERS;

  // Recipient Selection state
  const occupiedSeats = seats.filter((s) => !s.isEmpty);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>(() => {
    const validInitial = (initialSelectedSeatIds || []).filter((id) =>
      occupiedSeats.some((s) => s.id === id)
    );
    return validInitial.length > 0 ? validInitial : occupiedSeats[0] ? [occupiedSeats[0].id] : [];
  });
  const [selectedListenerIds, setSelectedListenerIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [showRecipientDropdown, setShowRecipientDropdown] = useState<boolean>(false);

  const [broadcastNotice, setBroadcastNotice] = useState<string | null>(null);
  const [refundVaultBalance, setRefundVaultBalance] = useState<number>(() => getRefundVaultBalance());

  useEffect(() => {
    const unsub = subscribeToRefundVault((bal) => {
      setRefundVaultBalance(bal);
    });
    return unsub;
  }, []);

  const [showSuccessCheck, setShowSuccessCheck] = useState<boolean>(false);
  const [totalSentCount, setTotalSentCount] = useState<number>(0);
  const parseCoins = (val: number | string | undefined): number => {
    if (typeof val === 'number') return val;
    if (!val) return 50000;
    const str = String(val).toUpperCase();
    if (str.includes('M')) return (parseFloat(str) || 0) * 1000000;
    if (str.includes('K')) return (parseFloat(str) || 0) * 1000;
    return parseInt(str.replace(/[^\d]/g, '')) || 50000;
  };

  const [localCoins, setLocalCoins] = useState<number>(() => parseCoins(userCoins));
  const [flyingParticles, setFlyingParticles] = useState<
    Array<{ id: number; delay: number; xOffset: number; xTarget: number; scale: number }>
  >([]);

  // ================= CONSECUTIVE SENDING (COMBO) STATE & REFS =================
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(false);
  const [isComboActive, setIsComboActive] = useState<boolean>(false);
  const [comboCount, setComboCount] = useState<number>(1);
  const [comboProgress, setComboProgress] = useState<number>(1); // 1.0 down to 0.0
  const [comboFloatingBursts, setComboFloatingBursts] = useState<Array<{ id: number; text: string; x: number }>>([]);
  
  const comboEndTimeRef = useRef<number>(0);
  const comboAnimFrameRef = useRef<number | null>(null);
  const lastSentGiftRef = useRef<GiftItem | null>(null);
  const lastQuantityRef = useRef<number>(1);
  const lastTargetNamesRef = useRef<string>('');
  const lastTargetSeatIdsRef = useRef<number[]>([]);
  const lastListenerNamesRef = useRef<string[]>([]);
  const lastTotalCostRef = useRef<number>(0);

  // Subscribe to real-time gift database updates & role changes
  useEffect(() => {
    const unsubscribeGifts = subscribeToGifts((updatedList) => {
      setGiftsList(updatedList);
      // If current selected gift was updated, refresh its details
      setSelectedGift((prevSelected) => {
        if (!prevSelected) return updatedList[0];
        const match = updatedList.find((g) => g.id === prevSelected.id);
        return match || prevSelected;
      });
    });

    const unsubscribeRole = subscribeToCmsRole((newRole) => {
      setActiveRole(newRole);
    });

    const handleRoleChanged = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.role) {
        setAppRole(customEvent.detail.role);
      }
    };

    const handlePermissionsUpdated = () => {
      setAppRole(getActiveAppRole());
    };

    window.addEventListener('app_role_changed', handleRoleChanged);
    window.addEventListener('app_permissions_updated', handlePermissionsUpdated);

    return () => {
      unsubscribeGifts();
      unsubscribeRole();
      window.removeEventListener('app_role_changed', handleRoleChanged);
      window.removeEventListener('app_permissions_updated', handlePermissionsUpdated);
    };
  }, []);

  useEffect(() => {
    setLocalCoins(parseCoins(userCoins));
  }, [userCoins]);

  const prevIsOpenRef = useRef(false);

  // Sync initialSelectedSeatIds and panel visibility ONLY when panel transitions to open
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      setIsPanelVisible(true);
      setIsComboActive(false);
      if (comboAnimFrameRef.current) {
        cancelAnimationFrame(comboAnimFrameRef.current);
        comboAnimFrameRef.current = null;
      }
      setSelectedTab('استرداد');
      setSelectedSubTab('الكل');
      const defaultFirstGift = giftsList.find((g) => g.category === 'استرداد' || isRefundGift(g)) || giftsList[0];
      if (defaultFirstGift) {
        setSelectedGift(defaultFirstGift);
      }
      const activeOccupied = seats.filter((s) => !s.isEmpty);
      const validInitial = (initialSelectedSeatIds || []).filter((id) =>
        activeOccupied.some((s) => s.id === id)
      );
      if (validInitial.length > 0) {
        setSelectedSeatIds(validInitial);
      } else if (activeOccupied.length > 0) {
        // Pre-select the first occupied speaker if none specified
        setSelectedSeatIds([activeOccupied[0].id]);
      } else {
        setSelectedSeatIds([]);
      }
      setSelectedListenerIds([]);
      setIsAllSelected(false);
    } else if (!isOpen && prevIsOpenRef.current) {
      setIsPanelVisible(false);
      // When transitioning from open to closed (and combo not active), clean up state
      if (!isComboActive) {
        setSelectedSeatIds([]);
        setSelectedListenerIds([]);
        setIsAllSelected(false);
        setTotalSentCount(0);
        setShowSuccessCheck(false);
        setFlyingParticles([]);
        setGiftQuantity(1);
        setShowQuantityMenu(false);
        setShowCustomQtyInput(false);
        setShowRecipientDropdown(false);
        setShowRoleSelector(false);
        if (comboAnimFrameRef.current) {
          cancelAnimationFrame(comboAnimFrameRef.current);
          comboAnimFrameRef.current = null;
        }
      }
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, isComboActive]);

  // ================= 5-SECOND COUNTDOWN COMBO ANIMATION FRAME =================
  const COMBO_DURATION_MS = 5000;

  const startOrResetComboTimer = () => {
    comboEndTimeRef.current = Date.now() + COMBO_DURATION_MS;
    setComboProgress(1);
  };

  useEffect(() => {
    if (!isComboActive) {
      if (comboAnimFrameRef.current) {
        cancelAnimationFrame(comboAnimFrameRef.current);
        comboAnimFrameRef.current = null;
      }
      return;
    }

    const updateComboCountdown = () => {
      const now = Date.now();
      const remaining = comboEndTimeRef.current - now;
      if (remaining <= 0) {
        setComboProgress(0);
        setIsComboActive(false);
        setIsPanelVisible(false);
        if (comboAnimFrameRef.current) {
          cancelAnimationFrame(comboAnimFrameRef.current);
          comboAnimFrameRef.current = null;
        }
        onClose(); // Auto-dismiss completely and notify parent
      } else {
        setComboProgress(Math.max(0, Math.min(1, remaining / COMBO_DURATION_MS)));
        comboAnimFrameRef.current = requestAnimationFrame(updateComboCountdown);
      }
    };

    comboAnimFrameRef.current = requestAnimationFrame(updateComboCountdown);

    return () => {
      if (comboAnimFrameRef.current) {
        cancelAnimationFrame(comboAnimFrameRef.current);
        comboAnimFrameRef.current = null;
      }
    };
  }, [isComboActive, onClose]);

  // ================= CONSECUTIVE TAP SEND HANDLER =================
  const handleComboTap = () => {
    const cost = lastTotalCostRef.current;
    if (localCoins < cost) {
      setBroadcastNotice('⚠️ رصيدك لا يكفي للإرسال المتتالي!');
      setTimeout(() => setBroadcastNotice(null), 2500);
      return;
    }

    // Deduct coins for this consecutive hit
    setLocalCoins((prev) => Math.max(0, prev - cost));

    // Play sound effect
    if (lastSentGiftRef.current) {
      playGiftAudioEffect(lastSentGiftRef.current);
    }

    // Trigger onSendGift in parent room
    if (onSendGift && lastSentGiftRef.current) {
      onSendGift(
        lastSentGiftRef.current,
        lastQuantityRef.current,
        lastTargetNamesRef.current,
        lastTargetSeatIdsRef.current,
        lastListenerNamesRef.current
      );
    }

    // Reset 3-second clock back to full 3.0s!
    startOrResetComboTimer();

    const newCount = comboCount + 1;
    setComboCount(newCount);
    setTotalSentCount((prev) => prev + lastQuantityRef.current);

    // Dynamic floating multiplier burst particle
    const burstId = Date.now() + Math.random();
    setComboFloatingBursts((prev) => [
      ...prev.slice(-6),
      { id: burstId, text: `+${lastQuantityRef.current} (x${newCount}) 🔥`, x: (Math.random() - 0.5) * 24 }
    ]);
    setTimeout(() => {
      setComboFloatingBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 900);
  };

  const handleClose = () => {
    setIsPanelVisible(false);
    setIsComboActive(false);
    setSelectedSeatIds([]);
    setSelectedListenerIds([]);
    setIsAllSelected(false);
    setTotalSentCount(0);
    setFlyingParticles([]);
    setShowSuccessCheck(false);
    setGiftQuantity(1);
    setShowQuantityMenu(false);
    setShowCustomQtyInput(false);
    setShowRecipientDropdown(false);
    setShowRoleSelector(false);
    setSelectedTab('استرداد');
    setSelectedSubTab('الكل');
    onClose();
  };

  // Sync Scrolling Refs
  const tabsContainerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const giftsScrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isManualScrollRef = useRef<boolean>(false);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (!isOpen) return;

    const activeTabBtn = tabRefs.current[selectedTab];
    const tabsContainer = tabsContainerRef.current;
    if (activeTabBtn && tabsContainer) {
      const btnOffset = activeTabBtn.offsetLeft;
      const btnWidth = activeTabBtn.offsetWidth;
      const containerWidth = tabsContainer.offsetWidth;
      const targetScroll = btnOffset - containerWidth / 2 + btnWidth / 2;
      tabsContainer.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }

    if (isManualScrollRef.current) {
      const activePageEl = pageRefs.current[selectedTab];
      const giftsContainer = giftsScrollContainerRef.current;
      if (activePageEl && giftsContainer) {
        giftsContainer.scrollTo({
          left: activePageEl.offsetLeft,
          behavior: 'smooth',
        });
      }
      const timer = setTimeout(() => {
        isManualScrollRef.current = false;
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedTab, isOpen]);

  // Handle horizontal scrolling to sync top tab bar
  const handleGiftsScroll = () => {
    if (isManualScrollRef.current || !giftsScrollContainerRef.current) return;
    const container = giftsScrollContainerRef.current;
    const containerWidth = container.clientWidth;
    if (!containerWidth) return;

    const scrollLeft = Math.abs(container.scrollLeft);
    const pageIndex = Math.min(
      GIFT_CATEGORIES.length - 1,
      Math.max(0, Math.round(scrollLeft / containerWidth))
    );
    const currentCategory = GIFT_CATEGORIES[pageIndex];
    if (currentCategory && currentCategory !== selectedTab) {
      setSelectedTab(currentCategory);
      setSelectedSubTab('الكل');
    }
  };

  if (!isOpen && !isComboActive) return null;

  const activeOccupiedSeatIds = selectedSeatIds.filter((id) =>
    occupiedSeats.some((s) => s.id === id)
  );

  const totalRecipientCount = isAllSelected
    ? occupiedSeats.length + roomListeners.length
    : activeOccupiedSeatIds.length + selectedListenerIds.length;

  const totalCost = (selectedGift?.price || 0) * giftQuantity * Math.max(1, totalRecipientCount);

  // Recipient Selection Handlers
  const handleSelectAllRoom = () => {
    setIsAllSelected(true);
    setSelectedSeatIds(occupiedSeats.map((s) => s.id));
    setSelectedListenerIds(roomListeners.map((l) => l.id));
    setShowRecipientDropdown(false);
  };

  const handleSelectAllSpeakers = () => {
    setIsAllSelected(false);
    setSelectedSeatIds(occupiedSeats.map((s) => s.id));
    setSelectedListenerIds([]);
    setShowRecipientDropdown(false);
  };

  const toggleSeatSelection = (seatId: number) => {
    const isOccupied = occupiedSeats.some((s) => s.id === seatId);
    if (!isOccupied) return;

    if (isAllSelected) {
      setIsAllSelected(false);
      setSelectedSeatIds([seatId]);
      setSelectedListenerIds([]);
      return;
    }

    setSelectedSeatIds((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const toggleListenerSelection = (listenerId: string) => {
    if (isAllSelected) {
      setIsAllSelected(false);
      setSelectedSeatIds([]);
      setSelectedListenerIds([listenerId]);
      return;
    }

    if (selectedListenerIds.includes(listenerId)) {
      if (selectedSeatIds.length + selectedListenerIds.length > 1) {
        setSelectedListenerIds(selectedListenerIds.filter((id) => id !== listenerId));
      }
    } else {
      setSelectedListenerIds([...selectedListenerIds, listenerId]);
    }
  };

  const handleSend = () => {
    const targetSeatIdsToSend = selectedSeatIds.filter((id) =>
      occupiedSeats.some((s) => s.id === id)
    );

    if (!isAllSelected && targetSeatIdsToSend.length === 0 && selectedListenerIds.length === 0) {
      setBroadcastNotice('⚠️ الرجاء اختيار مستلم واحد على الأقل من المتواجدين على المايك!');
      setTimeout(() => setBroadcastNotice(null), 3000);
      return;
    }

    if (localCoins < totalCost) {
      setBroadcastNotice('⚠️ رصيدك لا يكفي! يرجى إعادة الشحن');
      setTimeout(() => setBroadcastNotice(null), 3000);
      return;
    }

    setLocalCoins((prev) => Math.max(0, prev - totalCost));

    let targetNames = '';
    if (isAllSelected) {
      targetNames = 'جميع الحضور (الكل)';
    } else {
      const seatNames = targetSeatIdsToSend.map((id) => {
        const foundSeat = occupiedSeats.find((s) => s.id === id);
        return foundSeat ? foundSeat.userName : `مقعد ${id}`;
      });
      const listenerNames = selectedListenerIds.map((id) => {
        const foundLis = roomListeners.find((l) => l.id === id);
        return foundLis ? foundLis.name : id;
      });
      const combined = [...seatNames, ...listenerNames];
      if (combined.length === 1) {
        targetNames = combined[0];
      } else if (combined.length <= 3) {
        targetNames = combined.join('، ');
      } else {
        targetNames = `${combined.slice(0, 2).join('، ')} و ${combined.length - 2} آخرين`;
      }
    }

    const listenerNamesToSend = selectedListenerIds.map((id) => {
      const foundLis = roomListeners.find((l) => l.id === id);
      return foundLis ? foundLis.name : id;
    });

    const finalSeatIds = isAllSelected ? occupiedSeats.map((s) => s.id) : targetSeatIdsToSend;
    const finalLisNames = isAllSelected ? roomListeners.map((l) => l.name) : listenerNamesToSend;

    // Cache state for consecutive combo sending
    lastSentGiftRef.current = selectedGift;
    lastQuantityRef.current = giftQuantity;
    lastTargetNamesRef.current = targetNames;
    lastTargetSeatIdsRef.current = finalSeatIds;
    lastListenerNamesRef.current = finalLisNames;
    lastTotalCostRef.current = totalCost;

    // Play synthesized or custom audio effect
    if (selectedGift) {
      playGiftAudioEffect(selectedGift);
    }

    if (onSendGift && selectedGift) {
      onSendGift(
        selectedGift,
        giftQuantity,
        targetNames,
        finalSeatIds,
        finalLisNames
      );
    }

    const streamCount = Math.min(100, Math.max(1, giftQuantity));
    const now = Date.now();
    const delayStep = streamCount > 25 ? 0.03 : 0.05;
    const newParticles = Array.from({ length: streamCount }, (_, i) => ({
      id: now + Math.random() + i,
      delay: i * delayStep,
      xOffset: (Math.random() - 0.5) * 26,
      xTarget: (Math.random() - 0.5) * 20,
      scale: 0.85 + Math.random() * 0.35,
    }));

    setFlyingParticles((prev) => [...prev, ...newParticles]);
    const totalDurationMs = Math.ceil((streamCount * delayStep + 1.8) * 1000);
    setTimeout(() => {
      setFlyingParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
    }, totalDurationMs);

    setShowSuccessCheck(true);
    setTotalSentCount((prev) => prev + giftQuantity);

    setTimeout(() => {
      setShowSuccessCheck(false);
    }, 1200);

    // HIDE MAIN GIFT PANEL & ACTIVATE 5-SECOND CONSECUTIVE COMBO BUTTON
    setIsPanelVisible(false);
    setIsComboActive(true);
    setComboCount(1);
    startOrResetComboTimer();
    onClose(); // Reset showGiftDrawer in parent so user can reopen gifts anytime
  };

  const handleApplyCustomQty = () => {
    const parsed = parseInt(customQuantity, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setGiftQuantity(parsed);
    }
    setShowCustomQtyInput(false);
    setShowQuantityMenu(false);
  };

  return (
    <>
      {/* Top Floating Alert Banner (Notice) */}
      <AnimatePresence>
        {broadcastNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-rose-950/95 border border-rose-500/80 text-rose-200 text-xs font-bold px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 pointer-events-none"
          >
            <span>{broadcastNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 1. MAIN EXPANDED GIFT PANEL ================= */}
      <AnimatePresence>
        {isPanelVisible && (
          <div 
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
            className="fixed inset-0 z-50 bg-transparent flex items-end justify-center dir-rtl select-none"
          >
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-full flex flex-col items-stretch gap-1 px-0 pb-0 relative pointer-events-none"
            >
            {/* Standalone Container for Global Broadcast Banner */}
            <AnimatePresence>
              {Boolean(selectedGift?.hasGlobalBroadcast && selectedGift.price >= 20000) && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95, height: 0 }}
                  animate={{ opacity: 1, y: 0, scale: 1, height: 'auto' }}
                  exit={{ opacity: 0, y: 12, scale: 0.95, height: 0 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full px-2 overflow-hidden pointer-events-auto shrink-0 z-30"
                >
                  <div className="w-full flex items-center justify-between bg-gradient-to-r from-cyan-950/95 via-[#0A1329]/95 to-cyan-950/95 backdrop-blur-xl border border-cyan-400/50 rounded-2xl px-3.5 py-2 text-[10px] text-cyan-200 shadow-[0_4px_25px_rgba(6,182,212,0.3)]">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-cyan-400 animate-spin-slow shrink-0" />
                      <span className="font-bold tracking-wide">سيؤدي إرسال هذه الهدية إلى تشغيل إشعار عالمي</span>
                    </div>
                    <span className="text-amber-300 font-extrabold text-[9px] bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/40 shadow-xs shrink-0">
                      إشعار عام 🌐
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Gift Panel Card - Edge to Edge Full Width with subtle gentle rounded top */}
            <div className="w-full pointer-events-auto bg-[#0A0E1A]/95 backdrop-blur-2xl border-t border-cyan-500/40 rounded-t-xl text-white shadow-[0_-10px_35px_rgba(0,0,0,0.7)] flex flex-col justify-between max-h-[60vh] sm:max-h-[55vh] overflow-hidden relative">
              {/* Flying Golden Tiny Lightning Stream Animation */}
              <AnimatePresence>
                {flyingParticles.map((particle) => (
                  <motion.div
                    key={particle.id}
                    initial={{ opacity: 0, y: 0, x: particle.xOffset, scale: particle.scale * 0.7 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: -360 - Math.random() * 15,
                      x: [particle.xOffset, particle.xOffset + particle.xTarget, 0],
                      scale: [particle.scale * 0.7, particle.scale * 1.35, particle.scale * 0.3],
                    }}
                    transition={{
                      duration: 1.25,
                      delay: particle.delay,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute bottom-6 left-10 z-50 pointer-events-none flex items-center justify-center"
                  >
                    <div className="p-1 rounded-full bg-amber-400/25 drop-shadow-[0_0_12px_rgba(251,191,36,0.95)]">
                      <Zap className="w-4.5 h-4.5 text-amber-300 fill-amber-300 stroke-amber-400 stroke-[2.5]" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* ================= 1. TOP EXP BAR & CMS ROLE SECTION ================= */}
              <div className="bg-[#070A14]/90 backdrop-blur-md border-b border-white/5 px-2.5 py-1 shrink-0">
                {(() => {
                  const expGained = selectedGift ? selectedGift.price * giftQuantity * selectedSeatIds.length : 0;
                  const baseRemainingEXP = 401516;
                  const remainingExp = Math.max(0, baseRemainingEXP - expGained);
                  const progressPercent = Math.min(100, Math.max(15, ((1254756 - remainingExp) / 1254756) * 100));

                  return (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300">
                      {/* Current Level 113 */}
                      <span className="bg-gradient-to-r from-pink-600 to-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 shadow-xs flex items-center gap-0.5 border border-pink-400/30">
                        113 👑
                      </span>

                      {/* Stretched Golden Slim Progress Bar */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 px-0.5">
                        <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono leading-none">
                          <span className="truncate text-amber-300 font-semibold">
                            إضافة {expGained.toLocaleString()} نقطة خبرة
                          </span>
                          <span className="truncate text-slate-400 mr-1">
                            {remainingExp.toLocaleString()} قبل رفع المستوى
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-900/90 rounded-full overflow-hidden border border-amber-500/30 p-[0.5px] shadow-inner relative">
                          <div
                            className="h-full bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-300 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.7)] transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Next Level 114 */}
                      <span className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 shadow-xs flex items-center gap-0.5 border border-amber-400/40">
                        114 👑
                      </span>

                      {/* Close Button X */}
                      <button
                        onClick={handleClose}
                        className="p-0.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0 mr-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* ================= 2. RECIPIENT SEAT MIC SELECTOR BAR ================= */}
              <div className="bg-[#0B1220]/85 backdrop-blur-md px-2 py-1.5 border-b border-white/5 flex items-center justify-between shrink-0 gap-2 relative z-40">
                {/* Three-dash Menu Button */}
                <div className="relative shrink-0 z-50">
                  <button
                    id="gift-recipients-menu-btn"
                    onClick={() => setShowRecipientDropdown(!showRecipientDropdown)}
                    className={`p-1.5 px-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-[11px] font-black shrink-0 shadow-xs active:scale-95 ${
                      showRecipientDropdown
                        ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                        : 'bg-cyan-500/15 hover:bg-cyan-500/25 border-cyan-400/40 text-cyan-300 hover:text-white'
                    }`}
                    title="تحديد المستلمين (المتواجدون على المايك / الكل)"
                  >
                    <Menu className="w-4 h-4 stroke-[2.5]" />
                    <span>المجموعات</span>
                    <ChevronDown className={`w-3 h-3 text-current transition-transform duration-200 ${showRecipientDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showRecipientDropdown && (
                      <>
                        <div
                          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[1px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowRecipientDropdown(false);
                          }}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.92, y: -6, originY: 0 }}
                          animate={{ opacity: 1, scale: 1, y: 0, originY: 0 }}
                          exit={{ opacity: 0, scale: 0.92, y: -6, originY: 0 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-full mt-2 z-[110] w-56 bg-[#0B1325] border-2 border-cyan-400/80 rounded-2xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.98),0_0_25px_rgba(6,182,212,0.5)] text-white flex flex-col gap-1 origin-top-right overflow-hidden pointer-events-auto select-none"
                          dir="rtl"
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAllSpeakers();
                            }}
                            className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer active:scale-98 relative z-10 ${
                              !isAllSelected && activeOccupiedSeatIds.length === occupiedSeats.length && occupiedSeats.length > 0 && selectedListenerIds.length === 0
                                ? 'bg-gradient-to-r from-emerald-500/30 to-teal-500/25 text-emerald-300 border border-emerald-400/60 font-black shadow-xs'
                                : 'hover:bg-white/10 text-slate-200 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 pointer-events-none">
                              <Mic className="w-4 h-4 text-emerald-400" />
                              <span className="font-extrabold">المتواجدون على المايك</span>
                            </div>
                            <span className="text-[10px] text-emerald-300 font-mono bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold pointer-events-none">
                              {occupiedSeats.length}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectAllRoom();
                            }}
                            className={`w-full text-right px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer active:scale-98 relative z-10 ${
                              isAllSelected
                                ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/25 text-amber-300 border border-amber-400/60 font-black shadow-xs'
                                : 'hover:bg-white/10 text-slate-200 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2 pointer-events-none">
                              <Globe className="w-4 h-4 text-amber-400" />
                              <span className="font-extrabold">الكل (في الروم)</span>
                            </div>
                            <span className="text-[10px] text-amber-300 font-mono bg-amber-950/90 px-2 py-0.5 rounded-full border border-amber-500/40 font-bold pointer-events-none">
                              {occupiedSeats.length + roomListeners.length}
                            </span>
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Recipient Avatars Row */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 max-w-[78%]">
                  {occupiedSeats.length === 0 ? (
                    <span className="text-[10px] text-slate-400 font-medium px-2 italic">
                      لا يوجد متحدثون على المايك
                    </span>
                  ) : (
                    occupiedSeats.map((seat) => {
                      const isSelected = isAllSelected || selectedSeatIds.includes(seat.id);
                      return (
                        <button
                          key={seat.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSeatSelection(seat.id);
                          }}
                          className="relative shrink-0 flex flex-col items-center cursor-pointer group transition-transform active:scale-90"
                          title={`مقعد ${seat.id} ${seat.userName ? `(${seat.userName})` : ''}`}
                        >
                          <div
                            className={`relative w-8 h-8 rounded-full transition-all duration-200 ${
                              isSelected
                                ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-[#0B1220] scale-105 opacity-100 shadow-[0_0_12px_rgba(52,211,153,0.7)]'
                                : 'opacity-40 hover:opacity-80 grayscale-[40%] scale-95'
                            }`}
                          >
                            <img
                              src={seat.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                              alt={`مقعد ${seat.id}`}
                              className="w-full h-full rounded-full object-cover"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-slate-950 font-black text-[7.5px] w-4 h-4 rounded-full flex items-center justify-center border border-slate-950">
                              {seat.id}
                            </span>
                            {isSelected && (
                              <span className="absolute -top-1 -left-1 bg-emerald-400 text-slate-950 rounded-full p-0.5 shadow-md border border-[#0B1220]">
                                <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ================= 3. MAIN CATEGORY TABS ================= */}
              <div className="bg-[#080D18]/70 backdrop-blur-md border-b border-white/5 px-1.5 pt-1 shrink-0 space-y-0.5">
                <div 
                  ref={tabsContainerRef}
                  className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5 text-[10px] scroll-smooth"
                >
                  {GIFT_CATEGORIES.map((cat) => {
                    const isActive = selectedTab === cat;
                    return (
                      <button
                        key={cat}
                        ref={(el) => { tabRefs.current[cat] = el; }}
                        onClick={() => {
                          isManualScrollRef.current = true;
                          setSelectedTab(cat);
                          setSelectedSubTab('الكل');
                        }}
                        className={`px-2 py-0.5 rounded-lg font-black whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 shadow-xs scale-102'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Sub-categories bar */}
                {selectedTab === 'الفعالية' && (
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[9px]">
                    {['الكل', 'حدث برج الاسد', 'النمط الاسبوعي', 'رحلة رومانسية'].map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubTab(sub)}
                        className={`px-2 py-0.5 rounded-md font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedSubTab === sub
                            ? 'bg-white/15 text-amber-300 border border-amber-400/30'
                            : 'bg-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ================= 4. SPECIAL LUCKY REFUND VAULT BANNER (HIDDEN AS REQUESTED) ================= */}

              {/* ================= 5. GIFTS GRID (Synchronized Horizontal Paged Carousel) ================= */}
              <div
                ref={giftsScrollContainerRef}
                onScroll={handleGiftsScroll}
                className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar flex-1 min-h-[160px] max-h-[220px] scroll-smooth"
              >
                {GIFT_CATEGORIES.map((cat) => {
                  const catGifts = giftsList.filter((gift) => {
                    if (cat === 'الكل') return true;
                    if (gift.category !== cat) return false;
                    if (cat === 'الفعالية' && selectedSubTab !== 'الكل' && gift.subCategory) {
                      return gift.subCategory === selectedSubTab;
                    }
                    return true;
                  });

                  return (
                    <div
                      key={cat}
                      ref={(el) => { pageRefs.current[cat] = el; }}
                      className="w-full shrink-0 snap-center px-1.5 py-1.5 overflow-y-auto no-scrollbar"
                    >
                      <div className="grid grid-cols-4 gap-1.5 w-full">
                        {catGifts.map((gift) => {
                          const isSelected = selectedGift?.id === gift.id;
                          const mediaSrc = gift.videoUrl || gift.icon;
                          const isVid = isVideoResource(mediaSrc);
                          const isImg = !isVid && isMediaUrl(mediaSrc);
                          const isRefund = isRefundGift(gift) || cat === 'استرداد';

                          return (
                            <div
                              key={gift.id}
                              onClick={() => setSelectedGift(gift)}
                              className={`relative rounded-xl p-1 sm:p-1.5 flex flex-col items-center justify-between text-center transition-all cursor-pointer group min-h-[76px] w-full ${
                                isSelected
                                  ? 'bg-[#102232] border-2 border-emerald-400 shadow-md shadow-emerald-500/25 scale-[1.01]'
                                  : 'bg-[#111726]/90 border border-white/5 hover:bg-[#162034] hover:border-cyan-400/40'
                              }`}
                            >
                              {/* Top Left Badge */}
                              {isRefund ? (
                                <span className="absolute top-0.5 left-0.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 text-slate-950 text-[7px] font-black px-1.5 py-0.5 rounded-md shadow-[0_0_8px_rgba(16,185,129,0.7)] z-10 border border-emerald-200">
                                  استرداد 🎰
                                </span>
                              ) : gift.badge ? (
                                <span className="absolute top-0.5 left-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[7px] font-black px-1 py-0.1 rounded-md shadow-xs z-10">
                                  {gift.badge}
                                </span>
                              ) : null}

                              {/* Top Right Icons & CMS EDIT BUTTON (Upload / Edit Arrow) */}
                              <div className="absolute top-0.5 right-0.5 flex items-center gap-0.5 z-20">
                                {/* Global broadcast icon */}
                                {gift.hasGlobalBroadcast && gift.price >= 20000 && (
                                  <span className="w-3 h-3 rounded-full bg-pink-500/80 text-white flex items-center justify-center text-[6px]" title="إشعار عالمي">
                                    🌐
                                  </span>
                                )}

                                {/* Sound icon */}
                                {gift.hasSound && (
                                  <span className="w-3 h-3 rounded-full bg-cyan-500/80 text-slate-950 flex items-center justify-center text-[6px]" title="مؤثر صوتي">
                                    🎵
                                  </span>
                                )}

                                {/* ================= CMS EDIT ARROW BUTTON (Strictly Visible to Authorized Roles Only) ================= */}
                                {isCmsAuthorized && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingGift(gift);
                                    }}
                                    className="w-4.5 h-4.5 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 flex items-center justify-center shadow-md hover:scale-125 active:scale-95 transition-all cursor-pointer ring-1 ring-cyan-300"
                                    title="تعديل بيانات الهدية (سهم التحميل/التعديل CMS)"
                                  >
                                    <ArrowUpToLine className="w-2.5 h-2.5 stroke-[3]" />
                                  </button>
                                )}
                              </div>

                              {/* Gift Graphic / Icon */}
                              <div className="my-auto py-0.5 text-2xl group-hover:scale-110 transition-transform duration-200 drop-shadow-xs flex items-center justify-center">
                                {isVid ? (
                                  <video src={mediaSrc} autoPlay loop muted playsInline className="w-8 h-8 object-contain pointer-events-none" style={{ mixBlendMode: gift.blendMode || 'screen' }} />
                                ) : isImg ? (
                                  <img src={mediaSrc} alt={gift.name} className="w-8 h-8 object-contain" />
                                ) : (
                                  <span>{getCleanGiftEmoji(gift.name, gift.icon)}</span>
                                )}
                              </div>

                              {/* Gift Price in Coins */}
                              <div className="mt-auto flex items-center justify-center gap-0.5 w-full pt-0.5">
                                <span className="text-amber-400 text-[9px]">🪙</span>
                                <span className="text-[10px] font-mono font-black text-amber-300">
                                  {gift.price.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* ================= ADD NEW GIFT (+) BUTTON IN CATEGORY GRID ================= */}
                        {isCmsAuthorized && (
                          <div
                            onClick={() => setEditingGift(null)}
                            className="relative rounded-xl p-1.5 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[75px] bg-gradient-to-b from-cyan-950/30 to-purple-950/30 border-2 border-dashed border-cyan-400/50 hover:border-cyan-300 hover:bg-cyan-900/30 hover:scale-105 shadow-sm"
                            title="إضافة هدية جديدة بالكامل (+)"
                          >
                            <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors shadow-xs">
                              <Plus className="w-4 h-4 stroke-[3]" />
                            </div>
                            <span className="text-[8.5px] font-black text-cyan-300 mt-1">إضافة هدية (+)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= 6. FOOTER CONTROL BAR (Static/Sticky Layer) ================= */}
              <div className="bg-[#070B14]/90 backdrop-blur-md p-2 border-t border-white/10 shrink-0 sticky bottom-0 z-30 relative">
                {/* Multiplier / Quantity Dropup Popover (Aligned on the Left above multiplier pill) */}
                <AnimatePresence>
                  {showQuantityMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute bottom-12 left-2 w-32 bg-[#131A2A] border border-cyan-400/40 rounded-xl shadow-2xl p-1 z-50 space-y-0.5"
                    >
                      <button
                        onClick={() => setShowCustomQtyInput(!showCustomQtyInput)}
                        className="w-full text-center py-1 px-2 rounded-lg text-[10px] font-black bg-white/10 text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                      >
                        آخر (تخصيص)
                      </button>

                      {showCustomQtyInput && (
                        <div className="p-1 bg-slate-900 rounded-lg space-y-1">
                          <input
                            type="number"
                            placeholder="أدخل العدد..."
                            value={customQuantity}
                            onChange={(e) => setCustomQuantity(e.target.value)}
                            className="w-full bg-slate-800 text-white text-[10px] p-1 rounded-md text-center font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-cyan-400"
                          />
                          <button
                            onClick={handleApplyCustomQty}
                            className="w-full bg-emerald-500 text-slate-950 font-black text-[9px] py-0.5 rounded-md"
                          >
                            تأكيد
                          </button>
                        </div>
                      )}

                      {MULTIPLIERS.map((qty) => (
                        <button
                          key={qty}
                          onClick={() => {
                            setGiftQuantity(qty);
                            setShowQuantityMenu(false);
                          }}
                          className={`w-full text-center py-1 rounded-lg text-[10px] font-mono font-black transition-colors ${
                            giftQuantity === qty
                              ? 'bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950'
                              : 'text-slate-200 hover:bg-white/10'
                          }`}
                        >
                          {qty}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Footer Actions: Balance on Right (اليد اليمين) & Send on Left (اليد الشمال) */}
                <div className="flex items-center justify-between gap-2" dir="rtl">
                  {/* Right Side (اليد اليمين): Recharge / Coins Display */}
                  <div
                    onClick={onOpenRecharge}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/10 hover:from-amber-500/30 hover:to-yellow-500/20 border border-amber-400/40 px-2.5 py-1 rounded-full cursor-pointer transition-all shadow-xs"
                    title="شحن الكوينز"
                  >
                    <span className="text-amber-400 text-xs">🪙</span>
                    <span className="font-mono font-black text-xs text-amber-300">
                      {localCoins.toLocaleString()}
                    </span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full shadow-xs">
                      شحن
                    </span>
                  </div>

                  {/* Left Side (اليد الشمال): Combined Cyan Send Button + Quantity Dropup Pill */}
                  <div className="flex items-center gap-1 relative" dir="ltr">
                    {/* Multiplier Pill Button */}
                    <button
                      onClick={() => setShowQuantityMenu(!showQuantityMenu)}
                      className="bg-white/10 hover:bg-white/20 text-white font-mono font-bold text-[10px] px-2 py-1.5 rounded-full border border-white/10 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>x{giftQuantity}</span>
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>

                    <button
                      id="gift-send-btn"
                      onClick={handleSend}
                      className={`font-black text-xs px-5 py-1.5 rounded-full shadow-md transition-all flex items-center gap-1.5 cursor-pointer relative overflow-hidden ${
                        showSuccessCheck
                          ? 'bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-400 text-slate-950 scale-105 shadow-emerald-500/40 ring-2 ring-emerald-300'
                          : 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-slate-950 shadow-cyan-500/20 hover:brightness-110 active:scale-95'
                      }`}
                    >
                      {showSuccessCheck ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3] animate-bounce" />
                          <span>تم الإرسال!</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5 text-slate-950" />
                          <span>إرسال</span>
                        </>
                      )}
                    </button>

                    <AnimatePresence>
                      {showSuccessCheck && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.8 }}
                          animate={{ opacity: 1, y: -24, scale: 1 }}
                          exit={{ opacity: 0, y: -32, scale: 0.8 }}
                          className="absolute -top-1 right-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1 z-20 pointer-events-none whitespace-nowrap"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-900" />
                          <span>تم الإرسال x{giftQuantity}!</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </AnimatePresence>

      {/* ================= 2. CONSECUTIVE COMBO BUTTON WITH 5-SECOND COUNTDOWN RING ================= */}
      <AnimatePresence>
        {isComboActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className="fixed bottom-4 sm:bottom-6 left-16 sm:left-[64px] z-[9999] pointer-events-auto flex flex-col items-center select-none drop-shadow-2xl"
          >
            {/* Floating Combo Burst Badges */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap z-20">
              <AnimatePresence>
                {comboFloatingBursts.map((burst) => (
                  <motion.div
                    key={burst.id}
                    initial={{ opacity: 1, y: 0, scale: 0.8, x: burst.x }}
                    animate={{ opacity: 0, y: -45, scale: 1.35 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: 'easeOut' }}
                    className="font-black text-[11px] font-mono text-amber-300 drop-shadow-[0_0_10px_rgba(245,158,11,0.9)] bg-black/85 px-2.5 py-0.5 rounded-full border border-amber-400/60 shadow-xl"
                  >
                    {burst.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Main Interactive Circular Button with 5s Clockwise Countdown Border */}
            <motion.button
              id="consecutive-combo-gift-btn"
              whileTap={{ scale: 0.86 }}
              whileHover={{ scale: 1.06 }}
              onClick={handleComboTap}
              className="relative w-20 h-20 flex items-center justify-center cursor-pointer rounded-full group focus:outline-hidden"
              title="اضغط للإرسال المتتالي (خلال 5 ثوانٍ)"
            >
              {/* Outer Radiant Glow Halo */}
              <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-300 opacity-70 blur-md group-hover:opacity-100 animate-pulse transition-opacity" />

              {/* Clockwise SVG Border Countdown Ring (5-Second Countdown like Clock Hands) */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 80 80">
                <defs>
                  <linearGradient id="comboTimerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#fde047" />
                  </linearGradient>
                </defs>
                {/* Background Border Track Circle */}
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Active Circular Countdown Line (Decreases Clockwise like Clock hands over 5 seconds) */}
                <circle
                  cx="40"
                  cy="40"
                  r="35"
                  stroke="url(#comboTimerGradient)"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={219.91}
                  strokeDashoffset={219.91 * (1 - comboProgress)}
                  className="transition-[stroke-dashoffset] duration-75"
                />
              </svg>

              {/* Inner Solid Interactive Button */}
              <div className="relative w-15 h-15 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 border-2 border-amber-200/80 shadow-[inset_0_2px_5px_rgba(255,255,255,0.6),0_4px_15px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center overflow-hidden">
                {/* Gift Icon / Media Preview */}
                <div className="relative flex items-center justify-center">
                  {isVideoResource(lastSentGiftRef.current?.icon || '') || lastSentGiftRef.current?.videoUrl ? (
                    <video
                      src={lastSentGiftRef.current?.videoUrl || lastSentGiftRef.current?.icon}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-7 h-7 object-contain pointer-events-none"
                    />
                  ) : isMediaUrl(lastSentGiftRef.current?.icon || '') ? (
                    <img
                      src={lastSentGiftRef.current?.icon}
                      alt={lastSentGiftRef.current?.name}
                      className="w-7 h-7 object-contain pointer-events-none"
                    />
                  ) : (
                    <span className="text-xl select-none">
                      {getCleanGiftEmoji(lastSentGiftRef.current?.name || '', lastSentGiftRef.current?.icon || '🎁')}
                    </span>
                  )}
                </div>

                {/* Dynamic Combo Label & Consecutive Count */}
                <div className="bg-slate-950/90 px-1.5 py-0.2 rounded-full border border-amber-400/50 text-[8.5px] font-black font-mono text-amber-300 tracking-tight leading-none mt-0.5 flex items-center gap-0.5 shadow-sm">
                  <span>إرسال</span>
                  <span className="text-yellow-400 font-extrabold">x{comboCount}</span>
                </div>
              </div>
            </motion.button>

            {/* Remaining Seconds Clock Countdown Badge */}
            <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-950/85 border border-amber-500/40 backdrop-blur-md text-[9px] font-mono font-black text-amber-300 flex items-center gap-1 shadow-md">
              <Sparkles className="w-2.5 h-2.5 text-amber-400 animate-spin" />
              <span>{(comboProgress * 5).toFixed(1)}s</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= 3. CONSECUTIVE COMBO WALLET BALANCE (Exact Designated Right Position During Combo) ================= */}
      <AnimatePresence>
        {isComboActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            className="fixed bottom-4 sm:bottom-6 right-3 sm:right-4 z-[9999] pointer-events-auto select-none drop-shadow-2xl"
            dir="rtl"
          >
            <div
              onClick={onOpenRecharge}
              className="flex items-center gap-1.5 bg-[#0A0E1A]/95 backdrop-blur-xl bg-gradient-to-r from-amber-500/25 via-yellow-500/15 to-amber-500/20 hover:from-amber-500/35 hover:to-yellow-500/30 border border-amber-400/50 px-3 py-1.5 rounded-full cursor-pointer transition-all shadow-[0_4px_20px_rgba(0,0,0,0.7)] ring-1 ring-amber-400/30"
              title="شحن الكوينز"
            >
              <span className="text-amber-400 text-xs animate-bounce">🪙</span>
              <span className="font-mono font-black text-xs text-amber-300 tracking-tight">
                {localCoins.toLocaleString()}
              </span>
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full shadow-xs hover:bg-amber-300 transition-colors">
                شحن
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= CMS GIFT EDITOR MODAL (Developer / Authorized Only) ================= */}
      {isCmsAuthorized && editingGift !== undefined && (
        <GiftEditorModal
          key={editingGift ? editingGift.id : 'new_gift_modal'}
          isOpen={true}
          giftToEdit={editingGift}
          defaultCategory={selectedTab}
          onClose={() => setEditingGift(undefined)}
          onSaved={(savedGift) => {
            // Update selected gift if this was the one edited
            if (selectedGift?.id === savedGift.id) {
              setSelectedGift(savedGift);
            }
          }}
          onDeleted={(deletedId) => {
            if (selectedGift?.id === deletedId) {
              const remaining = giftsList.filter((g) => g.id !== deletedId);
              if (remaining.length > 0) {
                setSelectedGift(remaining[0]);
              }
            }
          }}
        />
      )}
    </>
  );
};
