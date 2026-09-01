import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Edit3, 
  Copy, 
  ChevronLeft, 
  ChevronRight, 
  Car, 
  Gift, 
  Camera, 
  Plus, 
  Heart, 
  Trash2, 
  Check, 
  Crown, 
  Sparkles,
  Shield,
  Star,
  Users
} from 'lucide-react';
import { ProfileTabContent } from './ProfileTabContent';
import { EditProfileModal } from './EditProfileModal';
import { UserProfileData } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFamily?: () => void;
  userProfile?: UserProfileData;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onOpenFamily,
  userProfile 
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'shine' | 'moments'>('profile');
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  // لحظات الصور في الملف الشخصي مع فتح استديو الهاتف مباشرة برمز +
  const [moments, setMoments] = useState<Array<{ id: string; photo: string; time: string; likes: number }>>(() => {
    const saved = localStorage.getItem('user_moments_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: '1', photo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80', time: 'منذ ساعة', likes: 14 },
      { id: '2', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80', time: 'أمس', likes: 28 },
    ];
  });

  const momentInputRef = useRef<HTMLInputElement>(null);

  const handlePublishMoment = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newMoments: Array<{ id: string; photo: string; time: string; likes: number }> = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          const photoUrl = URL.createObjectURL(file);
          newMoments.push({
            id: Date.now() + '_' + i,
            photo: photoUrl,
            time: 'الآن',
            likes: 1
          });
        }
      }
      const updated = [...newMoments, ...moments];
      setMoments(updated);
      localStorage.setItem('user_moments_list', JSON.stringify(updated));
    }
    if (e.target) e.target.value = '';
  };

  const handleDeleteMoment = (id: string) => {
    const updated = moments.filter(m => m.id !== id);
    setMoments(updated);
    localStorage.setItem('user_moments_list', JSON.stringify(updated));
  };

  // جلب البيانات المخزنة مسبقاً في ذاكرة الهاتف (localStorage) أو استخدام القيم من props
  const [user, setUser] = useState(() => {
    if (userProfile) {
      return {
        name: userProfile.name || 'مستخدم',
        id: userProfile.userId || (userProfile as any).id || '77989080',
        country: userProfile.country || 'اليمن',
        followers: (userProfile.stats as any)?.followers || 5365,
        following: (userProfile.stats as any)?.friends || (userProfile.stats as any)?.following || 120,
        bio: userProfile.bio || 'كسلان، لا توقيع الآن',
        superLegendLevel: userProfile.superLegendLevel || 'SL1',
        vipLevel: userProfile.vipLevel || 'VIP8',
        avatar: (userProfile as any).avatarUrl || (userProfile as any).avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
        album: {}
      };
    }
    const savedData = localStorage.getItem('user_profile_data');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: 'عابر سبيل',
      id: '77989080',
      country: 'اليمن',
      followers: 5365,
      following: 120,
      bio: 'كسلان، لا توقيع الآن',
      superLegendLevel: 'SL1',
      vipLevel: 'VIP8',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      album: {}
    };
  });

  // حفظ التعديلات في ذاكرة الهاتف فور اعتمادها
  const handleSaveProfile = (updatedData: any) => {
    const newUserData = { ...user, ...updatedData };
    setUser(newUserData);
    localStorage.setItem('user_profile_data', JSON.stringify(newUserData));
    window.dispatchEvent(new Event('user_profile_updated'));
  };

  useEffect(() => {
    const syncUser = () => {
      if (userProfile) {
        setUser({
          name: userProfile.name || 'مستخدم',
          id: userProfile.userId || (userProfile as any).id || '77989080',
          country: userProfile.country || 'اليمن',
          followers: (userProfile.stats as any)?.followers || 5365,
          following: (userProfile.stats as any)?.friends || (userProfile.stats as any)?.following || 120,
          bio: userProfile.bio || 'كسلان، لا توقيع الآن',
          superLegendLevel: userProfile.superLegendLevel || 'SL1',
          vipLevel: userProfile.vipLevel || 'VIP8',
          avatar: (userProfile as any).avatarUrl || (userProfile as any).avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
          album: {}
        });
        return;
      }
      const savedData = localStorage.getItem('user_profile_data');
      if (savedData) {
        try {
          setUser((prev: any) => ({ ...prev, ...JSON.parse(savedData) }));
        } catch (e) {
          console.error(e);
        }
      }
    };

    if (isOpen) {
      syncUser();
    }

    window.addEventListener('user_profile_updated', syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener('user_profile_updated', syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, [isOpen, isEditOpen, userProfile]);

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id || '77989080');
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (!isOpen) return null;

  // الشارات، السيارات، الهدايا
  const badges = [
    { id: 1, title: 'حامي العرش', icon: '🛡️', color: 'from-emerald-50 to-teal-100 border-emerald-300 text-emerald-900' },
    { id: 2, title: 'سوبر ليجند', icon: '👑', color: 'from-amber-50 to-yellow-100 border-amber-300 text-amber-900' },
    { id: 3, title: 'نخبة 100', icon: '💎', color: 'from-blue-50 to-sky-100 border-blue-300 text-blue-900' },
    { id: 4, title: 'الذئب النبيل', icon: '🐺', color: 'from-teal-50 to-emerald-100 border-teal-300 text-teal-900' },
    { id: 5, title: 'ملك الفريق', icon: '🏰', color: 'from-amber-50 to-orange-100 border-orange-300 text-amber-900' },
    { id: 6, title: 'داعم ذهبي', icon: '⭐', color: 'from-purple-50 to-indigo-100 border-purple-300 text-purple-900' },
    { id: 7, title: 'النجم الساطع', icon: '🌟', color: 'from-yellow-50 to-amber-100 border-yellow-300 text-yellow-900' },
    { id: 8, title: 'سيد الهدايا', icon: '🎁', color: 'from-rose-50 to-pink-100 border-rose-300 text-rose-900' },
  ];

  const cars = [
    { id: 1, name: 'مركبة أسطورية', icon: '🚀', desc: 'تأثير دخول ناري' },
    { id: 2, name: 'التنين الأزرق', icon: '🐉', desc: 'تأثير دخول ملكي' },
  ];

  const giftCollections = [
    { id: 1, title: 'حارس العرش', status: 'انتهى الحدث', icon: '🛡️', count: '1/1' },
    { id: 2, title: 'حدث 2026', status: 'انتهى الحدث', icon: '🎉', count: '1/1' },
    { id: 3, title: 'أسد الأبراج', status: 'قيد التجميع', icon: '🦁', count: '0/8' },
  ];

  const receivedGifts = [
    { id: 1, title: 'قطط رومانسية', count: 'x1', icon: '🐱' },
    { id: 2, title: 'أسد الدولة', count: 'x1', icon: '🦁' },
    { id: 3, title: 'صاروخ EXP', count: 'x5', icon: '🚀' },
    { id: 4, title: 'عرش الملوك', count: 'x1', icon: '👑' },
    { id: 5, title: 'رعاة الأبراج', count: 'x2', icon: '⚡' },
    { id: 6, title: 'احتفال 2026', count: 'x4', icon: '🎉' },
    { id: 7, title: 'ملك النمور', count: 'x2', icon: '🐅' },
    { id: 8, title: 'هدية فاخرة', count: 'x5', icon: '💎' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 w-full h-full min-h-screen bg-white flex flex-col text-right overflow-y-auto select-none" 
      dir="rtl"
    >
      {/* Toast Notification for ID copy */}
      {copiedId && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>تم نسخ المعرف (ID: {user.id}) بنجاح!</span>
        </div>
      )}

      {/* Full-Screen Profile Container */}
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col bg-white">
        
        {/* Header / Cover Image Banner */}
        <div className="relative h-60 sm:h-72 w-full bg-gradient-to-b from-sky-400 via-indigo-500 to-slate-900 overflow-hidden shrink-0">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&auto=format&fit=crop&q=80')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

          {/* Top Bar Navigation (Back Button on Right in RTL, Edit and Close on Left) */}
          <div className="absolute top-4 right-4 left-4 flex items-center justify-between z-20">
            {/* Back / Close button */}
            <button 
              onClick={onClose}
              className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-1"
              title="رجوع"
            >
              <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Top Right Action Tools */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsEditOpen(true)}
                className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all cursor-pointer shadow-lg active:scale-95 flex items-center gap-1.5 text-xs font-bold"
                title="تعديل الملف الشخصي"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">تعديل</span>
              </button>
              <button 
                onClick={onClose}
                className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all cursor-pointer shadow-lg active:scale-95"
                title="إغلاق"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Profile User Info Overlay */}
          <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between z-10">
            <div className="flex items-end gap-3.5">
              {/* User Avatar with Ring */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500 shadow-2xl shrink-0">
                <img 
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                  alt={user.name} 
                  className="w-full h-full object-cover rounded-full border-2 border-white bg-slate-900" 
                />
                {/* VIP Indicator icon badge */}
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full border-2 border-white shadow-md">
                  <Crown className="w-3.5 h-3.5 fill-slate-950" />
                </div>
              </div>

              {/* User Details */}
              <div className="space-y-1 pb-1">
                <h1 className="text-xl sm:text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-tight flex items-center gap-2">
                  <span>{user.name}</span>
                </h1>
                
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Copyable ID */}
                  <button 
                    onClick={handleCopyId}
                    className="bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 text-xs text-slate-200 font-mono transition-all cursor-pointer"
                  >
                    <span>ID: {user.id}</span>
                    <Copy className="w-3 h-3 text-slate-300" />
                  </button>

                  <span className="text-xs text-slate-200 font-medium drop-shadow-sm">| {user.country} |</span>
                </div>
              </div>
            </div>

            {/* Fans & Following Pill Counter */}
            <div className="hidden sm:flex flex-col items-end gap-1 text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/15">
              <div className="text-xs font-medium text-slate-300">
                المتابعون: <strong className="text-white font-mono font-bold">{Number(user.followers).toLocaleString('en-US')}</strong>
              </div>
              <div className="text-xs font-medium text-slate-300">
                أصدقاء: <strong className="text-white font-mono font-bold">{Number(user.following).toLocaleString('en-US')}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Levels & Badges Strip */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Super Legend Badge */}
            <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-700 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-amber-300/60">
              <span>🐺</span>
              <span>{user.superLegendLevel}</span>
            </span>

            {/* VIP Level Badge */}
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900 text-amber-300 font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-amber-400/50">
              <Crown className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{user.vipLevel}</span>
            </span>

            {/* Wealth / Level Badge */}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[11px] px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>Lv.53</span>
            </span>

            {/* Charm Likes */}
            <span className="bg-rose-50 text-rose-600 border border-rose-200 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              <span className="font-mono">113</span>
            </span>

            {/* Gender / Age */}
            <span className="bg-sky-50 text-sky-700 border border-sky-200 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="font-mono">25</span>
              <span>♂</span>
            </span>
          </div>

          {/* Followers Summary on mobile */}
          <div className="sm:hidden flex items-center gap-2 text-xs font-mono font-bold text-slate-700 whitespace-nowrap">
            <span>{Number(user.followers).toLocaleString('en-US')} معجب</span>
          </div>
        </div>

        {/* Tab Navigation (White Background) */}
        <div className="bg-white border-b border-slate-200 px-4 sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`text-sm font-black py-3.5 relative transition-all cursor-pointer ${
                activeTab === 'profile' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ملف التعريف
              {activeTab === 'profile' && (
                <span className="absolute bottom-0 right-0 left-0 h-1 bg-amber-500 rounded-full shadow-sm" />
              )}
            </button>

            <button 
              onClick={() => setActiveTab('shine')}
              className={`text-sm font-black py-3.5 relative transition-all cursor-pointer ${
                activeTab === 'shine' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              تألق
              {activeTab === 'shine' && (
                <span className="absolute bottom-0 right-0 left-0 h-1 bg-amber-500 rounded-full shadow-sm" />
              )}
            </button>

            <button 
              onClick={() => setActiveTab('moments')}
              className={`text-sm font-black py-3.5 relative transition-all cursor-pointer ${
                activeTab === 'moments' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              لحظات
              {activeTab === 'moments' && (
                <span className="absolute bottom-0 right-0 left-0 h-1 bg-amber-500 rounded-full shadow-sm" />
              )}
            </button>
          </div>
        </div>

        {/* Content Body Area (Pure White Background) */}
        <div className="flex-1 p-4 sm:p-6 space-y-6 bg-white">
          
          {/* Tab 1: Profile Information (ملف التعريف) */}
          {activeTab === 'profile' && (
            <ProfileTabContent onOpenFamily={onOpenFamily} />
          )}

          {/* Tab 2: Shine (تألق) */}
          {activeTab === 'shine' && (
            <div className="space-y-6">
              
              {/* قسم الشارات */}
              <div className="space-y-3 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-amber-500" />
                    <span>الشارات</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                      {badges.length}
                    </span>
                  </h4>
                  <span className="text-xs text-slate-500 hover:text-amber-600 font-bold cursor-pointer flex items-center gap-1">
                    رؤية الكل <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                  {badges.map((b) => (
                    <div 
                      key={b.id} 
                      className={`bg-gradient-to-b ${b.color} border rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 shadow-xs hover:shadow-md hover:scale-105 transition-all cursor-pointer`}
                    >
                      <div className="text-2xl drop-shadow-sm">{b.icon}</div>
                      <span className="text-[10px] font-bold text-center truncate w-full">{b.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* قسم سيارة */}
              <div className="space-y-3 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-amber-500" /> 
                    <span>سيارة</span>
                  </h4>
                  <span className="text-xs text-slate-500 hover:text-amber-600 font-bold cursor-pointer">إدارة المتجر</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white border-2 border-dashed border-emerald-400/80 hover:border-emerald-500 rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-emerald-50/50 transition-all group shadow-xs">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                      +
                    </div>
                    <span className="text-xs font-black text-emerald-600">شراء سيارة</span>
                  </div>

                  {cars.map((car) => (
                    <div key={car.id} className="bg-white border border-slate-200/90 rounded-2xl p-3 flex flex-col items-center justify-center gap-1 shadow-xs">
                      <span className="text-3xl drop-shadow-sm">{car.icon}</span>
                      <span className="text-xs font-bold text-slate-900 truncate w-full text-center">{car.name}</span>
                      <span className="text-[10px] text-slate-500 truncate w-full text-center">{car.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* مجموعة الهدايا */}
              <div className="space-y-3 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>مجموعة الهدايا</span>
                  </h4>
                  <span className="text-xs text-slate-500 hover:text-amber-600 font-bold cursor-pointer flex items-center gap-1">
                    رؤية الكل <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {giftCollections.map((col) => (
                    <div key={col.id} className="bg-white border border-slate-200/90 rounded-2xl p-3 flex flex-col items-center justify-between gap-2 shadow-xs">
                      <span className="text-3xl pt-1">{col.icon}</span>
                      <div className="text-center w-full">
                        <span className="text-xs font-bold text-slate-900 block truncate">{col.title}</span>
                        <span className="text-[10px] text-amber-700 font-bold bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full mt-1 inline-block">
                          {col.status} ({col.count})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* الهدايا المستلمة */}
              <div className="space-y-3 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-rose-500" /> 
                    <span>الهدايا المستلمة</span>
                  </h4>
                  <span className="text-xs text-slate-500 hover:text-amber-600 font-bold cursor-pointer flex items-center gap-1">
                    رؤية الكل <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {receivedGifts.map((gift) => (
                    <div key={gift.id} className="bg-white border border-slate-200/80 rounded-2xl p-2.5 flex flex-col items-center justify-between gap-1 shadow-xs relative group hover:border-amber-400 transition-all">
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md font-mono">
                        {gift.count}
                      </span>
                      <div className="text-2xl pt-2">{gift.icon}</div>
                      <span className="text-[10px] text-slate-700 font-bold text-center truncate w-full">
                        {gift.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Tab 3: Moments (لحظات) */}
          {activeTab === 'moments' && (
            <div className="space-y-4">
              <input
                type="file"
                ref={momentInputRef}
                onChange={handlePublishMoment}
                accept="image/*"
                multiple
                className="hidden"
              />

              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-500" />
                  <span>لحظاتي المنشورة ({moments.length})</span>
                </h4>
                <button
                  onClick={() => momentInputRef.current?.click()}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>نشر لحظة من الاستديو</span>
                </button>
              </div>

              {moments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-xs">
                    <Camera className="w-8 h-8 text-amber-500" />
                  </div>
                  <p className="text-xs text-slate-500 font-bold">لا توجد لحظات منشورة حتى الآن</p>
                  <button
                    onClick={() => momentInputRef.current?.click()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>اختر صور من الهاتف</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Permanent Add Photo Square */}
                  <div
                    onClick={() => momentInputRef.current?.click()}
                    className="relative aspect-square bg-slate-50 hover:bg-amber-50/50 border-2 border-dashed border-amber-400/80 hover:border-amber-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group shadow-xs text-center p-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                      <Plus className="w-6 h-6 stroke-[3]" />
                    </div>
                    <span className="text-xs font-black text-slate-800 mt-2">إضافة من الاستديو</span>
                  </div>

                  {moments.map((item) => (
                    <div key={item.id} className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm group">
                      <img src={item.photo} alt="Moment" className="w-full h-full object-cover" />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                      
                      <button
                        onClick={() => handleDeleteMoment(item.id)}
                        className="absolute top-2 left-2 p-1.5 bg-rose-600/90 hover:bg-rose-700 text-white rounded-full shadow-md transition-all cursor-pointer z-10"
                        title="حذف اللحظة"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="absolute bottom-2 right-2 left-2 flex items-center justify-between text-white text-[10px]">
                        <span className="font-bold text-slate-200">{item.time}</span>
                        <span className="flex items-center gap-1 font-mono font-black text-rose-400 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
                          <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                          {item.likes}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* نافذة التعديل للملف الشخصي */}
      <EditProfileModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        currentUser={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default UserProfileModal;
