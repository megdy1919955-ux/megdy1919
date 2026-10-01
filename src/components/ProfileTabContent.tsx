import React, { useState, useEffect, useRef } from 'react';
import { Users, Mic, ChevronLeft, Flag, Plus, X, Image as ImageIcon, Sparkles, Heart } from 'lucide-react';

interface ProfileTabContentProps {
  onOpenFamily?: () => void;
}

export const ProfileTabContent: React.FC<ProfileTabContentProps> = ({ onOpenFamily }) => {
  // علاقات الـ CP
  const relationships = [
    { id: 1, name: 'ابو احمد M', level: 'CP LV3', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60' },
    { id: 2, name: 'تارلـف', level: 'CP LV4', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60' },
  ];

  // ألبوم الصور الشخصية مع دعم الفتح المباشر لاكتشاف صور الهاتف والاستديو
  const [albumImages, setAlbumImages] = useState<string[]>(() => {
    const savedData = localStorage.getItem('user_profile_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed.album)) return parsed.album;
        if (parsed.album && typeof parsed.album === 'object') {
          return Object.values(parsed.album).filter(Boolean) as string[];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
    ];
  });

  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const syncAlbum = () => {
      const savedData = localStorage.getItem('user_profile_data');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (Array.isArray(parsed.album)) setAlbumImages(parsed.album);
          else if (parsed.album && typeof parsed.album === 'object') {
            setAlbumImages(Object.values(parsed.album).filter(Boolean) as string[]);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    window.addEventListener('user_profile_updated', syncAlbum);
    window.addEventListener('storage', syncAlbum);
    return () => {
      window.removeEventListener('user_profile_updated', syncAlbum);
      window.removeEventListener('storage', syncAlbum);
    };
  }, []);

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file) {
          newUrls.push(URL.createObjectURL(file));
        }
      }
      const updated = [...albumImages, ...newUrls];
      setAlbumImages(updated);

      const savedData = localStorage.getItem('user_profile_data');
      let baseData = {};
      if (savedData) {
        try { baseData = JSON.parse(savedData); } catch (err) {}
      }
      localStorage.setItem('user_profile_data', JSON.stringify({ ...baseData, album: updated }));
      window.dispatchEvent(new Event('user_profile_updated'));
    }
    if (e.target) e.target.value = '';
  };

  const handleDeletePhoto = (indexToDelete: number) => {
    const updated = albumImages.filter((_, idx) => idx !== indexToDelete);
    setAlbumImages(updated);
    const savedData = localStorage.getItem('user_profile_data');
    let baseData = {};
    if (savedData) {
      try { baseData = JSON.parse(savedData); } catch (err) {}
    }
    localStorage.setItem('user_profile_data', JSON.stringify({ ...baseData, album: updated }));
    window.dispatchEvent(new Event('user_profile_updated'));
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* حقل إدخال مخفي لاختيار صور الألبوم من استديو الهاتف مباشرة عند الضغط على رمز + */}
      <input
        type="file"
        ref={photoInputRef}
        onChange={handleAddPhotos}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* 1. قسم ألبوم الصور الشخصية (مفتوح للاستديو برمز + دائري) */}
      <div className="space-y-3 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-500" />
            <span>ألبوم الصور الشخصية</span>
            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
              {albumImages.length} صور
            </span>
          </h4>
          <button 
            onClick={() => photoInputRef.current?.click()}
            className="text-[11px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>إضافة صور</span>
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {albumImages.map((imgUrl, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 border border-slate-300/80 shadow-xs group"
            >
              <img src={imgUrl} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePhoto(index);
                }}
                className="absolute top-1 left-1 p-1 bg-rose-600/90 hover:bg-rose-700 text-white rounded-full shadow-md transition-all cursor-pointer z-10"
                title="حذف الصورة"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* زر + الزائد الدائم لفتح استديو وقائمة صور الهاتف */}
          <div
            onClick={() => photoInputRef.current?.click()}
            className="relative aspect-square bg-white hover:bg-amber-50/40 border-2 border-dashed border-amber-400 hover:border-amber-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group shadow-xs text-center p-1"
            title="فتح الاستديو وقائمة الصور في الهاتف"
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-black text-slate-800 mt-1">إضافة</span>
          </div>
        </div>
      </div>

      {/* 2. قسم العائلة (Family Section) */}
      <div className="space-y-3 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-600" />
          <span>العائلة</span>
        </h4>
        <div 
          onClick={onOpenFamily}
          className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-4 flex items-center justify-between shadow-md overflow-hidden cursor-pointer hover:opacity-95 transition-all group"
        >
          <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl" />
          
          <div className="space-y-1 z-10">
            <span className="text-base font-black tracking-wide">عائلة الملوك (Ya)</span>
            <div className="flex items-center gap-2 text-xs text-blue-100 font-medium">
              <span className="bg-white/20 px-2 py-0.5 rounded-md font-mono">3/360 عضو</span>
              <span>•</span>
              <span>المستوى 12</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl shadow-inner shrink-0 z-10 group-hover:scale-110 transition-transform">
            🛡️
          </div>
        </div>
      </div>

      {/* 3. معلومات عني (Bio & Info) */}
      <div className="space-y-3 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <h4 className="text-xs sm:text-sm font-black text-slate-900">معلومات عني</h4>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-white border border-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
            <Flag className="w-3.5 h-3.5 text-rose-500" /> وطني: اليمن 🇾🇪
          </span>
          <span className="bg-white border border-slate-200 text-slate-800 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> الحالة: نشط دائماً
          </span>
        </div>
      </div>

      {/* 4. الصوت (Voice Bio) */}
      <div className="space-y-3 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <h4 className="text-xs sm:text-sm font-black text-slate-900">الصوت</h4>
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between shadow-2xs">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-slate-900">إجراء تسجيل صوتي!</span>
            <p className="text-[11px] text-slate-500">يساعد الصوت على جذب المزيد من المتابعين والمعجبين إليك.</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-sm active:scale-95">
            <Mic className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* 5. علاقاتي (Relationships / CP) */}
      <div className="space-y-3 bg-[#F8FAFC] border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h4 className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>علاقاتي (CP)</span>
          </h4>
          <span className="text-xs text-slate-500 hover:text-amber-600 font-bold cursor-pointer flex items-center gap-1">
            إعداد <ChevronLeft className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {relationships.map((rel) => (
            <div 
              key={rel.id} 
              className="relative bg-white border border-rose-200 rounded-2xl p-3.5 flex flex-col items-center justify-between gap-2.5 shadow-xs overflow-hidden group hover:border-rose-300 transition-all"
            >
              {/* Level Badge Header */}
              <span className="text-[10px] font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {rel.level}
              </span>

              {/* Avatar */}
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-rose-400 to-pink-500 shadow-md">
                <img src={rel.avatar} alt={rel.name} className="w-full h-full object-cover rounded-full border border-white" />
              </div>

              {/* Name */}
              <span className="text-xs font-black text-slate-900 truncate w-full text-center">
                {rel.name}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProfileTabContent;
