import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Maximize2,
  Minimize2,
  MoreVertical,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Zap,
  RotateCcw,
  Lock,
  Unlock,
  Sliders,
  Settings
} from 'lucide-react';
import {
  AppRole,
  APP_ROLES,
  getActiveAppRole,
  setActiveAppRole,
  RoleInfo,
  isDeveloper,
  getAuthorizedRolesForBottomBar,
  getAuthorizedRolesForGiftCms,
  grantRolePermission,
  revokeRolePermission,
  canAccessBottomControlBar,
  canManageGifts
} from '../lib/roleService';

export const FullscreenToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [currentRole, setCurrentRole] = useState<AppRole>(getActiveAppRole());
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'roles' | 'permissions'>('roles');
  const [roleToast, setRoleToast] = useState<{ role?: RoleInfo; message?: string; visible: boolean } | null>(null);

  // Authorized roles state for reactive UI toggles
  const [authBottomBar, setAuthBottomBar] = useState<AppRole[]>(() => getAuthorizedRolesForBottomBar());
  const [authGiftCms, setAuthGiftCms] = useState<AppRole[]>(() => getAuthorizedRolesForGiftCms());

  const isDev = isDeveloper(currentRole);

  useEffect(() => {
    // Check if fullscreen API is available
    const doc = document as any;
    const docEl = document.documentElement as any;
    const supported = !!(
      docEl.requestFullscreen ||
      docEl.webkitRequestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.msRequestFullscreen
    );
    setIsSupported(supported);

    const updateFullscreenState = () => {
      const active = !!(
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(active);
    };

    updateFullscreenState();

    document.addEventListener('fullscreenchange', updateFullscreenState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenState);
    document.addEventListener('mozfullscreenchange', updateFullscreenState);
    document.addEventListener('MSFullscreenChange', updateFullscreenState);

    // Listen for role changes from anywhere
    const handleRoleChanged = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.role) {
        setCurrentRole(customEvent.detail.role);
      }
    };

    const handlePermissionsUpdated = () => {
      setAuthBottomBar(getAuthorizedRolesForBottomBar());
      setAuthGiftCms(getAuthorizedRolesForGiftCms());
    };

    window.addEventListener('app_role_changed', handleRoleChanged);
    window.addEventListener('app_permissions_updated', handlePermissionsUpdated);

    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreenState);
      document.removeEventListener('webkitfullscreenchange', updateFullscreenState);
      document.removeEventListener('mozfullscreenchange', updateFullscreenState);
      document.removeEventListener('MSFullscreenChange', updateFullscreenState);
      window.removeEventListener('app_role_changed', handleRoleChanged);
      window.removeEventListener('app_permissions_updated', handlePermissionsUpdated);
    };
  }, []);

  const handleToggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const doc = document as any;
      const docEl = document.documentElement as any;

      if (!isFullscreen) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (error) {
      console.warn('Fullscreen toggle request was prevented or unavailable:', error);
    }
  };

  const handleSelectRole = (role: RoleInfo) => {
    setActiveAppRole(role.id);
    setCurrentRole(role.id);
    setIsRoleMenuOpen(false);

    // Show confirmation toast
    setRoleToast({ role, message: `تم تطبيق صلاحيات: ${role.title} 🛡️`, visible: true });
    setTimeout(() => {
      setRoleToast(null);
    }, 2800);
  };

  const handleToggleFeatureRole = (feature: 'bottom_bar' | 'gift_cms', targetRole: AppRole) => {
    if (targetRole === 'developer') {
      setRoleToast({ message: 'المبرمج يمتلك الصلاحية دائماً بشكل افتراضي 👑', visible: true });
      setTimeout(() => setRoleToast(null), 2500);
      return;
    }

    const currentList = feature === 'bottom_bar' ? authBottomBar : authGiftCms;
    const isGranted = currentList.includes(targetRole);

    if (isGranted) {
      revokeRolePermission(feature, targetRole);
      setRoleToast({
        message: `تم سحب صلاحية ${feature === 'bottom_bar' ? 'الشريط السفلي' : 'تعديل الهدايا'} من ${targetRole} 🔒`,
        visible: true
      });
    } else {
      grantRolePermission(feature, targetRole);
      setRoleToast({
        message: `تم منح صلاحية ${feature === 'bottom_bar' ? 'الشريط السفلي' : 'تعديل الهدايا'} لـ ${targetRole} 🔓`,
        visible: true
      });
    }
    setTimeout(() => setRoleToast(null), 2500);
  };

  const activeRoleInfo = APP_ROLES.find((r) => r.id === currentRole) || APP_ROLES[0];

  return (
    <>
      {/* ================= TOP CONTROL SEGMENTED BAR ================= */}
      <div
        id="app-top-control-bar"
        className={`fixed top-2.5 left-1/2 -translate-x-1/2 z-[9999] flex items-center bg-[#0C1220]/90 hover:bg-[#0E172A]/95 backdrop-blur-xl border border-white/20 hover:border-cyan-400/50 rounded-full p-1 shadow-[0_4px_25px_rgba(0,0,0,0.6)] transition-all duration-200 pointer-events-auto select-none ${className}`}
        dir="rtl"
      >
        {/* 1. Fullscreen Toggle Button (Segmented Left Portion with Dual Arrows) */}
        <button
          onClick={handleToggleFullscreen}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 hover:text-white transition-all text-xs font-bold cursor-pointer group"
          title={isFullscreen ? 'إنهاء وضع ملء الشاشة' : 'تفعيل وضع ملء الشاشة (إخفاء أشرطة المتصفح)'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10.5px] font-extrabold text-slate-200 hidden sm:inline">إنهاء الملء</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10.5px] font-extrabold text-slate-200 hidden sm:inline">ملء الشاشة</span>
            </>
          )}
        </button>

        {/* Divider Line */}
        <div className="w-[1px] h-4 bg-white/20 mx-1 shrink-0" />

        {/* 2. Three-Dots Menu Button (Directly next to Fullscreen Toggle) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRoleMenuOpen(!isRoleMenuOpen);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all text-xs font-bold cursor-pointer active:scale-95 ${
            isRoleMenuOpen
              ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
              : 'bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white'
          }`}
          title="اختيار الأدوار وتبديل واجهة الصلاحيات"
        >
          <span className="text-[11px] font-mono">{activeRoleInfo.icon}</span>
          <span className="text-[10px] font-black text-cyan-300 hidden md:inline truncate max-w-[85px]">
            {activeRoleInfo.title.split(' ')[0]}
          </span>
          <MoreVertical className="w-3.5 h-3.5 text-slate-300" />
        </button>
      </div>

      {/* ================= ROLE SELECTION MODAL / DRAWER ================= */}
      <AnimatePresence>
        {isRoleMenuOpen && (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 pointer-events-auto select-none"
            dir="rtl"
            onClick={() => setIsRoleMenuOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-[#0B101D] border border-cyan-500/40 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-gradient-to-r from-[#0E172A] via-[#132342] to-[#0E172A]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>إدارة الأدوار والصلاحيات</span>
                      <span className="text-[9px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                        تحكم فوري ⚡
                      </span>
                    </h3>
                    <p className="text-[10.5px] text-slate-300">
                      تبديل الأدوار وتأمين صلاحيات المبرمج والتحكم
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsRoleMenuOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab Selector (When Developer or Admin) */}
              <div className="flex items-center p-2 bg-slate-950/60 border-b border-white/10 gap-1.5">
                <button
                  onClick={() => setModalTab('roles')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalTab === 'roles'
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>اختيار الدور النشط</span>
                </button>

                {isDev && (
                  <button
                    onClick={() => setModalTab('permissions')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      modalTab === 'permissions'
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                        : 'bg-white/5 hover:bg-white/10 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>تخويل الصلاحيات 🔐 (المبرمج)</span>
                  </button>
                )}
              </div>

              {/* TAB 1: Roles List */}
              {modalTab === 'roles' && (
                <div className="p-3.5 space-y-2.5 overflow-y-auto max-h-[65vh] custom-scrollbar">
                  {APP_ROLES.map((role) => {
                    const isSelected = currentRole === role.id;
                    return (
                      <motion.div
                        key={role.id}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleSelectRole(role)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden bg-gradient-to-r ${role.bgGradient} ${
                          isSelected
                            ? `border-2 ${role.borderColor} shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-white/30`
                            : 'border-white/10 hover:border-white/30 opacity-85 hover:opacity-100'
                        }`}
                      >
                        {/* Active Indicator Ribbon */}
                        {isSelected && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>الدور النشط حالياً</span>
                          </div>
                        )}

                        <div className="flex items-start gap-3">
                          <div className="text-2xl p-2 rounded-xl bg-black/40 border border-white/10 shrink-0">
                            {role.icon}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-black ${role.color}`}>{role.title}</span>
                              <span className="text-[8.5px] font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded text-slate-300">
                                {role.badge}
                              </span>
                            </div>

                            <p className="text-[10px] text-slate-300 mt-0.5 leading-snug">
                              {role.subtitle}
                            </p>

                            {/* Quick Permissions Tags */}
                            <div className="mt-2 flex flex-wrap gap-1">
                              {role.permissions.map((perm, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] bg-black/50 border border-white/10 text-slate-200 px-1.5 py-0.5 rounded-md"
                                >
                                  ✓ {perm}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: Developer Permissions Authorization Panel */}
              {modalTab === 'permissions' && isDev && (
                <div className="p-3.5 space-y-4 overflow-y-auto max-h-[65vh] custom-scrollbar">
                  {/* Notice Banner */}
                  <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <p className="text-[11px] leading-relaxed">
                      بصفتك <strong className="text-emerald-300">المبرمج</strong>، جميع الصلاحيات مقفلة افتراضياً عن باقي الأدوار. يمكنك هنا تخويل أي دور ترغب به أو سحب الصلاحية فوراً.
                    </p>
                  </div>

                  {/* 1. Public Features Info */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🎛️</span>
                      <div>
                        <h4 className="text-xs font-black text-cyan-300">شريط أسفل الشاشة (الإيموجي والتحكم)</h4>
                        <p className="text-[10px] text-emerald-400 font-bold">✓ متاح لجميع المستخدمين والزوار كحق أساسي في الغرفة</p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Gift CMS & Editing Permissions */}
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2.5">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🎁</span>
                        <div>
                          <h4 className="text-xs font-black text-pink-300">صلاحيات إدارة وتعديل الهدايا (Gift CMS)</h4>
                          <p className="text-[10px] text-slate-400">حصرية للمبرمج افتراضياً — يمكنك تخويل أي دور أدناه</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      {APP_ROLES.map((role) => {
                        const isGranted = authGiftCms.includes(role.id);
                        const isDeveloperRole = role.id === 'developer';
                        return (
                          <div
                            key={role.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-black/40 border border-white/5 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span>{role.icon}</span>
                              <span className="font-bold text-slate-200">{role.title.split(' ')[0]}</span>
                              <span className="text-[9px] text-slate-400">({role.badge})</span>
                            </div>

                            <button
                              disabled={isDeveloperRole}
                              onClick={() => handleToggleFeatureRole('gift_cms', role.id)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                                isDeveloperRole
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 opacity-80 cursor-not-allowed'
                                  : isGranted
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40'
                              }`}
                            >
                              {isDeveloperRole ? (
                                <>
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>دائم (المبرمج)</span>
                                </>
                              ) : isGranted ? (
                                <>
                                  <Unlock className="w-2.5 h-2.5" />
                                  <span>مُخوّل ✓</span>
                                </>
                              ) : (
                                <>
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>مقفول 🔒</span>
                                </>
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Quick Help Note */}
              <div className="p-3 bg-slate-950/90 border-t border-white/10 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>التغييرات فورية ولحظية وتُطبق على مستوى الجلسة والغرف مباشرة.</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= CONFIRMATION TOAST ================= */}
      <AnimatePresence>
        {roleToast && roleToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -25, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.9 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[10001] bg-[#0E172A]/95 border border-cyan-400/50 text-white px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 select-none pointer-events-none"
            dir="rtl"
          >
            <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-black">
              ✓
            </div>
            <div className="text-xs font-bold text-slate-200">
              {roleToast.message || (roleToast.role && `تم تفعيل دور: ${roleToast.role.title}`)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
