import React from 'react';
import { useStore } from '../../store/useStore';
import { Megaphone, X, AlertTriangle, Info, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SystemBroadcastBanner: React.FC = () => {
  const { activeBroadcastBanner, dismissBroadcastBanner } = useStore();

  if (!activeBroadcastBanner) return null;

  const bgColors = {
    info: 'bg-emerald-600 text-white dark:bg-emerald-700',
    warning: 'bg-amber-600 text-white dark:bg-amber-700',
    urgent: 'bg-rose-600 text-white dark:bg-rose-700',
  };

  const icons = {
    info: <Info className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    urgent: <BellRing className="w-5 h-5 flex-shrink-0 animate-bounce" />,
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`w-full px-4 py-2.5 shadow-md flex items-center justify-between z-50 text-sm font-medium ${
          bgColors[activeBroadcastBanner.type] || bgColors.info
        }`}
      >
        <div className="flex items-center gap-3 max-w-5xl mx-auto flex-1">
          <div className="p-1 bg-white/20 rounded-full">
            <Megaphone className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 flex-1">
            <span className="font-bold underline tracking-wide">
              {activeBroadcastBanner.title}
            </span>
            <span className="opacity-95 text-xs sm:text-sm">
              {activeBroadcastBanner.content}
            </span>
          </div>
          <span className="text-[10px] opacity-75 hidden md:inline">
            By {activeBroadcastBanner.createdByName} •{' '}
            {new Date(activeBroadcastBanner.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        <button
          onClick={dismissBroadcastBanner}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors ml-2"
          title="Dismiss notice"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
