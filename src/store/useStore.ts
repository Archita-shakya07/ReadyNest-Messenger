import { create } from 'zustand';
import { User, UserStatus, Conversation, Message, SystemBroadcast, Attachment, CallLog, UserStatusStory, StoryItem } from '../types';
import { ThemeId, THEMES } from '../types/theme';
import { api } from '../services/api';
import { socketService } from '../services/socketService';

export type ViewMode = 'chat' | 'calls' | 'status' | 'admin' | 'specs' | 'settings';

export interface CallSession {
  callId?: string;
  type: 'voice' | 'video';
  user: User;
  status: 'outgoing' | 'connected' | 'ended';
  conversationId?: string;
}

export interface IncomingCallSession {
  callId: string;
  type: 'voice' | 'video';
  caller: User;
  conversationId?: string;
}

interface AppState {
  // Auth
  currentUser: User | null;
  token: string | null;
  authPageMode: 'landing' | 'signin' | 'signup';
  setAuthPageMode: (mode: 'landing' | 'signin' | 'signup') => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  setCurrentUser: (user: User | null, token?: string) => void;
  updateProfile: (updates: { name?: string; avatar?: string; statusMessage?: string; status?: UserStatus }) => Promise<void>;
  logout: () => void;

  // Theme & Navigation
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  isThemeModalOpen: boolean;
  setThemeModalOpen: (open: boolean) => void;

  // View
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isInfoDrawerOpen: boolean;
  setInfoDrawerOpen: (open: boolean) => void;

  // Calls & Status
  callLogs: CallLog[];
  addCallLog: (log: Omit<CallLog, 'id' | 'timestamp'>) => void;
  clearCallLogs: () => void;

  statusStories: UserStatusStory[];
  myStories: StoryItem[];
  addMyStory: (story: Omit<StoryItem, 'id' | 'createdAt'>) => void;
  markStorySeen: (storyUserId: string) => void;
  activeStoryModal: UserStatusStory | null;
  setActiveStoryModal: (story: UserStatusStory | null) => void;


  // Conversations & Messages
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterTab: 'all' | 'unread' | 'groups' | 'ai';
  setFilterTab: (tab: 'all' | 'unread' | 'groups' | 'ai') => void;
  setActiveConversation: (id: string | null) => Promise<void>;
  openAiChat: () => Promise<void>;
  loadConversations: () => Promise<void>;
  sendMessage: (content: string, type?: string, attachments?: Attachment[], replyToId?: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;

  // Real-time State
  typingUsers: Record<string, string>; // `${conversationId}` -> string of typing names
  onlineUsers: Record<string, string>;
  activeCallModal: CallSession | null;
  incomingCall: IncomingCallSession | null;
  setActiveCallModal: (call: CallSession | null) => void;
  startCall: (type: 'voice' | 'video', targetUser: User, conversationId?: string) => void;
  acceptIncomingCall: () => void;
  rejectIncomingCall: () => void;
  endActiveCall: () => void;
  previewMedia: Attachment | null;
  setPreviewMedia: (media: Attachment | null) => void;
  isNewGroupModalOpen: boolean;
  setNewGroupModalOpen: (open: boolean) => void;
  isNewChatModalOpen: boolean;
  setNewChatModalOpen: (open: boolean) => void;

  // Broadcasts
  broadcasts: SystemBroadcast[];
  activeBroadcastBanner: SystemBroadcast | null;
  dismissBroadcastBanner: () => void;
  loadBroadcasts: () => Promise<void>;

  // Socket setup
  initSocketListeners: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  token: null,
  authPageMode: 'landing',
  setAuthPageMode: (mode) => set({ authPageMode: mode }),
  isAuthModalOpen: false,
  setAuthModalOpen: (open) => set({ isAuthModalOpen: open, authPageMode: open ? 'signin' : 'landing' }),

  setCurrentUser: (user, token) => {
    set({
      currentUser: user,
      token: token || get().token,
      isAuthModalOpen: false,
      authPageMode: 'landing',
      viewMode: user?.role === 'admin' ? 'admin' : 'chat'
    });
    if (user) {
      localStorage.setItem('readynest_user', JSON.stringify(user));
      if (token) localStorage.setItem('readynest_token', token);
      socketService.connect(user.id);
      get().loadConversations();
      get().loadBroadcasts();
    }
  },

  updateProfile: async (updates) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updates };
    set({ currentUser: updatedUser });
    localStorage.setItem('readynest_user', JSON.stringify(updatedUser));

    // Optimistically update conversations and messages in state
    set((s) => ({
      conversations: s.conversations.map((c) => ({
        ...c,
        participants: c.participants.map((p) =>
          p.id === currentUser.id ? { ...p, ...updates } : p
        ),
      })),
      messages: s.messages.map((m) =>
        m.senderId === currentUser.id
          ? {
              ...m,
              senderAvatar: updates.avatar || m.senderAvatar,
              senderName: updates.name || m.senderName,
            }
          : m
      ),
      statusStories: s.statusStories.map((st) =>
        st.userId === currentUser.id
          ? {
              ...st,
              userName: updates.name || st.userName,
              userAvatar: updates.avatar || st.userAvatar,
            }
          : st
      ),
    }));

    try {
      await api.updateProfile({
        userId: currentUser.id,
        ...updates,
      });
    } catch (e) {
      console.warn('REST updateProfile error:', e);
    }

    if (socketService.getIsConnected()) {
      socketService.send('user:update_profile', {
        userId: currentUser.id,
        ...updates,
      });
    }
  },

  logout: () => {
    socketService.disconnect();
    localStorage.removeItem('readynest_user');
    localStorage.removeItem('readynest_token');
    set({
      currentUser: null,
      token: null,
      conversations: [],
      messages: [],
      activeConversationId: null,
      authPageMode: 'landing',
      isAuthModalOpen: false,
      viewMode: 'chat'
    });
  },

  // Theme State
  theme: (localStorage.getItem('readynest_theme') as ThemeId) || 'emerald',
  setTheme: (theme: ThemeId) => {
    localStorage.setItem('readynest_theme', theme);
    set({ theme });
  },
  isThemeModalOpen: false,
  setThemeModalOpen: (open: boolean) => set({ isThemeModalOpen: open }),

  // View & Mode
  viewMode: 'chat',
  setViewMode: (mode) => set({ viewMode: mode }),
  isDarkMode: localStorage.getItem('readynest_dark_mode') === 'true',
  toggleDarkMode: () => {
    const next = !get().isDarkMode;
    localStorage.setItem('readynest_dark_mode', String(next));
    set({ isDarkMode: next });
    if (next) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  isInfoDrawerOpen: true,
  setInfoDrawerOpen: (open) => set({ isInfoDrawerOpen: open }),

  // Call Logs & Status Stories State
  callLogs: [],

  addCallLog: (log) => {
    const newLog: CallLog = {
      ...log,
      id: `call-${Date.now()}`,
      timestamp: 'Just now'
    };
    set((s) => ({ callLogs: [newLog, ...s.callLogs] }));
  },

  clearCallLogs: () => set({ callLogs: [] }),

  statusStories: [],

  myStories: [],

  addMyStory: (story) => {
    const newItem: StoryItem = {
      ...story,
      id: `st-my-${Date.now()}`,
      createdAt: 'Just now'
    };
    const { currentUser } = get();
    set((s) => {
      const updatedMyStories = [newItem, ...s.myStories];
      let myStoryIndex = s.statusStories.findIndex((st) => st.userId === currentUser?.id);
      let updatedStatusStories = [...s.statusStories];

      if (myStoryIndex >= 0) {
        updatedStatusStories[myStoryIndex] = {
          ...updatedStatusStories[myStoryIndex],
          updatedAt: 'Just now',
          stories: [newItem, ...updatedStatusStories[myStoryIndex].stories]
        };
      } else if (currentUser) {
        updatedStatusStories.unshift({
          id: `story-${currentUser.id}`,
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          updatedAt: 'Just now',
          hasUnseen: false,
          stories: [newItem]
        });
      }

      return {
        myStories: updatedMyStories,
        statusStories: updatedStatusStories
      };
    });
  },

  markStorySeen: (storyUserId) => {
    set((s) => ({
      statusStories: s.statusStories.map((st) =>
        st.userId === storyUserId ? { ...st, hasUnseen: false } : st
      )
    }));
  },

  activeStoryModal: null,
  setActiveStoryModal: (story) => set({ activeStoryModal: story }),


  // Conversations & Messages
  conversations: [],
  activeConversationId: null,
  messages: [],
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  filterTab: 'all',
  setFilterTab: (filterTab) => set({ filterTab }),

  loadConversations: async () => {
    const { currentUser } = get();
    if (!currentUser) return;
    try {
      const { conversations } = await api.getConversations(currentUser.id);
      set({ conversations });

      // Auto select first conversation if none selected
      if (!get().activeConversationId && conversations.length > 0) {
        get().setActiveConversation(conversations[0].id);
      }
    } catch (e) {
      console.error('Error loading conversations:', e);
    }
  },

  setActiveConversation: async (id) => {
    set({ activeConversationId: id });
    if (!id) {
      set({ messages: [] });
      return;
    }

    const { currentUser } = get();
    if (currentUser) {
      try {
        const { messages } = await api.getMessages(id);
        const uniqueMessages = Array.from(new Map(messages.map((m) => [m.id, m])).values());
        set({ messages: uniqueMessages });
        // Mark as read
        await api.markRead(id, currentUser.id);
        socketService.sendSeen(id, currentUser.id);
        get().loadConversations();
      } catch (e) {
        console.error('Error setting active conversation:', e);
      }
    }
  },

  openAiChat: async () => {
    const { currentUser } = get();
    if (!currentUser) return;

    set({ viewMode: 'chat', filterTab: 'all' });

    let convs = get().conversations;
    let aiConv = convs.find((c) => c.isAiChat || c.participantIds.includes('user-ai'));

    if (!aiConv) {
      try {
        const res = await api.createConversation({
          isGroup: false,
          participantIds: [currentUser.id, 'user-ai'],
          createdBy: currentUser.id
        });
        if (res.conversation) {
          aiConv = res.conversation;
        }
        await get().loadConversations();
        convs = get().conversations;
        aiConv = convs.find((c) => c.isAiChat || c.participantIds.includes('user-ai')) || aiConv;
      } catch (e) {
        console.error('Error creating/finding AI conversation:', e);
      }
    }

    if (aiConv) {
      await get().setActiveConversation(aiConv.id);
    }
  },

  sendMessage: async (content, type = 'text', attachments, replyToId) => {
    const { currentUser, activeConversationId } = get();
    if (!currentUser || !activeConversationId) return;

    const tempMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId: activeConversationId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: content || '',
      type: (type as any) || 'text',
      status: 'sent',
      attachments,
      replyToId,
      createdAt: new Date().toISOString()
    };

    // Optimistically update local state immediately so message appears instantly
    set((s) => ({
      messages: [...s.messages.filter(m => m.id !== tempMessage.id), tempMessage]
    }));

    // Send over WebSocket for real-time delivery if connected, otherwise fallback to REST
    if (socketService.getIsConnected()) {
      socketService.sendMessage(activeConversationId, currentUser.id, content, type, attachments, replyToId);
    } else {
      try {
        await api.sendMessage({
          conversationId: activeConversationId,
          senderId: currentUser.id,
          content,
          type,
          attachments,
          replyToId
        });
      } catch (e) {
        console.warn('REST sendMessage error:', e);
      }
    }

    // If sending in AI conversation and socket is offline, also invoke AI Assistant API
    const activeConv = get().conversations.find(c => c.id === activeConversationId);
    if (activeConv && (activeConv.isAiChat || activeConv.participantIds.includes('user-ai'))) {
      if (!socketService.getIsConnected()) {
        try {
          await api.askAiAssistant({ prompt: content, conversationId: activeConversationId });
          const { messages } = await api.getMessages(activeConversationId);
          set((s) => {
            const map = new Map();
            s.messages.forEach((m) => map.set(m.id, m));
            messages.forEach((m) => map.set(m.id, m));
            return { messages: Array.from(map.values()) };
          });
        } catch (err) {
          console.error('AI chat REST fallback error:', err);
        }
      }
    }

    get().loadConversations();
  },

  addReaction: async (messageId, emoji) => {
    const { currentUser } = get();
    if (!currentUser) return;
    socketService.sendReaction(messageId, emoji, currentUser.id, currentUser.name);
  },

  // Real-time State
  typingUsers: {},
  onlineUsers: {},
  activeCallModal: null,
  incomingCall: null,
  setActiveCallModal: (call) => set({ activeCallModal: call }),

  startCall: (type, targetUser, conversationId) => {
    const { currentUser } = get();
    if (!currentUser) return;

    const callId = `call-${Date.now()}`;
    const isAi = targetUser.id === 'user-ai' || targetUser.role === 'admin' && targetUser.email === 'ai@readynest.app';

    const newSession: CallSession = {
      callId,
      type,
      user: targetUser,
      status: isAi ? 'connected' : 'outgoing',
      conversationId
    };

    set({ activeCallModal: newSession });

    socketService.send('call:start', {
      callId,
      caller: currentUser,
      receiverId: targetUser.id,
      type,
      conversationId
    });

    get().addCallLog({
      user: targetUser,
      type,
      direction: 'outgoing',
      duration: isAi ? '00:01' : 'Ringing...'
    });

    if (isAi) {
      setTimeout(() => {
        set((s) => s.activeCallModal ? { activeCallModal: { ...s.activeCallModal, status: 'connected' } } : {});
      }, 800);
    }
  },

  acceptIncomingCall: () => {
    const { incomingCall, currentUser } = get();
    if (!incomingCall) return;

    const activeSession: CallSession = {
      callId: incomingCall.callId,
      type: incomingCall.type,
      user: incomingCall.caller,
      status: 'connected',
      conversationId: incomingCall.conversationId
    };

    set({
      incomingCall: null,
      activeCallModal: activeSession
    });

    socketService.send('call:accept', {
      callId: incomingCall.callId,
      callerId: incomingCall.caller.id,
      receiverId: currentUser?.id,
      type: incomingCall.type
    });

    get().addCallLog({
      user: incomingCall.caller,
      type: incomingCall.type,
      direction: 'incoming',
      duration: '00:01'
    });
  },

  rejectIncomingCall: () => {
    const { incomingCall, currentUser } = get();
    if (!incomingCall) return;

    socketService.send('call:decline', {
      callId: incomingCall.callId,
      callerId: incomingCall.caller.id,
      receiverId: currentUser?.id
    });

    get().addCallLog({
      user: incomingCall.caller,
      type: incomingCall.type,
      direction: 'missed',
      duration: '00:00'
    });

    set({ incomingCall: null });
  },

  endActiveCall: () => {
    const { activeCallModal, currentUser } = get();
    if (!activeCallModal) return;

    socketService.send('call:end', {
      callId: activeCallModal.callId,
      callerId: currentUser?.id,
      receiverId: activeCallModal.user.id
    });

    set({ activeCallModal: null });
  },
  previewMedia: null,
  setPreviewMedia: (media) => set({ previewMedia: media }),
  isNewGroupModalOpen: false,
  setNewGroupModalOpen: (open) => set({ isNewGroupModalOpen: open }),
  isNewChatModalOpen: false,
  setNewChatModalOpen: (open) => set({ isNewChatModalOpen: open }),

  // Broadcasts
  broadcasts: [],
  activeBroadcastBanner: null,
  dismissBroadcastBanner: () => set({ activeBroadcastBanner: null }),

  loadBroadcasts: async () => {
    try {
      const { broadcasts } = await api.getBroadcasts();
      set({ broadcasts });
    } catch (e) {
      console.error('Failed to load broadcasts:', e);
    }
  },

  // Socket Events Dispatcher
  initSocketListeners: () => {
    socketService.subscribe((data) => {
      const { event, payload } = data;
      const state = get();

      switch (event) {
        case 'message:new': {
          const { message, conversationId } = payload;
          if (state.activeConversationId === conversationId) {
            set((s) => {
              const exists = s.messages.some((m) => m.id === message.id);
              if (exists) {
                return {
                  messages: s.messages.map((m) => (m.id === message.id ? message : m)),
                };
              }
              // Replace optimistic temp message if found
              const tempIndex = s.messages.findIndex(
                (m) =>
                  m.id.startsWith('msg-') &&
                  m.senderId === message.senderId &&
                  m.content === message.content &&
                  m.id !== message.id
              );
              if (tempIndex !== -1) {
                const updated = [...s.messages];
                updated[tempIndex] = message;
                return { messages: updated };
              }
              return { messages: [...s.messages, message] };
            });
            if (state.currentUser && message.senderId !== state.currentUser.id) {
              socketService.sendSeen(conversationId, state.currentUser.id);
            }
          }
          state.loadConversations();
          break;
        }

        case 'message:typing': {
          const { conversationId, userId, isTyping } = payload;
          set((s) => {
            const next = { ...s.typingUsers };
            if (isTyping) {
              const user = s.conversations.flatMap(c => c.participants).find(p => p.id === userId);
              next[conversationId] = user ? user.name : 'Someone';
            } else {
              delete next[conversationId];
            }
            return { typingUsers: next };
          });
          break;
        }

        case 'message:seen': {
          const { conversationId, messageIds } = payload;
          if (state.activeConversationId === conversationId) {
            set((s) => ({
              messages: s.messages.map((m) =>
                messageIds.includes(m.id) ? { ...m, status: 'seen' } : m
              ),
            }));
          }
          break;
        }

        case 'message:updated': {
          const { message } = payload;
          if (state.activeConversationId === message.conversationId) {
            set((s) => ({
              messages: s.messages.map((m) => (m.id === message.id ? message : m)),
            }));
          }
          break;
        }

        case 'user:status': {
          const { userId, status } = payload;
          set((s) => ({
            onlineUsers: { ...s.onlineUsers, [userId]: status },
          }));
          break;
        }

        case 'user:profile_updated': {
          const { user: updatedUser } = payload;
          if (updatedUser && updatedUser.id) {
            set((s) => {
              const isSelf = s.currentUser?.id === updatedUser.id;
              const nextUser = isSelf ? { ...s.currentUser, ...updatedUser } : s.currentUser;
              if (isSelf && nextUser) {
                localStorage.setItem('readynest_user', JSON.stringify(nextUser));
              }

              return {
                currentUser: nextUser,
                conversations: s.conversations.map((c) => ({
                  ...c,
                  participants: c.participants.map((p) =>
                    p.id === updatedUser.id ? { ...p, ...updatedUser } : p
                  ),
                })),
                messages: s.messages.map((m) =>
                  m.senderId === updatedUser.id
                    ? {
                        ...m,
                        senderAvatar: updatedUser.avatar || m.senderAvatar,
                        senderName: updatedUser.name || m.senderName,
                      }
                    : m
                ),
                statusStories: s.statusStories.map((st) =>
                  st.userId === updatedUser.id
                    ? {
                        ...st,
                        userName: updatedUser.name || st.userName,
                        userAvatar: updatedUser.avatar || st.userAvatar,
                      }
                    : st
                ),
              };
            });
          }
          break;
        }

        case 'broadcast:system': {
          set({ activeBroadcastBanner: payload });
          get().loadBroadcasts();
          break;
        }

        case 'call:incoming': {
          const { callId, caller, receiverId, type, conversationId } = payload;
          if (get().currentUser?.id === receiverId) {
            set({
              incomingCall: {
                callId,
                type,
                caller,
                conversationId
              }
            });
          }
          break;
        }

        case 'call:accepted': {
          const { callId } = payload;
          set((s) => {
            if (s.activeCallModal && (s.activeCallModal.callId === callId || s.activeCallModal.status === 'outgoing')) {
              return {
                activeCallModal: {
                  ...s.activeCallModal,
                  status: 'connected'
                }
              };
            }
            return {};
          });
          break;
        }

        case 'call:declined': {
          set((s) => {
            if (s.activeCallModal) {
              return {
                activeCallModal: {
                  ...s.activeCallModal,
                  status: 'ended'
                }
              };
            }
            return {};
          });
          setTimeout(() => {
            set({ activeCallModal: null });
          }, 1500);
          break;
        }

        case 'call:ended': {
          set({ activeCallModal: null, incomingCall: null });
          break;
        }
      }
    });
  },
}));
