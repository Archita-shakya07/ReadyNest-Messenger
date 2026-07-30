import React from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { ReadyNestLogo } from '../common/ReadyNestLogo';
import {
  MessageSquare,
  PhoneCall,
  CircleDashed,
  Users,
  Sparkles,
  Palette,
  Shield,
  Settings,
  Bot,
  LogOut
} from 'lucide-react';

export const LeftRail: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    conversations,
    currentUser,
    logout,
    setAuthModalOpen,
    setThemeModalOpen,
    setActiveConversation,
    setNewGroupModalOpen,
    theme,
    isDarkMode
  } = useStore();

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;

  // Calculate total unread messages
  const totalUnread = conversations.reduce((acc, c) => {
    if (!currentUser) return acc;
    const count = typeof c.unreadCount === 'object' && c.unreadCount ? c.unreadCount[currentUser.id] || 0 : 0;
    return acc + count;
  }, 0);

  // Find AI chat if available
  const aiChat = conversations.find((c) => c.isAiChat);

  const handleAiClick = () => {
    setViewMode('chat');
    if (aiChat) {
      setActiveConversation(aiChat.id);
    }
  };

  return (
    <aside
      style={{
        backgroundColor: isDarkMode ? '#020617' : currentThemeConfig.appBg,
        borderColor: isDarkMode ? '#1e293b' : `${currentThemeConfig.primary}20`,
        color: isDarkMode ? '#94a3b8' : currentThemeConfig.textColor,
      }}
      className="w-16 sm:w-16 h-full border-r flex flex-col items-center justify-between py-3 z-20 flex-shrink-0 transition-colors"
    >
      {/* Top Main Navigation Icons */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* App Logo */}
        <button
          className="mb-1 hover:scale-105 transition-transform focus:outline-none"
          onClick={() => setViewMode('chat')}
          title="ReadyNest Messenger"
        >
          <ReadyNestLogo size={38} variant="icon" />
        </button>

        {/* Chats Button */}
        <button
          onClick={() => setViewMode('chat')}
          style={
            viewMode === 'chat'
              ? {
                  backgroundColor: currentThemeConfig.primary,
                  color: '#ffffff',
                }
              : undefined
          }
          className={`relative p-2.5 rounded-xl transition-all ${
            viewMode === 'chat'
              ? 'shadow-sm'
              : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
          }`}
          title="Chats"
        >
          <MessageSquare className="w-5 h-5" />
          {totalUnread > 0 && (
            <span
              style={{ backgroundColor: currentThemeConfig.primary }}
              className="absolute -top-1 -right-1 px-1.5 py-0.5 text-white text-[10px] font-extrabold rounded-full animate-pulse shadow-sm"
            >
              {totalUnread > 99 ? '99+' : totalUnread}
            </span>
          )}
        </button>

        {/* Calls Quick Icon */}
        <button
          onClick={() => setViewMode('calls')}
          style={
            viewMode === 'calls'
              ? {
                  backgroundColor: currentThemeConfig.primary,
                  color: '#ffffff',
                }
              : undefined
          }
          className={`p-2.5 rounded-xl transition-all ${
            viewMode === 'calls'
              ? 'shadow-sm'
              : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
          }`}
          title="Calls & Audio/Video History"
        >
          <PhoneCall className="w-5 h-5" />
        </button>

        {/* Status / Updates */}
        <button
          onClick={() => setViewMode('status')}
          style={
            viewMode === 'status'
              ? {
                  backgroundColor: currentThemeConfig.primary,
                  color: '#ffffff',
                }
              : undefined
          }
          className={`p-2.5 rounded-xl transition-all relative ${
            viewMode === 'status'
              ? 'shadow-sm'
              : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
          }`}
          title="Status & Updates"
        >
          <CircleDashed
            style={viewMode === 'status' ? { color: '#ffffff' } : { color: currentThemeConfig.primary }}
            className="w-5 h-5"
          />
          <span
            style={{ backgroundColor: viewMode === 'status' ? '#ffffff' : currentThemeConfig.primary }}
            className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse"
          ></span>
        </button>

        {/* Groups & Communities */}
        <button
          onClick={() => setNewGroupModalOpen(true)}
          className="p-2.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition-all"
          title="Create or View Groups"
        >
          <Users className="w-5 h-5" />
        </button>

        {/* Gemini AI Bot Chat */}
        <button
          onClick={handleAiClick}
          className="p-2.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/60 transition-all relative"
          title="Gemini AI Assistant"
        >
          <Bot style={{ color: currentThemeConfig.primary }} className="w-5 h-5" />
          <span
            style={{ backgroundColor: currentThemeConfig.primary }}
            className="absolute -top-0.5 -right-0.5 p-0.5 text-white rounded-full"
          >
            <Sparkles className="w-2.5 h-2.5" />
          </span>
        </button>

        {/* Admin Console (Admin users) */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={() => setViewMode('admin')}
            style={
              viewMode === 'admin'
                ? { backgroundColor: currentThemeConfig.primary, color: '#ffffff' }
                : undefined
            }
            className={`p-2.5 rounded-xl transition-all ${
              viewMode === 'admin'
                ? 'shadow-sm'
                : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
            }`}
            title="Admin Console"
          >
            <Shield className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Bottom Tools & Profile */}
      <div className="flex flex-col items-center gap-2 w-full mt-auto pt-8">
        {/* Theme Palette Switcher */}
        <button
          onClick={() => setThemeModalOpen(true)}
          className="p-2.5 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-all text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          title="Change Theme Palette"
        >
          <Palette className="w-5 h-5" />
        </button>

        {/* Settings View Trigger */}
        <button
          onClick={() => setViewMode('settings')}
          style={
            viewMode === 'settings'
              ? { backgroundColor: currentThemeConfig.primary, color: '#ffffff' }
              : undefined
          }
          className={`p-2.5 rounded-xl transition-all ${
            viewMode === 'settings'
              ? 'shadow-sm'
              : 'hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          title="App Settings & Profile Options"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Bottom Logout Button */}
        <button
          onClick={logout}
          className="p-2.5 rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all flex items-center justify-center mt-1"
          title="Logout & Sign Out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
