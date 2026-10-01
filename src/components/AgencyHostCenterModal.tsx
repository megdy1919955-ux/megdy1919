import React, { useState } from 'react';
import { 
  X, ChevronLeft, ArrowLeft, Search, UserPlus, Clock, CheckCircle2, 
  Copy, RefreshCw, Users, Shield, ArrowRightLeft, Sparkles, Filter, 
  Calendar, Check, AlertCircle, PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface AgencyHostCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
  agencyGid?: string;
  agencyName?: string;
}

export interface AgencyHost {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  diamonds: string;
  liveDuration: string;
  liveDays: string;
  isClosed?: boolean;
  assignedBroker?: string;
}

export interface AgencyInvite {
  id: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
  invitedVia: string;
}

export const AgencyHostCenterModal: React.FC<AgencyHostCenterModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl',
  agencyGid = '30032',
  agencyName = 'وكالة الأساطير الذهبية'
}) => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'menu' | 'my_anchors' | 'invite' | 'history' | 'transfer'>('menu');
  
  // Toast Alert State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Hosts List State
  const [hostsList, setHostsList] = useState<AgencyHost[]>([
    {
      id: '82846546',
      name: '👑 الملكة سارة',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-07-14 18:22:04',
      diamonds: '1,420,800',
      liveDuration: '48ساعات',
      liveDays: '22أيام',
      isClosed: false,
      assignedBroker: 'وسيط بغداد الرسمي (83534797)'
    },
    {
      id: '78427093',
      name: 'طرب الشرق 🎵',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-07-19 21:05:11',
      diamonds: '1,008,299',
      liveDuration: '38ساعات',
      liveDays: '16أيام',
      isClosed: false,
      assignedBroker: 'وكالة الرياض المعتمدة (78498351)'
    },
    {
      id: '87377569',
      name: 'برنس الليالي ✨',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-06-28 14:10:45',
      diamonds: '890,500',
      liveDuration: '32ساعات',
      liveDays: '14أيام',
      isClosed: false
    },
    {
      id: '89124401',
      name: 'زهرة الخليج 🌸',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-05-12 11:30:00',
      diamonds: '640,000',
      liveDuration: '28ساعات',
      liveDays: '12أيام',
      isClosed: true
    },
    {
      id: '81156183',
      name: 'صوت دجلة 🎤',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-08-01 16:45:20',
      diamonds: '450,200',
      liveDuration: '24ساعات',
      liveDays: '10أيام',
      isClosed: false,
      assignedBroker: 'وسيط بغداد الرسمي (83534797)'
    },
    {
      id: '85541902',
      name: 'شمس الرياض ☀️',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-07-02 20:15:30',
      diamonds: '390,000',
      liveDuration: '35ساعات',
      liveDays: '18أيام',
      isClosed: false,
      assignedBroker: 'وكالة الرياض المعتمدة (78498351)'
    },
    {
      id: '86654120',
      name: 'عازف القانون 🎻',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-06-18 19:10:00',
      diamonds: '310,000',
      liveDuration: '20ساعات',
      liveDays: '10أيام',
      isClosed: true
    },
    {
      id: '81190234',
      name: 'صقر الجزيرة 🦅',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
      joinDate: '2026-05-14 17:00:00',
      diamonds: '280,500',
      liveDuration: '30ساعات',
      liveDays: '15أيام',
      isClosed: true,
      assignedBroker: 'وكالة الرياض المعتمدة (78498351)'
    }
  ]);

  // Search Filter
  const [hostSearchQuery, setHostSearchQuery] = useState('');

  // 2. Invites State
  const [inviteHostId, setInviteHostId] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteBrokerId, setInviteBrokerId] = useState('none');
  const [invitesHistory, setInvitesHistory] = useState<AgencyInvite[]>([
    {
      id: 'INV-109',
      hostId: '89104523',
      hostName: 'نجم السهارى',
      hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      date: '2026-08-30 20:15',
      status: 'pending',
      invitedVia: 'دعوة مباشرة من الوكالة'
    },
    {
      id: 'INV-108',
      hostId: '82231908',
      hostName: 'أميرة البوب',
      hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      date: '2026-08-28 14:02',
      status: 'accepted',
      invitedVia: 'وسيط بغداد (83534797)'
    },
    {
      id: 'INV-107',
      hostId: '84992011',
      hostName: 'المايسترو وائل',
      hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      date: '2026-08-25 18:40',
      status: 'rejected',
      invitedVia: 'دعوة مباشرة من الوكالة'
    }
  ]);

  // 3. Transfer State
  const [selectedHostToTransfer, setSelectedHostToTransfer] = useState<string>('');
  const [targetBrokerId, setTargetBrokerId] = useState<string>('83534797');

  if (!isOpen) return null;

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteHostId.trim()) {
      showToast('⚠️ يرجى كتابة معرّف المضيف (Host ID)');
      return;
    }

    const newInvite: AgencyInvite = {
      id: `INV-${Date.now().toString().slice(-4)}`,
      hostId: inviteHostId.trim(),
      hostName: `مضيف جديد (${inviteHostId.trim()})`,
      hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      date: new Date().toISOString().substring(0, 16).replace('T', ' '),
      status: 'pending',
      invitedVia: inviteBrokerId === 'none' ? 'إدارة الوكالة' : `الوسيط (${inviteBrokerId})`
    };

    setInvitesHistory([newInvite, ...invitesHistory]);
    showToast(`🚀 تم إرسال طلب الانضمام بنجاح للمستخدم ${inviteHostId.trim()}`);
    setInviteHostId('');
    setInvitePhone('');
    setCurrentView('history');
  };

  const handleExecuteTransfer = () => {
    if (!selectedHostToTransfer) {
      showToast('⚠️ يرجى اختيار المضيف المراد نقله');
      return;
    }
    
    setHostsList(prev => prev.map(h => {
      if (h.id === selectedHostToTransfer) {
        return {
          ...h,
          assignedBroker: targetBrokerId === 'none' ? undefined : `وسيط (${targetBrokerId})`
        };
      }
      return h;
    }));

    showToast(`✅ تم نقل المضيف ${selectedHostToTransfer} بنجاح`);
    setSelectedHostToTransfer('');
    setCurrentView('my_anchors');
  };

  const filteredHosts = hostsList.filter(h => 
    h.name.toLowerCase().includes(hostSearchQuery.toLowerCase()) || 
    h.id.includes(hostSearchQuery)
  );

  return (
    <div dir="rtl" className="select-none font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-[160] bg-slate-900/95 text-white px-5 py-2.5 rounded-full text-xs font-black shadow-2xl border border-white/20 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* VIEW 1: MAIN MENU MODAL */}
      {/* ========================================================================= */}
      {currentView === 'menu' && (
        <div className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full max-w-sm sm:max-w-md bg-white rounded-[28px] overflow-hidden text-slate-900 shadow-2xl space-y-4 select-none relative pb-6"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100/90">
              <h2 className="text-lg font-black text-slate-900">
                مركز المضيفين
              </h2>

              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                title="إغلاق"
              >
                <X className="w-6 h-6 stroke-[2.2]" />
              </button>
            </div>

            {/* List Options */}
            <div className="px-4">
              <div className="bg-white rounded-2xl overflow-hidden divide-y divide-slate-100">
                
                {/* Option 1: my anchor */}
                <div 
                  onClick={() => setCurrentView('my_anchors')}
                  className="py-4 px-2 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <span className="text-base font-bold text-slate-800">
                    my anchor
                  </span>
                  
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>

                {/* Option 2: دعوة المضيف */}
                <div 
                  onClick={() => setCurrentView('invite')}
                  className="py-4 px-2 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <span className="text-base font-bold text-slate-800">
                    دعوة المضيف
                  </span>
                  
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>

                {/* Option 3: سجل الدعوات */}
                <div 
                  onClick={() => setCurrentView('history')}
                  className="py-4 px-2 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <span className="text-base font-bold text-slate-800">
                    سجل الدعوات
                  </span>
                  
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>

                {/* Option 4: نقل المضيف إلى وسيط */}
                <div 
                  onClick={() => setCurrentView('transfer')}
                  className="py-4 px-2 flex items-center justify-between hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <span className="text-base font-bold text-slate-800">
                    نقل المضيف إلى وسيط
                  </span>
                  
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>

              </div>
            </div>

            {/* Agency metadata footer */}
            <div className="px-5 pt-3 text-center text-slate-400 text-xs font-bold border-t border-slate-100/80">
              <span>{agencyName}</span>
              <span className="mx-2">•</span>
              <span className="font-mono">GID: {agencyGid}</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: MY ANCHORS FULL SCREEN (ملء الشاشة مع التمرير السلس) */}
      {/* ========================================================================= */}
      {currentView === 'my_anchors' && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[130] bg-[#f4f6f9] text-slate-900 flex flex-col w-full h-full overflow-hidden"
        >
          {/* Top Sticky Header */}
          <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs z-10">
            <button 
              onClick={() => setCurrentView('menu')}
              className="p-2 -mr-1 rounded-full hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 rotate-180 text-slate-800" />
              <span>رجوع</span>
            </button>

            <div className="text-center">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                my anchor
              </h2>
              <span className="text-[11px] text-teal-700 font-bold block font-mono">
                {hostsList.length} مذيع معتمد في الوكالة
              </span>
            </div>

            <button 
              onClick={onClose}
              className="p-2 -ml-1 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title="إغلاق كامل"
            >
              <X className="w-5 h-5 stroke-[2.2]" />
            </button>
          </div>

          {/* Full Screen Scrollable Broadcasters List - يرتفع للأعلى بالكامل مع البحث والإحصائيات */}
          <div className="flex-1 overflow-y-auto w-full px-3.5 sm:px-6 py-3.5 custom-scrollbar">
            <div className="max-w-2xl mx-auto space-y-3.5 pb-24">
              
              {/* Search Box inside scroll container (يرتفع للأعلى مع التمرير) */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={hostSearchQuery}
                    onChange={(e) => setHostSearchQuery(e.target.value)}
                    placeholder="بحث باسم المذيع أو الـ ID..."
                    className="w-full pl-3 pr-9 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500 shadow-2xs transition-all"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-700 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl font-bold shadow-2xs">
                  <span>المذيعين المعروضين: <strong className="text-slate-900 font-mono">{filteredHosts.length}</strong></span>
                  <span className="text-emerald-600">النشطين: <strong className="font-mono">{filteredHosts.filter(h => !h.isClosed).length}</strong></span>
                </div>
              </div>

              {/* Host Cards */}
              <div className="space-y-3.5 pt-0.5">
                {filteredHosts.map((host) => (
                  <div 
                    key={host.id} 
                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-slate-200/90 space-y-3 relative"
                  >
                  {/* Top Row: User Avatar, Name, ID */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <img 
                        src={host.avatar} 
                        alt={host.name} 
                        className="w-12 h-12 rounded-full object-cover border border-slate-100 shadow-xs"
                      />
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                          {host.name}
                        </h4>
                        <span className="text-xs font-mono text-slate-500 font-bold block mt-0.5" dir="ltr">
                          ID: {host.id}
                        </span>
                      </div>
                    </div>

                    {host.isClosed ? (
                      <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-white flex items-center gap-1.5 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                        <div className="text-right">
                          <span className="text-[10px] font-black block leading-none">مغلق</span>
                          <span className="text-[8px] text-slate-300 font-mono block mt-0.5">تسكير التارغت</span>
                        </div>
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1.5 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-black">نشط ويبيث ✓</span>
                      </div>
                    )}
                  </div>

                  {/* Details Grid */}
                  <div className="pt-3 border-t border-slate-100 space-y-2 text-xs font-bold">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-xs">وقت الانضمام:</span>
                      <span className="text-emerald-600 font-mono text-xs font-black" dir="ltr">
                        {host.joinDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-600 text-xs">الماس المستلم شهرياً:</span>
                      <div className="flex items-center gap-1" dir="ltr">
                        <span className="text-slate-900 font-mono font-black text-sm">
                          {host.diamonds}
                        </span>
                        <span className="text-blue-500 text-xs">💎</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600 text-[11px]">مدة البث:</span>
                        <span className="text-sky-600 font-black text-xs font-mono">
                          {host.liveDuration}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between">
                        <span className="text-slate-600 text-[11px]">أيام البث:</span>
                        <span className="text-indigo-600 font-black text-xs font-mono">
                          {host.liveDays}
                        </span>
                      </div>
                    </div>

                    {host.assignedBroker && (
                      <div className="flex items-center justify-between pt-1 text-xs text-purple-800 bg-purple-50 p-2.5 rounded-xl border border-purple-200/60">
                        <span>الوسيط المسؤول:</span>
                        <span className="font-black">{host.assignedBroker}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              </div>

              {filteredHosts.length === 0 && (
                <div className="text-center py-20 text-slate-400 text-sm font-bold bg-white rounded-2xl border border-dashed border-slate-200">
                  لا يوجد مذيعين يطابقون كلمة البحث
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: INVITE HOST */}
      {/* ========================================================================= */}
      {currentView === 'invite' && (
        <div className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full max-w-sm sm:max-w-md bg-white rounded-[28px] p-5 sm:p-6 text-slate-900 shadow-2xl space-y-4 select-none relative"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentView('menu')}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                <span>رجوع</span>
              </button>

              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 pt-1">
              <div className="w-14 h-14 rounded-2xl bg-teal-100/80 text-teal-700 flex items-center justify-center shadow-xs">
                <UserPlus className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-black text-slate-900 text-center">
                دعوة مضيف جديد للوكالة
              </h2>
              <p className="text-slate-500 text-xs font-bold text-center">
                <span>{agencyName}</span>
                <span className="mx-1.5">•</span>
                <span>معرف الوكالة GID: <strong className="text-slate-800">{agencyGid}</strong></span>
              </p>
            </div>

            {/* GID Display & Copy */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-700 block">
                معرف الوكالة (GID):
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(agencyGid);
                    showToast(`✅ تم نسخ معرف الوكالة GID: ${agencyGid}`);
                  }}
                  className="bg-[#0f9d75] hover:bg-[#0c8261] text-white px-3.5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-xs active:scale-95 transition-all cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>نسخ GID</span>
                </button>
                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-center font-mono font-black text-xl text-emerald-600 tracking-wider shadow-xs">
                  {agencyGid}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSendInvite} className="space-y-3.5 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  معرف المستخدم المراد دعوته (Host ID):
                </label>
                <input 
                  type="text"
                  value={inviteHostId}
                  onChange={(e) => setInviteHostId(e.target.value)}
                  placeholder="أدخل رقم ID المضيف (مثال: 82846546)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-center font-mono text-sm font-bold text-slate-900 focus:bg-white focus:border-teal-500 focus:outline-none shadow-xs transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  رقم هاتف المضيف (اختياري للتواصل):
                </label>
                <input 
                  type="text"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  placeholder="مثال: +964 770 000 0000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-mono text-slate-800 focus:bg-white focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  تعيين تحت إشراف وسيط (اختياري):
                </label>
                <select
                  value={inviteBrokerId}
                  onChange={(e) => setInviteBrokerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                >
                  <option value="none">مدير الوكالة مباشرة (بدون وسيط)</option>
                  <option value="83534797">🔱 ملك الدولة (وسيط بغداد)</option>
                  <option value="78498351">🦅 وسيط الرياض المعتمد</option>
                  <option value="81145220">🇪🇬 مندوب القاهرة الدولي</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentView('menu')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition-colors cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-black bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-all cursor-pointer"
                >
                  إرسال دعوة الانضمام
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: INVITES HISTORY */}
      {/* ========================================================================= */}
      {currentView === 'history' && (
        <div className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full max-w-sm sm:max-w-md h-[90vh] max-h-[820px] bg-white rounded-[28px] p-5 text-slate-900 shadow-2xl flex flex-col select-none relative"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <button 
                onClick={() => setCurrentView('menu')}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                <span>رجوع</span>
              </button>

              <h2 className="text-base font-black text-slate-900">
                سجل دعوات المضيفين
              </h2>

              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            {/* List of Invites */}
            <div className="flex-1 overflow-y-auto space-y-3 pt-3 pr-0.5 pl-0.5 custom-scrollbar">
              {invitesHistory.map((inv) => (
                <div key={inv.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={inv.hostAvatar} alt={inv.hostName} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{inv.hostName}</h4>
                        <span className="text-[10px] font-mono text-slate-500" dir="ltr">ID: {inv.hostId}</span>
                      </div>
                    </div>

                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      inv.status === 'accepted' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : inv.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {inv.status === 'accepted' ? 'تم القبول' : inv.status === 'pending' ? 'قيد الانتظار' : 'مرفوض'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{inv.invitedVia}</span>
                    <span className="font-mono text-[10px]">{inv.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 5: TRANSFER HOST */}
      {/* ========================================================================= */}
      {currentView === 'transfer' && (
        <div className="fixed inset-0 z-[120] bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full max-w-sm sm:max-w-md bg-white rounded-[28px] p-5 sm:p-6 text-slate-900 shadow-2xl space-y-4 select-none relative"
          >
            <div className="flex items-center justify-between">
              <button 
                onClick={() => setCurrentView('menu')}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1 text-xs font-bold cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 rotate-180" />
                <span>رجوع</span>
              </button>

              <button 
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.2]" />
              </button>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1.5 pt-1">
              <div className="w-13 h-13 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-xs">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <h2 className="text-base font-black text-slate-900 text-center">
                نقل المضيف إلى وسيط
              </h2>
              <p className="text-slate-500 text-xs font-bold text-center">
                إعادة توزيع المذيعين تحت إشراف الوسطاء المعتمدين
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  1. اختر المضيف المراد نقله:
                </label>
                <select 
                  value={selectedHostToTransfer}
                  onChange={(e) => setSelectedHostToTransfer(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">-- اضغط لاختيار المضيف --</option>
                  {hostsList.map(h => (
                    <option key={h.id} value={h.id}>
                      {h.name} (ID: {h.id}) {h.assignedBroker ? `[الوسيط: ${h.assignedBroker.split(' ')[0]}]` : '[مباشر]'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  2. اختر الوسيط الجديد المستلم:
                </label>
                <select 
                  value={targetBrokerId}
                  onChange={(e) => setTargetBrokerId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:outline-none"
                >
                  <option value="none">إدارة الوكالة مباشرة (إلغاء الوسيط)</option>
                  <option value="83534797">🔱 ملك الدولة (وسيط بغداد)</option>
                  <option value="78498351">🦅 وسيط الرياض المعتمد</option>
                  <option value="81145220">🇪🇬 مندوب القاهرة الدولي</option>
                </select>
              </div>

              <button 
                onClick={handleExecuteTransfer}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer mt-2"
              >
                تأكيد النقل
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};

export default AgencyHostCenterModal;
