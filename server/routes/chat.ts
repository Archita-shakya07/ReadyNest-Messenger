import { Router } from 'express';
import { db } from '../db.js';
import { Message, Conversation, Attachment } from '../../src/types/index.js';

export const chatRouter = Router();

// GET /api/chat/conversations/:userId - Get all user conversations
chatRouter.get('/conversations/:userId', (req, res) => {
  const { userId } = req.params;
  const conversations = db.getConversationsForUser(userId);
  return res.json({ conversations });
});

// GET /api/chat/messages/:conversationId - Get messages for a conversation
chatRouter.get('/messages/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const messages = db.getMessagesForConversation(conversationId);
  return res.json({ messages });
});

// POST /api/chat/messages - Send a message via REST
chatRouter.post('/messages', (req, res) => {
  const { conversationId, senderId, content, type, attachments, replyToId } = req.body;

  if (!conversationId || !senderId || (!content && (!attachments || attachments.length === 0))) {
    return res.status(400).json({ error: 'Missing required message parameters' });
  }

  const sender = db.getUserById(senderId);
  if (!sender) {
    return res.status(404).json({ error: 'Sender not found' });
  }

  if (sender.isBlocked) {
    return res.status(403).json({ error: 'Blocked users cannot send messages' });
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

  return res.status(201).json({ message: newMessage });
});

// POST /api/chat/conversations - Create a 1-to-1 or group conversation
chatRouter.post('/conversations', (req, res) => {
  const { isGroup, name, avatar, description, participantIds, createdBy } = req.body;

  if (!participantIds || !Array.isArray(participantIds) || participantIds.length < 2) {
    return res.status(400).json({ error: 'At least 2 participants required' });
  }

  // Check if 1-to-1 conversation already exists
  if (!isGroup && participantIds.length === 2) {
    const existing = db.getConversationsForUser(participantIds[0]).find(
      c => !c.isGroup && c.participantIds.includes(participantIds[1])
    );
    if (existing) {
      return res.json({ conversation: existing, isNew: false });
    }
  }

  const participants = participantIds
    .map(id => db.getUserById(id))
    .filter((u): u is NonNullable<typeof u> => u !== undefined);

  const initialUnread: Record<string, number> = {};
  participantIds.forEach(id => {
    initialUnread[id] = 0;
  });

  const newConv: Conversation = {
    id: `conv-${Date.now()}`,
    isGroup: !!isGroup,
    name: name || (isGroup ? 'New Group' : undefined),
    avatar: avatar || (isGroup ? 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80' : undefined),
    description,
    participants,
    participantIds,
    unreadCount: initialUnread,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.createConversation(newConv);

  // System join message
  const creator = db.getUserById(createdBy || participantIds[0]);
  const sysMsg: Message = {
    id: `msg-sys-${Date.now()}`,
    conversationId: newConv.id,
    senderId: 'system',
    senderName: 'System',
    senderAvatar: '',
    content: isGroup
      ? `${creator?.name || 'A user'} created the group "${newConv.name}"`
      : 'Conversation started',
    type: 'system',
    status: 'seen',
    createdAt: new Date().toISOString()
  };
  db.addMessage(sysMsg);

  return res.status(201).json({ conversation: newConv, isNew: true });
});

// POST /api/chat/reactions - React to a message
chatRouter.post('/reactions', (req, res) => {
  const { messageId, emoji, userId, userName } = req.body;
  if (!messageId || !emoji || !userId) {
    return res.status(400).json({ error: 'messageId, emoji, userId required' });
  }

  const updatedMsg = db.addReaction(messageId, emoji, userId, userName || 'User');
  if (!updatedMsg) {
    return res.status(404).json({ error: 'Message not found' });
  }

  return res.json({ message: updatedMsg });
});

// POST /api/chat/read - Mark messages in conversation as read
chatRouter.post('/read', (req, res) => {
  const { conversationId, userId } = req.body;
  if (!conversationId || !userId) {
    return res.status(400).json({ error: 'conversationId and userId required' });
  }

  const updatedIds = db.markMessagesAsSeen(conversationId, userId);
  return res.json({ success: true, updatedMessageIds: updatedIds });
});

// POST /api/chat/upload - Simulate Cloudinary media upload
chatRouter.post('/upload', (req, res) => {
  const { fileType, fileName, fileDataUrl } = req.body;

  // Simulate Cloudinary secure URL generation
  const mockCloudinaryId = `cld_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  let simulatedUrl = fileDataUrl;

  if (!fileDataUrl) {
    if (fileType === 'image') {
      simulatedUrl = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80';
    } else if (fileType === 'video') {
      simulatedUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    } else if (fileType === 'audio') {
      simulatedUrl = 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg';
    } else {
      simulatedUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }
  }

  const attachment: Attachment = {
    id: mockCloudinaryId,
    type: fileType || 'image',
    url: simulatedUrl,
    name: fileName || `uploaded_${fileType || 'file'}_${Date.now()}`,
    size: '2.4 MB'
  };

  return res.json({
    success: true,
    cloudinaryPublicId: mockCloudinaryId,
    attachment
  });
});
