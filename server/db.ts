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

    // Automatically create 1-on-1 conversations with all existing registered non-AI users
    this.users.forEach(otherUser => {
      if (otherUser.id !== user.id && otherUser.id !== 'user-ai') {
        const convId = `conv-${[user.id, otherUser.id].sort().join('-')}`;
        const existing = this.conversations.find(c => c.id === convId);
        if (!existing) {
          this.conversations.unshift({
            id: convId,
            isGroup: false,
            participants: [user, otherUser],
            participantIds: [user.id, otherUser.id],
            unreadCount: { [user.id]: 0, [otherUser.id]: 0 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      }
    });

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
    const currentUser = this.getUserById(userId);
    if (currentUser && userId !== 'user-ai') {
      let aiConv = this.conversations.find(
        c => (c.isAiChat || c.participantIds.includes('user-ai')) && c.participantIds.includes(userId)
      );
      if (!aiConv) {
        const aiUser = this.getUserById('user-ai');
        if (aiUser) {
          aiConv = {
            id: `conv-ai-${userId}`,
            isGroup: false,
            participants: [currentUser, aiUser],
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

      // Ensure 1-on-1 conversations exist for all active registered users
      this.users.forEach(otherUser => {
        if (otherUser.id !== userId && otherUser.id !== 'user-ai' && !otherUser.isBlocked) {
          const convId = `conv-${[userId, otherUser.id].sort().join('-')}`;
          const existing = this.conversations.find(
            c => c.id === convId || (!c.isGroup && c.participantIds.includes(userId) && c.participantIds.includes(otherUser.id))
          );
          if (!existing) {
            this.conversations.push({
              id: convId,
              isGroup: false,
              participants: [currentUser, otherUser],
              participantIds: [userId, otherUser.id],
              unreadCount: { [userId]: 0, [otherUser.id]: 0 },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        }
      });
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
