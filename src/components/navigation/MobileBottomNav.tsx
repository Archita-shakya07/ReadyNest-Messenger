import React from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { MessageSquare, PhoneCall, CircleDashed, Shield, Settings } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    conversations,
    currentUser,
    activeConversationId,
    theme,
    isDarkMode
  } = useStore();

  // Chat mein active conversation ho toh nav chhupao
  if (viewMode === 'chat' && activeConversationId) return null;

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;

  const totalUnread = conversations.reduce((acc, conv) => {
    return acc + (currentUser ? conv.unreadCount[currentUser.id] || 0 : 0);
  }, 0);

  const tabs = [
    { id: 'chat', label: 'Chats', icon: MessageSquare, badge: totalUnread },
    { id: 'status', label: 'Status', icon: CircleDashed, badge: 0 },
    { id: 'calls', label: 'Calls', icon: PhoneCall, badge: 0 },
    { id: 'admin', label: 'Admin', icon: Shield, badge: 0, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings, badge: 0 },
  ] as const;

  // Admin tab sirf admin users ko dikhao
  const visibleTabs = tabs.filter(tab => !('adminOnly' in tab && tab.adminOnly) || currentUser?.role === 'admin');

  return (
    <nav
      style={{
        backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
        borderColor: isDarkMode ? '#1e293b' : '#e2e8f0',
      }}
      className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around h-16 border-t z-50 px-1 shadow-lg"
    >
      {visibleTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = viewMode === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setViewMode(tab.id as any)}
            className="flex flex-col items-center justify-center flex-1 py-1 gap-0.5 relative min-w-0"
          >
            <div
              style={isActive ? { color: currentThemeConfig.primary } : undefined}
              className={`relative p-1.5 rounded-xl transition-all ${isActive ? '' : 'text-slate-400 dark:text-slate-500'}`}
            >
              {isActive && (
                <div
                  style={{ backgroundColor: `${currentThemeConfig.primary}15` }}
                  className="absolute inset-0 rounded-xl"
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'scale-110' : ''} transition-transform`} />
              {tab.badge > 0 && (
                <span
                  style={{ backgroundColor: currentThemeConfig.primary }}
                  className="absolute -top-0.5 -right-0.5 text-[9px] font-black text-white w-4 h-4 rounded-full flex items-center justify-center shadow-sm z-20"
                >
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}
            </div>
            <span
              style={isActive ? { color: currentThemeConfig.primary } : undefined}
              className={`text-[10px] font-medium leading-none ${isActive ? 'font-bold' : 'text-slate-400 dark:text-slate-500'}`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};