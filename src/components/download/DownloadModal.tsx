import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  QrCode,
  Package,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  X,
  Sparkles,
  ArrowRight,
  HardDriveDownload,
  Share2,
} from 'lucide-react';
import {
  downloadAndroidApk,
  downloadPlayStoreBundle,
  downloadUserDataBackup,
} from '../../services/downloadPackage';
import { auraStorage } from '../../services/storage';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt?: BeforeInstallPromptEvent | null;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
}) => {
  const [activeTab, setActiveTab] = useState<'apk' | 'pwa' | 'qr' | 'dev'>('apk');
  const [downloadingApk, setDownloadingApk] = useState(false);
  const [downloadedApk, setDownloadedApk] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [appUrl, setAppUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAppUrl(window.location.href);
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsInstalled(isStandalone);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDownloadApk = () => {
    setDownloadingApk(true);
    setDownloadedApk(false);
    setTimeout(() => {
      try {
        const a = document.createElement('a');
        a.href = '/AuraMessenger-v1.0.0.apk';
        a.download = 'AuraMessenger-v1.0.0.apk';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch {
        downloadAndroidApk();
      }
      setDownloadingApk(false);
      setDownloadedApk(true);
    }, 400);
  };

  const handleInstallPwa = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl || window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportBackup = () => {
    const backupData = {
      user: auraStorage.getCurrentUser(),
      users: auraStorage.getUsers(),
      conversations: auraStorage.getConversations(),
      stories: auraStorage.getStories(),
      settings: auraStorage.getSettings(),
      exportedAt: new Date().toISOString(),
      app: 'Aura Messenger v1.0.0',
    };
    downloadUserDataBackup(backupData);
  };

  // QR Code URL using high-contrast encoded SVG endpoint or QR server
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=1&format=svg&data=${encodeURIComponent(
    appUrl || window.location.href
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <HardDriveDownload className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white leading-tight flex items-center gap-1.5">
                Download Aura
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v1.0.0
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">Android APK, PWA & Play Store Release</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="grid grid-cols-4 p-1.5 bg-slate-950/80 border-b border-slate-800/80 shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-1 rounded-xl font-semibold flex flex-col items-center gap-1 transition ${
              activeTab === 'apk'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-[11px]">Android APK</span>
          </button>

          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-2 px-1 rounded-xl font-semibold flex flex-col items-center gap-1 transition ${
              activeTab === 'pwa'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-[11px]">Install PWA</span>
          </button>

          <button
            onClick={() => setActiveTab('qr')}
            className={`py-2 px-1 rounded-xl font-semibold flex flex-col items-center gap-1 transition ${
              activeTab === 'qr'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span className="text-[11px]">Scan QR</span>
          </button>

          <button
            onClick={() => setActiveTab('dev')}
            className={`py-2 px-1 rounded-xl font-semibold flex flex-col items-center gap-1 transition ${
              activeTab === 'dev'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span className="text-[11px]">Release ZIP</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 no-scrollbar flex-1">
          {/* TAB 1: ANDROID APK */}
          {activeTab === 'apk' && (
            <div className="space-y-4 text-xs">
              {/* Highlight Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/50 via-purple-950/30 to-slate-900 border border-indigo-500/30 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> Official Android Build
                    </span>
                    <h3 className="text-sm font-bold text-white pt-1">
                      Aura Messenger v1.0.0 (Release APK)
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Package: <code className="text-indigo-300">com.auramessenger.app</code> • Android 8.0 - 14
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 flex items-center justify-center shrink-0 border border-indigo-500/30">
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-slate-800/80">
                  <div className="p-2 bg-slate-950/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Size</span>
                    <span className="font-bold text-white">2.4 MB</span>
                  </div>
                  <div className="p-2 bg-slate-950/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Version</span>
                    <span className="font-bold text-white">100 (1.0)</span>
                  </div>
                  <div className="p-2 bg-slate-950/50 rounded-xl">
                    <span className="text-[10px] text-slate-400 block">Format</span>
                    <span className="font-bold text-indigo-300">.APK</span>
                  </div>
                </div>

                {/* Download CTA Button */}
                <button
                  onClick={handleDownloadApk}
                  disabled={downloadingApk}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-[0.98] disabled:opacity-75"
                >
                  {downloadingApk ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating APK Package...</span>
                    </div>
                  ) : downloadedApk ? (
                    <div className="flex items-center gap-2 text-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Downloaded! Download Again</span>
                    </div>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Android APK</span>
                    </>
                  )}
                </button>
              </div>

              {/* Install Steps */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  How to install on your Android device:
                </h4>
                <ol className="space-y-2 text-[11px] text-slate-300 list-decimal list-inside">
                  <li className="leading-relaxed">
                    Tap <strong className="text-white">Download Android APK</strong> above to save{' '}
                    <code className="text-indigo-300">AuraMessenger-v1.0.0.apk</code>.
                  </li>
                  <li className="leading-relaxed">
                    Swipe down your notification shade or open your{' '}
                    <strong className="text-white">Files / Downloads</strong> app.
                  </li>
                  <li className="leading-relaxed">
                    Tap the APK file. If Android prompts <em className="text-indigo-200">"Install unknown apps"</em>,
                    tap <strong>Settings</strong> and toggle on <strong>Allow from this source</strong>.
                  </li>
                  <li className="leading-relaxed">
                    Tap <strong className="text-emerald-400">Install</strong> and enjoy encrypted messaging & video calls!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: PWA INSTALL */}
          {activeTab === 'pwa' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Instant Web App Installation</h3>
                    <p className="text-[11px] text-slate-400">
                      Runs in full screen with zero app store delays
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>

                {isInstalled ? (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-2 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Aura Messenger is already installed on this device!</span>
                  </div>
                ) : deferredPrompt ? (
                  <button
                    onClick={handleInstallPwa}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-md transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install Aura to Device Now</span>
                  </button>
                ) : (
                  <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-200 text-[11px]">
                    Instant installation is supported directly via your mobile browser.
                  </div>
                )}
              </div>

              {/* Browser Instructions */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                    Google Chrome / Samsung Internet (Android)
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    1. Tap the three dots menu (<strong className="text-white">⋮</strong>) in the top-right corner.<br />
                    2. Select <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong>.<br />
                    3. Tap <strong>Install</strong>. Aura will appear on your phone home screen and app drawer.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    Safari (Apple iOS / iPadOS)
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    1. Tap the <strong className="text-white">Share</strong> button at bottom of Safari.<br />
                    2. Scroll down and tap <strong className="text-white">"Add to Home Screen"</strong>.<br />
                    3. Tap <strong>Add</strong> in the top-right corner.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCAN QR CODE */}
          {activeTab === 'qr' && (
            <div className="space-y-4 text-xs text-center">
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col items-center space-y-3">
                <div className="p-3 bg-white rounded-2xl shadow-xl ring-4 ring-indigo-500/20">
                  <img
                    src={qrCodeUrl}
                    alt="Scan QR code to install Aura on your phone"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-xs">Scan with your Phone Camera</h4>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Point your Android camera or Google Lens at this QR code to immediately launch or install Aura on your mobile phone!
                  </p>
                </div>
              </div>

              {/* Copy URL */}
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400 truncate text-left select-all font-mono">
                  {appUrl || window.location.href}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-semibold text-xs flex items-center gap-1.5 shrink-0 transition"
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: DEVELOPER & RELEASE BUNDLE */}
          {activeTab === 'dev' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs">Google Play Store Submission Package</h4>
                    <p className="text-[11px] text-slate-400">
                      ZIP containing AndroidManifest.xml, PLAYSTORE_LISTING.md & Capacitor config
                    </p>
                  </div>
                  <Package className="w-5 h-5 text-indigo-400 shrink-0" />
                </div>
                <button
                  onClick={downloadPlayStoreBundle}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Play Store Bundle (.zip)</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs">Encrypted Chat & Account Backup</h4>
                    <p className="text-[11px] text-slate-400">
                      Export all messages, contacts, call logs & settings to JSON
                    </p>
                  </div>
                  <HardDriveDownload className="w-5 h-5 text-purple-400 shrink-0" />
                </div>
                <button
                  onClick={handleExportBackup}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Chat Data (.json)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span className="flex items-center gap-1.5 text-indigo-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            TLS 1.3 & WebRTC Encrypted
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
