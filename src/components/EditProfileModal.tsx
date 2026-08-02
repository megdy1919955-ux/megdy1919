import React, { useState, useRef } from 'react';
import { ChevronRight, ChevronLeft, Plus, Camera } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: {
    name: string;
    country?: string;
    bio?: string;
    userId?: string;
    avatarUrl?: string;
  };
  currentUser?: {
    name: string;
    country: string;
    bio: string;
    avatar?: string;
  };
  onSave?: (updatedData: any) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profile, currentUser, onSave }) => {
  const initialData = currentUser || profile;

  const [name, setName] = useState(initialData?.name || 'عابر سبيل');
  const [bio, setBio] = useState(initialData?.bio || 'كسلان، لا توقيع الآن');
  const [country, setCountry] = useState(initialData?.country || 'اليمن');
  const [birthDate] = useState('2001-01-01');
  
  // حالات لتخزين الصور المختارة من الاستديو
  const [avatarImage, setAvatarImage] = useState<string | null>(currentUser?.avatar || profile?.avatarUrl || null);
  const [albumImages, setAlbumImages] = useState<{ [key: number]: string }>({});

  // مراجع لمدخلات الملفات (لفتح الاستديو مخفياً)
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);
  const [activeAlbumSlot, setActiveAlbumSlot] = useState<number | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const freshData = currentUser || profile;
      if (freshData) {
        setName(freshData.name || 'عابر سبيل');
        setBio(freshData.bio || 'كسلان، لا توقيع الآن');
        setCountry(freshData.country || 'اليمن');
        setAvatarImage(currentUser?.avatar || profile?.avatarUrl || null);
      }
    }
  }, [isOpen, currentUser, profile]);

  if (!isOpen) return null;

  const albumSlots = [1, 2, 3, 4];

  // التعامل مع اختيار الصورة الرمزية من الاستديو
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarImage(imageUrl);
    }
  };

  // التعامل مع اختيار صور الألبوم من الاستديو
  const handleAlbumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeAlbumSlot !== null) {
      const imageUrl = URL.createObjectURL(file);
      setAlbumImages(prev => ({ ...prev, [activeAlbumSlot]: imageUrl }));
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave({ name, bio, country, avatar: avatarImage, album: albumImages });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4 text-right" dir="rtl">
      
      {/* مخفي: حقل إدخال الملفات للـ Avatar */}
      <input 
        type="file" 
        ref={avatarInputRef} 
        onChange={handleAvatarChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* مخفي: حقل إدخال الملفات للألبوم */}
      <input 
        type="file" 
        ref={albumInputRef} 
        onChange={handleAlbumChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer">
              <ChevronRight className="w-5 h-5" />
            </button>
            <h3 className="text-sm font-bold text-white">تعديل البيانات الشخصية</h3>
          </div>
          <button 
            onClick={handleSave}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            حفظ
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {/* 1. الصورة الرمزية (مرتبطة بالاستديو) */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400">الصورة الرمزية</span>
            <div className="flex items-center gap-4">
              <div 
                onClick={() => avatarInputRef.current?.click()}
                className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0 group cursor-pointer shadow-md"
              >
                {avatarImage ? (
                  <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-amber-500 via-teal-500 to-purple-600 flex items-center justify-center text-xl font-black text-slate-950">
                    ع
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                المستخدمون في مستوى <strong className="text-amber-400">VIP9</strong> أو الأرستقراطية <strong className="text-amber-400">13</strong> يمكنهم رفع صور ملف شخصي متحركة بصيغة GIF.
              </p>
            </div>
          </div>

          {/* 2. الألبوم (مرتبط بالاستديو لاختيار وتغيير الصور) */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400">ألبوم</span>
            <div className="grid grid-cols-4 gap-2.5">
              {albumSlots.map((slot) => (
                <div 
                  key={slot} 
                  onClick={() => {
                    setActiveAlbumSlot(slot);
                    albumInputRef.current?.click();
                  }}
                  className="relative aspect-square bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center hover:border-amber-500/50 cursor-pointer overflow-hidden transition-all group"
                >
                  {albumImages[slot] ? (
                    <img src={albumImages[slot]} alt={`Album ${slot}`} className="w-full h-full object-cover" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. الكنية (الاسم) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">الكنية</span>
              <span className="text-[10px] text-slate-500">{name.length}/30</span>
            </div>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* 4. تاريخ الميلاد */}
          <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-900 transition-all">
            <span className="text-xs text-slate-400">تاريخ الميلاد</span>
            <div className="flex items-center gap-1 text-xs text-slate-200">
              <span>{birthDate}</span>
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* 5. الدولة/المنطقة */}
          <div className="flex items-center justify-between p-3 bg-slate-900/60 border border-slate-800 rounded-2xl cursor-pointer hover:bg-slate-900 transition-all">
            <span className="text-xs text-slate-400">الدولة/المنطقة</span>
            <div className="flex items-center gap-1 text-xs text-slate-200">
              <span>{country}</span>
              <ChevronLeft className="w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* 6. علامات الاهتمام */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400">علامات الاهتمام</span>
            <div className="flex items-center gap-2">
              <span className="bg-slate-900 border border-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                🚩 وطني
              </span>
            </div>
          </div>

          {/* 7. توقيع شخصي (نبذة) */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">توقيع شخصي</span>
              <span className="text-[10px] text-slate-500">{bio.length}/400</span>
            </div>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)}
              maxLength={400}
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default EditProfileModal;
