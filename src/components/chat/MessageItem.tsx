import React, { useState, useRef } from 'react';
import { Message, Attachment } from '../../types';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { playSyntheticVoiceNote } from '../../utils/audio';
import {
  Check,
  CheckCheck,
  Play,
  Pause,
  FileText,
  Sparkles,
  Smile,
  Download,
  Image as ImageIcon
} from 'lucide-react';

interface Props {
  message: Message;
}

export const MessageItem: React.FC<Props> = ({ message }) => {
  const { currentUser, setPreviewMedia, addReaction, theme, isDarkMode } = useStore();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const isMe = message.senderId === currentUser?.id;
  const isAi = message.isAiResponse || message.senderId === 'user-ai';

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;

  const quickEmojis = ['❤️', '👍', '😂', '🔥', '🎉', '😮'];

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = (audioUrl: string) => {
    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);

    if (!audioUrl || audioUrl.startsWith('data:audio/wav;base64,UklGRi')) {
      playSyntheticVoiceNote(() => setIsPlayingAudio(false));
      return;
    }

    try {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => setIsPlayingAudio(false);
      audio.onerror = () => {
        playSyntheticVoiceNote(() => setIsPlayingAudio(false));
      };

      audio.play().catch(() => {
        playSyntheticVoiceNote(() => setIsPlayingAudio(false));
      });
    } catch {
      playSyntheticVoiceNote(() => setIsPlayingAudio(false));
    }
  };

  return (
    <div className={`flex flex-col mb-3.5 ${isMe ? 'items-end' : 'items-start'} group relative`}>
      {/* Sender Header for Received/Group Messages */}
      {!isMe && (
        <div className="flex items-center gap-2 mb-1 px-1">
          <img
            src={message.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={message.senderName}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{message.senderName}</span>
          {isAi && (
            <span className="px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[9px] font-bold rounded-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Gemini AI
            </span>
          )}
        </div>
      )}

      {/* Message Content Bubble */}
      <div
        style={
          isMe
            ? {
                backgroundColor: isDarkMode ? '#064e3b' : currentThemeConfig.sentBubble,
                color: isDarkMode ? '#ecfdf5' : currentThemeConfig.sentBubbleText,
              }
            : isAi
            ? undefined
            : {
                backgroundColor: isDarkMode ? '#1e293b' : currentThemeConfig.receivedBubble,
                color: isDarkMode ? '#f8fafc' : currentThemeConfig.receivedBubbleText,
              }
        }
        className={`relative max-w-[85%] sm:max-w-[70%] p-3.5 text-xs sm:text-sm shadow-sm transition-all border ${
          isMe
            ? 'rounded-2xl rounded-tr-xs border-black/5 dark:border-emerald-800/40'
            : isAi
            ? 'bg-emerald-50/80 dark:bg-emerald-950/50 text-slate-900 dark:text-slate-100 border-emerald-200 dark:border-emerald-800/60 rounded-tl-xs rounded-2xl'
            : 'rounded-2xl rounded-tl-xs border-slate-200/80 dark:border-slate-800'
        }`}
      >
        {/* Attachments Section */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="space-y-2 mb-2">
            {message.attachments.map((att) => (
              <div key={att.id}>
                {att.type === 'image' && (
                  <div
                    onClick={() => setPreviewMedia(att)}
                    className="cursor-pointer overflow-hidden rounded-xl border border-white/10 relative group/img"
                  >
                    <img src={att.url} alt={att.name} className="w-full max-h-60 object-cover rounded-xl hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  </div>
                )}

                {att.type === 'video' && (
                  <div onClick={() => setPreviewMedia(att)} className="cursor-pointer rounded-xl overflow-hidden bg-black/60 p-2 flex items-center gap-3">
                    <Play className="w-8 h-8 text-emerald-400 fill-emerald-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate text-white">{att.name}</p>
                      <p className="text-[10px] text-slate-300">Click to play video</p>
                    </div>
                  </div>
                )}

                {att.type === 'audio' && (
                  <div className="p-2.5 bg-black/20 rounded-xl flex items-center gap-3 border border-white/10">
                    <button
                      onClick={() => toggleAudio(att.url)}
                      className="p-2 rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden mb-1">
                        <div className={`h-full bg-emerald-400 ${isPlayingAudio ? 'w-3/4 animate-pulse' : 'w-0'}`}></div>
                      </div>
                      <p className="text-[10px] opacity-80">{att.name}</p>
                    </div>
                  </div>
                )}

                {att.type === 'document' && (
                  <div onClick={() => setPreviewMedia(att)} className="cursor-pointer p-3 bg-black/20 rounded-xl flex items-center justify-between border border-white/10 hover:bg-black/30 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                      <div className="truncate">
                        <p className="font-semibold text-xs truncate">{att.name}</p>
                        <p className="text-[10px] opacity-75">{att.size || 'Document'}</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-emerald-300 ml-2" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Text Message */}
        {message.content && (
          <p className="whitespace-pre-wrap leading-relaxed font-normal">
            {message.content}
          </p>
        )}

        {/* Timestamp & Ticks Row */}
        <div className="flex items-center justify-end gap-1.5 mt-1 text-[10px] opacity-75">
          <span>
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isMe && (
            <span>
              {message.status === 'seen' ? (
                <CheckCheck className="w-3.5 h-3.5 text-sky-300" title="Message Seen" />
              ) : message.status === 'delivered' ? (
                <CheckCheck className="w-3.5 h-3.5 opacity-80" title="Delivered" />
              ) : (
                <Check className="w-3.5 h-3.5 opacity-80" title="Sent" />
              )}
            </span>
          )}
        </div>

        {/* Quick Reaction Bar Trigger on Hover */}
        <div className="absolute top-0 right-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-slate-900 border border-slate-700 p-1 rounded-full shadow-lg z-10">
          {quickEmojis.map((e) => (
            <button
              key={e}
              onClick={() => addReaction(message.id, e)}
              className="hover:scale-125 transition-transform text-xs px-0.5"
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Message Reactions Display */}
      {message.reactions && message.reactions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {message.reactions.map((r, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] text-slate-300 flex items-center gap-1 shadow-sm"
              title={`Reacted by ${r.userName}`}
            >
              <span>{r.emoji}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
