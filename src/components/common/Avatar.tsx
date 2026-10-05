import React from 'react';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isOnline?: boolean;
  hasStory?: boolean;
  storyViewed?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  isOnline,
  hasStory = false,
  storyViewed = false,
  className = '',
  onClick,
}) => {
  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  };

  const badgeSizeClasses = {
    xs: 'w-2 h-2 bottom-0 right-0 border-[1.5px]',
    sm: 'w-2.5 h-2.5 bottom-0 right-0 border-2',
    md: 'w-3 h-3 bottom-0 right-0 border-2',
    lg: 'w-3.5 h-3.5 bottom-0.5 right-0.5 border-2',
    xl: 'w-4 h-4 bottom-0.5 right-0.5 border-2',
    '2xl': 'w-5 h-5 bottom-1 right-1 border-2',
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const ringClass = hasStory
    ? storyViewed
      ? 'p-0.5 rounded-full ring-2 ring-slate-400 dark:ring-slate-600'
      : 'p-0.5 rounded-full ring-2 ring-gradient bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-500'
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${ringClass} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden flex items-center justify-center font-semibold bg-gradient-to-br from-indigo-500/20 to-purple-500/30 text-indigo-400 border border-white/10`}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to initials if image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>

      {isOnline !== undefined && (
        <span
          className={`absolute rounded-full border-slate-900 ${badgeSizeClasses[size]} ${
            isOnline ? 'bg-emerald-500' : 'bg-slate-400'
          }`}
          title={isOnline ? 'Active now' : 'Offline'}
        />
      )}
    </div>
  );
};
