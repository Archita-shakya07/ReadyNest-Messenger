import React from 'react';
import { useStore } from '../../store/useStore';
import {
  X,
  Shield,
  UserCheck,
  UserX,
  FileText,
  Image as ImageIcon,
  Users,
  Sparkles,
  Mail,
  Clock,
  ExternalLink
} from 'lucide-react';

export const ContactInfoDrawer: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    messages,
    currentUser,
    isInfoDrawerOpen,
    setInfoDrawerOpen,
    setPreviewMedia
  } = useStore();

  if (!isInfoDrawerOpen || !activeConversationId) return null;

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  if (!activeConv) return null;

  const otherUser = activeConv.participants.find((p) => p.id !== currentUser?.id);
  const title = activeConv.isGroup
    ? activeConv.name
    : activeConv.isAiChat
    ? 'ReadyNest AI Assistant'
    : otherUser?.name || 'Contact Info';

  const avatarUrl = activeConv.isGroup
    ? activeConv.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80'
    : activeConv.isAiChat
    ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80'
    : otherUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

  // Filter media attachments from chat history
  const mediaAttachments = messages
    .flatMap((m) => m.attachments || [])
    .filter((a) => a !== undefined);

  return (
    <aside className="bento-card w-full md:w-80 lg:w-88 flex flex-col h-full flex-shrink-0 z-20 select-none overflow-y-auto">
      {/* Header */}
      <div className="p-4 bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Overview Details</h3>
        <button
          onClick={() => setInfoDrawerOpen(false)}
          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Profile Info */}
      <div className="p-6 text-center border-b border-slate-200 dark:border-slate-800 flex flex-col items-center">
        <div className="relative mb-3">
          <img
            src={avatarUrl}
            alt={title}
            className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md"
          />
          {activeConv.isAiChat && (
            <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
        <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          {activeConv.isGroup
            ? activeConv.description || 'Official group channel'
            : activeConv.isAiChat
            ? 'Smart AI Assistant powered by Gemini 3.6 Flash'
            : otherUser?.statusMessage || 'Ready Nest User'}
        </p>

        {!activeConv.isGroup && !activeConv.isAiChat && otherUser && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
            <Mail className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{otherUser.email}</span>
          </div>
        )}
      </div>

      {/* Group Members List (if group) */}
      {activeConv.isGroup && (
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Group Participants ({activeConv.participants.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {activeConv.participants.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-500 truncate capitalize">{p.role}</p>
                  </div>
                </div>
                {p.role === 'admin' && (
                  <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded">
                    ADMIN
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shared Media Gallery */}
      <div className="p-4 flex-1">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Shared Media & Files ({mediaAttachments.length})
        </h4>

        {mediaAttachments.length === 0 ? (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic">No media shared in this chat yet</p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {mediaAttachments.map((att) => (
              <div
                key={att.id}
                onClick={() => setPreviewMedia(att)}
                className="cursor-pointer group relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-colors"
              >
                {att.type === 'image' ? (
                  <img src={att.url} alt={att.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-500 dark:text-slate-400">
                    <FileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-1" />
                    <span className="text-[10px] truncate max-w-full font-medium">{att.name}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
