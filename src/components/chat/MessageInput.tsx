import React, { useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { socketService } from '../../services/socketService';
import { api } from '../../services/api';
import { Attachment } from '../../types';
import { DEFAULT_AUDIO_DATA_URL } from '../../utils/audio';
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Square,
  Image as ImageIcon,
  Video,
  FileText,
  Sparkles,
  X,
  Heart,
  Laugh,
  Dog,
  Pizza,
  Gamepad2
} from 'lucide-react';

export const MessageInput: React.FC = () => {
  const { activeConversationId, currentUser, sendMessage, conversations, theme } = useStore();
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState<'smileys' | 'hearts' | 'animals' | 'food' | 'objects'>('smileys');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<any>(null);

  const activeConv = conversations.find((c) => c.id === activeConversationId);
  const isAiChat = activeConv?.isAiChat;

  const emojiCategories = {
    smileys: ['😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','☺️','😚','😋','😛','😜','🤪','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','😌','😔','😪','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓','🧐','🥺','😮','😯','😲','😳'],
    hearts: ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','👍','👎','👏','🙌','👐','🤲','🤝','🙏','✍️','💪','🔥','🎉','✨','🌟','⭐','⚡','💥','💯'],
    animals: ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🕷️','🐢','🐍','🐬','🐳'],
    food: ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🥑','🥦','🥒','🌶️','🌽','🥕','🥔','🍞','🥐','🥖','🍕','🍔','🍟','🌭','🍿','🥞','🧇','🥓','🥩','🍗','🍦','🍩','🎂'],
    objects: ['⚽','🏀','🏈','⚾','🎾','🏐','🏉','🎱','🏓','🏸','🥊','🥋','🎯','🎮','🎲','🧩','♟️','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎸','🎹','📱','💻','⌨️','🖥️','📷','📸','📹','🎥','💡','🔦','⏰','⏱️']
  };

  const quickAiPrompts = [
    'Draft a project update',
    'Summarize our discussion',
    'Write a polite follow-up',
    'Suggest meeting availability'
  ];

  const typingTimeoutRef = useRef<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setContent(val);

    if (activeConversationId && currentUser) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (val.trim().length > 0) {
        socketService.sendTyping(activeConversationId, currentUser.id, true);
        typingTimeoutRef.current = setTimeout(() => {
          socketService.sendTyping(activeConversationId, currentUser.id, false);
        }, 2000);
      } else {
        socketService.sendTyping(activeConversationId, currentUser.id, false);
      }
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const textToSend = content.trim();
    const attachmentsToSend = [...attachments];

    if (!textToSend && attachmentsToSend.length === 0) return;

    // Instantly clear UI state to eliminate any perception of lag
    setContent('');
    setAttachments([]);
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (activeConversationId && currentUser) {
      socketService.sendTyping(activeConversationId, currentUser.id, false);
    }

    try {
      await sendMessage(textToSend, 'text', attachmentsToSend.length > 0 ? attachmentsToSend : undefined);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUrl = event.target?.result as string;
        const res = await api.uploadMedia({
          fileType: type,
          fileName: file.name,
          fileDataUrl: dataUrl
        });

        if (res.success && res.attachment) {
          setAttachments(prev => [...prev, res.attachment]);
        }
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload failed:', err);
      setIsUploading(false);
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecording) {
      clearInterval(recordingTimerRef.current);
      setIsRecording(false);
      const voiceAttachment: Attachment = {
        id: `att-voice-${Date.now()}`,
        type: 'audio',
        url: DEFAULT_AUDIO_DATA_URL,
        name: `Voice_Note_${recordingSeconds}s.ogg`,
        size: `${(recordingSeconds * 0.1).toFixed(1)} MB`
      };
      setAttachments(prev => [...prev, voiceAttachment]);
      setRecordingSeconds(0);
    } else {
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(s => s + 1);
      }, 1000);
    }
  };

  return (
    <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 relative z-20 select-none transition-colors">
      {/* Quick AI Prompts for ReadyNest AI */}
      {isAiChat && (
        <div className="mb-2.5 flex items-center gap-2 overflow-x-auto scroll-hide pb-1">
          <span
            style={{ color: currentThemeConfig.primary }}
            className="text-[10px] uppercase font-bold flex items-center gap-1 flex-shrink-0"
          >
            <Sparkles className="w-3 h-3" /> Quick Prompts:
          </span>
          {quickAiPrompts.map((p) => (
            <button
              key={p}
              onClick={() => setContent(p)}
              style={{
                backgroundColor: `${currentThemeConfig.primary}15`,
                color: currentThemeConfig.primary,
                borderColor: `${currentThemeConfig.primary}30`,
              }}
              className="px-2.5 py-1 border rounded-full text-[11px] font-semibold whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Upload Previews */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 p-2 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800">
          {attachments.map((att, idx) => (
            <div key={idx} className="relative flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-xs text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700">
              <span className="font-medium truncate max-w-[150px]">{att.name}</span>
              <button
                onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                className="text-slate-400 hover:text-rose-500"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Emoji Picker Popup */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-40 w-72 p-3 space-y-2.5 animate-in fade-in zoom-in duration-150">
          {/* Category Tabs Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setEmojiCategory('smileys')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                emojiCategory === 'smileys'
                  ? 'bg-slate-200 dark:bg-slate-800 text-amber-500 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Smileys"
            >
              <Laugh className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEmojiCategory('hearts')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                emojiCategory === 'hearts'
                  ? 'bg-slate-200 dark:bg-slate-800 text-rose-500 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Hearts & Reactions"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEmojiCategory('animals')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                emojiCategory === 'animals'
                  ? 'bg-slate-200 dark:bg-slate-800 text-emerald-500 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Animals"
            >
              <Dog className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEmojiCategory('food')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                emojiCategory === 'food'
                  ? 'bg-slate-200 dark:bg-slate-800 text-orange-500 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Food"
            >
              <Pizza className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEmojiCategory('objects')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                emojiCategory === 'objects'
                  ? 'bg-slate-200 dark:bg-slate-800 text-sky-500 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Objects"
            >
              <Gamepad2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Emoji Grid */}
          <div className="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto pr-1">
            {emojiCategories[emojiCategory].map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setContent((c) => c + emoji);
                }}
                className="text-xl hover:scale-125 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg p-1 transition-all text-center"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Attachment Options Menu */}
      {showAttachmentMenu && (
        <div className="absolute bottom-16 left-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 rounded-2xl shadow-xl z-30 flex flex-col gap-1.5 w-48">
          <label className="flex items-center gap-2.5 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer text-xs text-slate-800 dark:text-slate-200 font-medium">
            <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'image')}
            />
          </label>

          <label className="flex items-center gap-2.5 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer text-xs text-slate-800 dark:text-slate-200 font-medium">
            <Video className="w-4 h-4 text-sky-500" />
            <span>Upload Video</span>
            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'video')}
            />
          </label>

          <label className="flex items-center gap-2.5 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer text-xs text-slate-800 dark:text-slate-200 font-medium">
            <FileText className="w-4 h-4 text-amber-500" />
            <span>Document / PDF</span>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'document')}
            />
          </label>
        </div>
      )}

      {/* Input Form Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        {/* Attachment Toggle */}
        <button
          type="button"
          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
          style={
            showAttachmentMenu
              ? { backgroundColor: currentThemeConfig.primary, color: '#ffffff' }
              : undefined
          }
          className={`p-2.5 rounded-xl border transition-colors ${
            showAttachmentMenu
              ? 'shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700/60'
          }`}
          title="Attach media or documents"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Emoji Toggle */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl transition-colors hidden sm:block ${
            showEmojiPicker ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-500 dark:text-slate-400 hover:text-amber-500'
          }`}
          title="Add Emoji"
        >
          <Smile className="w-4 h-4" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={content}
            onChange={handleInputChange}
            placeholder={
              isRecording
                ? `Recording voice note... (${recordingSeconds}s)`
                : isAiChat
                ? 'Ask ReadyNest AI Assistant...'
                : 'Type a message...'
            }
            disabled={isRecording}
            className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Voice Note Recording Button */}
        <button
          type="button"
          onClick={toggleVoiceRecording}
          className={`p-2.5 rounded-xl transition-all ${
            isRecording
              ? 'bg-rose-600 text-white animate-pulse shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-500 border border-slate-200 dark:border-slate-700/60'
          }`}
          title={isRecording ? 'Stop Recording' : 'Record Voice Note'}
        >
          {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!content.trim() && attachments.length === 0}
          style={{ backgroundColor: currentThemeConfig.primary }}
          className="px-4 py-2.5 disabled:opacity-40 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm text-xs sm:text-sm hover:opacity-90"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
};
