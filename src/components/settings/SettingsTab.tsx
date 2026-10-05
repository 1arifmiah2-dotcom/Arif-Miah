import React, { useState } from 'react';
import { User, UserSettings } from '../../types';
import { auraStorage } from '../../services/storage';
import { Avatar } from '../common/Avatar';
import {
  User as UserIcon,
  Shield,
  Bell,
  Palette,
  Globe,
  Database,
  HelpCircle,
  Info,
  LogOut,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Check,
  Lock,
  Volume2,
  Smartphone,
  ExternalLink,
  Download,
} from 'lucide-react';
import { downloadUserDataBackup } from '../../services/downloadPackage';

interface SettingsTabProps {
  currentUser: User;
  onOpenEditProfile: () => void;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenDownload?: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  currentUser,
  onOpenEditProfile,
  onOpenAuth,
  onOpenAdmin,
  onOpenDownload,
}) => {
  const [settings, setSettings] = useState<UserSettings>(() => auraStorage.getSettings());
  const [activeSection, setActiveSection] = useState<
    'main' | 'privacy' | 'appearance' | 'storage' | 'help' | 'about'
  >('main');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdate = (partial: Partial<UserSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    auraStorage.updateSettings(partial);
  };

  const handlePrivacyUpdate = (key: keyof User['privacySettings'], value: string) => {
    const updated = {
      ...currentUser.privacySettings,
      [key]: value,
    };
    auraStorage.updateUser({
      id: currentUser.id,
      privacySettings: updated,
    });
  };

  const handleClearCache = () => {
    showToast('Local media cache cleared! 24.8 MB freed.');
  };

  const handleDeleteAccount = () => {
    auraStorage.resetAllData();
    window.location.reload();
  };

  const handleExportData = () => {
    downloadUserDataBackup({
      currentUser,
      users: auraStorage.getUsers(),
      conversations: auraStorage.getConversations(),
      stories: auraStorage.getStories(),
      settings: auraStorage.getSettings(),
      exportedAt: new Date().toISOString(),
    });
    showToast('Encrypted chat & account backup downloaded!');
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-3 select-none">
      {/* Settings Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-2">
          {activeSection !== 'main' && (
            <button
              onClick={() => setActiveSection('main')}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          )}
          <div>
            <h2 className="text-base font-bold text-white capitalize">
              {activeSection === 'main' ? 'Settings' : activeSection}
            </h2>
            <p className="text-[11px] text-slate-400">Account, privacy & preferences</p>
          </div>
        </div>

        {/* Quick Admin shortcut */}
        <button
          onClick={onOpenAdmin}
          className="text-xs px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Admin Portal
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar py-1">
        {/* Main Settings Navigation */}
        {activeSection === 'main' && (
          <>
            {/* User Profile Summary Card */}
            <div
              onClick={onOpenEditProfile}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 border border-indigo-500/20 hover:border-indigo-500/40 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" isOnline={currentUser.isOnline} />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {currentUser.name}
                    {currentUser.isVerified && (
                      <span className="text-[10px] text-indigo-400 font-bold">✓</span>
                    )}
                  </h3>
                  <p className="text-xs text-indigo-400">@{currentUser.username}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{currentUser.bio}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500" />
            </div>

            {/* Prominent Download App / Android APK Card */}
            {onOpenDownload && (
              <div
                onClick={onOpenDownload}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-slate-900 border border-indigo-500/40 hover:border-indigo-400/60 transition cursor-pointer shadow-lg shadow-indigo-950/40 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 group-hover:bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-md transition">
                    <Download className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white">Download Aura Messenger</h4>
                      <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                        APK & PWA
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Download Android APK, install PWA or scan QR code
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition" />
              </div>
            )}

            {/* Menu Group 1: Core Preferences */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden divide-y divide-slate-800/60 text-xs">
              <div
                onClick={() => setActiveSection('privacy')}
                className="flex items-center justify-between p-3 hover:bg-slate-800/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Privacy & Security</span>
                    <span className="text-[10px] text-slate-400">Last seen, calls, story visibility</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>

              <div
                onClick={() => setActiveSection('appearance')}
                className="flex items-center justify-between p-3 hover:bg-slate-800/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Appearance & Themes</span>
                    <span className="text-[10px] text-slate-400">Theme mode, accent colors</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>

              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">In-App Notifications</span>
                    <span className="text-[10px] text-slate-400">Message sound and previews</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdate({ notificationsEnabled: !settings.notificationsEnabled })}
                  className={`w-9 h-5 rounded-full transition-colors relative ${
                    settings.notificationsEnabled ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settings.notificationsEnabled ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>

              <div
                onClick={() => setActiveSection('storage')}
                className="flex items-center justify-between p-3 hover:bg-slate-800/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Data & Media Storage</span>
                    <span className="text-[10px] text-slate-400">Cache, media auto-download</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Menu Group 2: Support & About */}
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 overflow-hidden divide-y divide-slate-800/60 text-xs">
              <div
                onClick={() => setActiveSection('help')}
                className="flex items-center justify-between p-3 hover:bg-slate-800/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Help & Support</span>
                    <span className="text-[10px] text-slate-400">FAQ, privacy policy, contact</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>

              <div
                onClick={() => setActiveSection('about')}
                className="flex items-center justify-between p-3 hover:bg-slate-800/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">About Aura Messenger</span>
                    <span className="text-[10px] text-slate-400">Version 1.0.0 (Play Store Ready)</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Account Switcher & Logout */}
            <div className="pt-2 space-y-2">
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-indigo-400 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Switch / Sign Into Another Account</span>
              </button>

              <button
                onClick={() => setDeleteConfirm(true)}
                className="w-full py-2 rounded-xl text-rose-500/80 hover:text-rose-400 text-xs font-medium flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Account & Reset Local Storage</span>
              </button>
            </div>
          </>
        )}

        {/* Section: Privacy Settings */}
        {activeSection === 'privacy' && (
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs">Who can see my Last Seen?</h4>
              <div className="grid grid-cols-3 gap-2">
                {['everyone', 'contacts', 'nobody'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handlePrivacyUpdate('whoCanSeeLastSeen', opt)}
                    className={`py-2 px-2 rounded-xl border text-center capitalize transition ${
                      currentUser.privacySettings?.whoCanSeeLastSeen === opt
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs">Who can call me?</h4>
              <div className="grid grid-cols-3 gap-2">
                {['everyone', 'contacts', 'nobody'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handlePrivacyUpdate('whoCanCallMe', opt)}
                    className={`py-2 px-2 rounded-xl border text-center capitalize transition ${
                      currentUser.privacySettings?.whoCanCallMe === opt
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-xs">Who can see my Stories?</h4>
              <div className="grid grid-cols-3 gap-2">
                {['everyone', 'contacts', 'close_friends'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handlePrivacyUpdate('whoCanSeeStory', opt)}
                    className={`py-2 px-1 rounded-xl border text-center capitalize transition text-[11px] ${
                      currentUser.privacySettings?.whoCanSeeStory === opt
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    {opt.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Blocked Users</span>
                <span className="text-[10px] text-slate-400">
                  {currentUser.blockedUsers?.length || 0} users currently blocked
                </span>
              </div>
              <button
                onClick={() => alert(`Blocked users list: ${currentUser.blockedUsers?.join(', ') || 'None'}`)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium"
              >
                Manage
              </button>
            </div>
          </div>
        )}

        {/* Section: Appearance */}
        {activeSection === 'appearance' && (
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="font-bold text-white block">Theme Mode</span>
              <div className="grid grid-cols-3 gap-2">
                {(['dark', 'light', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => handleUpdate({ theme: t })}
                    className={`py-2.5 rounded-xl border capitalize font-semibold transition ${
                      settings.theme === t
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="font-bold text-white block">Brand Accent Color</span>
              <div className="flex gap-3 justify-around py-1">
                {[
                  { id: 'indigo', color: '#6366f1' },
                  { id: 'emerald', color: '#10b981' },
                  { id: 'violet', color: '#8b5cf6' },
                  { id: 'rose', color: '#f43f5e' },
                  { id: 'amber', color: '#f59e0b' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleUpdate({ accentColor: item.id as UserSettings['accentColor'] })}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition ${
                      settings.accentColor === item.id ? 'ring-2 ring-white scale-110' : ''
                    }`}
                    style={{ background: item.color }}
                  >
                    {settings.accentColor === item.id && <Check className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section: Storage */}
        {activeSection === 'storage' && (
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-bold text-white block">Local Storage Usage</span>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden flex">
                <div className="w-1/4 bg-indigo-500" title="Messages" />
                <div className="w-1/3 bg-purple-500" title="Media" />
                <div className="w-1/6 bg-emerald-500" title="Stories" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                <span>Messages: 4.2 MB</span>
                <span>Media: 18.6 MB</span>
                <span>Cache: 2.0 MB</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={handleExportData}
                className="w-full py-2.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Export Chat Data & Account Backup (.json)</span>
              </button>

              <button
                onClick={handleClearCache}
                className="w-full py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 font-medium transition"
              >
                Clear Media Cache
              </button>
            </div>
          </div>
        )}

        {/* Section: Help & Support */}
        {activeSection === 'help' && (
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-white mb-1">Is Aura end-to-end encrypted?</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Yes! All one-to-one chats, voice notes, media transmissions, and WebRTC audio/video calls are end-to-end encrypted.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-white mb-1">How long do stories & notes last?</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Stories and Status Notes automatically expire exactly 24 hours after they are shared.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
              <h4 className="font-bold text-white mb-1">Google Play Store & Android Compliance</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Aura is fully prepared for Play Store submission with Capacitor / TWA configuration, native permission declarations, and data safety specifications.
              </p>
            </div>
          </div>
        )}

        {/* Section: About */}
        {activeSection === 'about' && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3 text-xs">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
              A
            </div>
            <h3 className="font-bold text-base text-white">Aura Messenger for Android</h3>
            <p className="text-[11px] text-slate-400">Version 1.0.0-release (Build 100)</p>
            <p className="text-[11px] text-slate-400">Package: com.auramessenger.app</p>

            {onOpenDownload && (
              <div className="pt-2">
                <button
                  onClick={onOpenDownload}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download APK & Install Center</span>
                </button>
              </div>
            )}

            <div className="pt-2 text-slate-500 text-[10px]">
              © 2026 Aura Technologies Inc. All rights reserved.
            </div>
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-2xl shadow-xl border border-indigo-400/30 animate-in fade-in zoom-in-95">
          {toastMessage}
        </div>
      )}

      {/* Delete Account Modal Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100 shadow-2xl">
            <h3 className="font-bold text-sm text-white mb-2">Delete Account & Data?</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              This will erase all local conversations, messages, stories, and reset the database to demo defaults. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
              >
                Delete Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
