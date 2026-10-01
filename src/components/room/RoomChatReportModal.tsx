import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Send, X, ShieldAlert } from 'lucide-react';
import { ChatMessage } from './roomTypes';

export interface RoomChatReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: ChatMessage | null;
  onSubmitReport: (message: ChatMessage, reason: string) => void;
}

/**
 * نافذة الإبلاغ المنفصلة تماماً (RoomChatReportModal)
 * - منفصلة 100% ومستقلة عن أي كود
 * - تعرض الرسالة المبلغ عنها واسم المرسل
 * - تتيح كتابة أو اختيار ملاحظة الإبلاغ
 * - تحتوي على زرين محددين:
 *   1. الزر الأول: إرسال البلاغ
 *   2. الزر الثاني: إغلاق النافذة
 */
export const RoomChatReportModal: React.FC<RoomChatReportModalProps> = ({
  isOpen,
  onClose,
  message,
  onSubmitReport
}) => {
  const [reportNote, setReportNote] = useState('');
  const [selectedReason, setSelectedReason] = useState('محتوى غير لائق أو سب');

  if (!isOpen || !message) return null;
  if (typeof document === 'undefined') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = reportNote.trim()
      ? `${selectedReason} - ${reportNote.trim()}`
      : selectedReason;
    onSubmitReport(message, finalReason);
    setReportNote('');
    onClose();
  };

  const reasons = [
    'محتوى غير لائق أو سب',
    'إعلانات ومحتوى عشوائي (Spam)',
    'تحرش أو مضايقة',
    'احتيال أو انتحال شخصية'
  ];

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 pointer-events-auto select-none" dir="rtl">
      {/* خلفية معتمة خفيفة */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* نافذة التبليغ المستقلة */}
      <div
        className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-[#0f1422] border border-rose-500/40 shadow-[0_16px_48px_rgba(0,0,0,0.9)] p-4 text-white flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* رأس النافذة */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-rose-200">إبلاغ عن رسالة</h3>
              <p className="text-[10px] text-slate-400">سيتم مراجعة البلاغ من قِبل إدارة الغرفة</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* عرض الرسالة المبلغ عنها */}
        <div className="rounded-2xl bg-black/40 border border-white/10 p-2.5 flex flex-col gap-1">
          <span className="text-[10.5px] font-bold text-amber-300">
            الرسالة المبلغ عنها (من @{message.userName}):
          </span>
          <p className="text-xs text-slate-200 bg-white/5 rounded-lg p-2 leading-relaxed [overflow-wrap:anywhere]">
            "{message.text}"
          </p>
        </div>

        {/* أسباب الإبلاغ السريعة */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-slate-300">سبب الإبلاغ:</label>
          <div className="grid grid-cols-2 gap-1.5">
            {reasons.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedReason(r)}
                className={`text-[10px] p-2 rounded-xl border text-right transition-all font-semibold ${
                  selectedReason === r
                    ? 'border-rose-400 bg-rose-500/25 text-rose-200 shadow-sm'
                    : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* حقل ملاحظة الإبلاغ */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-slate-300">ملاحظة إضافية (اختياري):</label>
          <textarea
            value={reportNote}
            onChange={(e) => setReportNote(e.target.value)}
            placeholder="اكتب تفاصيل إضافية عن سبب الإبلاغ..."
            rows={2}
            className="w-full text-xs rounded-xl bg-slate-900/80 border border-white/15 p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 resize-none transition-colors"
          />
        </div>

        {/* الزرين المطلوبين: 1. إرسال البلاغ | 2. إغلاق النافذة */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* الزر الأول: إرسال البلاغ */}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 active:scale-95 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>إرسال البلاغ</span>
          </button>

          {/* الزر الثاني: إغلاق النافذة */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 border border-white/10 text-slate-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>إغلاق النافذة</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
