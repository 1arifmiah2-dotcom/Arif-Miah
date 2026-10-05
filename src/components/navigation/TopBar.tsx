import React, { useState } from 'react';
import { User, NotificationItem } from '../../types';
import { Avatar } from '../common/Avatar';
import { Bell, Search, Shield, X, MessageSquare, Check, Phone, Heart, Download } from 'lucide-react';
import { auraStorage } from '../../services/storage';

interface TopBarProps {
  currentUser: User;
  onOpenAuth: () => void;
  onOpenAdmin: () => void;
  onOpenDownload?: () => void;
  onSearchClick: () => void;
  onSelectConversation?: (id: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentUser,
  onOpenAuth,
  onOpenAdmin,
  onOpenDownload,
  onSearchClick,
  onSelectConversation,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = auraStorage.getNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleNotificationClick = (notif: NotificationItem) => {
    auraStorage.markAllNotificationsRead();
    setShowNotifications(false);
    if (notif.linkId && onSelectConversation) {
      onSelectConversation(notif.linkId);
    }
  };

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'message':
        return <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />;
      case 'call':
        return <Phone className="w-3.5 h-3.5 text-emerald-400" />;
      case 'reaction':
        return <Heart className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <>
      <header className="w-full px-4 py-2.5 flex items-center justify-between shrink-0 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 z-30">
        {/* App branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-[1.5px] shadow-sm shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="text-sm font-black bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
                A
              </span>
            </div>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white leading-none">Aura</h1>
            <span className="text-[10px] text-indigo-400 font-medium tracking-wide">MESSENGER</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Download App button */}
          {onOpenDownload && (
            <button
              onClick={onOpenDownload}
              className="flex items-center gap-1 px-2 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/35 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition active:scale-95 shadow-sm"
              title="Download Android APK & Install App"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Download</span>
            </button>
          )}

          {/* Admin badge button */}
          <button
            onClick={onOpenAdmin}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 transition"
            title="Admin & Moderation Panel"
          >
            <Shield className="w-4 h-4" />
          </button>

          {/* Search button */}
          <button
            onClick={onSearchClick}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Notification bell */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950 animate-pulse" />
            )}
          </button>

          {/* Current user avatar & quick switch */}
          <button
            onClick={onOpenAuth}
            className="ml-1 p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500 transition active:scale-95"
            title={`Logged in as ${currentUser.name} (Click to switch account)`}
          >
            <Avatar src={currentUser.avatar} name={currentUser.name} size="xs" isOnline={currentUser.isOnline} />
          </button>
        </div>
      </header>

      {/* Notifications Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm h-full bg-slate-900 border-l border-slate-800 flex flex-col p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-400" />
                <h3 className="font-bold text-sm text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-indigo-500 text-white font-semibold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => auraStorage.markAllNotificationsRead()}
                  className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <Check className="w-3 h-3" /> Mark read
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-2 no-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">No notifications yet.</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      !n.isRead
                        ? 'bg-indigo-600/15 border-indigo-500/30'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-800 shrink-0">
                      {getNotifIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">{n.body}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
