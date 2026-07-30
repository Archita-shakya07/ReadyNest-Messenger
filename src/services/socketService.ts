import { Message, SystemBroadcast, TypingIndicator } from '../types';

type MessageCallback = (data: { event: string; payload: any }) => void;

class SocketService {
  private ws: WebSocket | null = null;
  private listeners: Set<MessageCallback> = new Set();
  private isConnected: boolean = false;
  private reconnectTimer: any = null;
  private currentUserId: string | null = null;

  connect(userId: string) {
    this.currentUserId = userId;
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.send('auth', { userId });
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.isConnected = true;
      console.log('⚡ Connected to Ready Nest WebSocket server');
      this.send('auth', { userId });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.listeners.forEach(cb => cb(data));
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e);
      }
    };

    this.ws.onclose = () => {
      this.isConnected = false;
      console.log('WebSocket connection closed. Attempting auto-reconnect...');
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.currentUserId) {
        this.connect(this.currentUserId);
      }
    }, 3000);
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  send(event: string, payload: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ event, payload }));
    }
  }

  sendMessage(conversationId: string, senderId: string, content: string, type: string = 'text', attachments?: any[], replyToId?: string) {
    this.send('message:send', { conversationId, senderId, content, type, attachments, replyToId });
  }

  sendTyping(conversationId: string, userId: string, isTyping: boolean) {
    this.send('message:typing', { conversationId, userId, isTyping });
  }

  sendSeen(conversationId: string, userId: string) {
    this.send('message:seen', { conversationId, userId });
  }

  sendReaction(messageId: string, emoji: string, userId: string, userName: string) {
    this.send('message:react', { messageId, emoji, userId, userName });
  }

  subscribe(callback: MessageCallback) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  getIsConnected() {
    return this.isConnected;
  }
}

export const socketService = new SocketService();
