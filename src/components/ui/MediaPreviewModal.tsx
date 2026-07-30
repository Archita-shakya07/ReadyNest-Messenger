import React from 'react';
import { useStore } from '../../store/useStore';
import { X, Download, FileText, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const MediaPreviewModal: React.FC = () => {
  const { previewMedia, setPreviewMedia } = useStore();

  if (!previewMedia) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-slate-900/90 border-b border-slate-800 text-white">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-semibold text-sm truncate max-w-xs sm:max-w-md">{previewMedia.name}</h3>
                <span className="text-xs text-slate-400">{previewMedia.size || 'Attachment'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={previewMedia.url}
                target="_blank"
                rel="noreferrer"
                download
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </a>
              <button
                onClick={() => setPreviewMedia(null)}
                className="p-2 bg-slate-800 hover:bg-rose-600 text-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Media Body */}
          <div className="flex-1 overflow-auto flex items-center justify-center p-6 bg-slate-950">
            {previewMedia.type === 'image' && (
              <img
                src={previewMedia.url}
                alt={previewMedia.name}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            )}

            {previewMedia.type === 'video' && (
              <video
                src={previewMedia.url}
                controls
                autoPlay
                className="max-h-[70vh] max-w-full rounded-lg shadow-lg"
                onError={(e) => {
                  console.warn('Video playback notice: Source format or stream unavailable.');
                }}
              />
            )}

            {previewMedia.type === 'audio' && (
              <div className="w-full max-w-md p-6 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
                <p className="text-white font-medium">{previewMedia.name}</p>
                <audio
                  src={previewMedia.url}
                  controls
                  className="w-full mt-2"
                  onError={(e) => {
                    console.warn('Audio playback notice: Source format or stream unavailable.');
                  }}
                />
              </div>
            )}

            {previewMedia.type === 'document' && (
              <div className="w-full max-w-md p-8 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center gap-4 text-center">
                <FileText className="w-16 h-16 text-emerald-400" />
                <div>
                  <h4 className="text-white font-semibold">{previewMedia.name}</h4>
                  <p className="text-slate-400 text-xs mt-1">Document Attachment</p>
                </div>
                <a
                  href={previewMedia.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Document File
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
