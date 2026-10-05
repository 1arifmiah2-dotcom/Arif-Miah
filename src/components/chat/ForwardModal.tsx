import React, { useState } from 'react';
import { Conversation, User, Message } from '../../types';
import { auraStorage } from '../../services/storage';
import { X, Search, Check, Send, Users } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface ForwardModalProps {
  isOpen: boolean;
  messageToForward: Message | null;
  onClose: () => void;
  currentUser: User;
  conversations: Conversation[];
  users: User[];
}

export const ForwardModal: React.FC<ForwardModalProps> = ({
  isOpen,
  messageToForward,
  onClose,
  currentUser,
  conversations,
  users,
}) => {
  const [search, setSearch] = useState('');
  const [selectedConvIds, setSelectedConvIds] = useState<string[]>([]);
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen || !messageToForward) return null;

  const toggleSelect = (id: string) => {
    setSelectedConvIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleForward = () => {
    if (selectedConvIds.length === 0) return;

    selectedConvIds.forEach((convId) => {
      auraStorage.sendMessage(
        convId,
        messageToForward.text,
        messageToForward.media
      );
    });

    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setSelectedConvIds([]);
      onClose();
    }, 900);
  };

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    if (c.type === 'group') return c.name?.toLowerCase().includes(q);
    const peerId = c.participants.find((p) => p !== currentUser.id);
    const peer = users.find((u) => u.id === peerId);
    return peer?.name.toLowerCase().includes(q) || peer?.username.toLowerCase().includes(q);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100 shadow-2xl relative flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white">Forward Message</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quoted Message Preview */}
        <div className="my-2.5 p-2.5 rounded-xl bg-slate-800/60 border-l-2 border-indigo-500 text-xs">
          <p className="text-[10px] text-indigo-400 font-semibold mb-0.5">
            {messageToForward.senderName}
          </p>
          <p className="text-slate-200 truncate">{messageToForward.text || 'Media attachment'}</p>
        </div>

        {/* Search */}
        <div className="relative flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs my-2">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-transparent placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* List of conversations */}
        <div className="flex-1 overflow-y-auto py-2 space-y-1.5 no-scrollbar max-h-64">
          {filtered.map((c) => {
            const isSelected = selectedConvIds.includes(c.id);
            const peerId = c.participants.find((p) => p !== currentUser.id);
            const peer = users.find((u) => u.id === peerId);
            const name = c.type === 'group' ? c.name : peer?.name || 'User';
            const avatar = c.type === 'group' ? c.avatar : peer?.avatar;

            return (
              <div
                key={c.id}
                onClick={() => toggleSelect(c.id)}
                className={`flex items-center justify-between p-2.5 rounded-2xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500/60'
                    : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Avatar src={avatar} name={name || 'Chat'} size="sm" />
                  <span className="text-xs font-semibold text-white">{name}</span>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-500 text-white'
                      : 'border-slate-600'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800">
          <button
            onClick={handleForward}
            disabled={selectedConvIds.length === 0 || sentSuccess}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
          >
            {sentSuccess ? (
              <span className="flex items-center gap-1 text-emerald-300">
                <Check className="w-4 h-4" /> Forwarded!
              </span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Forward to ({selectedConvIds.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
