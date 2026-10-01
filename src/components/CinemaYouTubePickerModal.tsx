import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Youtube,
  Play,
  Flame,
  Film,
  Music,
  Gamepad2,
  BookOpen,
  Sparkles,
  Tv,
  Link,
  Check,
  Lightbulb,
  Crown,
  Shield,
  Trash2,
  Send,
  User
} from 'lucide-react';

export interface CinemaVideoItem {
  id: string;
  title: string;
  youtubeId: string;
  channelTitle: string;
  thumbnailUrl: string;
  category: string;
  duration?: string;
}

export interface VideoSuggestion {
  id: string;
  video: CinemaVideoItem;
  suggestedBy: {
    userId: string;
    userName: string;
    avatar?: string;
    userRole: 'owner' | 'host' | 'moderator' | 'guest';
  };
  suggestedAt: string;
}

// Preset Curated YouTube Videos for instant 1-click room watch party / suggestions
const PRESET_YOUTUBE_VIDEOS: CinemaVideoItem[] = [
  {
    id: 'vid_1',
    title: 'توم وجيري ذكريات الطفولة الكلاسيكية - HD',
    youtubeId: 'k1-TrAvp_xs',
    channelTitle: 'Classic Animation',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
    category: 'animation',
    duration: '10:45'
  },
  {
    id: 'vid_2',
    title: 'روائع التلاوات القرآنية الخاشعة - راحة نفسية وهدوء',
    youtubeId: 'V1RPi2MYptM',
    channelTitle: 'القرآن الكريم للقلوب',
    thumbnailUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&q=80&w=400',
    category: 'quran',
    duration: '25:00'
  },
  {
    id: 'vid_3',
    title: 'أجمل أهداف ومهارات كرة القدم العالمية والمراوغات الخيالية',
    youtubeId: 'b-v3m_q52oA',
    channelTitle: 'Football Magic HD',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400',
    category: 'sports',
    duration: '12:20'
  },
  {
    id: 'vid_4',
    title: 'شيلات وموسيقى عربية هادئة وجلسات طرب راقية',
    youtubeId: '9No-FiEInLA',
    channelTitle: 'طرب وأصالة',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400',
    category: 'music',
    duration: '18:30'
  },
  {
    id: 'vid_5',
    title: 'أقوى مقالب ومواقف مضحكة 2026 - ضحك متواصل',
    youtubeId: 'eVli-tstM5E',
    channelTitle: 'كوميديا شو',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400',
    category: 'comedy',
    duration: '08:15'
  },
  {
    id: 'vid_6',
    title: 'أفضل لحظات لعبة ببجي موبايل وبثوث الألعاب الحماسية',
    youtubeId: 'dQw4w9WgXcQ',
    channelTitle: 'Gaming Masters',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400',
    category: 'gaming',
    duration: '14:50'
  },
  {
    id: 'vid_7',
    title: 'وثائقي أسرار الكون وعجائب الطبيعة بجودة 4K',
    youtubeId: 'EngW7tLk6R8',
    channelTitle: 'عالم المعرفة',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
    category: 'documentary',
    duration: '22:00'
  }
];

interface CinemaYouTubePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOwner: boolean;
  currentUserRole: 'owner' | 'host' | 'moderator' | 'guest';
  currentUserName: string;
  currentUserId: string;
  currentUserAvatar?: string;
  currentVideoId?: string;
  suggestions: VideoSuggestion[];
  onSelectVideo: (video: CinemaVideoItem) => void;
  onSuggestVideo: (
    video: CinemaVideoItem,
    suggester: {
      userId: string;
      userName: string;
      avatar?: string;
      userRole: 'owner' | 'host' | 'moderator' | 'guest';
    }
  ) => void;
  onAcceptSuggestion?: (suggestion: VideoSuggestion) => void;
  onDeleteSuggestion?: (suggestionId: string) => void;
  onTriggerToast?: (msg: string) => void;
}

// Utility to extract YouTube Video ID from any URL or raw ID
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const cleanInput = urlOrId.trim();

  // If already 11-char alphanumeric ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanInput)) {
    return cleanInput;
  }

  // Handle standard youtube.com or youtu.be URLs, Shorts, live streams
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/|live\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = cleanInput.match(regExp);
  return match ? match[1] : null;
}

export const CinemaYouTubePickerModal: React.FC<CinemaYouTubePickerModalProps> = ({
  isOpen,
  onClose,
  isOwner,
  currentUserRole,
  currentUserName,
  currentUserId,
  currentUserAvatar,
  currentVideoId,
  suggestions = [],
  onSelectVideo,
  onSuggestVideo,
  onAcceptSuggestion,
  onDeleteSuggestion,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'suggestions'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchResults, setSearchResults] = useState<CinemaVideoItem[]>([]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'الكل 🔥', icon: Flame },
    { id: 'movies', label: 'أفلام وسينما 🎬', icon: Film },
    { id: 'music', label: 'طرب وموسيقى 🎵', icon: Music },
    { id: 'comedy', label: 'كوميديا وضحك 😂', icon: Sparkles },
    { id: 'quran', label: 'قرآن وتلاوات 📖', icon: BookOpen },
    { id: 'gaming', label: 'جيمنج وألعاب 🎮', icon: Gamepad2 },
    { id: 'sports', label: 'رياضة وأهداف ⚽', icon: Tv },
  ];

  // Handle Pasting YouTube Link or Search ID
  const handleApplyCustomUrl = (e?: React.FormEvent) => {
    e?.preventDefault();
    const ytId = extractYouTubeId(customUrlInput);
    if (!ytId) {
      onTriggerToast?.('يرجى إدخال رابط يوتيوب صحيح أو كود الفيديو ⚠️');
      return;
    }

    const customVideo: CinemaVideoItem = {
      id: `custom_yt_${Date.now()}`,
      title: 'فيديو يوتيوب مخصص (رابط مباشر)',
      youtubeId: ytId,
      channelTitle: 'رابط مباشر',
      thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      category: 'custom',
      duration: 'Live / Video'
    };

    if (isOwner) {
      onSelectVideo(customVideo);
      onTriggerToast?.('تم تحديد وتشغيل فيديو يوتيوب في الروم 🎬🍿');
      onClose();
    } else {
      // Non-owner makes a suggestion
      onSuggestVideo(customVideo, {
        userId: currentUserId || 'guest_1',
        userName: currentUserName || 'عضو الغرفة',
        avatar: currentUserAvatar,
        userRole: currentUserRole
      });
      setCustomUrlInput('');
      onClose();
    }
  };

  // Filtered preset list based on search or category
  const filteredPresets = PRESET_YOUTUBE_VIDEOS.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channelTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handle Search Input (Simulates dynamic search results for any query)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // If search query is actually a youtube link
    const ytId = extractYouTubeId(searchQuery);
    if (ytId) {
      const customVideo: CinemaVideoItem = {
        id: `yt_search_${Date.now()}`,
        title: 'فيديو يوتيوب المشترك',
        youtubeId: ytId,
        channelTitle: 'قناة يوتيوب',
        thumbnailUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
        category: 'search'
      };
      if (isOwner) {
        onSelectVideo(customVideo);
        onTriggerToast?.('تم تشغيل الفيديو عبر الرابط بنجاح 🎬✨');
      } else {
        onSuggestVideo(customVideo, {
          userId: currentUserId,
          userName: currentUserName,
          avatar: currentUserAvatar,
          userRole: currentUserRole
        });
      }
      onClose();
      return;
    }

    const dynamicResults: CinemaVideoItem[] = [
      {
        id: `res_1_${Date.now()}`,
        title: `${searchQuery} - مقطع كامل عالي الدقة HD`,
        youtubeId: 'k1-TrAvp_xs',
        channelTitle: 'البحث المباشر',
        thumbnailUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=400',
        category: 'search'
      },
      {
        id: `res_2_${Date.now()}`,
        title: `أفضل لقطات ${searchQuery} حصرية وتفاعلية`,
        youtubeId: 'V1RPi2MYptM',
        channelTitle: 'يوتيوب العربي',
        thumbnailUrl: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&q=80&w=400',
        category: 'search'
      },
      {
        id: `res_3_${Date.now()}`,
        title: `${searchQuery} بث مباشر ومشاهدة جماعية`,
        youtubeId: '9No-FiEInLA',
        channelTitle: 'قناة البث',
        thumbnailUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=400',
        category: 'search'
      }
    ];
    setSearchResults(dynamicResults);
  };

  const handleVideoCardClick = (video: CinemaVideoItem) => {
    if (isOwner) {
      onSelectVideo(video);
      onTriggerToast?.(`تم تشغيل "${video.title}" في سينما الغرفة 🎬✨`);
      onClose();
    } else {
      onSuggestVideo(video, {
        userId: currentUserId,
        userName: currentUserName,
        avatar: currentUserAvatar,
        userRole: currentUserRole
      });
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-60 bg-transparent flex items-end sm:items-center justify-center p-0 sm:p-4 select-none cursor-default"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-lg bg-[#0F1423] border-t sm:border border-emerald-500/30 rounded-t-[32px] sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] text-slate-100 overflow-hidden"
          dir="rtl"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#151C30]">
            <div className="flex items-center gap-2.5">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                isOwner
                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-600 shadow-amber-500/30'
                  : 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/30'
              }`}>
                {isOwner ? <Crown className="w-5 h-5 fill-white text-white" /> : <Youtube className="w-5 h-5 fill-white" />}
              </div>
              <div className="text-right">
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                  <span>{isOwner ? 'إدارة وتشغيل سينما الروم' : 'اقتراح فيديو لسينما الروم'}</span>
                  {isOwner ? (
                    <span className="text-[10px] sm:text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-300" />
                      <span>صاحب الغرفة 👑</span>
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-emerald-300" />
                      <span>اقتراح فيديو 💡</span>
                    </span>
                  )}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-400">
                  {isOwner
                    ? 'أنت مالك الغرفة - يمكنك تشغيل أي فيديو أو اعتماد اقتراحات الأعضاء'
                    : 'تشغيل الفيديو لمالك الغرفة فقط 👑 - يمكنك اقتراح فيديوهات دون تشغيلها'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Role Status Banner for Non-Owners */}
          {!isOwner && (
            <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="leading-tight">
                  حق الاقتراح متاح للمشرفين وجميع الحضور. سيصل اقتراحك لصاحب الغرفة ليعتمده.
                </span>
              </div>
              <span className="text-[10px] font-bold bg-amber-400/20 px-2 py-0.5 rounded-md text-amber-300 shrink-0">
                {currentUserRole === 'moderator' ? 'مشرف 🛡️' : currentUserRole === 'host' ? 'مضيف 🎙️' : 'عضو 👤'}
              </span>
            </div>
          )}

          {/* Top Tabs (Only for Owner or if suggestions exist) */}
          {isOwner && (
            <div className="grid grid-cols-2 p-1.5 mx-4 mt-3 bg-[#111728] rounded-2xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'browse'
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>استعراض وبحث</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('suggestions')}
                className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer relative ${
                  activeTab === 'suggestions'
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>اقتراحات الأعضاء</span>
                {suggestions.length > 0 && (
                  <span className="bg-rose-500 text-white font-mono text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse shadow-sm">
                    {suggestions.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* MAIN MODAL CONTENT */}
          <div className="overflow-y-auto p-4 sm:p-5 space-y-4 custom-scrollbar">
            {activeTab === 'suggestions' && isOwner ? (
              /* TAB 2: OWNER'S SUGGESTIONS MANAGER */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Lightbulb className="w-4 h-4 text-amber-400" />
                    <span>قائمة الاقتراحات المرسلة من المشرفين والأعضاء</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {suggestions.length} اقتراح
                  </span>
                </div>

                {suggestions.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-2.5 bg-[#161D31] rounded-2xl border border-white/10 p-6">
                    <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                      <Lightbulb className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-white">لا توجد اقتراحات جديدة حالياً</h4>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      يمكن للمشرفين وجميع أعضاء الغرفة إرسال اقتراحات فيديوهات وستظهر لك هنا للاعتماد والتشغيل المباشر.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="p-3 bg-[#161D31] border border-amber-500/30 hover:border-amber-400/60 rounded-2xl flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between shadow-lg"
                      >
                        {/* Video Info */}
                        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 min-w-0">
                          <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-black shrink-0">
                            <img
                              src={suggestion.video.thumbnailUrl}
                              alt={suggestion.video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className="w-4 h-4 fill-white text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 text-right space-y-1">
                            <h4 className="text-xs font-bold text-white truncate">
                              {suggestion.video.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="text-emerald-400 font-medium truncate max-w-[120px]">
                                {suggestion.video.channelTitle}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-amber-300">
                                <User className="w-3 h-3" />
                                <span>مقترح من: {suggestion.suggestedBy.userName}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons for Owner */}
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/10">
                          <button
                            type="button"
                            onClick={() => onAcceptSuggestion?.(suggestion)}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-slate-950" />
                            <span>تشغيل الآن 🎬</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteSuggestion?.(suggestion.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-600/30 text-slate-400 hover:text-rose-300 border border-white/10 transition-colors cursor-pointer"
                            title="حذف الاقتراح"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* TAB 1: BROWSE & SEARCH (FOR OWNER OR NON-OWNER SUGGESTIONS) */
              <>
                {/* Quick Paste YouTube URL Input Box */}
                <form
                  onSubmit={handleApplyCustomUrl}
                  className={`p-3 bg-[#1A233A] rounded-2xl space-y-2 shadow-md border ${
                    isOwner ? 'border-emerald-500/40' : 'border-amber-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <Link className="w-3.5 h-3.5 text-emerald-400" />
                      <span>أو الصق أي رابط فيديو / شورتس من يوتيوب:</span>
                    </div>
                    {!isOwner && (
                      <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                        <Lightbulb className="w-3 h-3" />
                        <span>سيتم إرساله كاقتراح للمالك</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={customUrlInput}
                      onChange={(e) => setCustomUrlInput(e.target.value)}
                      className="flex-1 bg-[#0D121F] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono dir-ltr"
                    />
                    <button
                      type="submit"
                      disabled={!customUrlInput.trim()}
                      className={`px-4 py-2 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                        isOwner
                          ? 'bg-emerald-500 hover:bg-emerald-400'
                          : 'bg-amber-400 hover:bg-amber-300'
                      }`}
                    >
                      {isOwner ? (
                        <>
                          <Play className="w-3 h-3 fill-slate-950" />
                          <span>تشغيل</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3" />
                          <span>إرسال الاقتراح</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* YouTube Search Bar */}
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="ابحث عن فيديوهات، أغاني، أفلام، ألعاب..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1A233A] border border-white/15 rounded-2xl pl-10 pr-11 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="absolute left-3 top-2.5 p-1 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                {/* Category Pills Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setSearchResults([]);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-[#1A233A] text-slate-300 hover:bg-[#222E4C] border border-white/10'
                        }`}
                      >
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Video Cards Grid */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
                    <span>
                      {searchResults.length > 0 ? 'نتائج البحث' : 'فيديوهات مقترحة ورائجة للغرف 🔥'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {(searchResults.length > 0 ? searchResults : filteredPresets).length} فيديو
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(searchResults.length > 0 ? searchResults : filteredPresets).map((video) => {
                      const isCurrent = currentVideoId === video.youtubeId;
                      return (
                        <div
                          key={video.id}
                          onClick={() => handleVideoCardClick(video)}
                          className={`p-2.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between gap-2 relative overflow-hidden ${
                            isCurrent
                              ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-500/30'
                              : 'bg-[#161D31] border-white/10 hover:border-emerald-500/50 hover:bg-[#1C2640]'
                          }`}
                        >
                          {/* Video Thumbnail with Play Overlay */}
                          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-950">
                            <img
                              src={video.thumbnailUrl}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {/* Dark Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                            {/* Center Action Bubble */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all ${
                                isOwner ? 'bg-red-600/90 group-hover:bg-red-500' : 'bg-amber-500/90 group-hover:bg-amber-400 text-slate-950'
                              }`}>
                                {isOwner ? (
                                  <Play className="w-4 h-4 fill-white ml-0.5" />
                                ) : (
                                  <Lightbulb className="w-4 h-4 text-slate-950" />
                                )}
                              </div>
                            </div>

                            {/* Duration Badge */}
                            {video.duration && (
                              <div className="absolute bottom-1.5 left-1.5 bg-black/80 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md">
                                {video.duration}
                              </div>
                            )}

                            {/* Active playing indicator */}
                            {isCurrent && (
                              <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>يعمل الآن</span>
                              </div>
                            )}
                          </div>

                          {/* Video Details */}
                          <div className="space-y-1 text-right">
                            <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                              {video.title}
                            </h4>
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span className="truncate max-w-[130px]">{video.channelTitle}</span>
                              {isOwner ? (
                                <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                                  <span>تشغيل</span>
                                  <span>◀</span>
                                </span>
                              ) : (
                                <span className="text-amber-300 font-bold flex items-center gap-1 bg-amber-500/15 px-1.5 py-0.5 rounded-md">
                                  <Lightbulb className="w-2.5 h-2.5" />
                                  <span>اقتراح للمالك</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
