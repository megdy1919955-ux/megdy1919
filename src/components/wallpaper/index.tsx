import React from 'react';

export interface RoomWallpaperItem {
  id: string;
  name: string;
  previewUrl: string;
  price: number;
  isVipOnly?: boolean;
}

export interface RoomBackgroundStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallpaper?: (item: RoomWallpaperItem) => void;
}

export const AVAILABLE_WALLPAPERS: RoomWallpaperItem[] = [
  { id: 'w1', name: 'الديوانية الملكية الذهبية', previewUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=600', price: 0 },
  { id: 'w2', name: 'سماء صنعاء المرصعة بالنجوم', previewUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=600', price: 1000 },
  { id: 'w3', name: 'قصر الفاتح الأسطوري', previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600', price: 5000, isVipOnly: true }
];

export const STORE_WALLPAPERS = AVAILABLE_WALLPAPERS;

export const RoomBackgroundStoreModal: React.FC<RoomBackgroundStoreModalProps> = ({
  isOpen,
  onClose,
  onSelectWallpaper
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 dir-rtl">
      <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 text-white text-right">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-base text-amber-300">متجر خلفيات الروم</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="space-y-3 mb-6">
          {AVAILABLE_WALLPAPERS.map((wp) => (
            <div
              key={wp.id}
              onClick={() => { onSelectWallpaper?.(wp); onClose(); }}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex items-center gap-3 cursor-pointer"
            >
              <img src={wp.previewUrl} alt={wp.name} className="w-14 h-14 rounded-xl object-cover" />
              <div>
                <span className="font-bold text-xs text-white block">{wp.name}</span>
                <span className="text-[10px] text-amber-400 font-mono">{wp.price === 0 ? 'مجاني' : `${wp.price} 🪙`}</span>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold">
          إغلاق
        </button>
      </div>
    </div>
  );
};

export default RoomBackgroundStoreModal;
