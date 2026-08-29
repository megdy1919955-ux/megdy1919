import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getBroadcastersCount, subscribeToAgencyInvitations } from '../lib/agencyInvitationService';

interface AgencyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  direction?: 'rtl' | 'ltr';
  agencyGid?: string;
  agencyName?: string;
}

export const AgencyInfoModal: React.FC<AgencyInfoModalProps> = ({
  isOpen,
  onClose,
  direction = 'rtl',
  agencyGid = '30032',
  agencyName = 'AbuAmjad'
}) => {
  const [broadcasterCount, setBroadcasterCount] = useState(getBroadcastersCount());

  useEffect(() => {
    setBroadcasterCount(getBroadcastersCount());
    const unsub = subscribeToAgencyInvitations(() => {
      setBroadcasterCount(getBroadcastersCount());
    });
    return unsub;
  }, []);

  if (!isOpen) return null;
  const isRtl = direction === 'rtl';

  return (
    <div 
      className={`fixed inset-0 z-80 w-full h-full min-h-screen bg-[#F6F8FB] flex flex-col overflow-y-auto select-none ${
        isRtl ? 'text-right' : 'text-left'
      }`}
      dir={direction}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-100">
        <button 
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
          title="إغلاق"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-slate-800 tracking-tight">
          {isRtl ? 'معلومات الوكالة' : 'Agency Information'}
        </h1>

        <div className="w-5" />
      </div>

      {/* Rows Container */}
      <div className="w-full bg-white mt-3 border-y border-slate-100 divide-y divide-slate-100">
        
        {/* معرف الوكالة */}
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            {isRtl ? 'معرّف الوكالة:' : 'Agency ID:'}
          </span>
          <span className="font-mono font-bold text-sm text-slate-900">
            {agencyGid}
          </span>
        </div>

        {/* اسم الوكالة */}
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            {isRtl ? 'اسم الوكالة:' : 'Agency Name:'}
          </span>
          <span className="font-bold text-sm text-slate-900">
            {agencyName}
          </span>
        </div>

        {/* مستوى الوكالة */}
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            {isRtl ? 'مستوى الوكالة:' : 'Agency Level:'}
          </span>
          <span className="font-mono font-bold text-sm text-slate-900">
            F
          </span>
        </div>

        {/* التصنيف الشهري */}
        <div className="px-5 py-4 flex items-start justify-between">
          <span className="text-sm font-medium text-slate-500 pt-0.5">
            {isRtl ? 'التصنيف الشهري:' : 'Monthly Rank:'}
          </span>
          <div className="text-left space-y-1">
            <div className="font-mono font-bold text-sm text-slate-900">
              553
            </div>
            <div className="text-xs font-medium text-[#00C853]">
              {isRtl ? '30245 قبل اللحاق بأقرب منافسيك' : '30245 before catching up with competitors'}
            </div>
          </div>
        </div>

        {/* عدد المذيعين */}
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            {isRtl ? 'عدد المذيعين:' : 'Broadcasters Count:'}
          </span>
          <span className="font-mono font-bold text-sm text-slate-900">
            {broadcasterCount}
          </span>
        </div>

        {/* وقت الانضمام */}
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">
            {isRtl ? 'وقت الانضمام:' : 'Joined Date:'}
          </span>
          <span className="font-mono font-medium text-xs sm:text-sm text-slate-900">
            (utc+0)16:06:39 2025-12-16
          </span>
        </div>

      </div>
    </div>
  );
};
