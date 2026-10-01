import React from 'react';
import { motion } from 'motion/react';
import { Settings, Headphones, Sparkles, Sun, Moon, Crown, Pencil, Check, Copy, ChevronLeft } from 'lucide-react';
import { UserProfileData } from '../../types';
import { RoyalThemeMode } from './ProfileThemeConfig';

interface ProfileHeaderProps {
  profile: UserProfileData;
  royalTheme: RoyalThemeMode;
  isOwner: boolean;
  copiedId: boolean;
  onCopyId: () => void;
  onCycleTheme: () => void;
  onOpenSettings: () => void;
  onOpenCustomerService: () => void;
  onOpenSuperAdmin: () => void;
  onOpenUserProfile: () => void;
  onOpenEditProfile: () => void;
  onOpenVipCenter: () => void;
  onOpenSuperLegend: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  royalTheme,
  isOwner,
  copiedId,
  onCopyId,
  onCycleTheme,
  onOpenSettings,
  onOpenCustomerService,
  onOpenSuperAdmin,
  onOpenUserProfile,
  onOpenEditProfile,
  onOpenVipCenter,
  onOpenSuperLegend
}) => {
  // تلوين خلفية الهيدر ديناميكياً مع النمط الملكي المختار
  const headerBgClass =
    royalTheme === 'gold'
      ? 'bg-gradient-to-b from-[#FAF5E8] via-[#FFF9ED] to-[#FAF5E8]/80 text-[#5C3F13]'
      : royalTheme === 'white'
      ? 'bg-gradient-to-b from-[#E2F1ED] via-[#EDF5F2] to-[#F3F6F9] text-slate-800'
      : 'bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0B1120] text-slate-100';

  return (
    <div className={`relative ${headerBgClass} px-4 pt-3 pb-2 transition-colors duration-300`}>
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-full shadow-xs transition-all cursor-pointer ${
              royalTheme === 'dark' 
                ? 'bg-slate-800/90 text-slate-200 hover:bg-slate-700' 
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
            title="الإعدادات"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenCustomerService}
            className={`p-2 rounded-full shadow-xs transition-all cursor-pointer ${
              royalTheme === 'dark' 
                ? 'bg-slate-800/90 text-slate-200 hover:bg-slate-700' 
                : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
            title="خدمة العملاء والإنصات"
          >
            <Headphones className="w-5 h-5" />
          </button>

          {/* زر تبديل النمط الملكي الموحد */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={onCycleTheme}
            className={`px-2.5 py-1.5 rounded-full text-xs font-black shadow-xs border flex items-center gap-1.5 cursor-pointer transition-all duration-300 ${
              royalTheme === 'gold'
                ? 'bg-gradient-to-r from-[#FFFDF9] via-[#FAF5E8] to-[#FFF9ED] border-[#DFC386] text-[#7E4F0B] shadow-[0_2px_8px_rgba(180,140,50,0.2)] hover:border-[#B38022]'
                : royalTheme === 'white'
                ? 'bg-white border-slate-300 text-slate-800 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-slate-400'
                : 'bg-gradient-to-r from-[#1E293B] to-[#0F172A] border-slate-700 text-amber-300 shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:border-slate-600'
            }`}
            title={
              royalTheme === 'gold'
                ? 'النمط الذهبي الملكي (انقر للتحويل إلى اللون الأبيض)'
                : royalTheme === 'white'
                ? 'النمط الأبيض النقي (انقر للتحويل إلى اللون الليلي)'
                : 'النمط الليلي الفاخر (انقر للتحويل إلى اللون الذهبي)'
            }
          >
            {royalTheme === 'gold' && <Sparkles className="w-3.5 h-3.5 text-[#B38022] fill-[#B38022]" />}
            {royalTheme === 'white' && <Sun className="w-3.5 h-3.5 text-slate-700" />}
            {royalTheme === 'dark' && <Moon className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />}
            <span className="text-[11px] font-bold">
              {royalTheme === 'gold' ? 'الملكي الذهبي' : royalTheme === 'white' ? 'الأبيض اللؤلؤي' : 'الليلي الملكي'}
            </span>
          </motion.button>

          {/* زر السوبر أدمن (المبرمج / المالك) */}
          {isOwner && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSuperAdmin}
              className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 text-xs font-black shadow-md border border-amber-200 flex items-center gap-1.5 cursor-pointer animate-pulse"
              title="لوحة تحكم السوبر أدمن (المالك والمبرمج)"
            >
              <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>لوحة السوبر أدمن 👑</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* User Info Row */}
      <div className="flex items-center justify-between mt-2">
        {/* Avatar Image on FAR RIGHT */}
        <div className="relative shrink-0 cursor-pointer" onClick={onOpenUserProfile}>
          <img
            src={profile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
            alt={profile.name}
            className="w-20 h-20 sm:w-22 sm:h-22 rounded-full object-cover border-3 border-white shadow-md"
          />
          {/* Pencil Edit Icon Badge */}
          <div 
            onClick={(e) => { e.stopPropagation(); onOpenEditProfile(); }}
            className="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform"
            title="تعديل الملف الشخصي"
          >
            <Pencil className="w-3 h-3 text-white fill-white" />
          </div>
        </div>

        {/* User Info (Name, Badges, ID) */}
        <div className="flex-1 mr-3 text-right flex flex-col justify-center space-y-1.5">
          {/* User Name & ID Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <h1 
              onClick={onOpenUserProfile}
              className="text-xl sm:text-2xl font-black text-[#E53E3E] tracking-tight cursor-pointer hover:underline"
            >
              {profile.name}
            </h1>

            {/* ID + Copy Icon right next to name */}
            <button
              onClick={onCopyId}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/90 text-[10px] text-slate-600 font-mono transition-colors cursor-pointer shrink-0 shadow-2xs"
              title="نسخ المعرف"
            >
              <span className="font-semibold">ID:{profile.userId}</span>
              {copiedId ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto no-scrollbar" dir="rtl">
            {/* 1. VIP Badge (إن وُجد) */}
            {Boolean(profile.vipTier || profile.vipLevel) && (
              <span
                onClick={onOpenVipCenter}
                className="bg-gradient-to-r from-amber-600 via-amber-800 to-slate-900 text-amber-300 px-1.5 py-0.5 rounded-full text-[9px] font-black border border-amber-400/60 shadow-2xs cursor-pointer flex items-center gap-0.5 shrink-0"
              >
                <Crown className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                <span>{profile.vipTier || profile.vipLevel}</span>
              </span>
            )}

            {/* 2. الداعم (التاج والرقم فقط) */}
            <span
              onClick={onOpenSuperLegend}
              className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-800 text-amber-100 px-1.5 py-0.5 rounded-full text-[9px] font-black border border-amber-300/60 shadow-2xs cursor-pointer flex items-center gap-0.5 shrink-0"
            >
              <span className="text-[10px]">👑</span>
              <span className="font-mono font-black">{profile.level || 88}</span>
            </span>

            {/* 3. المدعوم (القلب والرقم فقط) */}
            <span
              onClick={onOpenSuperLegend}
              className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-1.5 py-0.5 rounded-full text-[9px] font-black border border-rose-400/60 shadow-2xs cursor-pointer flex items-center gap-0.5 shrink-0"
            >
              <span className="text-[10px]">💖</span>
              <span className="font-mono font-black">{profile.level || 88}</span>
            </span>

            {/* 4. أمبولة العمر والجنس (أزرق ♂ / وردي ♀) */}
            {profile.gender === 'female' ? (
              <span
                className="bg-pink-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-black border border-pink-400/60 shadow-2xs flex items-center gap-0.5 shrink-0 select-none cursor-default"
                title={`أنثى ♀ • العمر: ${profile.age || 24}`}
              >
                <span className="text-[10px] leading-none">♀</span>
                <span className="font-mono font-black">{profile.age || 24}</span>
              </span>
            ) : (
              <span
                className="bg-sky-500 text-white px-1.5 py-0.5 rounded-full text-[9px] font-black border border-sky-400/60 shadow-2xs flex items-center gap-0.5 shrink-0 select-none cursor-default"
                title={`ذكر ♂ • العمر: ${profile.age || 32}`}
              >
                <span className="text-[10px] leading-none">♂</span>
                <span className="font-mono font-black">{profile.age || 32}</span>
              </span>
            )}
          </div>
        </div>

        {/* Left Arrow Icon on FAR LEFT */}
        <button 
          onClick={onOpenUserProfile}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
