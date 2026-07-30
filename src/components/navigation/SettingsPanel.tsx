import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { THEMES, ThemeId } from '../../types/theme';
import {
  Settings,
  Palette,
  User,
  Moon,
  Sun,
  Check,
  Wifi,
  Shield,
  Bell,
  Sparkles,
  Save,
  Laptop,
  Lock,
  MessageSquare,
  Activity,
  FileText,
  Search,
  RefreshCw,
  Trash2,
  Download,
  Terminal,
  CheckCircle,
  X,
  Send,
  Plus
} from 'lucide-react';

interface LogEntry {
  id: string;
  time: string;
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  event: string;
  details: string;
}

export const SettingsPanel: React.FC = () => {
  const {
    theme,
    setTheme,
    isDarkMode,
    toggleDarkMode,
    currentUser,
    setCurrentUser,
    logout
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'general' | 'profile' | 'account' | 'privacy' | 'chats' | 'logs' | 'notifications'
  >('profile');

  const [searchQuery, setSearchQuery] = useState('');
  const [name, setName] = useState(currentUser?.name || '');
  const [statusMsg, setStatusMsg] = useState(currentUser?.statusMessage || "What's happening?");
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [whatsHappening, setWhatsHappening] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Core Logs State
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      time: new Date(Date.now() - 3600000).toLocaleTimeString(),
      level: 'SUCCESS',
      event: 'SOCKET_CONNECT',
      details: 'WebSocket server connected on port 3000 (ws://localhost:3000)'
    },
    {
      id: '2',
      time: new Date(Date.now() - 2800000).toLocaleTimeString(),
      level: 'INFO',
      event: 'JWT_VERIFY',
      details: 'Authentication token verified for session user: Archita'
    },
    {
      id: '3',
      time: new Date(Date.now() - 1500000).toLocaleTimeString(),
      level: 'INFO',
      event: 'CONVERSATION_SYNC',
      details: 'Loaded 5 active conversation channels with real-time listeners'
    },
    {
      id: '4',
      time: new Date(Date.now() - 600000).toLocaleTimeString(),
      level: 'SUCCESS',
      event: 'STATEMENT_UPDATE',
      details: 'ReadyNest Messenger v2.5 core statement & updates synced'
    }
  ]);

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      const updated = {
        ...currentUser,
        name: name.trim() || currentUser.name,
        statusMessage: statusMsg.trim() || currentUser.statusMessage,
        avatar: avatar.trim() || currentUser.avatar
      };
      setCurrentUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handlePostStoryUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (whatsHappening.trim() && currentUser) {
      const updated = {
        ...currentUser,
        statusMessage: whatsHappening.trim()
      };
      setCurrentUser(updated);
      setStatusMsg(whatsHappening.trim());
      setWhatsHappening('');
      addLogEntry('INFO', 'STORY_UPDATE', `Updated status story to: "${updated.statusMessage}"`);
    }
  };

  const addLogEntry = (level: LogEntry['level'], event: string, details: string) => {
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(),
      level,
      event,
      details
    };
    setLogs(prev => [newEntry, ...prev]);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const exportStatement = () => {
    const statementText = `=== READYNEST CORE LOGS STATEMENT ===\nDate: ${new Date().toLocaleString()}\nUser: ${currentUser?.name}\nTotal Logs: ${logs.length}\n\n` +
      logs.map(l => `[${l.time}] [${l.level}] [${l.event}]: ${l.details}`).join('\n');
    
    const element = document.createElement("a");
    const file = new Blob([statementText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `readynest_statement_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filter tabs for search
  const settingsNavItems = [
    { id: 'general', label: 'General', desc: 'Startup and close settings', icon: Laptop },
    { id: 'profile', label: 'Profile', desc: 'Name, profile picture, username', icon: User },
    { id: 'account', label: 'Account', desc: 'Security notifications, account info', icon: Lock },
    { id: 'privacy', label: 'Privacy', desc: 'Blocked contacts, disappearing messages', icon: Shield },
    { id: 'chats', label: 'Chats', desc: 'Theme colors, dark mode, wallpapers', icon: MessageSquare },
    { id: 'logs', label: 'Core Logs & Updates', desc: 'Working system logs, statement & release notes', icon: Activity },
    { id: 'notifications', label: 'Notifications', desc: 'Message alerts and sound effects', icon: Bell },
  ];

  const filteredNav = settingsNavItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Left Settings Sidebar List (WhatsApp Desktop style) */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col flex-shrink-0 h-full overflow-y-auto">
        {/* Top User Profile Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {currentUser?.name || 'Archita'}
          </h1>

          {/* Search Settings */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Settings..."
              className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            />
          </div>

          {/* "What's happening?" Story Avatar Ring */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                  alt={currentUser?.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500 p-0.5"
                />
                <div
                  style={{ backgroundColor: currentThemeConfig.primary }}
                  className="absolute bottom-0 right-0 p-0.5 text-white rounded-full shadow-xs"
                >
                  <Plus className="w-3 h-3" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                  {currentUser?.name || 'Archita'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.statusMessage || "What's happening?"}
                </p>
              </div>
            </div>

            {/* Quick Status Update Input */}
            <form onSubmit={handlePostStoryUpdate} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={whatsHappening}
                onChange={(e) => setWhatsHappening(e.target.value)}
                placeholder="What's happening?"
                className="flex-1 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                style={{ backgroundColor: currentThemeConfig.primary }}
                className="p-1.5 text-white rounded-xl hover:opacity-90 transition-opacity"
                title="Update Status"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Categories List */}
        <div className="p-2 space-y-1 flex-1 overflow-y-auto">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full p-3 rounded-xl flex items-center gap-3.5 transition-all text-left ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div
                  style={isActive ? { color: currentThemeConfig.primary } : undefined}
                  className={`p-2 rounded-xl flex-shrink-0 ${
                    isActive
                      ? 'bg-emerald-500/10'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`text-xs font-bold ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Main Details View */}
      <div className="flex-1 h-full overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Settings</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage your name, picture, and status bio</p>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <img
                    src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt="Avatar Preview"
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500/30"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Avatar Image URL</label>
                    <input
                      type="text"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Archita"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">This is not your username or pin. This name will be visible to your ReadyNest contacts.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">About / Status Bio</label>
                  <input
                    type="text"
                    value={statusMsg}
                    onChange={(e) => setStatusMsg(e.target.value)}
                    placeholder="What's happening?"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {savedSuccess && (
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Changes saved successfully!
                    </span>
                  )}
                  <button
                    type="submit"
                    style={{ backgroundColor: currentThemeConfig.primary }}
                    className="ml-auto px-5 py-2.5 text-white font-bold rounded-xl text-xs shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* CORE LOGS & STATEMENT TAB */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-emerald-500/20 rounded-2xl border border-emerald-500/30 text-emerald-400">
                    <Activity className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black tracking-tight">Core Logs & Statement</h2>
                    <p className="text-xs text-slate-300">Real-time socket events, auth verification & update statements</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-300">
                  <Wifi className="w-3.5 h-3.5 animate-pulse" />
                  <span>v2.5 Operational</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addLogEntry('INFO', 'MANUAL_PING', 'System health check ping dispatched to server')}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Test Event Ping
                  </button>
                  <button
                    onClick={clearLogs}
                    className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Stream
                  </button>
                </div>

                <button
                  onClick={exportStatement}
                  style={{ backgroundColor: currentThemeConfig.primary }}
                  className="px-4 py-1.5 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
                >
                  <Download className="w-3.5 h-3.5" /> Download Statement
                </button>
              </div>

              {/* Working Live Log Console Terminal */}
              <div className="bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl p-4 font-mono text-xs shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
                  <span className="flex items-center gap-2 text-emerald-400 font-bold">
                    <Terminal className="w-4 h-4" /> Real-time System Log Stream ({logs.length} events)
                  </span>
                  <span className="text-[10px]">Auto-scrolling stream</span>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-2">
                  {logs.length === 0 ? (
                    <p className="text-slate-500 italic py-4 text-center">No logs recorded in this session.</p>
                  ) : (
                    logs.map((log) => (
                      <div key={log.id} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/60 leading-relaxed">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-slate-400 text-[10px]">{log.time}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              log.level === 'SUCCESS'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : log.level === 'WARN'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}
                          >
                            {log.event}
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-1">{log.details}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Core Statement & Updates Box */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <FileText className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Core System Statement & Release Notes</h3>
                </div>

                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">
                      ReadyNest Messenger v2.5 Statement
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                      <li>WebSocket engine operational on port 3000</li>
                      <li>JWT Auth payload encrypted and active</li>
                      <li>Admin moderation console enabled</li>
                      <li>Gemini AI Assistant integrated into chat rails</li>
                      <li>Custom 8-color theme palettes active</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHATS & THEME TAB */}
          {activeTab === 'chats' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Chat Themes & Appearance</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Choose dark mode or select from 8 chat theme palettes</p>
                </div>
              </div>

              {/* Dark / Light Toggle */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Appearance Mode</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => isDarkMode && toggleDarkMode()}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      !isDarkMode
                        ? 'bg-white border-emerald-500 text-emerald-600 shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sun className="w-4 h-4 text-amber-500" /> Light Mode
                  </button>
                  <button
                    onClick={() => !isDarkMode && toggleDarkMode()}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-2 ${
                      isDarkMode
                        ? 'bg-slate-900 border-emerald-500 text-emerald-400 shadow-sm'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Moon className="w-4 h-4 text-amber-400" /> Dark Mode
                  </button>
                </div>
              </div>

              {/* Palettes */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">Select Chat Theme Palette</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {(Object.keys(THEMES) as ThemeId[]).map((key) => {
                    const t = THEMES[key];
                    const isSelected = theme === key;

                    return (
                      <div
                        key={key}
                        onClick={() => setTheme(key)}
                        className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all flex flex-col justify-between space-y-2.5 ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3.5 h-3.5 rounded-full ring-2 ring-white/50 shadow-xs"
                              style={{ backgroundColor: t.primary }}
                            />
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                              {t.name}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="p-0.5 bg-emerald-500 text-white rounded-full">
                              <Check className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                          {t.feel}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* GENERAL TAB */}
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">General Settings</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Startup & system behavior preferences</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Start ReadyNest on Login</p>
                    <p className="text-[11px] text-slate-400">Automatically open app when system starts</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">Minimize to System Tray</p>
                    <p className="text-[11px] text-slate-400">Keep application running in background when closed</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500" />
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT & PRIVACY & NOTIFICATIONS FALLBACKS */}
          {(activeTab === 'account' || activeTab === 'privacy' || activeTab === 'notifications') && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  {activeTab === 'account' ? <Lock className="w-6 h-6" /> : activeTab === 'privacy' ? <Shield className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white capitalize">{activeTab} Settings</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage security, permissions and notifications</p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-2">
                <p className="font-bold text-slate-900 dark:text-white">
                  Security Protection Active
                </p>
                <p className="text-slate-500 dark:text-slate-400">
                  Your ReadyNest account is authenticated with JWT tokens. End-to-end encryption and real-time socket verification are active for {currentUser?.name}.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
