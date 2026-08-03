import React, { useState } from 'react';
import { X, Edit3, Copy, ChevronLeft, Car, Gift, Camera } from 'lucide-react';
import { ProfileTabContent } from './ProfileTabContent';
import { EditProfileModal } from './EditProfileModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFamily?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, onOpenFamily }) => {
  const [activeTab, setActiveTab] = useState('shine');
  const [isEditOpen, setIsEditOpen] = useState(false);

  // جلب البيانات المخزنة مسبقاً في ذاكرة الهاتف (localStorage) أو استخدام القيم الافتراضية
  const [user, setUser] = useState(() => {
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
      superLegendLevel: 'SL3',
      vipLevel: 'VIP6',
      avatar: null,
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

  React.useEffect(() => {
    const syncUser = () => {
      const savedData = localStorage.getItem('user_profile_data');
      if (savedData) {
        try {
          setUser(JSON.parse(savedData));
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
  }, [isOpen, isEditOpen]);

  if (!isOpen) return null;

  // الشارات، السيارات، الهدايا
  const badges = [
    { id: 1, title: 'Top Protector', icon: '🛡️', color: 'from-emerald-800 to-emerald-950 border-emerald-500/40' },
    { id: 2, title: 'Super Legend', icon: '👑', color: 'from-amber-500 to-purple-600 border-amber-400/50' },
    { id: 3, title: 'Elite 100', icon: '💎', color: 'from-blue-600 to-indigo-900 border-blue-400/50' },
    { id: 4, title: 'Noble 5', icon: '🐺', color: 'from-teal-600 to-emerald-900 border-emerald-400/50' },
    { id: 5, title: 'Team King', icon: '🏰', color: 'from-amber-600 to-yellow-900 border-amber-500/40' },
    { id: 6, title: 'Supporter', icon: '⭐', color: 'from-purple-600 to-pink-900 border-purple-400/50' },
    { id: 7, title: 'Star', icon: '🌟', color: 'from-yellow-600 to-amber-900 border-yellow-500/40' },
    { id: 8, title: 'Gift Master', icon: '🎁', color: 'from-pink-600 to-rose-900 border-pink-500/40' },
  ];

  const cars = [
    { id: 1, name: 'مركبة أسطورية', icon: '🚀' },
    { id: 2, name: 'التنين الأزرق', icon: '🐉' },
  ];

  const giftCollections = [
    { id: 1, title: 'حارس العرش', status: 'انتهى الحدث', icon: '🛡️' },
    { id: 2, title: 'حدث 2026', status: 'انتهى الحدث', icon: '🎉' },
    { id: 3, title: 'أسد الأبراج', status: '0/8', icon: '🦁' },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 text-right" dir="rtl">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col h-[90vh]">
        
        {/* Header / Cover Image Area */}
        <div className="relative h-48 w-full bg-gradient-to-b from-slate-800 to-slate-950 overflow-hidden shrink-0">
          <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&auto=format&fit=crop&q=60')` }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* زر التعديل (القلم) يفتح نافذة التعديل */}
          <button 
            onClick={() => setIsEditOpen(true)}
            className="absolute top-4 left-4 p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors cursor-pointer z-10"
          >
            <Edit3 className="w-5 h-5" />
          </button>

          {/* Profile Avatar & Info Overlay (تعرض الصورة المحفوظة) */}
          <div className="absolute bottom-3 right-4 left-4 flex items-end justify-between">
            <div className="flex items-end gap-3">
              <div className="relative w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-500 via-teal-500 to-purple-600 shadow-xl shrink-0 overflow-hidden">
                <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
                  {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-black text-amber-400">ع</span>
                  )}
                </div>
              </div>

              <div className="space-y-0.5 pb-1">
                <h2 className="text-base font-black tracking-wide text-white drop-shadow-md">
                  ({user.name})
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-black/40 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1 text-[10px] text-slate-300">
                    <span>ID: {user.id}</span>
                    <Copy className="w-3 h-3 cursor-pointer hover:text-white" />
                  </div>
                  <span className="text-[11px] text-slate-300">| {user.country} |</span>
                  <span className="text-[11px] text-slate-300">المشجعون: <strong className="text-white">{user.followers}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges & Ranks Row (Reversed layout order: Left-to-Right & Compact scaled down) */}
        <div className="px-3 py-1 bg-slate-900/60 border-b border-slate-800 flex flex-row-reverse items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
          <span className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full shadow-2xs">
            {user.superLegendLevel}
          </span>
          <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[8px] px-1.5 py-0.5 rounded-full shadow-2xs">
            {user.vipLevel}
          </span>
          <span className="bg-purple-600/80 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full">
            Lv.53
          </span>
          <span className="bg-pink-600/90 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
            <span>113</span> <span>❤️</span>
          </span>
          <span className="bg-blue-600/80 text-white font-bold text-[8px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-2xs">
            <span>25</span> <span>♂</span>
          </span>
        </div>

        {/* Tabs & Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          <div className="flex items-center gap-6 border-b border-slate-800 pb-2">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`text-sm font-semibold pb-1 relative transition-colors cursor-pointer ${activeTab === 'profile' ? 'text-amber-400' : 'text-slate-400'}`}
            >
              ملف التعريف
              {activeTab === 'profile' && <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-400 rounded-full"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('shine')}
              className={`text-sm font-semibold pb-1 relative transition-colors cursor-pointer ${activeTab === 'shine' ? 'text-amber-400' : 'text-slate-400'}`}
            >
              تألق
              {activeTab === 'shine' && <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-400 rounded-full"></span>}
            </button>
            <button 
              onClick={() => setActiveTab('moments')}
              className={`text-sm font-semibold pb-1 relative transition-colors cursor-pointer ${activeTab === 'moments' ? 'text-amber-400' : 'text-slate-400'}`}
            >
              لحظات
              {activeTab === 'moments' && <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-400 rounded-full"></span>}
            </button>
          </div>

          {activeTab === 'profile' && <ProfileTabContent onOpenFamily={onOpenFamily} />}

          {activeTab === 'shine' && (
            <>
              {/* قسم الشارات */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200">الشارات <span className="text-amber-400 text-xs">13</span></h4>
                  <span className="text-xs text-slate-400 hover:text-white cursor-pointer flex items-center gap-1">
                    رؤية الكل <ChevronLeft className="w-3 h-3" />
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {badges.slice(0, 8).map((b) => (
                    <div key={b.id} className={`bg-gradient-to-b ${b.color} border rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-lg hover:scale-105 transition-all cursor-pointer`}>
                      <div className="text-2xl drop-shadow">{b.icon}</div>
                      <span className="text-[10px] font-bold text-slate-200 text-center truncate w-full">{b.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* قسم سيارة */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <Car className="w-4 h-4 text-amber-400" /> سيارة
                  </h4>
                  <span className="text-xs text-slate-400 hover:text-white cursor-pointer">إدارة</span>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-900 cursor-pointer transition-all group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-amber-400">
                      +
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">يشتري</span>
                  </div>

                  {cars.map((car) => (
                    <div key={car.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-center gap-2 shadow-md">
                      <span className="text-3xl">{car.icon}</span>
                      <span className="text-[10px] font-medium text-slate-300 truncate w-full text-center">{car.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* مجموعة الهدايا */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200">مجموعة الهدايا</h4>
                  <span className="text-xs text-slate-400 hover:text-white cursor-pointer flex items-center gap-1">
                    رؤية الكل <ChevronLeft className="w-3 h-3" />
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {giftCollections.map((col) => (
                    <div key={col.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 flex flex-col items-center justify-between gap-3 relative h-36 overflow-hidden shadow-lg group">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                      <span className="text-3xl z-10 pt-2">{col.icon}</span>
                      <div className="z-10 text-center w-full">
                        <span className="text-[10px] font-bold text-slate-300 block truncate">{col.title}</span>
                        <span className="text-[9px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md mt-1 inline-block">
                          {col.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* هدية */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-400" /> هدية
                  </h4>
                  <span className="text-xs text-slate-400 hover:text-white cursor-pointer flex items-center gap-1">
                    رؤية الكل <ChevronLeft className="w-3 h-3" />
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {receivedGifts.map((gift) => (
                    <div key={gift.id} className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col items-center justify-between gap-1.5 shadow-md relative group hover:border-amber-500/40 transition-all">
                      <span className="absolute top-2 left-2 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                        {gift.count}
                      </span>
                      <div className="text-3xl pt-2">{gift.icon}</div>
                      <span className="text-[10px] text-slate-300 font-medium text-center truncate w-full">
                        {gift.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'moments' && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-xs text-slate-400 font-medium">لا توجد لحظات منشورة حتى الآن</p>
              <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer">
                نشر لحظة جديدة
              </button>
            </div>
          )}
        </div>

      </div>

      {/* نافذة التعديل المرتبطة بالذاكرة الدائمة */}
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
