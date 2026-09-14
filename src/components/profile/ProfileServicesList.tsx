import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronLeft } from 'lucide-react';
import { AdminRole } from '../../lib/adminRoleService';
import { 
  AgencyAdmin3DIcon, 
  ThemeAdmin3DIcon, 
  Broker3DIcon, 
  Moderator3DIcon,
  VipCenter3DIcon,
  Genius3DIcon,
  FriendlyPoints3DIcon,
  InviteCenter3DIcon,
  InviteCard3DIcon,
  Mall3DIcon,
  OfficialAgency3DIcon,
  BroadcasterCenter3DIcon
} from './RealisticIcons';
import { RoyalThemeStyles } from './ProfileThemeConfig';

interface ProfileServicesListProps {
  adminRole: AdminRole;
  isOwner: boolean;
  curRoyal: RoyalThemeStyles;
  onOpenAgencyAdmin: () => void;
  onOpenThemeAdmin: () => void;
  onOpenBrokerCenter: () => void;
  onOpenModerator: () => void;
  onOpenVipCenter: () => void;
  onOpenGenius: () => void;
  onOpenFriendlyPoints: () => void;
  onOpenInviteCenter: () => void;
  onOpenInviteCard: () => void;
  onOpenMall: () => void;
  onOpenOfficialAgencyManager: () => void;
  onOpenAgencyRep: () => void;
  onOpenAgency: () => void;
  onOpenBroadcasterCenter: () => void;
}

export const ProfileServicesList: React.FC<ProfileServicesListProps> = ({
  adminRole,
  isOwner,
  curRoyal,
  onOpenAgencyAdmin,
  onOpenThemeAdmin,
  onOpenBrokerCenter,
  onOpenModerator,
  onOpenVipCenter,
  onOpenGenius,
  onOpenFriendlyPoints,
  onOpenInviteCenter,
  onOpenInviteCard,
  onOpenMall,
  onOpenOfficialAgencyManager,
  onOpenAgencyRep,
  onOpenAgency,
  onOpenBroadcasterCenter
}) => {
  return (
    <div className={`relative ${curRoyal.listWrapper} rounded-3xl p-2 space-y-1 shadow-xs transition-all duration-300`} dir="rtl">
      {/* Dev Badge #5 */}
      <span className="absolute -top-2.5 left-2 z-50 w-6 h-6 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shadow-lg border-2 border-white pointer-events-none select-none">
        #5
      </span>
      
      {/* 1. إداري الوكالات (Agency Admin) */}
      {adminRole === 'agency_admin' && (
        <motion.div 
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenAgencyAdmin}
          className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 shadow-[0_4px_18px_rgba(2,132,199,0.25)] cursor-pointer group text-right transition-all duration-300"
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-sky-700 via-blue-600 to-indigo-700 text-white border border-sky-300/80 shadow-[0_2px_8px_rgba(2,132,199,0.4)] font-sans tracking-wide">
              <Sparkles className="w-3 h-3 text-cyan-200 fill-cyan-200 animate-pulse" />
              <span>لوحة إدارة الوكالات</span>
            </span>
          </div>

          <div className="bg-gradient-to-br from-sky-950 via-slate-900 to-slate-950 text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-sky-400/40 group-hover:border-sky-300 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 relative z-10">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-sky-900/90 to-slate-950 border border-sky-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <AgencyAdmin3DIcon className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-white group-hover:text-sky-300 transition-colors truncate">
                    لوحة إدارة الوكالات
                  </h4>
                  <span className="text-[9.5px] font-black bg-sky-500/20 text-sky-200 border border-sky-400/40 px-2 py-0.5 rounded-full shadow-2xs">
                    إداري وكالات 🏛️
                  </span>
                </div>
                <span className="text-[10.5px] text-sky-100/85 font-bold block mt-0.5 truncate">
                  متابعة واعتماد الوكالات، مراقبة التارغت والوسطاء
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-sky-300 to-cyan-200 border border-sky-200 px-3 py-1.5 rounded-xl shadow-2xs group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
              <span>دخول</span>
              <ChevronLeft className="w-4 h-4 text-slate-950" />
            </div>
          </div>
        </motion.div>
      )}

      {/* 2. إداري الثيمات والمتجر (Theme Admin) */}
      {adminRole === 'theme_admin' && (
        <motion.div 
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenThemeAdmin}
          className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-[#7E22CE] via-[#D946EF] to-[#6366F1] shadow-[0_4px_18px_rgba(147,51,234,0.28)] cursor-pointer group text-right transition-all duration-300"
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-700 text-white border border-purple-300/80 shadow-[0_2px_8px_rgba(147,51,234,0.4)] font-sans tracking-wide">
              <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
              <span>لوحة الثيمات والمتجر</span>
            </span>
          </div>

          <div className="bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-purple-400/40 group-hover:border-purple-300 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 relative z-10">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-purple-900/90 to-slate-950 border border-purple-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ThemeAdmin3DIcon className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-white group-hover:text-purple-300 transition-colors truncate">
                    لوحة إدارة الثيمات والمتجر
                  </h4>
                  <span className="text-[9.5px] font-black bg-purple-500/20 text-purple-200 border border-purple-400/40 px-2 py-0.5 rounded-full shadow-2xs">
                    إداري ثيمات 🎨
                  </span>
                </div>
                <span className="text-[10.5px] text-purple-100/85 font-bold block mt-0.5 truncate">
                  تصاميم الغرف الصوتية، لوحات الشرف، وعناصر المتجر
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-purple-300 to-fuchsia-200 border border-purple-200 px-3 py-1.5 rounded-xl shadow-2xs group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
              <span>دخول</span>
              <ChevronLeft className="w-4 h-4 text-slate-950" />
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. الوسيط المعتمد (Broker) */}
      {adminRole === 'broker' && (
        <motion.div 
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenBrokerCenter}
          className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 shadow-[0_4px_18px_rgba(13,148,136,0.25)] cursor-pointer group text-right transition-all duration-300"
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white border border-teal-300/80 shadow-[0_2px_8px_rgba(13,148,136,0.4)] font-sans tracking-wide">
              <Sparkles className="w-3 h-3 text-teal-200 fill-teal-200 animate-pulse" />
              <span>لوحة الوسيط المعتمد</span>
            </span>
          </div>

          <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-teal-400/40 group-hover:border-teal-300 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 relative z-10">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-teal-900/90 to-slate-950 border border-teal-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Broker3DIcon className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-white group-hover:text-teal-300 transition-colors truncate">
                    مركز الوساطة والتوظيف
                  </h4>
                  <span className="text-[9.5px] font-black bg-teal-500/20 text-teal-200 border border-teal-400/40 px-2 py-0.5 rounded-full shadow-2xs">
                    وسيط معتمد 🤝
                  </span>
                </div>
                <span className="text-[10.5px] text-teal-100/85 font-bold block mt-0.5 truncate">
                  استقطاب المذيعين، متابعة ساعات البث والعمولات
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-teal-300 to-emerald-200 border border-teal-200 px-3 py-1.5 rounded-xl shadow-2xs group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
              <span>دخول</span>
              <ChevronLeft className="w-4 h-4 text-slate-950" />
            </div>
          </div>
        </motion.div>
      )}

      {/* 4. المراقب العام والدعم الفني (Moderator) */}
      {adminRole === 'moderator' && (
        <motion.div 
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenModerator}
          className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 shadow-[0_4px_18px_rgba(217,119,6,0.25)] cursor-pointer group text-right transition-all duration-300"
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-amber-700 via-orange-600 to-rose-700 text-white border border-amber-300/80 shadow-[0_2px_8px_rgba(217,119,6,0.4)] font-sans tracking-wide">
              <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200 animate-pulse" />
              <span>لوحة الرقابة والدعم العام</span>
            </span>
          </div>

          <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-950 text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-amber-400/40 group-hover:border-amber-300 transition-all duration-300 relative overflow-hidden">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 relative z-10">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-amber-900/90 to-slate-950 border border-amber-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Moderator3DIcon className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate">
                    لوحة المراقب العام والدعم
                  </h4>
                  <span className="text-[9.5px] font-black bg-amber-500/20 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded-full shadow-2xs">
                    مراقب عام 🛡️
                  </span>
                </div>
                <span className="text-[10.5px] text-amber-100/85 font-bold block mt-0.5 truncate">
                  متابعة البلاغات، إدارة الحظر، والمراقبة الحية للغرف
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-300 to-yellow-200 border border-amber-200 px-3 py-1.5 rounded-xl shadow-2xs group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
              <span>دخول</span>
              <ChevronLeft className="w-4 h-4 text-slate-950" />
            </div>
          </div>
        </motion.div>
      )}

      {/* شبكة الخدمات الملكية المخصصة (واحد يمين وواحد شمال) */}
      <div className="grid grid-cols-2 gap-x-2.5 gap-y-3.5 pt-3 pb-1.5" dir="rtl">
        {/* الصف 1 يمين: مركز VIP */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenVipCenter}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-mono tracking-wider transition-all duration-300`}>
              VIP 8
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <VipCenter3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  مركز VIP
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  المزايا والامتيازات
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>

        {/* الصف 1 شمال: جينيس */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenGenius}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
              Genius
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <Genius3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  جينيس
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  الأرقام القياسية
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>

        {/* الصف 2 يمين: نقاط ودية */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenFriendlyPoints}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-mono tracking-wider transition-all duration-300`}>
              2963
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <FriendlyPoints3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  نقاط ودية
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  رصيد التفاعل
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>

        {/* الصف 2 شمال: مركز الدعوة */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenInviteCenter}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
              ادع واربح
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <InviteCenter3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  مركز الدعوة
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  مكافآت الانضمام
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>

        {/* الصف 3 يمين: بطاقة الدعوة */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenInviteCard}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
              مشاركة
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <InviteCard3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  بطاقة الدعوة
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  كود الدعوة الملكي
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>

        {/* الصف 3 شمال: المركز التجاري */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenMall}
          className={`relative p-[2px] rounded-2xl ${curRoyal.outerBorder} ${curRoyal.shadow} active:scale-95 transition-all duration-300 cursor-pointer group text-right w-full`}
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[9px] font-black ${curRoyal.pillBadge} border font-sans tracking-wide transition-all duration-300`}>
              المتجر
            </span>
          </div>
          <div className={`${curRoyal.innerBg} rounded-[14px] p-2.5 sm:p-3 flex items-center justify-between border ${curRoyal.innerBorder} group-hover:bg-white/90 transition-all duration-300 w-full h-full`}>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${curRoyal.plinthBg} flex items-center justify-center shrink-0`}>
                <Mall3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-xs font-black ${curRoyal.titleText} transition-colors truncate`}>
                  المركز التجاري
                </h4>
                <span className={`text-[9.5px] sm:text-[10px] ${curRoyal.subText} font-bold block mt-0.5 truncate`}>
                  الهدايا والعناصر
                </span>
              </div>
            </div>
            <ChevronLeft className={`w-4 h-4 ${curRoyal.chevron} transition-transform group-hover:-translate-x-0.5 shrink-0 mr-0.5`} />
          </div>
        </motion.button>
      </div>

      {/* إدارة المتجر وثيمات التطبيق */}
      {(adminRole === 'theme_admin' || adminRole === 'super_admin' || isOwner) && (
        <motion.div 
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenThemeAdmin}
          className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-[#7E22CE] via-[#D946EF] to-[#6366F1] shadow-[0_4px_18px_rgba(147,51,234,0.28)] cursor-pointer group transition-all duration-300"
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-700 text-white border border-purple-300/80 shadow-[0_2px_8px_rgba(147,51,234,0.4)] font-sans tracking-wide">
              <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
              <span>إداري الثيمات والمتجر</span>
            </span>
          </div>

          <div className="bg-gradient-to-r from-[#FAF5FF] via-[#FDF4FF] to-[#F5F3FF] rounded-[14px] p-3 flex items-center justify-between border border-[#E9D5FF]/90 group-hover:bg-white transition-all relative overflow-hidden">
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#6B21A8] via-[#A855F7] to-[#F472B6] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(147,51,234,0.35)] text-lg border border-white/80 shrink-0 group-hover:scale-105 transition-transform">
                🎨
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-[#4C1D95] tracking-wide">إدارة المتجر وثيمات التطبيق</span>
                  <span className="text-[9px] bg-gradient-to-r from-[#7E22CE] to-[#6366F1] text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                    إداري ثيمات 🎨
                  </span>
                </div>
                <span className="text-[10px] text-[#7E22CE] font-bold block mt-0.5">رفع صور VIP، إدارة عناصر المتجر، وثيمات الغرف</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-[#6B21A8] bg-white/95 border border-[#D8B4FE]/60 px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-gradient-to-r group-hover:from-[#7E22CE] group-hover:to-[#6366F1] group-hover:text-white group-hover:border-transparent transition-all shrink-0 relative z-10">
              <span>إدارة</span>
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        </motion.div>
      )}

      {/* مدير الوكالات الرسمية والمندوبين */}
      <motion.div 
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenOfficialAgencyManager}
        className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-[#0369A1] via-[#0284C7] to-[#0D9488] shadow-[0_4px_20px_rgba(2,132,199,0.3)] cursor-pointer group transition-all duration-300"
      >
        <div className="absolute -top-2.5 right-4 z-20">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-sky-700 via-cyan-600 to-teal-700 text-white border border-cyan-300/80 shadow-[0_2px_8px_rgba(2,132,199,0.4)] font-sans tracking-wide">
            <Sparkles className="w-3 h-3 text-cyan-200 fill-cyan-200 animate-pulse" />
            <span>الرئاسة الرسمية للوكالات</span>
          </span>
        </div>

        <div className="bg-gradient-to-r from-[#F0F9FF] via-[#E0F2FE] to-[#F0FDFA] rounded-[14px] p-3 flex items-center justify-between border border-[#BAE6FD]/90 group-hover:bg-white transition-all relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0369A1] via-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(2,132,199,0.35)] text-lg border border-white/80 shrink-0 group-hover:scale-105 transition-transform">
              👑
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#0C4A6E] tracking-wide">مدير الوكالات الرسمية والمندوبين</span>
                <span className="text-[9px] bg-gradient-to-r from-[#0284C7] to-[#0D9488] text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  رئيس الوكالات 💎
                </span>
              </div>
              <span className="text-[10px] text-[#0369A1] font-bold block mt-0.5">استدعاء وكالات رسمية، تعيين المندوبين، وفتح وإغلاق الصلاحيات</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black text-[#0369A1] bg-white/95 border border-[#7DD3FC]/60 px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-gradient-to-r group-hover:from-[#0284C7] group-hover:to-[#0D9488] group-hover:text-white group-hover:border-transparent transition-all shrink-0 relative z-10">
            <span>إدارة</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>
      </motion.div>

      {/* مندوب وكالات */}
      <motion.div 
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenAgencyRep}
        className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-[#334155] via-[#64748B] to-[#94A3B8] shadow-[0_4px_18px_rgba(71,85,105,0.28)] cursor-pointer group transition-all duration-300"
      >
        <div className="absolute -top-2.5 right-4 z-20">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-slate-700 via-slate-800 to-zinc-800 text-white border border-slate-400/80 shadow-[0_2px_8px_rgba(71,85,105,0.4)] font-sans tracking-wide">
            <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
            <span>لوحة المندوب المعتمد</span>
          </span>
        </div>

        <div className="bg-gradient-to-r from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] rounded-[14px] p-3 flex items-center justify-between border border-[#CBD5E1]/90 group-hover:bg-white transition-all relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#334155] via-[#64748B] to-[#94A3B8] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(71,85,105,0.35)] text-lg border border-white/80 shrink-0 group-hover:scale-105 transition-transform">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-[#1E293B] tracking-wide">مندوب وكالات</span>
                <span className="text-[9px] bg-gradient-to-r from-[#475569] to-[#334155] text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  استدعاء وكلاء 🔱
                </span>
              </div>
              <span className="text-[10px] text-[#475569] font-bold block mt-0.5">صلاحية استدعاء وكلاء رسميين ومتابعة الأرباح والعمولات</span>
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenAgencyRep();
            }}
            className="flex items-center gap-1.5 text-xs font-black text-[#334155] bg-white/95 border border-[#94A3B8]/60 px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-gradient-to-r group-hover:from-[#475569] group-hover:to-[#334155] group-hover:text-white group-hover:border-transparent transition-all shrink-0 relative z-10 cursor-pointer active:scale-95"
          >
            <span>إدارة</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* وكالتي (الوكيل الرسمي أو السوبر أدمن) */}
      {(adminRole === 'official_agent' || adminRole === 'super_admin') && (
        <motion.div 
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenAgency}
          className="relative my-2.5 p-[2px] rounded-2xl bg-gradient-to-r from-[#D4AF37] via-[#10B981] via-[#F59E0B] to-[#D4AF37] bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] shadow-[0_4px_20px_rgba(16,185,129,0.25),0_0_12px_rgba(212,175,55,0.35)] cursor-pointer group text-right transition-all duration-300"
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white border border-emerald-300/80 shadow-[0_2px_8px_rgba(16,185,129,0.4)] font-sans tracking-wide">
              <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
              <span>لوحة الوكالة الرسمية</span>
            </span>
          </div>

          <div className="bg-gradient-to-br from-[#064E3B]/95 via-[#065F46] to-[#042F2C] text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-emerald-400/40 group-hover:border-emerald-300 group-hover:from-[#065F46] group-hover:to-[#022c22] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-400/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />

            <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-emerald-900/90 to-slate-950 border border-emerald-400/60 shadow-[0_2px_10px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.2)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <OfficialAgency3DIcon className="w-8 h-8" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-emerald-950 shadow-xs flex items-center justify-center text-[7px] font-black text-slate-950">
                  ★
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate tracking-wide drop-shadow-xs">
                    وكالتي
                  </h4>
                  <span className="text-[9.5px] font-black bg-gradient-to-r from-amber-400/25 to-amber-500/30 text-amber-200 border border-amber-400/50 px-2 py-0.5 rounded-full shadow-2xs font-mono">
                    وكيل معتمد 💼
                  </span>
                </div>
                <span className="text-[10.5px] text-emerald-100/85 font-bold block mt-0.5 truncate">
                  إدارة المذيعين، الوسطاء، العقود والرواتب
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 border border-amber-200 px-3 py-1.5 rounded-xl shadow-[0_2px_8px_rgba(245,158,11,0.3)] group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
              <span>إدارة</span>
              <ChevronLeft className="w-4 h-4 text-slate-950" />
            </div>
          </div>
        </motion.div>
      )}

      {/* مركز الوسطاء */}
      <motion.div 
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenBrokerCenter}
        className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-[#0D404C] via-[#104D5B] to-[#165F6F] shadow-[0_4px_18px_rgba(16,77,91,0.28)] cursor-pointer group transition-all duration-300"
      >
        <div className="absolute -top-2.5 right-4 z-20">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-teal-800 via-teal-700 to-cyan-800 text-white border border-teal-300/80 shadow-[0_2px_8px_rgba(16,77,91,0.4)] font-sans tracking-wide">
            <Sparkles className="w-3 h-3 text-teal-300 fill-teal-300 animate-pulse" />
            <span>لوحة الوسيط المعتمد (من وكالتي)</span>
          </span>
        </div>

        <div className="bg-gradient-to-r from-teal-50/90 via-sky-50/80 to-slate-50/90 rounded-[14px] p-3 flex items-center justify-between border border-teal-200/80 group-hover:bg-white transition-all relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0D404C] via-[#104D5B] to-[#165F6F] flex items-center justify-center text-white shadow-md text-lg shrink-0 group-hover:scale-105 transition-transform">
              🤝
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 tracking-wide">مركز الوسطاء</span>
                <span className="text-[9px] bg-[#104D5B] text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  صلاحية وسيط 💎
                </span>
              </div>
              <span className="text-[10px] text-[#104D5B] font-bold block mt-0.5">صلاحية ممنوحة من وكالتي لمتابعة المذيعين التابعين لي، ساعات البث، والعمولات المحسوبة</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black text-[#104D5B] bg-white/90 border border-teal-200 px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-[#104D5B] group-hover:text-white transition-all shrink-0 relative z-10">
            <span>إدارة</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>
      </motion.div>

      {/* مركز المذيعين */}
      <motion.div 
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        onClick={onOpenBroadcasterCenter}
        className="relative my-3 p-[2px] rounded-2xl bg-gradient-to-r from-rose-300/85 via-fuchsia-200/80 to-purple-300/85 shadow-[0_4px_18px_rgba(244,63,94,0.12),0_1px_3px_rgba(0,0,0,0.04)] cursor-pointer group transition-all duration-300"
      >
        <div className="absolute -top-2.5 right-4 z-20">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white border border-rose-200/60 shadow-[0_2px_8px_rgba(244,63,94,0.25)] font-sans tracking-wide">
            <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200 animate-pulse" />
            <span>لوحة مركز المذيعين</span>
          </span>
        </div>

        <div className="bg-gradient-to-r from-[#FFF5F7] via-[#FAF5FF] to-[#F5F3FF] rounded-[14px] p-3 flex items-center justify-between border border-rose-200/70 group-hover:border-rose-300/90 group-hover:from-white group-hover:to-[#FFF5F7] transition-all relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-rose-300/15 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-6 -top-6 w-24 h-24 bg-purple-300/15 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-b from-white via-rose-50/70 to-purple-50/90 border border-rose-200/80 shadow-[0_2px_10px_rgba(244,63,94,0.10),inset_0_1px_2px_rgba(255,255,255,1)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <BroadcasterCenter3DIcon className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 rounded-full border border-white shadow-2xs flex items-center justify-center text-[7.5px] font-black text-amber-950">
                ★
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 group-hover:text-rose-950 transition-colors tracking-wide">
                  مركز المذيعين
                </span>
                <span className="text-[9px] bg-gradient-to-r from-rose-100 to-pink-100 text-rose-700 border border-rose-200/80 font-extrabold px-2 py-0.5 rounded-full shadow-2xs font-mono">
                  مُميّز ✨
                </span>
              </div>
              <span className="text-[10px] text-slate-600 font-bold block mt-0.5 group-hover:text-slate-700">
                إحصائيات البث، الأرباح، والعقود
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-700 bg-white/95 border border-rose-200/90 px-3 py-1.5 rounded-xl shadow-2xs group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-pink-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_2px_8px_rgba(244,63,94,0.3)] transition-all shrink-0 relative z-10">
            <span>إدارة</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>
      </motion.div>

    </div>
  );
};
