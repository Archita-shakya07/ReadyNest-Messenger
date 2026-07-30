import { User, Conversation, Message, SystemBroadcast, AdminStats, AuditLog } from '../src/types/index.js';

// Seed Users
const initialUsers: User[] = [
  {
    id: 'user-admin',
    name: 'Archit Shakya (Admin)',
    email: 'admin@readynest.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'admin',
    statusMessage: '👑 ReadyNest Administrator | Monitoring system health',
    status: 'online',
    isBlocked: false,
    lastSeen: new Date().toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.100'
  },
  {
    id: 'user-ai',
    name: 'ReadyNest AI Assistant',
    email: 'ai@readynest.com',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    statusMessage: '⚡ AI-Powered Smart Chat Companion',
    status: 'online',
    isBlocked: false,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-sarah',
    name: 'Sarah Jenkins',
    email: 'sarah@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    statusMessage: '✨ Product Designer @ NestTech',
    status: 'online',
    isBlocked: false,
    lastSeen: new Date().toISOString(),
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.102'
  },
  {
    id: 'user-alex',
    name: 'Alex Rivera',
    email: 'alex@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    statusMessage: '💻 Full-Stack Engineer | Building scalable APIs',
    status: 'online',
    isBlocked: false,
    lastSeen: new Date().toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.103'
  },
  {
    id: 'user-priya',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'user',
    statusMessage: '🚀 Growth & Operations Lead',
    status: 'away',
    isBlocked: false,
    lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    ipAddress: '192.168.1.104'
  }
];

// Seed Conversations
const initialConversations: Conversation[] = [
  {
    id: 'conv-ai',
    isGroup: false,
    participants: [initialUsers[0], initialUsers[1]], // Admin + AI
    participantIds: ['user-admin', 'user-ai'],
    unreadCount: { 'user-admin': 0 },
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    isAiChat: true
  },
  {
    id: 'conv-sarah',
    isGroup: false,
    participants: [initialUsers[0], initialUsers[2]], // Admin + Sarah
    participantIds: ['user-admin', 'user-sarah'],
    unreadCount: { 'user-admin': 0 },
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'conv-dev-team',
    isGroup: true,
    name: '🚀 ReadyNest Core Devs',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    description: 'Official developer channel for architecture & releases',
    participants: [initialUsers[0], initialUsers[2], initialUsers[3], initialUsers[4]],
    participantIds: ['user-admin', 'user-sarah', 'user-alex', 'user-priya'],
    unreadCount: { 'user-admin': 1 },
    updatedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Seed Messages
const initialMessages: Message[] = [
  // AI Conversation messages
  {
    id: 'msg-ai-1',
    conversationId: 'conv-ai',
    senderId: 'user-ai',
    senderName: 'ReadyNest AI Assistant',
    senderAvatar: initialUsers[1].avatar,
    content: 'Hello! 👋 I am your built-in AI Assistant powered by Gemini 3.6 Flash. I can help you draft messages, summarize chats, write code snippets, or answer any question right here in Ready Nest Messenger!',
    type: 'ai',
    status: 'seen',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    isAiResponse: true
  },
  // Sarah Conversation
  {
    id: 'msg-sarah-1',
    conversationId: 'conv-sarah',
    senderId: 'user-sarah',
    senderName: 'Sarah Jenkins',
    senderAvatar: initialUsers[2].avatar,
    content: 'Hey Archit! Did you check out the new dark mode color palette for the desktop view?',
    type: 'text',
    status: 'seen',
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-sarah-2',
    conversationId: 'conv-sarah',
    senderId: 'user-admin',
    senderName: 'Archit Shakya (Admin)',
    senderAvatar: initialUsers[0].avatar,
    content: 'Yes! The contrast ratios look crisp and pass WCAG AA standards. Also added WebSockets for sub-100ms message delivery.',
    type: 'text',
    status: 'seen',
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-sarah-3',
    conversationId: 'conv-sarah',
    senderId: 'user-sarah',
    senderName: 'Sarah Jenkins',
    senderAvatar: initialUsers[2].avatar,
    content: 'Awesome! Here is the mockup screenshot of the multi-pane desktop workspace:',
    type: 'image',
    status: 'seen',
    attachments: [
      {
        id: 'att-1',
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        name: 'desktop_view_mockup.png',
        size: '1.2 MB'
      }
    ],
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  // Group Conversation
  {
    id: 'msg-group-1',
    conversationId: 'conv-dev-team',
    senderId: 'user-alex',
    senderName: 'Alex Rivera',
    senderAvatar: initialUsers[3].avatar,
    content: 'Express REST server & WebSockets state synchronization are live on port 3000! All WebSocket frames are handling typing indicators and read receipts.',
    type: 'text',
    status: 'seen',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-group-2',
    conversationId: 'conv-dev-team',
    senderId: 'user-priya',
    senderName: 'Priya Sharma',
    senderAvatar: initialUsers[4].avatar,
    content: 'Admin panel user management and system broadcasts are also working smoothly. Great work team! 🚀',
    type: 'text',
    status: 'delivered',
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  }
];

// Seed Broadcasts
const initialBroadcasts: SystemBroadcast[] = [
  {
    id: 'bcast-1',
    title: '⚡ Welcome to Ready Nest Messenger v2.5',
    content: 'Real-time WebSockets, Admin Moderation, and Gemini AI Chat Assistant are fully operational!',
    type: 'info',
    createdBy: 'user-admin',
    createdByName: 'Archit Shakya (Admin)',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

// Seed Audit Logs
const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    action: 'SYSTEM_BOOT',
    actorId: 'system',
    actorName: 'Express Core Server',
    details: 'Initialized WebSocket engine & HTTP routes on port 3000',
    timestamp: new Date().toISOString()
  },
  {
    id: 'log-2',
    action: 'USER_LOGIN',
    actorId: 'user-admin',
    actorName: 'Archit Shakya (Admin)',
    details: 'Logged in successfully with admin privileges',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  }
];

// In-Memory Database Store
class MemoryDatabase {
  private users: User[] = [...initialUsers];
  private conversations: Conversation[] = [...initialConversations];
  private messages: Message[] = [...initialMessages];
  private broadcasts: SystemBroadcast[] = [...initialBroadcasts];
  private auditLogs: AuditLog[] = [...initialAuditLogs];

  // User Methods
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user: User): User {
    this.users.push(user);
    this.addAuditLog('USER_REGISTER', user.id, user.name, `New user registered: ${user.email}`);
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return this.users[index];
    }
    return undefined;
  }

  setUserBlocked(id: string, isBlocked: boolean): User | undefined {
    const user = this.updateUser(id, { isBlocked });
    if (user) {
      this.addAuditLog('USER_MODERATION', 'user-admin', 'Admin', `User ${user.name} (${user.id}) was ${isBlocked ? 'BLOCKED' : 'UNBLOCKED'}`);
    }
    return user;
  }

  // Conversation Methods
  getConversationsForUser(userId: string): Conversation[] {
    if (userId !== 'user-ai') {
      let aiConv = this.conversations.find(
        c => (c.isAiChat || c.participantIds.includes('user-ai')) && c.participantIds.includes(userId)
      );
      if (!aiConv) {
        const user = this.getUserById(userId);
        const aiUser = this.getUserById('user-ai');
        if (user && aiUser) {
          aiConv = {
            id: `conv-ai-${userId}`,
            isGroup: false,
            participants: [user, aiUser],
            participantIds: [userId, 'user-ai'],
            unreadCount: { [userId]: 0, 'user-ai': 0 },
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            isAiChat: true
          };
          this.conversations.unshift(aiConv);

          // Add welcome message for this AI conversation
          this.addMessage({
            id: `msg-ai-welcome-${userId}`,
            conversationId: aiConv.id,
            senderId: 'user-ai',
            senderName: 'ReadyNest AI Assistant',
            senderAvatar: aiUser.avatar,
            content: 'Hello! 👋 I am your built-in AI Assistant powered by Gemini 3.6 Flash. Ask me anything, draft messages, or request code snippets!',
            type: 'ai',
            status: 'seen',
            createdAt: new Date().toISOString(),
            isAiResponse: true
          });
        }
      } else if (!aiConv.isAiChat) {
        aiConv.isAiChat = true;
      }
    }
    return this.conversations.filter(c => c.participantIds.includes(userId));
  }

  getConversationById(id: string): Conversation | undefined {
    return this.conversations.find(c => c.id === id);
  }

  createConversation(conv: Conversation): Conversation {
    this.conversations.unshift(conv);
    return conv;
  }

  updateConversationLastMessage(convId: string, message: Message) {
    const conv = this.getConversationById(convId);
    if (conv) {
      conv.lastMessage = message;
      conv.updatedAt = message.createdAt;
      // Increment unread count for other participants
      conv.participantIds.forEach(pid => {
        if (pid !== message.senderId) {
          conv.unreadCount[pid] = (conv.unreadCount[pid] || 0) + 1;
        }
      });
    }
  }

  clearUnreadCount(convId: string, userId: string) {
    const conv = this.getConversationById(convId);
    if (conv && conv.unreadCount) {
      conv.unreadCount[userId] = 0;
    }
  }

  // Message Methods
  getMessagesForConversation(convId: string): Message[] {
    return this.messages.filter(m => m.conversationId === convId);
  }

  addMessage(message: Message): Message {
    this.messages.push(message);
    this.updateConversationLastMessage(message.conversationId, message);
    return message;
  }

  markMessagesAsSeen(convId: string, readerUserId: string): string[] {
    const updatedMessageIds: string[] = [];
    this.messages.forEach(m => {
      if (m.conversationId === convId && m.senderId !== readerUserId && m.status !== 'seen') {
        m.status = 'seen';
        updatedMessageIds.push(m.id);
      }
    });
    this.clearUnreadCount(convId, readerUserId);
    return updatedMessageIds;
  }

  addReaction(messageId: string, emoji: string, userId: string, userName: string): Message | undefined {
    const msg = this.messages.find(m => m.id === messageId);
    if (msg) {
      if (!msg.reactions) msg.reactions = [];
      const existing = msg.reactions.findIndex(r => r.userId === userId && r.emoji === emoji);
      if (existing !== -1) {
        msg.reactions.splice(existing, 1); // Toggle off
      } else {
        msg.reactions.push({ emoji, userId, userName });
      }
      return msg;
    }
    return undefined;
  }

  // Broadcast Methods
  getBroadcasts(): SystemBroadcast[] {
    return this.broadcasts;
  }

  addBroadcast(bcast: SystemBroadcast): SystemBroadcast {
    this.broadcasts.unshift(bcast);
    this.addAuditLog('SYSTEM_BROADCAST', bcast.createdBy, bcast.createdByName, `Broadcast created: ${bcast.title}`);
    return bcast;
  }

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return this.auditLogs;
  }

  addAuditLog(action: string, actorId: string, actorName: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      actorId,
      actorName,
      details,
      timestamp: new Date().toISOString()
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) this.auditLogs.pop();
  }

  // Admin Stats
  getAdminStats(activeWsCount: number): AdminStats {
    return {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.status === 'online').length,
      totalConversations: this.conversations.length,
      totalMessages: this.messages.length,
      blockedUsers: this.users.filter(u => u.isBlocked).length,
      broadcastsSent: this.broadcasts.length,
      wsConnections: activeWsCount
    };
  }
}

export const db = new MemoryDatabase();
