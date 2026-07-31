import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { api } from '../../services/api';
import { User } from '../../types';
import { UserPlus, X, Search, MessageSquare, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const NewChatModal: React.FC = () => {
  const {
    isNewChatModalOpen,
    setNewChatModalOpen,
    currentUser,
    loadConversations,
    setActiveConversation,
    openAiChat,
    theme,
    isDarkMode
  } = useStore();

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isNewChatModalOpen) {
      setLoading(true);
      fetch('/api/chat/users')
        .then((res) => res.json())
        .then((data) => {
          setUsers(data.users || []);
        })
        .catch((err) => console.error('Failed to load users:', err))
        .finally(() => setLoading(false));
    }
  }, [isNewChatModalOpen]);

  if (!isNewChatModalOpen) return null;

  const filteredUsers = users.filter(
    (u) =>
      u.id !== currentUser?.id &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleStartChat = async (targetUser: User) => {
    if (!currentUser) return;
    try {
      const res = await api.createConversation({
        isGroup: false,
        participantIds: [currentUser.id, targetUser.id],
        createdBy: currentUser.id
      });
      await loadConversations();
      if (res.conversation) {
        setActiveConversation(res.conversation.id);
      }
      setNewChatModalOpen(false);
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
          borderColor: isDarkMode ? '#334155' : `${currentThemeConfig.primary}30`,
          color: isDarkMode ? '#f8fafc' : currentThemeConfig.textColor,
        }}
        className="w-full max-w-md border rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-colors"
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: isDarkMode ? '#1e293b' : `${currentThemeConfig.primary}08`,
            borderColor: isDarkMode ? '#334155' : `${currentThemeConfig.primary}20`,
          }}
          className="p-4 sm:p-5 border-b flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: `${currentThemeConfig.primary}20`, color: currentThemeConfig.primary }}
              className="p-2 rounded-xl"
            >
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">New Direct Message</h3>
              <p className="text-[11px] opacity-70">Find registered users on ReadyNest</p>
            </div>
          </div>
          <button
            onClick={() => setNewChatModalOpen(false)}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-slate-500/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user name or email..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* User List */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          {/* Quick AI Option */}
          <button
            onClick={() => {
              openAiChat();
              setNewChatModalOpen(false);
            }}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 hover:from-emerald-500/20 hover:to-indigo-500/20 border border-emerald-500/30 flex items-center justify-between transition-all text-left group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md flex-shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  ReadyNest AI Assistant
                  <span className="px-1.5 py-0.2 text-[9px] font-black bg-emerald-500 text-white rounded-full">AI</span>
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Chat with Gemini AI for instant answers, summaries, & code
                </p>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500 text-white shadow-sm flex-shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
          </button>
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-400 animate-pulse">
              Loading registered users...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 space-y-1">
              <p className="font-semibold">No users found</p>
              <p className="text-[10px]">Try searching with a different name or email</p>
            </div>
          ) : (
            filteredUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleStartChat(u)}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 flex items-center justify-between transition-all text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                    />
                    {u.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {u.name}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {u.statusMessage || u.email}
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all flex-shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
