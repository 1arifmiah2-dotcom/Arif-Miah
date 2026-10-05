import React, { useState, useEffect } from 'react';
import { Download, Share, X, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface PWAInstallBannerProps {
  onOpenDownload?: () => void;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ onOpenDownload }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  if (isInstalled || dismissed) return null;

  return (
    <>
      <div className="relative mx-3 mb-2 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/50 to-slate-900/70 p-3 border border-indigo-500/30 backdrop-blur-md shadow-lg flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-sm text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white truncate">Install Aura Messenger</p>
            <p className="text-indigo-200/80 truncate text-[11px]">Instant notifications & offline Android app</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              if (onOpenDownload) {
                onOpenDownload();
              } else if (deferredPrompt) {
                handleInstallClick();
              } else if (isIOS) {
                setShowIOSModal(true);
              }
            }}
            className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-3 py-1.5 rounded-xl transition shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download App</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Install on iOS
            </h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              1. Tap the <strong className="text-white">Share</strong> button in Safari toolbar below.<br />
              2. Scroll down and tap <strong className="text-white">Add to Home Screen</strong>.<br />
              3. Enjoy full-screen Aura Messenger with haptics!
            </p>
            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
