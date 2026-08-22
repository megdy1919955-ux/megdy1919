import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Music,
  Volume2,
  Sparkles,
  Save,
  Trash2,
  Check,
  Globe,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  Coins,
  ShieldCheck,
  Zap,
  Film,
  Eye,
  SlidersHorizontal,
  CheckCircle2,
  Tv
} from 'lucide-react';
import {
  GiftItem,
  GIFT_SOUND_PRESETS,
  GIFT_TEST_VIDEO_PRESETS,
  GiftTestVideoPreset,
  playGiftAudioEffect,
  saveOrUpdateGift,
  addNewGift,
  deleteGift,
  isWebMVideo,
  isVideoResource,
  isMediaUrl,
  getCleanGiftEmoji
} from '../lib/giftCmsService';
import { tempMediaCacheManager } from '../lib/tempMediaCacheManager';
import { persistentMediaStorage } from '../lib/persistentMediaStorage';

interface GiftEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  giftToEdit?: GiftItem | null; // Null means creating a new gift
  defaultCategory?: GiftItem['category'];
  onSaved?: (gift: GiftItem) => void;
  onDeleted?: (giftId: string) => void;
}

const CATEGORIES: Array<GiftItem['category']> = [
  'الفعالية',
  'رائج',
  'استرداد',
  'الدولة/المنطقة',
  'مخصصة',
  'الامتيازات',
  'مداعبة'
];

export const GiftEditorModal: React.FC<GiftEditorModalProps> = ({
  isOpen,
  onClose,
  giftToEdit,
  defaultCategory = 'الفعالية',
  onSaved,
  onDeleted
}) => {
  const isEditing = Boolean(giftToEdit);

  // Form State - strictly isolated per gift
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(1000);
  const [category, setCategory] = useState<GiftItem['category']>(defaultCategory);
  const [subCategory, setSubCategory] = useState<string>('');
  const [badge, setBadge] = useState<string>('');
  const [icon, setIcon] = useState<string>('🎁');
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [mediaSourceType, setMediaSourceType] = useState<'upload' | 'url'>('upload');
  
  // Sound effect state
  const [hasSound, setHasSound] = useState<boolean>(true);
  const [soundPreset, setSoundPreset] = useState<GiftItem['soundPreset']>('fanfare');
  const [soundUrl, setSoundUrl] = useState<string>('');
  const [soundVolume, setSoundVolume] = useState<number>(0.85);
  const [soundSourceType, setSoundSourceType] = useState<'preset' | 'upload' | 'url'>('preset');

  // Broadcast & Features
  const [hasGlobalBroadcast, setHasGlobalBroadcast] = useState<boolean>(false);
  const [isLucky, setIsLucky] = useState<boolean>(false);

  // Position, Scale, Blend Mode & Live Placement Calibration
  const [placement, setPlacement] = useState<'center' | 'top' | 'mics' | 'bottom' | 'fullscreen'>('center');
  const [renderLayer, setRenderLayer] = useState<'behind_mics' | 'above_mics'>('behind_mics');
  const [displayPosition, setDisplayPosition] = useState<'above' | 'below' | 'center'>('center');
  const [scale, setScale] = useState<number>(1.0);
  const [blendMode, setBlendMode] = useState<'screen' | 'lighten' | 'normal'>('screen');
  const [durationSeconds, setDurationSeconds] = useState<number>(5.5);

  // Interactive Live Preview State
  const [previewMode, setPreviewMode] = useState<'room' | 'transparent'>('room');
  const [isSimulatingEntrance, setIsSimulatingEntrance] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [simulatedParticles, setSimulatedParticles] = useState<Array<{ id: number; x: number; y: number; scale: number }>>([]);
  
  // Status feedback
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSuccessBadge, setShowSuccessBadge] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [persistentStorageStatus, setPersistentStorageStatus] = useState<string | null>(null);

  // Staged files for direct persistent device storage
  const [stagedMediaFile, setStagedMediaFile] = useState<File | Blob | null>(null);
  const [stagedSoundFile, setStagedSoundFile] = useState<File | Blob | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const soundFileInputRef = useRef<HTMLInputElement | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  // Strictly Initialize / Reset state whenever modal opens or giftToEdit changes
  useEffect(() => {
    if (isOpen) {
      setStagedMediaFile(null);
      setStagedSoundFile(null);
      setPersistentStorageStatus(null);

      if (giftToEdit) {
        setName(giftToEdit.name || '');
        setPrice(giftToEdit.price || 1000);
        setCategory(giftToEdit.category || defaultCategory);
        setSubCategory(giftToEdit.subCategory || '');
        setBadge(giftToEdit.badge || '');
        setIcon(giftToEdit.icon || '🎁');
        setVideoUrl(giftToEdit.videoUrl || '');

        if (giftToEdit.mediaKey || giftToEdit.isCustomUploaded) {
          setPersistentStorageStatus('محفوظ في الذاكرة الدائمة للجهاز 📱');
        }

        // Determine if uploaded or url
        const activeSrc = giftToEdit.videoUrl || giftToEdit.icon || '';
        if (activeSrc.startsWith('data:') || activeSrc.startsWith('blob:') || giftToEdit.isCustomUploaded || giftToEdit.mediaKey) {
          setMediaSourceType('upload');
        } else if (activeSrc.startsWith('http://') || activeSrc.startsWith('https://')) {
          setMediaSourceType('url');
        } else {
          setMediaSourceType('upload');
        }

        setHasSound(giftToEdit.hasSound !== undefined ? giftToEdit.hasSound : true);
        setSoundPreset(giftToEdit.soundPreset || 'fanfare');
        setSoundUrl(giftToEdit.soundUrl || '');
        setSoundVolume(giftToEdit.soundVolume !== undefined ? giftToEdit.soundVolume : 0.85);
        setSoundSourceType(giftToEdit.soundUrl ? (giftToEdit.soundUrl.startsWith('data:audio') || giftToEdit.soundUrl.startsWith('blob:') || giftToEdit.soundMediaKey ? 'upload' : 'url') : 'preset');

        setHasGlobalBroadcast(Boolean(giftToEdit.hasGlobalBroadcast));
        setIsLucky(Boolean(giftToEdit.isLucky));

        setPlacement(giftToEdit.placement || 'center');
        setRenderLayer(giftToEdit.renderLayer || 'behind_mics');
        setDisplayPosition(giftToEdit.displayPosition || (giftToEdit.placement === 'top' ? 'above' : giftToEdit.placement === 'bottom' ? 'below' : 'center'));
        setScale(giftToEdit.scale || 1.0);
        setBlendMode(giftToEdit.blendMode || 'screen');
        setDurationSeconds(giftToEdit.durationSeconds || 5.5);
      } else {
        // Adding a new gift
        setName('هدية أسطورية جديدة ✨');
        setPrice(5000);
        setCategory(defaultCategory);
        setSubCategory('');
        setBadge('جديد');
        setIcon('🎁');
        setVideoUrl('');
        setMediaSourceType('upload');
        setHasSound(true);
        setSoundPreset('fanfare');
        setSoundUrl('');
        setSoundVolume(0.85);
        setSoundSourceType('preset');
        setHasGlobalBroadcast(true);
        setIsLucky(false);

        setPlacement('center');
        setRenderLayer('behind_mics');
        setDisplayPosition('center');
        setScale(1.0);
        setBlendMode('screen');
        setDurationSeconds(5.5);
      }
      setErrorMessage(null);
      setShowSuccessBadge(false);
      setIsSimulatingEntrance(false);
      setSimulatedParticles([]);
    }
  }, [isOpen, giftToEdit, defaultCategory]);

  if (!isOpen) return null;

  const currentMediaSrc = videoUrl || icon;
  const isWebM = isWebMVideo(currentMediaSrc);
  const isVideo = isVideoResource(currentMediaSrc);
  const isImg = !isVideo && isMediaUrl(currentMediaSrc);

  // Handle Transparent WebM video or Image file upload with immediate FileReader & Storage
  const handleMediaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-uploading the same file works every time
    e.target.value = '';

    // Check size limit (max 30MB)
    if (file.size > 30 * 1024 * 1024) {
      setErrorMessage('حجم الملف كبير جداً. الحد الأقصى هو 30 ميجابايت.');
      return;
    }

    try {
      const isVideoFile = file.type.startsWith('video/') || file.name.endsWith('.webm') || file.name.endsWith('.mp4') || file.name.endsWith('.mov') || file.name.endsWith('.m4v');
      
      // 1. Create instant Object URL for zero-delay preview
      const instantBlobUrl = URL.createObjectURL(file);
      if (isVideoFile) {
        setVideoUrl(instantBlobUrl);
        setIcon(instantBlobUrl);
      } else {
        setIcon(instantBlobUrl);
        setVideoUrl('');
      }
      setMediaSourceType('upload');
      setErrorMessage(null);

      // 2. Read as Data URL or save to IndexedDB permanently
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataResult = event.target?.result as string;
        if (dataResult) {
          if (isVideoFile) {
            setVideoUrl(dataResult);
            setIcon(dataResult);
          } else {
            setIcon(dataResult);
            setVideoUrl('');
          }
          const mbSize = (file.size / (1024 * 1024)).toFixed(2);
          setPersistentStorageStatus(`تم حفظ الفيديو بنجاح 💾 (${mbSize} MB)`);
        }
      };
      reader.onerror = () => {
        // Fallback to instant blob URL if FileReader fails
        const mbSize = (file.size / (1024 * 1024)).toFixed(2);
        setPersistentStorageStatus(`تم تجهيز الفيديو بنجاح (${mbSize} MB)`);
      };

      // For files <= 20MB, convert to data URL for permanent offline portability
      if (file.size <= 20 * 1024 * 1024) {
        reader.readAsDataURL(file);
      } else {
        const mbSize = (file.size / (1024 * 1024)).toFixed(2);
        setPersistentStorageStatus(`تم تجهيز الفيديو بنجاح (${mbSize} MB)`);
      }

      // Also persist to persistent device vault
      const targetMediaKey = giftToEdit?.mediaKey || `media_gift_${giftToEdit?.id || Date.now()}_video`;
      persistentMediaStorage.saveMediaBlob(targetMediaKey, file, file.name).catch(() => {});
    } catch (err) {
      console.error('File upload error:', err);
      setErrorMessage('حدث خطأ أثناء قراءة ملف الفيديو. يرجى المحاولة مرة أخرى.');
    }
  };

  // Handle custom audio file upload
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-uploading works every time
    e.target.value = '';

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('حجم ملف الصوت كبير جداً. الحد الأقصى هو 15 ميجابايت.');
      return;
    }

    try {
      const instantAudioUrl = URL.createObjectURL(file);
      setSoundUrl(instantAudioUrl);
      setSoundSourceType('upload');
      setHasSound(true);
      setErrorMessage(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataResult = event.target?.result as string;
        if (dataResult) {
          setSoundUrl(dataResult);
        }
      };
      if (file.size <= 10 * 1024 * 1024) {
        reader.readAsDataURL(file);
      }

      const targetSoundKey = giftToEdit?.soundMediaKey || `media_gift_${giftToEdit?.id || Date.now()}_sound`;
      persistentMediaStorage.saveMediaBlob(targetSoundKey, file, file.name).catch(() => {});
    } catch {
      setErrorMessage('فشل في قراءة ملف الصوت.');
    }
  };

  // Test sound effect playback
  const handleTestAudio = () => {
    setIsPlayingAudio(true);
    const mockGift: GiftItem = {
      id: 'test_preview',
      name,
      price,
      icon,
      videoUrl,
      category,
      hasSound: true,
      soundUrl: soundSourceType !== 'preset' ? soundUrl : undefined,
      soundPreset: soundSourceType === 'preset' ? soundPreset : undefined,
      soundVolume
    };
    playGiftAudioEffect(mockGift);
    setTimeout(() => setIsPlayingAudio(false), 1600);
  };

  // Run Room Entrance Simulation with animation and sound
  const handleSimulateEntrance = () => {
    setIsSimulatingEntrance(true);
    
    // Play audio effect
    if (hasSound) {
      handleTestAudio();
    }

    // Generate spark particles
    const newParticles = Array.from({ length: 16 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 160,
      y: (Math.random() - 0.5) * 120,
      scale: 0.6 + Math.random() * 0.8
    }));
    setSimulatedParticles(newParticles);

    // If video element is available, restart from time 0
    if (videoPreviewRef.current) {
      videoPreviewRef.current.currentTime = 0;
      videoPreviewRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      setIsSimulatingEntrance(false);
      setSimulatedParticles([]);
    }, 2800);
  };

  // Apply one of the test video presets
  const handleApplyTestPreset = (preset: GiftTestVideoPreset) => {
    setName(preset.name);
    setVideoUrl(preset.videoUrl);
    setIcon(preset.videoUrl);
    setPlacement(preset.placement);
    setScale(preset.scale);
    setBlendMode(preset.blendMode);
    setSoundPreset(preset.soundPreset);
    setHasSound(true);
    setSoundSourceType('preset');
    setMediaSourceType('url');
  };

  // Test placement and full video animation directly in the Live Room
  const handleTestInLiveRoom = () => {
    const testGift: GiftItem = {
      id: giftToEdit ? giftToEdit.id : `test_${Date.now()}`,
      name: name.trim() || 'هدية تجريبية 🎯',
      price: Number(price) || 1000,
      category,
      subCategory: subCategory.trim() || undefined,
      badge: badge.trim() || undefined,
      icon: (videoUrl || icon).trim() || '🎁',
      videoUrl: videoUrl.trim() || undefined,
      hasSound,
      soundUrl: hasSound && soundSourceType !== 'preset' && soundUrl.trim() ? soundUrl.trim() : undefined,
      soundPreset: hasSound && soundSourceType === 'preset' ? soundPreset : undefined,
      soundVolume,
      hasGlobalBroadcast,
      isLucky,
      placement,
      renderLayer,
      displayPosition,
      scale,
      blendMode,
      durationSeconds
    };

    window.dispatchEvent(
      new CustomEvent('test_gift_in_room', {
        detail: { gift: testGift }
      })
    );

    // Also run simulated entrance in the modal preview box
    handleSimulateEntrance();
  };

  // Save changes to Server & Device Storage
  const handleSave = async () => {
    if (!name.trim()) {
      setErrorMessage('يرجى كتابة اسم الهدية.');
      return;
    }
    if (price < 0) {
      setErrorMessage('سعر الهدية يجب أن يكون رقماً موجباً.');
      return;
    }

    setIsSaving(true);
    const targetGiftId = giftToEdit ? giftToEdit.id : `gift_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const targetMediaKey = giftToEdit?.mediaKey || `media_${targetGiftId}_video`;
    const targetSoundKey = giftToEdit?.soundMediaKey || `media_${targetGiftId}_sound`;

    try {
      // 1. If user staged a new video/image file, persist it into phone IndexedDB vault
      if (stagedMediaFile) {
        await persistentMediaStorage.saveMediaBlob(targetMediaKey, stagedMediaFile);
      }

      // 2. If user staged a new audio file, persist it into phone IndexedDB vault
      if (stagedSoundFile) {
        await persistentMediaStorage.saveMediaBlob(targetSoundKey, stagedSoundFile);
      }

      const giftData: GiftItem = {
        id: targetGiftId,
        name: name.trim(),
        price: Number(price),
        category,
        subCategory: subCategory.trim() || undefined,
        badge: badge.trim() || undefined,
        icon: (videoUrl || icon).trim() || '🎁',
        videoUrl: videoUrl.trim() || undefined,
        mediaKey: (isVideo || mediaSourceType === 'upload') ? targetMediaKey : giftToEdit?.mediaKey,
        soundMediaKey: (hasSound && soundSourceType === 'upload') ? targetSoundKey : giftToEdit?.soundMediaKey,
        hasSound,
        soundUrl: hasSound && soundSourceType !== 'preset' && soundUrl.trim() ? soundUrl.trim() : undefined,
        soundPreset: hasSound && soundSourceType === 'preset' ? soundPreset : undefined,
        soundVolume,
        hasGlobalBroadcast,
        isLucky,
        placement,
        renderLayer,
        displayPosition,
        scale,
        blendMode,
        durationSeconds,
        isCustomUploaded: mediaSourceType === 'upload',
        updatedAt: Date.now()
      };

      if (isEditing) {
        saveOrUpdateGift(giftData);
      } else {
        addNewGift(giftData);
      }

      setShowSuccessBadge(true);
      setIsSaving(false);

      if (onSaved) {
        onSaved(giftData);
      }

      setTimeout(() => {
        setShowSuccessBadge(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Save failed:', err);
      setErrorMessage('حدث خطأ أثناء حفظ الهدية في ذاكرة الجهاز.');
      setIsSaving(false);
    }
  };

  // Delete Gift
  const handleDelete = () => {
    if (!giftToEdit) return;
    if (window.confirm(`هل أنت متأكد من حذف الهدية "${giftToEdit.name}" نهائياً من ذاكرة الهاتف والمتجر؟`)) {
      if (giftToEdit.mediaKey) {
        persistentMediaStorage.deleteMedia(giftToEdit.mediaKey).catch(() => {});
      }
      if (giftToEdit.soundMediaKey) {
        persistentMediaStorage.deleteMedia(giftToEdit.soundMediaKey).catch(() => {});
      }
      deleteGift(giftToEdit.id);
      if (onDeleted) {
        onDeleted(giftToEdit.id);
      }
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 pointer-events-auto cursor-default select-none"
      dir="rtl"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#0B101D] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden text-white max-h-[94vh] flex flex-col pointer-events-auto relative"
      >
        {/* ================= TOP HEADER ================= */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-gradient-to-r from-[#0C172E] via-[#101F3D] to-[#0C172E] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  {isEditing ? `إدارة وتعديل الهدية: ${name}` : 'إضافة هدية جديدة بالكامل (+)'}
                </h3>
                <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                  <span>CMS Studio</span>
                </span>
              </div>
              <p className="text-[10.5px] text-slate-300">
                معاينة حية فورية، دعم Transparent WebM عالي الشفافية والتحكم الكامل بالصوتيات
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= SCROLLABLE CONTENT ================= */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {/* Error Message */}
          {errorMessage && (
            <div className="p-2.5 bg-red-950/80 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          <AnimatePresence>
            {showSuccessBadge && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black rounded-2xl text-xs text-center shadow-lg flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>تم حفظ التغييرات ونشرها وتحديث السيرفر لجميع المتواجدين بنجاح! ✨</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ================= 1. LIVE PREVIEW THEATER (شاشة المعاينة الحية التفاعلية) ================= */}
          <div className="bg-gradient-to-b from-[#11192E] to-[#0A101F] border border-cyan-500/40 rounded-3xl p-3.5 shadow-xl space-y-3 relative overflow-hidden">
            {/* Header of Preview Theater */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-black text-cyan-200">
                  شاشة المعاينة الحية (Live Stage Preview)
                </span>
                <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                  {isWebM ? '🎬 Transparent WebM' : isVideo ? '🎥 Video' : '🖼️ Graphic / Animation'}
                </span>
              </div>

              {/* Background mode toggle: Room vs Transparency Checkerboard */}
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-white/10 text-[9.5px]">
                <button
                  type="button"
                  onClick={() => setPreviewMode('room')}
                  className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    previewMode === 'room'
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🌌 خلفية الروم
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode('transparent')}
                  className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    previewMode === 'transparent'
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏁 فحص الشفافية
                </button>
              </div>
            </div>

            {/* Interactive Visual Stage Canvas */}
            <div
              className={`relative h-44 rounded-2xl overflow-hidden flex items-center justify-center border transition-all ${
                previewMode === 'room'
                  ? 'bg-gradient-to-b from-[#080E1C] via-[#0D152A] to-[#070B16] border-cyan-500/30 shadow-inner'
                  : 'bg-[radial-gradient(#22304d_1px,transparent_1px)] bg-[size:12px_12px] bg-[#0A0E18] border-white/20'
              }`}
            >
              {/* Simulated Room Header Banner in Preview */}
              {hasGlobalBroadcast && isSimulatingEntrance && (
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -30, opacity: 0 }}
                  className="absolute top-2 left-2 right-2 z-30 bg-gradient-to-r from-pink-950/90 via-purple-900/90 to-cyan-950/90 border border-pink-400/50 rounded-xl px-2.5 py-1 text-[10px] text-center text-pink-200 shadow-lg flex items-center justify-between"
                >
                  <span className="font-extrabold flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-pink-400 animate-spin-slow" />
                    <span>إشعار عام: تم إرسال {name} 👑</span>
                  </span>
                  <span className="font-mono text-amber-300 font-black">{price.toLocaleString()} 🪙</span>
                </motion.div>
              )}

              {/* Spark particles during entrance simulation */}
              {isSimulatingEntrance &&
                simulatedParticles.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0.2, p.scale * 1.4, 0],
                      x: p.x,
                      y: p.y
                    }}
                    transition={{ duration: 1.8, ease: 'easeOut' }}
                    className="absolute z-20 pointer-events-none"
                  >
                    <div className="p-1 rounded-full bg-amber-400/30 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">
                      <Zap className="w-3 h-3 fill-current" />
                    </div>
                  </motion.div>
                ))}

              {/* Main Gift Media Item in Stage */}
              <motion.div
                animate={
                  isSimulatingEntrance
                    ? {
                        scale: [0.2, 1.25, 1.05],
                        rotate: [0, -6, 6, 0],
                        opacity: [0, 1, 1]
                      }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center justify-center max-w-[80%] max-h-[85%]"
              >
                {/* Transparent WebM or Video Playback */}
                {isVideo ? (
                  <div className="relative flex items-center justify-center">
                    <video
                      ref={videoPreviewRef}
                      src={currentMediaSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-h-36 max-w-full object-contain pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                    />
                  </div>
                ) : isImg ? (
                  <img
                    src={currentMediaSrc}
                    alt={name}
                    className="max-h-32 max-w-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)] filter transition-transform hover:scale-105"
                  />
                ) : (
                  <div className="text-6xl drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] filter select-none">
                    {getCleanGiftEmoji(name, icon)}
                  </div>
                )}

                {/* Badge Overlay */}
                {badge && (
                  <span className="absolute -top-1 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-md border border-amber-300/40">
                    {badge}
                  </span>
                )}
              </motion.div>

              {/* Floating Bottom Metadata Badge */}
              <div className="absolute bottom-2 right-2 left-2 z-20 flex items-center justify-between pointer-events-none px-1">
                <div className="bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 text-[10px] font-bold text-slate-200 flex items-center gap-2">
                  <span>{name || 'بدون اسم'}</span>
                  <span className="text-amber-300 font-mono font-black">{price.toLocaleString()} 🪙</span>
                </div>
                {hasSound && (
                  <div className="bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-xl border border-white/10 text-[9.5px] text-cyan-300 flex items-center gap-1 font-bold">
                    <Volume2 className="w-3 h-3 text-cyan-400" />
                    <span>{Math.round(soundVolume * 100)}%</span>
                  </div>
                )}
              </div>
            </div>

            {/* Stage Action Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={handleTestInLiveRoom}
                className="w-full sm:flex-1 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 active:scale-98 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-300/40"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>🚀 تجربة واختبار موقع الهدية في الروم فوراً (Live Room Test)</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleSimulateEntrance}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-cyan-500 to-blue-500 hover:brightness-110 active:scale-98 text-slate-950 font-black text-xs py-2.5 px-3 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>محاكاة في الصندوق</span>
                </button>

                {hasSound && (
                  <button
                    type="button"
                    onClick={handleTestAudio}
                    className={`px-3 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all border ${
                      isPlayingAudio
                        ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 animate-pulse'
                        : 'bg-white/5 text-slate-200 border-white/10 hover:bg-white/10'
                    }`}
                    title="استماع للصوت فقط"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isPlayingAudio ? 'عزف...' : 'الصوت'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ================= 1.5. PLACEMENT & SCALE CALIBRATION (معايرة موضع وحجم الهدية في الروم) ================= */}
          <div className="p-3.5 bg-[#11192E] border border-amber-500/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-black text-amber-300">
                  معايرة موضع وطبقة ومسار الهدية في الروم (Layer, Position & Scale)
                </span>
              </div>
              <span className="text-[10px] text-amber-200/80 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/20 font-bold">
                تحكم دقيق وشامل
              </span>
            </div>

            {/* 1. LAYER SELECTOR (خلف المايكات والشات أو فوق المايكات) */}
            <div className="space-y-1.5 p-2.5 bg-slate-950/70 border border-cyan-500/30 rounded-xl">
              <label className="text-[11px] font-bold text-cyan-300 flex items-center justify-between">
                <span>🎭 طبقة ومسار عرض الهدية في الروم (Render Layer):</span>
                <span className="text-cyan-400 font-mono text-[10px] font-black">
                  {renderLayer === 'behind_mics'
                    ? 'خلف المايكات وخلف الشات (فوق الخلفية مباشرة)'
                    : 'فوق المايكات (Top Overlay Layer)'}
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRenderLayer('behind_mics')}
                  className={`p-2.5 rounded-xl text-right transition-all cursor-pointer border flex items-start gap-2.5 ${
                    renderLayer === 'behind_mics'
                      ? 'bg-gradient-to-r from-cyan-950 to-blue-950 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400'
                      : 'bg-slate-900/90 border-white/5 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">🌌</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-cyan-200 flex items-center justify-between">
                      <span>خلف المايكات وخلف الشات</span>
                      {renderLayer === 'behind_mics' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </div>
                    <div className="text-[9.5px] text-slate-400 leading-relaxed mt-0.5">
                      تظهر الهدية ومسارها خلف المايكات والشات وفوق خلفية الروم (لا تحجب عناصر الروم)
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRenderLayer('above_mics')}
                  className={`p-2.5 rounded-xl text-right transition-all cursor-pointer border flex items-start gap-2.5 ${
                    renderLayer === 'above_mics'
                      ? 'bg-gradient-to-r from-amber-950 to-orange-950 border-amber-400 text-white shadow-lg ring-1 ring-amber-400'
                      : 'bg-slate-900/90 border-white/5 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">👑</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-black text-amber-200 flex items-center justify-between">
                      <span>فوق المايكات (طبقة علوية)</span>
                      {renderLayer === 'above_mics' && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <div className="text-[9.5px] text-slate-400 leading-relaxed mt-0.5">
                      تظهر الهدية فوق المايكات والشات كطبقة تأثير سينمائية بارزة في الواجهة
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. DISPLAY POSITION (موضع الظهور عند الإدراج: فوق أو تحت أو بالوسط) */}
            <div className="space-y-1.5 p-2.5 bg-slate-950/70 border border-amber-500/30 rounded-xl">
              <label className="text-[11px] font-bold text-amber-300 flex items-center justify-between">
                <span>📍 موضع الظهور عند إدراج الهدية (Vertical Position):</span>
                <span className="text-amber-400 font-mono text-[10px] font-black">
                  {displayPosition === 'above'
                    ? 'فوق (أعلى الروم فوق المقاعد)'
                    : displayPosition === 'below'
                    ? 'تحت (أسفل الروم فوق الشات/شريط التحكم)'
                    : 'بالوسط (مركز الشاشة)'}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    id: 'above',
                    placementVal: 'top',
                    label: 'فوق ⬆️',
                    desc: 'أعلى المقاعد',
                    icon: '⬆️'
                  },
                  {
                    id: 'center',
                    placementVal: 'center',
                    label: 'بالوسط 🎯',
                    desc: 'منتصف الروم',
                    icon: '🎯'
                  },
                  {
                    id: 'below',
                    placementVal: 'bottom',
                    label: 'تحت ⬇️',
                    desc: 'أسفل الروم',
                    icon: '⬇️'
                  }
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => {
                      setDisplayPosition(pos.id as any);
                      setPlacement(pos.placementVal as any);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border ${
                      displayPosition === pos.id
                        ? 'bg-gradient-to-b from-amber-500 to-orange-500 text-slate-950 border-amber-300 shadow-md scale-102 font-black'
                        : 'bg-slate-900 border-white/5 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-base">{pos.icon}</span>
                    <span className="text-[11px] whitespace-nowrap">{pos.label}</span>
                    <span className="text-[8.5px] opacity-75">{pos.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Placement Fine Tuning Selector */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span>🎯 معايرة المنطقة التفصيلية في الروم:</span>
                <span className="text-amber-400 font-mono text-[10px] font-black">
                  {placement === 'center'
                    ? 'وسط الروم (Center)'
                    : placement === 'top'
                    ? 'أعلى الروم (Top)'
                    : placement === 'mics'
                    ? 'حول المايكات (Mics Area)'
                    : placement === 'bottom'
                    ? 'أسفل الروم (Bottom)'
                    : 'شاشة كاملة (Fullscreen)'}
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {[
                  { id: 'center', label: 'وسط الروم', icon: '🎯' },
                  { id: 'mics', label: 'حول المايكات', icon: '🎙️' },
                  { id: 'top', label: 'فوق المقاعد', icon: '⬆️' },
                  { id: 'bottom', label: 'أسفل الروم', icon: '⬇️' },
                  { id: 'fullscreen', label: 'ملء الشاشة', icon: '📺' }
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => {
                      setPlacement(pos.id as any);
                      if (pos.id === 'top') setDisplayPosition('above');
                      else if (pos.id === 'bottom') setDisplayPosition('below');
                      else if (pos.id === 'center') setDisplayPosition('center');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center gap-1 border ${
                      placement === pos.id
                        ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-102'
                        : 'bg-slate-950 border-white/5 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span className="text-sm">{pos.icon}</span>
                    <span className="text-[10px] whitespace-nowrap">{pos.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scale Slider and Quick Presets */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span>🔍 مقياس وحجم الفيديو (Scale):</span>
                <span className="text-cyan-400 font-mono font-black">{scale.toFixed(2)}x</span>
              </div>
              <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-white/5">
                <input
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="flex-1 accent-amber-400 cursor-pointer"
                />
                <div className="flex items-center gap-1">
                  {[0.8, 1.0, 1.25, 1.5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setScale(s)}
                      className={`px-1.5 py-0.5 rounded text-[9.5px] font-mono font-black transition-colors ${
                        scale === s ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Blend Mode & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {/* Blend Mode */}
              <div className="space-y-1">
                <label className="text-[10.5px] font-bold text-slate-300">🎨 نمط دمج الشفافية (Blend Mode):</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: 'screen', label: 'Screen (دمج ذكي)' },
                    { id: 'lighten', label: 'Lighten (إضاءة)' },
                    { id: 'normal', label: 'Normal (أصلي)' }
                  ].map((bm) => (
                    <button
                      key={bm.id}
                      type="button"
                      onClick={() => setBlendMode(bm.id as any)}
                      className={`py-1.5 px-1 rounded-lg text-[10px] font-black transition-all cursor-pointer border ${
                        blendMode === bm.id
                          ? 'bg-purple-600 text-white border-purple-400 shadow'
                          : 'bg-slate-950 border-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {bm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-300">
                  <span>⏱️ مدة بقاء الفيديو في الروم:</span>
                  <span className="text-amber-400 font-mono font-black">{durationSeconds}s</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-white/5">
                  <input
                    type="range"
                    min="3.0"
                    max="12.0"
                    step="0.5"
                    value={durationSeconds}
                    onChange={(e) => setDurationSeconds(parseFloat(e.target.value))}
                    className="flex-1 accent-amber-400 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= 1.7. QUICK TEST VIDEO PRESETS (نماذج فيديوهات جاهزة للاختبار الفوري) ================= */}
          <div className="p-3.5 bg-[#11192E] border border-cyan-500/20 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-white/5">
              <label className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                <Film className="w-4 h-4 text-cyan-400" />
                <span>نماذج فيديوهات وتأثيرات جاهزة للاختبار بنقرة واحدة:</span>
              </label>
              <span className="text-[10px] text-cyan-400 font-medium">اختر نموذج لتجربته فوراً</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {GIFT_TEST_VIDEO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyTestPreset(preset)}
                  className={`p-2 rounded-xl text-right flex items-center gap-2 border transition-all cursor-pointer group ${
                    videoUrl === preset.videoUrl
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                      : 'bg-slate-950 border-white/5 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-900'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10.5px] font-black text-slate-100 truncate">{preset.name}</div>
                    <div className="text-[9px] text-slate-400 truncate">{preset.placement} • {preset.scale}x</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ================= 2. CLEAN MEDIA UPLOAD (فقط خيارين مرتبين: رفع من الجوال أو ربط سحابي) ================= */}
          <div className="p-3.5 bg-[#11192E] border border-white/10 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-white/5">
              <label className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>طريقة رفع ملف الهدية (فيديو شفاف أو صورة حركة):</span>
              </label>

              {/* ONLY 2 CLEAN TABS */}
              <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-white/10 text-xs w-full sm:w-64">
                <button
                  type="button"
                  onClick={() => setMediaSourceType('upload')}
                  className={`py-1.5 px-2 rounded-lg font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mediaSourceType === 'upload'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>الرفع من الجوال</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaSourceType('url')}
                  className={`py-1.5 px-2 rounded-lg font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mediaSourceType === 'url'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>الربط السحابي</span>
                </button>
              </div>
            </div>

            {/* Option 1: Upload from Device / Mobile */}
            {mediaSourceType === 'upload' && (
              <div className="space-y-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 rounded-2xl p-5 text-center cursor-pointer transition-all space-y-2.5 shadow-inner group"
                >
                  <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform shadow-md">
                    <Film className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs sm:text-sm font-black text-slate-100">
                      {isWebM
                        ? '✅ تم اختيار وحفظ فيديو شفاف (Transparent WebM) في ذاكرة الهاتف'
                        : isVideo
                        ? '✅ تم اختيار وحفظ ملف فيديو في ذاكرة الهاتف'
                        : isImg
                        ? '✅ تم اختيار وحفظ ملف حركة/صورة في ذاكرة الهاتف'
                        : 'اضغط هنا لرفع فيديو شفاف أو حركة الهدية من جوالك'}
                    </div>
                    <div className="text-[10.5px] text-cyan-300/90 font-medium">
                      يدعم حصرياً: <strong className="text-cyan-200">Transparent WebM (شفافية فائقة وخفة تامة)</strong>، MP4، GIF متحرك، PNG، SVG (حتى 25MB)
                    </div>
                    {persistentStorageStatus && (
                      <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{persistentStorageStatus}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reassurance Offline Persistence Note */}
                <div className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-[10.5px] text-emerald-200">
                  <span className="text-sm">💾</span>
                  <span>
                    <strong>حفظ دائم في ذاكرة الجهاز:</strong> يتم تخزين ملفات الفيديو بالكامل في الذاكرة الدائمة للهاتف (IndexedDB Storage)، ولن تحتاج لإعادة إدخالها أو رفعها مرة ثانية!
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*,.webm,.mp4,.mov,.m4v,.mkv,.avi,.gif,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={handleMediaFileUpload}
                />
              </div>
            )}

            {/* Option 2: Direct Cloud URL */}
            {mediaSourceType === 'url' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-cyan-400 transition-colors">
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="https://cdn.example.com/gifts/lion-transparent.webm"
                    value={videoUrl || (icon.startsWith('http') ? icon : '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (isWebMVideo(val) || isVideoResource(val)) {
                        setVideoUrl(val);
                        setIcon(val);
                      } else {
                        setIcon(val);
                        setVideoUrl('');
                      }
                    }}
                    className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-400 block px-1">
                  ضع رابط CDN سحابي مباشر لملف فيديو شفاف بصيغة <strong>.webm</strong> أو رابط صورة GIF/PNG
                </span>
              </div>
            )}
          </div>

          {/* ================= 3. BASIC GIFT METADATA ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Gift Name */}
            <div className="p-3 bg-[#11192E] border border-white/10 rounded-2xl space-y-1.5">
              <label className="text-xs font-bold text-slate-200">اسم الهدية</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: الأسد الملكي 🦁"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Gift Price */}
            <div className="p-3 bg-[#11192E] border border-white/10 rounded-2xl space-y-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span>سعر الهدية (بالكوينز 🪙)</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-950 border border-amber-400/30 rounded-xl px-3 py-2 text-xs font-mono font-black text-amber-300 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Main Category */}
            <div className="p-3 bg-[#11192E] border border-white/10 rounded-2xl space-y-1.5">
              <label className="text-xs font-bold text-slate-200">الفئة الرئيسية</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GiftItem['category'])}
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-cyan-400 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-Category / Event Tag */}
            <div className="p-3 bg-[#11192E] border border-white/10 rounded-2xl space-y-1.5">
              <label className="text-xs font-bold text-slate-200">القسم الفرعي / الفعالية (اختياري)</label>
              <input
                type="text"
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                placeholder="مثال: حدث برج الاسد، رحلة رومانسية"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Badge Text */}
            <div className="p-3 bg-[#11192E] border border-white/10 rounded-2xl space-y-1.5">
              <label className="text-xs font-bold text-amber-300">شارة الهدية (Badge)</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="مثال: Top1, LV1, حظ, JACKPOT, برج الاسد"
                className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Lucky / Jackpot Toggle */}
            <div className="p-3 bg-[#11192E] border border-white/10 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-amber-300 block">هدية استرداد / حظ (Lucky)</span>
                <span className="text-[10px] text-slate-400">تتيح الفوز بالجاكبوت والمكافآت العشوائية</span>
              </div>
              <button
                type="button"
                onClick={() => setIsLucky(!isLucky)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer relative ${
                  isLucky ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    isLucky ? 'translate-x-0' : '-translate-x-5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* ================= 4. SOUND EFFECTS & AUDIO MANAGEMENT ================= */}
          <div className="p-3.5 bg-[#11192E] border border-purple-500/30 rounded-2xl space-y-3">
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-black text-purple-300">
                  التحكم بالتأثيرات الصوتية وملفات الصوت المدمجة
                </span>
              </div>

              {/* Sound Enable Toggle */}
              <button
                type="button"
                onClick={() => setHasSound(!hasSound)}
                className={`px-3 py-1 rounded-full text-[10px] font-black transition-colors cursor-pointer flex items-center gap-1 ${
                  hasSound ? 'bg-purple-600 text-white' : 'bg-white/10 text-slate-400'
                }`}
              >
                <Volume2 className="w-3 h-3" />
                <span>{hasSound ? 'مفعل ✓' : 'معطل'}</span>
              </button>
            </div>

            {hasSound && (
              <div className="space-y-3 pt-1">
                {/* Sound Source Selectors */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs">
                  <button
                    type="button"
                    onClick={() => setSoundSourceType('preset')}
                    className={`py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer ${
                      soundSourceType === 'preset'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    نغمات مدمجة
                  </button>

                  <button
                    type="button"
                    onClick={() => setSoundSourceType('upload')}
                    className={`py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer ${
                      soundSourceType === 'upload'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    رفع ملف صوتي
                  </button>

                  <button
                    type="button"
                    onClick={() => setSoundSourceType('url')}
                    className={`py-1.5 px-2 rounded-xl font-bold transition-all cursor-pointer ${
                      soundSourceType === 'url'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    رابط صوت مباشر
                  </button>
                </div>

                {/* Preset Sound Grid */}
                {soundSourceType === 'preset' && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto custom-scrollbar p-1">
                    {GIFT_SOUND_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSoundPreset(preset.id as any)}
                        className={`p-2 rounded-xl text-right flex items-center justify-between border transition-all cursor-pointer ${
                          soundPreset === preset.id
                            ? 'bg-purple-950/80 border-purple-400 text-white shadow-md'
                            : 'bg-slate-950 border-white/5 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{preset.icon}</span>
                          <span className="text-[10.5px] font-bold truncate">{preset.name}</span>
                        </div>
                        {soundPreset === preset.id && <Check className="w-3.5 h-3.5 text-purple-300 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Custom Audio Upload */}
                {soundSourceType === 'upload' && (
                  <div className="space-y-2">
                    <div
                      onClick={() => soundFileInputRef.current?.click()}
                      className="border border-dashed border-purple-500/40 hover:border-purple-400 bg-purple-950/20 rounded-xl p-3 text-center cursor-pointer transition-colors space-y-1"
                    >
                      <Volume2 className="w-5 h-5 text-purple-400 mx-auto" />
                      <div className="text-xs font-bold text-slate-200">
                        {soundUrl ? 'تم اختيار ملف الصوت بنجاح ✓ (انقر لتغييره)' : 'انقر لاختيار ملف صوتي (.mp3, .wav, .ogg)'}
                      </div>
                      <div className="text-[9px] text-slate-400">حجم أقصى 8MB</div>
                    </div>
                    <input
                      ref={soundFileInputRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={handleAudioFileUpload}
                    />
                  </div>
                )}

                {/* Custom Audio URL */}
                {soundSourceType === 'url' && (
                  <input
                    type="text"
                    placeholder="https://example.com/sound-effect.mp3"
                    value={soundUrl}
                    onChange={(e) => setSoundUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                )}

                {/* Audio Volume Slider */}
                <div className="flex items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-xl border border-white/5">
                  <span className="text-[11px] font-bold text-slate-300">مستوى الصوت:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={soundVolume}
                    onChange={(e) => setSoundVolume(parseFloat(e.target.value))}
                    className="flex-1 accent-purple-500 cursor-pointer"
                  />
                  <span className="text-[11px] font-mono font-bold text-purple-300 w-9 text-left">
                    {Math.round(soundVolume * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ================= 5. GLOBAL BROADCAST BANNER TOGGLE ================= */}
          <div className="p-3 bg-[#11192E] border border-white/10 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-100 block">إشعار البث العالمي للشاشات 🌐</span>
                <span className="text-[10px] text-slate-400">إظهار بانر علوي متحرك لجميع الغرف عند إرسال الهدية</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHasGlobalBroadcast(!hasGlobalBroadcast)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors cursor-pointer relative ${
                hasGlobalBroadcast ? 'bg-pink-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  hasGlobalBroadcast ? 'translate-x-0' : '-translate-x-5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ================= BOTTOM ACTION BAR ================= */}
        <div className="p-3.5 border-t border-white/10 bg-[#070A14] flex items-center justify-between gap-2 shrink-0">
          {/* Delete Button (If editing existing) */}
          {isEditing ? (
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-2.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>حذف الهدية</span>
            </button>
          ) : (
            <div />
          )}

          {/* Right Action buttons: Cancel & Save */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500 text-slate-950 font-black text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>حفظ وتحديث السيرفر الآن ✨</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
