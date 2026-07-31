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
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  MessageSquare,
  Clock,
  Trash2,
  X
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

  const currentThemeConfig = THEMES[theme] || THEMES.emerald || THEMES.cloud;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'missed'>('all');
  const [selectedCallLog, setSelectedCallLog] = useState<CallLog | null>(null);
  const [isNewCallModalOpen, setIsNewCallModalOpen] = useState(false);

  // Filtered logs
  const filteredLogs = callLogs.filter((log) => {
    const matchesSearch =
      log.user.name.toLowerCase().includes(search.toLowerCase()) ||
      log.user.email.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === 'missed') return log.direction === 'missed';
    return true;
  });

  const handleStartCall = (targetUser: User, type: 'voice' | 'video') => {
    addCallLog({
      user: targetUser,
      type,
      direction: 'outgoing',
      duration: 'In progress...'
    });
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

  // Contacts list from existing conversations
  const availableContacts = Array.from(
    new Map(
      conversations
        .flatMap((c) => c.participants)
        .filter((p) => p.id !== currentUser?.id)
        .map((p) => [p.id, p])
    ).values()
  );

  return (
    <div className="flex flex-col md:flex-row h-full w-full bg-white dark:bg-slate-950 overflow-hidden select-none">
      {/* LEFT COLUMN: CALLS LIST (Width 320px - 360px) */}
      <div className="w-full md:w-80 lg:w-[350px] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col h-full bg-white dark:bg-slate-950 flex-shrink-0">
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-900">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Calls
          </h1>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsNewCallModalOpen(true)}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
              title="New Call"
            >
              <Plus className="w-5 h-5" />
            </button>
            {callLogs.length > 0 && (
              <button
                onClick={clearCallLogs}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-full transition-colors cursor-pointer"
                title="Clear Call History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pt-3 pb-2">
          <div className="relative flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl px-3 py-2 text-xs">
            <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search calls"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-xs w-full outline-none text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Segmented Control Pills: All | Missed */}
        <div className="px-4 pb-3">
          <div className="flex p-1 bg-slate-100/90 dark:bg-slate-900 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('missed')}
              className={`flex-1 py-1.5 rounded-lg text-center font-bold transition-all cursor-pointer ${
                filter === 'missed'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Missed
            </button>
          </div>
        </div>

        {/* Call Logs List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-900/60">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs">
              No call logs
            </div>
          ) : (
            filteredLogs.map((log) => {
              const isSelected = selectedCallLog?.id === log.id;
              const isMissed = log.direction === 'missed';
              const isVideo = log.type === 'video';

              return (
                <div
                  key={log.id}
                  onClick={() => setSelectedCallLog(log)}
                  className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-slate-900 border-l-4 border-emerald-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative flex-shrink-0">
                      <img
                        src={log.user.avatar}
                        alt={log.user.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                      />
                      {log.user.status === 'online' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {log.user.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs mt-0.5">
                        {isMissed ? (
                          <>
                            <ArrowDownLeft className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                            <span className="text-rose-500 font-medium truncate">
                              Missed {isVideo ? 'Video' : 'Voice'} Call
                            </span>
                          </>
                        ) : log.direction === 'incoming' ? (
                          <>
                            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="text-slate-500 dark:text-slate-400 truncate">
                              Incoming {isVideo ? 'Video' : 'Voice'} Call
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            <span className="text-slate-500 dark:text-slate-400 truncate">
                              Outgoing ({log.duration})
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400 flex-shrink-0 ml-2">
                    {log.timestamp}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT MAIN DETAIL PANE */}
      <div className="flex-1 h-full bg-slate-50/50 dark:bg-slate-950/40 flex flex-col items-center justify-center p-6 text-center select-none">
        {selectedCallLog ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm w-full space-y-5 shadow-lg animate-in fade-in zoom-in duration-200">
            <div className="relative inline-block">
              <img
                src={selectedCallLog.user.avatar}
                alt={selectedCallLog.user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 mx-auto shadow-md"
              />
              <span
                className={`absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 ${
                  selectedCallLog.user.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedCallLog.user.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {selectedCallLog.user.email}
              </p>
            </div>

            <div className="py-3 px-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Type</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {selectedCallLog.type} Call
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Direction</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                  {selectedCallLog.direction}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedCallLog.duration}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedCallLog.timestamp}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleStartCall(selectedCallLog.user, 'voice')}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Voice
              </button>
              <button
                onClick={() => handleStartCall(selectedCallLog.user, 'video')}
                className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Video className="w-4 h-4" /> Video
              </button>
              <button
                onClick={() => handleOpenChat(selectedCallLog.user.id)}
                className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                title="Open Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-slate-200/70 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500 shadow-xs mb-4">
              <PhoneIncoming className="w-9 h-9" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Select a call
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mt-1.5 leading-relaxed">
              View call durations, history, and contact information here.
            </p>
          </div>
        )}
      </div>

      {/* New Call Dialog Modal */}
      {isNewCallModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Start New Call</h2>
              <button
                onClick={() => setIsNewCallModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

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
                          setIsNewCallModalOpen(false);
                          handleStartCall(contact, 'voice');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3 h-3" /> Voice
                      </button>
                      <button
                        onClick={() => {
                          setIsNewCallModalOpen(false);
                          handleStartCall(contact, 'video');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors flex items-center gap-1 cursor-pointer"
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
