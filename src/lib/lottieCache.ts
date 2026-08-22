// Global Pre-caching Manager and Developer Configuration Store for Lottie Assets

export interface EmojiLottieConfig {
  emoji: string;
  category: 'laugh' | 'cry' | 'heart' | 'fire' | 'clap' | 'party' | 'shock' | 'rose';
  lottieAssetPath: string;
  glowColor: string;
  speed: number;
}

// Default Emoji-to-Lottie Mappings
export const DEFAULT_EMOJI_CONFIGS: Record<string, EmojiLottieConfig> = {
  '😂': { emoji: '😂', category: 'laugh', lottieAssetPath: 'emojis/laugh.json', glowColor: '#F59E0B', speed: 1.0 },
  '🤣': { emoji: '🤣', category: 'laugh', lottieAssetPath: 'emojis/laugh_ultra.json', glowColor: '#F59E0B', speed: 1.2 },
  '😭': { emoji: '😭', category: 'cry', lottieAssetPath: 'emojis/tear.json', glowColor: '#3B82F6', speed: 1.0 },
  '😢': { emoji: '😢', category: 'cry', lottieAssetPath: 'emojis/sad_tear.json', glowColor: '#06B6D4', speed: 0.9 },
  '💖': { emoji: '💖', category: 'heart', lottieAssetPath: 'emojis/love.json', glowColor: '#EC4899', speed: 1.0 },
  '❤️': { emoji: '❤️', category: 'heart', lottieAssetPath: 'emojis/heart_beat.json', glowColor: '#EF4444', speed: 1.1 },
  '🔥': { emoji: '🔥', category: 'fire', lottieAssetPath: 'emojis/fire.json', glowColor: '#F97316', speed: 1.3 },
  '🥳': { emoji: '🥳', category: 'party', lottieAssetPath: 'emojis/party.json', glowColor: '#10B981', speed: 1.0 },
  '😱': { emoji: '😱', category: 'shock', lottieAssetPath: 'emojis/shock.json', glowColor: '#8B5CF6', speed: 1.1 },
  '🌹': { emoji: '🌹', category: 'rose', lottieAssetPath: 'emojis/rose.json', glowColor: '#F43F5E', speed: 0.9 },
};

// In-Memory Lottie Pre-cache Store (0 latency lookup)
const lottieMemoryCache: Map<string, any> = new Map();

// Generate schema programmatically if custom JSON asset not fetched
function buildBaseLottieSchema(category: string) {
  return {
    v: '5.7.4',
    fr: 30,
    ip: 0,
    op: 90,
    w: 200,
    h: 200,
    nm: category,
    layers: [
      {
        ddd: 0, ind: 1, ty: 4, nm: 'Pulse Body', sr: 1,
        ks: {
          o: { k: 100 }, r: { k: 0 }, p: { k: [100, 100, 0] }, a: { k: [0, 0, 0] },
          s: { k: [{ t: 0, s: [95, 95] }, { t: 25, s: [115, 115] }, { t: 50, s: [92, 92] }, { t: 75, s: [100, 100] }] }
        },
        shapes: [
          {
            ty: 'gr',
            it: [
              { d: 1, ty: 'el', s: { k: [130, 130] }, p: { k: [0, 0] } },
              { ty: 'fl', c: { k: [1, 0.8, 0.2, 1] }, o: { k: 100 } },
              { ty: 'tr', p: { k: [0, 0] }, a: { k: [0, 0] }, s: { k: [100, 100] }, r: { k: 0 }, o: { k: 100 } }
            ]
          }
        ]
      }
    ]
  };
}

// Fetch network Lottie JSON (http:// or https://) and cache into memory
export async function fetchAndCacheNetworkLottie(url: string, emoji: string): Promise<any> {
  const cacheKey = `${emoji}_${url}`;
  if (lottieMemoryCache.has(cacheKey)) {
    return lottieMemoryCache.get(cacheKey);
  }
  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      lottieMemoryCache.set(cacheKey, data);
      return data;
    }
  } catch (err) {
    console.warn(`[LottieCache] Failed to fetch network Lottie from ${url}`, err);
  }
  return null;
}

// Pre-cache all active emoji Lottie configurations into memory for zero latency
export function precacheAllLottieAssets(configs: Record<string, EmojiLottieConfig> = DEFAULT_EMOJI_CONFIGS) {
  Object.values(configs).forEach((cfg) => {
    const isNetwork = cfg.lottieAssetPath.startsWith('http://') || cfg.lottieAssetPath.startsWith('https://');
    if (isNetwork) {
      fetchAndCacheNetworkLottie(cfg.lottieAssetPath, cfg.emoji);
    } else {
      const cacheKey = `${cfg.emoji}_${cfg.lottieAssetPath}`;
      if (!lottieMemoryCache.has(cacheKey)) {
        const schema = buildBaseLottieSchema(cfg.category);
        lottieMemoryCache.set(cacheKey, schema);
      }
    }
  });
  console.log(`[LottiePrecache] Pre-cached ${Object.keys(configs).length} reaction animations into memory.`);
}

// Retrieve pre-cached Lottie JSON schema instantly
export function getCachedLottieSchema(emoji: string, assetPath?: string, category: string = 'laugh') {
  const cacheKey = assetPath ? `${emoji}_${assetPath}` : `${emoji}_emojis/${category}.json`;
  if (lottieMemoryCache.has(cacheKey)) {
    return lottieMemoryCache.get(cacheKey);
  }

  // If base64-encoded Lottie JSON data URI
  if (assetPath && assetPath.startsWith('data:application/json;base64,')) {
    try {
      const base64Str = assetPath.replace('data:application/json;base64,', '');
      const jsonStr = decodeURIComponent(escape(atob(base64Str)));
      const parsed = JSON.parse(jsonStr);
      lottieMemoryCache.set(cacheKey, parsed);
      return parsed;
    } catch {
      try {
        const parsed = JSON.parse(atob(assetPath.replace('data:application/json;base64,', '')));
        lottieMemoryCache.set(cacheKey, parsed);
        return parsed;
      } catch (err) {
        console.warn('[LottieCache] Failed to parse base64 Lottie JSON', err);
      }
    }
  }

  // If raw JSON string
  if (assetPath && (assetPath.startsWith('{') || assetPath.startsWith('['))) {
    try {
      const parsed = JSON.parse(assetPath);
      lottieMemoryCache.set(cacheKey, parsed);
      return parsed;
    } catch {}
  }

  const fallbackSchema = buildBaseLottieSchema(category);
  lottieMemoryCache.set(cacheKey, fallbackSchema);

  // If network URL, asynchronously fetch to update cache for future instant re-renders
  if (assetPath && (assetPath.startsWith('http://') || assetPath.startsWith('https://'))) {
    fetchAndCacheNetworkLottie(assetPath, emoji);
  }

  return fallbackSchema;
}

// Persistence helpers for Dev Config Panel & User Custom Reactions
const STORAGE_KEY = 'super_legend_dev_emoji_configs';
const USER_CUSTOM_REACTIONS_KEY = 'super_legend_user_custom_reactions';
const DB_NAME = 'SuperLegendMediaDB';
const DB_STORE = 'custom_reactions';

export interface CustomReactionItemOverride {
  id: string;
  emoji?: string;
  customImage?: string; // base64 or URL
  customLabel?: string;
  customGlow?: string;
}

// In-memory cache for synchronous instant access
let inMemoryCustomReactions: Record<string, CustomReactionItemOverride> = {};
let isIndexedDBInitialized = false;

// IndexedDB Helper with fallback
function getIndexedDB(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    try {
      const request = window.indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

// Load initial data from localStorage and IndexedDB
function initCustomReactions() {
  if (typeof window === 'undefined') return;
  
  // 1. Quick sync load from localStorage if available
  try {
    const raw = localStorage.getItem(USER_CUSTOM_REACTIONS_KEY);
    if (raw) {
      inMemoryCustomReactions = JSON.parse(raw);
    }
  } catch {
    // If localStorage was corrupted or quota exceeded previously, ignore and continue to IndexedDB
  }

  // 2. Hydrate & sync from IndexedDB
  if (!isIndexedDBInitialized) {
    isIndexedDBInitialized = true;
    getIndexedDB().then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction(DB_STORE, 'readonly');
        const store = tx.objectStore(DB_STORE);
        const req = store.getAll();
        req.onsuccess = () => {
          if (Array.isArray(req.result) && req.result.length > 0) {
            const dbMap: Record<string, CustomReactionItemOverride> = {};
            req.result.forEach((item: CustomReactionItemOverride) => {
              if (item && item.id) {
                dbMap[item.id] = item;
              }
            });
            inMemoryCustomReactions = { ...inMemoryCustomReactions, ...dbMap };
            window.dispatchEvent(new Event('lottie_config_updated'));
          }
        };
      } catch {
        // Safe fail
      }
    });
  }
}

// Initialize on module load
initCustomReactions();

export function getStoredUserCustomReactions(): Record<string, CustomReactionItemOverride> {
  if (Object.keys(inMemoryCustomReactions).length === 0) {
    initCustomReactions();
  }
  return inMemoryCustomReactions;
}

export function saveStoredUserCustomReactions(overrides: Record<string, CustomReactionItemOverride>) {
  inMemoryCustomReactions = { ...overrides };

  // 1. Asynchronously persist to IndexedDB (unlimited quota)
  getIndexedDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(DB_STORE, 'readwrite');
      const store = tx.objectStore(DB_STORE);
      store.clear();
      Object.values(overrides).forEach((item) => {
        store.put(item);
      });
    } catch {
      // Safe fallback
    }
  });

  // 2. Attempt to sync to localStorage with safe quota handling
  try {
    localStorage.setItem(USER_CUSTOM_REACTIONS_KEY, JSON.stringify(overrides));
  } catch {
    // Quota exceeded: store lightweight version without huge base64 in localStorage
    try {
      const lightweight: Record<string, CustomReactionItemOverride> = {};
      Object.entries(overrides).forEach(([k, v]) => {
        lightweight[k] = {
          ...v,
          customImage: v.customImage?.length && v.customImage.length > 2048 ? '' : v.customImage,
        };
      });
      localStorage.setItem(USER_CUSTOM_REACTIONS_KEY, JSON.stringify(lightweight));
    } catch {
      // Ignored safely as IndexedDB and inMemory will preserve the full data
    }
  }

  // 3. Notify app components
  window.dispatchEvent(new Event('lottie_config_updated'));
}

export function getStoredEmojiConfigs(): Record<string, EmojiLottieConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_EMOJI_CONFIGS, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed to parse dev emoji configs', err);
  }
  return DEFAULT_EMOJI_CONFIGS;
}

export function saveStoredEmojiConfigs(configs: Record<string, EmojiLottieConfig>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
    precacheAllLottieAssets(configs);
    // Dispatch global event for immediate live UI re-render
    window.dispatchEvent(new Event('lottie_config_updated'));
  } catch (err) {
    console.error('Failed to save dev emoji configs', err);
  }
}

