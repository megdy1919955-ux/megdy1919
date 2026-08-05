import React from 'react';
import { 
  X, 
  Terminal, 
  ShieldCheck, 
  Sliders, 
  Mic, 
  Cpu, 
  Radio, 
  Wrench, 
  Sparkles, 
  ChevronLeft,
  CheckCircle2,
  Lock
} from 'lucide-react';

interface DevPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  devId?: string;
}

export const DevPanelModal: React.FC<DevPanelModalProps> = ({ 
  isOpen, 
  onClose, 
  userId = 'YE1330000', 
  devId = 'YE1330000' 
}) => {
  if (!isOpen) return null;

  const isDevAllowed = userId === devId || userId === 'YE1330000';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 text-right" dir="rtl">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg ring-1 ring-white/20">
              <Terminal className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white tracking-wide">خيارات المطور والمالك</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>نشط</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">لوحة التحكم والإعدادات المتقدمة للنظام</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Access Verification Banner */}
        <div className="px-5 py-3 bg-slate-900/50 border-b border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>صلاحية المطور مؤكدة (ID: {userId})</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/50">
            devId == userId
          </span>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          
          {/* Developer Welcome Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shrink-0">
                <Wrench className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-indigo-200">مرحباً بك في لوحة المطور والمالك 🛠️</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  تم ربط هذه الشاشة بنجاح بحسابك المالي/المطور. تم تجهيز الشاشة لاستقبال كافة أدوات التحكم والمؤشرات الديناميكية في الخطوات القادمة.
                </p>
              </div>
            </div>
          </div>

          {/* Planned Dynamic Controls Sections (Placeholders Ready for Controls) */}
          <div className="space-y-3">
            <h5 className="text-xs font-black text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>أدوات التحكم المجهزة (قيد التطوير الديناميكي)</span>
            </h5>

            {/* Placeholder 1: Mic Wave Glow Controls */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-slate-200">شريط توهج ذبذبات المايكات (Mic Wave Glow)</h6>
                    <span className="text-[10px] text-slate-400">التحكم المباشر في درجة السطوع والتأثيرات البصرية</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                  مُجهز للإضافة
                </span>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>الوضع الحالي: ناعم وأنيق ومريح للعين 🎯</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
            </div>

            {/* Placeholder 2: Room Audio Server Controls */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-slate-200">إعدادات الصوت والسيرفر (Voice Server Config)</h6>
                    <span className="text-[10px] text-slate-400">ضبط جودة البث الصوتي ومعدل الترميز</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  افتراضي (High Bitrate)
                </span>
              </div>
            </div>

            {/* Placeholder 3: System Diagnostics & Flags */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-slate-200">تشخيص النظام والسجلات (System Diagnostics)</h6>
                    <span className="text-[10px] text-slate-400">مراقبة استهلاك الأداء والبيانات</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                  مستقر 100%
                </span>
              </div>
            </div>

          </div>

          {/* Footer Rights Notice */}
          <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-800/60">
            تطبيق <strong className="text-slate-400">سوبر ليجند (Super Legend)</strong> © 2026 - جميع الحقوق محفوظة للمالك والمطور
          </div>

        </div>

        {/* Footer Action */}
        <div className="p-4 bg-slate-900/80 border-t border-slate-800">
          <button
            onClick={onClose}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>العودة للإعدادات</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default DevPanelModal;
