import React, { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { getCachedLottieSchema, getStoredEmojiConfigs, fetchAndCacheNetworkLottie } from '../lib/lottieCache';

interface LottieReactionPlayerProps {
  emoji: string;
  emojiType?: string;
  lottieAssetPath?: string;
  glowColor?: string;
}

// Helper to determine category
function resolveCategory(emoji: string, providedType?: string, assetPath?: string): 'laugh' | 'cry' | 'heart' | 'fire' | 'clap' | 'party' | 'shock' | 'rose' | 'default' {
  if (providedType && ['laugh', 'cry', 'heart', 'fire', 'clap', 'party', 'shock', 'rose'].includes(providedType)) {
    return providedType as any;
  }
  if (assetPath) {
    if (assetPath.includes('laugh')) return 'laugh';
    if (assetPath.includes('cry') || assetPath.includes('tear')) return 'cry';
    if (assetPath.includes('heart') || assetPath.includes('love')) return 'heart';
    if (assetPath.includes('fire')) return 'fire';
  }
  if (['😂', '🤣', '😆', '😅', '🤪', '🥳', '😜', '😁', '😸', '😹'].includes(emoji)) return 'laugh';
  if (['😭', '😢', '🥺', '💔', '😿', '💧', '🌧️'].includes(emoji)) return 'cry';
  if (['💖', '❤️', '💕', '🥰', '😍', '💓', '💗', '💞', '💌', '🌹', '👑'].includes(emoji)) return 'heart';
  if (['🔥', '⚡', '🚀', '💥', '✨', '🎆'].includes(emoji)) return 'fire';
  if (['👏', '🙌', '👍', '🏆', '🦁', '🦅', '💪'].includes(emoji)) return 'clap';
  if (['🎉', '🥳', '🎈', '🎊', '🎯', '✨'].includes(emoji)) return 'party';
  if (['😱', '🤯', '🤡', '💩', '👻', '🤖', '🙈', '👽'].includes(emoji)) return 'shock';
  if (['🌹', '💐', '🌸', '🌺'].includes(emoji)) return 'rose';
  return 'laugh';
}

export const LottieReactionPlayer: React.FC<LottieReactionPlayerProps> = ({
  emoji,
  emojiType,
  lottieAssetPath,
  glowColor,
}) => {
  const [configVersion, setConfigVersion] = useState(0);
  const [networkLottieData, setNetworkLottieData] = useState<any>(null);

  // Re-render when lottie_config_updated is fired globally
  useEffect(() => {
    const handleConfigChange = () => setConfigVersion((v) => v + 1);
    window.addEventListener('lottie_config_updated', handleConfigChange);
    return () => window.removeEventListener('lottie_config_updated', handleConfigChange);
  }, []);

  const category = resolveCategory(emoji, emojiType, lottieAssetPath);
  
  // Lookup stored dev configuration for glow color and custom speed
  const storedConfigs = getStoredEmojiConfigs();
  const emojiCfg = storedConfigs[emoji];
  const activeAssetPath = lottieAssetPath || emojiCfg?.lottieAssetPath;
  const activeGlowColor = glowColor || emojiCfg?.glowColor || '#F59E0B';

  const isCustomImage = activeAssetPath && (
    activeAssetPath.startsWith('data:image/') ||
    activeAssetPath.startsWith('blob:') ||
    activeAssetPath.match(/\.(png|jpg|jpeg|gif|webp|svg)($|\?)/i)
  );

  const isNetworkUrl = activeAssetPath && !isCustomImage && (activeAssetPath.startsWith('http://') || activeAssetPath.startsWith('https://'));

  // Handle dynamic Network URL fetching
  useEffect(() => {
    if (isNetworkUrl && activeAssetPath) {
      let isMounted = true;
      fetchAndCacheNetworkLottie(activeAssetPath, emoji).then((data) => {
        if (isMounted && data) {
          setNetworkLottieData(data);
        }
      });
      return () => { isMounted = false; };
    } else {
      setNetworkLottieData(null);
    }
  }, [activeAssetPath, emoji, isNetworkUrl, configVersion]);

  // If custom uploaded image / design
  if (isCustomImage) {
    return (
      <div
        key={`custom_img_${activeAssetPath?.substring(0, 30)}_${configVersion}`}
        className="w-full h-full flex items-center justify-center pointer-events-none"
      >
        <img
          src={activeAssetPath}
          alt={emoji}
          className="w-full h-full max-w-[85px] max-h-[85px] object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] transform hover:scale-105 transition-transform"
        />
      </div>
    );
  }

  // Use network Lottie JSON if loaded, otherwise fallback to instant cached schema
  const lottieData = networkLottieData || getCachedLottieSchema(emoji, activeAssetPath, category);

  // Dynamic animation styling based on reaction category for emojis
  const getCategoryAnimation = (cat: string) => {
    switch (cat) {
      case 'laugh':
        return 'animate-bounce';
      case 'heart':
        return 'animate-pulse scale-110';
      case 'fire':
        return 'animate-bounce';
      case 'cry':
        return 'animate-pulse';
      case 'party':
      case 'clap':
        return 'animate-bounce';
      case 'shock':
        return 'animate-ping';
      default:
        return 'animate-pulse';
    }
  };

  const isLottieCustomJson = activeAssetPath && (
    activeAssetPath.startsWith('data:application/json') ||
    activeAssetPath.endsWith('.json') ||
    isNetworkUrl
  );

  return (
    <div
      key={`${emoji}_${activeAssetPath}_${configVersion}`}
      className="relative w-full h-full flex items-center justify-center pointer-events-none"
    >
      {/* Lottie Animation Layer */}
      {lottieData && (
        <div className="absolute inset-0 flex items-center justify-center scale-110">
          <Lottie
            animationData={lottieData}
            loop={true}
            autoplay={true}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* Primary Emoji Display (if not a pure standalone custom Lottie animation) */}
      {!isLottieCustomJson && (
        <span
          className={`text-3xl sm:text-4xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.85)] z-10 select-none ${getCategoryAnimation(category)}`}
        >
          {emoji}
        </span>
      )}
    </div>
  );
};

