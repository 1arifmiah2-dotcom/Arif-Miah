import React, { useState, useRef, useEffect } from 'react';
import { Conversation, Message, User, MessageMedia } from '../../types';
import { auraStorage } from '../../services/storage';
import { soundEffects } from '../../services/audioSynthesis';
import { Avatar } from '../common/Avatar';
import { ChatInput } from './ChatInput';
import { ForwardModal } from './ForwardModal';
import { CameraModal } from './CameraModal';
import {
  ArrowLeft,
  Phone,
  Video,
  Search,
  X,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Play,
  Pause,
  Reply,
  Copy,
  Share2,
  Edit2,
  Trash2,
  Smile,
  ShieldCheck,
  Download,
} from 'lucide-react';

interface ChatViewProps {
  conversationId: string;
  currentUser: User;
  users: User[];
  onBack: () => void;
  onStartCall: (peerId: string, peerName: string, peerAvatar: string, type: 'audio' | 'video') => void;
  onOpenUserProfile: (userId: string) => void;
}

const REACTION_EMOJIS = ['❤️', '😂', '😮', '😢', '👍', '🔥'];

export const ChatView: React.FC<ChatViewProps> = ({
  conversationId,
  currentUser,
  users,
  onBack,
  onStartCall,
  onOpenUserProfile,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<Conversation | undefined>();
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [activeMenuMessageId, setActiveMenuMessageId] = useState<string | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // Local Search state within this conversation
  const [isSearching, setIsSearching] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Sync data
  const loadData = () => {
    const conv = auraStorage.getConversation(conversationId);
    setConversation(conv);
    const msgs = auraStorage.getMessages(conversationId);
    setMessages(msgs);
    auraStorage.markConversationRead(conversationId);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = auraStorage.subscribe(loadData);
    return () => {
      unsubscribe();
    };
  }, [conversationId]);

  useEffect(() => {
    if (!isSearching || !searchKeyword.trim()) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isSearching, searchKeyword]);

  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={i}
              className="bg-amber-400/40 text-amber-200 px-0.5 rounded font-semibold underline decoration-amber-400"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
        Conversation not found.
      </div>
    );
  }

  // Determine peer
  const isGroup = conversation.type === 'group';
  const peerId = conversation.participants.find((p) => p !== currentUser.id) || '';
  const peer = users.find((u) => u.id === peerId) || {
    id: 'unknown',
    name: 'User',
    avatar: '',
    isOnline: false,
    lastSeen: 'Offline',
  };

  const displayName = isGroup ? conversation.name : peer.name;
  const displayAvatar = isGroup ? conversation.avatar : peer.avatar;
  const isTyping = conversation.typingUsers && conversation.typingUsers.length > 0;

  // Filter messages by local search keyword
  const displayedMessages = searchKeyword.trim()
    ? messages.filter(
        (m) =>
          (m.text && m.text.toLowerCase().includes(searchKeyword.toLowerCase())) ||
          (m.media?.name && m.media.name.toLowerCase().includes(searchKeyword.toLowerCase()))
      )
    : messages;

  const handleSendMessage = (text: string, media?: MessageMedia) => {
    auraStorage.sendMessage(
      conversationId,
      text,
      media,
      replyToMessage
        ? {
            id: replyToMessage.id,
            senderName: replyToMessage.senderName,
            text: replyToMessage.text || 'Media attachment',
          }
        : undefined
    );
    soundEffects.playMessageSent();
    setReplyToMessage(null);
  };

  const handleSaveEdit = (newText: string) => {
    if (!editingMessage) return;
    auraStorage.editMessage(conversationId, editingMessage.id, newText);
    setEditingMessage(null);
  };

  const handleToggleReaction = (messageId: string, emoji: string) => {
    auraStorage.reactToMessage(conversationId, messageId, emoji);
    setActiveMenuMessageId(null);
  };

  const handleCopyMessage = (msg: Message) => {
    navigator.clipboard.writeText(msg.text);
    setActiveMenuMessageId(null);
  };

  const handleDeleteMessage = (msg: Message, forEveryone: boolean) => {
    auraStorage.deleteMessage(conversationId, msg.id, forEveryone);
    setActiveMenuMessageId(null);
  };

  const toggleAudioPlay = (msgId: string, url: string) => {
    let audio = audioRefs.current[msgId];
    if (!audio) {
      audio = new Audio(url);
      audio.onended = () => setPlayingAudioId(null);
      audioRefs.current[msgId] = audio;
    }

    if (playingAudioId === msgId) {
      audio.pause();
      setPlayingAudioId(null);
    } else {
      // Pause any other playing audio
      if (playingAudioId && audioRefs.current[playingAudioId]) {
        audioRefs.current[playingAudioId].pause();
      }
      audio.play();
      setPlayingAudioId(msgId);
    }
  };

  const getStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sending':
        return <Clock className="w-3 h-3 text-slate-400" />;
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

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative select-none">
      {/* Header Bar */}
      <header className="px-3 py-2 flex items-center justify-between bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shrink-0 z-20">
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Back to chats"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div
            onClick={() => !isGroup && onOpenUserProfile(peerId)}
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
          >
            <Avatar
              src={displayAvatar}
              name={displayName || 'Chat'}
              size="sm"
              isOnline={isGroup ? undefined : peer.isOnline}
            />
            <div className="min-w-0">
              <h2 className="text-xs font-bold text-white truncate flex items-center gap-1">
                {displayName}
              </h2>
              <p className="text-[10px] text-slate-400 truncate">
                {isTyping ? (
                  <span className="text-indigo-400 font-semibold animate-pulse">typing...</span>
                ) : isGroup ? (
                  `${conversation.participants.length} members`
                ) : peer.isOnline ? (
                  <span className="text-emerald-400 font-medium">Active now</span>
                ) : (
                  peer.lastSeen || 'Offline'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Local Search, Audio Call, Video Call */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              setIsSearching(!isSearching);
              if (isSearching) setSearchKeyword('');
            }}
            className={`p-2 rounded-xl transition ${
              isSearching
                ? 'text-indigo-400 bg-indigo-600/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
            title="Search messages in this conversation"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStartCall(peerId, displayName || 'User', displayAvatar || '', 'audio')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            title="HD Audio Call"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={() => onStartCall(peerId, displayName || 'User', displayAvatar || '', 'video')}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition"
            title="HD Video Call"
          >
            <Video className="w-4 h-4 text-indigo-400" />
          </button>
        </div>
      </header>

      {/* Local Conversation Search Toolbar */}
      {isSearching && (
        <div className="px-3 py-2 bg-slate-900/95 border-b border-slate-800 flex items-center gap-2 z-20 animate-in slide-in-from-top-2">
          <div className="flex-1 flex items-center bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-white focus-within:border-indigo-500 shadow-inner">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search keyword in this chat..."
              className="w-full bg-transparent placeholder-slate-500 focus:outline-none text-xs text-white"
              autoFocus
            />
            {searchKeyword && (
              <button
                onClick={() => setSearchKeyword('')}
                className="text-slate-400 hover:text-white p-0.5 ml-1"
                title="Clear query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {searchKeyword.trim() && (
            <span className="text-[10px] bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 px-2 py-1 rounded-lg shrink-0 font-medium">
              {displayedMessages.length} {displayedMessages.length === 1 ? 'match' : 'matches'}
            </span>
          )}

          <button
            onClick={() => {
              setIsSearching(false);
              setSearchKeyword('');
            }}
            className="px-2 py-1 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium transition"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar relative">
        {/* End-to-end encryption security banner (hide when searching to save vertical space) */}
        {!isSearching && (
          <div className="my-2 flex justify-center">
            <div className="flex items-center gap-1.5 bg-slate-900/80 border border-slate-800 text-slate-400 rounded-full px-3 py-1 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Messages & calls are end-to-end encrypted</span>
            </div>
          </div>
        )}

        {/* Empty Search Result State */}
        {searchKeyword.trim() && displayedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-slate-500">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-400 shadow-inner">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-200">No matching messages found</p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[220px]">
              No messages in this chat contain &quot;{searchKeyword}&quot;.
            </p>
            <button
              onClick={() => setSearchKeyword('')}
              className="mt-3 px-3 py-1.5 rounded-xl bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold transition"
            >
              Clear Search Filter
            </button>
          </div>
        ) : (
          displayedMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            const isDeleted = msg.isDeletedForEveryone;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group relative`}
              >
                {/* Group sender name if group conversation */}
                {isGroup && !isMe && (
                  <span className="text-[10px] text-slate-400 font-semibold mb-0.5 ml-2">
                    {msg.senderName}
                  </span>
                )}

                {/* Message Bubble Container */}
                <div className="relative max-w-[82%]">
                  <div
                    className={`rounded-2xl px-3.5 py-2 text-xs relative shadow-sm ${
                      isMe
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-xs'
                        : 'bg-slate-800/90 text-slate-100 rounded-bl-xs border border-slate-700/60'
                    } ${isDeleted ? 'italic text-slate-400 bg-slate-800/40 border-dashed' : ''}`}
                  >
                    {/* Quoted Reply Preview */}
                    {msg.replyTo && (
                      <div className="mb-1.5 p-2 rounded-xl bg-black/20 border-l-2 border-white/60 text-[11px]">
                        <span className="font-bold opacity-90 block">{msg.replyTo.senderName}</span>
                        <span className="opacity-75 truncate block">{msg.replyTo.text}</span>
                      </div>
                    )}

                    {/* Media Content */}
                    {msg.media && (
                      <div className="mb-1.5 rounded-xl overflow-hidden">
                        {msg.media.type === 'image' && (
                          <div className="relative group/media">
                            <img
                              src={msg.media.url}
                              alt="Photo"
                              className="max-h-60 w-full object-cover rounded-xl"
                            />
                            <a
                              href={msg.media.url}
                              download="photo.jpg"
                              className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-white opacity-0 group-hover/media:opacity-100 transition"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {msg.media.type === 'video' && (
                          <video
                            src={msg.media.url}
                            controls
                            className="max-h-60 w-full rounded-xl bg-black"
                          />
                        )}

                        {msg.media.type === 'audio' && (
                          <div className="flex items-center gap-2.5 py-1 min-w-[200px]">
                            <button
                              onClick={() => toggleAudioPlay(msg.id, msg.media!.url)}
                              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center shrink-0 transition"
                            >
                              {playingAudioId === msg.id ? (
                                <Pause className="w-4 h-4 fill-white" />
                              ) : (
                                <Play className="w-4 h-4 fill-white ml-0.5" />
                              )}
                            </button>

                            {/* Waveform bars */}
                            <div className="flex items-center gap-0.5 flex-1 h-6">
                              {(msg.media.waveform || [30, 60, 45, 80, 50, 40, 70, 90, 30, 50]).map(
                                (barHeight, idx) => (
                                  <div
                                    key={idx}
                                    className="w-1 bg-white/60 rounded-full transition-all"
                                    style={{ height: `${Math.max(15, barHeight)}%` }}
                                  />
                                )
                              )}
                            </div>

                            <span className="text-[10px] opacity-80 shrink-0 font-mono">
                              {msg.media.duration ? `${msg.media.duration}s` : '0:05'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Text Content with Local Keyword Highlighting */}
                    {msg.text && (
                      <p className="leading-relaxed break-words">
                        {renderHighlightedText(msg.text, searchKeyword)}
                      </p>
                    )}

                    {/* Timestamp & Status footer */}
                    <div className="flex items-center justify-end gap-1 mt-1 text-[9px] opacity-70">
                      {msg.isEdited && <span>(edited)</span>}
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMe && getStatusIcon(msg.status)}
                    </div>
                  </div>

                  {/* Reactions badge */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="flex items-center gap-1 mt-1 flex-wrap">
                      {Object.entries(msg.reactions).map(([emoji, userIds]) => (
                        <button
                          key={emoji}
                          onClick={() => handleToggleReaction(msg.id, emoji)}
                          className={`text-xs px-1.5 py-0.5 rounded-full border flex items-center gap-1 transition ${
                            userIds.includes(currentUser.id)
                              ? 'bg-indigo-600/30 border-indigo-500/50 text-white'
                              : 'bg-slate-800/80 border-slate-700 text-slate-300'
                          }`}
                        >
                          <span>{emoji}</span>
                          {userIds.length > 1 && (
                            <span className="text-[10px] font-bold">{userIds.length}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Context Trigger Button (Hover or tap) */}
                {!isDeleted && (
                  <div
                    className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5 ${
                      isMe ? 'flex-row-reverse mr-1' : 'ml-1'
                    }`}
                  >
                    <button
                      onClick={() =>
                        setActiveMenuMessageId(activeMenuMessageId === msg.id ? null : msg.id)
                      }
                      className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                      title="Actions"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Actions Context Menu Popover */}
                {activeMenuMessageId === msg.id && (
                  <div className="absolute z-30 top-full mt-1 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl flex flex-col gap-1 w-44 animate-in fade-in">
                    {/* Quick Reactions bar */}
                    <div className="flex items-center justify-around pb-2 mb-1 border-b border-slate-800">
                      {REACTION_EMOJIS.map((em) => (
                        <button
                          key={em}
                          onClick={() => handleToggleReaction(msg.id, em)}
                          className="text-base p-1 hover:scale-125 transition"
                        >
                          {em}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setReplyToMessage(msg);
                        setActiveMenuMessageId(null);
                      }}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200"
                    >
                      <Reply className="w-3.5 h-3.5 text-indigo-400" /> Reply
                    </button>

                    {msg.text && (
                      <button
                        onClick={() => handleCopyMessage(msg)}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Text
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setForwardingMessage(msg);
                        setActiveMenuMessageId(null);
                      }}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200"
                    >
                      <Share2 className="w-3.5 h-3.5 text-cyan-400" /> Forward
                    </button>

                    {isMe && msg.text && (
                      <button
                        onClick={() => {
                          setEditingMessage(msg);
                          setActiveMenuMessageId(null);
                        }}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 text-xs text-slate-200"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-amber-400" /> Edit Message
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteMessage(msg, false)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 text-xs text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete for me
                    </button>

                    {isMe && (
                      <button
                        onClick={() => handleDeleteMessage(msg, true)}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 text-xs text-rose-500 font-semibold"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete for everyone
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        replyToMessage={replyToMessage}
        onCancelReply={() => setReplyToMessage(null)}
        editingMessage={editingMessage}
        onCancelEdit={() => setEditingMessage(null)}
        onSaveEdit={handleSaveEdit}
        onOpenLiveCamera={() => setIsCameraOpen(true)}
      />

      {/* Forward Modal */}
      <ForwardModal
        isOpen={!!forwardingMessage}
        messageToForward={forwardingMessage}
        onClose={() => setForwardingMessage(null)}
        currentUser={currentUser}
        conversations={auraStorage.getConversations()}
        users={users}
      />

      {/* Real Camera Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapturePhoto={(blobUrl) => {
          handleSendMessage('', { type: 'image', url: blobUrl });
        }}
        onRecordVideo={(blobUrl) => {
          handleSendMessage('', { type: 'video', url: blobUrl });
        }}
      />
    </div>
  );
};
