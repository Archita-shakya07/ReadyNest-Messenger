import React, { useState } from 'react';
import {
  Layers,
  FolderTree,
  Database,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Server,
  Globe
} from 'lucide-react';

export const SpecsRoadmapModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'folder' | 'schema' | 'socket'>('roadmap');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const mongooseUserSchema = `// MongoDB / Mongoose Schema: UserSchema.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  statusMessage?: string;
  status: 'online' | 'offline' | 'away';
  isBlocked: boolean;
  lastSeen: Date;
  ipAddress?: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  avatar: { type: String, default: '' },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  statusMessage: { type: String, default: 'Available for chat' },
  status: { type: String, enum: ['online', 'offline', 'away'], default: 'offline' },
  isBlocked: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now },
  ipAddress: { type: String }
}, { timestamps: true });

export const UserModel = mongoose.model<IUser>('User', UserSchema);`;

  const mongooseMessageSchema = `// MongoDB / Mongoose Schema: MessageSchema.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'document' | 'system' | 'ai';
  status: 'sent' | 'delivered' | 'seen';
  attachments?: Array<{ id: string; type: string; url: string; name: string; size?: string }>;
  reactions?: Array<{ emoji: string; userId: string; userName: string }>;
  replyToId?: mongoose.Types.ObjectId;
  isAiResponse?: boolean;
}

const MessageSchema: Schema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String },
  content: { type: String, default: '' },
  type: { type: String, enum: ['text', 'image', 'video', 'audio', 'document', 'system', 'ai'], default: 'text' },
  status: { type: String, enum: ['sent', 'delivered', 'seen'], default: 'sent' },
  attachments: [{ id: String, type: String, url: String, name: String, size: String }],
  reactions: [{ emoji: String, userId: String, userName: String }],
  replyToId: { type: Schema.Types.ObjectId, ref: 'Message' },
  isAiResponse: { type: Boolean, default: false }
}, { timestamps: true });

// Compound Index for lightning fast query speed (<100ms)
MessageSchema.index({ conversationId: 1, createdAt: -1 });

export const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);`;

  const mongooseConversationSchema = `// MongoDB / Mongoose Schema: ConversationSchema.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  isGroup: boolean;
  name?: string;
  avatar?: string;
  description?: string;
  participantIds: mongoose.Types.ObjectId[];
  unreadCount: Map<string, number>;
  lastMessage?: mongoose.Types.ObjectId;
  isAiChat?: boolean;
}

const ConversationSchema: Schema = new Schema({
  isGroup: { type: Boolean, default: false },
  name: { type: String },
  avatar: { type: String },
  description: { type: String },
  participantIds: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  unreadCount: { type: Map, of: Number, default: {} },
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  isAiChat: { type: Boolean, default: false }
}, { timestamps: true });

ConversationSchema.index({ participantIds: 1 });

export const ConversationModel = mongoose.model<IConversation>('Conversation', ConversationSchema);`;

  const socketCodeSnippet = `// Server-Side WebSocket Setup (Port 3000 Node.js + Express)
import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  const activeSockets = new Map<string, Set<WebSocket>>();

  wss.on('connection', (ws) => {
    ws.on('message', (raw) => {
      const { event, payload } = JSON.parse(raw.toString());
      if (event === 'auth') {
        // Register client user ID
        activeSockets.set(payload.userId, ws);
      } else if (event === 'message:send') {
        // Relay real-time message frame
      }
    });
  });
}

// Client-Side WebSocket Connection Manager (React/TypeScript)
export class SocketClient {
  private ws: WebSocket | null = null;
  connect(userId: string) {
    this.ws = new WebSocket(\`ws://\${location.host}/ws\`);
    this.ws.onopen = () => {
      this.ws?.send(JSON.stringify({ event: 'auth', payload: { userId } }));
    };
  }
}`;

  return (
    <div className="flex-1 bg-slate-950 text-white overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight">System Specs & Architectural Roadmap</h1>
            <p className="text-xs text-slate-400">
              Full-Stack Architecture • MongoDB Schemas • WebSocket Setup • Folder Structure
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          {(['roadmap', 'folder', 'schema', 'socket'] as const).map((tab) => {
            const labels = {
              roadmap: 'Roadmap',
              folder: 'Folder Structure',
              schema: 'Database Schemas',
              socket: 'Socket.io Code',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: DEVELOPMENT ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            Step-by-Step Development Roadmap
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bento-card p-4 space-y-2">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded">
                PHASE 1
              </span>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Core Architecture & Express Server</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Setup Node.js + Express backend on port 3000, Vite dev middleware, HTTP upgrade handling, and CORS policies.
              </p>
            </div>

            <div className="bento-card p-4 space-y-2">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded">
                PHASE 2
              </span>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Database Schemas & JWT Auth</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Design MongoDB/Mongoose User, Message, and Conversation collections with compound indexing and JWT security.
              </p>
            </div>

            <div className="bento-card p-4 space-y-2">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded">
                PHASE 3
              </span>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Real-Time WebSockets Engine</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Implement WebSocket connection pool for sub-100ms message frames, typing indicators, read receipts, and status dots.
              </p>
            </div>

            <div className="bento-card p-4 space-y-2">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded">
                PHASE 4
              </span>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Media Uploads & Cloudinary</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Integrate Cloudinary file uploads for images, videos, documents, and interactive voice note audio recording.
              </p>
            </div>

            <div className="bento-card p-4 space-y-2">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded">
                PHASE 5
              </span>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Admin Console & Real-Time Broadcasts</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Build full Admin dashboard, user block/unblock, moderation logs, and system-wide WebSocket broadcast notices.
              </p>
            </div>

            <div className="bento-card p-4 space-y-2">
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 rounded">
                BONUS PHASE
              </span>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">Gemini AI Assistant Integration</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Integrate Gemini 3.6 Flash on server-side for ReadyNest AI chatbot assistant, smart auto-reply, and chat history summarization.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FOLDER STRUCTURE */}
      {activeTab === 'folder' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-emerald-400" />
            Project Folder Structure (Frontend & Backend)
          </h2>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
            <pre>{`ready-nest-messenger/
├── server.ts                  # Express HTTP & WebSocket Server Entry Point (Port 3000)
├── server/
│   ├── db.ts                  # In-Memory Database Store & Seed Data
│   ├── socket.ts              # WebSocket Server Handler (/ws)
│   └── routes/
│       ├── auth.ts            # REST API: Login, Signup, JWT Auth
│       ├── chat.ts            # REST API: Messages, Conversations, Reactions, Cloudinary Uploads
│       ├── admin.ts           # REST API: Metrics, User Block/Unblock, Broadcasts
│       └── ai.ts              # REST API: Gemini 3.6 Flash AI Chat Assistant & Summaries
├── src/
│   ├── main.tsx               # Client Entry Point
│   ├── App.tsx                # Main Application Shell
│   ├── types/
│   │   └── index.ts           # Shared TypeScript Interfaces (User, Message, Conversation)
│   ├── store/
│   │   └── useStore.ts        # Zustand Global State Management
│   ├── services/
│   │   ├── api.ts             # REST API Client Service
│   │   └── socketService.ts   # Client WebSocket Connection Manager
│   └── components/
│       ├── auth/              # Auth & Demo Account Switcher Modals
│       ├── navigation/        # AppHeader & Sidebar Conversation List
│       ├── chat/              # ChatWindow, MessageItem, MessageInput, GroupModal, CallModal
│       ├── admin/             # Admin Console Dashboard & Broadcast Composer
│       ├── info/              # Right Contact Info Drawer & Shared Media Gallery
│       ├── specs/             # Specs & Roadmap Viewer
│       └── ui/                # System Broadcast Banner & Lightbox Viewer
├── package.json               # Full-Stack Scripts & Dependencies
└── tsconfig.json`}</pre>
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE SCHEMAS */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          {/* User Schema */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <Database className="w-4 h-4" /> User Mongoose Schema
              </h3>
              <button
                onClick={() => copyToClipboard(mongooseUserSchema, 'user')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center gap-1"
              >
                {copiedSnippet === 'user' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <code>{mongooseUserSchema}</code>
            </pre>
          </div>

          {/* Message Schema */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <Database className="w-4 h-4" /> Message Mongoose Schema
              </h3>
              <button
                onClick={() => copyToClipboard(mongooseMessageSchema, 'msg')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center gap-1"
              >
                {copiedSnippet === 'msg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <code>{mongooseMessageSchema}</code>
            </pre>
          </div>

          {/* Conversation Schema */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <Database className="w-4 h-4" /> Conversation Mongoose Schema
              </h3>
              <button
                onClick={() => copyToClipboard(mongooseConversationSchema, 'conv')}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center gap-1"
              >
                {copiedSnippet === 'conv' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <code>{mongooseConversationSchema}</code>
            </pre>
          </div>
        </div>
      )}

      {/* TAB 4: SOCKET CODE */}
      {activeTab === 'socket' && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              WebSocket Setup Code (Server & Client)
            </h2>
            <button
              onClick={() => copyToClipboard(socketCodeSnippet, 'socket')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg flex items-center gap-1"
            >
              {copiedSnippet === 'socket' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Code</span>
            </button>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
            <code>{socketCodeSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
