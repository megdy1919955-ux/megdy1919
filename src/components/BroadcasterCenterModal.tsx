import React, { useState, useEffect } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Search, UserPlus, Clock, CheckCircle2, 
  Shield, Trophy, Medal, Gift, Gamepad2, Mic, Tv, FileText, 
  Users, BarChart3, Wallet, Edit3, ListOrdered, UserCheck, 
  Download, Sparkles, ArrowUpRight, DollarSign, Calendar, Hourglass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getBroadcastersCount, 
  getBroadcastersList, 
  getAgencyInvitations, 
  subscribeToAgencyInvitations, 
  sendNewInvitation,
  BroadcasterMember,
  AgencyInvitation
} from '../lib/agencyInvitationService';
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
  | 'contracts' 
  | 'my_broadcasters' 
  | 'invite' 
  | 'invite_history';

export const BroadcasterCenterModal: React.FC<BroadcasterCenterModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl',
  userName = 'أبو مجد(M✈️)',
  userAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  userId = '82639599'
}) => {
  const [currentSubView, setCurrentSubView] = useState<SubViewType>('main');
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteId, setInviteId] = useState('');
  const [inviteMessage, setInviteMessage] = useState('يسرنا دعوتك للانضمام كمذيع رسمي في فريقنا.');
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);

  // Month selectors
  const [selectedMonth, setSelectedMonth] = useState('2026/08');
  const [selectedDate, setSelectedDate] = useState('28/08/2026');

  // Change agency form state
  const [transferTargetId, setTransferTargetId] = useState('');
  const [transferReason, setTransferReason] = useState('');
  const [transferSubmitted, setTransferSubmitted] = useState(false);

  const [broadcasterCount, setBroadcasterCount] = useState(getBroadcastersCount());
  const [broadcastersList, setBroadcastersList] = useState<BroadcasterMember[]>(getBroadcastersList());
  const [invitationsList, setInvitationsList] = useState<AgencyInvitation[]>(getAgencyInvitations());

  useEffect(() => {
    const updateData = () => {
      setBroadcasterCount(getBroadcastersCount());
      setBroadcastersList(getBroadcastersList());
      setInvitationsList(getAgencyInvitations());
    };
    updateData();
    const unsub = subscribeToAgencyInvitations(updateData);
    return unsub;
  }, []);

  if (!isOpen) return null;
  const isRtl = direction === 'rtl';

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteId.trim()) return;

    sendNewInvitation({
      hostId: inviteId.trim(),
      inviterType: 'agency',
      message: inviteMessage,
      agencyGid: '30032',
      agencyName: userName
    });

    setInviteSuccess(`تم إرسال الدعوة وشروط الانضمام بنجاح إلى المذيع (ID: ${inviteId.trim()}).`);
    setInviteId('');
    setTimeout(() => {
      setInviteSuccess(null);
    }, 4000);
  };

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
      case 'my_broadcasters': return `المذيع الخاص بي (${broadcasterCount})`;
      case 'invite': return 'دعوة المذيعين';
      case 'invite_history': return 'سجل الدعوات';
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

      {/* 1. Header Bar (Frosted White & Dark White) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl px-4 py-3 flex items-center justify-between border-b border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        {/* Left Side: Back Button & Sub Actions */}
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

          {/* Rules Button for New Users View */}
          {currentSubView === 'new_users' && (
            <button 
              onClick={() => setCurrentSubView('new_users_rules')}
              className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold flex items-center gap-1 hover:bg-white transition-all cursor-pointer shadow-2xs"
            >
              <span>قواعد</span>
              <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px] font-bold">؟</span>
            </button>
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

      {/* Main View Styled in White & Dark White (Monochromatic Luxury) */}
      {currentSubView === 'main' && (
        <div className="w-full max-w-lg mx-auto p-4 space-y-3.5 pb-16 flex-1">

          {/* ========================================================= */}
          {/* 1. HERO BOX: Pure White with Dark-White Layering Card    */}
          {/* ========================================================= */}
          <div className="relative overflow-hidden rounded-[32px] bg-white border border-slate-200 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04),inset_0_2px_4px_rgba(255,255,255,1)]">
            {/* Background subtle geometric corner marks */}
            <div className="absolute top-3 left-3 opacity-20 text-slate-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="2" y1="2" x2="10" y2="10" />
                <line x1="6" y1="2" x2="14" y2="10" />
                <line x1="10" y1="2" x2="18" y2="10" />
              </svg>
            </div>

            {/* Top Row: User Avatar & Info (Right) + Earnings Details Button (Left) */}
            <div className="flex items-center justify-between relative z-10">
              {/* User Profile Info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr from-slate-700 via-slate-400 to-slate-200 shadow-sm">
                    <img 
                      src={userAvatar} 
                      alt={userName} 
                      className="w-full h-full rounded-full object-cover bg-slate-900 border border-white"
                    />
                  </div>
                  {/* Glowing border ring */}
                  <div className="absolute -inset-0.5 rounded-full border border-slate-300 pointer-events-none" />
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-slate-900 leading-tight flex items-center gap-1">
                    <span>{userName}</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md inline-block mt-1">
                    UID:{userId}
                  </div>
                </div>
              </div>

              {/* Earnings Details Pill Button */}
              <button 
                onClick={() => setCurrentSubView('earnings_details')}
                className="bg-slate-100 hover:bg-slate-200 active:scale-95 transition-all px-3.5 py-1.5 rounded-full text-xs font-black text-slate-800 border border-slate-300 shadow-xs cursor-pointer flex items-center gap-1"
              >
                <span>تفاصيل الأرباح</span>
              </button>
            </div>

            {/* Symmetrical Dual Metric Cards */}
            <div className="grid grid-cols-2 gap-3 mt-4 text-center relative z-10">
              {/* Right Box: أرباح اليوم ($) */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 shadow-2xs hover:bg-slate-100/80 transition-all">
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
                  0.00
                </div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  أرباح اليوم ($)
                </div>
              </div>

              {/* Left Box: أرباح الشهر الحالي ($) */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 shadow-2xs hover:bg-slate-100/80 transition-all">
                <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight">
                  0.00
                </div>
                <div className="text-xs font-bold text-slate-600 mt-1">
                  أرباح الشهر الحالي ($)
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. TWO ACTION CARDS: Best Achievement & Host Level        */}
          {/* ========================================================= */}
          <div className="grid grid-cols-2 gap-3">
            {/* Left Card: مستوى المضيف (LV.0) */}
            <div 
              onClick={() => showAlert('مستوى المضيف الحالي هو LV.0')}
              className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs flex items-center justify-between text-slate-800 cursor-pointer hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-[-2px] transition-all" />
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 block">مستوى المضيف</span>
                <span className="text-base font-black font-mono text-slate-900 mt-0.5 block tracking-wide">
                  LV.0
                </span>
              </div>
              {/* 3D Medal 🥈 */}
              <div className="w-11 h-11 rounded-xl bg-slate-100 p-[1.5px] shadow-2xs border border-slate-200 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-xl">
                  🥈
                </div>
              </div>
            </div>

            {/* Right Card: أفضل انجاز (4M 💎) */}
            <div 
              onClick={() => showAlert('أفضل إنجاز محقق هو 4M ماسة!')}
              className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-3.5 shadow-xs flex items-center justify-between text-slate-800 cursor-pointer hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-[-2px] transition-all" />
              <div className="text-right">
                <span className="text-[11px] font-bold text-slate-500 block">أفضل انجاز</span>
                <span className="text-base font-black font-mono text-slate-900 mt-0.5 block flex items-center gap-1">
                  4M <span className="text-xs">💎</span>
                </span>
              </div>
              {/* 3D Trophy 🏆 */}
              <div className="w-11 h-11 rounded-xl bg-slate-100 p-[1.5px] shadow-2xs border border-slate-200 flex items-center justify-center">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-xl">
                  🏆
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. MONTHLY SALARY & MILESTONE TRACK (الراتب الشهري)      */}
          {/* ========================================================= */}
          <div className="relative rounded-[32px] bg-white border border-slate-200 p-4 sm:p-5 pt-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
            {/* Top Left Floating Timer Badge */}
            <div className="absolute -top-3 left-4 bg-slate-900 text-white px-3.5 py-0.5 rounded-full text-[10px] font-black font-mono shadow-sm border border-slate-700 flex items-center gap-1">
              <span>⏱</span>
              <span>3 أيام 3 ساعات</span>
            </div>

            {/* Header: Title and Amount */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-black text-slate-900 font-serif">
                الراتب الشهري
              </h3>
              <div 
                onClick={() => setCurrentSubView('earnings_details')}
                className="flex items-center gap-1 text-slate-900 font-black text-lg sm:text-xl font-mono cursor-pointer hover:opacity-80 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500" />
                <span>$ 0.00</span>
              </div>
            </div>

            {/* Horizontal Sleek Glass Layout for Stats (الألماسات -> الأيام -> الساعات) */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 shadow-2xs">
              <div className="grid grid-cols-3 divide-x divide-x-reverse divide-slate-200 text-center items-center">
                {/* 1. الألماسات */}
                <div className="px-2 space-y-1">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs">💎</span>
                    <span className="font-mono font-black text-base text-slate-900">50</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600">
                    الألماسات
                  </div>
                </div>

                {/* 2. الأيام المؤهلة */}
                <div className="px-2 space-y-1">
                  <div className="flex items-center justify-center gap-1 font-mono font-black text-base text-slate-900">
                    <span className="text-xs">📅</span>
                    <span className="text-slate-900">1</span>
                    <span className="text-xs text-slate-500">/7 أيام</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600">
                    الأيام المؤهلة
                  </div>
                </div>

                {/* 3. الساعات (المدة المؤهلة) */}
                <div className="px-2 space-y-1">
                  <div className="flex items-center justify-center gap-1 font-mono font-black text-base text-slate-900">
                    <span className="text-xs">⏳</span>
                    <span className="text-slate-900">4</span>
                    <span className="text-xs text-slate-500">/7 س</span>
                  </div>
                  <div className="text-[11px] font-bold text-slate-600">
                    الساعات
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Sculpted Treasure Chests on Track */}
            <div className="pt-2">
              {/* Chest Labels */}
              <div className="flex items-center justify-between text-[11px] font-black font-mono text-slate-700 px-2 pb-1">
                <span>$1</span>
                <span>+$1</span>
                <span>+$1</span>
                <span>+$1</span>
                <span>+$+</span>
              </div>

              {/* Track with 5 Chests */}
              <div className="relative flex items-center justify-between px-2 py-1">
                {/* Horizontal track line */}
                <div className="absolute top-1/2 left-3 right-3 h-2 bg-slate-200 -translate-y-1/2 rounded-full" />
                
                {[0, 1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="relative z-10 flex flex-col items-center">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-white p-[1.5px] shadow-xs hover:scale-110 transition-all cursor-pointer border border-slate-300">
                      <div className="w-full h-full bg-white rounded-[9px] flex items-center justify-center text-sm">
                        📦
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Capsule: المستوى التالي */}
            <div className="bg-slate-50 text-slate-900 rounded-2xl p-3 border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-slate-800 font-mono">المستوى التالي 1$</span>
              </div>

              {/* Gleaming Progress Bar */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-[1px] border border-slate-300">
                <div className="w-[15%] h-full bg-slate-800 rounded-full shadow-2xs" />
              </div>

              {/* Progress Labels */}
              <div className="flex items-center justify-between text-[11px] font-bold font-mono text-slate-500">
                <span className="text-slate-500">13,500</span>
                <span className="text-slate-900 font-black">لا يزال يلزم 13,450 💎</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 5. ULTRA-REALISTIC WHITE & DARK WHITE "أدواتي" PANEL     */}
          {/* ========================================================= */}
          <div className="relative rounded-[32px] bg-white border border-slate-200 p-4 sm:p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] select-none">
            
            {/* Ambient Background Decorative Grid Marks */}
            <div className="absolute top-4 left-4 opacity-15 text-slate-300">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="2" y1="2" x2="10" y2="10" />
                <line x1="6" y1="2" x2="14" y2="10" />
                <line x1="10" y1="2" x2="18" y2="10" />
                <line x1="10" y1="2" x2="2" y2="10" />
                <line x1="14" y1="2" x2="6" y2="10" />
                <line x1="18" y1="2" x2="10" y2="10" />
              </svg>
            </div>

            {/* Header: "أدواتي" */}
            <div className="flex items-center justify-end mb-3.5 px-1">
              <h2 className="text-xl sm:text-2xl font-black font-serif tracking-wide text-slate-900">
                أدواتي
              </h2>
            </div>

            {/* 4x2 Grid of Cards */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">

              {/* ----------------- ROW 1 ----------------- */}

              {/* 1. وكالتي (Col 1 - Rightmost) */}
              <div 
                onClick={() => setCurrentSubView('my_agency')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[128px] hover:bg-slate-50 hover:border-slate-400 hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {/* 3D Inner Embossed Plinth */}
                <div className="w-full h-14 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  {/* Connected Avatars Network in Slate/Graphite/White */}
                  <svg className="w-9 h-9 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                    <defs>
                      <linearGradient id="monochromeGrad1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#334155" />
                        <stop offset="50%" stopColor="#1E293B" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                    </defs>
                    {/* Connecting Ring Lines */}
                    <line x1="24" y1="16" x2="14" y2="34" stroke="url(#monochromeGrad1)" strokeWidth="3" strokeLinecap="round" />
                    <line x1="24" y1="16" x2="34" y2="34" stroke="url(#monochromeGrad1)" strokeWidth="3" strokeLinecap="round" />
                    <line x1="14" y1="34" x2="34" y2="34" stroke="url(#monochromeGrad1)" strokeWidth="3" strokeLinecap="round" />
                    {/* Top Avatar Circle */}
                    <circle cx="24" cy="14" r="7" fill="#FFFFFF" stroke="url(#monochromeGrad1)" strokeWidth="2.5" />
                    <circle cx="24" cy="12" r="2.5" fill="url(#monochromeGrad1)" />
                    <path d="M20 17C20 15 22 14.5 24 14.5C26 14.5 28 15 28 17" stroke="url(#monochromeGrad1)" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Bottom Left Avatar Circle */}
                    <circle cx="14" cy="34" r="7" fill="#FFFFFF" stroke="url(#monochromeGrad1)" strokeWidth="2.5" />
                    <circle cx="14" cy="32" r="2.5" fill="url(#monochromeGrad1)" />
                    <path d="M10 37C10 35 12 34.5 14 34.5C16 34.5 18 35 18 37" stroke="url(#monochromeGrad1)" strokeWidth="1.5" strokeLinecap="round" />
                    {/* Bottom Right Avatar Circle */}
                    <circle cx="34" cy="34" r="7" fill="#FFFFFF" stroke="url(#monochromeGrad1)" strokeWidth="2.5" />
                    <circle cx="34" cy="32" r="2.5" fill="url(#monochromeGrad1)" />
                    <path d="M30 37C30 35 32 34.5 34 34.5C36 34.5 38 35 38 37" stroke="url(#monochromeGrad1)" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Text Label */}
                <span className="text-[11px] sm:text-xs font-black text-slate-800 group-hover:text-slate-950 tracking-tight mt-1 leading-tight transition-colors">
                  وكالتي
                </span>

                {/* Sub-Icon: Mini Shield */}
                <div className="w-4 h-4 flex items-center justify-center mt-0.5 opacity-90">
                  <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#F1F5F9" />
                  </svg>
                </div>
              </div>

              {/* 2. سجلات البث المباشر (Col 2) */}
              <div 
                onClick={() => setCurrentSubView('records')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[128px] hover:bg-slate-50 hover:border-slate-400 hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {/* 3D Inner Embossed Plinth */}
                <div className="w-full h-14 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  {/* Vintage Studio Microphone */}
                  <svg className="w-9 h-9 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                    <defs>
                      <linearGradient id="micDark" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="50%" stopColor="#1E293B" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                    </defs>
                    {/* Mic Capsule Body */}
                    <rect x="18" y="8" width="12" height="18" rx="6" fill="url(#micDark)" />
                    {/* Mic Grille Lines */}
                    <line x1="20" y1="13" x2="28" y2="13" stroke="#FFF" strokeWidth="1.2" opacity="0.6" />
                    <line x1="20" y1="17" x2="28" y2="17" stroke="#FFF" strokeWidth="1.2" opacity="0.6" />
                    <line x1="20" y1="21" x2="28" y2="21" stroke="#FFF" strokeWidth="1.2" opacity="0.6" />
                    {/* Metallic Outer U-Shape Ring */}
                    <path d="M14 18C14 24.5 18.5 29 24 29C29.5 29 34 24.5 34 18" stroke="url(#micDark)" strokeWidth="3" strokeLinecap="round" />
                    {/* Mic Stem */}
                    <line x1="24" y1="29" x2="24" y2="36" stroke="url(#micDark)" strokeWidth="3.5" strokeLinecap="round" />
                    {/* Mic Circular Pedestal Base */}
                    <ellipse cx="24" cy="38" rx="9" ry="3.5" fill="url(#micDark)" />
                  </svg>
                </div>

                {/* Text Label */}
                <span className="text-[10px] sm:text-[11px] font-black text-slate-800 group-hover:text-slate-950 tracking-tight mt-1 leading-tight line-clamp-2 transition-colors">
                  سجلات البث المباشر
                </span>

                {/* Sub-Icons */}
                <div className="flex items-center justify-center gap-1.5 mt-0.5 opacity-85 text-slate-600">
                  <span className="text-[9px] font-mono font-bold tracking-tighter">((•))</span>
                  <div className="w-3 h-2.5 border border-slate-400 rounded-[2px] grid grid-cols-2 gap-[1px] p-[1px]">
                    <div className="bg-slate-400/40 rounded-[1px]" />
                    <div className="bg-slate-400/40 rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* 3. محفظتي (Col 3) */}
              <div 
                onClick={() => setCurrentSubView('wallet')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[128px] hover:bg-slate-50 hover:border-slate-400 hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {/* 3D Inner Embossed Plinth */}
                <div className="w-full h-14 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  {/* Leather Wallet in Dark-White & Slate */}
                  <svg className="w-11 h-9 drop-shadow-xs" viewBox="0 0 48 40" fill="none">
                    <defs>
                      <linearGradient id="walletDark" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="50%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#1E293B" />
                      </linearGradient>
                      <linearGradient id="snapWhite" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#FFF" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                      </linearGradient>
                    </defs>
                    {/* Main Wallet Body */}
                    <rect x="5" y="8" width="38" height="26" rx="6" fill="url(#walletDark)" stroke="#0F172A" strokeWidth="1" />
                    {/* Stitching Highlight */}
                    <rect x="7" y="10" width="34" height="22" rx="4.5" fill="none" stroke="#E2E8F0" strokeWidth="0.8" strokeDasharray="1.5,1.5" opacity="0.6" />
                    {/* Flap Clasp */}
                    <path d="M26 15H39C41.5 15 43 17 43 19.5V22.5C43 25 41.5 27 39 27H26V15Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />
                    {/* Snap Button */}
                    <circle cx="37" cy="21" r="3.5" fill="url(#snapWhite)" stroke="#FFF" strokeWidth="0.8" />
                    <circle cx="37" cy="21" r="1.2" fill="#0F172A" />
                  </svg>
                </div>

                {/* Text Label */}
                <span className="text-[11px] sm:text-xs font-black text-slate-800 group-hover:text-slate-950 tracking-tight mt-1 leading-tight transition-colors">
                  محفظتي
                </span>

                {/* Sub-Icons */}
                <div className="flex items-center justify-center gap-1.5 mt-0.5 opacity-85 text-slate-600">
                  <span className="text-[9px]">🪙</span>
                  <span className="text-[9px]">👛</span>
                  <div className="w-3 h-3 border border-slate-400 rounded-[2px] bg-slate-100 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-slate-600" />
                  </div>
                </div>
              </div>

              {/* 4. تغيير الوكالة (Col 4 - Leftmost) */}
              <div 
                onClick={() => setCurrentSubView('change_agency')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[128px] hover:bg-slate-50 hover:border-slate-400 hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {/* 3D Inner Embossed Plinth */}
                <div className="w-full h-14 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  {/* Parchment Scroll & Fountain Pen in Slate & Silver */}
                  <svg className="w-10 h-10 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                    <defs>
                      <linearGradient id="scrollDark" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#F8FAFC" />
                        <stop offset="100%" stopColor="#E2E8F0" />
                      </linearGradient>
                      <linearGradient id="penDark" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                    </defs>
                    {/* Parchment Scroll */}
                    <path d="M12 10C10 10 9 11.5 9 13.5V33C9 35 10 36.5 12 36.5H30C32 36.5 33 35 33 33V13.5C33 11.5 32 10 30 10H12Z" fill="url(#scrollDark)" stroke="#64748B" strokeWidth="1.8" />
                    {/* Scroll Rolls */}
                    <path d="M9 13C9 11 11 9 13 9H31C33 9 34 11 34 13" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M9 33C9 35 11 37 13 37H33C35 37 36 35 36 33" stroke="#64748B" strokeWidth="1.8" strokeLinecap="round" />
                    {/* Text Lines */}
                    <line x1="14" y1="16" x2="26" y2="16" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                    <line x1="14" y1="20" x2="24" y2="20" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                    <line x1="14" y1="24" x2="21" y2="24" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
                    {/* Signature */}
                    <path d="M14 29Q17 28 19 30T23 29" stroke="#0F172A" strokeWidth="1.2" fill="none" />
                    {/* Slanted Pen */}
                    <g transform="rotate(35 28 22)">
                      <rect x="25" y="10" width="5" height="18" rx="2" fill="url(#penDark)" />
                      <path d="M25 28L27.5 34L30 28Z" fill="#F1F5F9" stroke="#0F172A" strokeWidth="0.5" />
                      <line x1="27.5" y1="30" x2="27.5" y2="33" stroke="#0F172A" strokeWidth="0.6" />
                    </g>
                  </svg>
                </div>

                {/* Text Label */}
                <span className="text-[11px] sm:text-xs font-black text-slate-800 group-hover:text-slate-950 tracking-tight mt-1 leading-tight transition-colors">
                  تغيير الوكالة
                </span>

                {/* Sub-Icon */}
                <div className="w-4 h-4 flex items-center justify-center mt-0.5 opacity-85 text-slate-600">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z" fill="#F1F5F9" />
                    <path d="M9 10h6M9 14h6" />
                  </svg>
                </div>
              </div>

              {/* ----------------- ROW 2 ----------------- */}

              {/* 5. داعمي (Col 1 - Rightmost) */}
              <div 
                onClick={() => setCurrentSubView('supporters')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[128px] hover:bg-slate-50 hover:border-slate-400 hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {/* 3D Inner Embossed Plinth */}
                <div className="w-full h-14 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  {/* Shield with Star & Growth Chart */}
                  <svg className="w-9 h-9 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                    <defs>
                      <linearGradient id="shieldDark" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="50%" stopColor="#334155" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                    </defs>
                    {/* Crest Shield */}
                    <path d="M24 6L37 11V22C37 31 29 39 24 42C19 39 11 31 11 22V11L24 6Z" fill="#F8FAFC" stroke="url(#shieldDark)" strokeWidth="2" />
                    {/* Star */}
                    <polygon points="24,12 25.8,16.5 30.5,16.8 26.8,19.8 28,24.5 24,21.8 20,24.5 21.2,19.8 17.5,16.8 22.2,16.5" fill="url(#shieldDark)" opacity="0.6" />
                    {/* Upward Growth Chart */}
                    <path d="M12 30L20 23L27 27L36 17" stroke="url(#shieldDark)" strokeWidth="2.5" strokeLinecap="round" />
                    <circle cx="12" cy="30" r="2.5" fill="url(#shieldDark)" />
                    <circle cx="20" cy="23" r="2.5" fill="url(#shieldDark)" />
                    <circle cx="27" cy="27" r="2.5" fill="url(#shieldDark)" />
                    <circle cx="36" cy="17" r="3" fill="#FFF" stroke="#0F172A" strokeWidth="1" />
                  </svg>
                </div>

                {/* Text Label */}
                <span className="text-[11px] sm:text-xs font-black text-slate-800 group-hover:text-slate-950 tracking-tight mt-1 leading-tight transition-colors">
                  داعمي
                </span>

                {/* Sub-Icon */}
                <div className="flex items-center justify-center gap-0.5 mt-0.5 opacity-85 text-slate-600">
                  <span className="text-[10px]">🤲</span>
                  <span className="text-[9px]">🪙</span>
                </div>
              </div>

              {/* 6. مستخدم جديد (Col 2) */}
              <div 
                onClick={() => setCurrentSubView('new_users')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[128px] hover:bg-slate-50 hover:border-slate-400 hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {/* 3D Inner Embossed Plinth */}
                <div className="w-full h-14 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  {/* Gift Box with Slate Ribbon */}
                  <svg className="w-10 h-10 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                    <defs>
                      <linearGradient id="ribbonDark" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                    </defs>
                    {/* Box Body */}
                    <rect x="11" y="20" width="26" height="20" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                    {/* Box Lid */}
                    <rect x="9" y="16" width="30" height="6" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                    {/* Ribbon Band */}
                    <rect x="22" y="16" width="4" height="24" fill="url(#ribbonDark)" />
                    {/* Keyhole */}
                    <circle cx="24" cy="27" r="1.5" fill="#0F172A" />
                    <polygon points="23,27 25,27 25.5,31 22.5,31" fill="#0F172A" />
                    {/* Bow */}
                    <path d="M24 16C21 11 15 10 16 14C17 17 22 16 24 16Z" fill="url(#ribbonDark)" stroke="#0F172A" strokeWidth="0.5" />
                    <path d="M24 16C27 11 33 10 32 14C31 17 26 16 24 16Z" fill="url(#ribbonDark)" stroke="#0F172A" strokeWidth="0.5" />
                    <circle cx="24" cy="16" r="2" fill="#E2E8F0" stroke="#0F172A" strokeWidth="0.5" />
                  </svg>
                </div>

                {/* Text Label */}
                <span className="text-[11px] sm:text-xs font-black text-slate-800 group-hover:text-slate-950 tracking-tight mt-1 leading-tight transition-colors">
                  مستخدم جديد
                </span>

                {/* Sub-Icon: Welcome Ribbon Banner */}
                <div className="px-1.5 py-0.5 rounded-[4px] border border-slate-300 bg-slate-100 text-[8px] font-bold font-serif text-slate-700 mt-0.5 leading-none shadow-2xs">
                  Welcome
                </div>
              </div>

              {/* 7. Download the invoice (Col 3) */}
              <div 
                onClick={() => setCurrentSubView('earnings_details')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[128px] hover:bg-slate-50 hover:border-slate-400 hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {/* 3D Inner Embossed Plinth */}
                <div className="w-full h-14 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  {/* Document with Downward Arrow */}
                  <svg className="w-9 h-9 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                    <defs>
                      <linearGradient id="docDark" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                    </defs>
                    {/* Document Outline */}
                    <path d="M14 9H28L36 17V37C36 39 34.5 40 32.5 40H14C12 40 10.5 39 10.5 37V12C10.5 10 12 9 14 9Z" fill="#FFF" stroke="url(#docDark)" strokeWidth="2.2" />
                    {/* Folded Corner */}
                    <path d="M28 9V17H36" stroke="url(#docDark)" strokeWidth="1.8" fill="#E2E8F0" />
                    {/* Arrow */}
                    <line x1="23.5" y1="21" x2="23.5" y2="33" stroke="url(#docDark)" strokeWidth="2.8" strokeLinecap="round" />
                    <polyline points="18,28.5 23.5,33.5 29,28.5" stroke="url(#docDark)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Text Label */}
                <span className="text-[9.5px] sm:text-[10.5px] font-black font-serif text-slate-800 group-hover:text-slate-950 tracking-tight mt-1 leading-tight transition-colors">
                  Download<br />the invoice
                </span>

                {/* Sub-Icon Spacer */}
                <div className="w-3 h-3" />
              </div>

              {/* 8. سجل العقود / الفواتير (Col 4 - Leftmost) */}
              <div 
                onClick={() => setCurrentSubView('contracts')}
                className="group relative rounded-2xl bg-white border border-slate-200 shadow-2xs p-2 flex flex-col items-center justify-between min-h-[128px] hover:bg-slate-50 hover:border-slate-400 hover:shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {/* 3D Inner Embossed Plinth */}
                <div className="w-full h-14 sm:h-16 rounded-xl bg-slate-50 border border-slate-200/80 shadow-inner flex items-center justify-center group-hover:bg-slate-100 transition-colors">
                  {/* Signed Contract Document */}
                  <svg className="w-9 h-9 drop-shadow-xs" viewBox="0 0 48 48" fill="none">
                    <defs>
                      <linearGradient id="contractDark" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#475569" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                    </defs>
                    {/* Document Shape */}
                    <path d="M14 9H28L36 17V37C36 39 34.5 40 32.5 40H14C12 40 10.5 39 10.5 37V12C10.5 10 12 9 14 9Z" fill="#FFF" stroke="url(#contractDark)" strokeWidth="2.2" />
                    {/* Folded Corner */}
                    <path d="M28 9V17H36" stroke="url(#contractDark)" strokeWidth="1.8" fill="#E2E8F0" />
                    {/* Paragraph Lines */}
                    <line x1="16" y1="21" x2="30" y2="21" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                    <line x1="16" y1="25" x2="28" y2="25" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                    <line x1="16" y1="29" x2="24" y2="29" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                    {/* Signature */}
                    <path d="M16 34Q19 33 21 35" stroke="#0F172A" strokeWidth="1.5" />
                    <polyline points="28,32 31,35 34,32" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                {/* Text Label */}
                <span className="text-[11px] sm:text-xs font-black text-slate-800 group-hover:text-slate-950 tracking-tight mt-1 leading-tight transition-colors">
                  العقود
                </span>

                {/* Sub-Icon */}
                <div className="w-3.5 h-3.5 border border-slate-400 rounded-[2.5px] bg-slate-100 flex items-center justify-center mt-0.5 opacity-85">
                  <div className="w-1.5 h-1.5 rounded-full border border-slate-400 bg-slate-600" />
                </div>
              </div>

            </div>

            {/* Bottom Watermark Hash */}
            <div className="text-center pt-3 pb-0.5 text-[11px] font-mono text-slate-400 font-bold tracking-widest opacity-80">
              f9d80c1a5f
            </div>

          </div>

        </div>
      )}

      {/* SUB-VIEWS IMPLEMENTATIONS */}

      {/* 1. وكالتي */}
      {currentSubView === 'my_agency' && (
        <MyAgencyView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 2. سجلات البث المباشر */}
      {currentSubView === 'records' && (
        <RecordsView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 3. محفظتي */}
      {currentSubView === 'wallet' && (
        <WalletView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 4. تغيير الوكالة */}
      {currentSubView === 'change_agency' && (
        <ChangeAgencyView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 4.1 طلب التحويل */}
      {currentSubView === 'transfer_request' && (
        <TransferRequestView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 4.2 سجل التحويل */}
      {currentSubView === 'transfer_history' && (
        <TransferHistoryView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 4.3 تعليقات على التحويل */}
      {currentSubView === 'transfer_faq' && (
        <TransferFaqView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 5. داعمي */}
      {currentSubView === 'supporters' && (
        <SupportersView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 6. مستخدم جديد */}
      {currentSubView === 'new_users' && (
        <NewUsersView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 6.1 قواعد المستخدم الجديد */}
      {currentSubView === 'new_users_rules' && (
        <NewUsersRulesView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 7. Download the invoice / تفاصيل الأرباح / قسيمة الراتب */}
      {currentSubView === 'earnings_details' && (
        <EarningsDetailsView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* 8. العقود */}
      {currentSubView === 'contracts' && (
        <ContractsView onNavigate={setCurrentSubView} showAlert={showAlert} />
      )}

      {/* Legacy Sub-view: My Broadcasters list (for agency leader view) */}
      {currentSubView === 'my_broadcasters' && (
        <div className="w-full max-w-md mx-auto p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute top-3.5 right-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="البحث باسم المذيع أو ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-slate-400 shadow-2xs"
            />
          </div>

          <div className="space-y-2.5">
            {broadcastersList.filter(b => b.name.includes(searchTerm) || b.id.includes(searchTerm)).map((host) => (
              <div key={host.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div className="text-left space-y-0.5">
                  <div className="font-mono font-black text-xs text-slate-900">{host.diamonds} 💎</div>
                  <div className="text-[10px] text-slate-500 font-bold">{host.days} يوم / {host.hours}</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-900 flex items-center justify-end gap-1">
                      {host.name}
                      {host.role && (
                        <span className="text-[9px] bg-slate-100 text-slate-700 border border-slate-300 px-1.5 py-0.5 rounded font-bold">
                          {host.role === 'broker' ? 'وسيط' : 'مذيع'}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">ID:{host.id}</div>
                  </div>
                  <img src={host.avatar} alt={host.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-xs" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legacy Sub-view: Invite */}
      {currentSubView === 'invite' && (
        <div className="w-full max-w-md mx-auto p-4 space-y-4">
          <form onSubmit={handleSendInvite} className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4 shadow-xs">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-white flex items-center justify-center mx-auto text-xl font-bold shadow-sm">
                🎙️
              </div>
              <h3 className="text-sm font-black text-slate-900 font-serif">دعوة مذيع بالـ ID</h3>
              <p className="text-xs text-slate-500 font-medium">أدخل معرّف المذيع لإرسال رسالة دعوة وشروط الانضمام الرسمية إلى رسائله</p>
            </div>

            {inviteSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-2xl text-center animate-fade-in leading-relaxed">
                {inviteSuccess}
              </div>
            )}

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-700 block">
                معرّف المذيع (ID):
              </label>
              <input 
                type="text" 
                placeholder="مثال: 81156183"
                value={inviteId}
                onChange={(e) => setInviteId(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5 text-right">
              <label className="text-xs font-bold text-slate-700 block">
                نص رسالة الدعوة:
              </label>
              <textarea 
                rows={3}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-400 focus:bg-white resize-none"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 text-right leading-relaxed font-medium">
              ℹ️ عند الإرسال، ستصل رسالة رسمية للوكالة ورسالة من الوكيل مع نموذج بنود وشروط التعاقد التي يوافق عليها المضيف للانضمام للوكالة.
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 active:scale-98 text-white font-black text-xs rounded-2xl shadow-sm transition-all cursor-pointer border border-slate-700"
            >
              إرسال الدعوة للمذيع
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
