export type UserRole = 'user' | 'admin';

export type UserStatus = 'online' | 'offline' | 'away';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  statusMessage?: string;
  status: UserStatus;
  isBlocked: boolean;
  lastSeen: string;
  createdAt: string;
  ipAddress?: string;
}

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'system' | 'ai';

export type MessageStatus = 'sent' | 'delivered' | 'seen';

export interface Attachment {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  name: string;
  size?: string;
}

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  attachments?: Attachment[];
  reactions?: MessageReaction[];
  replyToId?: string;
  createdAt: string;
  isAiResponse?: boolean;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name?: string;
  avatar?: string;
  description?: string;
  participants: User[];
  participantIds: string[];
  unreadCount: Record<string, number>;
  lastMessage?: Message;
  updatedAt: string;
  createdAt: string;
  isAiChat?: boolean;
}

export interface SystemBroadcast {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'urgent';
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalConversations: number;
  totalMessages: number;
  blockedUsers: number;
  broadcastsSent: number;
  wsConnections: number;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  target?: string;
  details: string;
  timestamp: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
}

export interface CallLog {
  id: string;
  user: User;
  type: 'voice' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  duration: string;
  timestamp: string;
}

export interface StoryItem {
  id: string;
  type: 'image' | 'text';
  mediaUrl?: string;
  caption?: string;
  bgGradient?: string;
  createdAt: string;
}

export interface UserStatusStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  updatedAt: string;
  hasUnseen: boolean;
  stories: StoryItem[];
}

