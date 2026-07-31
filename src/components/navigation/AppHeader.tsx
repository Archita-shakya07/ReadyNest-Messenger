import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { ReadyNestLogo } from '../common/ReadyNestLogo';
import {
  MessageSquare,
  PhoneCall,
  CircleDashed,
  Users,
  Bell,
  Settings,
  X,
  CheckCircle2,
  Info,
  ShieldCheck,
  User
} from 'lucide-react';

export const AppHeader: React.FC = () => {
  const {
    currentUser,
    viewMode,
    setViewMode,
    theme,
    logout,
    setAuthModalOpen,
    setNewGroupModalOpen
  } = useStore();

  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([
    {
      id: '1',
      title: 'Welcome to ReadyNest v2.5',
      desc: 'Real-time WebSockets & Gemini AI Assistant are operational!',
      time: 'Just now',
      read: false,
      type: 'success'
    },
    {
      id: '2',
      title: 'Security Session Active',
      desc: 'JWT Authentication verified. Your account is protected.',
      time: '10m ago',
      read: false,
      type: 'shield'
    },
    {
      id: '3',
      title: 'Core Logs Statement Updated',
      desc: 'Real-time system statement and connection logs synced.',
      time: '1h ago',
      read: false,
      type: 'info'
    }
  ]);

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;
  const unreadCount = unreadNotifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setUnreadNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setUnreadNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <header className="h-14 px-4 sm:px-6 flex items-center justify-between z-30 select-none flex-shrink-0 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      {/* App Logo & Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setViewMode('chat')}
          className="hover:opacity-90 transition-opacity focus:outline-none flex items-center gap-2"
        >
          <ReadyNestLogo size={32} showText={true} />
        </button>
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Online
        </span>
      </div>
      {/* Right Actions & Working Notifications & User Profile */}
      <div className="flex items-center gap-2 relative">
        {/* Create Group Quick Button */}
        <button
          onClick={() => setNewGroupModalOpen(true)}
          style={{
            borderColor: `${currentThemeConfig.primary}40`,
            color: currentThemeConfig.primary,
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border rounded-xl text-xs font-bold transition-all"
        >
          <Users className="w-3.5 h-3.5" />
          <span>New Group</span>
        </button>

        {/* Working Notification Bell Icon */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span
                style={{ backgroundColor: currentThemeConfig.primary }}
                className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900 animate-ping"
              />
            )}
            {unreadCount > 0 && (
              <span
                style={{ backgroundColor: currentThemeConfig.primary }}
                className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-900"
              />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-left">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-xs text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {unreadNotifications.length === 0 ? (
                  <div className="p-6 text-center text-slate-400 text-xs">
                    No notifications at this time
                  </div>
                ) : (
                  unreadNotifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 flex items-start gap-3 transition-colors ${
                        !item.read
                          ? 'bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                        {item.type === 'shield' ? (
                          <ShieldCheck className="w-4 h-4" />
                        ) : item.type === 'info' ? (
                          <Info className="w-4 h-4" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">{item.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {item.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => clearNotification(item.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded"
                        title="Dismiss"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current User Pill & Profile Navigation */}
        {currentUser ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode('settings')}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 p-1 pl-2 pr-2.5 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-colors"
              title="Open Profile & Settings"
            >
              <div className="relative">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[120px]">
                  {currentUser.name}
                </p>
              </div>
              <User className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* Logout button to return to Landing Page */}
            <button
              onClick={() => logout()}
              className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Log Out & View Landing Page"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => useStore.getState().setAuthPageMode('signin')}
            style={{ backgroundColor: currentThemeConfig.primary }}
            className="px-3.5 py-1.5 text-white rounded-xl text-xs font-bold transition-colors shadow-sm hover:opacity-90"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

