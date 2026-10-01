import React, { useState } from 'react';
import { X } from 'lucide-react';

interface HostStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
  initialTab?: 'all' | 'incomplete' | 'dropped';
}

interface HostStatItem {
  id: string;
  name: string;
  avatar?: string;
  avatarType?: 'image' | 'offline_badge';
  joinedTime: string;
  monthlyDiamonds: string;
  periodChange: string;
  isPositiveChange: boolean;
  broadcastDaysDone: number;
  broadcastDaysRequired: number;
  status: string;
  category: 'all' | 'incomplete' | 'dropped';
}

const SAMPLE_HOST_STATS: HostStatItem[] = [
  {
    id: '87377569',
    name: 'القيادة ⚔️',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    avatarType: 'image',
    joinedTime: '2025-12-24T13:17:32Z',
    monthlyDiamonds: '2,000,131',
    periodChange: '33.34%',
    isPositiveChange: true,
    broadcastDaysDone: 8,
    broadcastDaysRequired: 7,
    status: 'مكتمل',
    category: 'all'
  },
  {
    id: '83534797',
    name: '🔱👑ملك👑الدوله🔱 (🇾🇪🤨)',
    avatarType: 'offline_badge',
    joinedTime: '2026-02-01T15:01:12Z',
    monthlyDiamonds: '1,008,299',
    periodChange: '3,823.34%',
    isPositiveChange: true,
    broadcastDaysDone: 16,
    broadcastDaysRequired: 7,
    status: 'مكتمل',
    category: 'all'
  },
  {
    id: '93627993',
    name: 'مزاجي 😎',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    avatarType: 'image',
    joinedTime: '2026-02-24T00:25:50Z',
    monthlyDiamonds: '125,600',
    periodChange: '2.01%',
    isPositiveChange: true,
    broadcastDaysDone: 17,
    broadcastDaysRequired: 7,
    status: 'مكتمل',
    category: 'all'
  },
  {
    id: '90123841',
    name: 'أميرة الصوت 🎤',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    avatarType: 'image',
    joinedTime: '2026-01-15T09:40:11Z',
    monthlyDiamonds: '640,000',
    periodChange: '-46.60%',
    isPositiveChange: false,
    broadcastDaysDone: 5,
    broadcastDaysRequired: 7,
    status: 'غير مكتمل',
    category: 'incomplete'
  },
  {
    id: '66201944',
    name: 'نجم اليمن 🌟',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200',
    avatarType: 'image',
    joinedTime: '2025-11-20T18:33:04Z',
    monthlyDiamonds: '399,155',
    periodChange: '-53.00%',
    isPositiveChange: false,
    broadcastDaysDone: 4,
    broadcastDaysRequired: 7,
    status: 'غير مكتمل',
    category: 'dropped'
  },
  {
    id: '44510923',
    name: 'فارس الليل 🌙',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    avatarType: 'image',
    joinedTime: '2026-03-02T11:15:22Z',
    monthlyDiamonds: '410,000',
    periodChange: '-33.80%',
    isPositiveChange: false,
    broadcastDaysDone: 6,
    broadcastDaysRequired: 7,
    status: 'غير مكتمل',
    category: 'dropped'
  },
  {
    id: '55981022',
    name: 'صوت الخليج 🎙️',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    avatarType: 'image',
    joinedTime: '2025-10-10T14:20:00Z',
    monthlyDiamonds: '680,000',
    periodChange: '-24.40%',
    isPositiveChange: false,
    broadcastDaysDone: 7,
    broadcastDaysRequired: 7,
    status: 'مكتمل',
    category: 'dropped'
  },
  {
    id: '33219088',
    name: 'ملكة الإحساس 👑',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    avatarType: 'image',
    joinedTime: '2026-01-05T08:12:44Z',
    monthlyDiamonds: '1,120,000',
    periodChange: '-25.30%',
    isPositiveChange: false,
    broadcastDaysDone: 7,
    broadcastDaysRequired: 7,
    status: 'مكتمل',
    category: 'dropped'
  },
  {
    id: '77290112',
    name: 'النسر الذهبي 🦅',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
    avatarType: 'image',
    joinedTime: '2025-12-01T20:45:10Z',
    monthlyDiamonds: '590,000',
    periodChange: '-24.30%',
    isPositiveChange: false,
    broadcastDaysDone: 7,
    broadcastDaysRequired: 7,
    status: 'مكتمل',
    category: 'dropped'
  }
];

export const HostStatisticsModal: React.FC<HostStatisticsModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl',
  initialTab = 'all'
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'incomplete' | 'dropped'>(initialTab);

  if (!isOpen) return null;
  const isRtl = direction === 'rtl';

  const filteredHosts = SAMPLE_HOST_STATS.filter(host => {
    if (activeTab === 'all') return true;
    if (activeTab === 'incomplete') return host.broadcastDaysDone < host.broadcastDaysRequired;
    if (activeTab === 'dropped') return host.isPositiveChange === false;
    return true;
  });

  return (
    <div 
      className={`fixed inset-0 z-80 w-full h-full min-h-screen bg-[#F4F6F9] flex flex-col overflow-y-auto select-none ${
        isRtl ? 'text-right' : 'text-left'
      }`}
      dir={direction}
    >
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-100">
        <div className="w-6" />

        <h1 className="text-base font-black text-slate-800 tracking-tight">
          {isRtl ? 'إحصائيات المضيف' : 'Host Statistics'}
        </h1>

        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5 stroke-[2.4]" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-md mx-auto px-4 py-3.5 space-y-3.5 pb-20 flex-1">
        
        {/* Pills Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
          {/* Tab 1: الكل */}
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeTab === 'all'
                ? 'bg-[#EBF7FD] text-[#20A6F4] border border-[#20A6F4]'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isRtl ? 'الكل' : 'All'}
          </button>

          {/* Tab 2: لم يتم إكمال طلب البث المباشر */}
          <button
            onClick={() => setActiveTab('incomplete')}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeTab === 'incomplete'
                ? 'bg-[#EBF7FD] text-[#20A6F4] border border-[#20A6F4]'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isRtl ? 'لم يتم إكمال طلب البث المباشر' : 'Live Incomplete'}
          </button>

          {/* Tab 3: انخفاض ملحوظ */}
          <button
            onClick={() => setActiveTab('dropped')}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap shadow-2xs ${
              activeTab === 'dropped'
                ? 'bg-[#EBF7FD] text-[#20A6F4] border border-[#20A6F4]'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isRtl ? 'انخفاض ملحوظ' : 'High Drop'}
          </button>
        </div>

        {/* Member Count Header */}
        <div className="text-right px-1">
          <span className="text-xs font-bold text-slate-900">
            {isRtl ? `${activeTab === 'all' ? 22 : filteredHosts.length} من مجموع الأعضاء` : `${activeTab === 'all' ? 22 : filteredHosts.length} Total Members`}
          </span>
        </div>

        {/* Host Cards List */}
        <div className="space-y-3">
          {filteredHosts.map((host) => (
            <div 
              key={host.id}
              className="bg-white rounded-3xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-slate-100/90 space-y-2.5"
            >
              {/* Row 1: Profile Avatar & Name + ID */}
              <div className="flex items-start justify-end gap-3">
                <div className="text-right">
                  <div className="text-sm font-black text-slate-900 leading-tight">
                    {host.name}
                  </div>
                  <div className="text-xs font-mono text-slate-500 font-bold mt-1">
                    ID:{host.id}
                  </div>
                </div>

                {host.avatarType === 'offline_badge' ? (
                  <div className="w-12 h-12 rounded-full bg-black text-white flex flex-col items-center justify-center font-bold text-[10px] leading-tight shrink-0 shadow-xs">
                    <span>مغلق</span>
                    <span className="text-[9px] text-amber-500 font-mono">off</span>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shadow-xs shrink-0 bg-slate-900">
                    <img 
                      src={host.avatar} 
                      alt={host.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Row 2: وقت الانضمام (Green Timestamp) */}
              <div className="text-right text-xs font-medium text-[#00D068] font-mono">
                {isRtl ? `وقت الانضمام:${host.joinedTime}` : `Joined:${host.joinedTime}`}
              </div>

              {/* Row 3: الماس المستلم هذا الشهر + نفس الفترة */}
              <div className="pt-0.5 text-right space-y-1">
                <div className="text-xs text-slate-900 font-bold">
                  {isRtl ? 'الماس المستلم هذا الشهر:' : 'Diamonds this month:'}{' '}
                  <span className="text-[#00D068] font-mono font-black inline-flex items-center gap-1">
                    <span>💎</span>
                    <span>{host.monthlyDiamonds}</span>
                  </span>
                </div>
                <div className={`text-xs font-mono font-black ${host.isPositiveChange ? 'text-[#00D068]' : 'text-rose-500'}`}>
                  {isRtl ? `نفس الفترة:${host.periodChange}` : `Same period:${host.periodChange}`}
                </div>
              </div>

              {/* Row 4: أيام البث + حالة الاكتمال */}
              <div className="pt-0.5 flex items-center justify-between text-xs">
                {/* Status on left */}
                <span className={`font-bold ${host.status === 'مكتمل' ? 'text-[#20A6F4]' : 'text-slate-400'}`}>
                  {host.status}
                </span>

                {/* Days on right */}
                <div className="text-right font-bold text-slate-800">
                  <span>{isRtl ? 'أيام البث:' : 'Broadcast Days:'} </span>
                  <span className="font-mono text-[#00D068] font-black">{host.broadcastDaysDone}</span>
                  <span className="font-mono text-slate-500">/{host.broadcastDaysRequired} {isRtl ? 'أيام' : 'days'}</span>
                </div>
              </div>

            </div>
          ))}

          {filteredHosts.length === 0 && (
            <div className="bg-white rounded-3xl p-8 text-center text-slate-400 text-xs font-bold border border-slate-100">
              لا توجد بيانات حالياً
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
