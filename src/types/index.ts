export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  isVerified?: boolean;
  createdAt: number;
  blockedUsers: string[];
  statusNote?: StatusNote;
  privacySettings: PrivacySettings;
}

export interface StatusNote {
  id: string;
  userId: string;
  text: string;
  emoji: string;
  createdAt: number;
  expiresAt: number;
}

export interface StoryView {
  userId: string;
  userName: string;
  userAvatar: string;
  viewedAt: number;
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'photo' | 'video' | 'text';
  mediaUrl?: string;
  text?: string;
  backgroundGradient?: string;
  fontStyle?: string;
  createdAt: number;
  expiresAt: number;
  views: StoryView[];
  privacy: 'everyone' | 'contacts' | 'close_friends';
}

export interface MessageMedia {
  type: 'image' | 'video' | 'audio' | 'file';
  url: string;
  name?: string;
  duration?: number;
  size?: number;
  waveform?: number[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  media?: MessageMedia;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  status: 'sending' | 'sent' | 'delivered' | 'seen';
  reactions: Record<string, string[]>; // emoji -> array of userIds
  isEdited?: boolean;
  isDeletedForEveryone?: boolean;
  deletedForUserIds?: string[];
  createdAt: number;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string; // used for group
  avatar?: string;
  description?: string;
  participants: string[]; // user IDs
  adminIds?: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  typingUsers?: string[];
  updatedAt: number;
}

export interface CallSession {
  id: string;
  peerId: string;
  peerName: string;
  peerAvatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing';
  status: 'ringing' | 'connected' | 'ended' | 'missed' | 'rejected';
  startedAt?: number;
  durationSeconds?: number;
}

export interface CallHistoryItem {
  id: string;
  peerId: string;
  peerName: string;
  peerAvatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: number;
  duration: number;
}

export interface NotificationItem {
  id: string;
  type: 'message' | 'call' | 'reaction' | 'story' | 'friend_request' | 'group';
  title: string;
  body: string;
  avatar?: string;
  timestamp: number;
  isRead: boolean;
  linkId?: string;
}

export interface ReportItem {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: 'spam' | 'harassment' | 'inappropriate_content' | 'impersonation' | 'other';
  details?: string;
  createdAt: number;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface PrivacySettings {
  whoCanMessageMe: 'everyone' | 'contacts';
  whoCanSeeStory: 'everyone' | 'contacts' | 'close_friends';
  whoCanSeeOnline: 'everyone' | 'contacts' | 'nobody';
  whoCanSeeLastSeen: 'everyone' | 'contacts' | 'nobody';
  whoCanCallMe: 'everyone' | 'contacts' | 'nobody';
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system';
  accentColor: 'indigo' | 'emerald' | 'violet' | 'rose' | 'amber';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationsEnabled: boolean;
  language: string;
  dataSaver: boolean;
  e2eEncryptionEnabled: boolean;
}

export type NavigationTab = 'chats' | 'calls' | 'stories' | 'contacts' | 'settings';
