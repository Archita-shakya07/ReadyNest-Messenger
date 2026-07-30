import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { authRouter } from './server/routes/auth.js';
import { chatRouter } from './server/routes/chat.js';
import { adminRouter } from './server/routes/admin.js';
import { aiRouter } from './server/routes/ai.js';
import { initWebSocketServer } from './server/socket.js';

async function startServer() {
  const app = express();
  const server = createServer(app);
  const PORT = 3000;

  // JSON Body Parser Middleware
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/chat', chatRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/ai', aiRouter);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Ready Nest Messenger API',
      timestamp: new Date().toISOString()
    });
  });

  // Attach WebSockets server to HTTP server
  initWebSocketServer(server);

  // Vite middleware in development vs Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, () => {
    console.log(`\n🚀 Ready Nest Messenger is live!`);
    console.log(`👉 Open in your browser: http://localhost:${PORT} or http://127.0.0.1:${PORT}\n`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
