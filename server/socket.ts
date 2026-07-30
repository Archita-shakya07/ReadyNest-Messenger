import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { db } from './db.js';
import { Message, SystemBroadcast } from '../src/types/index.js';
import { getAiClient, generateSmartAiReply } from './aiHelper.js';

interface ExtendedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
}

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  const activeSockets = new Map<string, Set<ExtendedWebSocket>>();

  const broadcastToUser = (userId: string, data: any) => {
    const userSockets = activeSockets.get(userId);
    if (userSockets) {
      const payload = JSON.stringify(data);
      userSockets.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    }
  };

  const broadcastToAll = (data: any) => {
    const payload = JSON.stringify(data);
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  };

  // Expose for Express routes
  (global as any).broadcastToAllSockets = broadcastToAll;
  (global as any).activeWsClientsCount = 0;

  // Heartbeat ping interval
  const pingInterval = setInterval(() => {
    (global as any).activeWsClientsCount = wss.clients.size;
    wss.clients.forEach((ws: ExtendedWebSocket) => {
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(pingInterval);
  });

  wss.on('connection', (ws: ExtendedWebSocket) => {
    ws.isAlive = true;

    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', (messageRaw: string) => {
      try {
        const message = JSON.parse(messageRaw.toString());
        const { event, payload } = message;

        switch (event) {
          case 'auth': {
            const { userId } = payload;
            if (userId) {
              ws.userId = userId;
              if (!activeSockets.has(userId)) {
                activeSockets.set(userId, new Set());
              }
              activeSockets.get(userId)!.add(ws);

              // Update online status
              db.updateUser(userId, { status: 'online', lastSeen: new Date().toISOString() });
              
              // Broadcast user status update
              broadcastToAll({
                event: 'user:status',
                payload: { userId, status: 'online', lastSeen: new Date().toISOString() }
              });

              // Confirm auth
              ws.send(JSON.stringify({
                event: 'auth:success',
                payload: { userId, status: 'authenticated' }
              }));
            }
            break;
          }

          case 'message:send': {
            const { conversationId, senderId, content, type, attachments, replyToId } = payload;
            const sender = db.getUserById(senderId);

            if (!sender) break;
            if (sender.isBlocked) {
              ws.send(JSON.stringify({
                event: 'error',
                payload: { message: 'Your account is blocked by an Administrator.' }
              }));
              break;
            }

            const newMessage: Message = {
              id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
              conversationId,
              senderId,
              senderName: sender.name,
              senderAvatar: sender.avatar,
              content: content || '',
              type: type || 'text',
              status: 'sent',
              attachments,
              replyToId,
              createdAt: new Date().toISOString()
            };

            db.addMessage(newMessage);

            const conv = db.getConversationById(conversationId);
            if (conv) {
              // Send message to all participants in conversation
              conv.participantIds.forEach(pid => {
                broadcastToUser(pid, {
                  event: 'message:new',
                  payload: { message: newMessage, conversationId }
                });
              });

              // If conversation is with AI Assistant and sender is human, generate AI response
              if ((conv.isAiChat || conv.participantIds.includes('user-ai')) && senderId !== 'user-ai') {
                // Broadcast AI typing status
                conv.participantIds.forEach(pid => {
                  broadcastToUser(pid, {
                    event: 'message:typing',
                    payload: { conversationId, userId: 'user-ai', isTyping: true }
                  });
                });

                // Generate response asynchronously
                setTimeout(async () => {
                  let replyText = '';
                  const aiClient = getAiClient();
                  if (aiClient) {
                    try {
                      const response = await aiClient.models.generateContent({
                        model: 'gemini-3.6-flash',
                        contents: content || 'Hello AI',
                        config: {
                          systemInstruction: `You are 'ReadyNest AI Assistant', an intelligent, helpful, and friendly AI chatbot integrated inside Ready Nest Messenger platform built by Archit Shakya. 
Answer concisely, concisely formatted with markdown, emojis, code snippets where applicable, and maintain a warm, professional tone. 
Keep answers readable for chat screens.`,
                        },
                      });
                      replyText = response.text || generateSmartAiReply(content || '');
                    } catch (genErr: any) {
                      console.warn('WebSocket Gemini generateContent failed, using smart fallback:', genErr?.message || genErr);
                      replyText = generateSmartAiReply(content || '');
                    }
                  } else {
                    replyText = generateSmartAiReply(content || '');
                  }

                  // Stop typing
                  conv.participantIds.forEach(pid => {
                    broadcastToUser(pid, {
                      event: 'message:typing',
                      payload: { conversationId, userId: 'user-ai', isTyping: false }
                    });
                  });

                  // Add AI message to DB
                  const aiUser = db.getUserById('user-ai');
                  const aiMsg: Message = {
                    id: `msg-ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
                    conversationId,
                    senderId: 'user-ai',
                    senderName: 'ReadyNest AI Assistant',
                    senderAvatar: aiUser?.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
                    content: replyText,
                    type: 'ai',
                    status: 'seen',
                    createdAt: new Date().toISOString(),
                    isAiResponse: true
                  };
                  db.addMessage(aiMsg);

                  // Broadcast AI message
                  conv.participantIds.forEach(pid => {
                    broadcastToUser(pid, {
                      event: 'message:new',
                      payload: { message: aiMsg, conversationId }
                    });
                  });
                }, 600);
              }
            }
            break;
          }

          case 'message:typing': {
            const { conversationId, userId, isTyping } = payload;
            const conv = db.getConversationById(conversationId);
            if (conv) {
              conv.participantIds.forEach(pid => {
                if (pid !== userId) {
                  broadcastToUser(pid, {
                    event: 'message:typing',
                    payload: { conversationId, userId, isTyping }
                  });
                }
              });
            }
            break;
          }

          case 'message:seen': {
            const { conversationId, userId } = payload;
            const updatedIds = db.markMessagesAsSeen(conversationId, userId);
            const conv = db.getConversationById(conversationId);

            if (conv && updatedIds.length > 0) {
              conv.participantIds.forEach(pid => {
                broadcastToUser(pid, {
                  event: 'message:seen',
                  payload: { conversationId, readerUserId: userId, messageIds: updatedIds }
                });
              });
            }
            break;
          }

          case 'message:react': {
            const { messageId, emoji, userId, userName } = payload;
            const updatedMsg = db.addReaction(messageId, emoji, userId, userName);
            if (updatedMsg) {
              const conv = db.getConversationById(updatedMsg.conversationId);
              if (conv) {
                conv.participantIds.forEach(pid => {
                  broadcastToUser(pid, {
                    event: 'message:updated',
                    payload: { message: updatedMsg }
                  });
                });
              }
            }
            break;
          }

          default:
            console.log('Unhandled WebSocket event:', event);
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      if (ws.userId) {
        const userSockets = activeSockets.get(ws.userId);
        if (userSockets) {
          userSockets.delete(ws);
          if (userSockets.size === 0) {
            activeSockets.delete(ws.userId);
            db.updateUser(ws.userId, { status: 'offline', lastSeen: new Date().toISOString() });
            
            broadcastToAll({
              event: 'user:status',
              payload: { userId: ws.userId, status: 'offline', lastSeen: new Date().toISOString() }
            });
          }
        }
      }
    });
  });

  console.log('⚡ WebSocket server attached to HTTP server on /ws');
  return wss;
}
