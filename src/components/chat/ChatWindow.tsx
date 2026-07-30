import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';
import { api } from '../../services/api';
import {
  Phone,
  Video,
  Info,
  Sparkles,
  Bot,
  ShieldCheck,
  Search,
  MessageSquare,
  ArrowLeft
} from 'lucide-react';

export const ChatWindow: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    messages,
    currentUser,
    typingUsers,
    isInfoDrawerOpen,
    setInfoDrawerOpen,
    setActiveCallModal,
    theme
  } = useStore();

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;

  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const otherUser = activeConv?.participants.find((p) => p.id !== currentUser?.id);

  const chatTitle = activeConv?.isGroup
    ? activeConv.name
    : activeConv?.isAiChat
    ? 'ReadyNest AI Assistant'
    : otherUser?.name || 'Chat';

  const avatarUrl = activeConv?.isGroup
    ? activeConv.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
    : activeConv?.isAiChat
    ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
    : otherUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  const typingText = activeConversationId ? typingUsers[activeConversationId] : null;

  // Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  const handleSummarize = async () => {
    if (!activeConversationId) return;
    setIsSummarizing(true);
    try {
      const res = await api.summarizeChat(activeConversationId);
      setAiSummary(res.summary);
    } catch (err) {
      console.error('Summary error:', err);
    } finally {
      setIsSummarizing(false);
    }
  };

  if (!activeConv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-950/50">
        <div
          style={{
            backgroundColor: `${currentThemeConfig.primary}15`,
            borderColor: `${currentThemeConfig.primary}30`,
            color: currentThemeConfig.primary,
          }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border shadow-xs"
        >
          <MessageSquare className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Chat Selected</h3>
        <p className="text-xs max-w-sm mt-1 text-slate-500 dark:text-slate-400">
          Select a conversation from the sidebar or start a new group chat to begin messaging with WebSockets!
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-white dark:bg-slate-900 transition-colors">
      {/* Header Bar */}
      <div className="h-14 sm:h-16 px-4 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 flex-shrink-0 select-none">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button to return to Sidebar */}
          <button
            onClick={() => setActiveConversation(null)}
            className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors flex-shrink-0"
            title="Back to Conversations"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative flex-shrink-0">
            <img
              src={avatarUrl}
              alt={chatTitle}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700/60"
            />
            {activeConv.isAiChat && (
              <span
                style={{ backgroundColor: currentThemeConfig.primary }}
                className="absolute -bottom-1 -right-1 p-0.5 text-white rounded-full"
              >
                <Sparkles className="w-2.5 h-2.5" />
              </span>
            )}
            {!activeConv.isGroup && !activeConv.isAiChat && otherUser?.status === 'online' && (
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">{chatTitle}</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate flex items-center gap-1.5 font-medium">
              {typingText ? (
                <span
                  style={{ color: currentThemeConfig.primary }}
                  className="font-semibold italic animate-pulse"
                >
                  {typingText} is typing...
                </span>
              ) : activeConv.isGroup ? (
                <span>{activeConv.participants.length} Members</span>
              ) : activeConv.isAiChat ? (
                <span
                  style={{ color: currentThemeConfig.primary }}
                  className="flex items-center gap-1 font-semibold"
                >
                  <Bot className="w-3 h-3" /> Gemini 3.6 Flash Active
                </span>
              ) : (
                <span className="capitalize">{otherUser?.status || 'Offline'}</span>
              )}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* AI Summarize Chat Button */}
          <button
            onClick={handleSummarize}
            disabled={isSummarizing}
            style={{
              borderColor: `${currentThemeConfig.primary}40`,
              color: currentThemeConfig.primary,
            }}
            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Summarize Chat History with Gemini AI"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isSummarizing ? 'Summarizing...' : 'Summarize'}</span>
          </button>

          {/* Voice & Video Call Controls (Simulated) */}
          {!activeConv.isAiChat && (
            <>
              <button
                onClick={() =>
                  setActiveCallModal({
                    type: 'voice',
                    user: otherUser || currentUser!,
                  })
                }
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Start Voice Call"
              >
                <Phone className="w-4 h-4" />
              </button>

              <button
                onClick={() =>
                  setActiveCallModal({
                    type: 'video',
                    user: otherUser || currentUser!,
                  })
                }
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                title="Start Video Call"
              >
                <Video className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Info Drawer Toggle */}
          <button
            onClick={() => setInfoDrawerOpen(!isInfoDrawerOpen)}
            style={
              isInfoDrawerOpen
                ? { backgroundColor: currentThemeConfig.primary, color: '#ffffff' }
                : undefined
            }
            className={`p-2 rounded-xl transition-colors ${
              isInfoDrawerOpen
                ? 'shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Toggle Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* AI Summary Banner */}
      {aiSummary && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/80 border-b border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200 flex items-start justify-between gap-2 z-10">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900 dark:text-emerald-300">Gemini AI Chat Summary:</p>
              <p className="whitespace-pre-wrap mt-0.5">{aiSummary}</p>
            </div>
          </div>
          <button
            onClick={() => setAiSummary(null)}
            className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-white font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Message History List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.length === 0 ? (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 space-y-2 my-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">End-to-End Encrypted Session</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">
              Send your first message to kick off real-time WebSocket communication!
            </p>
          </div>
        ) : (
          Array.from(new Map(messages.map((m) => [m.id, m])).values()).map((msg) => (
            <MessageItem key={msg.id} message={msg} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Dock */}
      <MessageInput />
    </div>
  );
};
