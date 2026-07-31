import { Router } from 'express';
import { db } from '../db.js';
import { User } from '../../src/types/index.js';

export const authRouter = Router();

// Helper to generate mock JWT token
const generateToken = (userId: string) => {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({ sub: userId, iat: Math.floor(Date.now() / 1000) })).toString('base64url');
  const signature = 'ready_nest_secure_signature';
  return `${header}.${payload}.${signature}`;
};

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'User not found. Try demo login or signup.' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ error: 'Account blocked by Administrator. Contact support.' });
  }

  // Update status to online & update lastSeen
  db.updateUser(user.id, { status: 'online', lastSeen: new Date().toISOString() });

  const token = generateToken(user.id);
  db.addAuditLog('USER_LOGIN', user.id, user.name, `User ${user.email} logged in`);

  return res.json({
    token,
    user: db.getUserById(user.id)
  });
});

// POST /api/auth/signup
authRouter.post('/signup', (req, res) => {
  const { name, email, avatar, statusMessage, role } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const userRole = role === 'admin' ? 'admin' : 'user';

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    role: userRole,
    statusMessage: statusMessage || (userRole === 'admin' ? '👑 Workspace Administrator' : 'Available for professional chat'),
    status: 'online',
    isBlocked: false,
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    ipAddress: req.ip || '127.0.0.1'
  };

  db.addUser(newUser);

  // Auto create conversation with AI assistant
  const aiUser = db.getUserById('user-ai');
  if (aiUser) {
    db.createConversation({
      id: `conv-ai-${newUser.id}`,
      isGroup: false,
      participants: [newUser, aiUser],
      participantIds: [newUser.id, 'user-ai'],
      unreadCount: { [newUser.id]: 0 },
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isAiChat: true
    });
  }
  const token = generateToken(newUser.id);

// Broadcast new user to all connected clients
if (typeof (global as any).broadcastToAllSockets === 'function') {
  (global as any).broadcastToAllSockets({
    event: 'user:new',
    payload: { user: newUser }
  });
}

return res.status(201).json({ token, user: newUser });
});

// GET /api/auth/me
authRouter.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payloadPart = token.split('.')[1];
    const payload = JSON.parse(Buffer.from(payloadPart, 'base64url').toString());
    const user = db.getUserById(payload.sub);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// PUT /api/auth/profile
authRouter.put('/profile', (req, res) => {
  const { userId, name, avatar, statusMessage, status } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId required' });
  }

  const updated = db.updateUser(userId, { name, avatar, statusMessage, status });
  if (!updated) {
    return res.status(404).json({ error: 'User not found' });
  }

  return res.json({ user: updated });
});

// GET /api/auth/demo-users
authRouter.get('/demo-users', (req, res) => {
  return res.json({ users: db.getUsers().filter(u => u.id !== 'user-ai') });
});
