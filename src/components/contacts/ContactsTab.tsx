import React, { useState } from 'react';
import { User } from '../../types';
import { auraStorage } from '../../services/storage';
import { Avatar } from '../common/Avatar';
import {
  Users,
  Search,
  MessageSquare,
  Phone,
  Video,
  UserPlus,
  Shield,
  MoreVertical,
} from 'lucide-react';

interface ContactsTabProps {
  currentUser: User;
  users: User[];
  onStartChat: (userId: string) => void;
  onStartCall: (peerId: string, peerName: string, peerAvatar: string, type: 'audio' | 'video') => void;
  onOpenUserProfile: (userId: string) => void;
  onOpenNewGroup: () => void;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({
  currentUser,
  users,
  onStartChat,
  onStartCall,
  onOpenUserProfile,
  onOpenNewGroup,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'blocked'>('all');

  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  const filtered = otherUsers.filter((u) => {
    const isBlocked = currentUser.blockedUsers?.includes(u.id);

    if (activeTab === 'blocked') return isBlocked;
    if (activeTab === 'online') return u.isOnline && !isBlocked;
    if (isBlocked) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.bio.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 mb-2">
        <div>
          <h2 className="text-base font-bold text-white">Contacts</h2>
          <p className="text-[11px] text-slate-400">
            {otherUsers.length} people in your network
          </p>
        </div>

        <button
          onClick={onOpenNewGroup}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold transition"
        >
          <Users className="w-3.5 h-3.5" />
          <span>New Group</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs mb-2">
        <Search className="w-3.5 h-3.5 text-slate-500 mr-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, handle, or bio..."
          className="w-full bg-transparent placeholder-slate-500 focus:outline-none text-xs"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1 rounded-full transition ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          All ({otherUsers.filter((u) => !currentUser.blockedUsers?.includes(u.id)).length})
        </button>
        <button
          onClick={() => setActiveTab('online')}
          className={`px-3 py-1 rounded-full transition ${
            activeTab === 'online'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
        >
          Online ({otherUsers.filter((u) => u.isOnline && !currentUser.blockedUsers?.includes(u.id)).length})
        </button>
        {currentUser.blockedUsers?.length > 0 && (
          <button
            onClick={() => setActiveTab('blocked')}
            className={`px-3 py-1 rounded-full transition ${
              activeTab === 'blocked'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Blocked ({currentUser.blockedUsers.length})
          </button>
        )}
      </div>

      {/* User Cards List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs">
            No contacts match the filter.
          </div>
        ) : (
          filtered.map((user) => {
            const isBlocked = currentUser.blockedUsers?.includes(user.id);

            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/60 transition group"
              >
                <div
                  onClick={() => onOpenUserProfile(user.id)}
                  className="flex items-center gap-3 cursor-pointer min-w-0 flex-1"
                >
                  <Avatar
                    src={user.avatar}
                    name={user.name}
                    size="md"
                    isOnline={user.isOnline}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                      {user.name}
                      {user.isVerified && (
                        <span className="text-[10px] text-indigo-400 font-bold">✓</span>
                      )}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">@{user.username}</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-xs">{user.bio}</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  {isBlocked ? (
                    <button
                      onClick={() => auraStorage.unblockUser(user.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-rose-400 rounded-xl text-xs font-semibold"
                    >
                      Unblock
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => onStartChat(user.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Chat"
                      >
                        <MessageSquare className="w-4 h-4 text-indigo-400" />
                      </button>
                      <button
                        onClick={() =>
                          onStartCall(user.id, user.name, user.avatar, 'audio')
                        }
                        className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          onStartCall(user.id, user.name, user.avatar, 'video')
                        }
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                        title="Video"
                      >
                        <Video className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
