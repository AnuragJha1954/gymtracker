import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-[#121214] border border-emerald-500/30 shadow-[0_10px_40px_rgba(16,185,129,0.2)] rounded-2xl p-4 flex items-center justify-between animate-slide-down">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400">
          <Download className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">Install GymTracker</h4>
          <p className="text-[10px] text-zinc-400">Add to home screen for offline access</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button 
          onClick={handleInstallClick}
          className="px-3 py-1.5 bg-emerald-500 text-zinc-950 font-bold text-xs rounded-lg active:scale-95 transition-transform"
        >
          Install
        </button>
        <button onClick={() => setIsVisible(false)} className="p-1.5 text-zinc-500 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
