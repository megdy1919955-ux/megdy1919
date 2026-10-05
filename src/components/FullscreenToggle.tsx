import React, { useState, useEffect } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

export const FullscreenToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    // Check if fullscreen API is available
    const doc = document as any;
    const docEl = document.documentElement as any;
    const supported = !!(
      docEl.requestFullscreen ||
      docEl.webkitRequestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.msRequestFullscreen
    );
    setIsSupported(supported);

    const updateFullscreenState = () => {
      const active = !!(
        document.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(active);
    };

    updateFullscreenState();

    document.addEventListener('fullscreenchange', updateFullscreenState);
    document.addEventListener('webkitfullscreenchange', updateFullscreenState);
    document.addEventListener('mozfullscreenchange', updateFullscreenState);
    document.addEventListener('MSFullscreenChange', updateFullscreenState);

    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreenState);
      document.removeEventListener('webkitfullscreenchange', updateFullscreenState);
      document.removeEventListener('mozfullscreenchange', updateFullscreenState);
      document.removeEventListener('MSFullscreenChange', updateFullscreenState);
    };
  }, []);

  const handleToggleFullscreen = async () => {
    try {
      const doc = document as any;
      const docEl = document.documentElement as any;

      if (!isFullscreen) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (error) {
      console.warn('Fullscreen toggle request was prevented or unavailable:', error);
    }
  };

  if (!isSupported) return null;

  return (
    <div
      id="app-top-control-bar"
      className={`fixed top-2.5 left-1/2 -translate-x-1/2 z-[9999] flex items-center bg-[#0C1220]/80 hover:bg-[#0E172A]/90 backdrop-blur-xl border border-white/10 hover:border-cyan-400/40 rounded-full p-1 shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all duration-200 pointer-events-auto select-none ${className}`}
      dir="rtl"
    >
      <button
        onClick={handleToggleFullscreen}
        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 text-slate-200 hover:text-white transition-all text-xs font-bold cursor-pointer group"
        title={isFullscreen ? 'إنهاء وضع ملء الشاشة' : 'تفعيل وضع ملء الشاشة (إخفاء أشرطة المتصفح)'}
      >
        {isFullscreen ? (
          <>
            <Minimize2 className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black text-amber-300">خروج من ملء الشاشة</span>
          </>
        ) : (
          <>
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[11px] font-black text-cyan-300">ملء الشاشة</span>
          </>
        )}
      </button>
    </div>
  );
};
