import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { UserStatusStory } from '../../types';
import { X, Play, Pause, ChevronLeft, ChevronRight, Send, Heart, Sparkles } from 'lucide-react';

export const StoryViewerModal: React.FC = () => {
  const {
    activeStoryModal,
    setActiveStoryModal,
    markStorySeen,
    conversations,
    setActiveConversation,
    setViewMode,
    sendMessage,
    currentUser
  } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (activeStoryModal) {
      markStorySeen(activeStoryModal.userId);
    }
  }, [activeStoryModal?.userId]);

  // Reset index & progress when modal story changes
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [activeStoryModal?.userId]);

  const currentStories = activeStoryModal?.stories || [];
  const activeStory = currentStories[currentIndex] || currentStories[0];

  const handleNext = () => {
    if (!activeStoryModal) return;
    if (currentIndex < currentStories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      setActiveStoryModal(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  // Timer interval for story progress bar
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeStoryModal && isPlaying) {
      const interval = 50; // update progress every 50ms
      const duration = 5000; // 5s per story
      const step = (interval / duration) * 100;

      timer = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 100 : prev + step));
      }, interval);
    }

    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, activeStoryModal?.id]);

  // Handle when progress reaches 100
  useEffect(() => {
    if (progress >= 100) {
      if (currentIndex < currentStories.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setProgress(0);
      } else {
        setActiveStoryModal(null);
      }
    }
  }, [progress, currentIndex, currentStories.length, setActiveStoryModal]);

  if (!activeStoryModal) return null;

  const handleSendReply = async () => {
    if (!replyText.trim() || !currentUser || !activeStoryModal) return;

    // Find or open conversation with story author
    const targetUserId = activeStoryModal.userId;
    let conv = conversations.find((c) => c.participantIds.includes(targetUserId));

    if (conv) {
      await setActiveConversation(conv.id);
      await sendMessage(`[Replied to Status story]: "${replyText.trim()}"`);
    }

    setReplyText('');
    setActiveStoryModal(null);
    setViewMode('chat');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none">
      <div className="relative w-full max-w-sm sm:max-w-md h-[85vh] max-h-[700px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-slate-800">
        {/* Top Story Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {currentStories.map((_, idx) => (
            <div
              key={idx}
              className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm"
            >
              <div
                className="h-full bg-white transition-all duration-75 ease-linear"
                style={{
                  width:
                    idx < currentIndex
                      ? '100%'
                      : idx === currentIndex
                      ? `${progress}%`
                      : '0%'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Header Controls */}
        <div className="absolute top-6 left-4 right-4 z-30 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-2.5">
            <img
              src={activeStoryModal.userAvatar}
              alt={activeStoryModal.userName}
              className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-sm"
            />
            <div>
              <h3 className="font-bold text-sm leading-tight text-white">{activeStoryModal.userName}</h3>
              <p className="text-[10px] text-slate-300 font-medium">{activeStory?.createdAt || activeStoryModal.updatedAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setActiveStoryModal(null)}
              className="p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Story Content Stage */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {activeStory?.type === 'image' && activeStory.mediaUrl ? (
            <div className="w-full h-full relative">
              <img
                src={activeStory.mediaUrl}
                alt="Status media"
                className="w-full h-full object-cover"
              />
              {activeStory.caption && (
                <div className="absolute bottom-16 left-4 right-4 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-sm font-medium text-center shadow-lg">
                  {activeStory.caption}
                </div>
              )}
            </div>
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${
                activeStory?.bgGradient || 'from-emerald-600 via-teal-700 to-slate-900'
              } p-8 flex flex-col items-center justify-center text-center text-white`}
            >
              <p className="text-xl sm:text-2xl font-black tracking-tight leading-relaxed max-w-xs drop-shadow-md">
                {activeStory?.caption || 'New ReadyNest Update!'}
              </p>
            </div>
          )}

          {/* Left / Right Nav Taps */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 hover:bg-black/50 text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Reply Control */}
        <div className="p-3 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 flex items-center gap-2 z-30">
          <input
            type="text"
            placeholder={`Reply to ${activeStoryModal.userName}...`}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
            className="flex-1 px-4 py-2 text-xs bg-slate-900 text-white placeholder-slate-400 rounded-full border border-slate-700 focus:border-emerald-500 focus:outline-none"
          />
          <button
            onClick={handleSendReply}
            disabled={!replyText.trim()}
            className="p-2.5 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
