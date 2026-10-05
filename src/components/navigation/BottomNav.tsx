import React from 'react';
import { NavigationTab } from '../../types';
import { MessageSquare, Phone, CircleDot, Users, Settings } from 'lucide-react';

interface BottomNavProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  unreadMessagesCount: number;
  unreadStoriesCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  unreadMessagesCount,
  unreadStoriesCount,
}) => {
  const tabs = [
    {
      id: 'chats' as NavigationTab,
      label: 'Chats',
      icon: MessageSquare,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
    {
      id: 'calls' as NavigationTab,
      label: 'Calls',
      icon: Phone,
      badge: null,
    },
    {
      id: 'stories' as NavigationTab,
      label: 'Stories',
      icon: CircleDot,
      badge: unreadStoriesCount > 0 ? unreadStoriesCount : null,
    },
    {
      id: 'contacts' as NavigationTab,
      label: 'Contacts',
      icon: Users,
      badge: null,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="w-full bg-slate-950/90 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 shrink-0 z-30 select-none">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 relative ${
                isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Material You active pill indicator */}
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
                  isActive ? 'bg-indigo-600/25 ring-1 ring-indigo-500/40' : ''
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-indigo-400' : ''}`} />

                {/* Badge */}
                {tab.badge !== null && (
                  <span className="absolute -top-1 -right-1 px-1.5 min-w-[16px] h-4 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-slate-950">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] mt-0.5 tracking-tight transition-all ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
