import React, { useEffect, useState } from 'react';
import { Download, Smartphone, CheckCircle, X, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    return sessionStorage.getItem('pwa_banner_dismissed') === 'true';
  });
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Detect if running inside standalone mode (real app window, no browser address bar)
    const checkStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://') ||
      window.location.search.includes('mode=standalone');

    setIsStandalone(Boolean(checkStandalone));

    // 2. Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isApple = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isApple);

    // 3. Listen for Android / Chrome install prompt
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsStandalone(true);
      setInstalledSuccess(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  // If already installed and running as a standalone app, hide the banner!
  if (isStandalone || isDismissed) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstalledSuccess(true);
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowAndroidModal(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  return (
    <>
      <div
        id="pwa-native-install-banner"
        className="relative mx-3 mb-2 p-3 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-900/80 border border-amber-500/50 shadow-lg text-white select-none transition-all"
        dir="rtl"
      >
        <div className="flex items-center justify-between gap-3">
          {/* Logo & Text */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 p-1 flex items-center justify-center shrink-0 shadow-inner">
              <img src="/al_najm_logo.png" alt="النجم" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-amber-300">تثبيت تطبيق "النجم" الأصلي</span>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-bold text-emerald-300 rounded-md">
                  تطبيق كامل
                </span>
              </div>
              <p className="text-[10px] text-slate-300 font-medium truncate mt-0.5">
                ثبّته كبرنامج مستقل على شاشة جوالك بدون متصفح وبدون شريط روابط
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-transform"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>تثبيت الآن</span>
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Android Chrome Guide Modal */}
      {showAndroidModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-amber-400" />
                <h3 className="text-sm font-black text-amber-300">تثبيت تطبيق النجم المستقل (أندرويد)</h3>
              </div>
              <button
                onClick={() => setShowAndroidModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <div className="flex items-start gap-2.5 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">1</span>
                <span>تأكد من فتح الرابط داخل تطبيق <strong>Google Chrome</strong> مباشرة (وليس داخل متصفح واتساب).</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">2</span>
                <span>اضغط على قائمة الخيارات (<strong>الثلاث نقاط ⋮</strong>) في أعلى زاوية المتصفح.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 bg-amber-950/40 rounded-xl border border-amber-500/30">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">3</span>
                <span>اختر <strong>"تثبيت التطبيق" (Install app)</strong> وليس "إضافة إلى الشاشة الرئيسية"! سيتم تثبيته كبرنامج مستقل فوراً دون متصفح.</span>
              </div>
            </div>

            <button
              onClick={() => setShowAndroidModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
            >
              حسناً، سأثبته الآن
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" dir="rtl">
          <div className="w-full max-w-sm bg-slate-900 border border-amber-500/40 rounded-3xl p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-amber-400" />
                <h3 className="text-sm font-black text-amber-300">تثبيت تطبيق النجم على الآيفون</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <div className="flex items-start gap-2.5 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">1</span>
                <span>اضغط على زر <strong>المشاركة (Share ⬆️)</strong> في شريط متصفح Safari بالأسفل.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">2</span>
                <span>اسحب للأعلى واختر <strong>"إضافة إلى الصفحة الرئيسية" (Add to Home Screen)</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 bg-slate-800/80 rounded-xl border border-slate-700">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">3</span>
                <span>اضغط <strong>"إضافة" (Add)</strong> في أعلى الزاوية. سيصبح تطبيقاً رسمياً يفتح بملء الشاشة بدون متصفح!</span>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs cursor-pointer shadow-md"
            >
              فهمت، شكراً
            </button>
          </div>
        </div>
      )}
    </>
  );
};
