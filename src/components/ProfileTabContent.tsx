import React, { useState, useEffect, useRef } from 'react';
import { Users, Mic, ChevronLeft, Flag, Plus, X, Image as ImageIcon } from 'lucide-react';

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
    <div className="space-y-5 text-right">
      
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>ألبوم الصور الشخصية</span>
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded-md font-bold">
              {albumImages.length} صور
            </span>
          </h4>
          <span className="text-[10px] text-slate-400 font-medium">اضغط (+) لاختيار صور من الهاتف</span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {albumImages.map((imgUrl, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md group"
            >
              <img src={imgUrl} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePhoto(index);
                }}
                className="absolute top-1 left-1 p-1 bg-rose-600/90 hover:bg-rose-500 text-white rounded-full shadow-md transition-all cursor-pointer opacity-80 hover:opacity-100 z-10"
                title="حذف الصورة"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* زر + الزائد الدائم لفتح استديو وقائمة صور الهاتف */}
          <div
            onClick={() => photoInputRef.current?.click()}
            className="relative aspect-square bg-slate-900/80 hover:bg-slate-900 border-2 border-dashed border-amber-500/60 hover:border-amber-400 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all group shadow-sm text-center p-1"
            title="فتح الاستديو وقائمة الصور في الهاتف"
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[9px] font-black text-amber-300 mt-1">إضافة صور</span>
          </div>
        </div>
      </div>

      {/* 2. قسم العائلة (Family Section) */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400">العائلة</h4>
        <div 
          onClick={onOpenFamily}
          className="relative bg-gradient-to-r from-blue-950 via-blue-900/60 to-slate-950 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg overflow-hidden cursor-pointer hover:border-blue-400/50 transition-all"
        >
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl"></div>
          
          <div className="space-y-1 z-10">
            <span className="text-sm font-black text-white">Y a</span>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>3/360</span>
            </div>
          </div>

          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-md shrink-0 z-10">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-lg">
              🛡️
            </div>
          </div>
        </div>
      </div>

      {/* 3. معلومات عني (Bio & Info) */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400">معلومات عني</h4>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-slate-900/80 border border-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <Flag className="w-3.5 h-3.5 text-rose-400" /> وطني
          </span>
        </div>
      </div>

      {/* 4. الصوت (Voice Bio) */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400">الصوت</h4>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-white">إجراء تسجيل!</span>
            <p className="text-[10px] text-slate-400">يساعد هذا على جذب المزيد من المتابعين إليك.</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0">
            <Mic className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>

      {/* 5. علاقاتي (Relationships / CP) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-400">علاقاتي</h4>
          <span className="text-xs text-slate-400 hover:text-white cursor-pointer flex items-center gap-1">
            إعداد <ChevronLeft className="w-3 h-3" />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {relationships.map((rel) => (
            <div 
              key={rel.id} 
              className="relative bg-gradient-to-b from-rose-950/40 via-slate-900 to-slate-950 border border-rose-500/30 rounded-2xl p-4 flex flex-col items-center justify-between gap-3 shadow-xl overflow-hidden group"
            >
              {/* Level Badge Header */}
              <span className="text-[10px] font-bold text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                {rel.level}
              </span>

              {/* Avatar */}
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 to-pink-500 shadow-lg">
                <img src={rel.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} alt={rel.name} className="w-full h-full object-cover rounded-full" />
              </div>

              {/* Name */}
              <span className="text-xs font-bold text-white truncate w-full text-center">
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
