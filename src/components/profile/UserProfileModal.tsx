import React, { useState } from 'react';
import { User } from '../../types';
import { auraStorage } from '../../services/storage';
import { Avatar } from '../common/Avatar';
import { ReportModal } from './ReportModal';
import {
  X,
  MessageSquare,
  Phone,
  Video,
  ShieldAlert,
  Ban,
  Lock,
  Mail,
  Smartphone,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface UserProfileModalProps {
  userId: string | null;
  currentUser: User;
  onClose: () => void;
  onStartChat: (userId: string) => void;
  onStartCall: (peerId: string, peerName: string, peerAvatar: string, type: 'audio' | 'video') => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  userId,
  currentUser,
  onClose,
  onStartChat,
  onStartCall,
}) => {
  const [showReport, setShowReport] = useState(false);

  if (!userId) return null;

  const targetUser = auraStorage.getUserById(userId);
  if (!targetUser) return null;

  const isBlocked = currentUser.blockedUsers?.includes(targetUser.id);

  const handleToggleBlock = () => {
    if (isBlocked) {
      auraStorage.unblockUser(targetUser.id);
    } else {
      auraStorage.blockUser(targetUser.id);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
        <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100 shadow-2xl relative flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Hero Banner */}
          <div className="flex flex-col items-center text-center mt-2 mb-4">
            <Avatar
              src={targetUser.avatar}
              name={targetUser.name}
              size="2xl"
              isOnline={targetUser.isOnline}
            />

            <h3 className="text-lg font-bold text-white mt-3 flex items-center gap-1.5">
              {targetUser.name}
              {targetUser.isVerified && (
                <span className="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.2 rounded-full font-normal">
                  Verified
                </span>
              )}
            </h3>
            <p className="text-xs text-indigo-400 font-medium">@{targetUser.username}</p>

            {/* Bio */}
            <p className="text-xs text-slate-300 mt-2 px-3 leading-relaxed">
              {targetUser.bio || 'No bio provided'}
            </p>

            <span className="text-[11px] text-slate-400 mt-1">
              {targetUser.isOnline ? (
                <span className="text-emerald-400 font-semibold">● Active now</span>
              ) : (
                `Last seen: ${targetUser.lastSeen}`
              )}
            </span>
          </div>

          {/* Direct Action Buttons */}
          <div className="grid grid-cols-3 gap-2 my-2">
            <button
              onClick={() => {
                onClose();
                onStartChat(targetUser.id);
              }}
              className="py-2.5 px-3 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex flex-col items-center gap-1 transition"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span>Message</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartCall(targetUser.id, targetUser.name, targetUser.avatar, 'audio');
              }}
              className="py-2.5 px-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex flex-col items-center gap-1 transition"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Voice</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartCall(targetUser.id, targetUser.name, targetUser.avatar, 'video');
              }}
              className="py-2.5 px-3 rounded-2xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold flex flex-col items-center gap-1 transition"
            >
              <Video className="w-4 h-4 text-purple-400" />
              <span>Video</span>
            </button>
          </div>

          {/* Contact Details Card */}
          <div className="my-3 space-y-2.5 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <Smartphone className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Phone</span>
                <span className="text-white font-medium">{targetUser.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Email</span>
                <span className="text-white font-medium">{targetUser.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Encryption</span>
                <span className="text-indigo-300 font-medium">
                  Direct End-to-End Key Verified
                </span>
              </div>
            </div>
          </div>

          {/* Safety & Moderation Actions */}
          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={handleToggleBlock}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                isBlocked
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-400 hover:bg-rose-900/40'
              }`}
            >
              <Ban className="w-4 h-4" />
              <span>{isBlocked ? 'Unblock Contact' : 'Block Contact'}</span>
            </button>

            <button
              onClick={() => setShowReport(true)}
              className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-rose-400 transition flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Report User or Content</span>
            </button>
          </div>
        </div>
      </div>

      <ReportModal
        isOpen={showReport}
        onClose={() => setShowReport(false)}
        targetUser={targetUser}
      />
    </>
  );
};
