import React from 'react';
import { motion } from 'motion/react';
import {
  Copy,
  Check,
  Pencil,
  Settings,
  Headphones,
  ChevronLeft,
  Crown,
  Sparkles,
  Sun,
  Moon,
  RefreshCw,
  Smartphone
} from 'lucide-react';
import { UserProfileData, StatItem } from '../../../types';
import { RoyalThemeMode, RoyalThemeStyles } from '../ProfileThemeConfig';
import {
  Visitors3DIcon,
  Friends3DIcon,
  Following3DIcon,
  Likes3DIcon
} from '../RealisticIcons';
import { RolesSummary } from '../../../lib/hierarchyService';
import { Role, ROLES } from '../../../lib/permissions';

export interface HeroHeaderProps {
  profile: UserProfileData;
  royalTheme: RoyalThemeMode;
  cycleRoyalTheme: () => void;
  curRoyal: RoyalThemeStyles;
  isProfileRefreshing: boolean;
  handleProfileManualRefresh: () => void;
  dashboardBadges: {
    showVipBadge: boolean;
    vipLevel?: string;
    vipDesignStyle?: string;
    showSupporterBadge: boolean;
    supporterLevel: number;
    showCharmBadge: boolean;
    charmLevel: number;
  };
  getSupporterBadgeStyle: () => string;
  getCharmBadgeStyle: () => string;
  copiedId: boolean;
  handleCopyId: () => void;
  userHierarchyCode: string | null;
  userRole: Role;
  isOwner: boolean;
  rolesSummary: RolesSummary;
  socialStats: {
    visitors: number;
    friends: number;
    followers: number;
    likes: number;
  };
  onOpenSettings: () => void;
  onOpenCustomerService: () => void;
  onOpenDownloadApk: () => void;
  onOpenUserProfile: () => void;
  onOpenEditProfile: () => void;
  onOpenVipCenter: () => void;
  onOpenLevelModal: () => void;
  onOpenSuperLegend: () => void;
  onSelectStat: (statId: StatItem['id']) => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({
  profile,
  royalTheme,
  cycleRoyalTheme,
  curRoyal,
  isProfileRefreshing,
  handleProfileManualRefresh,
  dashboardBadges,
  getSupporterBadgeStyle,
  getCharmBadgeStyle,
  copiedId,
  handleCopyId,
  userHierarchyCode,
  userRole,
  isOwner,
  rolesSummary,
  socialStats,
  onOpenSettings,
  onOpenCustomerService,
  onOpenDownloadApk,
  onOpenUserProfile,
  onOpenEditProfile,
  onOpenVipCenter,
  onOpenLevelModal,
  onOpenSuperLegend,
  onSelectStat
}) => {
  return (
    <div className="bg-gradient-to-b from-[#E2F1ED] via-[#EDF5F2] to-[#F3F6F9] px-4 pt-3 pb-2">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full bg-white/80 shadow-xs hover:bg-white text-slate-700 transition-all cursor-pointer"
            title="الإعدادات"
          >
            <Settings className="w-5 h-5 text-slate-700" />
          </button>
          <button
            onClick={handleProfileManualRefresh}
            disabled={isProfileRefreshing}
            className="p-2 rounded-full bg-white/80 shadow-xs hover:bg-white text-slate-700 transition-all cursor-pointer"
            title="تحديث البيانات اللحظية من السيرفر"
          >
            <RefreshCw className={`w-5 h-5 text-slate-700 ${isProfileRefreshing ? 'animate-spin text-amber-500' : ''}`} />
          </button>
          <button
            onClick={onOpenCustomerService}
            className="p-2 rounded-full bg-white/80 shadow-xs hover:bg-white text-slate-700 transition-all cursor-pointer"
            title="خدمة العملاء والإنصات"
          >
            <Headphones className="w-5 h-5 text-slate-700" />
          </button>
          <button
            onClick={onOpenDownloadApk}
            className="px-2.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-xs hover:bg-emerald-500/25 text-emerald-800 font-black text-[11px] flex items-center gap-1 transition-all cursor-pointer"
            title="تنزيل وتثبيت تطبيق الأندرويد APK"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>تطبيق APK 📲</span>
          </button>

          {/* زر تبديل النمط الملكي الموحد */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={cycleRoyalTheme}
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
        </div>
        <span className="text-xs font-mono font-medium text-slate-500">7:35</span>
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

        {/* User Info (Name, Badges, ID) - Center/Right aligned */}
        <div className="flex-1 mr-3 text-right flex flex-col justify-center space-y-1.5">
          {/* User Name in Red */}
          <h1 
            onClick={onOpenUserProfile}
            className="text-xl sm:text-2xl font-black text-[#E53E3E] tracking-tight cursor-pointer hover:underline"
          >
            {profile.name}
          </h1>

          {/* Badges Row */}
          <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto no-scrollbar py-0.5 select-none max-w-full" dir="ltr">
            {/* 1. VIP Micro-Capsule */}
            {dashboardBadges.showVipBadge && (
              <span
                onClick={onOpenVipCenter}
                className={`inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] font-black border shadow-2xs cursor-pointer shrink-0 active:scale-95 transition-transform ${
                  dashboardBadges.vipDesignStyle === 'royal_gold_3d'
                    ? 'bg-gradient-to-r from-[#78350F] via-[#B45309] to-[#D97706] text-amber-200 border-amber-300/50 shadow-[0_1px_4px_rgba(217,119,6,0.35)]'
                    : 'bg-gradient-to-r from-purple-800 to-indigo-900 text-purple-200 border-purple-400/50'
                }`}
                title={`عضوية النخبة ${dashboardBadges.vipLevel || profile.vipLevel || 'VIP10'}`}
              >
                <Crown className="w-2.5 h-2.5 text-amber-300 fill-amber-300 shrink-0" />
                <span className="font-mono tracking-tight leading-none">{dashboardBadges.vipLevel || profile.vipLevel || 'VIP10'}</span>
              </span>
            )}

            {/* 2. Supporter Micro-Capsule */}
            {dashboardBadges.showSupporterBadge && (
              <span
                onClick={onOpenLevelModal}
                className={`inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] font-black border shrink-0 cursor-pointer active:scale-95 transition-transform ${getSupporterBadgeStyle()}`}
                title={`مستوى الداعم المعتمد من السيرفر: ${dashboardBadges.supporterLevel}`}
              >
                <span className="text-[10px] leading-none shrink-0 filter drop-shadow">🔥</span>
                <span className="font-mono font-black tracking-tight leading-none">{dashboardBadges.supporterLevel}</span>
              </span>
            )}

            {/* 3. Charm / Receiver Micro-Capsule */}
            {dashboardBadges.showCharmBadge && (
              <span
                onClick={onOpenLevelModal}
                className={`inline-flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] font-black border shrink-0 cursor-pointer active:scale-95 transition-transform ${getCharmBadgeStyle()}`}
                title={`مستوى الكاريزما والشهرة المعتمد من السيرفر: ${dashboardBadges.charmLevel}`}
              >
                <span className="text-[10px] leading-none shrink-0 filter drop-shadow">💎</span>
                <span className="font-mono font-black tracking-tight leading-none">{dashboardBadges.charmLevel}</span>
              </span>
            )}

            {/* 4. Super Legend SL1 Badge */}
            <span
              onClick={onOpenSuperLegend}
              className="inline-flex items-center gap-0.5 px-2 py-[2px] rounded-full text-[10px] font-black border border-amber-300/40 bg-gradient-to-r from-amber-700 via-amber-600 to-yellow-600 text-amber-100 shadow-2xs cursor-pointer shrink-0 active:scale-95 transition-transform"
              title="عضوية الأساطير SL1"
            >
              <span className="text-[10px] leading-none shrink-0">🐺</span>
              <span className="font-mono leading-none tracking-tight">SL1</span>
            </span>
          </div>

          {/* ID + Developer Badge Row */}
          <div className="flex items-center gap-2 pt-0.5 flex-wrap">
            <button
              onClick={handleCopyId}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[11px] font-mono text-slate-700 transition-all shadow-2xs cursor-pointer active:scale-95 shrink-0"
              title="نسخ المعرف"
            >
              <span className="font-bold">ID:{profile.userId}</span>
              {copiedId ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400" />
              )}
            </button>

            {/* شارة المطور */}
            {(isOwner || rolesSummary.isSuperAdmin || profile.userId === '1001001') && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border border-amber-300/60 bg-gradient-to-r from-red-700 via-rose-600 to-amber-600 text-white shadow-2xs shrink-0 font-sans"
                title="المطور الأساسي والسوبر أدمن"
              >
                <Sparkles className="w-2.5 h-2.5 text-amber-300 fill-amber-300 shrink-0 animate-pulse" />
                <span className="leading-none text-[9.5px]">المطور 👑</span>
              </span>
            )}
          </div>
        </div>

        {/* Left Arrow Icon on FAR LEFT */}
        <button className="text-slate-400 hover:text-slate-600 transition-colors p-1">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Statistics 4 Columns Row */}
      <div className="grid grid-cols-4 gap-2 text-center mt-5 mb-2 px-1" dir="rtl">
        {/* 1. Visitors */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectStat('visitors')}
          className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
        >
          <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
            <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
              <Visitors3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
              {socialStats.visitors.toLocaleString('en-US')}
            </div>
            <div className={`text-[10px] sm:text-[11px] ${curRoyal.subText} font-black mt-0.5 whitespace-nowrap transition-colors`}>
              الزوار
            </div>
          </div>
        </motion.div>

        {/* 2. Friends */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectStat('friends')}
          className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
        >
          <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
            <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
              <Friends3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
              {socialStats.friends.toLocaleString('en-US')}
            </div>
            <div className={`text-[10px] sm:text-[11px] ${curRoyal.subText} font-black mt-0.5 whitespace-nowrap transition-colors`}>
              الأصدقاء
            </div>
          </div>
        </motion.div>

        {/* 3. Following */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectStat('followers')}
          className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
        >
          <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
            <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
              <Following3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
              {socialStats.followers.toLocaleString('en-US')}
            </div>
            <div className={`text-[10px] sm:text-[11px] ${curRoyal.subText} font-black mt-0.5 whitespace-nowrap transition-colors`}>
              تمت متابعتهم
            </div>
          </div>
        </motion.div>

        {/* 4. Likes */}
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectStat('likes')}
          className={`relative p-[1.5px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} transition-all duration-300 cursor-pointer group`}
        >
          <div className={`${curRoyal.innerBg} rounded-[14.5px] p-2 sm:p-2.5 flex flex-col items-center justify-center border ${curRoyal.innerBorder} h-full transition-all duration-300`}>
            <div className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center mb-1 group-hover:scale-105 transition-all shrink-0`}>
              <Likes3DIcon className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className={`text-sm sm:text-base font-black ${curRoyal.titleText} font-mono leading-tight tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]`}>
              {socialStats.likes.toLocaleString('en-US')}
            </div>
            <div className={`text-[10px] sm:text-[11px] ${curRoyal.subText} font-black mt-0.5 whitespace-nowrap transition-colors`}>
              المعجبين
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroHeader;
