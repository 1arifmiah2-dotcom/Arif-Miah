import React, { useState, useEffect, useRef } from 'react';
import { Story, User } from '../../types';
import { auraStorage } from '../../services/storage';
import { X, Trash2, Eye, Send, Heart, Flame, Laugh, Clock } from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface StoryViewerProps {
  initialStoryId: string;
  currentUser: User;
  onClose: () => void;
  onSendStoryReply?: (userId: string, replyText: string) => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  initialStoryId,
  currentUser,
  onClose,
  onSendStoryReply,
}) => {
  const stories = auraStorage.getStories();
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = stories.findIndex((s) => s.id === initialStoryId);
    return idx >= 0 ? idx : 0;
  });
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showViewersModal, setShowViewersModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sentFeedback, setSentFeedback] = useState(false);

  const currentStory = stories[currentIndex];
  const timerRef = useRef<number | null>(null);

  // Mark viewed when navigating to a story
  useEffect(() => {
    if (currentStory) {
      auraStorage.viewStory(currentStory.id);
      setProgress(0);
    }
  }, [currentIndex, currentStory]);

  // Story progress timer (5 seconds per story)
  useEffect(() => {
    if (!currentStory || isPaused || showViewersModal) return;

    const interval = 50; // update every 50ms
    const step = (interval / 5000) * 100;

    timerRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, isPaused, showViewersModal, currentStory]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleDelete = () => {
    if (!currentStory) return;
    auraStorage.deleteStory(currentStory.id);
    if (stories.length <= 1) {
      onClose();
    } else {
      handleNext();
    }
  };

  const handleSendReaction = (emoji: string) => {
    if (!currentStory) return;
    if (onSendStoryReply) {
      onSendStoryReply(currentStory.userId, `Reacted ${emoji} to your story`);
    } else {
      const conv = auraStorage.getOrCreateDirectConversation(currentStory.userId);
      auraStorage.sendMessage(conv.id, `Reacted ${emoji} to your story`);
    }
    setSentFeedback(true);
    setTimeout(() => setSentFeedback(false), 2000);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentStory) return;
    if (onSendStoryReply) {
      onSendStoryReply(currentStory.userId, `Replying to story: ${replyText}`);
    } else {
      const conv = auraStorage.getOrCreateDirectConversation(currentStory.userId);
      auraStorage.sendMessage(conv.id, `Replying to story: ${replyText}`);
    }
    setReplyText('');
    setSentFeedback(true);
    setTimeout(() => setSentFeedback(false), 2000);
  };

  if (!currentStory) return null;

  const isMyStory = currentStory.userId === currentUser.id;
  const hoursRemaining = Math.max(
    1,
    Math.round((currentStory.expiresAt - Date.now()) / 3600000)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none"
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="relative w-full max-w-md h-full flex flex-col justify-between overflow-hidden bg-slate-950 sm:rounded-3xl shadow-2xl">
        {/* Story background content */}
        <div className="absolute inset-0 z-0 flex items-center justify-center">
          {currentStory.type === 'photo' && currentStory.mediaUrl ? (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center p-8 text-center text-white"
              style={{
                background:
                  currentStory.backgroundGradient ||
                  'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              }}
            >
              <p
                className="text-2xl font-bold leading-relaxed max-w-xs drop-shadow-md"
                style={{ fontStyle: currentStory.fontStyle || 'normal' }}
              >
                {currentStory.text}
              </p>
            </div>
          )}

          {/* Vignette overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
        </div>

        {/* Top Header & Segmented Progress Bar */}
        <div className="relative z-20 pt-4 px-4 space-y-3">
          {/* Segmented bar */}
          <div className="flex gap-1.5 w-full">
            {stories.map((s, idx) => (
              <div
                key={s.id}
                className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{
                    width:
                      idx < currentIndex
                        ? '100%'
                        : idx === currentIndex
                        ? `${progress}%`
                        : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* User info & actions */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <Avatar
                src={currentStory.userAvatar}
                name={currentStory.userName}
                size="sm"
              />
              <div>
                <p className="text-xs font-bold leading-none">{currentStory.userName}</p>
                <p className="text-[10px] text-white/70 flex items-center gap-1 mt-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  Expires in {hoursRemaining}h
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isMyStory && (
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full bg-black/40 hover:bg-rose-600/80 text-white transition backdrop-blur-md"
                  title="Delete story"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/40 hover:bg-white/20 text-white transition backdrop-blur-md"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tap navigation hotspots (left 30% goes back, right 70% goes forward) */}
        <div className="absolute inset-0 z-10 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Photo caption text overlay */}
        {currentStory.type === 'photo' && currentStory.text && (
          <div className="relative z-20 px-5 py-3 mb-16 text-center">
            <p className="text-sm font-medium text-white bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl inline-block shadow-lg">
              {currentStory.text}
            </p>
          </div>
        )}

        {/* Bottom controls */}
        <div className="relative z-20 pb-6 px-4">
          {sentFeedback && (
            <div className="mb-2 text-center text-xs text-emerald-400 font-semibold bg-black/60 backdrop-blur-md py-1 px-3 rounded-full w-max mx-auto animate-bounce">
              ✓ Reply sent to {currentStory.userName}!
            </div>
          )}

          {isMyStory ? (
            /* My story: See viewers drawer button */
            <button
              onClick={() => setShowViewersModal(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl text-white font-semibold text-xs transition border border-white/15"
            >
              <Eye className="w-4 h-4" />
              <span>{currentStory.views.length} Views</span>
            </button>
          ) : (
            /* Friend's story: Quick reply and reactions */
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 py-1">
                {['❤️', '🔥', '😂', '😮', '👏'].map((em) => (
                  <button
                    key={em}
                    onClick={() => handleSendReaction(em)}
                    className="text-2xl p-1 hover:scale-125 transition active:scale-95"
                  >
                    {em}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSendReply} className="flex items-center gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${currentStory.userName.split(' ')[0]}...`}
                  className="flex-1 bg-black/50 border border-white/20 rounded-full py-2.5 px-4 text-xs text-white placeholder-white/60 backdrop-blur-md focus:outline-none focus:border-indigo-400"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition shadow-lg active:scale-90"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Viewers modal drawer */}
        {showViewersModal && (
          <div className="absolute inset-0 z-30 flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in slide-in-from-bottom duration-200">
            <div className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 max-h-[60%] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Eye className="w-4 h-4 text-indigo-400" />
                  <span>Story Viewers ({currentStory.views.length})</span>
                </div>
                <button
                  onClick={() => setShowViewersModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 no-scrollbar">
                {currentStory.views.length === 0 ? (
                  <p className="text-center text-xs text-slate-500 py-6">
                    No one has viewed this story yet.
                  </p>
                ) : (
                  currentStory.views.map((v) => (
                    <div key={v.userId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Avatar src={v.userAvatar} name={v.userName} size="sm" />
                        <div>
                          <p className="text-xs font-semibold text-white">{v.userName}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(v.viewedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
