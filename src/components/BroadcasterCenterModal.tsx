import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Search, UserPlus, ArrowRightLeft, Copy, Check, Filter } from 'lucide-react';

interface BroadcasterCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
}

const SAMPLE_BROADCASTERS = [
  { id: '81156183', name: 'السيطره', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', status: 'نشط', diamonds: '320,500', days: 24, hours: '65.5h' },
  { id: '84448587', name: 'روح', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', status: 'نشط', diamonds: '280,100', days: 22, hours: '58.0h' },
  { id: '77290112', name: 'النسر الذهبي', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', status: 'نشط', diamonds: '410,000', days: 26, hours: '72.0h' },
  { id: '90123841', name: 'أميرة الصوت', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', status: 'نشط', diamonds: '640,000', days: 28, hours: '85.5h' },
  { id: '66201944', name: 'نجم اليمن', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', status: 'نشط', diamonds: '399,155', days: 25, hours: '64.0h' },
  { id: '44510923', name: 'فارس الليل', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', status: 'نشط', diamonds: '410,000', days: 21, hours: '52.0h' },
];

export const BroadcasterCenterModal: React.FC<BroadcasterCenterModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl'
}) => {
  const [currentSubView, setCurrentSubView] = useState<'main' | 'my_broadcasters' | 'invite' | 'invite_history' | 'transfer'>('main');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;
  const isRtl = direction === 'rtl';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div 
      className={`fixed inset-0 z-80 w-full h-full min-h-screen bg-[#F6F8FB] flex flex-col overflow-y-auto select-none ${
        isRtl ? 'text-right' : 'text-left'
      }`}
      dir={direction}
    >
      {/* Top Bar */}
      <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-100">
        <button 
          onClick={() => {
            if (currentSubView !== 'main') {
              setCurrentSubView('main');
            } else {
              onClose();
            }
          }}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          title={currentSubView !== 'main' ? 'رجوع' : 'إغلاق'}
        >
          {currentSubView !== 'main' ? (
            isRtl ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5 stroke-[2.2]" />
          )}
        </button>

        <h1 className="text-base font-bold text-slate-800 tracking-tight">
          {currentSubView === 'main' && (isRtl ? 'مركز المذيعين' : 'Broadcaster Center')}
          {currentSubView === 'my_broadcasters' && (isRtl ? 'المذيع الخاص بي (198)' : 'My Broadcasters (198)')}
          {currentSubView === 'invite' && (isRtl ? 'دعوة المذيعين' : 'Invite Broadcasters')}
          {currentSubView === 'invite_history' && (isRtl ? 'سجل الدعوات' : 'Invitation History')}
          {currentSubView === 'transfer' && (isRtl ? 'نقل المضيف إلى وسيط' : 'Transfer Host to Broker')}
        </h1>

        <div className="w-5" />
      </div>

      {/* Main View Matching Screenshot */}
      {currentSubView === 'main' && (
        <div className="w-full bg-white mt-3 border-y border-slate-100 divide-y divide-slate-100">
          
          {/* المذيع الخاص بي */}
          <button 
            onClick={() => setCurrentSubView('my_broadcasters')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {isRtl ? <ChevronLeft className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
              <span className="font-mono font-bold text-sm text-[#00C853]">198</span>
            </div>
            <span className="text-sm font-medium text-slate-800">
              {isRtl ? 'المذيع الخاص بي' : 'My Broadcaster'}
            </span>
          </button>

          {/* دعوة المذيعين */}
          <button 
            onClick={() => setCurrentSubView('invite')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isRtl ? <ChevronLeft className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
            <span className="text-sm font-medium text-slate-800">
              {isRtl ? 'دعوة المذيعين' : 'Invite Broadcasters'}
            </span>
          </button>

          {/* سجل الدعوات */}
          <button 
            onClick={() => setCurrentSubView('invite_history')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isRtl ? <ChevronLeft className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
            <span className="text-sm font-medium text-slate-800">
              {isRtl ? 'سجل الدعوات' : 'Invitation Records'}
            </span>
          </button>

          {/* نقل المضيف إلى وسيط */}
          <button 
            onClick={() => setCurrentSubView('transfer')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isRtl ? <ChevronLeft className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
            <span className="text-sm font-medium text-slate-800">
              {isRtl ? 'نقل المضيف إلى وسيط' : 'Transfer Host to Broker'}
            </span>
          </button>

        </div>
      )}

      {/* Sub-view: My Broadcasters list */}
      {currentSubView === 'my_broadcasters' && (
        <div className="w-full max-w-md mx-auto p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute top-3.5 right-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="البحث باسم المذيع أو ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2.5">
            {SAMPLE_BROADCASTERS.filter(b => b.name.includes(searchTerm) || b.id.includes(searchTerm)).map((host) => (
              <div key={host.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div className="text-left space-y-0.5">
                  <div className="font-mono font-bold text-xs text-blue-600">{host.diamonds} 💎</div>
                  <div className="text-[10px] text-slate-400">{host.days} يوم / {host.hours}</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-800">{host.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">ID:{host.id}</div>
                  </div>
                  <img src={host.avatar} alt={host.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-view: Invite */}
      {currentSubView === 'invite' && (
        <div className="w-full max-w-md mx-auto p-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto text-2xl">
              🎙️
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">رابط دعوة مذيع جديد للوكالة</h3>
              <p className="text-xs text-slate-500 mt-1">شارك هذا الرابط أو رمز الوكالة مع المذيع للانضمام مباشرة</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono font-bold text-slate-700 flex items-center justify-between">
              <span>https://yoho.live/invite/agency/30032</span>
              <button 
                onClick={() => handleCopy('https://yoho.live/invite/agency/30032')}
                className="p-1.5 bg-white border border-slate-200 hover:bg-blue-50 text-blue-600 rounded-lg cursor-pointer transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="pt-2">
              <span className="text-xs text-slate-400 font-bold block mb-1">رمز الوكالة المباشر:</span>
              <span className="text-2xl font-black font-mono text-blue-600 bg-blue-50 px-4 py-1.5 rounded-xl inline-block">30032</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view: Invite History */}
      {currentSubView === 'invite_history' && (
        <div className="w-full max-w-md mx-auto p-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">تم القبول ✓</span>
            <div>
              <span className="font-bold text-slate-800 block">سالي العلي (ID: 710923)</span>
              <span className="text-[10px] text-slate-400">انضم بتاريخ 2026-08-14</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between text-xs">
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">تم القبول ✓</span>
            <div>
              <span className="font-bold text-slate-800 block">الكابتن ماجد (ID: 991204)</span>
              <span className="text-[10px] text-slate-400">انضم بتاريخ 2026-08-10</span>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view: Transfer */}
      {currentSubView === 'transfer' && (
        <div className="w-full max-w-md mx-auto p-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 space-y-3 shadow-xs">
            <h3 className="text-xs font-black text-slate-900">نقل مذيع إلى وسيط معتمد</h3>
            <p className="text-xs text-slate-500">اختر المذيع والوسيط التابع لوكالتك لنقل إدارته وإسناد المهام</p>
            
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">معرّف المذيع (ID):</label>
              <input type="text" placeholder="أدخل ID المذيع..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">معرّف الوسيط (Broker ID):</label>
              <input type="text" placeholder="أدخل ID الوسيط..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
            </div>

            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer mt-2">
              تأكيد النقل
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
