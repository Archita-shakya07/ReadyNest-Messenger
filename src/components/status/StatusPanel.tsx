import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { UserStatusStory } from '../../types';
import {
  CircleDashed,
  Plus,
  Image,
  Type,
  Sparkles,
  Lock,
  Clock,
  Eye,
  Send,
  X,
  Palette
} from 'lucide-react';

const GRADIENTS = [
  'from-emerald-600 via-teal-700 to-slate-900',
  'from-purple-600 via-indigo-700 to-slate-950',
  'from-blue-600 via-cyan-700 to-slate-900',
  'from-rose-600 via-pink-700 to-slate-950',
  'from-amber-600 via-orange-700 to-slate-900'
];

export const StatusPanel: React.FC = () => {
  const {
    statusStories,
    myStories,
    addMyStory,
    setActiveStoryModal,
    currentUser,
    theme,
    isDarkMode
  } = useStore();

  const currentThemeConfig = THEMES[theme] || THEMES.cloud;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [storyType, setStoryType] = useState<'text' | 'image'>('text');
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0]);

  const handleCreateStatus = () => {
    if (!caption.trim() && storyType === 'text') return;
    if (!imageUrl.trim() && storyType === 'image') return;

    addMyStory({
      type: storyType,
      caption: caption.trim(),
      mediaUrl: storyType === 'image' ? imageUrl.trim() : undefined,
      bgGradient: storyType === 'text' ? selectedGradient : undefined
    });

    setCaption('');
    setImageUrl('');
    setIsAddModalOpen(false);
  };

  const unseenStories = statusStories.filter((s) => s.hasUnseen);
  const viewedStories = statusStories.filter((s) => !s.hasUnseen);

  return (
    <div
      style={{
        backgroundColor: isDarkMode ? '#020617' : currentThemeConfig.appBg,
        color: isDarkMode ? '#f8fafc' : currentThemeConfig.textColor
      }}
      className="flex-1 h-full overflow-y-auto p-4 sm:p-8 select-none transition-colors"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div
                style={{ backgroundColor: `${currentThemeConfig.primary}20`, color: currentThemeConfig.primary }}
                className="p-2 rounded-xl"
              >
                <CircleDashed className="w-6 h-6 animate-spin-slow" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Status & Updates
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Share photos, text stories & encrypted status updates that expire in 24 hours
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{ backgroundColor: currentThemeConfig.primary }}
            className="px-4 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Status Update
          </button>
        </div>

        {/* My Status Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              onClick={() => setIsAddModalOpen(true)}
              className="relative cursor-pointer group"
            >
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser?.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 p-0.5 group-hover:scale-105 transition-transform"
              />
              <div
                style={{ backgroundColor: currentThemeConfig.primary }}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full text-white flex items-center justify-center border-2 border-white dark:border-slate-900 text-xs shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">My Status</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {myStories.length > 0
                  ? `${myStories.length} active updates posted`
                  : 'Tap to add status update'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Type className="w-3.5 h-3.5" /> Text Story
            </button>
            <button
              onClick={() => {
                setStoryType('image');
                setIsAddModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Image className="w-3.5 h-3.5" /> Photo
            </button>
          </div>
        </div>

        {/* Unseen / Recent Updates Section */}
        {unseenStories.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recent Updates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {unseenStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStoryModal(story)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 shadow-sm hover:shadow-md cursor-pointer transition-all flex items-center gap-3.5 group"
                >
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300 animate-pulse">
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      className="w-12 h-12 rounded-full object-cover border border-white dark:border-slate-900"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors">
                      {story.userName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {story.updatedAt}
                    </p>
                  </div>

                  <span className="px-2.5 py-1 text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-full">
                    {story.stories.length} new
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viewed Updates Section */}
        {viewedStories.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Viewed Updates
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {viewedStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => setActiveStoryModal(story)}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm cursor-pointer transition-all flex items-center gap-3.5 group"
                >
                  <img
                    src={story.userAvatar}
                    alt={story.userName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-300 dark:border-slate-700 p-0.5"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {story.userName}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {story.updatedAt}
                    </p>
                  </div>

                  <span className="text-xs text-slate-400 font-medium">Viewed</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security / Privacy notice */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-3 text-xs text-emerald-700 dark:text-emerald-400">
          <Lock className="w-4 h-4 flex-shrink-0 text-emerald-500" />
          <p>Your status updates are end-to-end encrypted and shared only with your ReadyNest contacts.</p>
        </div>
      </div>

      {/* Add New Status Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Create Status Update</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Type selector */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setStoryType('text')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  storyType === 'text'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Type className="w-3.5 h-3.5" /> Text Story
              </button>
              <button
                onClick={() => setStoryType('image')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  storyType === 'image'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Image className="w-3.5 h-3.5" /> Photo Story
              </button>
            </div>

            {/* Content inputs */}
            {storyType === 'text' ? (
              <div className="space-y-4">
                <div
                  className={`w-full h-44 rounded-2xl bg-gradient-to-br ${selectedGradient} p-6 flex items-center justify-center text-center text-white shadow-inner`}
                >
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Type a status update..."
                    maxLength={150}
                    className="w-full bg-transparent text-center font-bold text-lg placeholder-white/70 text-white focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
                    Choose Canvas Theme
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {GRADIENTS.map((grad, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedGradient(grad)}
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} border-2 transition-transform ${
                          selectedGradient === grad ? 'scale-110 border-white' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Photo URL
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Paste an image URL or pick sample below
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl(
                        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-700 dark:text-slate-300"
                  >
                    Sample Coding
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl(
                        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-700 dark:text-slate-300"
                  >
                    Sample Workspace
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Add a caption to your photo..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleCreateStatus}
              style={{ backgroundColor: currentThemeConfig.primary }}
              className="w-full py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Post Status Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
