import React, { useState, useEffect } from 'react';
import {
  NavigationTab,
  CallSession,
  User,
  Conversation,
  Story,
} from './types';
import { auraStorage } from './services/storage';

// Common Components
import { AndroidFrame } from './components/common/AndroidFrame';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PWAInstallBanner } from './components/common/PWAInstallBanner';

// Navigation Components
import { TopBar } from './components/navigation/TopBar';
import { BottomNav } from './components/navigation/BottomNav';

// Home & Messaging Components
import { StoriesBar } from './components/home/StoriesBar';
import { NotesModal } from './components/home/NotesModal';
import { ConversationList } from './components/home/ConversationList';
import { ChatView } from './components/chat/ChatView';

// Stories Components
import { StoryViewer } from './components/stories/StoryViewer';
import { StoryCreatorModal } from './components/stories/StoryCreatorModal';

// Calling Components
import { CallModal } from './components/calls/CallModal';
import { CallsTab } from './components/calls/CallsTab';

// Contacts & Groups Components
import { ContactsTab } from './components/contacts/ContactsTab';
import { GroupCreateModal } from './components/contacts/GroupCreateModal';

// Settings & Admin
import { SettingsTab } from './components/settings/SettingsTab';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileEditModal } from './components/profile/ProfileEditModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { AdminPanelModal } from './components/admin/AdminPanelModal';
import { DownloadModal } from './components/download/DownloadModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => auraStorage.getCurrentUser());
  const [users, setUsers] = useState<User[]>(() => auraStorage.getUsers());
  const [conversations, setConversations] = useState<Conversation[]>(() =>
    auraStorage.getConversations()
  );
  const [stories, setStories] = useState<Story[]>(() => auraStorage.getStories());

  const [currentTab, setCurrentTab] = useState<NavigationTab>('chats');
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Modals state
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(true);
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isGroupCreateOpen, setIsGroupCreateOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);

  // Active Call Session
  const [callSession, setCallSession] = useState<CallSession | null>(null);

  // Sync state with storage
  const syncData = () => {
    setCurrentUser(auraStorage.getCurrentUser());
    setUsers(auraStorage.getUsers());
    setConversations(auraStorage.getConversations());
    setStories(auraStorage.getStories());
  };

  useEffect(() => {
    syncData();
    const unsubscribe = auraStorage.subscribe(syncData);
    return () => {
      unsubscribe();
    };
  }, []);

  // Total unread counters
  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadStoriesCount = stories.filter(
    (s) => s.userId !== currentUser.id && !s.views.some((v) => v.userId === currentUser.id)
  ).length;

  const handleStartCall = (
    peerId: string,
    peerName: string,
    peerAvatar: string,
    type: 'audio' | 'video'
  ) => {
    setCallSession({
      id: 'call_' + Date.now(),
      peerId,
      peerName,
      peerAvatar,
      type,
      direction: 'outgoing',
      status: 'ringing',
    });
  };

  const handleTriggerSimulatedIncomingCall = () => {
    const elena = users.find((u) => u.id === 'user_elena') || users[1] || users[0];
    setCallSession({
      id: 'call_inbound_' + Date.now(),
      peerId: elena.id,
      peerName: elena.name,
      peerAvatar: elena.avatar,
      type: 'video',
      direction: 'incoming',
      status: 'ringing',
    });
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleStartDirectChat = (userId: string) => {
    const conv = auraStorage.getOrCreateDirectConversation(userId);
    setActiveConversationId(conv.id);
  };

  return (
    <AndroidFrame theme={auraStorage.getSettings().theme}>
      {/* Offline Status indicator */}
      <OfflineIndicator />

      {/* Main Screen Layout */}
      {activeConversationId ? (
        /* Fullscreen Chat View */
        <ChatView
          conversationId={activeConversationId}
          currentUser={currentUser}
          users={users}
          onBack={() => setActiveConversationId(null)}
          onStartCall={handleStartCall}
          onOpenUserProfile={(uid) => setSelectedProfileUserId(uid)}
        />
      ) : (
        /* Standard Navigation Views */
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
          {/* Top Bar */}
          <TopBar
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenAdmin={() => setIsAdminPanelOpen(true)}
            onOpenDownload={() => setIsDownloadModalOpen(true)}
            onSearchClick={() => setCurrentTab('chats')}
            onSelectConversation={handleSelectConversation}
          />

          {/* PWA Install Banner */}
          <PWAInstallBanner onOpenDownload={() => setIsDownloadModalOpen(true)} />

          {/* Main Tab Screen Area */}
          <main className="flex-1 flex flex-col overflow-hidden relative">
            {currentTab === 'chats' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* 24h Stories Bar */}
                <StoriesBar
                  currentUser={currentUser}
                  stories={stories}
                  onOpenCreateStory={() => setIsCreateStoryOpen(true)}
                  onOpenStory={(id) => setActiveStoryId(id)}
                  onOpenNotesModal={() => setIsNotesModalOpen(true)}
                />

                {/* Conversation List */}
                <ConversationList
                  conversations={conversations}
                  currentUser={currentUser}
                  users={users}
                  onSelectConversation={handleSelectConversation}
                  onOpenNewMessage={() => setCurrentTab('contacts')}
                  onOpenNewGroup={() => setIsGroupCreateOpen(true)}
                />
              </div>
            )}

            {currentTab === 'calls' && (
              <CallsTab
                currentUser={currentUser}
                onStartCall={handleStartCall}
                onTriggerSimulatedIncomingCall={handleTriggerSimulatedIncomingCall}
              />
            )}

            {currentTab === 'stories' && (
              <div className="flex-1 flex flex-col overflow-hidden p-3 select-none">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
                  <div>
                    <h2 className="text-base font-bold text-white">Stories & Moments</h2>
                    <p className="text-[11px] text-slate-400">Photos, videos, and status notes (24h)</p>
                  </div>
                  <button
                    onClick={() => setIsCreateStoryOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition"
                  >
                    + Add Story
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
                  {/* Notes summary */}
                  <div
                    onClick={() => setIsNotesModalOpen(true)}
                    className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currentUser.statusNote?.emoji || '💭'}</span>
                      <div>
                        <span className="text-xs font-bold text-white block">Your Status Note</span>
                        <p className="text-[11px] text-slate-400">
                          {currentUser.statusNote?.text || 'Tap to share what is on your mind'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-indigo-400 font-medium">Edit</span>
                  </div>

                  {/* Stories list */}
                  <span className="text-xs font-semibold text-slate-400 block pt-1">
                    Recent Stories ({stories.length})
                  </span>

                  <div className="grid grid-cols-2 gap-2.5">
                    {stories.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setActiveStoryId(s.id)}
                        className="relative h-44 rounded-2xl overflow-hidden cursor-pointer border border-slate-800/80 group hover:border-indigo-500/50 transition shadow-lg"
                      >
                        {s.type === 'photo' && s.mediaUrl ? (
                          <img
                            src={s.mediaUrl}
                            alt="Story"
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div
                            className="w-full h-full p-4 flex items-center justify-center text-center text-white font-bold text-xs"
                            style={{
                              background:
                                s.backgroundGradient ||
                                'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                            }}
                          >
                            <span className="line-clamp-4">{s.text}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
                        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                          <span className="text-xs font-semibold truncate">{s.userName}</span>
                          <span className="text-[10px] opacity-75">{s.views.length} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentTab === 'contacts' && (
              <ContactsTab
                currentUser={currentUser}
                users={users}
                onStartChat={handleStartDirectChat}
                onStartCall={handleStartCall}
                onOpenUserProfile={(uid) => setSelectedProfileUserId(uid)}
                onOpenNewGroup={() => setIsGroupCreateOpen(true)}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsTab
                currentUser={currentUser}
                onOpenEditProfile={() => setIsEditProfileOpen(true)}
                onOpenAuth={() => setIsAuthModalOpen(true)}
                onOpenAdmin={() => setIsAdminPanelOpen(true)}
                onOpenDownload={() => setIsDownloadModalOpen(true)}
              />
            )}
          </main>

          {/* Android Bottom Navigation Bar */}
          <BottomNav
            currentTab={currentTab}
            onTabChange={(tab) => setCurrentTab(tab)}
            unreadMessagesCount={totalUnreadMessages}
            unreadStoriesCount={unreadStoriesCount}
          />
        </div>
      )}

      {/* Global Interactive Modals */}
      {/* 0. Download & Install Center Modal */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />

      {/* 1. Immersive Story Viewer */}
      {activeStoryId && (
        <StoryViewer
          initialStoryId={activeStoryId}
          currentUser={currentUser}
          onClose={() => setActiveStoryId(null)}
          onSendStoryReply={(userId, text) => {
            const conv = auraStorage.getOrCreateDirectConversation(userId);
            auraStorage.sendMessage(conv.id, text);
          }}
        />
      )}

      {/* 2. Story Creator */}
      <StoryCreatorModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
      />

      {/* 3. Status Notes Creator */}
      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        currentUser={currentUser}
      />

      {/* 4. Auth & Switch User Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
      />

      {/* 5. Edit Profile Modal */}
      <ProfileEditModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
      />

      {/* 6. View User Profile Modal */}
      <UserProfileModal
        userId={selectedProfileUserId}
        currentUser={currentUser}
        onClose={() => setSelectedProfileUserId(null)}
        onStartChat={handleStartDirectChat}
        onStartCall={handleStartCall}
      />

      {/* 7. Create Group Modal */}
      <GroupCreateModal
        isOpen={isGroupCreateOpen}
        onClose={() => setIsGroupCreateOpen(false)}
        currentUser={currentUser}
        users={users}
        onGroupCreated={(gid) => setActiveConversationId(gid)}
      />

      {/* 8. Admin Moderation Panel */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentUser={currentUser}
      />

      {/* 9. Live Voice & Video Call Screen */}
      {callSession && (
        <CallModal
          session={callSession}
          currentUser={currentUser}
          onEndCall={() => setCallSession(null)}
        />
      )}
    </AndroidFrame>
  );
}
