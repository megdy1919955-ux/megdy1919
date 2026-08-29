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
import { TarafLogo } from './common/TarafLogo';

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

  const isDevUser = userId === 'YE1330000' || devId === 'YE1330000';

  const settingsSections = [
    {
      group: [
        { id: 'security', title: 'الحساب والحماية', icon: ShieldCheck, color: 'text-blue-400', value: 'متوسط' },
        { id: 'privacy', title: 'الخصوصية', icon: Lock, color: 'text-amber-400', value: '' },
        { id: 'language', title: 'اللغة', icon: Globe, color: 'text-emerald-400', value: 'العربية' },
        { id: 'share', title: 'مشاركة', icon: Share2, color: 'text-sky-400', value: '' },
      ]
    },
    // Developer Options section (Visible only if userId == devId && userId === 'YE1330000')
    ...(isDevUser && userId === 'YE1330000' ? [{
      group: [
        { id: 'dev_options', title: 'لوحة السوبر أدمن (المالك والمبرمج)', icon: Terminal, color: 'text-amber-400', value: 'ROOT 👑' }
      ]
    }] : []),
    {
      group: [
        { id: 'help', title: 'مساعدة', icon: HelpCircle, color: 'text-amber-500', value: '' },
        { id: 'feedback', title: 'ملاحظات', icon: Mail, color: 'text-blue-500', value: '' },
        { id: 'about', title: 'حول تطبيق ترف شات', icon: Info, color: 'text-emerald-500', value: 'v2.5.0' },
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
              <div className="text-center py-4 bg-gradient-to-b from-slate-800/80 to-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col items-center">
                {/* Official Taraf Emblem Logo */}
                <div className="mb-3">
                  <TarafLogo size="lg" />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">تطبيق ترف شات (Taraf Chat)</h2>
                <span className="text-xs text-[#EAD39B] font-bold bg-[#755013]/20 px-3 py-1 rounded-full border border-[#DFC386]/30 inline-block mt-1.5 font-mono">
                  الإصدار الرسمي v2.5.0
                </span>
              </div>

              <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>إشعار حقوق الملكية الفكرية والعلامة التجارية (Copyrights)</span>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
                  جميع حقوق الملكية الفكرية مسجلة ومحفوظة بالكامل للمالك والمطور. وتعتبر كافة الأكواد المصدريّة، التصاميم، الهياكل البرمجية، والشعار الرسمي، والعلامة التجارية <strong>"ترف شات (Taraf Chat)"</strong> ملكية خاصة وحصرية ومسجلة له، ولا يجوز نسخها أو اعادة توزيعها أو استخدامها دون إذن خطي مسبق.
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>اسم التطبيق:</strong> ترف شات (Taraf Chat)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>الشعار والعلامة التجارية:</strong> شعار ترف الملكي (TARAF) مسجل رسمياً</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>المالك والمطور:</strong> المالك والمطور الرسمي</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span><strong>حالة الترخيص:</strong> محمي بموجب قوانين حماية الملكية الفكرية والابتكار © 2026</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowAboutModal(false)}
                className="w-full py-3 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
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
              <div className="text-center pt-2 pb-1 text-[11px] text-slate-400 border-t border-slate-800/50 flex items-center justify-center gap-1.5">
                <TarafLogo size="sm" className="scale-75 inline-block" />
                <span>تطبيق <strong>ترف شات (Taraf Chat)</strong> © 2026 - جميع حقوق الملكية الفكرية مسجلة ومحفوظة للمالك والمطور</span>
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default SettingsModal;
