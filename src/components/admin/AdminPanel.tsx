import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { api } from '../../services/api';
import { User, AdminStats, AuditLog, SystemBroadcast } from '../../types';
import {
  Shield,
  Users,
  MessageSquare,
  Radio,
  Ban,
  CheckCircle,
  Megaphone,
  Activity,
  AlertTriangle,
  Lock,
  Search,
  Zap,
  Globe,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';

export const AdminPanel: React.FC = () => {
  const { currentUser } = useStore();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [broadcasts, setBroadcasts] = useState<SystemBroadcast[]>([]);
  const [chatLogs, setChatLogs] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'broadcast' | 'monitoring'>('dashboard');
  const [userSearch, setUserSearch] = useState('');

  // Broadcast Form
  const [bcastTitle, setBcastTitle] = useState('');
  const [bcastContent, setBcastContent] = useState('');
  const [bcastType, setBcastType] = useState<'info' | 'warning' | 'urgent'>('info');
  const [bcastSuccess, setBcastSuccess] = useState('');

  const adminId = currentUser?.id || 'user-admin';

  const loadAdminData = async () => {
    try {
      const statsRes = await api.getAdminStats();
      setStats(statsRes.stats);

      const usersRes = await api.getAdminUsers(adminId);
      setUsers(usersRes.users || []);

      const logsRes = await api.getAuditLogs(adminId);
      setAuditLogs(logsRes.logs || []);

      const bcastRes = await api.getBroadcasts();
      setBroadcasts(bcastRes.broadcasts || []);

      const msgsRes = await api.getChatMonitoringMessages(adminId);
      setChatLogs(msgsRes.messages || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleBlock = async (user: User) => {
    try {
      await api.toggleBlockUser(adminId, user.id, !user.isBlocked);
      loadAdminData();
    } catch (err) {
      console.error('Block toggle failed:', err);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcastTitle || !bcastContent) return;

    try {
      await api.sendBroadcast(adminId, bcastTitle, bcastContent, bcastType);
      setBcastSuccess('System Broadcast dispatched in real-time over WebSockets!');
      setBcastTitle('');
      setBcastContent('');
      setTimeout(() => setBcastSuccess(''), 4000);
      loadAdminData();
    } catch (err) {
      console.error('Broadcast failed:', err);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto p-1 sm:p-2 space-y-4">
      {/* Top Banner Header */}
      <div className="bento-card p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/20 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
              Ready Nest Administration Console
              <span className="px-2 py-0.5 text-[10px] bg-amber-400 text-slate-950 font-extrabold rounded-full">
                ADMIN
              </span>
            </h1>
            <p className="text-xs text-emerald-200">
              System Health • User Management • Content Moderation • Real-Time Broadcasts
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-xl border border-white/10">
          {(['dashboard', 'users', 'broadcast', 'monitoring'] as const).map((tab) => {
            const labels = {
              dashboard: 'Overview',
              users: 'User Directory',
              broadcast: 'Broadcast',
              monitoring: 'Audit & Logs',
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'dashboard' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="bento-card p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Users</span>
              <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{stats?.totalUsers || 0}</p>
            </div>
            <div className="bento-card p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Users</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats?.activeUsers || 0}</p>
            </div>
            <div className="bento-card p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conversations</span>
              <p className="text-2xl font-black text-sky-600 dark:text-sky-400">{stats?.totalConversations || 0}</p>
            </div>
            <div className="bento-card p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Messages</span>
              <p className="text-2xl font-black text-teal-600 dark:text-teal-400">{stats?.totalMessages || 0}</p>
            </div>
            <div className="bento-card p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WS Connections</span>
              <p className="text-2xl font-black text-amber-500 flex items-center gap-1">
                {stats?.wsConnections || 1} <Radio className="w-3.5 h-3.5 text-amber-500 animate-ping" />
              </p>
            </div>
            <div className="bento-card p-4 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blocked Users</span>
              <p className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats?.blockedUsers || 0}</p>
            </div>
          </div>

          {/* Audit Trail Log */}
          <div className="bento-card p-5">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Recent System Audit Log
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 text-[9px] font-extrabold bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded">
                      {log.action}
                    </span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bento-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              User Accounts Directory ({users.length})
            </h3>
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{u.name}</p>
                          <p className="text-[10px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                        u.role === 'admin' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {u.isBlocked ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 rounded">
                          BLOCKED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded">
                          ACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{u.ipAddress || '192.168.1.1'}</td>
                    <td className="py-3 px-3 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleBlock(u)}
                          className={`px-3 py-1 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 ml-auto ${
                            u.isBlocked
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-sm'
                          }`}
                        >
                          {u.isBlocked ? (
                            <>
                              <CheckCircle className="w-3.5 h-3.5" /> Unblock
                            </>
                          ) : (
                            <>
                              <Ban className="w-3.5 h-3.5" /> Block User
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM BROADCAST COMPOSER */}
      {activeTab === 'broadcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <form onSubmit={handleSendBroadcast} className="bento-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Compose System-Wide Broadcast Notice
            </h3>

            {bcastSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-medium">
                <Zap className="w-4 h-4" /> {bcastSuccess}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Broadcast Title</label>
              <input
                type="text"
                value={bcastTitle}
                onChange={(e) => setBcastTitle(e.target.value)}
                placeholder="e.g. Scheduled System Upgrade at 11 PM"
                required
                className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Broadcast Notice Content</label>
              <textarea
                value={bcastContent}
                onChange={(e) => setBcastContent(e.target.value)}
                rows={3}
                placeholder="Write message to be pushed directly to all active connected user screens via WebSockets..."
                required
                className="w-full px-3.5 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Priority Level</label>
              <div className="flex gap-2">
                {(['info', 'warning', 'urgent'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBcastType(t)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors border ${
                      bcastType === t
                        ? t === 'urgent'
                          ? 'bg-rose-600 text-white border-rose-500'
                          : t === 'warning'
                          ? 'bg-amber-600 text-white border-amber-500'
                          : 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-md shadow-indigo-950/20"
            >
              <Radio className="w-4 h-4" /> Dispatch Real-Time WebSocket Broadcast
            </button>
          </form>

          {/* Past Broadcast History */}
          <div className="bento-card p-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Broadcast History Log</h3>
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {broadcasts.map((b) => (
                <div key={b.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{b.title}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{b.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHAT MONITORING & CONTENT MODERATION */}
      {activeTab === 'monitoring' && (
        <div className="bento-card p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Chat Monitoring & Content Moderation Log
          </h3>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {chatLogs.map((m) => (
              <div key={m.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <img src={m.senderAvatar} alt={m.senderName} className="w-7 h-7 rounded-full object-cover mt-0.5" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{m.senderName}</span>
                      <span className="text-[10px] text-slate-500">in {m.conversationName}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 mt-1 font-mono text-[11px]">{m.content || '[Attachment]'}</p>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                  {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
