import React, { useState } from 'react';
import { User } from '../../types';
import { auraStorage } from '../../services/storage';
import { X, Sparkles, Trash2, Clock } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

const EMOJI_OPTIONS = ['✨', '💭', '🚀', '☕', '🎧', '⚡', '💻', '🌅', '🔥', '📚', '🌴', '🍕'];

export const NotesModal: React.FC<NotesModalProps> = ({ isOpen, onClose, currentUser }) => {
  const currentNote = currentUser.statusNote;
  const [text, setText] = useState(currentNote?.text || '');
  const [emoji, setEmoji] = useState(currentNote?.emoji || '✨');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    auraStorage.setStatusNote(text.trim(), emoji);
    onClose();
  };

  const handleDelete = () => {
    auraStorage.deleteStatusNote();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-100 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white">Status Note</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Visible to contacts for 24 hours
            </p>
          </div>
        </div>

        {/* Live Note Preview */}
        <div className="flex flex-col items-center my-4 py-4 bg-slate-950/60 rounded-2xl border border-slate-800 relative">
          <div className="bg-slate-800 border border-indigo-500/40 text-white rounded-full px-3 py-1 text-xs shadow-lg flex items-center gap-1.5 mb-2 max-w-[200px] truncate animate-bounce">
            <span className="text-sm">{emoji}</span>
            <span className="font-medium truncate">{text || 'Share a thought...'}</span>
          </div>
          <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" />
          <span className="text-xs font-semibold text-slate-300 mt-2">{currentUser.name}</span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">Your status thought</label>
            <input
              type="text"
              maxLength={60}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              autoFocus
            />
            <span className="text-[10px] text-slate-500 mt-1 block text-right">
              {text.length}/60 characters
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1.5">Mood emoji</label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-800/50 rounded-xl border border-slate-800">
              {EMOJI_OPTIONS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition ${
                    emoji === em ? 'bg-indigo-600 scale-110 shadow' : 'hover:bg-slate-700'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            {currentNote && (
              <button
                type="button"
                onClick={handleDelete}
                className="p-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition"
                title="Delete current note"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
            >
              {currentNote ? 'Update Note' : 'Share Note (24h)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
