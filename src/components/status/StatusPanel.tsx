import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { THEMES } from '../../types/theme';
import { UserStatusStory } from '../../types';
import {
  CircleDashed,
  Plus,
  Camera,
  Pencil,
  Image,
  Type,
  X,
  Send,
  Clock,
  ChevronRight
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

  const currentThemeConfig = THEMES[theme] || THEMES.emerald || THEMES.cloud;

  const [selectedStory, setSelectedStory] = useState<UserStatusStory | null>(null);
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
    <div className="flex flex-col md:flex-row h-full w-full bg-white dark:bg-slate-950 overflow-hidden select-none">
      {/* LEFT COLUMN: STATUS SIDEBAR (Width 320px - 360px) */}
      <div className="w-full md:w-80 lg:w-[350px] border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col h-full bg-white dark:bg-slate-950 relative flex-shrink-0">
        <div className="flex-1 overflow-y-auto">
          {/* My Status Header */}
          <div
            onClick={() => {
              setStoryType('image');
              setIsAddModalOpen(true);
            }}
            className="p-4 flex items-center gap-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-colors border-b border-slate-100 dark:border-slate-900"
          >
            <div className="relative">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser?.name}
                className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-800"
              />
              <div className="absolute bottom-0 right-0 p-0.5 bg-emerald-600 text-white rounded-full border-2 border-white dark:border-slate-950 shadow-xs">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                My Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {myStories.length > 0
                  ? `${myStories.length} active status update${myStories.length > 1 ? 's' : ''}`
                  : 'Tap to add status update'}
              </p>
            </div>
          </div>

          {/* Section: RECENT UPDATES */}
          <div>
            <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-900/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-900/50">
              RECENT UPDATES
            </div>

            {unseenStories.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 italic">
                No recent updates
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-900/60">
                {unseenStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => {
                      setSelectedStory(story);
                      setActiveStoryModal(story);
                    }}
                    className="p-3.5 flex items-center gap-3.5 hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-300">
                      <img
                        src={story.userAvatar}
                        alt={story.userName}
                        className="w-11 h-11 rounded-full object-cover border-2 border-white dark:border-slate-950"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {story.userName}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {story.updatedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: VIEWED UPDATES */}
          <div>
            <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-900/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-900/50">
              VIEWED UPDATES
            </div>

            {viewedStories.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500 italic">
                No viewed updates
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-900/60">
                {viewedStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => {
                      setSelectedStory(story);
                      setActiveStoryModal(story);
                    }}
                    className="p-3.5 flex items-center gap-3.5 opacity-80 hover:opacity-100 hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-colors"
                  >
                    <img
                      src={story.userAvatar}
                      alt={story.userName}
                      className="w-11 h-11 rounded-full object-cover border-2 border-slate-300 dark:border-slate-700"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {story.userName}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {story.updatedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Action Buttons Docked at Bottom Right of Left Sidebar */}
        <div className="absolute bottom-5 right-5 flex flex-col gap-3 z-10">
          <button
            onClick={() => {
              setStoryType('text');
              setIsAddModalOpen(true);
            }}
            className="w-10 h-10 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-full flex items-center justify-center shadow-md transition-all cursor-pointer"
            title="Add text status"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setStoryType('image');
              setIsAddModalOpen(true);
            }}
            className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer"
            title="Add photo status"
          >
            <Camera className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* RIGHT MAIN DETAIL PANE */}
      <div className="flex-1 h-full bg-slate-200/40 dark:bg-slate-900/60 flex flex-col items-center justify-center p-6 text-center select-none">
        {selectedStory ? (
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 text-left">
              <img
                src={selectedStory.userAvatar}
                alt={selectedStory.userName}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
              />
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {selectedStory.userName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Updated {selectedStory.updatedAt}
                </p>
              </div>
            </div>

            {selectedStory.stories.length > 0 && (
              <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white p-4 h-64 flex flex-col justify-end">
                {selectedStory.stories[0].mediaUrl ? (
                  <img
                    src={selectedStory.stories[0].mediaUrl}
                    alt="Story media"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                ) : (
                  <div className={`absolute inset-0 bg-gradient-to-br ${selectedStory.stories[0].bgGradient || 'from-emerald-600 to-slate-900'}`} />
                )}
                {selectedStory.stories[0].caption && (
                  <p className="relative z-10 text-sm font-bold text-white bg-black/40 backdrop-blur-xs p-3 rounded-xl text-center">
                    {selectedStory.stories[0].caption}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => setActiveStoryModal(selectedStory)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              View Full Story
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-slate-300/60 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-xs mb-4">
              <CircleDashed className="w-10 h-10 text-slate-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Status Updates
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-2 leading-relaxed">
              Select a contact on the left to view their recent status updates. Updates disappear after 24 hours.
            </p>
          </div>
        )}
      </div>

      {/* Add New Status Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create Status Update</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-sm cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Type selector */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setStoryType('text')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  storyType === 'text'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500'
                }`}
              >
                <Type className="w-3.5 h-3.5" /> Text Story
              </button>
              <button
                onClick={() => setStoryType('image')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} border-2 transition-transform cursor-pointer ${
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
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl(
                        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Sample Workspace
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrl(
                        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
                      )
                    }
                    className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Sample Team
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
                    placeholder="Add a caption..."
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleCreateStatus}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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