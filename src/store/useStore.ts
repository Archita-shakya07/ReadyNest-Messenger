import { create } from 'zustand';
import { User, Conversation, Message, SystemBroadcast, Attachment, CallLog, UserStatusStory, StoryItem } from '../types';
import { ThemeId, THEMES } from '../types/theme';
import { api } from '../services/api';
import { socketService } from '../services/socketService';

export type ViewMode = 'chat' | 'calls' | 'status' | 'admin' | 'specs' | 'settings';

interface AppState {
  // Auth
  currentUser: User | null;
  token: string | null;
  authPageMode: 'landing' | 'signin' | 'signup';
  setAuthPageMode: (mode: 'landing' | 'signin' | 'signup') => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  setCurrentUser: (user: User | null, token?: string) => void;
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
  loadConversations: () => Promise<void>;
  sendMessage: (content: string, type?: string, attachments?: Attachment[], replyToId?: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;

  // Real-time State
  typingUsers: Record<string, string>; // `${conversationId}` -> string of typing names
  onlineUsers: Record<string, string>;
  activeCallModal: { type: 'voice' | 'video'; user: User } | null;
  setActiveCallModal: (call: { type: 'voice' | 'video'; user: User } | null) => void;
  previewMedia: Attachment | null;
  setPreviewMedia: (media: Attachment | null) => void;
  isNewGroupModalOpen: boolean;
  setNewGroupModalOpen: (open: boolean) => void;

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
    set({ currentUser: user, token: token || get().token, isAuthModalOpen: false, authPageMode: 'landing' });
    if (user) {
      localStorage.setItem('readynest_user', JSON.stringify(user));
      if (token) localStorage.setItem('readynest_token', token);
      socketService.connect(user.id);
      get().loadConversations();
      get().loadBroadcasts();
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
  callLogs: [
    {
      id: 'call-1',
      user: {
        id: 'user-aanya',
        name: 'Aanya Sharma',
        email: 'aanya@readynest.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        statusMessage: '✨ ReadyNest Mobile App Dev',
        status: 'online',
        isBlocked: false,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      type: 'video',
      direction: 'incoming',
      duration: '14m 20s',
      timestamp: 'Today, 10:15 AM'
    },
    {
      id: 'call-2',
      user: {
        id: 'user-rohan',
        name: 'Rohan Mehta',
        email: 'rohan@readynest.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        statusMessage: '💻 Backend & WebSockets Lead',
        status: 'online',
        isBlocked: false,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      type: 'voice',
      direction: 'outgoing',
      duration: '03m 45s',
      timestamp: 'Today, 09:30 AM'
    },
    {
      id: 'call-3',
      user: {
        id: 'user-priya',
        name: 'Priya Patel',
        email: 'priya@readynest.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        statusMessage: '🎨 Product Design & UI/UX',
        status: 'away',
        isBlocked: false,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      type: 'video',
      direction: 'missed',
      duration: 'Missed Call',
      timestamp: 'Yesterday, 06:40 PM'
    },
    {
      id: 'call-4',
      user: {
        id: 'user-aanya',
        name: 'Aanya Sharma',
        email: 'aanya@readynest.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'user',
        statusMessage: '✨ ReadyNest Mobile App Dev',
        status: 'online',
        isBlocked: false,
        lastSeen: new Date().toISOString(),
        createdAt: new Date().toISOString()
      },
      type: 'voice',
      direction: 'incoming',
      duration: '08m 12s',
      timestamp: 'Yesterday, 02:15 PM'
    }
  ],

  addCallLog: (log) => {
    const newLog: CallLog = {
      ...log,
      id: `call-${Date.now()}`,
      timestamp: 'Just now'
    };
    set((s) => ({ callLogs: [newLog, ...s.callLogs] }));
  },

  clearCallLogs: () => set({ callLogs: [] }),

  statusStories: [
    {
      id: 'story-aanya',
      userId: 'user-aanya',
      userName: 'Aanya Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      updatedAt: '12 minutes ago',
      hasUnseen: true,
      stories: [
        {
          id: 'st-aanya-1',
          type: 'text',
          caption: '🚀 ReadyNest Messenger v2.5 update is live! Check out real-time audio and status stories!',
          bgGradient: 'from-emerald-600 via-teal-700 to-slate-900',
          createdAt: '12m ago'
        },
        {
          id: 'st-aanya-2',
          type: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
          caption: 'Team sprint sync at HQ! ☕💻',
          createdAt: '10m ago'
        }
      ]
    },
    {
      id: 'story-rohan',
      userId: 'user-rohan',
      userName: 'Rohan Mehta',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      updatedAt: '45 minutes ago',
      hasUnseen: true,
      stories: [
        {
          id: 'st-rohan-1',
          type: 'image',
          mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
          caption: 'Building sub-10ms latency WebSocket pipelines! ⚡',
          createdAt: '45m ago'
        }
      ]
    },
    {
      id: 'story-priya',
      userId: 'user-priya',
      userName: 'Priya Patel',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      updatedAt: '2 hours ago',
      hasUnseen: false,
      stories: [
        {
          id: 'st-priya-1',
          type: 'text',
          caption: '🎨 Designing the dark mode color palette for ReadyNest UI',
          bgGradient: 'from-purple-600 via-indigo-700 to-slate-950',
          createdAt: '2h ago'
        }
      ]
    }
  ],

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

  sendMessage: async (content, type = 'text', attachments, replyToId) => {
    const { currentUser, activeConversationId } = get();
    if (!currentUser || !activeConversationId) return;

    // Send over WebSocket for sub-100ms speed
    socketService.sendMessage(activeConversationId, currentUser.id, content, type, attachments, replyToId);

    // If sending in AI conversation, also invoke AI Assistant API if socket is offline
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
  setActiveCallModal: (call) => set({ activeCallModal: call }),
  previewMedia: null,
  setPreviewMedia: (media) => set({ previewMedia: media }),
  isNewGroupModalOpen: false,
  setNewGroupModalOpen: (open) => set({ isNewGroupModalOpen: open }),

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

        case 'broadcast:system': {
          set({ activeBroadcastBanner: payload });
          get().loadBroadcasts();
          break;
        }
      }
    });
  },
}));
