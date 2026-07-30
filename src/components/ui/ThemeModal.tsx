import React from 'react';
import { useStore } from '../../store/useStore';
import { THEMES, ThemeId } from '../../types/theme';
import { Palette, Check, X, Moon, Sun, Sparkles } from 'lucide-react';

export const ThemeModal: React.FC = () => {
  const {
    theme,
    setTheme,
    isThemeModalOpen,
    setThemeModalOpen,
    isDarkMode,
    toggleDarkMode
  } = useStore();

  if (!isThemeModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Choose Chat Theme
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your favorite color palette & appearance
              </p>
            </div>
          </div>
          <button
            onClick={() => setThemeModalOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dark Mode Toggle Bar */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {isDarkMode ? (
              <Moon className="w-4 h-4 text-amber-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {isDarkMode ? 'Dark Mode Active' : 'Light Mode Active'}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Switch between high-contrast dark canvas and clean light theme
              </span>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors"
          >
            Toggle {isDarkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
          {(Object.keys(THEMES) as ThemeId[]).map((key) => {
            const t = THEMES[key];
            const isSelected = theme === key;

            return (
              <div
                key={key}
                onClick={() => setTheme(key)}
                className={`cursor-pointer p-3.5 rounded-2xl border-2 transition-all relative flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Primary Color Circle */}
                    <span
                      className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white/50"
                      style={{ backgroundColor: t.primary }}
                    />
                    <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {t.name}
                    </h3>
                  </div>
                  {isSelected && (
                    <span className="p-1 bg-emerald-500 text-white rounded-full">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  {t.feel}
                </p>

                {/* Color Swatch Preview bar */}
                <div className="flex items-center gap-1.5 pt-1">
                  <div
                    className="flex-1 h-3 rounded-md border border-slate-200/50 shadow-xs"
                    style={{ backgroundColor: t.appBg }}
                    title="App Background"
                  />
                  <div
                    className="flex-1 h-3 rounded-md border border-slate-200/50 shadow-xs"
                    style={{ backgroundColor: t.lightBg }}
                    title="Primary Light"
                  />
                  <div
                    className="flex-1 h-3 rounded-md border border-slate-200/50 shadow-xs"
                    style={{ backgroundColor: t.sentBubble }}
                    title="Sent Message Bubble"
                  />
                  <div
                    className="flex-1 h-3 rounded-md border border-slate-200/50 shadow-xs"
                    style={{ backgroundColor: t.primary }}
                    title="Primary Accent"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setThemeModalOpen(false)}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
          >
            Apply Theme
          </button>
        </div>
      </div>
    </div>
  );
};
