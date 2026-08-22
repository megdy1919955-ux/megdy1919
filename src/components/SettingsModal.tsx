import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Globe, 
  Share2, 
  HelpCircle, 
  Mail, 
  Info, 
  Gift, 
  LogOut, 
  ChevronLeft,
  Shield,
  CheckCircle2,
  Terminal
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCustomerService?: () => void;
  onOpenDevPanel?: () => void;
  userId?: string;
  devId?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  onOpenCustomerService,
  onOpenDevPanel,
  userId = 'YE1330000',
  devId = 'YE1330000'
}) => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  if (!isOpen) return null;

  const isDevUser = (userId === devId) || (userId === 'YE1330000');

  const settingsSections = [
    {
      group: [
        { id: 'security', title: 'الحساب والحماية', icon: ShieldCheck, color: 'text-blue-400', value: 'متوسط' },
        { id: 'privacy', title: 'الخصوصية', icon: Lock, color: 'text-amber-400', value: '' },
        { id: 'language', title: 'اللغة', icon: Globe, color: 'text-emerald-400', value: 'العربية' },
        { id: 'share', title: 'مشاركة', icon: Share2, color: 'text-sky-400', value: '' },
      ]
    },
    // Developer Options section (Visible only if userId == devId)
    ...(isDevUser ? [{
      group: [
        { id: 'dev_options', title: 'خيارات المطور', icon: Terminal, color: 'text-purple-400', value: 'المالك 👑' }
      ]
    }] : []),
    {
      group: [
        { id: 'help', title: 'مساعدة', icon: HelpCircle, color: 'text-amber-500', value: '' },
        { id: 'feedback', title: 'ملاحظات', icon: Mail, color: 'text-blue-500', value: '' },
        { id: 'about', title: 'حول تطبيق سوبر ليجند', icon: Info, color: 'text-emerald-500', value: 'v2.5.0' },
        { id: 'reward', title: 'مطالبة المكافأة', icon: Gift, color: 'text-cyan-400', value: '' },
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 text-right" dir="rtl">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        
        {/* About App Sub-View Overlay */}
        {showAboutModal ? (
          <div className="flex flex-col h-full overflow-hidden animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
              <button 
                onClick={() => setShowAboutModal(false)}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 rotate-180" />
                <span>العودة للإعدادات</span>
              </button>
              <h3 className="text-base font-black text-white">حقوق الملكية الفكرية</h3>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-right">
              <div className="text-center py-4 bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 text-xl font-black shadow-lg mb-2 border border-amber-300/40 text-center leading-tight">
                  سوبر ليجند
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">تطبيق سوبر ليجند (Super Legend)</h2>
                <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 inline-block mt-1">
                  الإصدار الرسمي 2.5.0
                </span>
              </div>

              <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>إشعار حقوق الملكية الفكرية والطباعة (Copyrights)</span>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                  جميع الحقوق محفوظة بالكامل للمالك والمطور. وتعتبر كافة الأكواد المصدريّة، التصاميم، الهياكل البرمجية، والعلامة التجارية <strong>"سوبر ليجند (Super Legend)"</strong> ملكية خاصة وحصرية له، ولا يجوز نسخها أو اعادة توزيعها أو استخدامها دون إذن خطي مسبق.
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>اسم التطبيق:</strong> سوبر ليجند (Super Legend)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>المالك والمطور:</strong> المالك والمطور الرسمي</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>حالة الترخيص:</strong> محمي بموجب قوانين الملكية الفكرية © 2026</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                فهمت وتأكيد
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
              <h3 className="text-xl font-bold">الاعدادات</h3>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Content */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
              
              {settingsSections.map((section, sIndex) => (
                <div key={sIndex} className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
                  {section.group.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div 
                        key={item.id}
                        onClick={() => {
                          if (item.id === 'dev_options' && onOpenDevPanel) {
                            onClose();
                            onOpenDevPanel();
                          } else if (item.id === 'help' && onOpenCustomerService) {
                            onClose();
                            onOpenCustomerService();
                          } else if (item.id === 'about') {
                            setShowAboutModal(true);
                          } else {
                            console.log(`Clicked: ${item.title}`);
                          }
                        }}
                        className="flex items-center justify-between p-4 hover:bg-slate-800/80 cursor-pointer transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl bg-slate-800 ${item.color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                            {item.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.value && (
                            <span className="text-xs text-blue-400 font-medium">
                              {item.value}
                            </span>
                          )}
                          <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Logout Section */}
              <div className="bg-slate-800/40 border border-slate-800 rounded-2xl overflow-hidden">
                <div 
                  onClick={() => alert('تم تسجيل الخروج')}
                  className="flex items-center justify-between p-4 hover:bg-rose-500/10 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-semibold text-rose-400 group-hover:text-rose-300">
                      تسجيل الخروج
                    </span>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-rose-500/50 group-hover:text-rose-400" />
                </div>
              </div>

              {/* Footer Copyright in Modal */}
              <div className="text-center pt-2 pb-1 text-[11px] text-slate-500 border-t border-slate-800/50">
                تطبيق <strong>سوبر ليجند (Super Legend)</strong> © 2026 - جميع الحقوق محفوظة للمالك والمطور
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default SettingsModal;
