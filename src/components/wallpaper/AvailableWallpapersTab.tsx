import React from 'react';
import { Upload, Check, Lock, Gift, Calendar, Clock, ShieldCheck, Sparkles, XCircle } from 'lucide-react';
import { RoomWallpaperItem } from './wallpaperData';
import { CustomWallpaperGiftGrant, getGrantRemainingTime } from '../../lib/customWallpaperGiftService';

export interface AvailableWallpapersTabProps {
  wallpapers: RoomWallpaperItem[];
  equippedBgUrl: string;
  onSelectWallpaper: (item: RoomWallpaperItem) => void;
  onCustomUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  giftGrant: CustomWallpaperGiftGrant | null;
  onLockedUploadClick: () => void;
  isDevOrAdmin?: boolean;
  onAdminGrantGift?: (days: number) => void;
  onAdminRevokeGift?: () => void;
}

/**
 * تبويب الخلفيات المتاحة
 * - ميزة رفع خلفية خاصة من الجوال مشروطة بوجود هدية إدارية سارية الصلاحية ومحددة بتاريخ بدء وانتهاء
 */
export const AvailableWallpapersTab: React.FC<AvailableWallpapersTabProps> = ({
  wallpapers,
  equippedBgUrl,
  onSelectWallpaper,
  onCustomUpload,
  giftGrant,
  onLockedUploadClick,
  isDevOrAdmin = false,
  onAdminGrantGift,
  onAdminRevokeGift
}) => {
  const remainingTime = getGrantRemainingTime(giftGrant);
  const isGrantActive = giftGrant !== null && giftGrant.isGranted && !remainingTime.isExpired;

  return (
    <div className="p-3.5 pb-10 overflow-y-auto max-h-[70vh] custom-scrollbar flex-1 bg-white space-y-3">
      {/* Admin Quick Grant Banner (For Admins & Developers to grant or revoke the gift) */}
      {isDevOrAdmin && (
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Gift className="w-4 h-4 text-purple-600 shrink-0" />
            <span className="font-bold">إدارة هدية رفع الخلفية:</span>
            {isGrantActive ? (
              <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                نشطة ({remainingTime.days} يوم متبقي)
              </span>
            ) : (
              <span className="text-slate-400 font-medium">غير ممنوحة</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isGrantActive ? (
              <button
                type="button"
                onClick={onAdminRevokeGift}
                className="px-2 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>إلغاء الهدية</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => onAdminGrantGift?.(7)}
                  className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>منح 7 أيام</span>
                </button>
                <button
                  type="button"
                  onClick={() => onAdminGrantGift?.(30)}
                  className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-xs"
                >
                  <span>30 يوم</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Info Notice when Gift is Active */}
      {isGrantActive && (
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 border border-purple-200/80 rounded-2xl p-2.5 flex items-center justify-between text-xs text-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-[12px] text-purple-950 flex items-center gap-1.5">
                <span>هدية إدارية خاصة لرفع الخلفية</span>
                <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                  سارية المفعول
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  من {remainingTime.formattedGrantedAt} إلى {remainingTime.formattedExpiresAt}
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <Clock className="w-3 h-3 text-emerald-600" />
                  متبقي {remainingTime.days} يوم و {remainingTime.hours} ساعة
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {/* Upload Custom Wallpaper Card (Conditional based on Admin Gift Grant) */}
        {isGrantActive ? (
          // ACTIVE GIFT: Upload is unlocked for the user
          <label className="relative aspect-[9/14] rounded-xl border-2 border-dashed border-purple-400 hover:border-purple-600 bg-purple-50/50 hover:bg-purple-50 flex flex-col items-center justify-center text-purple-800 cursor-pointer transition-all active:scale-95 group shadow-xs p-2 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={onCustomUpload}
              className="hidden"
            />
            {/* Active Gift Badge */}
            <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5 z-10">
              <Gift className="w-2.5 h-2.5" />
              <span>ممنوحة</span>
            </div>

            <div className="w-8 h-8 rounded-full bg-white border border-purple-200 group-hover:border-purple-400 flex items-center justify-center text-purple-600 shadow-xs mb-1 transition-colors">
              <Upload className="w-4 h-4" />
            </div>

            <span className="text-[11px] font-black text-slate-900 leading-tight">
              رفع من الجوال
            </span>
            <span className="text-[9px] font-bold text-purple-600 mt-1">
              متبقي {remainingTime.days} يوم
            </span>
          </label>
        ) : (
          // LOCKED: No active grant from administration
          <div
            onClick={onLockedUploadClick}
            className="relative aspect-[9/14] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/90 hover:bg-slate-100/80 flex flex-col items-center justify-center text-slate-400 cursor-pointer transition-all active:scale-95 group shadow-2xs p-2 text-center"
          >
            {/* Lock Badge */}
            <div className="absolute top-1.5 right-1.5 bg-slate-200 text-slate-600 text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
              <Lock className="w-2.5 h-2.5" />
              <span>مغلقة</span>
            </div>

            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 group-hover:border-slate-300 flex items-center justify-center text-slate-400 group-hover:text-amber-500 shadow-xs mb-1 transition-colors">
              <Gift className="w-4 h-4" />
            </div>

            <span className="text-[10px] font-bold text-slate-700 leading-tight">
              رفع من الجوال
            </span>
            <span className="text-[8px] text-amber-600 font-bold mt-1 bg-amber-50 px-1 py-0.5 rounded border border-amber-200/60">
              هدية إدارية 🔒
            </span>
          </div>
        )}

        {/* Wallpapers List */}
        {wallpapers.map((bg) => {
          const isEquipped = bg.imageUrl === equippedBgUrl;
          const isCustom = bg.id.startsWith('custom-');

          return (
            <div
              key={bg.id}
              onClick={() => onSelectWallpaper(bg)}
              className={`relative aspect-[9/14] rounded-xl overflow-hidden shadow-xs cursor-pointer transition-all duration-200 group border-2 ${
                isEquipped
                  ? 'border-[#00c765] shadow-md ring-2 ring-[#00c765]/30'
                  : 'border-transparent hover:border-slate-300'
              }`}
            >
              <img
                src={bg.imageUrl}
                alt={bg.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />

              {/* Custom Gift Indicator */}
              {isCustom && (
                <div className="absolute bottom-1.5 inset-x-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold py-0.5 px-1 rounded-md text-center flex items-center justify-center gap-1 truncate">
                  <Gift className="w-2.5 h-2.5 text-purple-400" />
                  <span className="truncate">خلفية خاصة</span>
                </div>
              )}

              {/* Equipped Checkmark Overlay */}
              {isEquipped && (
                <div className="absolute top-1.5 right-1.5 bg-[#00c765] text-white p-0.5 rounded-full shadow-md z-10 flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailableWallpapersTab;
