import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Smartphone, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  PackageCheck,
  Share2,
  Copy
} from 'lucide-react';

interface DownloadApkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadApkModal: React.FC<DownloadApkModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Guide user on how to install via browser menu
      alert('لتثبيت التطبيق على جوالك فوراً: انقر على زر خيارات المتصفح (الثلاث نقاط ⋮) في أعلى أو أسفل الشاشة، ثم اختر "تثبيت التطبيق" أو "إضافة إلى الشاشة الرئيسية" (Install App / Add to Home screen).');
    }
  };

  const githubReleaseUrl = 'https://github.com/megdy1919955-ux/megdy1919/releases';
  const githubRepoUrl = 'https://github.com/megdy1919955-ux/megdy1919';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none"
        dir="rtl"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-gradient-to-b from-[#141824] via-[#0E121E] to-[#080B12] rounded-3xl border border-amber-500/30 shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-4 px-5 text-slate-950 flex items-center justify-between shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-950/20 flex items-center justify-center text-slate-950">
                <Smartphone className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-black tracking-wide">تنزيل وتثبيت تطبيق الأندرويد</h3>
                <p className="text-[11px] font-bold text-slate-900/80 -mt-0.5">ملف APK والتثبيت المباشر على الجوال 📲</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-950/15 hover:bg-slate-950/25 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 text-slate-950 stroke-[3]" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 overflow-y-auto space-y-4 text-xs font-medium">
            {/* App Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/20 flex items-center gap-3.5">
              <img
                src="/icons/icon-192x192.png"
                alt="النجم"
                className="w-14 h-14 rounded-2xl object-cover shadow-md border border-amber-400/40 shrink-0"
                onError={(e) => {
                  (e.target as any).src = 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=200';
                }}
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h4 className="font-black text-sm text-amber-300">تطبيق النجم الصوتي (Al-Najm Live)</h4>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    رسمي وموثق
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  الإصدار: v1.0.0 • حزمة الأندرويد الأصلية `com.alnajm.app`
                </p>
              </div>
            </div>

            {/* Option 1: Direct PWA Native Install */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-white text-xs flex items-center gap-1.5">
                  <PackageCheck className="w-4 h-4 text-amber-400" />
                  الخيار الأول: التثبيت الفوري كـ WebAPK (موصى به)
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full">
                  فوري وبدون تنزيل
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                يتم تثبيت التطبيق مباشرة على جوالك ويعمل كتطبيق أندرويد حقيقي 100% بكامل الشاشة وبأيقونة التطبيق الرسمية على سطح المكتب بدون شريط متصفح.
              </p>
              <button
                type="button"
                onClick={handleInstallPwa}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>تثبيت التطبيق على الجوال الآن</span>
              </button>
            </div>

            {/* Option 2: Download APK from GitHub Releases */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-white text-xs flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  الخيار الثاني: تنزيل ملف APK مباشرة
                </span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-bold px-2 py-0.5 rounded-full">
                  Android APK
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                تم تجهيز نظام البناء التلقائي لإنشاء ملف `AlNajm-Live.apk` في مستودع GitHub الخاص بك. يمكنك تنزيل ملف الـ APK وتثبيته مباشرة:
              </p>
              <div className="flex gap-2">
                <a
                  href={githubReleaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>صفحة تنزيل APK (GitHub Releases)</span>
                </a>
              </div>
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-[10px] text-slate-400 hover:text-amber-300 transition-colors underline"
              >
                رابط مستودع الكود على جيت هاب: megdy1919955-ux/megdy1919
              </a>
            </div>

            {/* Step by step guide */}
            <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/15 space-y-1.5">
              <span className="font-bold text-[11px] text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                طريقة التثبيت السريعة من متصفح الهاتف:
              </span>
              <ol className="text-[10px] text-slate-400 space-y-1 pr-4 list-decimal leading-relaxed">
                <li>افتح الرابط في متصفح Chrome أو Samsung Internet على هاتفك الأندرويد.</li>
                <li>انقر على زر القائمة (الثلاث نقاط العمودية ⋮).</li>
                <li>اضغط على <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.</li>
                <li>ستظهر أيقونة التطبيق في شاشة تطبيقات هاتفك كأي تطبيق رسمي ومستقل.</li>
              </ol>
            </div>

            {/* Share / Copy Link Button */}
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>{copiedLink ? 'تم نسخ رابط التطبيق بنجاح ✅' : 'نسخ رابط التطبيق لفتحه على الجوال 📋'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
