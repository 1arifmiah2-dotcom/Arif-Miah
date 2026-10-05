import React, { useState } from 'react';
import { User } from '../../types';
import { auraStorage } from '../../services/storage';
import { X, Users, Check, Camera } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface GroupCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  users: User[];
  onGroupCreated: (groupId: string) => void;
}

export const GroupCreateModal: React.FC<GroupCreateModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users,
  onGroupCreated,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  if (!isOpen) return null;

  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  const toggleUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const group = auraStorage.createGroupConversation(
      name.trim(),
      description.trim(),
      selectedUserIds
    );

    // Initial welcome message
    auraStorage.sendMessage(group.id, `Created group "${name.trim()}"`);

    onGroupCreated(group.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100 shadow-2xl relative flex flex-col max-h-[88vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">Create New Group</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="flex-1 flex flex-col overflow-hidden py-3 space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Design Sync, Weekend Squad"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this group about?"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <span className="text-xs font-semibold text-slate-300 block mb-1.5">
              Add Members ({selectedUserIds.length} selected)
            </span>

            <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar max-h-48">
              {otherUsers.map((u) => {
                const isSelected = selectedUserIds.includes(u.id);

                return (
                  <div
                    key={u.id}
                    onClick={() => toggleUser(u.id)}
                    className={`flex items-center justify-between p-2 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/50'
                        : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar src={u.avatar} name={u.name} size="sm" isOnline={u.isOnline} />
                      <div>
                        <p className="text-xs font-semibold text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-400">@{u.username}</p>
                      </div>
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
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-indigo-600/30"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  );
};
