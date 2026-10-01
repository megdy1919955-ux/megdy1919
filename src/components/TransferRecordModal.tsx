import React, { useState } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

interface TransferRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
}

interface TransferItem {
  id: string;
  type: string;
  status: string;
  hostName: string;
  hostId: string;
  hostAvatar: string;
  leaveAgency: string;
  joinAgency: string;
  requestTime: string;
}

const SAMPLE_TRANSFERS: TransferItem[] = [
  {
    id: 'tx-1',
    type: 'إيقاف البث مؤقتًا والتحويل',
    status: 'تمت الموافقة',
    hostName: 'السيطره',
    hostId: '81156183',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    leaveAgency: '21810(United Agency)',
    joinAgency: '30032(AbuAmjad)',
    requestTime: '11-07-2026 00:36:43(utc+0)'
  },
  {
    id: 'tx-2',
    type: 'تحويل عادي',
    status: 'تمت الموافقة',
    hostName: 'روح',
    hostId: '84448587',
    hostAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    leaveAgency: '30032(AbuAmjad)',
    joinAgency: '24088(Alno5ba)',
    requestTime: '29-06-2026 05:08:14(utc+0)'
  },
  {
    id: 'tx-3',
    type: 'إيقاف البث مؤقتًا والتحويل',
    status: 'تمت الموافقة',
    hostName: 'سلطان الغرام',
    hostId: '92103441',
    hostAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    leaveAgency: '19804(Star Live)',
    joinAgency: '30032(AbuAmjad)',
    requestTime: '15-05-2026 12:20:01(utc+0)'
  }
];

export const TransferRecordModal: React.FC<TransferRecordModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl'
}) => {
  const [selectedType, setSelectedType] = useState('كل الأنواع');
  const [selectedStatus, setSelectedStatus] = useState('كل الحالات');
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (!isOpen) return null;
  const isRtl = direction === 'rtl';

  const typeOptions = ['كل الأنواع', 'إيقاف البث مؤقتًا والتحويل', 'تحويل عادي'];
  const statusOptions = ['كل الحالات', 'تمت الموافقة', 'قيد الانتظار', 'مرفوض'];

  const filteredTransfers = SAMPLE_TRANSFERS.filter(item => {
    const matchType = selectedType === 'كل الأنواع' || item.type === selectedType;
    const matchStatus = selectedStatus === 'كل الحالات' || item.status === selectedStatus;
    return matchType && matchStatus;
  });

  return (
    <div 
      className={`fixed inset-0 z-80 w-full h-full min-h-screen bg-[#F6F8FB] flex flex-col overflow-y-auto select-none ${
        isRtl ? 'text-right' : 'text-left'
      }`}
      dir={direction}
    >
      {/* Top Header Bar */}
      <div className="sticky top-0 z-40 bg-[#F6F8FB]/95 backdrop-blur-md px-4 py-3.5 flex items-center justify-between border-b border-slate-100">
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-200/70 rounded-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-slate-800 tracking-tight">
          {isRtl ? 'سجل التحويل' : 'Transfer Record'}
        </h1>

        <div className="w-5" />
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-md mx-auto px-4 py-3 space-y-3 pb-16 flex-1">

        {/* Filter Dropdowns Bar */}
        <div className="flex items-center gap-3">
          {/* Dropdown 1: كل الأنواع */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowTypeMenu(!showTypeMenu);
                setShowStatusMenu(false);
              }}
              className="w-full bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all cursor-pointer text-xs font-bold text-slate-700"
            >
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showTypeMenu ? 'rotate-180' : ''}`} />
              <span className="truncate">{selectedType}</span>
            </button>

            {showTypeMenu && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden py-1">
                {typeOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedType(opt);
                      setShowTypeMenu(false);
                    }}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                      selectedType === opt ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedType === opt && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dropdown 2: كل الحالات */}
          <div className="relative flex-1">
            <button
              onClick={() => {
                setShowStatusMenu(!showStatusMenu);
                setShowTypeMenu(false);
              }}
              className="w-full bg-white border border-slate-200 rounded-full px-4 py-2 flex items-center justify-between shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:border-slate-300 transition-all cursor-pointer text-xs font-bold text-slate-700"
            >
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showStatusMenu ? 'rotate-180' : ''}`} />
              <span className="truncate">{selectedStatus}</span>
            </button>

            {showStatusMenu && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden py-1">
                {statusOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSelectedStatus(opt);
                      setShowStatusMenu(false);
                    }}
                    className={`w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold transition-colors cursor-pointer ${
                      selectedStatus === opt ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedStatus === opt && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Transfer Cards List */}
        <div className="space-y-3 pt-1">
          {filteredTransfers.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-[0_1px_6px_rgba(0,0,0,0.02)] space-y-3 text-right"
            >
              {/* Header: Title and Status Badge */}
              <div className="flex items-center justify-between">
                <span className="bg-[#E8F8F0] text-[#00C853] font-bold text-[11px] px-2.5 py-0.5 rounded-md">
                  {item.status}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {item.type}
                </h3>
              </div>

              {/* Host info row */}
              <div className="space-y-1">
                <span className="text-xs text-slate-400 block font-medium">مذيع:</span>
                <div className="flex items-center justify-end gap-3 pt-0.5">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">{item.hostName}</span>
                    <span className="text-xs font-mono text-slate-500 font-bold block">ID:{item.hostId}</span>
                  </div>
                  <img 
                    src={item.hostAvatar} 
                    alt={item.hostName} 
                    className="w-11 h-11 rounded-full object-cover border border-slate-100 shadow-2xs"
                  />
                </div>
              </div>

              {/* Agency transition details */}
              <div className="pt-2 border-t border-slate-50 space-y-1.5 text-xs">
                <div className="text-slate-700 font-medium font-mono text-right">
                  مغادرة الوكالة: {item.leaveAgency}
                </div>
                <div className="text-slate-700 font-medium font-mono text-right">
                  الانضمام إلى الوكالة: {item.joinAgency}
                </div>
                <div className="text-slate-400 font-medium font-mono text-xs text-right pt-0.5">
                  وقت الطلب: {item.requestTime}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Hash Watermark */}
        <div className="text-center pt-6 pb-2">
          <span className="text-[10px] font-mono text-slate-200 tracking-wider select-none">
            a3af1ab6b900c285e533bba47dea273b
          </span>
        </div>

      </div>
    </div>
  );
};
