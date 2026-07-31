import { User, Conversation, Message, SystemBroadcast, AdminStats, AuditLog, Attachment } from '../types';

export const api = {
  // Auth REST
  login: async (email: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  signup: async (data: { name: string; email: string; avatar?: string; statusMessage?: string; role?: 'user' | 'admin' }) => {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Signup failed');
    }
    return res.json();
  },

  getDemoUsers: async (): Promise<{ users: User[] }> => {
    const res = await fetch('/api/auth/demo-users');
    return res.json();
  },

  updateProfile: async (data: { userId: string; name?: string; avatar?: string; statusMessage?: string; status?: string }) => {
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Chat REST
  getConversations: async (userId: string): Promise<{ conversations: Conversation[] }> => {
    const res = await fetch(`/api/chat/conversations/${userId}`);
    return res.json();
  },

  getMessages: async (conversationId: string): Promise<{ messages: Message[] }> => {
    const res = await fetch(`/api/chat/messages/${conversationId}`);
    return res.json();
  },

  sendMessage: async (data: { conversationId: string; senderId: string; content?: string; type?: string; attachments?: Attachment[]; replyToId?: string }): Promise<{ message: Message }> => {
    const res = await fetch('/api/chat/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  createConversation: async (data: { isGroup?: boolean; name?: string; avatar?: string; description?: string; participantIds: string[]; createdBy: string }): Promise<{ conversation: Conversation; isNew: boolean }> => {
    const res = await fetch('/api/chat/conversations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  addReaction: async (data: { messageId: string; emoji: string; userId: string; userName?: string }): Promise<{ message: Message }> => {
    const res = await fetch('/api/chat/reactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  markRead: async (conversationId: string, userId: string) => {
    const res = await fetch('/api/chat/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId, userId })
    });
    return res.json();
  },

  uploadMedia: async (data: { fileType: string; fileName: string; fileDataUrl?: string }): Promise<{ success: boolean; attachment: Attachment }> => {
    const res = await fetch('/api/chat/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // AI REST
  askAiAssistant: async (data: { prompt: string; conversationId?: string }): Promise<{ reply?: string; message?: Message }> => {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  summarizeChat: async (conversationId: string): Promise<{ summary: string }> => {
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId })
    });
    return res.json();
  },

  // Admin REST
  getAdminStats: async (): Promise<{ stats: AdminStats }> => {
    const res = await fetch('/api/admin/stats');
    return res.json();
  },

  getAdminUsers: async (adminId: string): Promise<{ users: User[] }> => {
    const res = await fetch('/api/admin/users', {
      headers: { 'x-admin-id': adminId }
    });
    return res.json();
  },

  toggleBlockUser: async (adminId: string, userId: string, isBlocked: boolean): Promise<{ user: User }> => {
    const res = await fetch('/api/admin/users/block', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-id': adminId },
      body: JSON.stringify({ userId, isBlocked })
    });
    return res.json();
  },

  sendBroadcast: async (adminId: string, title: string, content: string, type: 'info' | 'warning' | 'urgent'): Promise<{ broadcast: SystemBroadcast }> => {
    const res = await fetch('/api/admin/broadcasts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-id': adminId },
      body: JSON.stringify({ title, content, type, adminId })
    });
    return res.json();
  },

  getBroadcasts: async (): Promise<{ broadcasts: SystemBroadcast[] }> => {
    const res = await fetch('/api/admin/broadcasts');
    return res.json();
  },

  getAuditLogs: async (adminId: string): Promise<{ logs: AuditLog[] }> => {
    const res = await fetch('/api/admin/audit-logs', {
      headers: { 'x-admin-id': adminId }
    });
    return res.json();
  },

  getChatMonitoringMessages: async (adminId: string): Promise<{ messages: any[] }> => {
    const res = await fetch('/api/admin/monitoring/messages', {
      headers: { 'x-admin-id': adminId }
    });
    return res.json();
  }
};
