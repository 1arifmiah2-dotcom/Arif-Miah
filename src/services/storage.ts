import {
  User,
  Conversation,
  Message,
  Story,
  StatusNote,
  CallHistoryItem,
  NotificationItem,
  ReportItem,
  UserSettings,
} from '../types';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'aura_current_user_id',
  USERS: 'aura_users_v1',
  CONVERSATIONS: 'aura_conversations_v1',
  MESSAGES: 'aura_messages_v1',
  STORIES: 'aura_stories_v1',
  NOTES: 'aura_notes_v1',
  CALL_HISTORY: 'aura_call_history_v1',
  NOTIFICATIONS: 'aura_notifications_v1',
  REPORTS: 'aura_reports_v1',
  SETTINGS: 'aura_settings_v1',
};

// Default seed users
const INITIAL_USERS: User[] = [
  {
    id: 'user_alex',
    name: 'Alex Rivers',
    username: 'alexrivers',
    email: 'alex.rivers@aura.io',
    phone: '+1 415 555 0192',
    bio: 'Product designer & Android enthusiast 📱 Building next-gen communication.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    isOnline: true,
    lastSeen: 'Active now',
    isVerified: true,
    createdAt: Date.now() - 365 * 86400000,
    blockedUsers: [],
    privacySettings: {
      whoCanMessageMe: 'everyone',
      whoCanSeeStory: 'everyone',
      whoCanSeeOnline: 'everyone',
      whoCanSeeLastSeen: 'everyone',
      whoCanCallMe: 'everyone',
    },
    statusNote: {
      id: 'note_alex',
      userId: 'user_alex',
      text: 'Shipping Aura 1.0 today! 🚀',
      emoji: '✨',
      createdAt: Date.now() - 3600000,
      expiresAt: Date.now() + 82800000,
    },
  },
  {
    id: 'user_elena',
    name: 'Elena Rostova',
    username: 'elena_r',
    email: 'elena@aura.io',
    phone: '+1 415 555 0184',
    bio: 'Photographer & traveler 📷 Always seeking the golden hour.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    isOnline: true,
    lastSeen: 'Active now',
    isVerified: true,
    createdAt: Date.now() - 180 * 86400000,
    blockedUsers: [],
    privacySettings: {
      whoCanMessageMe: 'everyone',
      whoCanSeeStory: 'everyone',
      whoCanSeeOnline: 'everyone',
      whoCanSeeLastSeen: 'everyone',
      whoCanCallMe: 'everyone',
    },
    statusNote: {
      id: 'note_elena',
      userId: 'user_elena',
      text: 'Catching the sunset in Kyoto ⛩️',
      emoji: '🌅',
      createdAt: Date.now() - 7200000,
      expiresAt: Date.now() + 79200000,
    },
  },
  {
    id: 'user_marcus',
    name: 'Marcus Vance',
    username: 'marcus_v',
    email: 'marcus.vance@tech.co',
    phone: '+1 212 555 0148',
    bio: 'Lead Architect @ HyperScale. Coffee, code, and rock climbing 🧗‍♂️',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    isOnline: false,
    lastSeen: '14m ago',
    isVerified: false,
    createdAt: Date.now() - 220 * 86400000,
    blockedUsers: [],
    privacySettings: {
      whoCanMessageMe: 'everyone',
      whoCanSeeStory: 'contacts',
      whoCanSeeOnline: 'contacts',
      whoCanSeeLastSeen: 'contacts',
      whoCanCallMe: 'contacts',
    },
    statusNote: {
      id: 'note_marcus',
      userId: 'user_marcus',
      text: 'Deep in code refactoring 💻',
      emoji: '⚡',
      createdAt: Date.now() - 10800000,
      expiresAt: Date.now() + 75600000,
    },
  },
  {
    id: 'user_sophia',
    name: 'Sophia Patel',
    username: 'sophiap',
    email: 'sophia.patel@design.org',
    phone: '+44 20 7946 0912',
    bio: 'Visual artist & typography nerd 🎨 London / Zurich',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    isOnline: true,
    lastSeen: 'Active now',
    isVerified: true,
    createdAt: Date.now() - 90 * 86400000,
    blockedUsers: [],
    privacySettings: {
      whoCanMessageMe: 'everyone',
      whoCanSeeStory: 'everyone',
      whoCanSeeOnline: 'everyone',
      whoCanSeeLastSeen: 'everyone',
      whoCanCallMe: 'everyone',
    },
  },
  {
    id: 'user_liam',
    name: 'Liam Chen',
    username: 'liamchen',
    email: 'liam.chen@dev.io',
    phone: '+1 650 555 0199',
    bio: 'Mobile dev & audio enthusiast 🎧 Android ecosystem lover.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    isOnline: false,
    lastSeen: '2h ago',
    isVerified: false,
    createdAt: Date.now() - 120 * 86400000,
    blockedUsers: [],
    privacySettings: {
      whoCanMessageMe: 'everyone',
      whoCanSeeStory: 'everyone',
      whoCanSeeOnline: 'everyone',
      whoCanSeeLastSeen: 'everyone',
      whoCanCallMe: 'everyone',
    },
  },
];

const INITIAL_STORIES: Story[] = [
  {
    id: 'story_elena_1',
    userId: 'user_elena',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    text: 'Kyoto bamboo grove at sunrise 🎋 Serenity at its best.',
    createdAt: Date.now() - 4 * 3600000,
    expiresAt: Date.now() + 20 * 3600000,
    views: [
      {
        userId: 'user_alex',
        userName: 'Alex Rivers',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        viewedAt: Date.now() - 3600000,
      },
      {
        userId: 'user_marcus',
        userName: 'Marcus Vance',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        viewedAt: Date.now() - 1800000,
      },
    ],
    privacy: 'everyone',
  },
  {
    id: 'story_sophia_1',
    userId: 'user_sophia',
    userName: 'Sophia Patel',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    type: 'text',
    text: '“Design is not just what it looks like and feels like. Design is how it works.” ✨',
    backgroundGradient: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
    fontStyle: 'italic',
    createdAt: Date.now() - 6 * 3600000,
    expiresAt: Date.now() + 18 * 3600000,
    views: [
      {
        userId: 'user_alex',
        userName: 'Alex Rivers',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        viewedAt: Date.now() - 5 * 3600000,
      },
    ],
    privacy: 'everyone',
  },
  {
    id: 'story_marcus_1',
    userId: 'user_marcus',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    text: 'Late night sprint with the engineering squad 💻🔥',
    createdAt: Date.now() - 8 * 3600000,
    expiresAt: Date.now() + 16 * 3600000,
    views: [],
    privacy: 'everyone',
  },
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_elena',
    type: 'direct',
    participants: ['user_alex', 'user_elena'],
    unreadCount: 1,
    isPinned: true,
    isMuted: false,
    updatedAt: Date.now() - 5 * 60000,
    lastMessage: {
      id: 'msg_elena_last',
      conversationId: 'conv_elena',
      senderId: 'user_elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      text: 'Check out this shot from today! Did you get a chance to review the new designs?',
      status: 'delivered',
      reactions: { '❤️': ['user_alex'] },
      createdAt: Date.now() - 5 * 60000,
    },
  },
  {
    id: 'conv_group_product',
    type: 'group',
    name: 'Aura Core Team ⚡',
    avatar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80',
    description: 'Official channel for Aura Messenger engineering, release coordination, and product design.',
    participants: ['user_alex', 'user_elena', 'user_marcus', 'user_sophia', 'user_liam'],
    adminIds: ['user_alex', 'user_marcus'],
    unreadCount: 0,
    isPinned: true,
    isMuted: false,
    updatedAt: Date.now() - 25 * 60000,
    lastMessage: {
      id: 'msg_group_last',
      conversationId: 'conv_group_product',
      senderId: 'user_marcus',
      senderName: 'Marcus Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      text: 'WebRTC call latency benchmark tests passed with flying colors! 🚀',
      status: 'seen',
      reactions: { '🚀': ['user_alex', 'user_elena'], '🔥': ['user_sophia'] },
      createdAt: Date.now() - 25 * 60000,
    },
  },
  {
    id: 'conv_sophia',
    type: 'direct',
    participants: ['user_alex', 'user_sophia'],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    updatedAt: Date.now() - 3 * 3600000,
    lastMessage: {
      id: 'msg_sophia_last',
      conversationId: 'conv_sophia',
      senderId: 'user_alex',
      senderName: 'Alex Rivers',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      text: 'I loved your story quote. Truly inspirational! ✨',
      status: 'seen',
      reactions: { '🙏': ['user_sophia'] },
      createdAt: Date.now() - 3 * 3600000,
    },
  },
  {
    id: 'conv_liam',
    type: 'direct',
    participants: ['user_alex', 'user_liam'],
    unreadCount: 0,
    isPinned: false,
    isMuted: false,
    updatedAt: Date.now() - 24 * 3600000,
    lastMessage: {
      id: 'msg_liam_last',
      conversationId: 'conv_liam',
      senderId: 'user_liam',
      senderName: 'Liam Chen',
      senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      text: 'Sent you the audio waveform specs for the Android voice recorder player.',
      status: 'seen',
      reactions: {},
      createdAt: Date.now() - 24 * 3600000,
    },
  },
];

const INITIAL_MESSAGES: Record<string, Message[]> = {
  conv_elena: [
    {
      id: 'msg_e1',
      conversationId: 'conv_elena',
      senderId: 'user_alex',
      senderName: 'Alex Rivers',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      text: 'Hey Elena! How is the trip to Japan going?',
      status: 'seen',
      reactions: {},
      createdAt: Date.now() - 2 * 3600000,
    },
    {
      id: 'msg_e2',
      conversationId: 'conv_elena',
      senderId: 'user_elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      text: 'It is absolutely magical! I took so many photos of Kyoto shrines in the morning mist.',
      status: 'seen',
      reactions: { '✨': ['user_alex'] },
      createdAt: Date.now() - 90 * 60000,
    },
    {
      id: 'msg_e3',
      conversationId: 'conv_elena',
      senderId: 'user_elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      text: 'Here is a preview of the Torii gates!',
      media: {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
        name: 'kyoto_morning.jpg',
      },
      status: 'seen',
      reactions: { '❤️': ['user_alex'], '🔥': ['user_alex'] },
      createdAt: Date.now() - 40 * 60000,
    },
    {
      id: 'msg_e4',
      conversationId: 'conv_elena',
      senderId: 'user_alex',
      senderName: 'Alex Rivers',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      text: 'Stunning composition! Let us do a video call later so you can show me around!',
      replyTo: {
        id: 'msg_e3',
        senderName: 'Elena Rostova',
        text: 'Here is a preview of the Torii gates!',
      },
      status: 'seen',
      reactions: { '👍': ['user_elena'] },
      createdAt: Date.now() - 20 * 60000,
    },
    {
      id: 'msg_elena_last',
      conversationId: 'conv_elena',
      senderId: 'user_elena',
      senderName: 'Elena Rostova',
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      text: 'Check out this shot from today! Did you get a chance to review the new designs?',
      status: 'delivered',
      reactions: { '❤️': ['user_alex'] },
      createdAt: Date.now() - 5 * 60000,
    },
  ],
  conv_group_product: [
    {
      id: 'msg_g1',
      conversationId: 'conv_group_product',
      senderId: 'user_alex',
      senderName: 'Alex Rivers',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      text: 'Welcome team! Let us ensure all Android Play Store requirements are fully verified for release.',
      status: 'seen',
      reactions: { '👍': ['user_marcus', 'user_sophia', 'user_elena'] },
      createdAt: Date.now() - 120 * 60000,
    },
    {
      id: 'msg_g2',
      conversationId: 'conv_group_product',
      senderId: 'user_sophia',
      senderName: 'Sophia Patel',
      senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      text: 'Brand colors and Material 3 adaptive themes are locked in: Indigo & Emerald accents with crisp typography.',
      status: 'seen',
      reactions: { '🎨': ['user_alex'] },
      createdAt: Date.now() - 60 * 60000,
    },
    {
      id: 'msg_group_last',
      conversationId: 'conv_group_product',
      senderId: 'user_marcus',
      senderName: 'Marcus Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      text: 'WebRTC call latency benchmark tests passed with flying colors! 🚀',
      status: 'seen',
      reactions: { '🚀': ['user_alex', 'user_elena'], '🔥': ['user_sophia'] },
      createdAt: Date.now() - 25 * 60000,
    },
  ],
};

const INITIAL_CALL_HISTORY: CallHistoryItem[] = [
  {
    id: 'call_1',
    peerId: 'user_elena',
    peerName: 'Elena Rostova',
    peerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    type: 'video',
    direction: 'incoming',
    timestamp: Date.now() - 14 * 3600000,
    duration: 382,
  },
  {
    id: 'call_2',
    peerId: 'user_marcus',
    peerName: 'Marcus Vance',
    peerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    type: 'audio',
    direction: 'outgoing',
    timestamp: Date.now() - 28 * 3600000,
    duration: 145,
  },
  {
    id: 'call_3',
    peerId: 'user_sophia',
    peerName: 'Sophia Patel',
    peerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    type: 'video',
    direction: 'missed',
    timestamp: Date.now() - 52 * 3600000,
    duration: 0,
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'message',
    title: 'Elena Rostova',
    body: 'Sent you a photo: Check out this shot from today!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    timestamp: Date.now() - 5 * 60000,
    isRead: false,
    linkId: 'conv_elena',
  },
  {
    id: 'notif_2',
    type: 'reaction',
    title: 'Aura Core Team ⚡',
    body: 'Marcus Vance reacted 🚀 to your message',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    timestamp: Date.now() - 25 * 60000,
    isRead: false,
    linkId: 'conv_group_product',
  },
  {
    id: 'notif_3',
    type: 'story',
    title: 'New Story',
    body: 'Sophia Patel added a new status quote to her story.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    timestamp: Date.now() - 6 * 3600000,
    isRead: true,
  },
];

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep_1',
    reporterId: 'user_elena',
    reportedUserId: 'user_spam_bot',
    reportedUserName: 'CryptoFast99',
    reason: 'spam',
    details: 'Sending unsolicited automated links in group chats.',
    createdAt: Date.now() - 86400000,
    status: 'pending',
  },
];

const INITIAL_SETTINGS: UserSettings = {
  theme: 'dark',
  accentColor: 'indigo',
  soundEnabled: true,
  vibrationEnabled: true,
  notificationsEnabled: true,
  language: 'English (US)',
  dataSaver: false,
  e2eEncryptionEnabled: true,
};

class AuraStorageService {
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID)) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'user_alex');
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONVERSATIONS)) {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(INITIAL_CONVERSATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.MESSAGES)) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(INITIAL_MESSAGES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(INITIAL_STORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CALL_HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.CALL_HISTORY, JSON.stringify(INITIAL_CALL_HISTORY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(INITIAL_REPORTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
    }
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Current User
  getCurrentUser(): User {
    const users = this.getUsers();
    const id = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'user_alex';
    const found = users.find((u) => u.id === id);
    return found || users[0] || INITIAL_USERS[0];
  }

  setCurrentUserId(id: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    this.notify();
  }

  // Users
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  getUserById(id: string): User | undefined {
    return this.getUsers().find((u) => u.id === id);
  }

  updateUser(updated: Partial<User> & { id: string }) {
    const users = this.getUsers().map((u) => (u.id === updated.id ? { ...u, ...updated } : u));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.notify();
  }

  registerUser(name: string, emailOrPhone: string, username?: string): User {
    const users = this.getUsers();
    const isEmail = emailOrPhone.includes('@');
    const autoUsername = username || name.toLowerCase().replace(/[^a-z0-9]/g, '_') + '_' + Math.floor(Math.random() * 1000);

    const newUser: User = {
      id: 'user_' + Date.now(),
      name,
      username: autoUsername,
      email: isEmail ? emailOrPhone : `${autoUsername}@aura.app`,
      phone: !isEmail ? emailOrPhone : '+1 555 ' + Math.floor(1000 + Math.random() * 9000),
      bio: 'Hey there! I am using Aura Messenger ✨',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${autoUsername}`,
      isOnline: true,
      lastSeen: 'Active now',
      createdAt: Date.now(),
      blockedUsers: [],
      privacySettings: {
        whoCanMessageMe: 'everyone',
        whoCanSeeStory: 'everyone',
        whoCanSeeOnline: 'everyone',
        whoCanSeeLastSeen: 'everyone',
        whoCanCallMe: 'everyone',
      },
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUserId(newUser.id);
    return newUser;
  }

  // Conversations
  getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : INITIAL_CONVERSATIONS;
    } catch {
      return INITIAL_CONVERSATIONS;
    }
  }

  getConversation(id: string): Conversation | undefined {
    return this.getConversations().find((c) => c.id === id);
  }

  getOrCreateDirectConversation(peerId: string): Conversation {
    const currentUser = this.getCurrentUser();
    const conversations = this.getConversations();
    const existing = conversations.find(
      (c) => c.type === 'direct' && c.participants.includes(currentUser.id) && c.participants.includes(peerId)
    );

    if (existing) return existing;

    const peer = this.getUserById(peerId);
    const newConv: Conversation = {
      id: 'conv_' + Date.now(),
      type: 'direct',
      participants: [currentUser.id, peerId],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      updatedAt: Date.now(),
    };

    conversations.unshift(newConv);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    this.notify();
    return newConv;
  }

  createGroupConversation(name: string, description: string, participantIds: string[], avatar?: string): Conversation {
    const currentUser = this.getCurrentUser();
    const conversations = this.getConversations();

    const uniqueParticipants = Array.from(new Set([currentUser.id, ...participantIds]));

    const newGroup: Conversation = {
      id: 'group_' + Date.now(),
      type: 'group',
      name,
      description,
      avatar: avatar || `https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80`,
      participants: uniqueParticipants,
      adminIds: [currentUser.id],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      updatedAt: Date.now(),
    };

    conversations.unshift(newGroup);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    this.notify();
    return newGroup;
  }

  togglePinConversation(id: string) {
    const conversations = this.getConversations().map((c) =>
      c.id === id ? { ...c, isPinned: !c.isPinned } : c
    );
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    this.notify();
  }

  toggleMuteConversation(id: string) {
    const conversations = this.getConversations().map((c) =>
      c.id === id ? { ...c, isMuted: !c.isMuted } : c
    );
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    this.notify();
  }

  deleteConversation(id: string) {
    const conversations = this.getConversations().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    
    // Also remove messages
    const allMsgs = this.getAllMessages();
    delete allMsgs[id];
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMsgs));
    this.notify();
  }

  // Messages
  private getAllMessages(): Record<string, Message[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
      return data ? JSON.parse(data) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  }

  getMessages(conversationId: string): Message[] {
    const all = this.getAllMessages();
    const currentUserId = this.getCurrentUser().id;
    const msgs = all[conversationId] || [];
    // Filter out messages deleted for current user
    return msgs.filter((m) => !(m.deletedForUserIds && m.deletedForUserIds.includes(currentUserId)));
  }

  sendMessage(
    conversationId: string,
    text: string,
    media?: Message['media'],
    replyTo?: Message['replyTo']
  ): Message {
    const currentUser = this.getCurrentUser();
    const all = this.getAllMessages();
    const msgs = all[conversationId] || [];

    const newMsg: Message = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      conversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text,
      media,
      replyTo,
      status: 'sent',
      reactions: {},
      createdAt: Date.now(),
    };

    msgs.push(newMsg);
    all[conversationId] = msgs;
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));

    // Update conversation lastMessage & updatedAt
    const conversations = this.getConversations().map((c) => {
      if (c.id === conversationId) {
        return {
          ...c,
          lastMessage: newMsg,
          updatedAt: Date.now(),
        };
      }
      return c;
    });
    // Move updated conversation to top
    conversations.sort((a, b) => b.updatedAt - a.updatedAt);
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));

    this.notify();

    // Trigger simulated peer response if chatting with a demo user
    this.triggerSimulatedPeerReply(conversationId, newMsg);

    return newMsg;
  }

  private triggerSimulatedPeerReply(conversationId: string, userMsg: Message) {
    const conv = this.getConversation(conversationId);
    if (!conv) return;

    const currentUserId = this.getCurrentUser().id;
    // Find recipient
    const otherParticipantId = conv.participants.find((p) => p !== currentUserId);
    if (!otherParticipantId) return;

    const peer = this.getUserById(otherParticipantId);
    if (!peer || !peer.isOnline) return;

    // Simulate typing indicator
    setTimeout(() => {
      this.setTypingIndicator(conversationId, peer.id, true);
    }, 1200);

    // Simulate response after 2.8s
    setTimeout(() => {
      this.setTypingIndicator(conversationId, peer.id, false);

      const replies = [
        "That's awesome! Loving how fast Aura feels 🔥",
        "Got it! Let me know if you need anything else on this.",
        "Totally agree with you! Let's connect soon.",
        "Check this out! Everything looks super smooth and polished.",
        "Nice! The Android UI animations and haptics look stunning.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const all = this.getAllMessages();
      const msgs = all[conversationId] || [];

      const peerMsg: Message = {
        id: 'msg_peer_' + Date.now(),
        conversationId,
        senderId: peer.id,
        senderName: peer.name,
        senderAvatar: peer.avatar,
        text: randomReply,
        status: 'delivered',
        reactions: {},
        createdAt: Date.now(),
      };

      msgs.push(peerMsg);
      all[conversationId] = msgs;
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));

      // Mark user message as seen
      userMsg.status = 'seen';

      // Update conversation
      const conversations = this.getConversations().map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: peerMsg,
            unreadCount: c.unreadCount + 1,
            updatedAt: Date.now(),
          };
        }
        return c;
      });
      conversations.sort((a, b) => b.updatedAt - a.updatedAt);
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));

      // Add in-app notification
      this.addNotification({
        type: 'message',
        title: peer.name,
        body: randomReply,
        avatar: peer.avatar,
        linkId: conversationId,
      });

      this.notify();
    }, 3200);
  }

  setTypingIndicator(conversationId: string, userId: string, isTyping: boolean) {
    const conversations = this.getConversations().map((c) => {
      if (c.id === conversationId) {
        const current = c.typingUsers || [];
        const next = isTyping
          ? Array.from(new Set([...current, userId]))
          : current.filter((u) => u !== userId);
        return { ...c, typingUsers: next };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    this.notify();
  }

  reactToMessage(conversationId: string, messageId: string, emoji: string) {
    const currentUser = this.getCurrentUser();
    const all = this.getAllMessages();
    const msgs = all[conversationId] || [];

    const msg = msgs.find((m) => m.id === messageId);
    if (!msg) return;

    if (!msg.reactions) msg.reactions = {};
    if (!msg.reactions[emoji]) msg.reactions[emoji] = [];

    const userList = msg.reactions[emoji];
    const index = userList.indexOf(currentUser.id);
    if (index > -1) {
      userList.splice(index, 1);
      if (userList.length === 0) delete msg.reactions[emoji];
    } else {
      userList.push(currentUser.id);
    }

    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    this.notify();
  }

  editMessage(conversationId: string, messageId: string, newText: string) {
    const all = this.getAllMessages();
    const msgs = all[conversationId] || [];
    const msg = msgs.find((m) => m.id === messageId);
    if (!msg) return;

    msg.text = newText;
    msg.isEdited = true;

    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));

    // Update conversation preview if it was the last message
    const conversations = this.getConversations().map((c) => {
      if (c.id === conversationId && c.lastMessage?.id === messageId) {
        return { ...c, lastMessage: { ...c.lastMessage, text: newText, isEdited: true } };
      }
      return c;
    });
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));

    this.notify();
  }

  deleteMessage(conversationId: string, messageId: string, forEveryone: boolean) {
    const currentUser = this.getCurrentUser();
    const all = this.getAllMessages();
    const msgs = all[conversationId] || [];
    const msg = msgs.find((m) => m.id === messageId);
    if (!msg) return;

    if (forEveryone) {
      msg.isDeletedForEveryone = true;
      msg.text = 'This message was deleted';
      msg.media = undefined;
    } else {
      if (!msg.deletedForUserIds) msg.deletedForUserIds = [];
      msg.deletedForUserIds.push(currentUser.id);
    }

    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(all));
    this.notify();
  }

  markConversationRead(conversationId: string) {
    const conversations = this.getConversations().map((c) =>
      c.id === conversationId ? { ...c, unreadCount: 0 } : c
    );
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    this.notify();
  }

  // Stories
  getStories(): Story[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STORIES);
      const stories: Story[] = data ? JSON.parse(data) : INITIAL_STORIES;
      // Filter expired (older than 24h)
      const now = Date.now();
      return stories.filter((s) => s.expiresAt > now);
    } catch {
      return INITIAL_STORIES;
    }
  }

  addStory(
    type: Story['type'],
    mediaUrl?: string,
    text?: string,
    backgroundGradient?: string,
    privacy: Story['privacy'] = 'everyone'
  ): Story {
    const currentUser = this.getCurrentUser();
    const stories = this.getStories();

    const newStory: Story = {
      id: 'story_' + Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      type,
      mediaUrl,
      text,
      backgroundGradient,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 3600000, // 24 hours expiry
      views: [],
      privacy,
    };

    stories.unshift(newStory);
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
    this.notify();
    return newStory;
  }

  viewStory(storyId: string) {
    const currentUser = this.getCurrentUser();
    const stories = this.getStories();
    const story = stories.find((s) => s.id === storyId);
    if (!story || story.userId === currentUser.id) return;

    if (!story.views.some((v) => v.userId === currentUser.id)) {
      story.views.push({
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        viewedAt: Date.now(),
      });
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
      this.notify();
    }
  }

  deleteStory(storyId: string) {
    const stories = this.getStories().filter((s) => s.id !== storyId);
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
    this.notify();
  }

  // Status Notes (24h)
  setStatusNote(text: string, emoji: string) {
    const currentUser = this.getCurrentUser();
    const newNote: StatusNote = {
      id: 'note_' + Date.now(),
      userId: currentUser.id,
      text,
      emoji,
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 3600000,
    };

    this.updateUser({ id: currentUser.id, statusNote: newNote });
  }

  deleteStatusNote() {
    const currentUser = this.getCurrentUser();
    this.updateUser({ id: currentUser.id, statusNote: undefined });
  }

  // Calls
  getCallHistory(): CallHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CALL_HISTORY);
      return data ? JSON.parse(data) : INITIAL_CALL_HISTORY;
    } catch {
      return INITIAL_CALL_HISTORY;
    }
  }

  addCallHistoryItem(call: Omit<CallHistoryItem, 'id'>) {
    const list = this.getCallHistory();
    const item: CallHistoryItem = {
      ...call,
      id: 'call_' + Date.now(),
    };
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.CALL_HISTORY, JSON.stringify(list));
    this.notify();
  }

  // Notifications
  getNotifications(): NotificationItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  addNotification(notif: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) {
    const list = this.getNotifications();
    const item: NotificationItem = {
      ...notif,
      id: 'notif_' + Date.now(),
      timestamp: Date.now(),
      isRead: false,
    };
    list.unshift(item);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.notify();
  }

  markAllNotificationsRead() {
    const list = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(list));
    this.notify();
  }

  // Privacy & Safety
  blockUser(targetUserId: string) {
    const currentUser = this.getCurrentUser();
    if (!currentUser.blockedUsers.includes(targetUserId)) {
      const next = [...currentUser.blockedUsers, targetUserId];
      this.updateUser({ id: currentUser.id, blockedUsers: next });
    }
  }

  unblockUser(targetUserId: string) {
    const currentUser = this.getCurrentUser();
    const next = currentUser.blockedUsers.filter((id) => id !== targetUserId);
    this.updateUser({ id: currentUser.id, blockedUsers: next });
  }

  reportUser(reportedUserId: string, reason: ReportItem['reason'], details?: string) {
    const currentUser = this.getCurrentUser();
    const reportedUser = this.getUserById(reportedUserId);
    const reports = this.getReports();

    const report: ReportItem = {
      id: 'rep_' + Date.now(),
      reporterId: currentUser.id,
      reportedUserId,
      reportedUserName: reportedUser?.name || 'Unknown User',
      reason,
      details,
      createdAt: Date.now(),
      status: 'pending',
    };

    reports.unshift(report);
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    this.notify();
    return report;
  }

  getReports(): ReportItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REPORTS);
      return data ? JSON.parse(data) : INITIAL_REPORTS;
    } catch {
      return INITIAL_REPORTS;
    }
  }

  resolveReport(reportId: string, status: 'resolved' | 'dismissed') {
    const reports = this.getReports().map((r) => (r.id === reportId ? { ...r, status } : r));
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    this.notify();
  }

  // Settings
  getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  updateSettings(partial: Partial<UserSettings>) {
    const current = this.getSettings();
    const updated = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    this.notify();
  }

  // Reset to demo defaults
  resetAllData() {
    localStorage.clear();
    this.init();
    this.notify();
  }
}

export const auraStorage = new AuraStorageService();
