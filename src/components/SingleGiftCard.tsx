import React, { useState, useEffect } from 'react';
import { GiftItem, isVideoResource, isMediaUrl, getCleanGiftEmoji } from '../lib/giftCmsService';
import { isRefundGift } from '../lib/refundVaultService';
import {
  isGiftLoaded,
  getGiftLoadingProgress,
  subscribeToGiftLoading,
  loadGiftOnDemand
} from '../lib/giftOnDemandLoader';
import { DownloadCloud, CheckCircle2 } from 'lucide-react';

export interface SingleGiftCardProps {
  gift: GiftItem;
  isSelected: boolean;
  category: string;
  onSelect: (gift: GiftItem) => void;
}

/**
 * مكون الهدية المستقلة ذات التحميل عند الطلب مع شريط تقدم صغير
 */
export const SingleGiftCard: React.FC<SingleGiftCardProps> = ({
  gift,
  isSelected,
  category,
  onSelect
}) => {
  const [loaded, setLoaded] = useState<boolean>(() => isGiftLoaded(gift.id));
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(() => getGiftLoadingProgress(gift.id));

  useEffect(() => {
    const unsub = subscribeToGiftLoading((gId, p, isDone) => {
      if (gId === gift.id) {
        setProgress(p);
        if (isDone) {
          setLoaded(true);
          setLoading(false);
        }
      }
    });
    return unsub;
  }, [gift.id]);

  // عند تحديد الهدية، إذا لم تكن محملة في ذاكرة الجوال يتم تحميلها فوراً حسب الطلب وحفظها في الكاش
  useEffect(() => {
    if (isSelected && !loaded && !loading) {
      setLoading(true);
      loadGiftOnDemand(gift).then(() => {
        setLoading(false);
        setLoaded(true);
      });
    }
  }, [isSelected, loaded, loading, gift]);

  const handleClick = async () => {
    onSelect(gift);

    if (!loaded && !loading) {
      setLoading(true);
      await loadGiftOnDemand(gift);
      setLoading(false);
      setLoaded(true);
    }
  };

  const mediaSrc = gift.videoUrl || gift.icon;
  const isVid = isVideoResource(mediaSrc);
  const isImg = !isVid && isMediaUrl(mediaSrc);
  const isRefund = isRefundGift(gift) || category === 'استرداد';

  return (
    <div
      onClick={handleClick}
      className={`relative rounded-xl p-1 sm:p-1.5 flex flex-col items-center justify-between text-center transition-all cursor-pointer group min-h-[78px] w-full select-none overflow-hidden ${
        isSelected
          ? 'bg-[#102232] border-2 border-emerald-400 shadow-md shadow-emerald-500/25 scale-[1.01]'
          : 'bg-[#111726]/90 border border-white/5 hover:bg-[#162034] hover:border-cyan-400/40'
      }`}
    >
      {/* شريط التحميل الصغير عند الطلب */}
      {loading && !loaded && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-150"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

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

      {/* Top Right Icons & On-Demand Status Indicator */}
      <div className="absolute top-0.5 right-0.5 flex items-center gap-0.5 z-20">
        {!loaded && !loading && (
          <span className="w-3.5 h-3.5 rounded-full bg-white/10 text-slate-400 flex items-center justify-center text-[7px] hover:text-cyan-300" title="تحميل عند الطلب">
            <DownloadCloud className="w-2.5 h-2.5 text-cyan-300/80" />
          </span>
        )}

        {gift.hasGlobalBroadcast && gift.price >= 20000 && (
          <span className="w-3 h-3 rounded-full bg-pink-500/80 text-white flex items-center justify-center text-[6px]" title="إشعار عالمي">
            🌐
          </span>
        )}

        {gift.hasSound && (
          <span className="w-3 h-3 rounded-full bg-cyan-500/80 text-slate-950 flex items-center justify-center text-[6px]" title="مؤثر صوتي">
            🎵
          </span>
        )}
      </div>

      {/* Gift Graphic / Icon */}
      <div className="my-auto py-0.5 text-2xl group-hover:scale-110 transition-transform duration-200 drop-shadow-xs flex items-center justify-center relative">
        {/* إذا كانت لم تحمل بعد ولم تكن محددة يتم إظهار صورة أولية مخففة جداً أو إيموجي خفيف لحفظ الأداء */}
        {loaded || isSelected ? (
          isVid ? (
            <video
              src={mediaSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-8 h-8 object-contain pointer-events-none"
              style={{ mixBlendMode: gift.blendMode || 'screen' }}
            />
          ) : isImg ? (
            <img src={mediaSrc} alt={gift.name} loading="lazy" className="w-8 h-8 object-contain" />
          ) : (
            <span>{getCleanGiftEmoji(gift.name, gift.icon)}</span>
          )
        ) : (
          <div className="w-8 h-8 flex items-center justify-center relative">
            {isImg ? (
              <img
                src={gift.thumbnailUrl || mediaSrc}
                alt={gift.name}
                loading="lazy"
                className="w-7 h-7 object-contain opacity-75 blur-[0.2px]"
              />
            ) : (
              <span className="text-xl opacity-80">{getCleanGiftEmoji(gift.name, gift.icon)}</span>
            )}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 rounded-full">
                <span className="text-[7px] font-mono text-cyan-300 font-bold">{progress}%</span>
              </div>
            )}
          </div>
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
};

export default SingleGiftCard;
