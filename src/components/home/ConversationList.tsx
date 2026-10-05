import React, { useState } from 'react';
import { Conversation, User } from '../../types';
import { Avatar } from '../common/Avatar';
import { Pin, VolumeX, Check, CheckCheck, Clock, Plus, Search, MessageSquarePlus, Users } from 'lucide-react';
import { auraStorage } from '../../services/storage';

interface ConversationListProps {
  conversations: Conversation[];
  currentUser: User;
  users: User[];
  onSelectConversation: (id: string) => void;
  onOpenNewMessage: () => void;
  onOpenNewGroup: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  currentUser,
  users,
  onSelectConversation,
  onOpenNewMessage,
  onOpenNewGroup,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'groups'>('all');

  // Filter conversations
  const filtered = conversations.filter((c) => {
    // Tab filter
    if (filter === 'unread' && c.unreadCount === 0) return false;
    if (filter === 'groups' && c.type !== 'group') return false;

    // Search filter
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();

    if (c.type === 'group') {
      return (
        c.name?.toLowerCase().includes(q) ||
        c.lastMessage?.text.toLowerCase().includes(q)
      );
    } else {
      const peerId = c.participants.find((p) => p !== currentUser.id);
      const peer = users.find((u) => u.id === peerId);
      return (
        peer?.name.toLowerCase().includes(q) ||
        peer?.username.toLowerCase().includes(q) ||
        c.lastMessage?.text.toLowerCase().includes(q)
      );
    }
  });

  const getConversationDetails = (c: Conversation) => {
    if (c.type === 'group') {
      return {
        name: c.name || 'Group Chat',
        avatar: c.avatar,
        isOnline: false,
        statusText: `${c.participants.length} members`,
      };
    }
    const peerId = c.participants.find((p) => p !== currentUser.id);
    const peer = users.find((u) => u.id === peerId) || {
      name: 'User',
      avatar: '',
      isOnline: false,
      username: 'user',
    };
    return {
      name: peer.name,
      avatar: peer.avatar,
      isOnline: peer.isOnline,
      statusText: peer.isOnline ? 'Online' : 'Offline',
    };
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-slate-500" />;
      case 'sent':
        return <Check className="w-3 h-3 text-slate-400" />;
      case 'delivered':
        return <CheckCheck className="w-3 h-3 text-slate-400" />;
      case 'seen':
        return <CheckCheck className="w-3 h-3 text-indigo-400" />;
      default:
        return null;
    }
  };

  // Online contacts for the quick-bar
  const onlineUsers = users.filter((u) => u.id !== currentUser.id && u.isOnline);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative select-none">
      {/* Search Bar */}
      <div className="px-3 pt-2.5 pb-2">
        <div className="relative flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl px-3 py-2 text-xs text-slate-200 focus-within:border-indigo-500 transition shadow-inner">
          <Search className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats, people, groups..."
            className="w-full bg-transparent placeholder-slate-500 focus:outline-none text-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white text-[11px] font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 mt-2.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1 ${
              filter === 'unread'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>Unread</span>
          </button>
          <button
            onClick={() => setFilter('groups')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition flex items-center gap-1 ${
              filter === 'groups'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Groups</span>
          </button>
        </div>
      </div>

      {/* Online Users Carousel */}
      {onlineUsers.length > 0 && !searchQuery && (
        <div className="px-3 py-1.5 border-b border-slate-800/40">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {onlineUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => {
                  const conv = auraStorage.getOrCreateDirectConversation(u.id);
                  onSelectConversation(conv.id);
                }}
                className="flex flex-col items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition"
                title={`Chat with ${u.name}`}
              >
                <Avatar src={u.avatar} name={u.name} size="sm" isOnline={true} />
                <span className="text-[10px] text-slate-300 font-medium truncate w-12 text-center">
                  {u.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Items List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 space-y-1 no-scrollbar">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-3 text-slate-600">
              <MessageSquarePlus className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-400">No conversations found</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
              Tap the button below to start a new chat or create a group!
            </p>
          </div>
        ) : (
          filtered.map((conv) => {
            const { name, avatar, isOnline } = getConversationDetails(conv);
            const isTyping = conv.typingUsers && conv.typingUsers.length > 0;
            const lastMsg = conv.lastMessage;
            const isMe = lastMsg?.senderId === currentUser.id;

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className="group flex items-center gap-3 p-2.5 rounded-2xl hover:bg-slate-900/80 active:bg-slate-800/80 transition cursor-pointer border border-transparent hover:border-slate-800/60"
              >
                {/* Avatar with online dot */}
                <Avatar
                  src={avatar}
                  name={name}
                  size="md"
                  isOnline={conv.type === 'direct' ? isOnline : undefined}
                />

                {/* Content info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                      {name}
                      {conv.isPinned && (
                        <Pin className="w-3 h-3 text-indigo-400 fill-indigo-400 shrink-0" />
                      )}
                      {conv.isMuted && (
                        <VolumeX className="w-3 h-3 text-slate-500 shrink-0" />
                      )}
                    </span>
                    {lastMsg && (
                      <span className="text-[10px] text-slate-500 shrink-0">
                        {new Date(lastMsg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {isTyping ? (
                      <span className="text-xs text-indigo-400 font-semibold italic flex items-center gap-1 animate-pulse">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                        typing...
                      </span>
                    ) : (
                      <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                        {isMe && getStatusIcon(lastMsg?.status)}
                        <span>
                          {lastMsg
                            ? lastMsg.text || (lastMsg.media ? `📷 ${lastMsg.media.type}` : '')
                            : 'No messages yet'}
                        </span>
                      </p>
                    )}

                    {/* Unread badge */}
                    {conv.unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 min-w-[18px] h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-sm">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Android Floating Action Button (FAB) */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={onOpenNewGroup}
          className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center shadow-lg border border-slate-700 transition active:scale-95"
          title="Create Group"
        >
          <Users className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenNewMessage}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 transition active:scale-95"
          title="New Message"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
