import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Sparkles } from 'lucide-react';
import {
  Broker3DIcon,
  Moderator3DIcon,
  OfficialAgency3DIcon,
  RechargeAgency3DIcon,
  BroadcasterCenter3DIcon
} from '../RealisticIcons';
import { RolesSummary } from '../../../lib/hierarchyService';
import { AdminRole } from '../../../lib/adminRoleService';

export interface AdminCardsProps {
  adminRole: AdminRole;
  rolesSummary: RolesSummary;
  userAgencyStatus: 'none' | 'pending' | 'active' | 'approved' | 'rejected';
  pendingAgencyInfo: { agencyId?: string; agencyName?: string };
  isOwner?: boolean;
  isSuperAdmin?: boolean;
  onOpenBrokerCenter: () => void;
  onOpenModerator: () => void;
  onOpenOfficialAgencyManager: () => void;
  onOpenAgencyRep: () => void;
  onOpenAgency: () => void;
  onOpenRechargeAgency: () => void;
  onHostCenterClick: () => void;
}

export const AdminCards: React.FC<AdminCardsProps> = ({
  adminRole,
  rolesSummary,
  userAgencyStatus,
  pendingAgencyInfo,
  isOwner = false,
  isSuperAdmin = false,
  onOpenBrokerCenter,
  onOpenModerator,
  onOpenOfficialAgencyManager,
  onOpenAgencyRep,
  onOpenAgency,
  onOpenRechargeAgency,
  onHostCenterClick
}) => {
  return (
    <div className="space-y-1" dir="rtl">
      {/* 4. الوسيط المعتمد (Broker) */}
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

      {/* 5. المراقب العام والدعم الفني (Moderator) */}
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

      {/* 6.7 مدير الوكالات الرسمية والمندوبين */}
      {(isOwner || isSuperAdmin || rolesSummary.isManager || rolesSummary.isSuperAdmin) && (
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
      )}

      {/* 6.8 مندوب وكالات */}
      {(isOwner || isSuperAdmin || rolesSummary.isDelegate || rolesSummary.isSuperAdmin) && (
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
      )}

      {/* وكالتي */}
      {(isOwner || isSuperAdmin || rolesSummary.isAgent || rolesSummary.isSuperAdmin) && (
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

      {/* وكالة شحن */}
      {(isOwner || isSuperAdmin || rolesSummary.isRechargeAgent || rolesSummary.isSuperAdmin) && (
        <motion.div 
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenRechargeAgency}
          className="relative my-2.5 p-[2px] rounded-2xl bg-gradient-to-r from-[#FFF0B3] via-[#F59E0B] via-[#D97706] to-[#FFF0B3] bg-[length:200%_auto] animate-[gradient_4s_linear_infinite] shadow-[0_4px_22px_rgba(245,158,11,0.38),0_0_15px_rgba(217,119,6,0.25)] cursor-pointer group text-right transition-all duration-300"
        >
          <div className="absolute -top-2.5 right-4 z-20">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9.5px] font-black bg-gradient-to-r from-amber-600 via-yellow-500 to-orange-600 text-slate-950 border border-yellow-200/90 shadow-[0_2px_10px_rgba(245,158,11,0.5)] font-sans tracking-wide">
              <Sparkles className="w-3 h-3 text-white fill-white animate-pulse" />
              <span>لوحة وكالة الشحن المعتمدة</span>
              <span>🪙</span>
            </span>
          </div>

          <div className="bg-gradient-to-br from-[#2D1602]/95 via-[#451A03] to-[#1F0C01] text-white rounded-[14px] p-3 sm:p-3.5 flex items-center justify-between border border-amber-400/50 group-hover:border-amber-300 group-hover:from-[#3D1E03] group-hover:to-[#260E02] transition-all duration-300 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -left-6 -top-6 w-28 h-28 bg-yellow-400/20 rounded-full blur-xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.15),transparent_70%)] pointer-events-none" />

            <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-b from-amber-950 to-stone-950 border border-amber-400/70 shadow-[0_2px_12px_rgba(245,158,11,0.35),inset_0_1px_2px_rgba(255,255,255,0.3)] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <RechargeAgency3DIcon className="w-8 h-8" />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full border border-amber-950 shadow-xs flex items-center justify-center text-[8px] font-black text-slate-950">
                  ⚡
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-amber-100 group-hover:text-amber-300 transition-colors truncate tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    وكالة شحن
                  </h4>
                  <span className="text-[9.5px] font-black bg-gradient-to-r from-amber-500/30 to-yellow-500/30 text-amber-300 border border-amber-400/60 px-2 py-0.5 rounded-full shadow-2xs font-mono">
                    وكيل شحن معتمد ⚡
                  </span>
                </div>
                <span className="text-[10.5px] text-amber-200/90 font-bold block mt-0.5 truncate">
                  إعادة شحن الكوينزات، خزينة الرصيد، والعمليات
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-black text-slate-950 bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 border border-yellow-200 px-3 py-1.5 rounded-xl shadow-[0_2px_10px_rgba(245,158,11,0.45)] group-hover:scale-105 active:scale-95 transition-all shrink-0 mr-2 relative z-10">
              <span>إدارة</span>
              <ChevronLeft className="w-4 h-4 text-slate-950" />
            </div>
          </div>
        </motion.div>
      )}

      {/* 7. مركز الوسطاء */}
      {(isOwner || isSuperAdmin || rolesSummary.isBroker || rolesSummary.isSuperAdmin) && (
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
      )}

      {/* 8. مركز المضيفين */}
      <motion.div 
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.98 }}
        onClick={onHostCenterClick}
        className={`relative my-3 p-[2px] rounded-2xl cursor-pointer group transition-all duration-300 ${
          userAgencyStatus === 'pending'
            ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 shadow-[0_4px_18px_rgba(245,158,11,0.25)]'
            : (userAgencyStatus === 'active' || userAgencyStatus === 'approved')
            ? 'bg-gradient-to-r from-rose-300/85 via-fuchsia-200/80 to-purple-300/85 shadow-[0_4px_18px_rgba(244,63,94,0.15)]'
            : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 shadow-[0_4px_18px_rgba(16,185,129,0.22)]'
        }`}
      >
        <div className="absolute -top-2.5 right-4 z-20">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-black border shadow-[0_2px_8px_rgba(0,0,0,0.15)] font-sans tracking-wide ${
            userAgencyStatus === 'pending'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-300/70 animate-pulse'
              : (userAgencyStatus === 'active' || userAgencyStatus === 'approved')
              ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white border-rose-200/60'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white border-emerald-300/70'
          }`}>
            <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200 animate-pulse" />
            <span>
              {userAgencyStatus === 'pending'
                ? 'قيد المراجعة ⏳'
                : (userAgencyStatus === 'active' || userAgencyStatus === 'approved')
                ? 'مذيع معتمد 🌟'
                : 'انضم لوكالة ✨'}
            </span>
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
                  مركز المضيفين
                </span>
                <span className={`text-[9px] border font-extrabold px-2 py-0.5 rounded-full shadow-2xs font-mono ${
                  userAgencyStatus === 'pending'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : (userAgencyStatus === 'active' || userAgencyStatus === 'approved')
                    ? 'bg-rose-100 text-rose-700 border-rose-200/80'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {userAgencyStatus === 'pending'
                    ? 'بانتظار الموافقة ⌛'
                    : (userAgencyStatus === 'active' || userAgencyStatus === 'approved')
                    ? 'مُعتمد 💎'
                    : 'فرصة توثيق 🚀'}
                </span>
              </div>
              <span className="text-[10px] text-slate-600 font-bold block mt-0.5 group-hover:text-slate-700">
                {userAgencyStatus === 'pending'
                  ? `طلبك قيد المراجعة لدى ${pendingAgencyInfo.agencyName || 'الوكالة'}`
                  : (userAgencyStatus === 'active' || userAgencyStatus === 'approved')
                  ? 'إحصائيات البث، الأرباح، التارجت، والعقود'
                  : 'انضم كـ مذيع معتمد لدى وكالات النجم لتلقي الدعم والرواتب'}
              </span>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 rounded-xl shadow-2xs transition-all shrink-0 relative z-10 ${
            userAgencyStatus === 'pending'
              ? 'text-amber-800 bg-amber-100/90 border border-amber-300'
              : (userAgencyStatus === 'active' || userAgencyStatus === 'approved')
              ? 'text-rose-700 bg-white/95 border border-rose-200/90 group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-pink-600 group-hover:text-white'
              : 'text-emerald-800 bg-emerald-100/90 border border-emerald-300 group-hover:bg-emerald-600 group-hover:text-white'
          }`}>
            <span>
              {userAgencyStatus === 'pending'
                ? 'متابعة'
                : (userAgencyStatus === 'active' || userAgencyStatus === 'approved')
                ? 'إدارة'
                : 'طلب انضمام'}
            </span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminCards;
