import React from 'react';
import { User, Story } from '../../types';
import { Avatar } from '../common/Avatar';
import { Plus, Sparkles } from 'lucide-react';

interface StoriesBarProps {
  currentUser: User;
  stories: Story[];
  onOpenCreateStory: () => void;
  onOpenStory: (storyId: string) => void;
  onOpenNotesModal: () => void;
}

export const StoriesBar: React.FC<StoriesBarProps> = ({
  currentUser,
  stories,
  onOpenCreateStory,
  onOpenStory,
  onOpenNotesModal,
}) => {
  // Group stories by user (excluding current user's stories for the friends list)
  const myStories = stories.filter((s) => s.userId === currentUser.id);
  const otherStoriesByUser = stories
    .filter((s) => s.userId !== currentUser.id)
    .reduce<Record<string, Story[]>>((acc, story) => {
      if (!acc[story.userId]) acc[story.userId] = [];
      acc[story.userId].push(story);
      return acc;
    }, {});

  const currentNote = currentUser.statusNote;

  return (
    <div className="w-full py-3 px-3 overflow-x-auto no-scrollbar border-b border-slate-800/60 bg-slate-950/40 select-none">
      <div className="flex items-start gap-3.5 min-w-max">
        {/* Item 1: My Profile Story / Status Note */}
        <div className="flex flex-col items-center gap-1.5 w-16 relative">
          {/* Note Bubble (if active) */}
          <div
            onClick={onOpenNotesModal}
            className="group relative cursor-pointer active:scale-95 transition"
            title="Update Status Note (24h)"
          >
            {currentNote ? (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-slate-800/95 border border-indigo-500/40 text-white rounded-full px-2 py-0.5 shadow-lg flex items-center gap-1 max-w-[85px] truncate">
                <span className="text-xs">{currentNote.emoji}</span>
                <span className="text-[10px] font-medium truncate">{currentNote.text}</span>
              </div>
            ) : (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 opacity-80 group-hover:opacity-100 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-full px-1.5 py-0.2 shadow flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                <span className="text-[9px]">Note</span>
              </div>
            )}

            <div className="relative mt-2">
              <Avatar
                src={currentUser.avatar}
                name={currentUser.name}
                size="lg"
                hasStory={myStories.length > 0}
                storyViewed={false}
                onClick={myStories.length > 0 ? () => onOpenStory(myStories[0].id) : onOpenCreateStory}
              />

              {/* Add Story (+) button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCreateStory();
                }}
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-indigo-600 border-2 border-slate-950 flex items-center justify-center text-white hover:bg-indigo-500 shadow-md transition active:scale-90"
                title="Add Story"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>

          <span className="text-[11px] text-slate-300 font-medium truncate w-full text-center">
            {myStories.length > 0 ? 'Your Story' : 'Add Story'}
          </span>
        </div>

        {/* Other Users' Stories */}
        {Object.entries(otherStoriesByUser).map(([userId, userStories]) => {
          const firstStory = userStories[0];
          const hasUnseen = userStories.some(
            (s) => !s.views.some((v) => v.userId === currentUser.id)
          );

          return (
            <div
              key={userId}
              onClick={() => onOpenStory(firstStory.id)}
              className="flex flex-col items-center gap-1.5 w-16 cursor-pointer group active:scale-95 transition"
            >
              <div className="relative mt-2">
                <Avatar
                  src={firstStory.userAvatar}
                  name={firstStory.userName}
                  size="lg"
                  hasStory={true}
                  storyViewed={!hasUnseen}
                />
              </div>

              <span className="text-[11px] text-slate-300 font-medium truncate w-full text-center group-hover:text-white">
                {firstStory.userName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
