import React, { useState } from 'react';
import { User, ReportItem } from '../../types';
import { auraStorage } from '../../services/storage';
import { X, ShieldAlert, Check } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUser: User | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, targetUser }) => {
  const [reason, setReason] = useState<ReportItem['reason']>('spam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    auraStorage.reportUser(targetUser.id, reason, details.trim());
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-5 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Report User</h3>
            <p className="text-xs text-slate-400">Reporting @{targetUser.username}</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 text-center text-emerald-400">
            <Check className="w-10 h-10 mx-auto mb-2" />
            <p className="font-semibold text-xs text-white">Report Submitted to Moderation</p>
            <p className="text-[11px] text-slate-400 mt-1">Thank you for keeping Aura safe.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Reason</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportItem['reason'])}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="spam">Spam or unwanted advertising</option>
                <option value="harassment">Harassment or bullying</option>
                <option value="inappropriate_content">Inappropriate / adult content</option>
                <option value="impersonation">Pretending to be someone else</option>
                <option value="other">Other policy violation</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Additional Details</label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what occurred (optional)..."
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-rose-600/30"
            >
              Submit Report
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
