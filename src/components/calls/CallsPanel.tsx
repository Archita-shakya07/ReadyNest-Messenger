import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { CallLog, User } from '../../types';
import {
  Phone,
  Video,
  PhoneCall,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  Search,
  Trash2,
  Plus,
  MessageSquare,
  Clock,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const CallsPanel: React.FC = () => {
  const {
    callLogs,
    addCallLog,
    clearCallLogs,
    setActiveCallModal,
    conversations,
    setActiveConversation,
    setViewMode,
    theme,
    isDarkMode,
    currentUser
  } = useStore();

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'missed' | 'voice' | 'video'>('all');
  const [isQuickCallModalOpen, setIsQuickCallModalOpen] = useState(false);

  // Filtered logs
  const filteredLogs = callLogs.filter((log) => {
    const matchesSearch =
      log.user.name.toLowerCase().includes(search.toLowerCase()) ||
      log.user.email.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'missed') return log.direction === 'missed';
    if (filter === 'voice') return log.type === 'voice';
    if (filter === 'video') return log.type === 'video';
    return true;
  });

  // Calculate stats
  const totalCalls = callLogs.length;
  const missedCount = callLogs.filter((c) => c.direction === 'missed').length;
  const voiceCount = callLogs.filter((c) => c.type === 'voice').length;
  const videoCount = callLogs.filter((c) => c.type === 'video').length;

  const handleStartCall = (targetUser: User, type: 'voice' | 'video') => {
    // Add call log entry for outgoing call
    addCallLog({
      user: targetUser,
      type,
      direction: 'outgoing',
      duration: 'In progress...'
    });
    // Trigger video/voice call modal
    setActiveCallModal({ type, user: targetUser });
  };

  const handleOpenChat = (targetUserId: string) => {
    const conv = conversations.find((c) => c.participantIds.includes(targetUserId));
    if (conv) {
      setActiveConversation(conv.id);
      setViewMode('chat');
    } else {
      setViewMode('chat');
    }
  };

  // Extract all unique users from conversations for quick dial list
  const availableContacts = Array.from(
    new Map(
      conversations
        .flatMap((c) => c.participants)
        .filter((p) => p.id !== currentUser?.id)
        .map((p) => [p.id, p])
    ).values()
  );

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#020617' : currentThemeConfig.appBg,
        color: isDarkMode ? '#f8fafc' : currentThemeConfig.textColor
      }}
      className="flex-1 h-full overflow-y-auto p-4 sm:p-8 select-none transition-colors"
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Title Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: `${currentThemeConfig.primary}20`, color: currentThemeConfig.primary }}
                className="p-2 rounded-xl"
              >
                <PhoneCall className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Call Logs & Voice/Video
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              End-to-end encrypted high-definition audio & video calls history
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsQuickCallModalOpen(true)}
              style={{ backgroundColor: currentThemeConfig.primary }}
              className="px-4 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-90 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Call
            </button>

            {callLogs.length > 0 && (
              <button
                onClick={clearCallLogs}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                title="Clear Call History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Call Summary Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Calls</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{totalCalls}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
              <PhoneIncoming className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Voice Calls</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{voiceCount}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Video Calls</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{videoCount}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-500">
              <PhoneMissed className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Missed Calls</p>
              <p className="text-lg font-black text-red-500">{missedCount}</p>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Control */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(['all', 'missed', 'voice', 'video'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                style={
                  filter === tab
                    ? { backgroundColor: currentThemeConfig.primary, color: '#ffffff' }
                    : undefined
                }
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  filter === tab
                    ? 'shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab === 'all' ? 'All Calls' : tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search call logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none text-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Call Logs List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <PhoneMissed className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No call logs found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your recent voice and video call history will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => {
                const isMissed = log.direction === 'missed';
                const isIncoming = log.direction === 'incoming';

                return (
                  <div
                    key={log.id}
                    className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* Left Contact Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative flex-shrink-0">
                        <img
                          src={log.user.avatar}
                          alt={log.user.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                            log.user.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`font-bold text-sm truncate ${
                              isMissed ? 'text-red-500' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {log.user.name}
                          </h3>
                          {log.type === 'video' ? (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md">
                              Video
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
                              Voice
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {isMissed && (
                            <span className="flex items-center gap-1 text-red-500 font-semibold">
                              <PhoneMissed className="w-3.5 h-3.5" />
                              Missed
                            </span>
                          )}
                          {isIncoming && !isMissed && (
                            <span className="flex items-center gap-1 text-emerald-500 font-medium">
                              <PhoneIncoming className="w-3.5 h-3.5" />
                              Incoming
                            </span>
                          )}
                          {!isIncoming && !isMissed && (
                            <span className="flex items-center gap-1 text-blue-500 font-medium">
                              <PhoneOutgoing className="w-3.5 h-3.5" />
                              Outgoing
                            </span>
                          )}

                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {log.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Timestamp & Actions */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">
                        {log.timestamp}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartCall(log.user, 'voice')}
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                          title="Start Voice Call"
                        >
                          <Phone className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleStartCall(log.user, 'video')}
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-purple-500 hover:text-white transition-all shadow-sm"
                          title="Start Video Call"
                        >
                          <Video className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleOpenChat(log.user.id)}
                          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                          title="Message in Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Dial Start Call Modal */}
      {isQuickCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Start Encrypted Call</h2>
              <button
                onClick={() => setIsQuickCallModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a ReadyNest contact to launch an instant HD voice or video call.
            </p>

            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1">
              {availableContacts.length === 0 ? (
                <p className="p-4 text-xs text-center text-slate-400">No active contacts found.</p>
              ) : (
                availableContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {contact.name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">{contact.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setIsQuickCallModalOpen(false);
                          handleStartCall(contact, 'voice');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> Voice
                      </button>
                      <button
                        onClick={() => {
                          setIsQuickCallModalOpen(false);
                          handleStartCall(contact, 'video');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-bold hover:bg-purple-600 transition-colors flex items-center gap-1"
                      >
                        <Video className="w-3 h-3" /> Video
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
