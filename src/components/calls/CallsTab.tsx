import React, { useState } from 'react';
import { CallHistoryItem, User } from '../../types';
import { auraStorage } from '../../services/storage';
import { Avatar } from '../common/Avatar';
import {
  Phone,
  Video,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Sparkles,
  Clock,
  PhoneCall,
} from 'lucide-react';

interface CallsTabProps {
  currentUser: User;
  onStartCall: (peerId: string, peerName: string, peerAvatar: string, type: 'audio' | 'video') => void;
  onTriggerSimulatedIncomingCall: () => void;
}

export const CallsTab: React.FC<CallsTabProps> = ({
  currentUser,
  onStartCall,
  onTriggerSimulatedIncomingCall,
}) => {
  const [history, setHistory] = useState<CallHistoryItem[]>(() => auraStorage.getCallHistory());

  const getCallDirectionIcon = (direction: CallHistoryItem['direction']) => {
    switch (direction) {
      case 'incoming':
        return <PhoneIncoming className="w-3.5 h-3.5 text-emerald-400" />;
      case 'outgoing':
        return <PhoneOutgoing className="w-3.5 h-3.5 text-indigo-400" />;
      case 'missed':
        return <PhoneMissed className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return 'Missed';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 p-3 select-none">
      {/* Header and Test Simulator Trigger */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-2">
        <div>
          <h2 className="text-base font-bold text-white">Call Log</h2>
          <p className="text-[11px] text-slate-400">Encrypted audio & video history</p>
        </div>

        {/* Simulator button */}
        <button
          onClick={onTriggerSimulatedIncomingCall}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 text-xs font-semibold transition active:scale-95 shadow-sm"
          title="Simulate incoming call to test ringing & UI"
        >
          <PhoneCall className="w-3.5 h-3.5 text-indigo-400" />
          <span>Test Inbound Call</span>
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center">
            <Phone className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-xs font-semibold">No recent calls</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Start an encrypted audio or video call with any contact.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/60 transition"
            >
              <div className="flex items-center gap-3">
                <Avatar src={item.peerAvatar} name={item.peerName} size="md" />
                <div>
                  <h4 className="text-xs font-bold text-white">{item.peerName}</h4>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    {getCallDirectionIcon(item.direction)}
                    <span>{formatDuration(item.duration)}</span>
                    <span>•</span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Call-back buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    onStartCall(item.peerId, item.peerName, item.peerAvatar, 'audio')
                  }
                  className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                  title="Audio Call"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    onStartCall(item.peerId, item.peerName, item.peerAvatar, 'video')
                  }
                  className="p-2 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
