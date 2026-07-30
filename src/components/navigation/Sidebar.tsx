import React from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import {
  Search,
  Plus,
  Bot,
  Users,
  MessageSquare,
  Check,
  CheckCheck,
  Sparkles,
  Filter
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    searchQuery,
    setSearchQuery,
    filterTab,
    setFilterTab,
    currentUser,
    typingUsers,
    theme,
    isDarkMode,
    setNewGroupModalOpen
  } = useStore();

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;

  const filteredConversations = conversations.filter((conv) => {
    // Search query filter
    const nameMatch = conv.isGroup
      ? conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
      : conv.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!nameMatch) return false;

    // Filter tab logic
    if (filterTab === 'unread') {
      const unread = currentUser ? conv.unreadCount[currentUser.id] || 0 : 0;
      return unread > 0;
    }
    if (filterTab === 'groups') return conv.isGroup;
    if (filterTab === 'ai') return conv.isAiChat;

    return true;
  });

  return (
    <aside
      style={{
        backgroundColor: isDarkMode ? '#0f172a' : currentThemeConfig.lightBg,
        borderColor: isDarkMode ? '#1e293b' : `${currentThemeConfig.primary}25`,
        color: isDarkMode ? '#f8fafc' : currentThemeConfig.textColor,
      }}
      className="w-full h-full flex flex-col border-r flex-shrink-0 select-none overflow-hidden transition-colors"
    >
      {/* Top Search & Actions Dock */}
      <div
        style={{ borderColor: isDarkMode ? '#1e293b' : `${currentThemeConfig.primary}20` }}
        className="p-3.5 space-y-3 border-b"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-sm tracking-wide flex items-center gap-2">
            <MessageSquare
              style={{ color: currentThemeConfig.primary }}
              className="w-4 h-4"
            />
            Messages
          </h2>
          <button
            onClick={() => setNewGroupModalOpen(true)}
            style={{
              borderColor: `${currentThemeConfig.primary}40`,
              color: currentThemeConfig.primary,
            }}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            New Group
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search chats, groups, or AI..."
            style={{
              backgroundColor: isDarkMode ? '#020617' : currentThemeConfig.appBg,
              borderColor: isDarkMode ? '#1e293b' : `${currentThemeConfig.primary}30`,
              color: isDarkMode ? '#ffffff' : currentThemeConfig.textColor,
            }}
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Pill Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scroll-hide pb-1">
          {(['all', 'unread', 'groups', 'ai'] as const).map((tab) => {
            const labels = {
              all: 'All',
              unread: 'Unread',
              groups: 'Groups',
              ai: ' ReadyNest AI',
            };
            const isActive = filterTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                style={
                  isActive
                    ? { backgroundColor: currentThemeConfig.primary, color: '#ffffff' }
                    : { backgroundColor: isDarkMode ? '#1e293b' : currentThemeConfig.appBg }
                }
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2">
            <Filter className="w-8 h-8 mx-auto text-slate-400 dark:text-slate-600" />
            <p className="text-xs font-medium">No conversations found</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-600">Try adjusting your filter or start a new group</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isSelected = activeConversationId === conv.id;
            const otherUser = conv.participants.find((p) => p.id !== currentUser?.id);
            const title = conv.isGroup
              ? conv.name
              : conv.isAiChat
              ? 'ReadyNest AI Assistant'
              : otherUser?.name || 'Chat';

            const avatarUrl = conv.isGroup
              ? conv.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
              : conv.isAiChat
              ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
              : otherUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

            const unread = currentUser ? conv.unreadCount[currentUser?.id || ''] || 0 : 0;
            const typingText = typingUsers[conv.id];

            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversation(conv.id)}
                style={
                  isSelected
                    ? {
                        backgroundColor: isDarkMode ? '#1e293b' : currentThemeConfig.lightBg,
                        borderLeftColor: currentThemeConfig.primary,
                      }
                    : undefined
                }
                className={`w-full p-3.5 flex items-center gap-3 transition-colors text-left relative ${
                  isSelected
                    ? 'border-l-4'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                {/* Avatar with Status Badge */}
                <div className="relative flex-shrink-0">
                  <img
                    src={avatarUrl}
                    alt={title}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700/60"
                  />
                  {conv.isAiChat && (
                    <span
                      style={{ backgroundColor: currentThemeConfig.primary }}
                      className="absolute -bottom-1 -right-1 p-1 text-white rounded-full"
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                    </span>
                  )}
                  {!conv.isGroup && !conv.isAiChat && otherUser?.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                  )}
                </div>

                {/* Info & Last Message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      style={isSelected ? { color: isDarkMode ? '#f8fafc' : currentThemeConfig.textColor } : undefined}
                      className={`text-sm truncate font-semibold ${isSelected ? 'font-bold' : 'text-slate-800 dark:text-slate-200'}`}
                    >
                      {title}
                    </h3>
                    {conv.lastMessage && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0 ml-1 font-medium">
                        {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>

                  {/* Message / Typing text */}
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <p className="truncate text-[11px] leading-tight">
                      {typingText ? (
                        <span
                          style={{ color: currentThemeConfig.primary }}
                          className="italic font-semibold animate-pulse"
                        >
                          {typingText} is typing...
                        </span>
                      ) : conv.lastMessage ? (
                        <span>
                          {conv.lastMessage.senderId === currentUser?.id && 'You: '}
                          {conv.lastMessage.content || '[Attachment]'}
                        </span>
                      ) : (
                        <span className="italic text-slate-400 dark:text-slate-600">No messages yet</span>
                      )}
                    </p>

                    {/* Unread count badge */}
                    {unread > 0 && (
                      <span
                        style={{ backgroundColor: currentThemeConfig.primary, color: '#ffffff' }}
                        className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 shadow-sm"
                      >
                        {unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
