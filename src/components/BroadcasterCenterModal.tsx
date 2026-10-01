import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, UserPlus, Clock, CheckCircle2, 
  Shield, Trophy, Medal, Gift, Sparkles, DollarSign, Calendar, Hourglass,
  Building2, UserCheck, Check, Send, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getHierarchyEntityById,
  getBroadcasterProfileByUserId,
  HierarchyEntity,
  PRIMARY_SUPER_ADMIN_ID
} from '../lib/hierarchyService';
import {
  MyAgencyView,
  RecordsView,
  ChangeAgencyView,
  TransferRequestView,
  TransferHistoryView,
  TransferFaqView,
  SupportersView,
  NewUsersView,
  NewUsersRulesView,
  EarningsDetailsView,
  ContractsView,
  WalletView
} from './broadcaster-center/SubViews';

interface BroadcasterCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
  userName?: string;
  userAvatar?: string;
  userId?: string;
}

export type SubViewType = 
  | 'main' 
  | 'my_agency' 
  | 'records' 
  | 'wallet' 
  | 'change_agency' 
  | 'transfer_request'
  | 'transfer_history'
  | 'transfer_faq'
  | 'supporters' 
  | 'new_users' 
  | 'new_users_rules'
  | 'earnings_details' 
  | 'contracts';

export const BroadcasterCenterModal: React.FC<BroadcasterCenterModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl',
  userName = 'أبو مجد(M✈️)',
  userAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  userId = '1001022' // المعرف الافتراضي
}) => {
  const [currentSubView, setCurrentSubView] = useState<SubViewType>('main');
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // إدخال رقم الوكالة في شاشة المستخدم غير المنضم
  const [agencyInput, setAgencyInput] = useState('');
  const [joinSuccess, setJoinSuccess] = useState(false);

  // البحث عن ملف المذيع المرتبط بالـ ID
  const [hostProfile, setHostProfile] = useState<HierarchyEntity | null>(() => {
    return getBroadcasterProfileByUserId(userId) || null;
  });

  // تحديث الحساب المعتمد عند تغير الـ ID
  useEffect(() => {
    const profile = getBroadcasterProfileByUserId(userId);
    setHostProfile(profile || null);
  }, [userId]);

  if (!isOpen) return null;

  const showAlert = (msg: string) => {
    setActiveAlert(msg);
    setTimeout(() => setActiveAlert(null), 3000);
  };

  const getSubViewTitle = () => {
    switch (currentSubView) {
      case 'main': return 'مركز المذيعين';
      case 'my_agency': return 'وكالتي';
      case 'records': return 'سجل البث';
      case 'wallet': return 'محفظتي';
      case 'change_agency': return 'تغيير الوكالة';
      case 'transfer_request': return 'طلب التحويل';
      case 'transfer_history': return 'سجل التحويل';
      case 'transfer_faq': return 'تعليقات على التحويل';
      case 'supporters': return 'داعمي';
      case 'new_users': return 'مستخدم جديد';
      case 'new_users_rules': return 'قواعد المستخدم الجديد';
      case 'earnings_details': return 'قسيمة الراتب';
      case 'contracts': return 'العقود';
      default: return 'مركز المذيعين';
    }
  };

  const handleBackNavigation = () => {
    if (['transfer_request', 'transfer_history', 'transfer_faq'].includes(currentSubView)) {
      setCurrentSubView('change_agency');
    } else if (currentSubView === 'new_users_rules') {
      setCurrentSubView('new_users');
    } else {
      setCurrentSubView('main');
    }
  };

  // معالجة طلب الانضمام إلى الوكالة
  const handleJoinAgencySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyInput.trim()) return;

    const code = agencyInput.trim().toUpperCase();
    // إذا أدخل AG-101 (وكالة النخبة الملكية) أو أي وكالة معتمدة
    const newHost: HierarchyEntity = {
      id: `HOST-${code}-${userId.slice(-2)}`,
      roleCode: `HOST-${code}-${userId.slice(-2)}`,
      userId: userId,
      name: userName,
      roleTitle: 'مذيع معتمد رسمي',
      agencyId: code,
      brokerId: 'BRK-101-1',
      clan: 'عشيرة الصقور 🦅',
      userLevel: 30,
      supporterLevel: 20,
      receiverLevel: 35,
      vipTier: 'VIP3',
      isVip: true,
      hoursAchieved: 0,
      monthlyRevenue: 0,
      level: 5,
      avatar: userAvatar
    };

    try {
      localStorage.setItem(`najm_broadcaster_profile_${userId}`, JSON.stringify(newHost));
    } catch {}

    setHostProfile(newHost);
    setJoinSuccess(true);
    showAlert(`✓ تم انضمامك بنجاح إلى الوكالة (${code}) كمذيع رسمي!`);
    setTimeout(() => {
      setJoinSuccess(false);
    }, 2000);
  };

  // هل المستخدم مسجل كمذيع معتمد في وكالة أو أنه المدير العام؟
  const isJoinedBroadcaster = Boolean(hostProfile) || userId === PRIMARY_SUPER_ADMIN_ID;

  // القيم المحسوبة الواقعية من ملف المذيع المعتمد
  const resolvedName = hostProfile?.name || userName;
  const resolvedUserId = hostProfile?.userId || userId;
  const resolvedRoleCode = hostProfile?.id || (userId === PRIMARY_SUPER_ADMIN_ID ? 'MGR-9901' : 'غير مرتبط بوكالة');
  const resolvedAgency = hostProfile?.agencyId || (userId === PRIMARY_SUPER_ADMIN_ID ? 'إدارة الوكالات العليا' : 'لم يتم الانضمام');
  const resolvedClan = hostProfile?.clan || 'عشيرة الصقور 🦅';
  const resolvedHours = hostProfile?.hoursAchieved ?? 145;
  const resolvedDiamonds = hostProfile?.monthlyRevenue ?? 3400000;
  const resolvedVip = hostProfile?.vipTier || 'VIP5';
  const resolvedLevel = hostProfile?.userLevel || 42;
  const monthlySalaryEstimate = ((resolvedDiamonds / 100000)).toFixed(2);

  return (
    <div 
      className="fixed inset-0 z-[100] w-full h-full min-h-screen bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#EDF2F7] flex flex-col overflow-y-auto select-none font-sans"
      dir="rtl"
    >
      {/* Toast Alert */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-[0_10px_30px_rgba(0,0,0,0.25)] border border-slate-700 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-slate-300 animate-pulse" />
            <span>{activeAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {/* Left Side: Back Button */}
        <div className="flex items-center gap-2">
          {currentSubView !== 'main' ? (
            <button 
              onClick={handleBackNavigation}
              className="p-1.5 hover:bg-slate-100 active:scale-95 rounded-full text-slate-800 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            >
              <ChevronRight className="w-5 h-5" />
              <span>رجوع</span>
            </button>
          ) : (
            <div className="w-6" />
          )}
        </div>

        {/* Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight font-serif">
            {getSubViewTitle()}
          </h1>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="p-1.5 hover:bg-slate-100 active:scale-95 rounded-full text-slate-400 hover:text-slate-900 transition-all cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5 stroke-[2.4]" />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* الحالة 1: المستخدم غير مرتبط بوكالة بعد (شاشة التوجيه وطلب الانضمام)        */}
      {/* ========================================================================= */}
      {currentSubView === 'main' && !isJoinedBroadcaster && (
        <div className="w-full max-w-lg mx-auto p-4 space-y-4 pb-16 flex-1 flex flex-col justify-center">
          
          {/* كرت الترحيب بمزايا المذيع الرسمي */}
          <div className="rounded-[32px] bg-white border border-slate-200 p-6 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-purple-600 mx-auto flex items-center justify-center text-white text-3xl shadow-lg">
              🎙️
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">انضم كمذيع رسمي في الوكالة</h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                مركز المذيعين متاح حصرياً للمذيعين المعتمدين في الوكالات الرسمية. انضم الآن للاستفادة من الرواتب الشهرية ومكافآت التارجت وحماية الحساب.
              </p>
            </div>

            {/* مميزات الانضمام */}
            <div className="grid grid-cols-2 gap-2 text-right pt-2">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>💰</span>
                  <span>رواتب شهرية بالدولار</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">تحويل بنكي وسحب فوري للأرباح</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <span>💎</span>
                  <span>دعم تسكير التارجت</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">مكافآت وهدايا داعمة من الوكالة</div>
              </div>
            </div>

            {/* نموذج إدخال رقم الوكالة */}
            <form onSubmit={handleJoinAgencySubmit} className="pt-3 space-y-3">
              <div className="text-right">
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  أدخل رقم الوكالة (Agency ID):
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={agencyInput}
                    onChange={(e) => setAgencyInput(e.target.value)}
                    placeholder="مثال: AG-101 (وكالة النخبة الملكية)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-900 outline-none focus:border-slate-400 focus:bg-white transition-all text-center"
                    required
                  />
                  <Building2 className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-black text-xs rounded-2xl shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال طلب الانضمام للوكالة</span>
              </button>

              <div className="text-[10.5px] text-slate-500 pt-1">
                معرفك الحالي: <span className="font-mono font-black text-slate-800">{userId}</span>
              </div>
            </form>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* الحالة 2: المستخدم منضم لوكالة رسمي (الصفحة الداخلية الكاملة للمذيع)       */}
      {/* ========================================================================= */}
      {currentSubView === 'main' && isJoinedBroadcaster && (
        <div className="w-full max-w-lg mx-auto p-4 space-y-3.5 pb-16 flex-1">

          {/* 1. HERO BOX: بطاقة المذيع المعتمد المتطابقة مع السيرفر */}
          <div className="relative overflow-hidden rounded-[32px] bg-white border border-slate-200 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)]">
            
            <div className="flex items-center justify-between relative z-10">
              {/* User Profile Info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-amber-300 to-slate-200 shadow-sm">
                    <img 
                      src={userAvatar} 
                      alt={resolvedName} 
                      className="w-full h-full rounded-full object-cover bg-slate-900 border border-white"
                    />
                  </div>
                  {/* VIP Pill */}
                  <span className="absolute -bottom-1 -left-1 bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full border border-white font-mono shadow-xs">
                    {resolvedVip}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-slate-900 leading-tight flex items-center gap-1.5">
                    <span>{resolvedName}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 font-bold">
                      {resolvedClan}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 font-mono text-[11px] font-bold">
                    <span className="text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                      UID: {resolvedUserId}
                    </span>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      {resolvedRoleCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Earnings Details Pill Button */}
              <button 
                onClick={() => setCurrentSubView('earnings_details')}
                className="bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all px-3 py-1.5 rounded-full text-xs font-black text-slate-800 border border-slate-300 shadow-xs cursor-pointer flex items-center gap-1 shrink-0"
              >
                <span>تفاصيل الأرباح</span>
              </button>
            </div>

            {/* Symmetrical Dual Metric Cards */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-center relative z-10">
              {/* Right Box: أرباح الشهر المقدرة ($) */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 shadow-2xs">
                <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 tracking-tight">
                  ${monthlySalaryEstimate}
                </div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  أرباح الشهر التقديرية ($)
                </div>
              </div>

              {/* Left Box: ألماسات البث المستلمة */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 shadow-2xs">
                <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 tracking-tight flex items-center justify-center gap-1">
                  <span>{(resolvedDiamonds / 1000000).toFixed(2)}M</span>
                  <span className="text-xs">💎</span>
                </div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  ألماس البث المستلم
                </div>
              </div>
            </div>
          </div>

          {/* 2. TWO ACTION CARDS: مستوى المضيف & أفضل إنجاز */}
          <div className="grid grid-cols-2 gap-3">
            {/* Left Card: مستوى المضيف */}
            <div 
              onClick={() => showAlert(`مستوى المضيف الحالي: LV.${resolvedLevel}`)}
              className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs flex items-center justify-between text-slate-800 cursor-pointer hover:bg-slate-50 active:scale-95 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-all" />
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 block">مستوى المضيف</span>
                <span className="text-base font-black font-mono text-slate-900 mt-0.5 block tracking-wide">
                  LV.{resolvedLevel}
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl">
                🥈
              </div>
            </div>

            {/* Right Card: ساعات البث المنجزة */}
            <div 
              onClick={() => showAlert(`ساعات البث المنجزة: ${resolvedHours} ساعة`)}
              className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs flex items-center justify-between text-slate-800 cursor-pointer hover:bg-slate-50 active:scale-95 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-all" />
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 block">ساعات البث</span>
                <span className="text-base font-black font-mono text-slate-900 mt-0.5 block">
                  {resolvedHours} ساعة
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xl">
                🏆
              </div>
            </div>
          </div>

          {/* 3. MONTHLY SALARY & MILESTONE TRACK (الراتب الشهري) */}
          <div className="relative rounded-[32px] bg-white border border-slate-200 p-4 sm:p-5 pt-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
            <div className="absolute -top-3 left-4 bg-slate-900 text-white px-3.5 py-0.5 rounded-full text-[10px] font-black font-mono shadow-sm border border-slate-700 flex items-center gap-1">
              <span>⏱</span>
              <span>تارجت الشهر ساري</span>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-slate-900 font-serif">
                الراتب الشهري المستحق
              </h3>
              <div 
                onClick={() => setCurrentSubView('earnings_details')}
                className="flex items-center gap-1 text-slate-900 font-black text-lg sm:text-xl font-mono cursor-pointer hover:opacity-80 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500" />
                <span>$ {monthlySalaryEstimate}</span>
              </div>
            </div>

            {/* Horizontal Glass Layout for Stats */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 shadow-2xs">
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-200 text-center items-center">
                {/* 1. الألماسات */}
                <div className="px-2 space-y-1">
                  <div className="flex items-center justify-center gap-1 font-mono font-black text-base text-slate-900">
                    <span className="text-xs">💎</span>
                    <span>3.4M</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600">
                    الألماسات
                  </div>
                </div>

                {/* 2. الأيام المؤهلة */}
                <div className="px-2 space-y-1">
                  <div className="flex items-center justify-center gap-1 font-mono font-black text-base text-slate-900">
                    <span className="text-xs">📅</span>
                    <span className="text-slate-900">22</span>
                    <span className="text-xs text-slate-500">/25 ي</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600">
                    الأيام المؤهلة
                  </div>
                </div>

                {/* 3. الساعات المنجزة */}
                <div className="px-2 space-y-1">
                  <div className="flex items-center justify-center gap-1 font-mono font-black text-base text-slate-900">
                    <span className="text-xs">⏳</span>
                    <span className="text-slate-900">{resolvedHours}</span>
                    <span className="text-xs text-slate-500">/120 س</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600">
                    ساعات البث
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Chests on Track */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] font-black font-mono text-slate-700 px-2 pb-1">
                <span>$10</span>
                <span>$30</span>
                <span>$60</span>
                <span>$120</span>
                <span>$300+</span>
              </div>

              <div className="relative flex items-center justify-between px-2 py-1">
                <div className="absolute top-1/2 left-3 right-3 h-2 bg-emerald-500 -translate-y-1/2 rounded-full" />
                {[0, 1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-xl bg-white p-[1.5px] shadow-xs hover:scale-110 transition-all cursor-pointer border border-emerald-400">
                      <div className="w-full h-full bg-emerald-50 rounded-[9px] flex items-center justify-center text-sm">
                        🎁
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Capsule: التارجت التالي */}
            <div className="bg-slate-50 text-slate-900 rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-800 font-mono">الوكالة التابع لها: {resolvedAgency}</span>
                <span className="text-emerald-700 font-bold">تارجت مكتمل بنسبة 95%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-[1px] border border-slate-300">
                <div className="w-[95%] h-full bg-emerald-600 rounded-full shadow-2xs" />
              </div>
            </div>
          </div>

          {/* 4. أدواتي (My Tools Grid) */}
          <div className="relative rounded-[32px] bg-white border border-slate-200 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] select-none">
            <div className="flex items-center justify-between mb-3.5 px-1">
              <span className="text-xs font-bold text-slate-500 font-mono">
                الوسيط: {hostProfile?.brokerId || 'تركي الشمري'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-serif tracking-wide text-slate-900">
                أدواتي
              </h2>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              
              {/* 1. وكالتي */}
              <div 
                onClick={() => setCurrentSubView('my_agency')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[120px] hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-full h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  🏛️
                </div>
                <span className="text-[11px] font-black text-slate-800 group-hover:text-slate-950 mt-1">
                  وكالتي
                </span>
                <span className="text-[9px] text-slate-500 font-mono">AG-101</span>
              </div>

              {/* 2. سجلات البث */}
              <div 
                onClick={() => setCurrentSubView('records')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[120px] hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-full h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  🎙️
                </div>
                <span className="text-[11px] font-black text-slate-800 group-hover:text-slate-950 mt-1">
                  سجل البث
                </span>
                <span className="text-[9px] text-slate-500 font-mono">{resolvedHours}h</span>
              </div>

              {/* 3. محفظتي */}
              <div 
                onClick={() => setCurrentSubView('wallet')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[120px] hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-full h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  💳
                </div>
                <span className="text-[11px] font-black text-slate-800 group-hover:text-slate-950 mt-1">
                  محفظتي
                </span>
                <span className="text-[9px] text-slate-500 font-mono">${monthlySalaryEstimate}</span>
              </div>

              {/* 4. العقود */}
              <div 
                onClick={() => setCurrentSubView('contracts')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[120px] hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-full h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  📜
                </div>
                <span className="text-[11px] font-black text-slate-800 group-hover:text-slate-950 mt-1">
                  العقود
                </span>
                <span className="text-[9px] text-emerald-600 font-bold">معتمد ✅</span>
              </div>

              {/* 5. داعمي */}
              <div 
                onClick={() => setCurrentSubView('supporters')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[120px] hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-full h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  👑
                </div>
                <span className="text-[11px] font-black text-slate-800 group-hover:text-slate-950 mt-1">
                  داعمي
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Top 3</span>
              </div>

              {/* 6. تغيير الوكالة */}
              <div 
                onClick={() => setCurrentSubView('change_agency')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[120px] hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-full h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  🔄
                </div>
                <span className="text-[11px] font-black text-slate-800 group-hover:text-slate-950 mt-1">
                  تغيير الوكالة
                </span>
                <span className="text-[9px] text-slate-500">نقل</span>
              </div>

              {/* 7. تفاصيل الأرباح */}
              <div 
                onClick={() => setCurrentSubView('earnings_details')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[120px] hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-full h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  📊
                </div>
                <span className="text-[11px] font-black text-slate-800 group-hover:text-slate-950 mt-1">
                  قسيمة الراتب
                </span>
                <span className="text-[9px] text-slate-500">شهري</span>
              </div>

              {/* 8. مستخدم جديد */}
              <div 
                onClick={() => setCurrentSubView('new_users')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[120px] hover:bg-slate-50 hover:border-slate-400 active:scale-95 transition-all cursor-pointer"
              >
                <div className="w-full h-14 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                  ✨
                </div>
                <span className="text-[11px] font-black text-slate-800 group-hover:text-slate-950 mt-1">
                  مستخدم جديد
                </span>
                <span className="text-[9px] text-slate-500">مكافآت</span>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* الشاشات الفرعية (Sub Views) مع تمرير البيانات الحقيقية من السيرفر        */}
      {/* ========================================================================= */}
      {currentSubView === 'my_agency' && (
        <MyAgencyView 
          onNavigate={setCurrentSubView} 
          showAlert={showAlert} 
          hostProfile={hostProfile}
          currentUserId={userId}
          currentUserName={userName}
        />
      )}

      {currentSubView === 'records' && (
        <RecordsView 
          onNavigate={setCurrentSubView} 
          showAlert={showAlert}
          hostProfile={hostProfile}
        />
      )}

      {currentSubView === 'wallet' && (
        <WalletView 
          onNavigate={setCurrentSubView} 
          showAlert={showAlert}
          hostProfile={hostProfile}
        />
      )}

      {currentSubView === 'change_agency' && (
        <ChangeAgencyView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {currentSubView === 'transfer_request' && (
        <TransferRequestView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {currentSubView === 'transfer_history' && (
        <TransferHistoryView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {currentSubView === 'transfer_faq' && (
        <TransferFaqView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {currentSubView === 'supporters' && (
        <SupportersView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {currentSubView === 'new_users' && (
        <NewUsersView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {currentSubView === 'new_users_rules' && (
        <NewUsersRulesView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {currentSubView === 'earnings_details' && (
        <EarningsDetailsView 
          onNavigate={setCurrentSubView} 
          showAlert={showAlert}
          hostProfile={hostProfile}
        />
      )}

      {currentSubView === 'contracts' && (
        <ContractsView 
          onNavigate={setCurrentSubView} 
          showAlert={showAlert}
          hostProfile={hostProfile}
          currentUserId={userId}
          currentUserName={userName}
        />
      )}

    </div>
  );
};
