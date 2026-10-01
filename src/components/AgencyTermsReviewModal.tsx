import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Building2, User, Sparkles } from 'lucide-react';
import { AgencyInvitation, acceptInvitation, rejectInvitation } from '../lib/agencyInvitationService';

interface AgencyTermsReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitation: AgencyInvitation | null;
  onAccepted?: () => void;
  onRejected?: () => void;
  direction?: 'rtl' | 'ltr';
}

export const AgencyTermsReviewModal: React.FC<AgencyTermsReviewModalProps> = ({
  isOpen,
  onClose,
  invitation,
  onAccepted,
  onRejected,
  direction = 'rtl'
}) => {
  const [agreed, setAgreed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !invitation) return null;
  const isRtl = direction === 'rtl';

  const handleAccept = () => {
    if (!agreed) return;
    setIsProcessing(true);
    setTimeout(() => {
      acceptInvitation(invitation.id);
      setIsProcessing(false);
      setSuccessMessage('تهانينا! تم قبول الدعوة والانضمام رسمياً إلى الوكالة 🌟');
      setTimeout(() => {
        setSuccessMessage(null);
        onAccepted?.();
        onClose();
      }, 1800);
    }, 600);
  };

  const handleReject = () => {
    rejectInvitation(invitation.id);
    onRejected?.();
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-70 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 select-none"
        dir={direction}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden text-slate-900"
        >
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight">
                  {isRtl ? 'شروط وضوابط الانضمام للوكالة' : 'Agency Terms & Conditions'}
                </h3>
                <p className="text-[10px] text-white/80 font-medium">
                  {isRtl ? 'عقد وبنود انضمام المذيع الرسمي' : 'Official Broadcaster Agreement'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-right">
            {successMessage ? (
              <div className="py-10 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#00C458] flex items-center justify-center mx-auto text-3xl shadow-xs animate-bounce">
                  <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                </div>
                <h4 className="text-base font-black text-slate-900">تم الانضمام بنجاح!</h4>
                <p className="text-xs font-bold text-emerald-600 px-4 leading-relaxed">
                  {successMessage}
                </p>
              </div>
            ) : (
              <>
                {/* بطاقة تفاصيل الدعوة */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                    <span className="font-mono font-bold text-slate-900">
                      {invitation.hostId}
                    </span>
                    <span className="text-slate-500 font-bold flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      {isRtl ? 'معرّف المضيف المدعو:' : 'Invited Host ID:'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                    <span className="font-bold text-slate-900">
                      {invitation.agencyName} ({invitation.agencyGid})
                    </span>
                    <span className="text-slate-500 font-bold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-purple-500" />
                      {isRtl ? 'الوكالة المستضيفة:' : 'Host Agency:'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                    <span className="font-bold text-blue-600">
                      {invitation.inviterType === 'broker' ? `وسيط معتمد (${invitation.inviterName})` : 'الوكالة الرئيسية'}
                    </span>
                    <span className="text-slate-500 font-bold">
                      {isRtl ? 'جهة الإرسال:' : 'Invited By:'}
                    </span>
                  </div>

                  {invitation.commissionRate && (
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200/60">
                      <span className="font-mono font-black text-emerald-600">
                        {invitation.commissionRate}
                      </span>
                      <span className="text-slate-500 font-bold">
                        {isRtl ? 'نسبة عمولة الوساطة:' : 'Broker Commission:'}
                      </span>
                    </div>
                  )}

                  {invitation.message && (
                    <div className="pt-1 text-xs">
                      <span className="text-slate-400 font-bold block mb-1">
                        {isRtl ? 'رسالة الدعوة المرفقة:' : 'Invitation Note:'}
                      </span>
                      <p className="text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/70 leading-relaxed font-medium">
                        "{invitation.message}"
                      </p>
                    </div>
                  )}
                </div>

                {/* بنود الشروط الرسمية */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400">5 بنود إلزامية</span>
                    <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {isRtl ? 'شروط وبنود الانضمام المعتمدة:' : 'Official Agreement Terms:'}
                    </h4>
                  </div>

                  <div className="space-y-2 bg-slate-50/60 p-3 rounded-2xl border border-slate-200/60">
                    {invitation.terms.map((term, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-mono font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="font-medium text-right flex-1">{term}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* إقرار الموافقة */}
                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 cursor-pointer hover:bg-blue-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs font-bold text-slate-800 select-none">
                    {isRtl
                      ? 'أقر بقراءة وموافقتي التامة على شروط وبنود الوكالة المذكورة أعلاه.'
                      : 'I acknowledge and agree to all the terms and conditions mentioned above.'}
                  </span>
                </label>
              </>
            )}
          </div>

          {/* Footer Actions */}
          {!successMessage && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 active:scale-98 text-slate-700 font-bold text-xs rounded-2xl transition-all cursor-pointer disabled:opacity-50"
              >
                {isRtl ? 'رفض الدعوة' : 'Decline'}
              </button>

              <button
                onClick={handleAccept}
                disabled={!agreed || isProcessing}
                className="flex-2 py-3 bg-[#00C458] hover:bg-[#00B04F] active:scale-98 text-white font-black text-xs rounded-2xl shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <span>{isRtl ? 'جاري الانضمام...' : 'Joining...'}</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isRtl ? 'الموافقة والانضمام للوكالة' : 'Accept & Join Agency'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
