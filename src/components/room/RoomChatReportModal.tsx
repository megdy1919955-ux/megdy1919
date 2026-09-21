import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export interface RoomChatReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserName: string;
  targetMessageText?: string;
  onSubmitReport: (reason: string, details?: string) => void;
}

export const REPORT_REASONS = [
  'اباحية',
  'السب الكيدي',
  'احتيال',
  'العنف والدم والدم',
  'إعلانات',
  'مضايقة',
  'سلامة الطفل',
] as const;

export const RoomChatReportModal: React.FC<RoomChatReportModalProps> = ({
  isOpen,
  onClose,
  targetUserName,
  targetMessageText,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('السب الكيدي');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmitReport(selectedReason, targetMessageText);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-xs p-0 sm:p-4 select-none animate-fadeIn"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white text-slate-900 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-black text-slate-900 absolute left-1/2 -translate-x-1/2">
            البلاغ
          </h2>
          <div className="w-5" />
        </div>

        {/* Orange / Amber Header Bar exactly matching Image 3 */}
        <div className="bg-amber-500 text-white px-5 py-2.5 font-bold text-sm flex items-center justify-between shadow-xs">
          <span>بلاغ ضد: {targetUserName}</span>
          <span className="text-xs opacity-90 font-mono">كما</span>
        </div>

        {/* Instruction Subtext */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
          <p className="text-xs font-medium text-slate-500">
            الرجاء إخبارنا لماذا تريد الإبلاغ عن هذا المستخدم:
          </p>
        </div>

        {/* Reasons List matching Image 3 */}
        <div className="flex-1 overflow-y-auto px-5 py-2 divide-y divide-slate-100">
          {REPORT_REASONS.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <label
                key={reason}
                onClick={() => setSelectedReason(reason)}
                className="flex items-center justify-between py-3.5 px-1 cursor-pointer hover:bg-slate-50/80 rounded-xl transition-colors select-none"
              >
                {/* Reason Text */}
                <span className={`text-sm font-bold ${isSelected ? 'text-slate-950 font-black' : 'text-slate-800'}`}>
                  {reason}
                </span>

                {/* Radio Circle */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-slate-300 bg-transparent'
                  }`}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white shadow-xs" />}
                </div>
              </label>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center gap-3">
          {isSubmitted ? (
            <div className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم استلام البلاغ وسيتم اتخاذ الإجراء اللازم فوراً</span>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs shadow-md transition-all cursor-pointer"
              >
                إرسال البلاغ
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
