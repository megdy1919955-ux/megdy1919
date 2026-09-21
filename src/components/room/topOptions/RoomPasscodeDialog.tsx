import React, { useState } from 'react';
import { KeyRound, Check } from 'lucide-react';

export interface RoomPasscodeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (passcode: string) => void;
}

export const RoomPasscodeDialog: React.FC<RoomPasscodeDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [passcode, setPasscode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!passcode || passcode.length !== 6) {
      return;
    }
    onSubmit(passcode);
    setPasscode('');
  };

  return (
    <div className="py-2 space-y-4 mt-8">
      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 text-slate-900">
        <KeyRound className="w-6 h-6 text-amber-500 shrink-0" />
        <div>
          <h3 className="font-extrabold text-sm text-slate-900">تثبيت رمز قفل الغرفة (Passcode)</h3>
          <p className="text-[11px] text-slate-500">أدخل رمزاً سرياً لمنع الدخول بدون إذن المتطابق</p>
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="رمز القفل المكون من 6 أرقام..."
          value={passcode}
          onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:bg-white"
          autoFocus
        />
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>تأكيد القفل 🔒</span>
        </button>
        <button
          onClick={onClose}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors border border-slate-200"
        >
          إلغاء
        </button>
      </div>
    </div>
  );
};

export default RoomPasscodeDialog;
