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

  const isNetworkUrl = activeAssetPath && (activeAssetPath.startsWith('http://') || activeAssetPath.startsWith('https://'));

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

  // Use network Lottie JSON if loaded, otherwise fallback to instant cached schema
  const lottieData = networkLottieData || getCachedLottieSchema(emoji, activeAssetPath, category);

  return (
    <div
      key={`${emoji}_${activeAssetPath}_${configVersion}`}
      className="relative w-full h-full flex items-center justify-center rounded-full overflow-hidden bg-black/70 backdrop-blur-sm border-2 shadow-2xl transition-all duration-200"
      style={{
        borderColor: activeGlowColor,
        boxShadow: `0 0 30px ${activeGlowColor}CC, inset 0 0 15px ${activeGlowColor}66`,
      }}
    >
      {/* 0-Latency Pre-Cached or Network Lottie Player Component */}
      <div className="w-full h-full p-0.5 flex items-center justify-center">
        <Lottie
          animationData={lottieData}
          loop={true}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Primary Facial Expression Emoji Centered in Lottie Player Frame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-3xl sm:text-4xl filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] animate-pulse">
          {emoji}
        </span>
      </div>

      {/* Circular Glowing Pulsing Ring Overlay */}
      <div
        className="absolute inset-0 rounded-full border-2 animate-ping opacity-60 pointer-events-none"
        style={{ borderColor: glowColor }}
      />
    </div>
  );
};

