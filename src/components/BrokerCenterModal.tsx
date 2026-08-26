import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Search, UserMinus, UserCheck, Copy, Check, BookOpen, AlertTriangle } from 'lucide-react';

interface BrokerCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
}

const SAMPLE_BROKERS = [
  { id: '551902', name: 'أحمد الوسيط', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', activeHosts: 18, totalDiamonds: '940,000', commission: '30%' },
  { id: '662091', name: 'سلطان ميديا', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', activeHosts: 25, totalDiamonds: '1,420,000', commission: '35%' },
  { id: '771239', name: 'قاسم للإعلام', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', activeHosts: 12, totalDiamonds: '610,000', commission: '25%' },
  { id: '883910', name: 'مريم بروكر', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', activeHosts: 15, totalDiamonds: '780,000', commission: '30%' },
  { id: '994012', name: 'وكالة النجوم للوساطة', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80', activeHosts: 30, totalDiamonds: '1,890,000', commission: '40%' },
  { id: '110293', name: 'طارق لإدارة المواهب', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', activeHosts: 8, totalDiamonds: '320,000', commission: '20%' },
];

export const BrokerCenterModal: React.FC<BrokerCenterModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl'
}) => {
  const [currentSubView, setCurrentSubView] = useState<'main' | 'my_brokers' | 'invite_broker' | 'remove_broker' | 'guidelines'>('main');
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
      {/* Top Header Bar */}
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
          {currentSubView === 'main' && (isRtl ? 'مركز الوسطاء' : 'Broker Center')}
          {currentSubView === 'my_brokers' && (isRtl ? 'وسطائي (6/11)' : 'My Brokers (6/11)')}
          {currentSubView === 'invite_broker' && (isRtl ? 'دعوة الوسطاء' : 'Invite Brokers')}
          {currentSubView === 'remove_broker' && (isRtl ? 'إزالة الوسيط' : 'Remove Broker')}
          {currentSubView === 'guidelines' && (isRtl ? 'التوجيه والإرشادات' : 'Broker Guidelines')}
        </h1>

        <div className="w-5" />
      </div>

      {/* Main Menu Matching Screenshot */}
      {currentSubView === 'main' && (
        <div className="w-full bg-white mt-3 border-y border-slate-100 divide-y divide-slate-100">
          
          {/* وسطائي */}
          <button 
            onClick={() => setCurrentSubView('my_brokers')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-1.5 font-mono text-sm">
              {isRtl ? <ChevronLeft className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
              <span className="font-bold text-slate-400">11/</span>
              <span className="font-extrabold text-[#00C853]">6</span>
            </div>
            <span className="text-sm font-medium text-slate-800">
              {isRtl ? 'وسطائي' : 'My Brokers'}
            </span>
          </button>

          {/* دعوة الوسطاء */}
          <button 
            onClick={() => setCurrentSubView('invite_broker')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isRtl ? <ChevronLeft className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
            <span className="text-sm font-medium text-slate-800">
              {isRtl ? 'دعوة الوسطاء' : 'Invite Brokers'}
            </span>
          </button>

          {/* إزالة الوسيط */}
          <button 
            onClick={() => setCurrentSubView('remove_broker')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isRtl ? <ChevronLeft className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
            <span className="text-sm font-medium text-slate-800">
              {isRtl ? 'إزالة الوسيط' : 'Remove Broker'}
            </span>
          </button>

          {/* التوجيه */}
          <button 
            onClick={() => setCurrentSubView('guidelines')}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {isRtl ? <ChevronLeft className="w-4 h-4 text-slate-300" /> : <ChevronRight className="w-4 h-4 text-slate-300" />}
            <span className="text-sm font-medium text-slate-800">
              {isRtl ? 'التوجيه' : 'Guidelines'}
            </span>
          </button>

        </div>
      )}

      {/* Sub-view: My Brokers */}
      {currentSubView === 'my_brokers' && (
        <div className="w-full max-w-md mx-auto p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute top-3.5 right-3.5 text-slate-400" />
            <input 
              type="text"
              placeholder="البحث باسم الوسيط أو ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-2.5">
            {SAMPLE_BROKERS.filter(b => b.name.includes(searchTerm) || b.id.includes(searchTerm)).map((broker) => (
              <div key={broker.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
                <div className="text-left space-y-0.5">
                  <div className="font-mono font-bold text-xs text-blue-600">{broker.totalDiamonds} 💎</div>
                  <div className="text-[10px] text-slate-500 font-bold">{broker.activeHosts} مذيع نشط • نسبة: {broker.commission}</div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-800">{broker.name}</div>
                    <div className="text-[10px] font-mono text-slate-400">ID:{broker.id}</div>
                  </div>
                  <img src={broker.avatar} alt={broker.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-view: Invite Broker */}
      {currentSubView === 'invite_broker' && (
        <div className="w-full max-w-md mx-auto p-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              🤝
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">دعوة وسيط جديد للوكالة</h3>
              <p className="text-xs text-slate-500 mt-1">يستطيع الوسيط إدارة مذيعيه وتوزيع العمولات ضمن وكالتك</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono font-bold text-slate-700 flex items-center justify-between">
              <span>https://yoho.live/broker/join/30032</span>
              <button 
                onClick={() => handleCopy('https://yoho.live/broker/join/30032')}
                className="p-1.5 bg-white border border-slate-200 hover:bg-emerald-50 text-emerald-600 rounded-lg cursor-pointer transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view: Remove Broker */}
      {currentSubView === 'remove_broker' && (
        <div className="w-full max-w-md mx-auto p-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-xs font-black text-slate-900">إلغاء اعتماد وسيط</h3>
            </div>
            <p className="text-xs text-slate-500">عند إزالة الوسيط سيتم نقل جميع المذيعين المرتبطين به إلى إدارة الوكالة المباشرة</p>
            
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 block">معرّف الوسيط المراد إزالته (ID):</label>
              <input type="text" placeholder="أدخل ID الوسيط..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold" />
            </div>

            <button className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-xs cursor-pointer mt-2">
              تأكيد إزالة الوسيط
            </button>
          </div>
        </div>
      )}

      {/* Sub-view: Guidelines */}
      {currentSubView === 'guidelines' && (
        <div className="w-full max-w-md mx-auto p-4 space-y-3">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 space-y-3">
            <h3 className="text-xs font-black text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>دليل وتوجيهات الوسطاء</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed font-medium">
              <li>يحق للوكيل تعيين حتى 11 وسيطاً معتمداً كحد أقصى.</li>
              <li>يتم احتساب عمولة الوسيط بناءً على مستهدف الماسات الشهري لمذيعيه.</li>
              <li>يجب على كل وسيط تحقيق ما لا يقل عن 500,000 ماسة شهرياً للحفاظ على اعتماده.</li>
              <li>تسوى العمولات شهرياً بالتزامن مع إصدار قسيمة الراتب.</li>
            </ul>
          </div>
        </div>
      )}

    </div>
  );
};
