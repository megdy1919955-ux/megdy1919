import React, { useState, useRef } from 'react';
import { X, ChevronLeft, Headphones, Send, Image, FileText, Camera } from 'lucide-react';

interface CustomerServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerServiceModal: React.FC<CustomerServiceModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [message, setMessage] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(URL.createObjectURL(file));
    }
    if (e.target) e.target.value = '';
  };

  const handleSend = () => {
    if (!message.trim() && !selectedPhoto) return;
    setMessage('');
    setSelectedPhoto(null);
  };

  const tabs = [
    { id: 'login', label: 'التسجيل وتسجيل الدخول' },
    { id: 'password', label: 'نسيت كلمة المرور' },
    { id: 'freeze', label: 'تجميد الحساب' },
  ];

  const faqList = [
    {
      id: 1,
      q: 'Q1: لا أستطيع تسجيل الدخول إلى حسابي لأن الرقم المرتبط به معطل، ولا أستطيع استلام رمز التحقق لتغيير كلمة المرور لأنني نسيت كلمة المرور.'
    },
    {
      id: 2,
      q: 'Q2: لا أستطيع تسجيل الدخول إلى حسابي لأنني تلقيت رسالة تفيد بوجود خلل في الحساب (رمز الخطأ 1030-1031-1032).'
    },
    {
      id: 3,
      q: 'Q3: لا أستطيع تسجيل الدخول إلى حسابي لأنني نسيت بيانات تسجيل الدخول.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 text-right" dir="rtl">
      
      {/* مخفي: حقل اختياري لفتح قائمة الصور في الهاتف والاستديو */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handlePhotoSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col h-[85vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold">خدمة العملاء عبر الإنترنت</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-amber-950/40 to-slate-950 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400">خدمة عملاء على مدار 24 ساعة</span>
              <p className="text-[11px] text-slate-300">فريق دعم محترف جاهز لمساعدتك في أي وقت</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-sm font-semibold pb-2 relative transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 right-0 left-0 h-0.5 bg-amber-400 rounded-full"></span>
                )}
              </button>
            ))}
          </div>

          {/* FAQ Questions List */}
          <div className="space-y-3">
            {faqList.map((item) => (
              <div 
                key={item.id}
                onClick={() => console.log(`Selected FAQ: ${item.q}`)}
                className="bg-slate-800/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-800/80 cursor-pointer transition-all group"
              >
                <span className="text-xs font-medium text-slate-200 leading-relaxed pl-2">
                  {item.q}
                </span>
                <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors shrink-0" />
              </div>
            ))}
          </div>

        </div>

        {/* Selected Photo Attachment Preview */}
        {selectedPhoto && (
          <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={selectedPhoto} alt="Selected" className="w-10 h-10 object-cover rounded-xl border border-amber-500/40" />
              <span className="text-xs text-amber-300 font-bold">صورة مختارة من الاستديو</span>
            </div>
            <button onClick={() => setSelectedPhoto(null)} className="p-1 text-slate-400 hover:text-rose-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Footer Chat Input Box */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 flex items-center gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="اختيار صورة من استديو الهاتف"
          >
            <Camera className="w-5 h-5" />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            title="عرض قائمة الصور المتاحة بالهاتف"
          >
            <Image className="w-5 h-5" />
          </button>
          
          <div className="flex-1 bg-slate-800/60 border border-slate-700/60 rounded-2xl px-4 py-2 flex items-center">
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب شيئاً..." 
              className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none text-right"
            />
          </div>

          <button 
            onClick={handleSend}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-colors shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default CustomerServiceModal;
