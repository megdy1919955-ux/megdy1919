import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'motion/react';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Volume1,
  VolumeX, 
  Upload, 
  Music, 
  Disc, 
  Repeat, 
  Shuffle, 
  Trash2, 
  ListMusic, 
  GripHorizontal,
  Minimize2,
  Maximize2,
  ChevronDown,
  ChevronUp,
  Lock,
  Mic,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Radio,
  Zap,
  Gauge,
  Bot,
  Hand,
  Sliders,
  Search,
  Loader2,
  Check,
  CheckSquare,
  Square,
  Folder,
  FolderOpen
} from 'lucide-react';

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  src: string;
  coverUrl?: string;
  isCustom?: boolean;
}

interface MusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToastNotification?: (message: string) => void;
  canControl?: boolean;
  currentUserRole?: 'owner' | 'host' | 'moderator' | 'guest';
  isMicSpeaking?: boolean;
}

// Sample High-Quality Audio Tracks
const INITIAL_PLAYLIST: TrackItem[] = [
  {
    id: 'sample-1',
    title: 'أنغام الشرق الهادئة (Lofi Oriental)',
    artist: 'دي جي الغرفة',
    duration: 180,
    src: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300',
    isCustom: false,
  },
  {
    id: 'sample-2',
    title: 'إيقاعات السهرة والحفلة (Party Beats)',
    artist: 'ميكس السهرة',
    duration: 154,
    src: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cheerful-upbeat-10582.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300',
    isCustom: false,
  },
  {
    id: 'sample-3',
    title: 'معزوفة العود والاسترخاء (Chill Oud)',
    artist: 'أنغام ذهبية',
    duration: 210,
    src: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=300',
    isCustom: false,
  },
  {
    id: 'sample-4',
    title: 'إيقاع التحديات والحماس (Action Beats)',
    artist: 'دي جي الأسطورة',
    duration: 142,
    src: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_8b273fa410.mp3?filename=hiphop-rock-113842.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=300',
    isCustom: false,
  },
];

// Global cache for preserving imported songs across modal open/close cycles
let globalPlaylistCache: TrackItem[] | null = null;

// Dedicated IndexedDB Storage Manager for ROM Music MP3 files
const ROM_MUSIC_DB_NAME = 'ROM_MUSIC_STORAGE_DB';
const ROM_MUSIC_STORE_NAME = 'rom_mp3_songs';

export interface StoredRomMp3Item {
  id: string;
  title: string;
  artist: string;
  duration: number;
  blob: Blob;
  coverUrl?: string;
  addedAt: number;
}

const openRomMusicDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB غير مدعوم في هذا المتصفح'));
      return;
    }
    const request = window.indexedDB.open(ROM_MUSIC_DB_NAME, 1);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(ROM_MUSIC_STORE_NAME)) {
        db.createObjectStore(ROM_MUSIC_STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const saveRomMp3ToIndexedDB = async (item: StoredRomMp3Item): Promise<void> => {
  try {
    const db = await openRomMusicDB();
    const tx = db.transaction(ROM_MUSIC_STORE_NAME, 'readwrite');
    const store = tx.objectStore(ROM_MUSIC_STORE_NAME);
    store.put(item);
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.error('Failed to save MP3 to ROM IndexedDB storage:', err);
  }
};

const loadRomMp3FromIndexedDB = async (): Promise<TrackItem[]> => {
  try {
    const db = await openRomMusicDB();
    const tx = db.transaction(ROM_MUSIC_STORE_NAME, 'readonly');
    const store = tx.objectStore(ROM_MUSIC_STORE_NAME);
    const request = store.getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const items = request.result as StoredRomMp3Item[];
        if (!items || !Array.isArray(items)) {
          resolve([]);
          return;
        }
        const tracks: TrackItem[] = items.map((item) => {
          let objectUrl = '';
          try {
            objectUrl = URL.createObjectURL(item.blob);
          } catch {
            objectUrl = '';
          }
          return {
            id: item.id,
            title: item.title,
            artist: item.artist || 'ذاكرة الروم المحفوظة 📱',
            duration: item.duration || 180,
            src: objectUrl,
            coverUrl: item.coverUrl || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300',
            isCustom: true,
          };
        }).filter((t) => !!t.src);
        resolve(tracks);
      };
      request.onerror = () => resolve([]);
    });
  } catch (err) {
    console.error('Failed to load MP3s from ROM IndexedDB storage:', err);
    return [];
  }
};

const deleteRomMp3FromIndexedDB = async (id: string): Promise<void> => {
  try {
    const db = await openRomMusicDB();
    const tx = db.transaction(ROM_MUSIC_STORE_NAME, 'readwrite');
    const store = tx.objectStore(ROM_MUSIC_STORE_NAME);
    store.delete(id);
  } catch (err) {
    console.error('Failed to delete MP3 from ROM IndexedDB storage:', err);
  }
};

export const MusicPlayerModal: React.FC<MusicPlayerModalProps> = ({
  isOpen,
  onClose,
  onToastNotification,
  canControl,
  currentUserRole = 'owner',
  isMicSpeaking = false,
}) => {
  // Role-Based Access Control (RBAC): Only Room Owner and Hosts/Moderators can control music
  const hasControlPermission = canControl ?? (currentUserRole === 'owner' || currentUserRole === 'host' || currentUserRole === 'moderator');

  const [playlist, setPlaylist] = useState<TrackItem[]>(() => globalPlaylistCache || INITIAL_PLAYLIST);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [showPlaylist, setShowPlaylist] = useState<boolean>(false);
  const [showDuckingPopover, setShowDuckingPopover] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTrackIds, setSelectedTrackIds] = useState<Set<string>>(new Set());
  const musicScreenConstraintsRef = useRef<HTMLDivElement>(null);

  // Load saved ROM MP3 songs from dedicated IndexedDB phone storage on initial mount
  useEffect(() => {
    let isMounted = true;
    loadRomMp3FromIndexedDB().then((savedTracks) => {
      if (!isMounted || savedTracks.length === 0) return;
      setPlaylist((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newUnique = savedTracks.filter((t) => !existingIds.has(t.id));
        if (newUnique.length === 0) return prev;
        const updated = [...newUnique, ...prev];
        globalPlaylistCache = updated;
        return updated;
      });
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Batch Multi-Upload Progress State
  const [uploadProgress, setUploadProgress] = useState<{
    isUploading: boolean;
    current: number;
    total: number;
    fileName: string;
  }>({
    isUploading: false,
    current: 0,
    total: 0,
    fileName: '',
  });

  // Measure audio duration asynchronously with timeout guard
  const getAudioDuration = (url: string): Promise<number> => {
    return new Promise((resolve) => {
      const tempAudio = new Audio();
      tempAudio.preload = 'metadata';
      const timer = setTimeout(() => resolve(180), 1200);
      tempAudio.onloadedmetadata = () => {
        clearTimeout(timer);
        if (tempAudio.duration && !isNaN(tempAudio.duration) && isFinite(tempAudio.duration)) {
          resolve(Math.round(tempAudio.duration));
        } else {
          resolve(180);
        }
      };
      tempAudio.onerror = () => {
        clearTimeout(timer);
        resolve(180);
      };
      tempAudio.src = url;
    });
  };

  const filteredPlaylist = playlist.filter((track) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return track.title.toLowerCase().includes(q) || track.artist.toLowerCase().includes(q);
  });

  // Ducking Control Mode: 'auto' (الوضع التلقائي الذكي) | 'manual' (الوضع اليدوي الثابت)
  const [duckingControlMode, setDuckingControlMode] = useState<'auto' | 'manual'>('auto');

  // Auto Mode intensity level: 'mild' (خفض هادئ 15%), 'balanced' (خفض متوازن 35%), 'strong' (خفض قوي 70%)
  const [autoDuckingLevel, setAutoDuckingLevel] = useState<'mild' | 'balanced' | 'strong'>('balanced');

  // Auto Mode Debounced Mic Speech state with Hysteresis filter
  const [debouncedSpeaking, setDebouncedSpeaking] = useState<boolean>(false);
  const speakingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Manual Mode presets: 'off' (100% normal) | '70' (70% level) | '40' (40% level) | '20' (20% level)
  const [manualPreset, setManualPreset] = useState<'off' | '70' | '40' | '20'>('off');

  // Hysteresis Filter for Smart Auto Ducking (120ms attack hold, 500ms release hold)
  useEffect(() => {
    if (duckingControlMode !== 'auto') {
      setDebouncedSpeaking(false);
      return;
    }

    if (speakingTimerRef.current) {
      clearTimeout(speakingTimerRef.current);
    }

    if (isMicSpeaking) {
      // 120ms attack hold to ensure mic signal isn't noise spike
      speakingTimerRef.current = setTimeout(() => {
        setDebouncedSpeaking(true);
      }, 120);
    } else {
      // 500ms release hold for comfortable fade back
      speakingTimerRef.current = setTimeout(() => {
        setDebouncedSpeaking(false);
      }, 500);
    }

    return () => {
      if (speakingTimerRef.current) {
        clearTimeout(speakingTimerRef.current);
      }
    };
  }, [isMicSpeaking, duckingControlMode]);

  // Calculate current effective volume multiplier
  const getEffectiveMultiplier = () => {
    if (duckingControlMode === 'auto') {
      if (debouncedSpeaking && isPlaying) {
        if (autoDuckingLevel === 'mild') return 0.85; // خفض هادئ بنسبة 15%
        if (autoDuckingLevel === 'balanced') return 0.65; // خفض متوازن بنسبة 35%
        if (autoDuckingLevel === 'strong') return 0.30; // خفض قوي بنسبة 70%
      }
      return 1.0;
    } else {
      if (manualPreset === '70') return 0.70;
      if (manualPreset === '40') return 0.40;
      if (manualPreset === '20') return 0.20;
      return 1.0;
    }
  };

  // Separate Framer Motion Drag Controls for full mode
  const fullDragControls = useDragControls();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  // Web Audio API refs for Studio Audio Mixing & Automatic Gain Control (AGC)
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const compressorNodeRef = useRef<DynamicsCompressorNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const currentTrack = playlist[currentTrackIndex] || playlist[0];

  // Helper function to check RBAC permissions before performing restricted actions
  const checkPermissionAndRun = (action: () => void) => {
    if (!hasControlPermission) {
      if (onToastNotification) {
        onToastNotification('عذراً، صلاحيات التشغيل والتحكم بالموسيقى محصورة بـ (صاحب الغرفة والمشرفين) فقط 🔒');
      }
      return;
    }
    action();
  };

  // Initialize Web Audio Engine for Studio Audio Mixing & Automatic Gain Control (AGC)
  const initAudioEngine = () => {
    if (!audioRef.current || sourceNodeRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const source = ctx.createMediaElementSource(audioRef.current);
      const gainNode = ctx.createGain();

      // Automatic Gain Control (AGC) Dynamics Compressor
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-20, ctx.currentTime);
      compressor.knee.setValueAtTime(10, ctx.currentTime);
      compressor.ratio.setValueAtTime(4, ctx.currentTime);
      compressor.attack.setValueAtTime(0.003, ctx.currentTime);
      compressor.release.setValueAtTime(0.25, ctx.currentTime);

      source.connect(gainNode);
      gainNode.connect(compressor);
      compressor.connect(ctx.destination);

      audioContextRef.current = ctx;
      gainNodeRef.current = gainNode;
      compressorNodeRef.current = compressor;
      sourceNodeRef.current = source;
    } catch (err) {
      console.warn('Web Audio API initialized with audio element fallback:', err);
    }
  };

  // Play / Pause Toggle
  const togglePlayPause = (e?: React.MouseEvent | React.PointerEvent) => {
    if (e) e.stopPropagation();

    checkPermissionAndRun(() => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      } else {
        initAudioEngine();
      }

      if (!audioRef.current) return;

      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        if (onToastNotification) onToastNotification('تم إيقاف تشغيل الموسيقى مؤقتاً ⏸️');
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          if (onToastNotification && currentTrack) {
            onToastNotification(`جاري تشغيل: ${currentTrack.title} 🎵`);
          }
        }).catch((err) => {
          console.warn('Playback error:', err);
        });
      }
    });
  };

  // Next Track
  const handleNextTrack = (e?: React.MouseEvent | React.PointerEvent) => {
    if (e) e.stopPropagation();

    checkPermissionAndRun(() => {
      if (playlist.length === 0) return;
      let nextIdx = currentTrackIndex + 1;
      if (isShuffle) {
        nextIdx = Math.floor(Math.random() * playlist.length);
      } else if (nextIdx >= playlist.length) {
        nextIdx = 0;
      }
      setCurrentTrackIndex(nextIdx);
      setIsPlaying(true);
    });
  };

  // Previous Track
  const handlePrevTrack = (e?: React.MouseEvent | React.PointerEvent) => {
    if (e) e.stopPropagation();

    checkPermissionAndRun(() => {
      if (playlist.length === 0) return;
      let prevIdx = currentTrackIndex - 1;
      if (prevIdx < 0) {
        prevIdx = playlist.length - 1;
      }
      setCurrentTrackIndex(prevIdx);
      setIsPlaying(true);
    });
  };

  // Pointer drag start with pointer capture
  const handleStartDragFull = (e: React.PointerEvent) => {
    e.stopPropagation();
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    fullDragControls.start(e);
  };

  // Apply Volume & Ducking Effect smoothly with Attack & Release
  useEffect(() => {
    const multiplier = getEffectiveMultiplier();
    let timeConstant = 0.08;
    if (duckingControlMode === 'auto') {
      timeConstant = debouncedSpeaking ? 0.08 : 0.45; // Fast Fade Out / Slow Fade In
    } else {
      timeConstant = 0.12;
    }

    const targetVol = isMuted ? 0 : volume * multiplier;

    if (gainNodeRef.current && audioContextRef.current) {
      const ctx = audioContextRef.current;
      const gain = gainNodeRef.current.gain;
      gain.setTargetAtTime(targetVol, ctx.currentTime, timeConstant);
    }

    if (audioRef.current) {
      audioRef.current.volume = targetVol;
    }
  }, [duckingControlMode, autoDuckingLevel, debouncedSpeaking, manualPreset, volume, isMuted, isPlaying]);

  // Initialize or update audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || currentTrack?.duration || 0);
    const handleEnded = () => handleNextTrack();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [playlist, currentTrackIndex, isRepeat, isShuffle]);

  // Handle Track Source Changes
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const audio = audioRef.current;
      if (audio.src !== currentTrack.src) {
        audio.src = currentTrack.src;
      }
      const targetVol = isMuted ? 0 : volume * getEffectiveMultiplier();
      audio.volume = targetVol;

      if (isPlaying) {
        audio.play().catch((err) => console.log('Audio autoplay prevented:', err));
      }
    }
  }, [currentTrackIndex, currentTrack?.src]);

  // Handle Volume & Mute Changes
  useEffect(() => {
    const targetVol = isMuted ? 0 : volume * getEffectiveMultiplier();
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(targetVol, audioContextRef.current.currentTime, 0.05);
    }
    if (audioRef.current) {
      audioRef.current.volume = targetVol;
    }
  }, [volume, isMuted, duckingControlMode, manualPreset, debouncedSpeaking]);

  if (!isOpen) return null;

  // Seek Slider Change
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = parseFloat(e.target.value);

    checkPermissionAndRun(() => {
      setCurrentTime(val);
      if (audioRef.current) {
        audioRef.current.currentTime = val;
      }
    });
  };

  // Safe & Crash-Proof Multi-File Upload Handler for Batch Local MP3 files
  const importMp3FilesFromDevice = async () => {
    if (!hasControlPermission) {
      if (onToastNotification) {
        onToastNotification('عذراً، صلاحيات التشغيل والتحكم بالموسيقى محصورة بـ (صاحب الغرفة والمشرفين) فقط 🔒');
      }
      return;
    }

    try {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    } catch (err) {
      console.error('خطأ أثناء فتح مستعرض ملفات الـ MP3:', err);
      if (onToastNotification) {
        onToastNotification('تعذر فتح المستعرض، يرجى التأكد من منح صلاحيات الوصول للذاكرة ⚠️');
      }
    }
  };

  // Import entire music folder / directory directly from device phone storage
  const importFolderFromDevice = async () => {
    if (!hasControlPermission) {
      if (onToastNotification) {
        onToastNotification('عذراً، صلاحيات التشغيل والتحكم بالموسيقى محصورة بـ (صاحب الغرفة والمشرفين) فقط 🔒');
      }
      return;
    }

    try {
      if (folderInputRef.current) {
        folderInputRef.current.value = '';
        folderInputRef.current.click();
      }
    } catch (err) {
      console.error('خطأ أثناء فتح مستعرض المجلدات بالهاتف:', err);
      if (onToastNotification) {
        onToastNotification('تعذر فتح مجلدات الهاتف، يرجى التأكد من منح صلاحيات الوصول للذاكرة ⚠️');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const inputTarget = e.target;
    const files = inputTarget.files;
    if (!files || files.length === 0) return;

    // Convert FileList to array without clearing inputTarget.value prematurely
    const rawFiles: File[] = Array.from(files);

    checkPermissionAndRun(async () => {
      try {
        // Filter strictly for MP3 files (.mp3 extension or audio/mpeg MIME type)
        const mp3Files = rawFiles.filter((file) => {
          if (!file) return false;
          const fileName = (file.name || '').toLowerCase();
          const mimeType = (file.type || '').toLowerCase();
          const isMp3Extension = fileName.endsWith('.mp3');
          const isMp3Mime = mimeType === 'audio/mpeg' || mimeType === 'audio/mp3' || mimeType === 'audio/x-mp3' || mimeType === 'audio/x-mpeg' || mimeType.includes('mpeg');
          return isMp3Extension || isMp3Mime;
        });

        if (mp3Files.length === 0) {
          if (onToastNotification) {
            onToastNotification('يرجى اختيار ملفات بصيغة MP3 فقط (.mp3) ⚠️');
          }
          return;
        }

        // Deduplication logic: exclude songs that already exist in the library or within current batch
        const existingTitles = new Set<string>();
        playlist.forEach((track) => {
          if (track.title) {
            existingTitles.add(track.title.trim().toLowerCase());
          }
        });
        if (globalPlaylistCache) {
          globalPlaylistCache.forEach((track) => {
            if (track.title) {
              existingTitles.add(track.title.trim().toLowerCase());
            }
          });
        }

        const fileList: File[] = [];
        const seenInBatch = new Set<string>();
        let skippedDuplicateCount = 0;

        for (const file of mp3Files) {
          const rawName = file.name || '';
          const cleanTitle = (rawName.substring(0, rawName.lastIndexOf('.')) || rawName).trim().toLowerCase();
          
          if (!cleanTitle) continue;

          // Strictly check against existing library titles or duplicates inside the same selected batch
          if (existingTitles.has(cleanTitle) || seenInBatch.has(cleanTitle)) {
            skippedDuplicateCount++;
            continue; // Completely prevent and skip duplicate files
          }

          seenInBatch.add(cleanTitle);
          fileList.push(file);
        }

        if (fileList.length === 0) {
          if (onToastNotification) {
            onToastNotification('جميع الأغاني المختارة موجودة مسبقاً في مكتبة الروم ولن يتم إعادتها ⚠️');
          }
          return;
        }

        if (skippedDuplicateCount > 0 && onToastNotification) {
          onToastNotification(`تم استبعاد ${skippedDuplicateCount} أغنية مكررة وموجودة مسبقاً في مكتبة الروم 🚫`);
        }

        const newTracks: TrackItem[] = [];

        setUploadProgress({
          isUploading: true,
          current: 0,
          total: fileList.length,
          fileName: 'جاري بدء قراءة الملفات...',
        });

        if (onToastNotification) {
          onToastNotification(`جاري إضافة ${fileList.length} مقطع صوتي... ⏳`);
        }

        for (let idx = 0; idx < fileList.length; idx++) {
          const file = fileList[idx] as File;
          try {
            const rawName = file.name || `أغنية محليّة ${idx + 1}`;
            const cleanTitle = rawName.substring(0, rawName.lastIndexOf('.')) || rawName;

            setUploadProgress({
              isUploading: true,
              current: idx + 1,
              total: fileList.length,
              fileName: cleanTitle,
            });

            // Yield execution to main thread for UI updates
            await new Promise((r) => setTimeout(r, 10));

            let audioUrl = '';
            let fileBlob: Blob | null = null;
            try {
              // Read 100% complete file ArrayBuffer from device memory
              const arrayBuffer = await file.arrayBuffer();
              fileBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
              audioUrl = URL.createObjectURL(fileBlob);
            } catch (blobErr) {
              console.warn('URL.createObjectURL failed for file:', file.name, blobErr);
            }

            if (audioUrl && fileBlob) {
              // Try extracting exact audio duration metadata
              let exactDuration = 0;
              try {
                exactDuration = await new Promise<number>((resolve) => {
                  const probeAudio = new Audio(audioUrl);
                  const timer = setTimeout(() => resolve(0), 1000);
                  probeAudio.onloadedmetadata = () => {
                    clearTimeout(timer);
                    if (probeAudio.duration && isFinite(probeAudio.duration) && probeAudio.duration > 0) {
                      resolve(Math.round(probeAudio.duration));
                    } else {
                      resolve(0);
                    }
                  };
                  probeAudio.onerror = () => {
                    clearTimeout(timer);
                    resolve(0);
                  };
                });
              } catch {
                exactDuration = 0;
              }

              const duration = exactDuration > 0
                ? exactDuration
                : Math.max(30, Math.min(1800, Math.round((file.size || 3000000) / 16000)));

              const trackId = `rom-mp3-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`;

              const storedItem: StoredRomMp3Item = {
                id: trackId,
                title: cleanTitle.substring(0, 50),
                artist: 'ذاكرة الروم المحفوظة 📱',
                duration,
                blob: fileBlob,
                coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300',
                addedAt: Date.now(),
              };

              // Persist permanently into dedicated ROM IndexedDB storage
              await saveRomMp3ToIndexedDB(storedItem);

              newTracks.push({
                id: trackId,
                title: cleanTitle.substring(0, 50),
                artist: 'ذاكرة الروم المحفوظة 📱',
                duration,
                src: audioUrl,
                coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=300',
                isCustom: true,
              });
            }
          } catch (singleFileErr) {
            console.error('Error reading individual audio file:', file, singleFileErr);
          }
        }

        if (newTracks.length > 0) {
          setPlaylist((prev) => {
            const updated = [...newTracks, ...prev];
            globalPlaylistCache = updated;
            return updated;
          });
          setShowPlaylist(true);

          if (onToastNotification) {
            onToastNotification(`تم حفظ ${newTracks.length} أغنية بذاكرة الروم وإضافتها للقائمة بنجاح 🎶`);
          }
        } else {
          if (onToastNotification) {
            onToastNotification('تعذر قراءة الملفات الصوتية المخزنة، يرجى المحاولة بملفات أخرى ⚠️');
          }
        }
      } catch (globalErr) {
        console.error('Crash prevention in handleFileUpload:', globalErr);
        if (onToastNotification) {
          onToastNotification('حدث خطأ أثناء تحميل الملفات المحلية ⚠️');
        }
      } finally {
        setUploadProgress({
          isUploading: false,
          current: 0,
          total: 0,
          fileName: '',
        });
        // Safely reset file input ONLY after processing completes
        if (inputTarget) {
          inputTarget.value = '';
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    });
  };

  // Remove Song from Playlist and ROM IndexedDB Storage
  const handleDeleteSong = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    checkPermissionAndRun(() => {
      deleteRomMp3FromIndexedDB(id);
      const updated = playlist.filter((t) => t.id !== id);
      if (updated.length === 0) {
        if (audioRef.current) audioRef.current.pause();
        setIsPlaying(false);
      } else if (playlist[currentTrackIndex]?.id === id) {
        setCurrentTrackIndex(0);
      }
      setPlaylist(updated);
      globalPlaylistCache = updated;
      setSelectedTrackIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (onToastNotification) onToastNotification('تم حذف الأغنية من ذاكرة الروم 🗑️');
    });
  };

  // Toggle selection for a single track
  const handleToggleSelectTrack = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle select all / deselect all
  const handleSelectAllTracks = () => {
    if (selectedTrackIds.size === filteredPlaylist.length && filteredPlaylist.length > 0) {
      setSelectedTrackIds(new Set());
    } else {
      setSelectedTrackIds(new Set(filteredPlaylist.map((t) => t.id)));
    }
  };

  // Play or add selected tracks to room music player
  const handlePlaySelectedTracks = () => {
    if (selectedTrackIds.size === 0) {
      if (onToastNotification) {
        onToastNotification('يرجى تحديد أغنية واحدة على الأقل من القائمة ⚠️');
      }
      return;
    }

    checkPermissionAndRun(() => {
      const selectedIdsArray = Array.from(selectedTrackIds);
      const firstSelectedId = selectedIdsArray[0];
      const targetIndex = playlist.findIndex((t) => t.id === firstSelectedId);

      if (targetIndex !== -1) {
        setCurrentTrackIndex(targetIndex);
        setIsPlaying(true);
        if (audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
        if (onToastNotification) {
          onToastNotification(`تم تحديد وإضافة ${selectedTrackIds.size} أغنية للتشغيل في الروم 🎶`);
        }
      }
    });
  };

  // Format time in mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <>
      {/* Hidden File Input for Batch Local MP3 files */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,audio/mpeg,audio/mp3,audio/x-mp3,audio/x-mpeg"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Hidden Folder Input for Entire Music Directory / Folder from Phone Storage */}
      <input
        ref={folderInputRef}
        type="file"
        accept=".mp3,audio/mpeg,audio/mp3,audio/x-mp3,audio/x-mpeg"
        {...({ webkitdirectory: '', directory: '' } as any)}
        multiple
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      {/* Screen Constraints Boundary Overlay */}
      <div
        ref={musicScreenConstraintsRef}
        className="fixed inset-3 z-50 pointer-events-none select-none"
        dir="rtl"
        aria-hidden="true"
      />

      <AnimatePresence mode="wait">
        {/* Floating Draggable Container */}
        {isMinimized ? (
          /* MINIMIZED CIRCULAR CD FLOATING WIDGET (TOP LEFT POSITION) */
          <motion.div
            key="minimized-music-disc"
            drag
            dragConstraints={musicScreenConstraintsRef}
            dragMomentum={false}
            dragElastic={0}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            style={{ touchAction: 'none', willChange: 'transform' }}
            className="fixed top-5 left-5 z-50 pointer-events-auto group select-none transform-gpu flex items-center cursor-grab active:cursor-grabbing"
          >
            {/* Spinning Circular Vinyl CD Disc */}
            <div 
              className="relative w-16 h-16 rounded-full border-2 border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.5)] bg-slate-950 flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105"
            >
              {/* Spinning Track Cover Art */}
              <img
                src={currentTrack?.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300'}
                alt={currentTrack?.title}
                className={`w-full h-full object-cover rounded-full pointer-events-none ${isPlaying ? 'animate-spin' : ''}`}
                style={{ animationDuration: '4s' }}
              />

              {/* Vinyl Groove Lines & Realistic Shine Overlay */}
              <div className="absolute inset-0 rounded-full border-[3px] border-black/40 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.5)_75%,rgba(0,0,0,0.85)_100%)]" />

              {/* Center Spindle Hole with Disc Icon / Pulse Indicator */}
              <div className="absolute w-5 h-5 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-lg z-10 pointer-events-none">
                {isPlaying ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                ) : (
                  <Disc className="w-3 h-3 text-amber-400" />
                )}
              </div>

              {/* Hover Quick Action Controls Overlay */}
              <div 
                className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-1 z-20"
                onPointerDown={(e) => e.stopPropagation()}
              >
                {/* Play / Pause Toggle */}
                <button
                  onClick={togglePlayPause}
                  className="p-1 rounded-full bg-amber-500 text-slate-950 hover:scale-110 active:scale-90 transition-transform cursor-pointer font-bold shadow-md relative"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                >
                  {isPlaying ? <Pause className="w-3 h-3 fill-slate-950" /> : <Play className="w-3 h-3 fill-slate-950 ml-0.5" />}
                  {!hasControlPermission && (
                    <Lock className="w-2 h-2 text-rose-500 absolute -top-0.5 -right-0.5 bg-slate-950 rounded-full p-0.2" />
                  )}
                </button>

                {/* Expand Button */}
                <button
                  onClick={() => setIsMinimized(false)}
                  className="p-1 rounded-full bg-slate-800 text-amber-300 border border-amber-500/50 hover:scale-110 active:scale-90 transition-transform cursor-pointer shadow-md"
                  title="توسيع القائمة"
                >
                  <Maximize2 className="w-3 h-3" />
                </button>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1 rounded-full bg-rose-500/80 text-white hover:bg-rose-600 hover:scale-110 active:scale-90 transition-transform cursor-pointer shadow-md"
                  title="إغلاق المشغل"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Song Title & Role Tooltip on Hover */}
            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2.5 py-1 bg-[#0F1422]/95 text-amber-300 text-[10px] font-black rounded-xl border border-amber-500/40 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-xl dir-rtl flex flex-col gap-0.5">
              <span>{currentTrack?.title || 'الموسيقى'}</span>
              {!hasControlPermission && (
                <span className="text-[8.5px] text-rose-300 flex items-center gap-1 font-extrabold">
                  <Lock className="w-2.5 h-2.5 shrink-0" />
                  <span>وضع الاستماع (التحكم للمشرف)</span>
                </span>
              )}
            </div>
          </motion.div>
        ) : (
          /* FULL COMPACT DRAGGABLE FLOATING PLAYER CARD (FLOATING OVERLAY) */
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 pointer-events-none select-none">
            <motion.div
              key="full-compact-music-player"
              drag
              dragConstraints={musicScreenConstraintsRef}
              dragMomentum={false}
              dragElastic={0}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ touchAction: 'none', willChange: 'transform' }}
              className="pointer-events-auto w-full max-w-[290px] bg-[#0D1322] text-white rounded-2xl shadow-[0_0_35px_rgba(245,158,11,0.35)] border-2 border-amber-500/40 overflow-hidden flex flex-col select-none transform-gpu cursor-grab active:cursor-grabbing"
            >
            {/* Header Bar: Simplified with Drag handle, Music Note button, AGC badge, Popover Gear, Minimize & Close */}
            <div 
              className="bg-[#151D31] border-b border-white/10 px-2.5 py-1.5 flex items-center justify-between shrink-0 touch-none select-none"
            >
              {/* Left Side: Drag handle, Music note button, AGC indicator */}
              <div className="flex items-center gap-1.5 min-w-0">
                <GripHorizontal className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                
                {/* Music Icon button - toggles settings popover */}
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    setShowDuckingPopover(!showDuckingPopover);
                    if (showPlaylist) setShowPlaylist(false);
                  }}
                  className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shadow-sm font-bold shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title="إعدادات الصوت والموسيقى"
                >
                  <Music className="w-3 h-3" />
                </button>

                {/* Tiny AGC Badge */}
                <span className="flex items-center gap-0.5 text-[8.5px] font-extrabold text-amber-300 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20 shrink-0" title="محرّك الدمج الصوتي AGC">
                  <Radio className="w-2 h-2 animate-pulse text-amber-400" />
                  <span>AGC</span>
                </span>

                {!hasControlPermission && (
                  <span title="وضع الاستماع فقط">
                    <Lock className="w-2.5 h-2.5 text-rose-400 shrink-0" />
                  </span>
                )}
              </div>

              {/* Right Side: Playlist button, Gear button (ترس), Minimize, Close */}
              <div className="flex items-center gap-1 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
                {/* Playlist Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowPlaylist(true);
                    setShowDuckingPopover(false);
                  }}
                  className={`p-1 rounded-md transition-all cursor-pointer border ${
                    showPlaylist
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xs'
                      : 'bg-white/10 hover:bg-amber-500/20 text-slate-300 border-white/5'
                  }`}
                  title="فتح قائمة الأغاني والمقاطع"
                >
                  <ListMusic className="w-3 h-3" />
                </button>

                {/* Options Gear Button */}
                <button
                  type="button"
                  onClick={() => {
                    setShowDuckingPopover(!showDuckingPopover);
                  }}
                  className={`p-1 rounded-md transition-all cursor-pointer border ${
                    showDuckingPopover
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-xs'
                      : 'bg-white/10 hover:bg-amber-500/20 text-slate-300 border-white/5'
                  }`}
                  title="خيارات المشغل وتوازن الصوت"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                </button>

                {/* Minimize Button */}
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-md bg-white/10 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer border border-white/5"
                  title="تصغير المصغر"
                >
                  <Minimize2 className="w-3 h-3" />
                </button>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-md bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer border border-white/5"
                  title="إغلاق المشغل"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div 
              className="p-2 space-y-2"
            >
              {/* Main Compact Player Display Card */}
              <div className="relative bg-gradient-to-b from-[#182136] to-[#0D121F] border border-amber-500/30 rounded-xl p-2 shadow-lg overflow-hidden">
                {/* Glowing Background Radial */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* FLOATING SMART DUCKING & OPTIONS POPOVER DROPDOWN PANEL */}
                <AnimatePresence>
                  {showDuckingPopover && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="absolute inset-x-1.5 top-1.5 z-40 bg-[#0E1526] border-2 border-amber-500/50 rounded-xl p-2.5 shadow-2xl space-y-2 dir-rtl"
                    >
                      {/* Popover Header */}
                      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-black text-amber-300">
                          <Mic className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>توازن الصوت وقائمة الأغاني</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowDuckingPopover(false)}
                          className="p-0.5 rounded bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
                          title="إغلاق القائمة"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Option 1: Open Standalone Playlist Modal */}
                      <button
                        type="button"
                        onClick={() => {
                          setShowPlaylist(true);
                          setShowDuckingPopover(false);
                        }}
                        className="w-full py-1.5 px-2.5 rounded-lg text-[10px] font-black transition-all cursor-pointer flex items-center justify-between border bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/25 active:scale-98"
                      >
                        <span className="flex items-center gap-1.5">
                          <ListMusic className="w-3.5 h-3.5 text-amber-400" />
                          <span>فتح قائمة الأغاني والرفع ({playlist.length})</span>
                        </span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                          القائمة
                        </span>
                      </button>

                      {/* Mode Switch: Auto vs Manual */}
                      <div className="flex items-center justify-between bg-slate-950/90 p-0.5 rounded-lg border border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            checkPermissionAndRun(() => {
                              setDuckingControlMode('auto');
                              if (onToastNotification) {
                                onToastNotification('تم التبديل للوضع التلقائي الذكي (Smart Auto Ducking) ⚡');
                              }
                            });
                          }}
                          className={`flex-1 py-1 px-1.5 rounded-md text-[9.5px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            duckingControlMode === 'auto'
                              ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Bot className="w-3 h-3" />
                          <span>تلقائي ذكي</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            checkPermissionAndRun(() => {
                              setDuckingControlMode('manual');
                              if (onToastNotification) {
                                onToastNotification('تم التبديل للوضع اليدوي الثابت 🎛️');
                              }
                            });
                          }}
                          className={`flex-1 py-1 px-1.5 rounded-md text-[9.5px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            duckingControlMode === 'manual'
                              ? 'bg-amber-500 text-slate-950 shadow-md scale-[1.02]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Hand className="w-3 h-3" />
                          <span>يدوي</span>
                        </button>
                      </div>

                      {/* Mode Specific Options */}
                      {duckingControlMode === 'auto' ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[9px] font-bold text-slate-300">
                            <span className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                              <span>نسبة الخفض الأوتوماتيكي:</span>
                            </span>
                            <span className="font-mono text-[8px] text-amber-300 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/20">
                              {debouncedSpeaking ? 'نشط 🎙️' : 'جاهز 🎧'}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                checkPermissionAndRun(() => {
                                  setAutoDuckingLevel('mild');
                                  if (onToastNotification) {
                                    onToastNotification('تم ضبط الخفض الأوتوماتيكي على "هادئ - 15%" 🍃');
                                  }
                                });
                              }}
                              className={`py-1 px-0.5 rounded-lg text-[9px] font-black transition-all cursor-pointer flex items-center justify-center gap-0.5 border ${
                                autoDuckingLevel === 'mild'
                                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm scale-[1.02]'
                                  : 'bg-slate-900/90 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                              }`}
                            >
                              <Volume2 className="w-3 h-3 shrink-0" />
                              <span>هادئ (15%)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                checkPermissionAndRun(() => {
                                  setAutoDuckingLevel('balanced');
                                  if (onToastNotification) {
                                    onToastNotification('تم ضبط الخفض الأوتوماتيكي على "متوازن - 35%" ⚖️');
                                  }
                                });
                              }}
                              className={`py-1 px-0.5 rounded-lg text-[9px] font-black transition-all cursor-pointer flex items-center justify-center gap-0.5 border ${
                                autoDuckingLevel === 'balanced'
                                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm scale-[1.02]'
                                  : 'bg-slate-900/90 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                              }`}
                            >
                              <Volume1 className="w-3 h-3 shrink-0" />
                              <span>متوازن (35%)</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                checkPermissionAndRun(() => {
                                  setAutoDuckingLevel('strong');
                                  if (onToastNotification) {
                                    onToastNotification('تم ضبط الخفض الأوتوماتيكي على "قوي - 70%" ⚡');
                                  }
                                });
                              }}
                              className={`py-1 px-0.5 rounded-lg text-[9px] font-black transition-all cursor-pointer flex items-center justify-center gap-0.5 border ${
                                autoDuckingLevel === 'strong'
                                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm scale-[1.02]'
                                  : 'bg-slate-900/90 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                              }`}
                            >
                              <Zap className="w-3 h-3 shrink-0" />
                              <span>قوي (70%)</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="text-[9px] font-bold text-amber-300">
                            التحكم اليدوي المباشر بمستوى الموسيقى:
                          </div>

                          <div className="grid grid-cols-3 gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                checkPermissionAndRun(() => {
                                  const next = manualPreset === '70' ? 'off' : '70';
                                  setManualPreset(next);
                                  if (onToastNotification) {
                                    onToastNotification(
                                      next === '70' ? 'تم خفض الموسيقى يدويّاً لـ 70% 🔉' : 'إعادة الموسيقى للمستوى الطبيعي 100% 🔊'
                                    );
                                  }
                                });
                              }}
                              className={`py-1 px-0.5 rounded-lg text-[9px] font-black transition-all cursor-pointer flex items-center justify-center gap-0.5 border ${
                                manualPreset === '70'
                                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm scale-[1.02]'
                                  : 'bg-slate-900/90 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                              }`}
                            >
                              <Volume2 className="w-3 h-3 shrink-0" />
                              <span>مستوى 70%</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                checkPermissionAndRun(() => {
                                  const next = manualPreset === '40' ? 'off' : '40';
                                  setManualPreset(next);
                                  if (onToastNotification) {
                                    onToastNotification(
                                      next === '40' ? 'تم خفض الموسيقى يدويّاً لـ 40% 🔉' : 'إعادة الموسيقى للمستوى الطبيعي 100% 🔊'
                                    );
                                  }
                                });
                              }}
                              className={`py-1 px-0.5 rounded-lg text-[9px] font-black transition-all cursor-pointer flex items-center justify-center gap-0.5 border ${
                                manualPreset === '40'
                                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm scale-[1.02]'
                                  : 'bg-slate-900/90 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                              }`}
                            >
                              <Volume1 className="w-3 h-3 shrink-0" />
                              <span>مستوى 40%</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                checkPermissionAndRun(() => {
                                  const next = manualPreset === '20' ? 'off' : '20';
                                  setManualPreset(next);
                                  if (onToastNotification) {
                                    onToastNotification(
                                      next === '20' ? 'تم خفض الموسيقى يدويّاً لـ 20% 🔉' : 'إعادة الموسيقى للمستوى الطبيعي 100% 🔊'
                                    );
                                  }
                                });
                              }}
                              className={`py-1 px-0.5 rounded-lg text-[9px] font-black transition-all cursor-pointer flex items-center justify-center gap-0.5 border ${
                                manualPreset === '20'
                                  ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-sm scale-[1.02]'
                                  : 'bg-slate-900/90 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                              }`}
                            >
                              <Zap className="w-3 h-3 shrink-0" />
                              <span>مستوى 20%</span>
                            </button>
                          </div>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowDuckingPopover(false)}
                        className="w-full py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[9.5px] font-black rounded-lg border border-white/10 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>إغلاق القائمة (X)</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Compact Player Horizontal Row: Album Cover (shrunk 50%) + Title + Mini Equalizer */}
                <div className="relative flex items-center justify-between gap-2">
                  {/* Album Cover Vinyl: Shrunk 50% from w-16 h-16 to w-8 h-8 */}
                  <div className="relative w-8 h-8 shrink-0 rounded-lg overflow-hidden border border-amber-400/60 shadow-sm">
                    <img
                      src={currentTrack?.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300'}
                      alt={currentTrack?.title}
                      className={`w-full h-full object-cover ${isPlaying ? 'scale-110' : ''}`}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Disc className={`w-4 h-4 text-white/90 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
                    </div>
                  </div>

                  {/* Single Line Track Title & Equalizer */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-[11px] font-extrabold text-white truncate dir-rtl flex-1" title={currentTrack?.title}>
                        {currentTrack?.title || 'لا توجد أغانٍ'}
                      </h4>

                      <span className="px-1 py-0.2 bg-amber-500/20 text-amber-300 rounded text-[8px] font-black border border-amber-500/30 shrink-0">
                        {currentTrack?.isCustom ? 'محلي' : 'عينة'}
                      </span>
                    </div>

                    {/* Equalizer Wave Bars */}
                    <div className="flex items-center gap-0.5 h-2">
                      {[40, 70, 30, 90, 50, 80, 60, 100].map((h, i) => (
                        <span
                          key={i}
                          className={`w-0.5 bg-gradient-to-t from-amber-500 to-yellow-300 rounded-full transition-all duration-150 ${
                            isPlaying ? 'animate-pulse' : 'opacity-30'
                          }`}
                          style={{
                            height: isPlaying ? `${(h * (i % 2 === 0 ? 0.8 : 1))}%` : '20%',
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* SEEK BAR & COMPRESSED TIMERS (Height reduced by 30%) */}
                <div className="mt-1.5 space-y-0.5" onPointerDown={(e) => e.stopPropagation()}>
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeekChange}
                    disabled={!hasControlPermission}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`w-full h-1 bg-slate-800 rounded-lg appearance-none accent-amber-400 ${
                      hasControlPermission ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                    }`}
                  />
                  <div className="flex items-center justify-between text-[8.5px] font-mono font-bold text-slate-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* COMPRESSED AUDIO CONTROLS TOOLBAR (Buttons reduced by ~25%) */}
                <div className="mt-1 flex items-center justify-between pt-1 border-t border-white/10" onPointerDown={(e) => e.stopPropagation()}>
                  {/* Shuffle Button */}
                  <button
                    onClick={() => {
                      checkPermissionAndRun(() => setIsShuffle(!isShuffle));
                    }}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      isShuffle ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                    title="تشغيل عشوائي"
                  >
                    <Shuffle className="w-3 h-3" />
                  </button>

                  {/* Main Playback Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevTrack}
                      className="p-0.5 text-slate-200 hover:text-amber-400 transition-colors cursor-pointer active:scale-90 relative"
                      title="الأغنية السابقة"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={togglePlayPause}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer font-black relative"
                      title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-slate-950" /> : <Play className="w-3.5 h-3.5 fill-slate-950 ml-0.5" />}
                      {!hasControlPermission && (
                        <Lock className="w-2.5 h-2.5 text-rose-500 absolute -top-0.5 -right-0.5 bg-slate-950 rounded-full p-0.2 shadow-sm" />
                      )}
                    </button>

                    <button
                      onClick={handleNextTrack}
                      className="p-0.5 text-slate-200 hover:text-amber-400 transition-colors cursor-pointer active:scale-90 relative"
                      title="الأغنية التالية"
                    >
                      <SkipBack className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Loop Repeat Button */}
                  <button
                    onClick={() => {
                      checkPermissionAndRun(() => setIsRepeat(!isRepeat));
                    }}
                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                      isRepeat ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'text-slate-400 hover:text-white'
                    }`}
                    title="تكرار الأغنية"
                  >
                    <Repeat className="w-3 h-3" />
                  </button>
                </div>

                {/* COMPRESSED SLIM VOLUME SLIDER BAR */}
                <div className="mt-1 flex items-center gap-1.5 bg-slate-900/60 px-1.5 py-1 rounded-lg border border-white/5" onPointerDown={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => {
                      checkPermissionAndRun(() => setIsMuted(!isMuted));
                    }}
                    className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    {isMuted || volume === 0 ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-amber-400" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    disabled={!hasControlPermission}
                    onChange={(e) => {
                      checkPermissionAndRun(() => {
                        setIsMuted(false);
                        setVolume(parseFloat(e.target.value));
                      });
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`flex-1 h-0.5 bg-slate-800 rounded-lg appearance-none accent-amber-400 ${
                      hasControlPermission ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                    }`}
                  />
                  <span className="text-[8.5px] font-mono text-slate-400 w-5 text-left">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
        )}
      </AnimatePresence>

      {/* STANDALONE SEPARATE PLAYLIST POPUP MODAL */}
        <AnimatePresence>
          {showPlaylist && (
            <div 
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-transparent dir-rtl select-none pointer-events-auto"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPlaylist(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-[#0E1526] border-2 border-amber-500/50 rounded-2xl p-4 sm:p-5 text-white shadow-[0_0_50px_rgba(245,158,11,0.4)] space-y-3.5 max-h-[85vh] flex flex-col pointer-events-auto"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 shrink-0 dir-rtl">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md">
                      <ListMusic className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-amber-300 flex items-center gap-1.5">
                        <span>مكتبة الأغاني المحفوظة والمستوردة 🎵</span>
                      </h3>
                      <p className="text-[11px] text-slate-300 font-medium">
                        إجمالي الأغاني: <span className="text-amber-400 font-bold">{playlist.length}</span> | اضغط على أي أغنية للتشغيل المباشر
                      </p>
                    </div>
                  </div>

                  {/* Close Button (X) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPlaylist(false);
                    }}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer border border-white/5 active:scale-95"
                    title="إغلاق النافذة"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Actions Bar: Upload MP3 & Search Input */}
                <div className="space-y-2 shrink-0 dir-rtl">
                  {/* Upload Actions: Entire Folder or Multiple MP3 Files */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        importFolderFromDevice();
                      }}
                      className={`py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-[11px] shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 border border-amber-300 cursor-pointer ${
                        hasControlPermission ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'
                      }`}
                      title="فتح مجلدات ذاكرة الهاتف واختيار مجلد أغانٍ كامل"
                    >
                      <FolderOpen className="w-4 h-4 shrink-0" />
                      <span className="truncate">استيراد مجلد كامل 📁</span>
                      {!hasControlPermission && <Lock className="w-3.5 h-3.5 text-slate-950 shrink-0" />}
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        importMp3FilesFromDevice();
                      }}
                      className={`py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-[11px] shadow-sm hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 border border-amber-500/30 cursor-pointer ${
                        hasControlPermission ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'
                      }`}
                      title="اختيار مقاطع MP3 متعددة من الذاكرة"
                    >
                      <Upload className="w-4 h-4 shrink-0" />
                      <span className="truncate">اختيار مقاطع متعددة 🎵</span>
                      {!hasControlPermission && <Lock className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="بحث في القائمة المحفوظة..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-slate-950/80 border border-white/10 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/60 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSearchQuery('');
                        }}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Selection Action Bar (تحديد الكل + إضافة المحددة للروم) */}
                  <div className="flex items-center justify-between gap-2 bg-slate-950/90 p-2 rounded-xl border border-amber-500/30 text-xs">
                    <button
                      type="button"
                      onClick={handleSelectAllTracks}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer text-[11px]"
                    >
                      {selectedTrackIds.size === filteredPlaylist.length && filteredPlaylist.length > 0 ? (
                        <>
                          <CheckSquare className="w-3.5 h-3.5 text-amber-400" />
                          <span>إلغاء التحديد ({selectedTrackIds.size})</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-3.5 h-3.5 text-amber-400" />
                          <span>تحديد الكل ({filteredPlaylist.length})</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handlePlaySelectedTracks}
                      disabled={selectedTrackIds.size === 0}
                      className={`px-3 py-1.5 rounded-lg font-black text-[11px] transition-all flex items-center gap-1.5 border shadow-sm ${
                        selectedTrackIds.size > 0
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300 hover:brightness-110 active:scale-95 cursor-pointer'
                          : 'bg-slate-900 text-slate-500 border-white/5 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>إضافة المحددة للروم ({selectedTrackIds.size})</span>
                    </button>
                  </div>
                </div>

                {/* Saved Track List Scroll Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 p-1.5 bg-slate-950/50 rounded-xl border border-white/5 min-h-[220px]">
                  {filteredPlaylist.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-xs space-y-2">
                      <Music className="w-8 h-8 text-slate-600 mx-auto opacity-50" />
                      <p>لا توجد أغانٍ تطابق البحث</p>
                    </div>
                  ) : (
                    filteredPlaylist.map((track) => {
                      const originalIndex = playlist.findIndex((t) => t.id === track.id);
                      const isNowPlaying = originalIndex === currentTrackIndex;
                      const isSelected = selectedTrackIds.has(track.id);

                      return (
                        <div
                          key={track.id}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleSelectTrack(track.id);
                          }}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 select-none ${
                            isNowPlaying
                              ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-black shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                              : isSelected
                              ? 'bg-amber-500/10 border-amber-500/40 text-white'
                              : 'bg-[#141B2B] hover:bg-[#1A2B42] border-white/5 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {/* Checkbox Selector */}
                            <button
                              type="button"
                              onClick={(e) => handleToggleSelectTrack(track.id, e)}
                              className="p-1 text-amber-400 hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
                              title={isSelected ? 'إلغاء التحديد' : 'تحديد'}
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-amber-400" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-500" />
                              )}
                            </button>

                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10">
                              <img src={track.coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300'} alt={track.title} className="w-full h-full object-cover" />
                              {isNowPlaying && isPlaying && (
                                <div className="absolute inset-0 bg-amber-500/60 flex items-center justify-center">
                                  <Music className="w-4 h-4 text-slate-950 animate-bounce" />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className={`text-xs font-bold truncate dir-rtl flex items-center gap-1.5 ${isNowPlaying ? 'text-amber-300' : 'text-white'}`}>
                                <span className="truncate">{track.title}</span>
                                {track.isCustom && (
                                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30 font-medium shrink-0">
                                    ذاكرة الروم 📱
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate">
                                {track.artist}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Play Icon */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                checkPermissionAndRun(() => {
                                  setCurrentTrackIndex(originalIndex);
                                  setIsPlaying(true);
                                  if (audioRef.current) {
                                    audioRef.current.play().catch(() => {});
                                  }
                                  if (onToastNotification) {
                                    onToastNotification(`جاري تشغيل: ${track.title} 🎵`);
                                  }
                                });
                              }}
                              className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 rounded-lg transition-colors cursor-pointer"
                              title="تشغيل هذه الأغنية"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>

                            {track.isCustom && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDeleteSong(track.id, e);
                                }}
                                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                                title="حذف الأغنية"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md border border-white/5">
                              {formatTime(track.duration)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Modal Footer */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0 dir-rtl">
                  <span className="text-[11px] text-slate-400">
                    اضغط على أي أغنية للتشغيل المباشر ✨
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPlaylist(false);
                    }}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-xl border border-white/10 text-xs font-bold cursor-pointer transition-colors active:scale-95"
                  >
                    إغلاق
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* BATCH MULTI-FILE UPLOAD PROGRESS OVERLAY BANNER */}
        <AnimatePresence>
          {uploadProgress.isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-[#0E1526] border-2 border-amber-500/80 text-white rounded-2xl p-4 shadow-[0_0_50px_rgba(245,158,11,0.5)] flex flex-col gap-2.5 min-w-[300px] max-w-sm pointer-events-auto dir-rtl"
            >
              <div className="flex items-center justify-between text-xs font-black text-amber-300">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                  <span>جاري معالجة الأغاني ({uploadProgress.current} / {uploadProgress.total}) 🎵</span>
                </span>
                <span className="font-mono text-[11px] bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30 text-amber-200">
                  {Math.round((uploadProgress.current / Math.max(1, uploadProgress.total)) * 100)}%
                </span>
              </div>

              {/* Progress Bar Track */}
              <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-white/10 p-0.5">
                <motion.div
                  className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 h-full rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.round((uploadProgress.current / Math.max(1, uploadProgress.total)) * 100)}%`,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>

              <p className="text-[11px] text-slate-300 truncate font-mono text-center">
                📁 {uploadProgress.fileName}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
    </>
  );
};
