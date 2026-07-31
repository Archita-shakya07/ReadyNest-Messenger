import { Router } from 'express';
import { db } from '../db.js';
import { SystemBroadcast } from '../../src/types/index.js';

export const adminRouter = Router();

// Middleware to verify admin role
const verifyAdmin = (req: any, res: any, next: any) => {
  const adminId = req.headers['x-admin-id'] || req.body.adminId;
  if (!adminId) {
    return res.status(401).json({ error: 'Admin identification required' });
  }
  const user = db.getUserById(String(adminId));
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied: Admin role required' });
  }
  next();
};

// GET /api/admin/stats
adminRouter.get('/stats', (req, res) => {
  const wsCount = (globalThis as any).activeWsClientsCount || 1;
  const stats = db.getAdminStats(wsCount);
  return res.json({ stats });
});

// GET /api/admin/users
adminRouter.get('/users', verifyAdmin, (req, res) => {
  const users = db.getUsers();
  return res.json({ users });
});

// POST /api/admin/users/block
adminRouter.post('/users/block', verifyAdmin, (req, res) => {
  const { userId, isBlocked } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  const updatedUser = db.setUserBlocked(userId, !!isBlocked);
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user: updatedUser });
});

// POST /api/admin/users/role
adminRouter.post('/users/role', verifyAdmin, (req, res) => {
  const { userId, role } = req.body;
  if (!userId || !['user', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Valid userId and role required' });
  }

  const updatedUser = db.updateUser(userId, { role });
  db.addAuditLog('ROLE_CHANGE', req.headers['x-admin-id'] as string || 'admin', 'Admin', `Changed user ${userId} role to ${role}`);
  return res.json({ user: updatedUser });
});

// GET /api/admin/audit-logs
adminRouter.get('/audit-logs', verifyAdmin, (req, res) => {
  const logs = db.getAuditLogs();
  return res.json({ logs });
});

// GET /api/admin/broadcasts
adminRouter.get('/broadcasts', (req, res) => {
  const broadcasts = db.getBroadcasts();
  return res.json({ broadcasts });
});

// POST /api/admin/broadcasts - Send system broadcast
adminRouter.post('/broadcasts', verifyAdmin, (req, res) => {
  const { title, content, type, adminId } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }

  const adminUser = db.getUserById(adminId) || db.getUserById('user-admin');

  const bcast: SystemBroadcast = {
    id: `bcast-${Date.now()}`,
    title,
    content,
    type: type || 'info',
    createdBy: adminUser?.id || 'admin',
    createdByName: adminUser?.name || 'Admin',
    createdAt: new Date().toISOString()
  };

  db.addBroadcast(bcast);

  // Broadcast over WebSockets if server socket instance available
  if ((global as any).broadcastToAllSockets) {
    (global as any).broadcastToAllSockets({
      event: 'broadcast:system',
      payload: bcast
    });
  }

  return res.status(201).json({ broadcast: bcast });
});

// GET /api/admin/monitoring/messages - Chat audit / moderation log
adminRouter.get('/monitoring/messages', verifyAdmin, (req, res) => {
  const conversations = db.getConversationsForUser('user-admin');
  const allMessages: any[] = [];
  conversations.forEach(c => {
    const msgs = db.getMessagesForConversation(c.id);
    msgs.forEach(m => {
      allMessages.push({
        ...m,
        conversationName: c.isGroup ? c.name : '1-to-1 Chat',
      });
    });
  });

  allMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json({ messages: allMessages.slice(0, 50) });
});
