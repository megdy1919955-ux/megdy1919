import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers } from 'lucide-react';
import { LuckyChestConfig } from './LuckyChestModal';
import { ThreeDLuckyChest } from './ThreeDLuckyChest';

interface FloatingLuckyChestWidgetProps {
  activeChests: LuckyChestConfig[];
  currentUserId?: string;
  currentUserName?: string;
  roomId?: string;
  onOpenChestClaim: (chest: LuckyChestConfig) => void;
  isInsideRoom?: boolean;
}

export const FloatingLuckyChestWidget: React.FC<FloatingLuckyChestWidgetProps> = ({
  activeChests,
  currentUserId = '88492011',
  currentUserName = 'عابر سبيل',
  roomId,
  onOpenChestClaim,
  isInsideRoom = true
}) => {
  // Real-time timer tick for countdown calculations
  const [, setTick] = useState(0);
  const [locallyClaimedIds, setLocallyClaimedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('claimed_lucky_chest_ids') || '[]');
    } catch {
      return [];
    }
  });

  const [openingChestId, setOpeningChestId] = useState<string | null>(null);

  useEffect(() => {
    const syncClaimed = () => {
      try {
        setLocallyClaimedIds(JSON.parse(localStorage.getItem('claimed_lucky_chest_ids') || '[]'));
      } catch {}
    };
    window.addEventListener('storage', syncClaimed);
    window.addEventListener('lucky_chest_updated', syncClaimed);
    return () => {
      window.removeEventListener('storage', syncClaimed);
      window.removeEventListener('lucky_chest_updated', syncClaimed);
    };
  }, []);

  useEffect(() => {
    if (activeChests.length === 0) return;
    const timer = setInterval(() => {
      setTick((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeChests.length]);

  // Filter out chests that this user has ALREADY claimed or that have no remaining portions (completed/depleted)
  const effectiveUserId = currentUserId || '88492011';
  const unclaimedChests = activeChests.filter((chest) => {
    const isIdClaimedLocally = locallyClaimedIds.includes(chest.id);
    const isClaimedByMe =
      isIdClaimedLocally ||
      chest.claimedBy?.some((c) => c.userId === effectiveUserId || (currentUserName && c.userName === currentUserName));
    const remainingPortions =
      chest.remainingPortions ?? Math.max(0, chest.portions - (chest.claimedBy?.length || 0));
    const isDepleted = remainingPortions <= 0;

    if (isClaimedByMe || isDepleted) return false;

    // If roomId is specified, match roomId or global super chest
    if (roomId) {
      return chest.type === 'super' || chest.roomId === roomId || !chest.roomId;
    }

    return true;
  });

  // If there are no unclaimed boxes left for this user, disappear completely!
  if (unclaimedChests.length === 0) {
    return null;
  }

  // The active box on top of the stack
  const topChest = unclaimedChests[0];
  const stackCount = unclaimedChests.length;
  const isSuper = topChest.type === 'super';

  // Calculate remaining countdown
  const durationSeconds = topChest.drawTime === '10m' ? 600 : topChest.drawTime === '5m' ? 300 : 60;
  const elapsed = Math.floor((Date.now() - topChest.createdAt) / 1000);
  const remainingSeconds = Math.max(0, durationSeconds - elapsed);

  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  const isReady = remainingSeconds === 0 || topChest.drawTime === 'instant';

  const handleClickChest = () => {
    setOpeningChestId(topChest.id);
    setTimeout(() => {
      onOpenChestClaim(topChest);
      setOpeningChestId(null);
    }, 350);
  };

  const isCurrentChestOpen = openingChestId === topChest.id;

  return (
    <div
      className={
        isInsideRoom
          ? 'absolute top-[84px] sm:top-[88px] right-3 z-35 flex items-center pointer-events-auto select-none'
          : 'fixed top-24 right-4 z-60 flex items-center pointer-events-auto select-none'
      }
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={topChest.id}
          initial={{ scale: 0.4, opacity: 0, y: -20, rotate: -6 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.2, opacity: 0, y: 30, rotate: 10 }}
          transition={{ type: 'spring', damping: 20, stiffness: 350 }}
          onClick={handleClickChest}
          className="group cursor-pointer relative flex items-center justify-center"
          title={`انقر لفتح صندوق الحظ 3D (${stackCount} متبقي) 🎁`}
        >
          {/* UNDERLYING 3D CHEST LAYER (Visible behind if >= 2 in stack) */}
          {stackCount >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.65, scale: 0.86, x: 4, y: -3 }}
              className="absolute pointer-events-none z-10 filter drop-shadow-md brightness-75"
            >
              <ThreeDLuckyChest isSuper={isSuper} size="xs" />
            </motion.div>
          )}

          {/* TOP 3D CHEST (Face-on realistic chest, No square or rectangular card behind it) */}
          <motion.div
            animate={{
              y: isReady ? [0, -3, 0] : [0, -1.5, 0],
              scale: isReady ? [1, 1.05, 1] : [1, 1.02, 1]
            }}
            transition={{
              repeat: Infinity,
              duration: isReady ? 1.5 : 3,
              ease: 'easeInOut'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-20"
          >
            <ThreeDLuckyChest
              isOpen={isCurrentChestOpen}
              isSuper={isSuper}
              isReady={isReady}
              timeString={timeString}
              size="xs"
            />

            {/* Stack Multiplier Badge if > 1 chest */}
            {stackCount > 1 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -left-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[7.5px] px-1 py-0 rounded-full border border-white shadow-md flex items-center gap-0.5 z-40"
              >
                <Layers className="w-2 h-2 stroke-[3]" />
                <span>x{stackCount}</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

