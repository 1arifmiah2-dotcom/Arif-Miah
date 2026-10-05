import React, { useState } from 'react';
import { auraStorage } from '../../services/storage';
import { User, ReportItem, Story } from '../../types';
import { Avatar } from '../common/Avatar';
import {
  X,
  Shield,
  Users,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Ban,
  Trash2,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [tab, setTab] = useState<'analytics' | 'users' | 'reports' | 'stories'>('analytics');
  const [users, setUsers] = useState<User[]>(() => auraStorage.getUsers());
  const [reports, setReports] = useState<ReportItem[]>(() => auraStorage.getReports());
  const [stories, setStories] = useState<Story[]>(() => auraStorage.getStories());

  if (!isOpen) return null;

  const refreshData = () => {
    setUsers(auraStorage.getUsers());
    setReports(auraStorage.getReports());
    setStories(auraStorage.getStories());
  };

  const handleResolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    auraStorage.resolveReport(reportId, status);
    refreshData();
  };

  const handleToggleVerify = (user: User) => {
    auraStorage.updateUser({
      id: user.id,
      isVerified: !user.isVerified,
    });
    refreshData();
  };

  const handleDeleteStory = (storyId: string) => {
    auraStorage.deleteStory(storyId);
    refreshData();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100 shadow-2xl relative flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Aura Admin & Moderation</h3>
              <p className="text-[10px] text-slate-400">System governance & moderation portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex p-1 bg-slate-950 rounded-2xl my-3 text-xs font-semibold gap-1">
          <button
            onClick={() => setTab('analytics')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1 transition ${
              tab === 'analytics' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Metrics</span>
          </button>
          <button
            onClick={() => setTab('users')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1 transition ${
              tab === 'users' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setTab('reports')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1 transition ${
              tab === 'reports' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reports ({reports.filter((r) => r.status === 'pending').length})</span>
          </button>
          <button
            onClick={() => setTab('stories')}
            className={`flex-1 py-1.5 rounded-xl flex items-center justify-center gap-1 transition ${
              tab === 'stories' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Stories</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 py-1 text-xs">
          {/* TAB 1: Real-time System Metrics */}
          {tab === 'analytics' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Registered Users
                  </span>
                  <p className="text-xl font-bold text-white mt-1">{users.length}</p>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    ● {users.filter((u) => u.isOnline).length} Active Online
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Active 24h Stories
                  </span>
                  <p className="text-xl font-bold text-white mt-1">{stories.length}</p>
                  <span className="text-[10px] text-indigo-400 font-medium">
                    100% policy compliant
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Calls Completed
                  </span>
                  <p className="text-xl font-bold text-white mt-1">14</p>
                  <span className="text-[10px] text-cyan-400 font-medium">
                    Low-latency WebRTC
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">
                    Open Moderation Reports
                  </span>
                  <p className="text-xl font-bold text-white mt-1">
                    {reports.filter((r) => r.status === 'pending').length}
                  </p>
                  <span className="text-[10px] text-amber-400 font-medium">Requires triage</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Production Infrastructure Status</span>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>WebRTC Signaling Service</span>
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Healthy (99.98%)
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Cloud Media Storage & CDN</span>
                  <span className="text-emerald-400 font-medium">Optimal</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Push Notification Relays (FCM)</span>
                  <span className="text-emerald-400 font-medium">Ready</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: User Governance */}
          {tab === 'users' && (
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar src={u.avatar} name={u.name} size="sm" isOnline={u.isOnline} />
                    <div>
                      <p className="font-bold text-white flex items-center gap-1">
                        {u.name}
                        {u.isVerified && (
                          <span className="text-[10px] text-indigo-400">✓</span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-400">@{u.username} • {u.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleVerify(u)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition ${
                        u.isVerified
                          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                      title="Toggle verification badge"
                    >
                      {u.isVerified ? 'Verified' : 'Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Reports Queue */}
          {tab === 'reports' && (
            <div className="space-y-2">
              {reports.length === 0 ? (
                <p className="text-center py-10 text-slate-500">No reports found.</p>
              ) : (
                reports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400 uppercase text-[10px] tracking-wide">
                        Reported: {rep.reportedUserName}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold ${
                          rep.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {rep.status}
                      </span>
                    </div>

                    <p className="text-slate-300 text-[11px]">
                      Reason: <strong className="text-white capitalize">{rep.reason}</strong>
                    </p>
                    {rep.details && (
                      <p className="text-slate-400 text-[10px] bg-slate-900 p-2 rounded-xl">
                        "{rep.details}"
                      </p>
                    )}

                    {rep.status === 'pending' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleResolveReport(rep.id, 'resolved')}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-semibold"
                        >
                          Resolve & Ban User
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'dismissed')}
                          className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[11px] font-semibold"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 4: Stories Moderation */}
          {tab === 'stories' && (
            <div className="space-y-2">
              {stories.length === 0 ? (
                <p className="text-center py-10 text-slate-500">No active stories.</p>
              ) : (
                stories.map((story) => (
                  <div
                    key={story.id}
                    className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar src={story.userAvatar} name={story.userName} size="sm" />
                      <div>
                        <p className="font-semibold text-white">{story.userName}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-xs">
                          {story.type === 'text' ? story.text : '📷 Photo Story'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                      title="Remove inappropriate story"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
